'use client';

import { http, createConfig } from 'wagmi';
import { mainnet, sepolia, hardhat } from 'wagmi/chains';
import { coinbaseWallet, metaMask, walletConnect } from 'wagmi/connectors';

// Project ID for WalletConnect
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id';

// Wallet connectors
const connectors = [
  metaMask(),
  coinbaseWallet({
    appName: 'QuantTrade AI',
    appLogoUrl: '/logo.png',
  }),
  walletConnect({
    projectId,
    metadata: {
      name: 'QuantTrade AI',
      description: 'AI-Powered Cryptocurrency Trading Platform',
      url: 'https://quanttrade-ai.com',
      icons: ['/logo.png'],
    },
  }),
];

// Supported chains
const chains = [mainnet, sepolia, hardhat] as const;

// Create wagmi config
export const config = createConfig({
  chains,
  connectors,
  transports: {
    [mainnet.id]: http(`https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`),
    [sepolia.id]: http(`https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`),
    [hardhat.id]: http('http://127.0.0.1:8545'),
  },
  ssr: true,
});

// Contract addresses
export const CONTRACT_ADDRESSES = {
  [mainnet.id]: {
    PORTFOLIO_MANAGER: process.env.NEXT_PUBLIC_PORTFOLIO_MANAGER_MAINNET || '',
    TRADING_BOT: process.env.NEXT_PUBLIC_TRADING_BOT_MAINNET || '',
    TOKEN: process.env.NEXT_PUBLIC_TOKEN_MAINNET || '',
  },
  [sepolia.id]: {
    PORTFOLIO_MANAGER: process.env.NEXT_PUBLIC_PORTFOLIO_MANAGER_SEPOLIA || '',
    TRADING_BOT: process.env.NEXT_PUBLIC_TRADING_BOT_SEPOLIA || '',
    TOKEN: process.env.NEXT_PUBLIC_TOKEN_SEPOLIA || '',
  },
  [hardhat.id]: {
    PORTFOLIO_MANAGER: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    TRADING_BOT: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    TOKEN: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  },
} as const;

// Supported tokens
export const SUPPORTED_TOKENS = {
  [mainnet.id]: [
    {
      address: '0x0000000000000000000000000000000000000000' as const,
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 18,
      logoUrl: '/tokens/eth.png',
    },
    {
      address: '0xA0b86a33E6441c8C7517F2c7C57E8b6F8e8C7C8c' as const,
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      logoUrl: '/tokens/usdc.png',
    },
    {
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' as const,
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
      logoUrl: '/tokens/usdt.png',
    },
  ],
  [sepolia.id]: [
    {
      address: '0x0000000000000000000000000000000000000000' as const,
      symbol: 'ETH',
      name: 'Sepolia Ethereum',
      decimals: 18,
      logoUrl: '/tokens/eth.png',
    },
  ],
  [hardhat.id]: [
    {
      address: '0x0000000000000000000000000000000000000000' as const,
      symbol: 'ETH',
      name: 'Hardhat Ethereum',
      decimals: 18,
      logoUrl: '/tokens/eth.png',
    },
  ],
} as const;

export type SupportedChainId = keyof typeof CONTRACT_ADDRESSES;
export type SupportedToken = (typeof SUPPORTED_TOKENS)[SupportedChainId][number];