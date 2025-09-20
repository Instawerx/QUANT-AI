import { Request, Response, NextFunction } from 'express';
import { log } from '@/utils/logger';

export interface CustomError extends Error {
  statusCode?: number;
  details?: any;
}

// Global error handler
export function errorHandler(
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log the error
  log.error('Global error handler', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Determine status code
  const statusCode = error.statusCode || 500;

  // Determine error message
  let message = 'Internal server error';
  if (statusCode === 400) {
    message = error.message || 'Bad request';
  } else if (statusCode === 401) {
    message = 'Unauthorized';
  } else if (statusCode === 403) {
    message = 'Forbidden';
  } else if (statusCode === 404) {
    message = 'Not found';
  } else if (statusCode === 429) {
    message = 'Too many requests';
  } else if (statusCode < 500) {
    message = error.message || 'Client error';
  }

  // Send error response
  const errorResponse: any = {
    success: false,
    error: message,
  };

  // Include details in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.details = {
      message: error.message,
      stack: error.stack,
      details: error.details,
    };
  }

  res.status(statusCode).json(errorResponse);
}

// 404 handler
export function notFoundHandler(req: Request, res: Response) {
  log.warn('Route not found', {
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.url} not found`,
  });
}

// Async error wrapper
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Validation error handler
export function validationErrorHandler(req: Request, res: Response, next: NextFunction) {
  // This will be called by express-validator
  next();
}