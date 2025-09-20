import { Request, Response, NextFunction } from 'express';
import { userService } from '@/services/firebase';
import { AuthenticatedRequest } from '@/types';
import { log } from '@/utils/logger';

// Authentication middleware that validates sessions
export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Missing or invalid authorization header',
      });
    }

    const sessionId = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Validate session
    const sessionData = await userService.validateSession(sessionId);

    if (!sessionData) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired session',
      });
    }

    // Get user data
    const userData = await userService.getUser(sessionData.address);

    if (!userData) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
      });
    }

    // Attach user data to request
    req.user = {
      address: sessionData.address,
      isVerified: userData.isVerified || false,
      tier: userData.tier || 0,
    };

    log.auth(req.user.address, 'middleware_auth_success', { sessionId });
    next();
  } catch (error) {
    log.error('Authentication middleware error', { error });
    res.status(500).json({
      success: false,
      error: 'Internal server error during authentication',
    });
  }
}

// Optional authentication middleware (doesn't fail if no auth)
export async function optionalAuthMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const sessionId = authHeader.substring(7);
      const sessionData = await userService.validateSession(sessionId);

      if (sessionData) {
        const userData = await userService.getUser(sessionData.address);
        if (userData) {
          req.user = {
            address: sessionData.address,
            isVerified: userData.isVerified || false,
            tier: userData.tier || 0,
          };
        }
      }
    }

    next();
  } catch (error) {
    log.error('Optional authentication middleware error', { error });
    // Don't fail on optional auth errors
    next();
  }
}

// Admin-only middleware
export function adminOnlyMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
    });
  }

  // Check if user is admin (tier 3 or higher, or specifically marked as admin)
  const isAdmin = req.user.tier >= 3; // Adjust criteria as needed

  if (!isAdmin) {
    log.security('unauthorized_admin_access', {
      address: req.user.address,
      tier: req.user.tier,
    });

    return res.status(403).json({
      success: false,
      error: 'Admin privileges required',
    });
  }

  next();
}

// Rate limiting by user address
export function userRateLimitMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  // This would integrate with express-rate-limit
  // For now, we'll implement a simple in-memory rate limiter

  const userLimits = new Map<string, { count: number; resetTime: number }>();
  const RATE_LIMIT = 100; // requests per window
  const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

  const userAddress = req.user?.address || req.ip;
  const now = Date.now();

  const userLimit = userLimits.get(userAddress);

  if (!userLimit || now > userLimit.resetTime) {
    // Reset or initialize
    userLimits.set(userAddress, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });
    return next();
  }

  if (userLimit.count >= RATE_LIMIT) {
    log.security('rate_limit_exceeded', {
      address: userAddress,
      count: userLimit.count,
      limit: RATE_LIMIT,
    });

    return res.status(429).json({
      success: false,
      error: 'Rate limit exceeded',
      resetTime: userLimit.resetTime,
    });
  }

  userLimit.count++;
  next();
}