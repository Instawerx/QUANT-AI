'use client';

import React from 'react';
import { useChainId, useSwitchChain, useAccount } from 'wagmi';
import { mainnet, sepolia, hardhat } from 'wagmi/chains';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Globe, ChevronDown, Check, AlertTriangle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const SUPPORTED_CHAINS = [
  {
    ...mainnet,
    name: 'Ethereum Mainnet',
    icon: '🔷',
    color: 'blue',
  },
  {
    ...sepolia,
    name: 'Sepolia Testnet',
    icon: '🧪',
    color: 'purple',
  },
  {
    ...hardhat,
    name: 'Local Hardhat',
    icon: '🔨',
    color: 'gray',
  },
];

export function NetworkSwitcher() {
  const chainId = useChainId();
  const { isConnected } = useAccount();
  const { switchChain, isPending, error } = useSwitchChain();

  const currentChain = SUPPORTED_CHAINS.find(chain => chain.id === chainId);
  const isUnsupportedChain = !currentChain && isConnected;

  const handleSwitchChain = async (targetChainId: number) => {
    if (chainId === targetChainId) return;

    try {
      await switchChain({ chainId: targetChainId });
      toast({
        title: 'Network Switched',
        description: `Successfully switched to ${SUPPORTED_CHAINS.find(c => c.id === targetChainId)?.name}`,
      });
    } catch (error: any) {
      toast({
        title: 'Network Switch Failed',
        description: error?.message || 'Failed to switch network',
        variant: 'destructive',
      });
    }
  };

  if (!isConnected) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={isUnsupportedChain ? 'destructive' : 'outline'}
          size="sm"
          disabled={isPending}
          className="flex items-center gap-2"
        >
          {isUnsupportedChain ? (
            <>
              <AlertTriangle className="h-4 w-4" />
              <span>Unsupported Network</span>
            </>
          ) : (
            <>
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">{currentChain?.icon}</span>
              <span className="hidden md:inline">{currentChain?.name}</span>
              <span className="md:hidden">
                {currentChain?.name.split(' ')[0]}
              </span>
            </>
          )}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {isUnsupportedChain && (
          <div className="px-2 py-2 mb-2 bg-destructive/10 rounded-md">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-sm text-destructive font-medium">
                Unsupported Network
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Please switch to a supported network to continue.
            </p>
          </div>
        )}

        {SUPPORTED_CHAINS.map((chain) => {
          const isCurrentChain = chainId === chain.id;
          const isMainnet = chain.id === mainnet.id;

          return (
            <DropdownMenuItem
              key={chain.id}
              onClick={() => handleSwitchChain(chain.id)}
              disabled={isPending || isCurrentChain}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{chain.icon}</span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{chain.name}</span>
                  <span className="text-xs text-muted-foreground">
                    Chain ID: {chain.id}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {isMainnet && (
                  <Badge variant="default" className="text-xs">
                    Mainnet
                  </Badge>
                )}
                {isCurrentChain && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
            </DropdownMenuItem>
          );
        })}

        {error && (
          <div className="px-2 py-2 mt-2 border-t">
            <p className="text-xs text-red-500">{error.message}</p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}