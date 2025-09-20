import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import {
  initializeTestEnvironment,
  RulesTestEnvironment,
  assertFails,
  assertSucceeds,
} from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, addDoc } from 'firebase/firestore';

describe('Firestore Security Rules', () => {
  let testEnv: RulesTestEnvironment;

  beforeEach(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'test-project',
      firestore: {
        rules: `
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            function isAuthenticated() {
              return request.auth != null;
            }

            function getUserId() {
              return request.auth.uid;
            }

            function isOwner(userId) {
              return isAuthenticated() && getUserId() == userId;
            }

            function isAdmin() {
              return isAuthenticated() &&
                get(/databases/$(database)/documents/users/$(getUserId())).data.tier >= 3;
            }

            function isVerifiedUser() {
              return isAuthenticated() &&
                get(/databases/$(database)/documents/users/$(getUserId())).data.isVerified == true;
            }

            function isNotSuspended() {
              return isAuthenticated() &&
                get(/databases/$(database)/documents/users/$(getUserId())).data.isSuspended != true;
            }

            function hasMinimumTier(minTier) {
              return isAuthenticated() &&
                get(/databases/$(database)/documents/users/$(getUserId())).data.tier >= minTier;
            }

            function isValidAddress(address) {
              return address is string &&
                address.matches('^0x[a-fA-F0-9]{40}$') &&
                address == address.lower();
            }

            function hasRequiredUserFields(data) {
              return data.keys().hasAll(['address', 'tier', 'isVerified', 'isSuspended',
                                        'tradingEnabled', 'language', 'createdAt', 'updatedAt']) &&
                     isValidAddress(data.address) &&
                     data.tier is int && data.tier >= 0 && data.tier <= 3 &&
                     data.isVerified is bool &&
                     data.isSuspended is bool &&
                     data.tradingEnabled is bool &&
                     data.language is string;
            }

            match /users/{userId} {
              allow read: if isOwner(userId) || isAdmin();
              allow create: if isAuthenticated() &&
                              userId == getUserId() &&
                              hasRequiredUserFields(resource.data) &&
                              resource.data.address == userId &&
                              resource.data.tier == 0;
              allow update: if (isOwner(userId) || isAdmin()) &&
                              hasRequiredUserFields(resource.data) &&
                              resource.data.address == resource.id &&
                              (isAdmin() || resource.data.tier == request.resource.data.tier);
              allow delete: if isAdmin();
            }

            match /tokens/{tokenAddress} {
              allow read: if true;
              allow write: if isAdmin();
            }

            match /transactions/{transactionId} {
              allow read: if isAuthenticated() &&
                            (resource.data.userId == getUserId() || isAdmin());
              allow create: if isAuthenticated() &&
                              isVerifiedUser() &&
                              isNotSuspended() &&
                              resource.data.userId == getUserId() &&
                              resource.data.type in ['deposit', 'withdraw', 'transfer', 'trade', 'reward'] &&
                              resource.data.status in ['pending', 'confirmed', 'failed', 'cancelled'];
              allow update: if isAdmin() ||
                              (isAuthenticated() &&
                               resource.data.userId == getUserId() &&
                               resource.data.status == 'pending');
              allow delete: if isAdmin();
            }

            match /trading_sessions/{sessionId} {
              allow read: if isAuthenticated() &&
                            (resource.data.userId == getUserId() || isAdmin());
              allow create: if isAuthenticated() &&
                              isVerifiedUser() &&
                              isNotSuspended() &&
                              hasMinimumTier(1) &&
                              resource.data.userId == getUserId();
              allow update: if isAuthenticated() &&
                              (resource.data.userId == getUserId() || isAdmin());
              allow delete: if isAuthenticated() &&
                              (resource.data.userId == getUserId() || isAdmin());
            }

            match /system_config/{configKey} {
              allow read: if resource.data.isPublic == true || isAdmin();
              allow write: if isAdmin();
            }
          }
        }
        `,
      },
    });
  });

  afterEach(async () => {
    await testEnv.cleanup();
  });

  describe('Users Collection', () => {
    test('unauthenticated users cannot read user data', async () => {
      const unauthedDb = testEnv.unauthenticatedContext().firestore();
      const userRef = doc(unauthedDb, 'users/user123');

      await assertFails(getDoc(userRef));
    });

    test('users can read their own data', async () => {
      const authedDb = testEnv.authenticatedContext('user123').firestore();

      // First create the user document
      const adminDb = testEnv.authenticatedContext('admin', { tier: 3 }).firestore();
      await setDoc(doc(adminDb, 'users/user123'), {
        address: '0x1234567890123456789012345678901234567890',
        tier: 0,
        isVerified: true,
        isSuspended: false,
        tradingEnabled: true,
        language: 'en',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const userRef = doc(authedDb, 'users/user123');
      await assertSucceeds(getDoc(userRef));
    });

    test('users cannot read other users data', async () => {
      const authedDb = testEnv.authenticatedContext('user123').firestore();

      // Create another user's document
      const adminDb = testEnv.authenticatedContext('admin', { tier: 3 }).firestore();
      await setDoc(doc(adminDb, 'users/user456'), {
        address: '0x4567890123456789012345678901234567890123',
        tier: 0,
        isVerified: true,
        isSuspended: false,
        tradingEnabled: true,
        language: 'en',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const otherUserRef = doc(authedDb, 'users/user456');
      await assertFails(getDoc(otherUserRef));
    });

    test('new users can create their own profile with tier 0', async () => {
      const authedDb = testEnv.authenticatedContext('0x1234567890123456789012345678901234567890').firestore();
      const userRef = doc(authedDb, 'users/0x1234567890123456789012345678901234567890');

      await assertSucceeds(
        setDoc(userRef, {
          address: '0x1234567890123456789012345678901234567890',
          tier: 0,
          isVerified: false,
          isSuspended: false,
          tradingEnabled: false,
          language: 'en',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      );
    });

    test('new users cannot create profile with tier > 0', async () => {
      const authedDb = testEnv.authenticatedContext('0x1234567890123456789012345678901234567890').firestore();
      const userRef = doc(authedDb, 'users/0x1234567890123456789012345678901234567890');

      await assertFails(
        setDoc(userRef, {
          address: '0x1234567890123456789012345678901234567890',
          tier: 1, // Not allowed for new users
          isVerified: false,
          isSuspended: false,
          tradingEnabled: false,
          language: 'en',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      );
    });

    test('users cannot promote themselves', async () => {
      const authedDb = testEnv.authenticatedContext('user123').firestore();

      // Setup existing user
      const adminDb = testEnv.authenticatedContext('admin', { tier: 3 }).firestore();
      await setDoc(doc(adminDb, 'users/user123'), {
        address: '0x1234567890123456789012345678901234567890',
        tier: 0,
        isVerified: true,
        isSuspended: false,
        tradingEnabled: true,
        language: 'en',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const userRef = doc(authedDb, 'users/user123');

      await assertFails(
        updateDoc(userRef, {
          tier: 1, // Cannot self-promote
          updatedAt: new Date(),
        })
      );
    });

    test('admins can read any user data', async () => {
      const adminDb = testEnv.authenticatedContext('admin', { tier: 3 }).firestore();

      // Create admin user first
      await setDoc(doc(adminDb, 'users/admin'), {
        address: '0xadmin567890123456789012345678901234567890',
        tier: 3,
        isVerified: true,
        isSuspended: false,
        tradingEnabled: true,
        language: 'en',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Create regular user
      await setDoc(doc(adminDb, 'users/user123'), {
        address: '0x1234567890123456789012345678901234567890',
        tier: 0,
        isVerified: true,
        isSuspended: false,
        tradingEnabled: true,
        language: 'en',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const userRef = doc(adminDb, 'users/user123');
      await assertSucceeds(getDoc(userRef));
    });
  });

  describe('Tokens Collection', () => {
    test('anyone can read token data', async () => {
      const unauthedDb = testEnv.unauthenticatedContext().firestore();
      const tokenRef = doc(unauthedDb, 'tokens/0xtoken');

      // Create token first with admin
      const adminDb = testEnv.authenticatedContext('admin', { tier: 3 }).firestore();
      await setDoc(doc(adminDb, 'users/admin'), {
        address: '0xadmin567890123456789012345678901234567890',
        tier: 3,
        isVerified: true,
        isSuspended: false,
        tradingEnabled: true,
        language: 'en',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await setDoc(doc(adminDb, 'tokens/0xtoken'), {
        symbol: 'TEST',
        name: 'Test Token',
        price: 100,
        isSupported: true,
      });

      await assertSucceeds(getDoc(tokenRef));
    });

    test('only admins can write token data', async () => {
      const userDb = testEnv.authenticatedContext('user123').firestore();
      const tokenRef = doc(userDb, 'tokens/0xtoken');

      await assertFails(
        setDoc(tokenRef, {
          symbol: 'TEST',
          name: 'Test Token',
          price: 100,
          isSupported: true,
        })
      );
    });
  });

  describe('Transactions Collection', () => {
    beforeEach(async () => {
      // Setup users for transaction tests
      const adminDb = testEnv.authenticatedContext('admin', { tier: 3 }).firestore();

      await setDoc(doc(adminDb, 'users/admin'), {
        address: '0xadmin567890123456789012345678901234567890',
        tier: 3,
        isVerified: true,
        isSuspended: false,
        tradingEnabled: true,
        language: 'en',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await setDoc(doc(adminDb, 'users/user123'), {
        address: '0x1234567890123456789012345678901234567890',
        tier: 1,
        isVerified: true,
        isSuspended: false,
        tradingEnabled: true,
        language: 'en',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await setDoc(doc(adminDb, 'users/unverified'), {
        address: '0xunverified123456789012345678901234567890',
        tier: 0,
        isVerified: false,
        isSuspended: false,
        tradingEnabled: false,
        language: 'en',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    test('verified users can create transactions', async () => {
      const userDb = testEnv.authenticatedContext('user123').firestore();
      const transactionRef = doc(userDb, 'transactions/tx123');

      await assertSucceeds(
        setDoc(transactionRef, {
          userId: 'user123',
          type: 'deposit',
          status: 'pending',
          amount: '1.0',
          tokenSymbol: 'ETH',
        })
      );
    });

    test('unverified users cannot create transactions', async () => {
      const unverifiedDb = testEnv.authenticatedContext('unverified').firestore();
      const transactionRef = doc(unverifiedDb, 'transactions/tx123');

      await assertFails(
        setDoc(transactionRef, {
          userId: 'unverified',
          type: 'deposit',
          status: 'pending',
          amount: '1.0',
          tokenSymbol: 'ETH',
        })
      );
    });

    test('users can only create transactions for themselves', async () => {
      const userDb = testEnv.authenticatedContext('user123').firestore();
      const transactionRef = doc(userDb, 'transactions/tx123');

      await assertFails(
        setDoc(transactionRef, {
          userId: 'otheruser', // Wrong user ID
          type: 'deposit',
          status: 'pending',
          amount: '1.0',
          tokenSymbol: 'ETH',
        })
      );
    });

    test('users can only read their own transactions', async () => {
      const adminDb = testEnv.authenticatedContext('admin', { tier: 3 }).firestore();

      // Create transaction for user123
      await setDoc(doc(adminDb, 'transactions/tx123'), {
        userId: 'user123',
        type: 'deposit',
        status: 'confirmed',
        amount: '1.0',
        tokenSymbol: 'ETH',
      });

      const userDb = testEnv.authenticatedContext('user123').firestore();
      const ownTransactionRef = doc(userDb, 'transactions/tx123');
      await assertSucceeds(getDoc(ownTransactionRef));

      // Create transaction for different user
      await setDoc(doc(adminDb, 'transactions/tx456'), {
        userId: 'otheruser',
        type: 'deposit',
        status: 'confirmed',
        amount: '1.0',
        tokenSymbol: 'ETH',
      });

      const otherTransactionRef = doc(userDb, 'transactions/tx456');
      await assertFails(getDoc(otherTransactionRef));
    });
  });

  describe('Trading Sessions Collection', () => {
    beforeEach(async () => {
      // Setup users for trading session tests
      const adminDb = testEnv.authenticatedContext('admin', { tier: 3 }).firestore();

      await setDoc(doc(adminDb, 'users/admin'), {
        address: '0xadmin567890123456789012345678901234567890',
        tier: 3,
        isVerified: true,
        isSuspended: false,
        tradingEnabled: true,
        language: 'en',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await setDoc(doc(adminDb, 'users/premium'), {
        address: '0xpremium123456789012345678901234567890',
        tier: 1, // Premium tier
        isVerified: true,
        isSuspended: false,
        tradingEnabled: true,
        language: 'en',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await setDoc(doc(adminDb, 'users/basic'), {
        address: '0xbasic567890123456789012345678901234567890',
        tier: 0, // Basic tier
        isVerified: true,
        isSuspended: false,
        tradingEnabled: true,
        language: 'en',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    test('premium users can create trading sessions', async () => {
      const premiumDb = testEnv.authenticatedContext('premium').firestore();
      const sessionRef = doc(premiumDb, 'trading_sessions/session123');

      await assertSucceeds(
        setDoc(sessionRef, {
          userId: 'premium',
          strategy: 'conservative',
          status: 'active',
          riskLevel: 3,
        })
      );
    });

    test('basic tier users cannot create trading sessions', async () => {
      const basicDb = testEnv.authenticatedContext('basic').firestore();
      const sessionRef = doc(basicDb, 'trading_sessions/session123');

      await assertFails(
        setDoc(sessionRef, {
          userId: 'basic',
          strategy: 'conservative',
          status: 'active',
          riskLevel: 3,
        })
      );
    });
  });

  describe('System Config Collection', () => {
    beforeEach(async () => {
      const adminDb = testEnv.authenticatedContext('admin', { tier: 3 }).firestore();

      await setDoc(doc(adminDb, 'users/admin'), {
        address: '0xadmin567890123456789012345678901234567890',
        tier: 3,
        isVerified: true,
        isSuspended: false,
        tradingEnabled: true,
        language: 'en',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await setDoc(doc(adminDb, 'users/user123'), {
        address: '0x1234567890123456789012345678901234567890',
        tier: 0,
        isVerified: true,
        isSuspended: false,
        tradingEnabled: true,
        language: 'en',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Create public config
      await setDoc(doc(adminDb, 'system_config/public_setting'), {
        key: 'public_setting',
        value: 'public_value',
        isPublic: true,
      });

      // Create private config
      await setDoc(doc(adminDb, 'system_config/private_setting'), {
        key: 'private_setting',
        value: 'private_value',
        isPublic: false,
      });
    });

    test('anyone can read public config', async () => {
      const userDb = testEnv.authenticatedContext('user123').firestore();
      const publicConfigRef = doc(userDb, 'system_config/public_setting');

      await assertSucceeds(getDoc(publicConfigRef));
    });

    test('regular users cannot read private config', async () => {
      const userDb = testEnv.authenticatedContext('user123').firestore();
      const privateConfigRef = doc(userDb, 'system_config/private_setting');

      await assertFails(getDoc(privateConfigRef));
    });

    test('admins can read all config', async () => {
      const adminDb = testEnv.authenticatedContext('admin', { tier: 3 }).firestore();
      const privateConfigRef = doc(adminDb, 'system_config/private_setting');

      await assertSucceeds(getDoc(privateConfigRef));
    });

    test('only admins can write config', async () => {
      const userDb = testEnv.authenticatedContext('user123').firestore();
      const configRef = doc(userDb, 'system_config/new_setting');

      await assertFails(
        setDoc(configRef, {
          key: 'new_setting',
          value: 'new_value',
          isPublic: true,
        })
      );
    });
  });
});