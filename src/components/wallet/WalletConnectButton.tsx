'use client';

import React from 'react';
import { useWallet } from '@/lib/web3/hooks/useWallet';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export function WalletConnectButton() {
  const {
    isConnected,
    isConnecting,
    address,
    balance,
    connectors,
    connect,
    disconnect,
    error,
  } = useWallet();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatBalance = (balance?: { formatted: string; symbol: string }) => {
    if (!balance) return '0 ETH';
    const value = parseFloat(balance.formatted);
    return `${value.toFixed(4)} ${balance.symbol}`;
  };

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      toast({
        title: 'Address Copied',
        description: 'Wallet address copied to clipboard',
      });
    }
  };

  const openInExplorer = () => {
    if (address) {
      window.open(`https://etherscan.io/address/${address}`, '_blank');
    }
  };

  // If not connected, show connection options
  if (!isConnected) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            disabled={isConnecting}
            className="flex items-center gap-2"
          >
            <Wallet className="h-4 w-4" />
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {connectors.map((connector) => (
            <DropdownMenuItem
              key={connector.id}
              onClick={() => connect(connector.id)}
              disabled={!connector.ready}
              className="flex items-center gap-2 cursor-pointer"
            >
              {connector.icon && (
                <img
                  src={connector.icon}
                  alt={connector.name}
                  className="h-5 w-5"
                />
              )}
              <span>{connector.name}</span>
              {!connector.ready && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  Not Available
                </Badge>
              )}
            </DropdownMenuItem>
          ))}
          {error && (
            <>
              <DropdownMenuSeparator />
              <div className="px-2 py-1">
                <p className="text-sm text-red-500">{error.message}</p>
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // If connected, show wallet info and actions
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">
              {address && formatAddress(address)}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatBalance(balance)}
            </span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="px-2 py-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Connected</span>
            <Badge variant="success" className="text-xs">
              ● Active
            </Badge>
          </div>
          <div className="mt-1">
            <p className="text-xs text-muted-foreground">
              {address && formatAddress(address)}
            </p>
            <p className="text-xs text-muted-foreground">
              Balance: {formatBalance(balance)}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={copyAddress} className="cursor-pointer">
          <Copy className="h-4 w-4 mr-2" />
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem onClick={openInExplorer} className="cursor-pointer">
          <ExternalLink className="h-4 w-4 mr-2" />
          View on Explorer
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={disconnect}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}