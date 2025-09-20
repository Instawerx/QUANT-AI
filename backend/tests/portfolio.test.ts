import request from 'supertest';
import app from '../src/index';
import { portfolioManagerService } from '../src/services/contract';
import { userService } from '../src/services/firebase';

describe('Portfolio Endpoints', () => {
  const testAddress = '0x742d35Cc6634C0532925a3b8D404f65971b1fc23';
  const testTokenAddress = '0x2222222222222222222222222222222222222222';
  const sessionId = 'test-session-id';

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock authentication
    jest.spyOn(userService, 'validateSession').mockResolvedValue({
      address: testAddress,
    });

    jest.spyOn(userService, 'getUser').mockResolvedValue({
      address: testAddress,
      isVerified: true,
      tier: 3, // Admin tier
      balances: {},
    });
  });

  describe('GET /api/portfolio/balances/:address', () => {
    it('should get user portfolio balances', async () => {
      const mockBalances = [
        {
          token: '0x0000000000000000000000000000000000000000',
          balance: '1.5',
          symbol: 'ETH',
          decimals: 18,
        },
        {
          token: testTokenAddress,
          balance: '100.0',
          symbol: 'TEST',
          decimals: 18,
        },
      ];

      jest.spyOn(portfolioManagerService, 'getAllUserBalances').mockResolvedValue(mockBalances);
      jest.spyOn(userService, 'updateUserBalance').mockResolvedValue(undefined);

      const response = await request(app)
        .get(`/api/portfolio/balances/${testAddress}`)
        .set('Authorization', `Bearer ${sessionId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.balances).toEqual(mockBalances);
      expect(portfolioManagerService.getAllUserBalances).toHaveBeenCalledWith(testAddress);
    });

    it('should reject unauthorized access to other user balances', async () => {
      const otherAddress = '0x1111111111111111111111111111111111111111';

      // Mock non-admin user
      jest.spyOn(userService, 'getUser').mockResolvedValue({
        address: testAddress,
        isVerified: true,
        tier: 1, // Non-admin tier
      });

      jest.spyOn(portfolioManagerService, 'isAdmin').mockResolvedValue(false);

      const response = await request(app)
        .get(`/api/portfolio/balances/${otherAddress}`)
        .set('Authorization', `Bearer ${sessionId}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/portfolio/balance/:address/:token', () => {
    it('should get specific token balance', async () => {
      jest.spyOn(portfolioManagerService, 'getUserBalance').mockResolvedValue('100.5');

      const response = await request(app)
        .get(`/api/portfolio/balance/${testAddress}/${testTokenAddress}`)
        .set('Authorization', `Bearer ${sessionId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.balance).toBe('100.5');
      expect(portfolioManagerService.getUserBalance).toHaveBeenCalledWith(testAddress, testTokenAddress);
    });
  });

  describe('POST /api/portfolio/deposit/tokens', () => {
    it('should deposit tokens for user (admin only)', async () => {
      const mockTransaction = {
        hash: '0xabcdef123456789',
        status: 'pending' as const,
      };

      jest.spyOn(portfolioManagerService, 'depositTokens').mockResolvedValue(mockTransaction);
      jest.spyOn(userService, 'addUserTransaction').mockResolvedValue(undefined);

      const response = await request(app)
        .post('/api/portfolio/deposit/tokens')
        .set('Authorization', `Bearer ${sessionId}`)
        .send({
          userAddress: testAddress,
          tokens: [testTokenAddress],
          amounts: ['100.0'],
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.transaction).toEqual(mockTransaction);
      expect(portfolioManagerService.depositTokens).toHaveBeenCalledWith(
        testAddress,
        [testTokenAddress],
        ['100.0']
      );
      expect(userService.addUserTransaction).toHaveBeenCalled();
    });

    it('should reject mismatched tokens and amounts arrays', async () => {
      const response = await request(app)
        .post('/api/portfolio/deposit/tokens')
        .set('Authorization', `Bearer ${sessionId}`)
        .send({
          userAddress: testAddress,
          tokens: [testTokenAddress],
          amounts: ['100.0', '200.0'], // Mismatched length
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/portfolio/deposit/eth', () => {
    it('should deposit ETH for user (admin only)', async () => {
      const mockTransaction = {
        hash: '0xabcdef123456789',
        status: 'pending' as const,
      };

      jest.spyOn(portfolioManagerService, 'depositETH').mockResolvedValue(mockTransaction);
      jest.spyOn(userService, 'addUserTransaction').mockResolvedValue(undefined);

      const response = await request(app)
        .post('/api/portfolio/deposit/eth')
        .set('Authorization', `Bearer ${sessionId}`)
        .send({
          userAddress: testAddress,
          amount: '1.5',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.transaction).toEqual(mockTransaction);
      expect(portfolioManagerService.depositETH).toHaveBeenCalledWith(testAddress, '1.5');
    });
  });

  describe('POST /api/portfolio/withdraw/tokens', () => {
    it('should withdraw tokens from user (admin only)', async () => {
      const mockTransaction = {
        hash: '0xabcdef123456789',
        status: 'pending' as const,
      };

      jest.spyOn(portfolioManagerService, 'adminWithdrawToken').mockResolvedValue(mockTransaction);
      jest.spyOn(userService, 'addUserTransaction').mockResolvedValue(undefined);

      const response = await request(app)
        .post('/api/portfolio/withdraw/tokens')
        .set('Authorization', `Bearer ${sessionId}`)
        .send({
          token: testTokenAddress,
          userAddress: testAddress,
          amount: '50.0',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.transaction).toEqual(mockTransaction);
      expect(portfolioManagerService.adminWithdrawToken).toHaveBeenCalledWith(
        testTokenAddress,
        testAddress,
        '50.0'
      );
    });
  });

  describe('POST /api/portfolio/withdraw/eth', () => {
    it('should withdraw ETH from user (admin only)', async () => {
      const mockTransaction = {
        hash: '0xabcdef123456789',
        status: 'pending' as const,
      };

      jest.spyOn(portfolioManagerService, 'adminWithdrawETH').mockResolvedValue(mockTransaction);
      jest.spyOn(userService, 'addUserTransaction').mockResolvedValue(undefined);

      const response = await request(app)
        .post('/api/portfolio/withdraw/eth')
        .set('Authorization', `Bearer ${sessionId}`)
        .send({
          userAddress: testAddress,
          amount: '0.5',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.transaction).toEqual(mockTransaction);
      expect(portfolioManagerService.adminWithdrawETH).toHaveBeenCalledWith(testAddress, '0.5');
    });
  });

  describe('POST /api/portfolio/transfer', () => {
    it('should transfer tokens between users (admin only)', async () => {
      const fromUser = testAddress;
      const toUser = '0x3333333333333333333333333333333333333333';
      const mockTransaction = {
        hash: '0xabcdef123456789',
        status: 'pending' as const,
      };

      jest.spyOn(portfolioManagerService, 'adminTransferToken').mockResolvedValue(mockTransaction);
      jest.spyOn(userService, 'addUserTransaction').mockResolvedValue(undefined);

      const response = await request(app)
        .post('/api/portfolio/transfer')
        .set('Authorization', `Bearer ${sessionId}`)
        .send({
          token: testTokenAddress,
          fromUser,
          toUser,
          amount: '25.0',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.transaction).toEqual(mockTransaction);
      expect(portfolioManagerService.adminTransferToken).toHaveBeenCalledWith(
        testTokenAddress,
        fromUser,
        toUser,
        '25.0'
      );

      // Should add transaction to both users
      expect(userService.addUserTransaction).toHaveBeenCalledTimes(2);
    });
  });

  describe('GET /api/portfolio/tokens/supported', () => {
    it('should get supported tokens', async () => {
      const mockTokens = [testTokenAddress, '0x4444444444444444444444444444444444444444'];

      jest.spyOn(portfolioManagerService, 'getSupportedTokens').mockResolvedValue(mockTokens);

      const response = await request(app)
        .get('/api/portfolio/tokens/supported');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.tokens).toEqual(mockTokens);
    });
  });

  describe('POST /api/portfolio/tokens/add', () => {
    it('should add supported token (admin only)', async () => {
      const newTokenAddress = '0x5555555555555555555555555555555555555555';
      const mockTransaction = {
        hash: '0xabcdef123456789',
        status: 'pending' as const,
      };

      jest.spyOn(portfolioManagerService, 'addSupportedToken').mockResolvedValue(mockTransaction);

      const response = await request(app)
        .post('/api/portfolio/tokens/add')
        .set('Authorization', `Bearer ${sessionId}`)
        .send({
          tokenAddress: newTokenAddress,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.transaction).toEqual(mockTransaction);
      expect(portfolioManagerService.addSupportedToken).toHaveBeenCalledWith(newTokenAddress);
    });
  });

  describe('GET /api/portfolio/transaction/:hash', () => {
    it('should get transaction status', async () => {
      const txHash = '0xabcdef123456789';
      const mockReceipt = {
        status: 1,
        blockNumber: 12345,
        gasUsed: BigInt(21000),
        gasPrice: BigInt(20000000000),
      };

      jest.spyOn(portfolioManagerService, 'getTransactionReceipt').mockResolvedValue(mockReceipt as any);

      const response = await request(app)
        .get(`/api/portfolio/transaction/${txHash}`)
        .set('Authorization', `Bearer ${sessionId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('success');
      expect(response.body.data.blockNumber).toBe(12345);
    });

    it('should return pending for non-existent transaction', async () => {
      const txHash = '0xabcdef123456789';

      jest.spyOn(portfolioManagerService, 'getTransactionReceipt').mockResolvedValue(null);

      const response = await request(app)
        .get(`/api/portfolio/transaction/${txHash}`)
        .set('Authorization', `Bearer ${sessionId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('pending');
    });
  });

  describe('Admin-only endpoints', () => {
    beforeEach(() => {
      // Mock non-admin user
      jest.spyOn(userService, 'getUser').mockResolvedValue({
        address: testAddress,
        isVerified: true,
        tier: 1, // Non-admin tier
      });
    });

    it('should reject non-admin deposit attempt', async () => {
      const response = await request(app)
        .post('/api/portfolio/deposit/tokens')
        .set('Authorization', `Bearer ${sessionId}`)
        .send({
          userAddress: testAddress,
          tokens: [testTokenAddress],
          amounts: ['100.0'],
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Admin privileges required');
    });

    it('should reject non-admin withdraw attempt', async () => {
      const response = await request(app)
        .post('/api/portfolio/withdraw/tokens')
        .set('Authorization', `Bearer ${sessionId}`)
        .send({
          token: testTokenAddress,
          userAddress: testAddress,
          amount: '50.0',
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });
});