"use client";

import { useState, useCallback, useEffect } from 'react';
import { useWallet } from '@/context/wallet-context';
import { getContractAddress } from '@/lib/contract-addresses';

// AccessRegistry ABI (subset for frontend use)
const ACCESS_REGISTRY_ABI = [
  'function verifiedUsers(address) view returns (bool)',
  'function suspendedUsers(address) view returns (bool)',
  'function userTiers(address) view returns (uint256)',
  'function canTrade(address user) view returns (bool)',
  'function isVerified(address user) view returns (bool)',
  'function isSuspended(address user) view returns (bool)',
  'function getUserTier(address user) view returns (uint256)',
  'function hasRole(bytes32 role, address account) view returns (bool)',
  'function ADMIN_ROLE() view returns (bytes32)',
  'function TRADING_MANAGER_ROLE() view returns (bytes32)',
  'function RISK_MANAGER_ROLE() view returns (bytes32)',
  'function USER_MANAGER_ROLE() view returns (bytes32)',
  'event UserVerified(address indexed user)',
  'event UserSuspended(address indexed user)',
  'event UserTierUpdated(address indexed user, uint256 tier)',
];

type UserStatus = {
  isVerified: boolean;
  isSuspended: boolean;
  canTrade: boolean;
  tier: number;
};

type UserRoles = {
  isAdmin: boolean;
  isTradingManager: boolean;
  isRiskManager: boolean;
  isUserManager: boolean;
};

export function useAccessRegistry() {
  const { account, chainId, getContract, isConnected } = useWallet();
  const [userStatus, setUserStatus] = useState<UserStatus>({
    isVerified: false,
    isSuspended: false,
    canTrade: false,
    tier: 0,
  });
  const [userRoles, setUserRoles] = useState<UserRoles>({
    isAdmin: false,
    isTradingManager: false,
    isRiskManager: false,
    isUserManager: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Get contract instance
  const contract = getContract(
    chainId ? getContractAddress(chainId, 'AccessRegistry') : '',
    ACCESS_REGISTRY_ABI
  );

  // Fetch user status
  const fetchUserStatus = useCallback(async (userAddress?: string) => {
    if (!contract) return;

    const address = userAddress || account;
    if (!address) return;

    try {
      setIsLoading(true);
      const [isVerified, isSuspended, canTrade, tier] = await Promise.all([
        contract.isVerified(address),
        contract.isSuspended(address),
        contract.canTrade(address),
        contract.getUserTier(address),
      ]);

      setUserStatus({
        isVerified,
        isSuspended,
        canTrade,
        tier: Number(tier),
      });
    } catch (error) {
      console.error('Error fetching user status:', error);
      setUserStatus({
        isVerified: false,
        isSuspended: false,
        canTrade: false,
        tier: 0,
      });
    } finally {
      setIsLoading(false);
    }
  }, [contract, account]);

  // Fetch user roles
  const fetchUserRoles = useCallback(async (userAddress?: string) => {
    if (!contract) return;

    const address = userAddress || account;
    if (!address) return;

    try {
      const [adminRole, tradingManagerRole, riskManagerRole, userManagerRole] = await Promise.all([
        contract.ADMIN_ROLE(),
        contract.TRADING_MANAGER_ROLE(),
        contract.RISK_MANAGER_ROLE(),
        contract.USER_MANAGER_ROLE(),
      ]);

      const [isAdmin, isTradingManager, isRiskManager, isUserManager] = await Promise.all([
        contract.hasRole(adminRole, address),
        contract.hasRole(tradingManagerRole, address),
        contract.hasRole(riskManagerRole, address),
        contract.hasRole(userManagerRole, address),
      ]);

      setUserRoles({
        isAdmin,
        isTradingManager,
        isRiskManager,
        isUserManager,
      });
    } catch (error) {
      console.error('Error fetching user roles:', error);
      setUserRoles({
        isAdmin: false,
        isTradingManager: false,
        isRiskManager: false,
        isUserManager: false,
      });
    }
  }, [contract, account]);

  // Check if user can perform specific actions
  const checkPermissions = useCallback(async (userAddress?: string) => {
    const address = userAddress || account;
    if (!address) return false;

    return {
      canTrade: userStatus.canTrade,
      canManageUsers: userRoles.isUserManager || userRoles.isAdmin,
      canManageTrading: userRoles.isTradingManager || userRoles.isAdmin,
      canManageRisk: userRoles.isRiskManager || userRoles.isAdmin,
      isAdmin: userRoles.isAdmin,
    };
  }, [account, userStatus.canTrade, userRoles]);

  // Get tier name
  const getTierName = useCallback((tier: number) => {
    switch (tier) {
      case 0:
        return 'Basic';
      case 1:
        return 'Premium';
      case 2:
        return 'Pro';
      default:
        return 'Unknown';
    }
  }, []);

  // Refresh all data
  const refresh = useCallback((userAddress?: string) => {
    if (isConnected && contract) {
      fetchUserStatus(userAddress);
      fetchUserRoles(userAddress);
    }
  }, [isConnected, contract, fetchUserStatus, fetchUserRoles]);

  // Initial data fetch
  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    // Data
    userStatus,
    userRoles,
    isLoading,
    contract,

    // Actions
    fetchUserStatus,
    fetchUserRoles,
    checkPermissions,
    refresh,

    // Utils
    getTierName,

    // Status helpers
    isVerifiedUser: userStatus.isVerified,
    isSuspendedUser: userStatus.isSuspended,
    canUserTrade: userStatus.canTrade,
    userTier: userStatus.tier,
    userTierName: getTierName(userStatus.tier),
  };
}