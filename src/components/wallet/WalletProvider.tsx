'use client';

import React from 'react';
import { Web3Provider } from '@/lib/web3/context';

interface WalletProviderProps {
  children: React.ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  return <Web3Provider>{children}</Web3Provider>;
}