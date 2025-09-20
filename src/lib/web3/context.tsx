'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './config';

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Web3 Context
interface Web3ContextType {
  // Add any additional context values here
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function useWeb3Context(): Web3ContextType {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3Context must be used within a Web3Provider');
  }
  return context;
}

// Web3 Provider Props
interface Web3ProviderProps {
  children: ReactNode;
}

// Web3 Provider Component
export function Web3Provider({ children }: Web3ProviderProps) {
  const contextValue: Web3ContextType = {
    // Add any context values here
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Web3Context.Provider value={contextValue}>
          {children}
        </Web3Context.Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}