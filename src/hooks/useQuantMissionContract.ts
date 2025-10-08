'use client';

import { useContract } from '@/lib/web3/hooks/useContract';
import { useChainId } from 'wagmi';
import { type Address } from 'viem';

// QuantMissionAI Contract ABI - key functions we need
const QUANT_MISSION_ABI = [
  {
    type: 'function',
    name: 'confirmMissionAndContribute',
    stateMutability: 'payable',
    inputs: [
      { name: 'missionType', type: 'string' },
      { name: 'agreementHash', type: 'bytes32' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'getUserContributions',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        components: [
          { name: 'contributor', type: 'address' },
          { name: 'amount', type: 'uint256' },
          { name: 'gasBuffer', type: 'uint256' },
          { name: 'timestamp', type: 'uint256' },
          { name: 'missionType', type: 'string' },
          { name: 'agreementConfirmed', type: 'bool' },
          { name: 'agreementHash', type: 'bytes32' },
        ],
      },
    ],
  },
  {
    type: 'function',
    name: 'getAvailableMissions',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string[]' }],
  },
  {
    type: 'function',
    name: 'getPlatformMetrics',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'totalContributions', type: 'uint256' },
          { name: 'totalContributors', type: 'uint256' },
          { name: 'totalMissionFunding', type: 'uint256' },
          { name: 'totalGasBufferReserved', type: 'uint256' },
        ],
      },
    ],
  },
  {
    type: 'function',
    name: 'hasUserContributed',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'getUserTotalContribution',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'event',
    name: 'MissionContribution',
    inputs: [
      { name: 'contributor', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
      { name: 'gasBuffer', type: 'uint256', indexed: false },
      { name: 'missionType', type: 'string', indexed: false },
      { name: 'agreementHash', type: 'bytes32', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'FundsTransferredToTreasury',
    inputs: [
      { name: 'contributor', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
      { name: 'missionType', type: 'string', indexed: false },
    ],
  },
] as const;

import { CONTRACT_ADDRESSES } from '@/lib/web3/config';

export function useQuantMissionContract() {
  const chainId = useChainId();
  const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]?.QUANT_MISSION;

  return useContract({
    address: contractAddress as Address,
    abi: QUANT_MISSION_ABI,
  });
}

// Agreement hash that's registered in the deployed contracts
export const AGREEMENT_HASH = (process.env.NEXT_PUBLIC_AGREEMENT_HASH ||
  '0x18de0bfdb189cd36e2ee6e9f5085a9bdcf18ca64b8c8e3a749b6ec8ac60ecb1d') as `0x${string}`;
