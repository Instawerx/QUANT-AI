import winston from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';

// Create a Winston logger that streams to Cloud Logging
const loggingWinston = new LoggingWinston({
  projectId: process.env.GOOGLE_CLOUD_PROJECT,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

// Create the logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'quantai',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  },
  transports: [
    // Always log to console for local development
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

// Add Cloud Logging transport in production
if (process.env.NODE_ENV === 'production' || process.env.ENABLE_CLOUD_LOGGING === 'true') {
  logger.add(loggingWinston);
}

// Custom log methods for specific use cases
export const log = {
  // Standard logging levels
  error: (message: string, meta?: any) => logger.error(message, meta),
  warn: (message: string, meta?: any) => logger.warn(message, meta),
  info: (message: string, meta?: any) => logger.info(message, meta),
  debug: (message: string, meta?: any) => logger.debug(message, meta),

  // Business-specific logging
  userAction: (userId: string, action: string, details?: any) => {
    logger.info('User action', {
      userId,
      action,
      details,
      category: 'user_action',
    });
  },

  tradingOperation: (userId: string, operation: string, details?: any) => {
    logger.info('Trading operation', {
      userId,
      operation,
      details,
      category: 'trading',
    });
  },

  walletEvent: (address: string, event: string, details?: any) => {
    logger.info('Wallet event', {
      walletAddress: address,
      event,
      details,
      category: 'wallet',
    });
  },

  securityEvent: (event: string, details?: any) => {
    logger.warn('Security event', {
      event,
      details,
      category: 'security',
    });
  },

  apiRequest: (method: string, path: string, statusCode: number, duration: number, userId?: string) => {
    logger.info('API request', {
      method,
      path,
      statusCode,
      duration,
      userId,
      category: 'api',
    });
  },

  contractInteraction: (contractAddress: string, method: string, txHash?: string, details?: any) => {
    logger.info('Contract interaction', {
      contractAddress,
      method,
      txHash,
      details,
      category: 'contract',
    });
  },
};

export default logger;