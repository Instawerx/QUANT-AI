import admin from 'firebase-admin';
import { config } from '@/utils/config';
import { log } from '@/utils/logger';

// Initialize Firebase Admin SDK
let app: admin.app.App;

export function initializeFirebase() {
  try {
    if (admin.apps.length === 0) {
      if (config.firebase.serviceAccountPath) {
        // Use service account file
        app = admin.initializeApp({
          credential: admin.credential.cert(config.firebase.serviceAccountPath),
          projectId: config.firebase.projectId,
        });
      } else {
        // Use default credentials (for Cloud Run deployment)
        app = admin.initializeApp({
          projectId: config.firebase.projectId,
        });
      }
      log.info('Firebase Admin SDK initialized successfully');
    } else {
      app = admin.apps[0] as admin.app.App;
    }
  } catch (error) {
    log.error('Failed to initialize Firebase Admin SDK', { error });
    throw error;
  }
}

// Get Firestore instance
export function getFirestore() {
  if (!app) {
    initializeFirebase();
  }
  return admin.firestore(app);
}

// User management functions
export class UserService {
  private db = getFirestore();

  // Create or update user in Firestore
  async createOrUpdateUser(address: string, data: Partial<{
    isVerified: boolean;
    tier: number;
    lastLogin: number;
    sessionId: string;
    balances: Record<string, string>;
    transactions: string[];
  }>) {
    try {
      const userRef = this.db.collection('users').doc(address.toLowerCase());

      await userRef.set({
        address: address.toLowerCase(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        ...data,
      }, { merge: true });

      log.info('User created/updated in Firestore', { address, data });
      return { success: true };
    } catch (error) {
      log.error('Failed to create/update user', { address, error });
      throw error;
    }
  }

  // Get user from Firestore
  async getUser(address: string) {
    try {
      const userDoc = await this.db.collection('users').doc(address.toLowerCase()).get();

      if (!userDoc.exists) {
        return null;
      }

      return userDoc.data();
    } catch (error) {
      log.error('Failed to get user', { address, error });
      throw error;
    }
  }

  // Update user balance
  async updateUserBalance(address: string, token: string, balance: string) {
    try {
      const userRef = this.db.collection('users').doc(address.toLowerCase());

      await userRef.update({
        [`balances.${token.toLowerCase()}`]: balance,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      log.info('User balance updated', { address, token, balance });
    } catch (error) {
      log.error('Failed to update user balance', { address, token, balance, error });
      throw error;
    }
  }

  // Add transaction to user's history
  async addUserTransaction(address: string, transaction: {
    hash: string;
    type: string;
    token?: string;
    amount?: string;
    timestamp: number;
    status: 'pending' | 'success' | 'failed';
  }) {
    try {
      const userRef = this.db.collection('users').doc(address.toLowerCase());

      // Add to user's transactions subcollection
      await userRef.collection('transactions').add({
        ...transaction,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Also update the main transactions collection
      await this.db.collection('transactions').doc(transaction.hash).set({
        ...transaction,
        userAddress: address.toLowerCase(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      log.transaction(transaction.hash, transaction.type, { address, transaction });
    } catch (error) {
      log.error('Failed to add user transaction', { address, transaction, error });
      throw error;
    }
  }

  // Get user transactions
  async getUserTransactions(address: string, limit: number = 50) {
    try {
      const transactionsQuery = await this.db
        .collection('users')
        .doc(address.toLowerCase())
        .collection('transactions')
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

      return transactionsQuery.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      log.error('Failed to get user transactions', { address, error });
      throw error;
    }
  }

  // Create user session
  async createSession(address: string, sessionId: string) {
    try {
      await this.createOrUpdateUser(address, {
        sessionId,
        lastLogin: Date.now(),
      });

      // Also store in sessions collection for quick lookup
      await this.db.collection('sessions').doc(sessionId).set({
        address: address.toLowerCase(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      });

      log.auth(address, 'session_created', { sessionId });
    } catch (error) {
      log.error('Failed to create session', { address, sessionId, error });
      throw error;
    }
  }

  // Validate session
  async validateSession(sessionId: string) {
    try {
      const sessionDoc = await this.db.collection('sessions').doc(sessionId).get();

      if (!sessionDoc.exists) {
        return null;
      }

      const sessionData = sessionDoc.data()!;
      const now = new Date();

      if (sessionData.expiresAt.toDate() < now) {
        // Session expired, clean up
        await this.db.collection('sessions').doc(sessionId).delete();
        return null;
      }

      return sessionData;
    } catch (error) {
      log.error('Failed to validate session', { sessionId, error });
      throw error;
    }
  }

  // Revoke session
  async revokeSession(sessionId: string) {
    try {
      await this.db.collection('sessions').doc(sessionId).delete();
      log.auth('unknown', 'session_revoked', { sessionId });
    } catch (error) {
      log.error('Failed to revoke session', { sessionId, error });
      throw error;
    }
  }
}

export const userService = new UserService();