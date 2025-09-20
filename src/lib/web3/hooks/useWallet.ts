'use client';

import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { useCallback, useMemo } from 'react';
import type { Address } from 'viem';

export interface WalletState {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  isReconnecting: boolean;

  // Account info
  address?: Address;
  chainId?: number;

  // Balance info
  balance?: {
    decimals: number;
    formatted: string;
    symbol: string;
    value: bigint;
  };

  // Connection methods
  connect: (connectorId?: string) => void;
  disconnect: () => void;

  // Available connectors
  connectors: Array<{
    id: string;
    name: string;
    icon?: string;
    ready: boolean;
  }>;

  // Error state
  error?: Error;
}

export function useWallet(): WalletState {
  // Wagmi hooks
  const {
    address,
    isConnected,
    isConnecting,
    isReconnecting,
    chainId,
  } = useAccount();

  const {
    connect: wagmiConnect,
    connectors,
    error: connectError,
  } = useConnect();

  const { disconnect: wagmiDisconnect } = useDisconnect();

  const {
    data: balance,
    error: balanceError,
  } = useBalance({
    address,
  });

  // Connect function
  const connect = useCallback((connectorId?: string) => {
    const connector = connectorId
      ? connectors.find(c => c.id === connectorId)
      : connectors[0]; // Default to first connector (MetaMask)

    if (connector) {
      wagmiConnect({ connector });
    }
  }, [connectors, wagmiConnect]);

  // Disconnect function
  const disconnect = useCallback(() => {
    wagmiDisconnect();
  }, [wagmiDisconnect]);

  // Format connectors
  const formattedConnectors = useMemo(() => {
    return connectors.map(connector => ({
      id: connector.id,
      name: connector.name,
      icon: connector.icon,
      ready: connector.type !== 'injected' || typeof window !== 'undefined',
    }));
  }, [connectors]);

  // Combined error
  const error = connectError || balanceError;

  return {
    // Connection state
    isConnected,
    isConnecting,
    isReconnecting,

    // Account info
    address,
    chainId,

    // Balance info
    balance,

    // Connection methods
    connect,
    disconnect,

    // Available connectors
    connectors: formattedConnectors,

    // Error state
    error,
  };
}