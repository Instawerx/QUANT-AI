"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { BrowserProvider, ethers, Contract } from 'ethers';

type WalletState = {
  account: string | null;
  balance: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  chainId: number | null;
  provider: BrowserProvider | null;
  signer: ethers.Signer | null;
};

type WalletContextType = WalletState & {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToSepolia: () => Promise<void>;
  getContract: (address: string, abi: any[]) => Contract | null;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const SEPOLIA_CHAIN_ID = 11155111;
const SEPOLIA_PARAMS = {
  chainId: '0xaa36a7',
  chainName: 'Sepolia test network',
  nativeCurrency: {
    name: 'SepoliaETH',
    symbol: 'SepoliaETH',
    decimals: 18,
  },
  rpcUrls: ['https://sepolia.infura.io/v3/'],
  blockExplorerUrls: ['https://sepolia.etherscan.io'],
};

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletState, setWalletState] = useState<WalletState>({
    account: null,
    balance: null,
    isConnecting: false,
    isConnected: false,
    chainId: null,
    provider: null,
    signer: null,
  });

  const updateBalance = useCallback(async (provider: BrowserProvider, account: string) => {
    try {
      const balance = await provider.getBalance(account);
      setWalletState(prev => ({
        ...prev,
        balance: ethers.formatEther(balance),
      }));
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  }, []);

  const connectWallet = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      alert('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    setWalletState(prev => ({ ...prev, isConnecting: true }));

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const account = accounts[0];
      const network = await provider.getNetwork();
      const signer = await provider.getSigner();

      setWalletState(prev => ({
        ...prev,
        account,
        provider,
        signer,
        chainId: Number(network.chainId),
        isConnected: true,
        isConnecting: false,
      }));

      await updateBalance(provider, account);

      // Save connection state
      localStorage.setItem('walletConnected', 'true');

    } catch (error) {
      console.error('Error connecting wallet:', error);
      setWalletState(prev => ({ ...prev, isConnecting: false }));
      alert('Failed to connect wallet. Please try again.');
    }
  }, [updateBalance]);

  const disconnectWallet = useCallback(() => {
    setWalletState({
      account: null,
      balance: null,
      isConnecting: false,
      isConnected: false,
      chainId: null,
      provider: null,
      signer: null,
    });
    localStorage.removeItem('walletConnected');
  }, []);

  const switchToSepolia = useCallback(async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_PARAMS.chainId }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [SEPOLIA_PARAMS],
          });
        } catch (addError) {
          console.error('Error adding Sepolia network:', addError);
        }
      } else {
        console.error('Error switching to Sepolia:', switchError);
      }
    }
  }, []);

  const getContract = useCallback((address: string, abi: any[]) => {
    if (!walletState.signer) return null;
    return new Contract(address, abi, walletState.signer);
  }, [walletState.signer]);

  // Handle account changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== walletState.account) {
        connectWallet();
      }
    };

    const handleChainChanged = (chainId: string) => {
      setWalletState(prev => ({
        ...prev,
        chainId: parseInt(chainId, 16),
      }));
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [walletState.account, connectWallet, disconnectWallet]);

  // Auto-connect on page load
  useEffect(() => {
    const wasConnected = localStorage.getItem('walletConnected');
    if (wasConnected === 'true' && typeof window !== 'undefined' && window.ethereum) {
      connectWallet();
    }
  }, [connectWallet]);

  const contextValue: WalletContextType = {
    ...walletState,
    connectWallet,
    disconnectWallet,
    switchToSepolia,
    getContract,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

// Add global ethereum type
declare global {
  interface Window {
    ethereum?: any;
  }
}
