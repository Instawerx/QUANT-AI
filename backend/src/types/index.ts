import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    address: string;
    isVerified: boolean;
    tier: number;
  };
}

export interface MetaMaskAuthRequest {
  address: string;
  signature: string;
  message: string;
  timestamp: number;
}

export interface DepositTokensRequest {
  tokens: string[];
  amounts: string[];
  userAddress: string;
}

export interface DepositETHRequest {
  amount: string;
  userAddress: string;
}

export interface WithdrawRequest {
  token: string;
  userAddress: string;
  amount: string;
}

export interface TransferRequest {
  token: string;
  fromUser: string;
  toUser: string;
  amount: string;
}

export interface UserBalance {
  token: string;
  balance: string;
  symbol?: string;
  decimals?: number;
}

export interface ContractTransaction {
  hash: string;
  blockNumber?: number;
  gasUsed?: string;
  effectiveGasPrice?: string;
  status: 'pending' | 'success' | 'failed';
}

export interface PortfolioManagerConfig {
  contractAddress: string;
  supportedTokens: string[];
  networkRpcUrl: string;
  chainId: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface UserSession {
  address: string;
  isAuthenticated: boolean;
  lastLogin: number;
  sessionId: string;
}

export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  isSupported: boolean;
}