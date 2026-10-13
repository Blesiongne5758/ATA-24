import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import config from '../config';
import { authService } from '../utils/auth';
import { auditLogger } from '../utils/logger';

/**
 * Security middleware configuration
 */

// Helmet - Security headers
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:"],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// CORS - Cross-origin resource sharing
export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    const allowedOrigins = config.cors.origin;
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: config.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400, // 24 hours
});

// Rate limiting
export const rateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs, // 15 minutes
  max: config.rateLimit.maxRequests, // 100 requests per window
  message: {
    error: 'Too many requests',
    message: 'Please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    auditLogger.warn('Rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      method: req.method,
    });
    res.status(429).json({
      error: 'Too many requests',
      message: 'Please try again later',
    });
  },
});

// Stricter rate limiter for auth endpoints
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: {
    error: 'Too many authentication attempts',
    message: 'Please try again later',
  },
});

// API key rate limiter
export const apiKeyRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000, // 1000 requests per hour
});

/**
 * Authentication middleware
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      auditLogger.warn('Missing or invalid authorization header', {
        ip: req.ip,
        path: req.path,
      });
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid authorization header',
      });
    }

    const token = authHeader.substring(7);
    const payload = authService.verifyAccessToken(token);

    // Attach user to request
    (req as any).user = payload;

    auditLogger.info('Authentication successful', {
      userId: payload.userId,
      path: req.path,
    });

    next();
  } catch (error) {
    auditLogger.warn('Authentication failed', {
      ip: req.ip,
      path: req.path,
      error: (error as Error).message,
    });
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token',
    });
  }
};

/**
 * API key authentication middleware
 */
export const authenticateAPIKey = (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing API key',
      });
    }

    if (!authService.validateAPIKeyFormat(apiKey)) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid API key format',
      });
    }

    // TODO: Validate API key against database
    // For now, just check format
    (req as any).apiKey = apiKey;

    next();
  } catch (error) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid API key',
    });
  }
};

/**
 * Role-based authorization middleware
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    if (!roles.includes(user.role)) {
      auditLogger.warn('Authorization failed - insufficient role', {
        userId: user.userId,
        requiredRoles: roles,
        userRole: user.role,
        path: req.path,
      });
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions',
      });
    }

    next();
  };
};

/**
 * Request validation middleware
 */
export const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail: any) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      auditLogger.warn('Validation failed', {
        path: req.path,
        errors,
      });

      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
      });
    }

    next();
  };
};

/**
 * Error handling middleware
 */
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  auditLogger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  // Don't leak error details in production
  const message = config.env === 'production'
    ? 'Internal server error'
    : err.message;

  res.status(500).json({
    error: 'Internal server error',
    message,
  });
};

/**
 * 404 handler
 */
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`,
  });
};
