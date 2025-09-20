import {
  doc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
  DocumentReference,
  CollectionReference,
  Query
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { z } from 'zod';

// Type definitions based on our data model
export interface User {
  address: string;
  displayName?: string;
  email?: string;
  avatar?: string;
  sessionId?: string;
  lastLogin: Timestamp;
  loginCount: number;
  isVerified: boolean;
  verificationLevel: number;
  tier: number;
  isSuspended: boolean;
  suspensionReason?: string;
  language: string;
  theme: string;
  notifications: {
    email: boolean;
    push: boolean;
    trading: boolean;
    security: boolean;
  };
  tradingEnabled: boolean;
  riskLevel: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastActiveAt: Timestamp;
}

export interface Portfolio {
  userId: string;
  portfolioId: string;
  name: string;
  holdings: Record<string, {
    symbol: string;
    name: string;
    balance: string;
    decimals: number;
    value: number;
    allocation: number;
  }>;
  totalValue: number;
  totalValueChange24h: number;
  totalValueChangePercent24h: number;
  performance: {
    daily: number;
    weekly: number;
    monthly: number;
    allTime: number;
    sharpeRatio?: number;
    maxDrawdown?: number;
  };
  isActive: boolean;
  isSnapshot: boolean;
  snapshotDate?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Transaction {
  transactionId: string;
  hash?: string;
  userId: string;
  type: 'deposit' | 'withdraw' | 'transfer' | 'trade' | 'reward';
  status: 'pending' | 'confirmed' | 'failed' | 'cancelled';
  tokenAddress: string;
  tokenSymbol: string;
  amount: string;
  amountUSD: number;
  fromAddress?: string;
  toAddress?: string;
  contractAddress?: string;
  blockNumber?: number;
  gasUsed?: string;
  gasPrice?: string;
  fee?: string;
  tradeType?: 'buy' | 'sell' | 'swap';
  pricePerToken?: number;
  slippage?: number;
  description: string;
  category: string;
  tags: string[];
  createdAt: Timestamp;
  confirmedAt?: Timestamp;
  updatedAt: Timestamp;
}

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  chainId: number;
  isNative: boolean;
  price: number;
  priceChange24h: number;
  marketCap?: number;
  volume24h?: number;
  isSupported: boolean;
  isActive: boolean;
  minimumAmount: string;
  logoUrl?: string;
  description?: string;
  website?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastPriceUpdate: Timestamp;
}

export interface TradingSession {
  sessionId: string;
  userId: string;
  strategy: string;
  status: 'active' | 'paused' | 'stopped' | 'completed';
  riskLevel: number;
  maxPositionSize: number;
  stopLoss: number;
  takeProfit: number;
  startingBalance: number;
  currentBalance: number;
  totalTrades: number;
  winningTrades: number;
  totalReturn: number;
  startedAt: Timestamp;
  endedAt?: Timestamp;
  lastTradeAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Notification {
  notificationId: string;
  userId: string;
  type: 'info' | 'warning' | 'error' | 'success';
  category: 'trading' | 'security' | 'system' | 'portfolio';
  title: string;
  message: string;
  titleKey?: string;
  messageKey?: string;
  variables?: Record<string, any>;
  isRead: boolean;
  isPersistent: boolean;
  priority: number;
  actionUrl?: string;
  actionText?: string;
  createdAt: Timestamp;
  readAt?: Timestamp;
  expiresAt?: Timestamp;
}

// Validation schemas
const userSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/).transform(addr => addr.toLowerCase()),
  displayName: z.string().optional(),
  email: z.string().email().optional(),
  avatar: z.string().url().optional(),
  sessionId: z.string().optional(),
  lastLogin: z.any(),
  loginCount: z.number().int().min(0),
  isVerified: z.boolean(),
  verificationLevel: z.number().int().min(0).max(2),
  tier: z.number().int().min(0).max(3),
  isSuspended: z.boolean(),
  suspensionReason: z.string().optional(),
  language: z.string().min(2).max(5),
  theme: z.string(),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    trading: z.boolean(),
    security: z.boolean(),
  }),
  tradingEnabled: z.boolean(),
  riskLevel: z.number().int().min(1).max(10),
  createdAt: z.any(),
  updatedAt: z.any(),
  lastActiveAt: z.any(),
});

const transactionSchema = z.object({
  transactionId: z.string(),
  hash: z.string().optional(),
  userId: z.string(),
  type: z.enum(['deposit', 'withdraw', 'transfer', 'trade', 'reward']),
  status: z.enum(['pending', 'confirmed', 'failed', 'cancelled']),
  tokenAddress: z.string(),
  tokenSymbol: z.string(),
  amount: z.string(),
  amountUSD: z.number().min(0),
  fromAddress: z.string().optional(),
  toAddress: z.string().optional(),
  contractAddress: z.string().optional(),
  blockNumber: z.number().int().optional(),
  gasUsed: z.string().optional(),
  gasPrice: z.string().optional(),
  fee: z.string().optional(),
  tradeType: z.enum(['buy', 'sell', 'swap']).optional(),
  pricePerToken: z.number().optional(),
  slippage: z.number().optional(),
  description: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  createdAt: z.any(),
  confirmedAt: z.any().optional(),
  updatedAt: z.any(),
});

// Generic CRUD operations
export class FirestoreAdmin<T extends DocumentData> {
  private collection: CollectionReference<T>;

  constructor(collectionName: string) {
    this.collection = collection(db, collectionName) as CollectionReference<T>;
  }

  async create(data: Omit<T, 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = Timestamp.now();
    const docData = {
      ...data,
      createdAt: now,
      updatedAt: now,
    } as T;

    const docRef = await addDoc(this.collection, docData);
    return docRef.id;
  }

  async get(id: string): Promise<T | null> {
    const docRef = doc(this.collection, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  }

  async update(id: string, data: Partial<Omit<T, 'createdAt'>>): Promise<void> {
    const docRef = doc(this.collection, id);
    const updateData = {
      ...data,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(docRef, updateData);
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(this.collection, id);
    await deleteDoc(docRef);
  }

  async list(
    filters: Array<{ field: string; operator: any; value: any }> = [],
    orderByField?: string,
    orderDirection: 'asc' | 'desc' = 'desc',
    limitCount?: number,
    startAfterDoc?: QueryDocumentSnapshot<T>
  ): Promise<{ docs: T[]; lastDoc?: QueryDocumentSnapshot<T> }> {
    let q: Query<T> = this.collection;

    // Apply filters
    filters.forEach(filter => {
      q = query(q, where(filter.field, filter.operator, filter.value));
    });

    // Apply ordering
    if (orderByField) {
      q = query(q, orderBy(orderByField, orderDirection));
    }

    // Apply pagination
    if (startAfterDoc) {
      q = query(q, startAfter(startAfterDoc));
    }

    if (limitCount) {
      q = query(q, limit(limitCount));
    }

    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];

    const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

    return { docs, lastDoc };
  }
}

// Specialized managers with validation
export class UserManager extends FirestoreAdmin<User> {
  constructor() {
    super('users');
  }

  async createUser(userData: Omit<User, 'createdAt' | 'updatedAt'>): Promise<string> {
    const validatedData = userSchema.parse(userData);
    return super.create(validatedData);
  }

  async getUserByAddress(address: string): Promise<User | null> {
    const normalizedAddress = address.toLowerCase();
    return super.get(normalizedAddress);
  }

  async updateLastActive(userId: string): Promise<void> {
    await super.update(userId, {
      lastActiveAt: Timestamp.now(),
    });
  }

  async getVerifiedUsers(tier?: number): Promise<User[]> {
    const filters = [{ field: 'isVerified', operator: '==', value: true }];
    if (tier !== undefined) {
      filters.push({ field: 'tier', operator: '>=', value: tier });
    }

    const result = await super.list(filters, 'lastActiveAt', 'desc');
    return result.docs;
  }
}

export class TransactionManager extends FirestoreAdmin<Transaction> {
  constructor() {
    super('transactions');
  }

  async createTransaction(transactionData: Omit<Transaction, 'createdAt' | 'updatedAt'>): Promise<string> {
    const validatedData = transactionSchema.parse(transactionData);
    return super.create(validatedData);
  }

  async getUserTransactions(userId: string, limit?: number): Promise<Transaction[]> {
    const filters = [{ field: 'userId', operator: '==', value: userId }];
    const result = await super.list(filters, 'createdAt', 'desc', limit);
    return result.docs;
  }

  async getPendingTransactions(): Promise<Transaction[]> {
    const filters = [{ field: 'status', operator: '==', value: 'pending' }];
    const result = await super.list(filters, 'createdAt', 'asc');
    return result.docs;
  }

  async updateTransactionStatus(
    transactionId: string,
    status: Transaction['status'],
    hash?: string,
    blockNumber?: number
  ): Promise<void> {
    const updateData: Partial<Transaction> = { status };

    if (hash) updateData.hash = hash;
    if (blockNumber) updateData.blockNumber = blockNumber;
    if (status === 'confirmed') updateData.confirmedAt = Timestamp.now();

    await super.update(transactionId, updateData);
  }
}

export class PortfolioManager extends FirestoreAdmin<Portfolio> {
  constructor() {
    super('portfolios');
  }

  async getUserPortfolios(userId: string): Promise<Portfolio[]> {
    const filters = [{ field: 'userId', operator: '==', value: userId }];
    const result = await super.list(filters, 'createdAt', 'desc');
    return result.docs;
  }

  async getActivePortfolio(userId: string): Promise<Portfolio | null> {
    const filters = [
      { field: 'userId', operator: '==', value: userId },
      { field: 'isActive', operator: '==', value: true }
    ];
    const result = await super.list(filters, undefined, 'desc', 1);
    return result.docs[0] || null;
  }

  async createSnapshot(portfolioId: string): Promise<string> {
    const portfolio = await super.get(portfolioId);
    if (!portfolio) throw new Error('Portfolio not found');

    const snapshotData = {
      ...portfolio,
      isSnapshot: true,
      snapshotDate: Timestamp.now(),
      portfolioId: `${portfolio.portfolioId}_${Date.now()}`,
    };

    delete (snapshotData as any).id;
    return super.create(snapshotData);
  }
}

export class TokenManager extends FirestoreAdmin<Token> {
  constructor() {
    super('tokens');
  }

  async getSupportedTokens(chainId?: number): Promise<Token[]> {
    const filters = [{ field: 'isSupported', operator: '==', value: true }];
    if (chainId) {
      filters.push({ field: 'chainId', operator: '==', value: chainId });
    }

    const result = await super.list(filters, 'marketCap', 'desc');
    return result.docs;
  }

  async updateTokenPrice(tokenAddress: string, price: number, priceChange24h: number): Promise<void> {
    await super.update(tokenAddress, {
      price,
      priceChange24h,
      lastPriceUpdate: Timestamp.now(),
    });
  }
}

export class NotificationManager extends FirestoreAdmin<Notification> {
  constructor() {
    super('notifications');
  }

  async getUserNotifications(userId: string, unreadOnly = false): Promise<Notification[]> {
    const filters = [{ field: 'userId', operator: '==', value: userId }];
    if (unreadOnly) {
      filters.push({ field: 'isRead', operator: '==', value: false });
    }

    const result = await super.list(filters, 'createdAt', 'desc');
    return result.docs;
  }

  async markAsRead(notificationId: string): Promise<void> {
    await super.update(notificationId, {
      isRead: true,
      readAt: Timestamp.now(),
    });
  }

  async createSystemNotification(
    userId: string,
    type: Notification['type'],
    category: Notification['category'],
    title: string,
    message: string,
    priority = 1
  ): Promise<string> {
    return super.create({
      notificationId: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type,
      category,
      title,
      message,
      isRead: false,
      isPersistent: false,
      priority,
    });
  }
}

// Export manager instances
export const userManager = new UserManager();
export const transactionManager = new TransactionManager();
export const portfolioManager = new PortfolioManager();
export const tokenManager = new TokenManager();
export const notificationManager = new NotificationManager();