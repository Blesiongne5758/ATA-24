import winston from 'winston';
import path from 'path';
import config from '../config';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  
  if (stack) {
    msg += `\n${stack}`;
  }
  
  return msg;
});

// Create logger instance
export const logger = winston.createLogger({
  level: config.logging.level,
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    // Console transport
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
      ),
    }),
    // File transport for all logs
    new winston.transports.File({
      filename: path.join(config.logging.dir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(config.logging.dir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// Audit logger for security events
export const auditLogger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    printf(({ level, message, timestamp, ...metadata }) => {
      return `${timestamp} [AUDIT] [${level.toUpperCase()}]: ${message} ${
        Object.keys(metadata).length > 0 ? JSON.stringify(metadata) : ''
      }`;
    })
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(config.logging.dir, 'audit.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 10,
    }),
    new winston.transports.Console({
      format: combine(
        colorize(),
        printf(({ level, message, timestamp, ...metadata }) => {
          return `${timestamp} [AUDIT] [${level}]: ${message} ${
            Object.keys(metadata).length > 0 ? JSON.stringify(metadata) : ''
          }`;
        })
      ),
    }),
  ],
});

// Trading logger for trading activities
export const tradingLogger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    printf(({ level, message, timestamp, ...metadata }) => {
      return `${timestamp} [TRADING] [${level.toUpperCase()}]: ${message} ${
        Object.keys(metadata).length > 0 ? JSON.stringify(metadata) : ''
      }`;
    })
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(config.logging.dir, 'trading.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 10,
    }),
  ],
});

export default logger;
