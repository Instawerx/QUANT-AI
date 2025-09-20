import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { Timestamp } from 'firebase/firestore';
import {
  UserManager,
  TransactionManager,
  PortfolioManager,
  TokenManager,
  NotificationManager,
  type User,
  type Transaction,
  type Portfolio,
  type Token,
  type Notification,
} from '../admin';

// Mock Firebase
vi.mock('@/lib/firebase/client', () => ({
  db: {},
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  startAfter: vi.fn(),
  Timestamp: {
    now: vi.fn(() => ({ seconds: 1640995200, nanoseconds: 0 })),
  },
}));

describe('UserManager', () => {
  let userManager: UserManager;
  const mockUser: Omit<User, 'createdAt' | 'updatedAt'> = {
    address: '0x1234567890123456789012345678901234567890',
    displayName: 'Test User',
    email: 'test@example.com',
    lastLogin: Timestamp.now(),
    loginCount: 1,
    isVerified: false,
    verificationLevel: 0,
    tier: 0,
    isSuspended: false,
    language: 'en',
    theme: 'light',
    notifications: {
      email: true,
      push: true,
      trading: true,
      security: true,
    },
    tradingEnabled: false,
    riskLevel: 5,
    lastActiveAt: Timestamp.now(),
  };

  beforeEach(() => {
    userManager = new UserManager();
    vi.clearAllMocks();
  });

  test('should create user with valid data', async () => {
    const mockDocRef = { id: 'user123' };
    const { addDoc } = await import('firebase/firestore');
    vi.mocked(addDoc).mockResolvedValue(mockDocRef as any);

    const userId = await userManager.createUser(mockUser);

    expect(userId).toBe('user123');
    expect(addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        ...mockUser,
        address: mockUser.address.toLowerCase(),
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      })
    );
  });

  test('should reject invalid wallet address', async () => {
    const invalidUser = {
      ...mockUser,
      address: 'invalid-address',
    };

    await expect(userManager.createUser(invalidUser)).rejects.toThrow();
  });

  test('should normalize wallet address to lowercase', async () => {
    const mockDocRef = { id: 'user123' };
    const { addDoc } = await import('firebase/firestore');
    vi.mocked(addDoc).mockResolvedValue(mockDocRef as any);

    const upperCaseUser = {
      ...mockUser,
      address: '0X1234567890123456789012345678901234567890',
    };

    await userManager.createUser(upperCaseUser);

    expect(addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        address: '0x1234567890123456789012345678901234567890',
      })
    );
  });

  test('should validate tier range', async () => {
    const invalidTierUser = {
      ...mockUser,
      tier: 5, // Invalid tier (should be 0-3)
    };

    await expect(userManager.createUser(invalidTierUser)).rejects.toThrow();
  });

  test('should validate risk level range', async () => {
    const invalidRiskUser = {
      ...mockUser,
      riskLevel: 15, // Invalid risk level (should be 1-10)
    };

    await expect(userManager.createUser(invalidRiskUser)).rejects.toThrow();
  });
});

describe('TransactionManager', () => {
  let transactionManager: TransactionManager;
  const mockTransaction: Omit<Transaction, 'createdAt' | 'updatedAt'> = {
    transactionId: 'tx123',
    hash: '0xabcdef',
    userId: 'user123',
    type: 'deposit',
    status: 'pending',
    tokenAddress: '0x0000000000000000000000000000000000000000',
    tokenSymbol: 'ETH',
    amount: '1.5',
    amountUSD: 3000,
    description: 'ETH deposit',
    category: 'deposit',
    tags: ['eth', 'deposit'],
  };

  beforeEach(() => {
    transactionManager = new TransactionManager();
    vi.clearAllMocks();
  });

  test('should create transaction with valid data', async () => {
    const mockDocRef = { id: 'tx123' };
    const { addDoc } = await import('firebase/firestore');
    vi.mocked(addDoc).mockResolvedValue(mockDocRef as any);

    const txId = await transactionManager.createTransaction(mockTransaction);

    expect(txId).toBe('tx123');
    expect(addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        ...mockTransaction,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      })
    );
  });

  test('should reject invalid transaction type', async () => {
    const invalidTransaction = {
      ...mockTransaction,
      type: 'invalid-type' as any,
    };

    await expect(transactionManager.createTransaction(invalidTransaction)).rejects.toThrow();
  });

  test('should reject invalid transaction status', async () => {
    const invalidTransaction = {
      ...mockTransaction,
      status: 'invalid-status' as any,
    };

    await expect(transactionManager.createTransaction(invalidTransaction)).rejects.toThrow();
  });

  test('should reject negative amount USD', async () => {
    const invalidTransaction = {
      ...mockTransaction,
      amountUSD: -100,
    };

    await expect(transactionManager.createTransaction(invalidTransaction)).rejects.toThrow();
  });

  test('should update transaction status correctly', async () => {
    const { updateDoc } = await import('firebase/firestore');
    vi.mocked(updateDoc).mockResolvedValue();

    await transactionManager.updateTransactionStatus('tx123', 'confirmed', '0xhash', 12345);

    expect(updateDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        status: 'confirmed',
        hash: '0xhash',
        blockNumber: 12345,
        confirmedAt: expect.anything(),
        updatedAt: expect.anything(),
      })
    );
  });
});

describe('PortfolioManager', () => {
  let portfolioManager: PortfolioManager;
  const mockPortfolio: Omit<Portfolio, 'createdAt' | 'updatedAt'> = {
    userId: 'user123',
    portfolioId: 'portfolio123',
    name: 'Main Portfolio',
    holdings: {
      '0x0000000000000000000000000000000000000000': {
        symbol: 'ETH',
        name: 'Ethereum',
        balance: '10.5',
        decimals: 18,
        value: 21000,
        allocation: 70,
      },
    },
    totalValue: 30000,
    totalValueChange24h: 1500,
    totalValueChangePercent24h: 5.26,
    performance: {
      daily: 5.26,
      weekly: 12.5,
      monthly: 25.8,
      allTime: 156.7,
    },
    isActive: true,
    isSnapshot: false,
  };

  beforeEach(() => {
    portfolioManager = new PortfolioManager();
    vi.clearAllMocks();
  });

  test('should create portfolio snapshot', async () => {
    const { getDoc, addDoc } = await import('firebase/firestore');

    // Mock getting the original portfolio
    vi.mocked(getDoc).mockResolvedValue({
      exists: () => true,
      data: () => mockPortfolio,
    } as any);

    const mockDocRef = { id: 'snapshot123' };
    vi.mocked(addDoc).mockResolvedValue(mockDocRef as any);

    const snapshotId = await portfolioManager.createSnapshot('portfolio123');

    expect(snapshotId).toBe('snapshot123');
    expect(addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        isSnapshot: true,
        snapshotDate: expect.anything(),
        portfolioId: expect.stringMatching(/^portfolio123_\d+$/),
      })
    );
  });

  test('should throw error when creating snapshot of non-existent portfolio', async () => {
    const { getDoc } = await import('firebase/firestore');

    vi.mocked(getDoc).mockResolvedValue({
      exists: () => false,
    } as any);

    await expect(portfolioManager.createSnapshot('nonexistent')).rejects.toThrow('Portfolio not found');
  });
});

describe('TokenManager', () => {
  let tokenManager: TokenManager;
  const mockToken: Omit<Token, 'createdAt' | 'updatedAt' | 'lastPriceUpdate'> = {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    chainId: 1,
    isNative: true,
    price: 2000,
    priceChange24h: 5.2,
    marketCap: 240000000000,
    volume24h: 15000000000,
    isSupported: true,
    isActive: true,
    minimumAmount: '0.001',
  };

  beforeEach(() => {
    tokenManager = new TokenManager();
    vi.clearAllMocks();
  });

  test('should update token price', async () => {
    const { updateDoc } = await import('firebase/firestore');
    vi.mocked(updateDoc).mockResolvedValue();

    await tokenManager.updateTokenPrice('0xtoken', 2100, 7.5);

    expect(updateDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        price: 2100,
        priceChange24h: 7.5,
        lastPriceUpdate: expect.anything(),
        updatedAt: expect.anything(),
      })
    );
  });
});

describe('NotificationManager', () => {
  let notificationManager: NotificationManager;

  beforeEach(() => {
    notificationManager = new NotificationManager();
    vi.clearAllMocks();
  });

  test('should create system notification', async () => {
    const mockDocRef = { id: 'notification123' };
    const { addDoc } = await import('firebase/firestore');
    vi.mocked(addDoc).mockResolvedValue(mockDocRef as any);

    const notificationId = await notificationManager.createSystemNotification(
      'user123',
      'info',
      'system',
      'Test Title',
      'Test Message',
      3
    );

    expect(notificationId).toBe('notification123');
    expect(addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        userId: 'user123',
        type: 'info',
        category: 'system',
        title: 'Test Title',
        message: 'Test Message',
        priority: 3,
        isRead: false,
        isPersistent: false,
        notificationId: expect.stringMatching(/^\d+_[a-z0-9]+$/),
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      })
    );
  });

  test('should mark notification as read', async () => {
    const { updateDoc } = await import('firebase/firestore');
    vi.mocked(updateDoc).mockResolvedValue();

    await notificationManager.markAsRead('notification123');

    expect(updateDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        isRead: true,
        readAt: expect.anything(),
        updatedAt: expect.anything(),
      })
    );
  });
});