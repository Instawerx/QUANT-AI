"use client";
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export function ConnectWalletButton() {
  const { toast } = useToast();

  const handleConnect = () => {
    // In a real app, this would trigger the wallet connection logic.
    // e.g., using wagmi or ethers.js
    toast({
      title: "Connecting Wallet",
      description: "Please check your Metamask extension.",
    });
  };

  return (
    <Button onClick={handleConnect} variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all">
      <Wallet className="mr-2 h-4 w-4" />
      Connect Wallet
    </Button>
  );
}
