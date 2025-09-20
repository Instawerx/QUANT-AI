import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { MetaMaskAuth } from '@/utils/auth';
import { userService } from '@/services/firebase';
import { log } from '@/utils/logger';
import { authMiddleware } from '@/middleware/auth';
import { MetaMaskAuthRequest, AuthenticatedRequest } from '@/types';

const router = Router();

// Generate authentication message
router.post('/generate-message',
  [
    body('address')
      .isEthereumAddress()
      .withMessage('Invalid Ethereum address'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const { address } = req.body;
      const timestamp = Date.now();
      const message = MetaMaskAuth.generateAuthMessage(address, timestamp);

      log.auth(address, 'message_generated', { timestamp });

      res.json({
        success: true,
        data: {
          message,
          timestamp,
        },
      });
    } catch (error) {
      log.error('Failed to generate auth message', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to generate authentication message',
      });
    }
  }
);

// Authenticate with MetaMask signature
router.post('/authenticate',
  [
    body('address')
      .isEthereumAddress()
      .withMessage('Invalid Ethereum address'),
    body('signature')
      .isLength({ min: 130, max: 132 })
      .withMessage('Invalid signature format'),
    body('message')
      .isString()
      .isLength({ min: 10 })
      .withMessage('Invalid message'),
    body('timestamp')
      .isNumeric()
      .withMessage('Invalid timestamp'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const { address, signature, message, timestamp }: MetaMaskAuthRequest = req.body;

      // Validate timestamp
      if (!MetaMaskAuth.isMessageTimestampValid(timestamp)) {
        log.security('expired_auth_message', { address, timestamp });
        return res.status(400).json({
          success: false,
          error: 'Authentication message has expired',
        });
      }

      // Verify signature
      const isValidSignature = await MetaMaskAuth.verifySignature(address, message, signature);

      if (!isValidSignature) {
        log.security('invalid_signature', { address, message });
        return res.status(401).json({
          success: false,
          error: 'Invalid signature',
        });
      }

      // Generate session
      const sessionId = MetaMaskAuth.generateSessionId();

      // Create or update user in Firestore
      await userService.createOrUpdateUser(address, {
        lastLogin: Date.now(),
        sessionId,
      });

      // Create session
      await userService.createSession(address, sessionId);

      log.auth(address, 'authentication_success', { sessionId });

      res.json({
        success: true,
        data: {
          sessionId,
          address,
          message: 'Authentication successful',
        },
      });
    } catch (error) {
      log.error('Authentication failed', { error });
      res.status(500).json({
        success: false,
        error: 'Authentication failed',
      });
    }
  }
);

// Get current user info
router.get('/me', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
    }

    const userData = await userService.getUser(req.user.address);

    res.json({
      success: true,
      data: {
        address: req.user.address,
        isVerified: req.user.isVerified,
        tier: req.user.tier,
        balances: userData?.balances || {},
        lastLogin: userData?.lastLogin,
      },
    });
  } catch (error) {
    log.error('Failed to get user info', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to get user information',
    });
  }
});

// Logout (revoke session)
router.post('/logout', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const sessionId = req.headers.authorization?.substring(7); // Remove 'Bearer ' prefix

    if (sessionId) {
      await userService.revokeSession(sessionId);
      log.auth(req.user?.address || 'unknown', 'logout', { sessionId });
    }

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    log.error('Logout failed', { error });
    res.status(500).json({
      success: false,
      error: 'Logout failed',
    });
  }
});

// Verify session endpoint
router.get('/verify', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    res.json({
      success: true,
      data: {
        isValid: true,
        address: req.user?.address,
        isVerified: req.user?.isVerified,
        tier: req.user?.tier,
      },
    });
  } catch (error) {
    log.error('Session verification failed', { error });
    res.status(500).json({
      success: false,
      error: 'Session verification failed',
    });
  }
});

export default router;