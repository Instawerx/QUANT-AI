"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function ConnectWalletButton() {
  const { toast } = useToast();
  const [account, setAccount] = useState<string | null>(null);

  const handleConnect = async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask Not Detected",
        description: "Please install the MetaMask extension to connect your wallet.",
        variant: "destructive",
      });
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        toast({
          title: "Wallet Connected",
          description: `Connected with address: ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`,
        });
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
      toast({
        title: "Connection Failed",
        description: "The wallet connection was cancelled or failed.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = () => {
    setAccount(null);
    toast({
      title: "Wallet Disconnected",
      description: "You have successfully disconnected your wallet.",
    });
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  if (account) {
    return (
      <Button onClick={handleDisconnect} variant="outline" className="border-green-500 text-green-500 hover:bg-green-500/10 transition-all">
         <Wallet className="mr-2 h-4 w-4" />
        {formatAddress(account)}
      </Button>
    );
  }

  return (
    <Button onClick={handleConnect} variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all">
      <Wallet className="mr-2 h-4 w-4" />
      Connect Wallet
    </Button>
  );
}
