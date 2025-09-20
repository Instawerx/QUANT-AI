import { Router, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { portfolioManagerService } from '@/services/contract';
import { userService } from '@/services/firebase';
import { authMiddleware, adminOnlyMiddleware } from '@/middleware/auth';
import { log } from '@/utils/logger';
import { AuthenticatedRequest, DepositTokensRequest, DepositETHRequest, WithdrawRequest, TransferRequest } from '@/types';

const router = Router();

// Get user portfolio balances
router.get('/balances/:address',
  [
    param('address')
      .isEthereumAddress()
      .withMessage('Invalid Ethereum address'),
  ],
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const { address } = req.params;

      // Users can only access their own balances, or admins can access any
      if (req.user!.address.toLowerCase() !== address.toLowerCase()) {
        const isAdmin = await portfolioManagerService.isAdmin();
        if (!isAdmin) {
          return res.status(403).json({
            success: false,
            error: 'Access denied',
          });
        }
      }

      const balances = await portfolioManagerService.getAllUserBalances(address);

      // Update balances in Firestore
      const balanceMap = balances.reduce((acc, balance) => {
        acc[balance.token.toLowerCase()] = balance.balance;
        return acc;
      }, {} as Record<string, string>);

      await userService.updateUserBalance(address, 'all', JSON.stringify(balanceMap));

      res.json({
        success: true,
        data: {
          address,
          balances,
        },
      });
    } catch (error) {
      log.error('Failed to get portfolio balances', { address: req.params.address, error });
      res.status(500).json({
        success: false,
        error: 'Failed to get portfolio balances',
      });
    }
  }
);

// Get specific token balance
router.get('/balance/:address/:token',
  [
    param('address')
      .isEthereumAddress()
      .withMessage('Invalid Ethereum address'),
    param('token')
      .isEthereumAddress()
      .withMessage('Invalid token address'),
  ],
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const { address, token } = req.params;

      // Users can only access their own balances
      if (req.user!.address.toLowerCase() !== address.toLowerCase()) {
        const isAdmin = await portfolioManagerService.isAdmin();
        if (!isAdmin) {
          return res.status(403).json({
            success: false,
            error: 'Access denied',
          });
        }
      }

      const balance = await portfolioManagerService.getUserBalance(address, token);

      res.json({
        success: true,
        data: {
          address,
          token,
          balance,
        },
      });
    } catch (error) {
      log.error('Failed to get token balance', {
        address: req.params.address,
        token: req.params.token,
        error
      });
      res.status(500).json({
        success: false,
        error: 'Failed to get token balance',
      });
    }
  }
);

// Admin: Deposit tokens for user
router.post('/deposit/tokens',
  [
    body('userAddress')
      .isEthereumAddress()
      .withMessage('Invalid user address'),
    body('tokens')
      .isArray({ min: 1 })
      .withMessage('Tokens must be a non-empty array'),
    body('tokens.*')
      .isEthereumAddress()
      .withMessage('Invalid token address'),
    body('amounts')
      .isArray({ min: 1 })
      .withMessage('Amounts must be a non-empty array'),
    body('amounts.*')
      .isNumeric()
      .withMessage('Invalid amount'),
  ],
  authMiddleware,
  adminOnlyMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const { userAddress, tokens, amounts }: DepositTokensRequest = req.body;

      if (tokens.length !== amounts.length) {
        return res.status(400).json({
          success: false,
          error: 'Tokens and amounts arrays must have the same length',
        });
      }

      const transaction = await portfolioManagerService.depositTokens(userAddress, tokens, amounts);

      // Add transaction to user's history
      await userService.addUserTransaction(userAddress, {
        hash: transaction.hash,
        type: 'deposit_tokens',
        amount: amounts.join(','),
        timestamp: Date.now(),
        status: 'pending',
      });

      log.contract(portfolioManagerService['config'].contractAddress, 'deposit_tokens', transaction.hash, {
        userAddress,
        tokens,
        amounts,
        adminAddress: req.user!.address,
      });

      res.json({
        success: true,
        data: {
          transaction,
          userAddress,
          tokens,
          amounts,
        },
      });
    } catch (error) {
      log.error('Failed to deposit tokens', { body: req.body, error });
      res.status(500).json({
        success: false,
        error: 'Failed to deposit tokens',
      });
    }
  }
);

// Admin: Deposit ETH for user
router.post('/deposit/eth',
  [
    body('userAddress')
      .isEthereumAddress()
      .withMessage('Invalid user address'),
    body('amount')
      .isNumeric()
      .withMessage('Invalid amount'),
  ],
  authMiddleware,
  adminOnlyMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const { userAddress, amount }: DepositETHRequest = req.body;

      const transaction = await portfolioManagerService.depositETH(userAddress, amount);

      // Add transaction to user's history
      await userService.addUserTransaction(userAddress, {
        hash: transaction.hash,
        type: 'deposit_eth',
        amount,
        timestamp: Date.now(),
        status: 'pending',
      });

      log.contract(portfolioManagerService['config'].contractAddress, 'deposit_eth', transaction.hash, {
        userAddress,
        amount,
        adminAddress: req.user!.address,
      });

      res.json({
        success: true,
        data: {
          transaction,
          userAddress,
          amount,
        },
      });
    } catch (error) {
      log.error('Failed to deposit ETH', { body: req.body, error });
      res.status(500).json({
        success: false,
        error: 'Failed to deposit ETH',
      });
    }
  }
);

// Admin: Withdraw tokens from user
router.post('/withdraw/tokens',
  [
    body('token')
      .isEthereumAddress()
      .withMessage('Invalid token address'),
    body('userAddress')
      .isEthereumAddress()
      .withMessage('Invalid user address'),
    body('amount')
      .isNumeric()
      .withMessage('Invalid amount'),
  ],
  authMiddleware,
  adminOnlyMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const { token, userAddress, amount }: WithdrawRequest = req.body;

      const transaction = await portfolioManagerService.adminWithdrawToken(token, userAddress, amount);

      // Add transaction to user's history
      await userService.addUserTransaction(userAddress, {
        hash: transaction.hash,
        type: 'withdraw_token',
        token,
        amount,
        timestamp: Date.now(),
        status: 'pending',
      });

      log.contract(portfolioManagerService['config'].contractAddress, 'withdraw_token', transaction.hash, {
        token,
        userAddress,
        amount,
        adminAddress: req.user!.address,
      });

      res.json({
        success: true,
        data: {
          transaction,
          token,
          userAddress,
          amount,
        },
      });
    } catch (error) {
      log.error('Failed to withdraw token', { body: req.body, error });
      res.status(500).json({
        success: false,
        error: 'Failed to withdraw token',
      });
    }
  }
);

// Admin: Withdraw ETH from user
router.post('/withdraw/eth',
  [
    body('userAddress')
      .isEthereumAddress()
      .withMessage('Invalid user address'),
    body('amount')
      .isNumeric()
      .withMessage('Invalid amount'),
  ],
  authMiddleware,
  adminOnlyMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const { userAddress, amount } = req.body;

      const transaction = await portfolioManagerService.adminWithdrawETH(userAddress, amount);

      // Add transaction to user's history
      await userService.addUserTransaction(userAddress, {
        hash: transaction.hash,
        type: 'withdraw_eth',
        amount,
        timestamp: Date.now(),
        status: 'pending',
      });

      log.contract(portfolioManagerService['config'].contractAddress, 'withdraw_eth', transaction.hash, {
        userAddress,
        amount,
        adminAddress: req.user!.address,
      });

      res.json({
        success: true,
        data: {
          transaction,
          userAddress,
          amount,
        },
      });
    } catch (error) {
      log.error('Failed to withdraw ETH', { body: req.body, error });
      res.status(500).json({
        success: false,
        error: 'Failed to withdraw ETH',
      });
    }
  }
);

// Admin: Transfer tokens between users
router.post('/transfer',
  [
    body('token')
      .isEthereumAddress()
      .withMessage('Invalid token address'),
    body('fromUser')
      .isEthereumAddress()
      .withMessage('Invalid from user address'),
    body('toUser')
      .isEthereumAddress()
      .withMessage('Invalid to user address'),
    body('amount')
      .isNumeric()
      .withMessage('Invalid amount'),
  ],
  authMiddleware,
  adminOnlyMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const { token, fromUser, toUser, amount }: TransferRequest = req.body;

      const transaction = await portfolioManagerService.adminTransferToken(token, fromUser, toUser, amount);

      // Add transaction to both users' history
      const transactionData = {
        hash: transaction.hash,
        type: 'transfer',
        token,
        amount,
        timestamp: Date.now(),
        status: 'pending' as const,
      };

      await Promise.all([
        userService.addUserTransaction(fromUser, {
          ...transactionData,
          type: 'transfer_out',
        }),
        userService.addUserTransaction(toUser, {
          ...transactionData,
          type: 'transfer_in',
        }),
      ]);

      log.contract(portfolioManagerService['config'].contractAddress, 'transfer_token', transaction.hash, {
        token,
        fromUser,
        toUser,
        amount,
        adminAddress: req.user!.address,
      });

      res.json({
        success: true,
        data: {
          transaction,
          token,
          fromUser,
          toUser,
          amount,
        },
      });
    } catch (error) {
      log.error('Failed to transfer token', { body: req.body, error });
      res.status(500).json({
        success: false,
        error: 'Failed to transfer token',
      });
    }
  }
);

// Get supported tokens
router.get('/tokens/supported', async (req, res: Response) => {
  try {
    const tokens = await portfolioManagerService.getSupportedTokens();

    res.json({
      success: true,
      data: {
        tokens,
      },
    });
  } catch (error) {
    log.error('Failed to get supported tokens', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to get supported tokens',
    });
  }
});

// Admin: Add supported token
router.post('/tokens/add',
  [
    body('tokenAddress')
      .isEthereumAddress()
      .withMessage('Invalid token address'),
  ],
  authMiddleware,
  adminOnlyMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const { tokenAddress } = req.body;

      const transaction = await portfolioManagerService.addSupportedToken(tokenAddress);

      log.contract(portfolioManagerService['config'].contractAddress, 'add_supported_token', transaction.hash, {
        tokenAddress,
        adminAddress: req.user!.address,
      });

      res.json({
        success: true,
        data: {
          transaction,
          tokenAddress,
        },
      });
    } catch (error) {
      log.error('Failed to add supported token', { body: req.body, error });
      res.status(500).json({
        success: false,
        error: 'Failed to add supported token',
      });
    }
  }
);

// Get transaction status
router.get('/transaction/:hash',
  [
    param('hash')
      .isLength({ min: 66, max: 66 })
      .withMessage('Invalid transaction hash'),
  ],
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const { hash } = req.params;

      const receipt = await portfolioManagerService.getTransactionReceipt(hash);

      if (!receipt) {
        return res.json({
          success: true,
          data: {
            hash,
            status: 'pending',
          },
        });
      }

      const status = receipt.status === 1 ? 'success' : 'failed';

      res.json({
        success: true,
        data: {
          hash,
          status,
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed?.toString(),
          effectiveGasPrice: receipt.gasPrice?.toString(),
        },
      });
    } catch (error) {
      log.error('Failed to get transaction status', { hash: req.params.hash, error });
      res.status(500).json({
        success: false,
        error: 'Failed to get transaction status',
      });
    }
  }
);

export default router;