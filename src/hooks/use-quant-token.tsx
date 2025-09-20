"use client";

import { useState, useCallback, useEffect } from 'react';
import { ethers, Contract } from 'ethers';
import { useWallet } from '@/context/wallet-context';
import { getContractAddress } from '@/lib/contract-addresses';

// QuantToken ABI (subset for frontend use)
const QUANT_TOKEN_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function getAvailableRewards() view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
];

type TokenInfo = {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
};

export function useQuantToken() {
  const { account, chainId, getContract, isConnected } = useWallet();
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [availableRewards, setAvailableRewards] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);

  // Get contract instance
  const contract = getContract(
    chainId ? getContractAddress(chainId, 'QuantToken') : '',
    QUANT_TOKEN_ABI
  );

  // Fetch token info
  const fetchTokenInfo = useCallback(async () => {
    if (!contract) return;

    try {
      setIsLoading(true);
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals(),
        contract.totalSupply(),
      ]);

      setTokenInfo({
        name,
        symbol,
        decimals: Number(decimals),
        totalSupply: ethers.formatUnits(totalSupply, decimals),
      });
    } catch (error) {
      console.error('Error fetching token info:', error);
    } finally {
      setIsLoading(false);
    }
  }, [contract]);

  // Fetch user balance
  const fetchBalance = useCallback(async () => {
    if (!contract || !account) return;

    try {
      const balance = await contract.balanceOf(account);
      const decimals = tokenInfo?.decimals || 18;
      setBalance(ethers.formatUnits(balance, decimals));
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance('0');
    }
  }, [contract, account, tokenInfo?.decimals]);

  // Fetch available rewards
  const fetchAvailableRewards = useCallback(async () => {
    if (!contract) return;

    try {
      const rewards = await contract.getAvailableRewards();
      const decimals = tokenInfo?.decimals || 18;
      setAvailableRewards(ethers.formatUnits(rewards, decimals));
    } catch (error) {
      console.error('Error fetching available rewards:', error);
      setAvailableRewards('0');
    }
  }, [contract, tokenInfo?.decimals]);

  // Transfer tokens
  const transfer = useCallback(async (to: string, amount: string) => {
    if (!contract || !tokenInfo) {
      throw new Error('Contract not available');
    }

    try {
      const amountWei = ethers.parseUnits(amount, tokenInfo.decimals);
      const tx = await contract.transfer(to, amountWei);

      // Wait for confirmation
      const receipt = await tx.wait();
      return {
        hash: tx.hash,
        receipt,
        success: receipt.status === 1,
      };
    } catch (error: any) {
      console.error('Transfer error:', error);
      throw new Error(error.reason || error.message || 'Transfer failed');
    }
  }, [contract, tokenInfo]);

  // Approve tokens
  const approve = useCallback(async (spender: string, amount: string) => {
    if (!contract || !tokenInfo) {
      throw new Error('Contract not available');
    }

    try {
      const amountWei = ethers.parseUnits(amount, tokenInfo.decimals);
      const tx = await contract.approve(spender, amountWei);

      const receipt = await tx.wait();
      return {
        hash: tx.hash,
        receipt,
        success: receipt.status === 1,
      };
    } catch (error: any) {
      console.error('Approve error:', error);
      throw new Error(error.reason || error.message || 'Approval failed');
    }
  }, [contract, tokenInfo]);

  // Check allowance
  const getAllowance = useCallback(async (owner: string, spender: string) => {
    if (!contract || !tokenInfo) return '0';

    try {
      const allowance = await contract.allowance(owner, spender);
      return ethers.formatUnits(allowance, tokenInfo.decimals);
    } catch (error) {
      console.error('Error fetching allowance:', error);
      return '0';
    }
  }, [contract, tokenInfo]);

  // Refresh all data
  const refresh = useCallback(() => {
    if (isConnected && contract) {
      fetchTokenInfo();
      fetchBalance();
      fetchAvailableRewards();
    }
  }, [isConnected, contract, fetchTokenInfo, fetchBalance, fetchAvailableRewards]);

  // Initial data fetch
  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    // Data
    tokenInfo,
    balance,
    availableRewards,
    isLoading,
    contract,

    // Actions
    transfer,
    approve,
    getAllowance,
    refresh,

    // Utils
    formatAmount: (amount: string, decimals?: number) =>
      ethers.formatUnits(amount, decimals || tokenInfo?.decimals || 18),
    parseAmount: (amount: string, decimals?: number) =>
      ethers.parseUnits(amount, decimals || tokenInfo?.decimals || 18),
  };
}