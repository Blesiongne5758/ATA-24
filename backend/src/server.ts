import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import config from './config';
import { initDatabase } from './database/models';
import {
  helmetMiddleware,
  corsMiddleware,
  rateLimiter,
  errorHandler,
  notFoundHandler,
} from './middleware/security';
import authRoutes from './routes/auth';
import apiKeyRoutes from './routes/apiKeys';
import { logger, auditLogger } from './utils/logger';

// Create Express app
const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: config.cors.origin,
    credentials: true,
  },
});

// Middleware
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(rateLimiter);

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP request', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    });
  });
  
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    environment: config.env,
  });
});

// API routes
app.use(`/api/${config.apiVersion}/auth`, authRoutes);
app.use(`/api/${config.apiVersion}/keys`, apiKeyRoutes);

// WebSocket connection handling
io.on('connection', (socket) => {
  auditLogger.info('WebSocket connected', { socketId: socket.id });

  socket.on('authenticate', (token) => {
    // TODO: Validate JWT token
    socket.join('authenticated');
    auditLogger.info('WebSocket authenticated', { socketId: socket.id });
  });

  socket.on('subscribe', (channel) => {
    socket.join(channel);
    auditLogger.info('WebSocket subscribed', { socketId: socket.id, channel });
  });

  socket.on('disconnect', () => {
    auditLogger.info('WebSocket disconnected', { socketId: socket.id });
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Initialize database
    await initDatabase();
    logger.info('Database initialized successfully');

    // Start server
    server.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
      logger.info(`Environment: ${config.env}`);
      logger.info(`API Version: ${config.apiVersion}`);
      auditLogger.info('Server started', { port: config.port, env: config.env });
    });
  } catch (error) {
    logger.error('Failed to start server', { error: (error as Error).message });
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  auditLogger.info('Server shutting down', { signal: 'SIGTERM' });
  
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  auditLogger.info('Server shutting down', { signal: 'SIGINT' });
  
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

// Start the server
startServer();

export { app, server, io };
