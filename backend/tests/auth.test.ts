import request from 'supertest';
import { ethers } from 'ethers';
import app from '../src/index';
import { userService } from '../src/services/firebase';
import { MetaMaskAuth } from '../src/utils/auth';

describe('Authentication Endpoints', () => {
  const testAddress = '0x742d35Cc6634C0532925a3b8D404f65971b1fc23';
  const mockSignature = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1c';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/generate-message', () => {
    it('should generate authentication message', async () => {
      const response = await request(app)
        .post('/api/auth/generate-message')
        .send({ address: testAddress });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('message');
      expect(response.body.data).toHaveProperty('timestamp');
      expect(response.body.data.message).toContain(testAddress);
    });

    it('should reject invalid address', async () => {
      const response = await request(app)
        .post('/api/auth/generate-message')
        .send({ address: 'invalid-address' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/authenticate', () => {
    it('should authenticate valid signature', async () => {
      const timestamp = Date.now();
      const message = MetaMaskAuth.generateAuthMessage(testAddress, timestamp);

      // Mock signature verification
      jest.spyOn(MetaMaskAuth, 'verifySignature').mockResolvedValue(true);
      jest.spyOn(MetaMaskAuth, 'isMessageTimestampValid').mockReturnValue(true);
      jest.spyOn(MetaMaskAuth, 'generateSessionId').mockReturnValue('test-session-id');

      // Mock user service
      jest.spyOn(userService, 'createOrUpdateUser').mockResolvedValue({ success: true });
      jest.spyOn(userService, 'createSession').mockResolvedValue(undefined);

      const response = await request(app)
        .post('/api/auth/authenticate')
        .send({
          address: testAddress,
          signature: mockSignature,
          message,
          timestamp,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('sessionId');
      expect(response.body.data.address).toBe(testAddress);
    });

    it('should reject invalid signature', async () => {
      const timestamp = Date.now();
      const message = MetaMaskAuth.generateAuthMessage(testAddress, timestamp);

      // Mock signature verification failure
      jest.spyOn(MetaMaskAuth, 'verifySignature').mockResolvedValue(false);
      jest.spyOn(MetaMaskAuth, 'isMessageTimestampValid').mockReturnValue(true);

      const response = await request(app)
        .post('/api/auth/authenticate')
        .send({
          address: testAddress,
          signature: mockSignature,
          message,
          timestamp,
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid signature');
    });

    it('should reject expired message', async () => {
      const timestamp = Date.now() - 10 * 60 * 1000; // 10 minutes ago
      const message = MetaMaskAuth.generateAuthMessage(testAddress, timestamp);

      // Mock timestamp validation failure
      jest.spyOn(MetaMaskAuth, 'isMessageTimestampValid').mockReturnValue(false);

      const response = await request(app)
        .post('/api/auth/authenticate')
        .send({
          address: testAddress,
          signature: mockSignature,
          message,
          timestamp,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('expired');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return user info for authenticated user', async () => {
      // Mock session validation
      jest.spyOn(userService, 'validateSession').mockResolvedValue({
        address: testAddress,
      });

      jest.spyOn(userService, 'getUser').mockResolvedValue({
        address: testAddress,
        isVerified: true,
        tier: 1,
        balances: {},
        lastLogin: Date.now(),
      });

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer test-session-id');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.address).toBe(testAddress);
      expect(response.body.data.isVerified).toBe(true);
    });

    it('should reject unauthenticated request', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject invalid session', async () => {
      jest.spyOn(userService, 'validateSession').mockResolvedValue(null);

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-session');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout authenticated user', async () => {
      // Mock session validation
      jest.spyOn(userService, 'validateSession').mockResolvedValue({
        address: testAddress,
      });

      jest.spyOn(userService, 'getUser').mockResolvedValue({
        address: testAddress,
        isVerified: true,
        tier: 1,
      });

      jest.spyOn(userService, 'revokeSession').mockResolvedValue(undefined);

      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer test-session-id');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(userService.revokeSession).toHaveBeenCalledWith('test-session-id');
    });
  });

  describe('GET /api/auth/verify', () => {
    it('should verify valid session', async () => {
      // Mock session validation
      jest.spyOn(userService, 'validateSession').mockResolvedValue({
        address: testAddress,
      });

      jest.spyOn(userService, 'getUser').mockResolvedValue({
        address: testAddress,
        isVerified: true,
        tier: 1,
      });

      const response = await request(app)
        .get('/api/auth/verify')
        .set('Authorization', 'Bearer test-session-id');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.isValid).toBe(true);
      expect(response.body.data.address).toBe(testAddress);
    });
  });
});

describe('MetaMaskAuth Utility', () => {
  const testAddress = '0x742d35Cc6634C0532925a3b8D404f65971b1fc23';

  describe('generateAuthMessage', () => {
    it('should generate valid auth message', () => {
      const timestamp = Date.now();
      const message = MetaMaskAuth.generateAuthMessage(testAddress, timestamp);

      expect(message).toContain(testAddress);
      expect(message).toContain(timestamp.toString());
      expect(message).toContain('QuantAI');
    });
  });

  describe('verifySignature', () => {
    it('should verify valid signature', async () => {
      const message = 'Test message';
      const signature = '0x1234...';

      // Mock ethers verifyMessage
      (ethers.verifyMessage as jest.Mock).mockReturnValue(testAddress);

      const result = await MetaMaskAuth.verifySignature(testAddress, message, signature);

      expect(result).toBe(true);
      expect(ethers.verifyMessage).toHaveBeenCalledWith(message, signature);
    });

    it('should reject invalid signature', async () => {
      const message = 'Test message';
      const signature = '0x1234...';

      // Mock ethers verifyMessage returning different address
      (ethers.verifyMessage as jest.Mock).mockReturnValue('0xdifferentaddress');

      const result = await MetaMaskAuth.verifySignature(testAddress, message, signature);

      expect(result).toBe(false);
    });
  });

  describe('isMessageTimestampValid', () => {
    it('should validate recent timestamp', () => {
      const recentTimestamp = Date.now() - 1000; // 1 second ago
      const result = MetaMaskAuth.isMessageTimestampValid(recentTimestamp);
      expect(result).toBe(true);
    });

    it('should reject old timestamp', () => {
      const oldTimestamp = Date.now() - 10 * 60 * 1000; // 10 minutes ago
      const result = MetaMaskAuth.isMessageTimestampValid(oldTimestamp);
      expect(result).toBe(false);
    });

    it('should reject future timestamp', () => {
      const futureTimestamp = Date.now() + 60 * 1000; // 1 minute in the future
      const result = MetaMaskAuth.isMessageTimestampValid(futureTimestamp);
      expect(result).toBe(false);
    });
  });

  describe('isValidAddress', () => {
    it('should validate correct address format', () => {
      (ethers.isAddress as jest.Mock).mockReturnValue(true);
      const result = MetaMaskAuth.isValidAddress(testAddress);
      expect(result).toBe(true);
    });

    it('should reject invalid address format', () => {
      (ethers.isAddress as jest.Mock).mockReturnValue(false);
      const result = MetaMaskAuth.isValidAddress('invalid-address');
      expect(result).toBe(false);
    });
  });
});