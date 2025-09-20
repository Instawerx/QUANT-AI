'use client';

import { usePublicClient, useWalletClient, useChainId } from 'wagmi';
import { getContract, type Address, type Abi } from 'viem';
import { useMemo } from 'react';
import { CONTRACT_ADDRESSES } from '../config';

export interface ContractHookParams {
  address?: Address;
  abi: Abi;
}

export function useContract({ address, abi }: ContractHookParams) {
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  // Create read-only contract instance
  const readContract = useMemo(() => {
    if (!address || !publicClient) return null;

    return getContract({
      address,
      abi,
      client: publicClient,
    });
  }, [address, abi, publicClient]);

  // Create write contract instance
  const writeContract = useMemo(() => {
    if (!address || !walletClient) return null;

    return getContract({
      address,
      abi,
      client: walletClient,
    });
  }, [address, abi, walletClient]);

  return {
    readContract,
    writeContract,
    chainId,
  };
}

// Hook for specific contract types
export function usePortfolioManagerContract() {
  const chainId = useChainId();
  const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]?.PORTFOLIO_MANAGER;

  // This would be the actual ABI from your compiled contract
  const portfolioManagerAbi = [
    {
      type: 'function',
      name: 'createPortfolio',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'name', type: 'string' },
        { name: 'tokens', type: 'address[]' },
        { name: 'weights', type: 'uint256[]' },
      ],
      outputs: [{ name: 'portfolioId', type: 'uint256' }],
    },
    {
      type: 'function',
      name: 'getPortfolio',
      stateMutability: 'view',
      inputs: [{ name: 'portfolioId', type: 'uint256' }],
      outputs: [
        { name: 'name', type: 'string' },
        { name: 'owner', type: 'address' },
        { name: 'totalValue', type: 'uint256' },
        { name: 'tokens', type: 'address[]' },
        { name: 'balances', type: 'uint256[]' },
      ],
    },
    {
      type: 'function',
      name: 'getUserPortfolios',
      stateMutability: 'view',
      inputs: [{ name: 'user', type: 'address' }],
      outputs: [{ name: 'portfolioIds', type: 'uint256[]' }],
    },
    {
      type: 'event',
      name: 'PortfolioCreated',
      inputs: [
        { name: 'portfolioId', type: 'uint256', indexed: true },
        { name: 'owner', type: 'address', indexed: true },
        { name: 'name', type: 'string', indexed: false },
      ],
    },
  ] as const;

  return useContract({
    address: contractAddress as Address,
    abi: portfolioManagerAbi,
  });
}

export function useTradingBotContract() {
  const chainId = useChainId();
  const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]?.TRADING_BOT;

  // Trading bot contract ABI
  const tradingBotAbi = [
    {
      type: 'function',
      name: 'startTrading',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'strategy', type: 'string' },
        { name: 'amount', type: 'uint256' },
        { name: 'riskLevel', type: 'uint8' },
      ],
      outputs: [{ name: 'sessionId', type: 'uint256' }],
    },
    {
      type: 'function',
      name: 'stopTrading',
      stateMutability: 'nonpayable',
      inputs: [{ name: 'sessionId', type: 'uint256' }],
      outputs: [],
    },
    {
      type: 'function',
      name: 'getTradingSession',
      stateMutability: 'view',
      inputs: [{ name: 'sessionId', type: 'uint256' }],
      outputs: [
        { name: 'owner', type: 'address' },
        { name: 'strategy', type: 'string' },
        { name: 'startAmount', type: 'uint256' },
        { name: 'currentAmount', type: 'uint256' },
        { name: 'isActive', type: 'bool' },
        { name: 'startTime', type: 'uint256' },
      ],
    },
    {
      type: 'function',
      name: 'getUserSessions',
      stateMutability: 'view',
      inputs: [{ name: 'user', type: 'address' }],
      outputs: [{ name: 'sessionIds', type: 'uint256[]' }],
    },
    {
      type: 'event',
      name: 'TradingStarted',
      inputs: [
        { name: 'sessionId', type: 'uint256', indexed: true },
        { name: 'owner', type: 'address', indexed: true },
        { name: 'strategy', type: 'string', indexed: false },
        { name: 'amount', type: 'uint256', indexed: false },
      ],
    },
    {
      type: 'event',
      name: 'TradingStopped',
      inputs: [
        { name: 'sessionId', type: 'uint256', indexed: true },
        { name: 'finalAmount', type: 'uint256', indexed: false },
      ],
    },
  ] as const;

  return useContract({
    address: contractAddress as Address,
    abi: tradingBotAbi,
  });
}