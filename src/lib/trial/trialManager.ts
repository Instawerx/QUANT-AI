import { Timestamp } from 'firebase/firestore';
import { userManager, notificationManager } from '@/lib/firestore/admin';

export interface TrialUser {
  userId: string;
  email?: string;
  walletAddress: string;
  trialStartDate: Timestamp;
  trialEndDate: Timestamp;
  trialDaysRemaining: number;
  isTrialActive: boolean;
  isTrialExpired: boolean;
  hasUsedFreeTrial: boolean;
  referralCode?: string;
  referredBy?: string;
  referralEarnings: number;
  trialExtensions: TrialExtension[];
}

export interface TrialExtension {
  reason: 'referral' | 'promotion' | 'admin' | 'bug_compensation';
  daysAdded: number;
  appliedAt: Timestamp;
  appliedBy?: string;
  note?: string;
}

export interface ReferralProgram {
  referralCode: string;
  userId: string;
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number;
  referralBonusDays: number;
  createdAt: Timestamp;
}

class TrialManager {
  private readonly TRIAL_DURATION_DAYS = 30;
  private readonly MAX_FREE_TRIAL_USERS = 10000;
  private readonly REFERRAL_BONUS_DAYS = 7;
  private readonly REFERRAL_EARNINGS_PER_USER = 25; // $25 per referral

  async startFreeTrial(
    walletAddress: string,
    email?: string,
    referralCode?: string
  ): Promise<{ success: boolean; trialUser?: TrialUser; error?: string }> {
    try {
      // Check if user already exists
      const existingUser = await userManager.getUserByAddress(walletAddress);

      if (existingUser) {
        // Check if they've already used their free trial
        const trialData = await this.getTrialData(existingUser.address);
        if (trialData?.hasUsedFreeTrial) {
          return {
            success: false,
            error: 'This wallet address has already used the free trial'
          };
        }
      }

      // Check if we've reached the maximum number of free trial users
      const totalTrialUsers = await this.getTotalTrialUsersCount();
      if (totalTrialUsers >= this.MAX_FREE_TRIAL_USERS) {
        return {
          success: false,
          error: 'Free trial program has reached maximum capacity. Please check back later.'
        };
      }

      // Validate referral code if provided
      let referrer: ReferralProgram | null = null;
      if (referralCode) {
        referrer = await this.getReferralProgram(referralCode);
        if (!referrer) {
          return {
            success: false,
            error: 'Invalid referral code'
          };
        }
      }

      const now = Timestamp.now();
      const trialEndDate = new Date(now.toDate().getTime() + (this.TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000));

      // Create or update user
      let userId: string;
      if (existingUser) {
        userId = existingUser.address;
        // Update user with trial information
        await userManager.update(userId, {
          email: email || existingUser.email,
          tier: 1, // Premium tier for trial
          isVerified: true,
          tradingEnabled: true,
        });
      } else {
        // Create new user
        userId = await userManager.createUser({
          address: walletAddress,
          email,
          tier: 1, // Premium tier for trial
          isVerified: true,
          tradingEnabled: true,
          language: 'en',
          theme: 'dark',
          notifications: {
            email: true,
            push: true,
            trading: true,
            security: true,
          },
          riskLevel: 5,
          lastLogin: now,
          loginCount: 1,
          isSuspended: false,
          lastActiveAt: now,
        });
      }

      // Create trial data
      const trialUser: TrialUser = {
        userId,
        email,
        walletAddress,
        trialStartDate: now,
        trialEndDate: Timestamp.fromDate(trialEndDate),
        trialDaysRemaining: this.TRIAL_DURATION_DAYS,
        isTrialActive: true,
        isTrialExpired: false,
        hasUsedFreeTrial: true,
        referredBy: referrer?.userId,
        referralEarnings: 0,
        trialExtensions: [],
      };

      // Generate referral code for the new user
      trialUser.referralCode = await this.generateReferralCode(userId);

      // Save trial data (you would implement this with your preferred storage)
      await this.saveTrialData(trialUser);

      // Process referral if applicable
      if (referrer) {
        await this.processReferral(referrer, userId);
      }

      // Send welcome notification
      await notificationManager.createSystemNotification(
        userId,
        'success',
        'system',
        'Welcome to QuantTrade AI!',
        `Your 30-day free trial has started. Enjoy premium trading features and see the power of our AI-driven platform.`,
        5
      );

      // Send trial reminder notifications
      await this.scheduleTrialReminders(userId);

      return { success: true, trialUser };

    } catch (error) {
      console.error('Error starting free trial:', error);
      return {
        success: false,
        error: 'Failed to start free trial. Please try again.'
      };
    }
  }

  async getTrialData(userId: string): Promise<TrialUser | null> {
    // This would be implemented with your storage solution
    // For now, we'll return a mock implementation
    return null;
  }

  async updateTrialData(userId: string, updates: Partial<TrialUser>): Promise<void> {
    // Implementation would update trial data in storage
  }

  async checkTrialStatus(userId: string): Promise<{
    isValid: boolean;
    daysRemaining: number;
    isExpired: boolean;
    canExtend: boolean;
  }> {
    const trialData = await this.getTrialData(userId);

    if (!trialData) {
      return {
        isValid: false,
        daysRemaining: 0,
        isExpired: true,
        canExtend: false
      };
    }

    const now = new Date();
    const endDate = trialData.trialEndDate.toDate();
    const remainingMs = endDate.getTime() - now.getTime();
    const daysRemaining = Math.max(0, Math.ceil(remainingMs / (24 * 60 * 60 * 1000)));

    const isExpired = daysRemaining <= 0;
    const isValid = trialData.isTrialActive && !isExpired;

    return {
      isValid,
      daysRemaining,
      isExpired,
      canExtend: daysRemaining <= 3 && !isExpired // Can extend when 3 days or less remaining
    };
  }

  async extendTrial(
    userId: string,
    daysToAdd: number,
    reason: TrialExtension['reason'],
    appliedBy?: string,
    note?: string
  ): Promise<{ success: boolean; newEndDate?: Date; error?: string }> {
    try {
      const trialData = await this.getTrialData(userId);
      if (!trialData) {
        return { success: false, error: 'Trial data not found' };
      }

      const extension: TrialExtension = {
        reason,
        daysAdded: daysToAdd,
        appliedAt: Timestamp.now(),
        appliedBy,
        note
      };

      const currentEndDate = trialData.trialEndDate.toDate();
      const newEndDate = new Date(currentEndDate.getTime() + (daysToAdd * 24 * 60 * 60 * 1000));

      await this.updateTrialData(userId, {
        trialEndDate: Timestamp.fromDate(newEndDate),
        trialDaysRemaining: trialData.trialDaysRemaining + daysToAdd,
        trialExtensions: [...trialData.trialExtensions, extension],
        isTrialExpired: false,
        isTrialActive: true
      });

      // Send notification
      await notificationManager.createSystemNotification(
        userId,
        'success',
        'system',
        'Trial Extended!',
        `Your trial has been extended by ${daysToAdd} days. Reason: ${reason}`,
        4
      );

      return { success: true, newEndDate };

    } catch (error) {
      console.error('Error extending trial:', error);
      return { success: false, error: 'Failed to extend trial' };
    }
  }

  async generateReferralCode(userId: string): Promise<string> {
    // Generate a unique 8-character referral code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';

    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // In a real implementation, you'd check for uniqueness and regenerate if needed
    return `QT${code}`;
  }

  async getReferralProgram(referralCode: string): Promise<ReferralProgram | null> {
    // Implementation would fetch referral program data
    return null;
  }

  async processReferral(referrer: ReferralProgram, newUserId: string): Promise<void> {
    try {
      // Update referrer stats
      await this.updateReferralProgram(referrer.referralCode, {
        totalReferrals: referrer.totalReferrals + 1,
        activeReferrals: referrer.activeReferrals + 1,
        totalEarnings: referrer.totalEarnings + this.REFERRAL_EARNINGS_PER_USER
      });

      // Extend referrer's trial
      await this.extendTrial(
        referrer.userId,
        this.REFERRAL_BONUS_DAYS,
        'referral',
        'system',
        `Referral bonus for inviting user ${newUserId}`
      );

      // Send notification to referrer
      await notificationManager.createSystemNotification(
        referrer.userId,
        'success',
        'system',
        'Referral Bonus Earned!',
        `You've earned ${this.REFERRAL_BONUS_DAYS} extra trial days and $${this.REFERRAL_EARNINGS_PER_USER} for your successful referral!`,
        4
      );

    } catch (error) {
      console.error('Error processing referral:', error);
    }
  }

  async updateReferralProgram(referralCode: string, updates: Partial<ReferralProgram>): Promise<void> {
    // Implementation would update referral program data
  }

  async getTotalTrialUsersCount(): Promise<number> {
    // Implementation would count total trial users
    // For now, return a mock count that's below the limit
    return 8543;
  }

  async saveTrialData(trialUser: TrialUser): Promise<void> {
    // Implementation would save trial data to your storage solution
  }

  async scheduleTrialReminders(userId: string): Promise<void> {
    // Schedule notifications for 7 days, 3 days, and 1 day before trial expires
    const reminderDays = [7, 3, 1];

    for (const days of reminderDays) {
      // In a real implementation, you'd use a job queue or scheduled function
      setTimeout(async () => {
        await notificationManager.createSystemNotification(
          userId,
          'warning',
          'system',
          `Trial Ending in ${days} Day${days > 1 ? 's' : ''}`,
          `Your free trial will end in ${days} day${days > 1 ? 's' : ''}. Upgrade now to continue enjoying premium features!`,
          3
        );
      }, (30 - days) * 24 * 60 * 60 * 1000); // Schedule for appropriate time
    }
  }

  async expireTrial(userId: string): Promise<void> {
    try {
      // Update trial status
      await this.updateTrialData(userId, {
        isTrialActive: false,
        isTrialExpired: true,
        trialDaysRemaining: 0
      });

      // Downgrade user to basic tier
      await userManager.update(userId, {
        tier: 0,
        tradingEnabled: false
      });

      // Send expiration notification
      await notificationManager.createSystemNotification(
        userId,
        'info',
        'system',
        'Trial Expired',
        'Your free trial has ended. Upgrade to a paid plan to continue using premium features.',
        5
      );

    } catch (error) {
      console.error('Error expiring trial:', error);
    }
  }

  // Admin functions
  async getTrialStatistics(): Promise<{
    totalTrialUsers: number;
    activeTrials: number;
    expiredTrials: number;
    conversionRate: number;
    totalReferrals: number;
    averageTrialDuration: number;
  }> {
    // Implementation would fetch and calculate trial statistics
    return {
      totalTrialUsers: 8543,
      activeTrials: 2847,
      expiredTrials: 5696,
      conversionRate: 23.5,
      totalReferrals: 1264,
      averageTrialDuration: 28.3
    };
  }

  async searchTrialUsers(query: string, page: number = 1, limit: number = 50): Promise<{
    users: TrialUser[];
    total: number;
    hasMore: boolean;
  }> {
    // Implementation would search trial users
    return {
      users: [],
      total: 0,
      hasMore: false
    };
  }
}

export const trialManager = new TrialManager();