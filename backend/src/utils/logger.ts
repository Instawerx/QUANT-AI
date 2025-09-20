import winston from 'winston';
import { config } from './config';

// Create Winston logger
const logger = winston.createLogger({
  level: config.logging.level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'quantai-backend',
    environment: config.server.nodeEnv,
  },
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          return `${timestamp} [${level}]: ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
          }`;
        })
      ),
    }),
  ],
});

// Add file transport in production
if (config.server.nodeEnv === 'production') {
  logger.add(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    })
  );
  logger.add(
    new winston.transports.File({
      filename: 'logs/combined.log',
    })
  );
}

// Custom log methods for specific use cases
export const log = {
  // Standard logging levels
  error: (message: string, meta?: any) => logger.error(message, meta),
  warn: (message: string, meta?: any) => logger.warn(message, meta),
  info: (message: string, meta?: any) => logger.info(message, meta),
  debug: (message: string, meta?: any) => logger.debug(message, meta),

  // Business-specific logging
  auth: (userId: string, action: string, details?: any) => {
    logger.info('Authentication event', {
      userId,
      action,
      details,
      category: 'auth',
    });
  },

  contract: (contractAddress: string, method: string, txHash?: string, details?: any) => {
    logger.info('Contract interaction', {
      contractAddress,
      method,
      txHash,
      details,
      category: 'contract',
    });
  },

  api: (method: string, path: string, statusCode: number, duration: number, userId?: string) => {
    logger.info('API request', {
      method,
      path,
      statusCode,
      duration,
      userId,
      category: 'api',
    });
  },

  security: (event: string, details?: any) => {
    logger.warn('Security event', {
      event,
      details,
      category: 'security',
    });
  },

  transaction: (txHash: string, type: string, details?: any) => {
    logger.info('Transaction event', {
      txHash,
      type,
      details,
      category: 'transaction',
    });
  },
};

export default logger;