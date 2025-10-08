'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContractApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string;
}

export function ContractApprovalModal({ isOpen, onClose, walletAddress }: ContractApprovalModalProps) {
  const { toast } = useToast();
  const [isApproving, setIsApproving] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const QUANT_MISSION_ADDRESS = process.env.NEXT_PUBLIC_QUANT_MISSION_CONTRACT || '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

  useEffect(() => {
    if (isOpen && walletAddress) {
      checkApprovalStatus();
    }
  }, [isOpen, walletAddress]);

  const checkApprovalStatus = () => {
    const approved = localStorage.getItem(`contract_approved_${walletAddress}`);
    if (approved === 'true') {
      setIsApproved(true);
    }
  };

  const handleApprove = async () => {
    setIsApproving(true);

    try {
      if (!(window as any).ethereum) {
        throw new Error('MetaMask not detected');
      }

      // Simulate approval for now (replace with actual contract interaction)
      await new Promise(resolve => setTimeout(resolve, 2000));

      localStorage.setItem(`contract_approved_${walletAddress}`, 'true');
      setIsApproved(true);

      toast({
        title: '🎉 Contract Approved!',
        description: 'You can now access all QuantTrade AI features.',
      });

      setTimeout(() => onClose(), 2000);

    } catch (error: any) {
      toast({
        title: 'Approval Failed',
        description: error.message || 'Transaction was rejected',
        variant: 'destructive',
      });
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isApproved ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                You're All Set!
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 text-purple-500" />
                Approve QuantMission Contract
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isApproved ? (
              'Your wallet is ready to use all QuantTrade AI features.'
            ) : (
              'Enable all features including Spin to Win, trading, and rewards.'
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!isApproved && (
            <>
              <Alert className="border-purple-500/50 bg-purple-500/10">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <AlertDescription className="text-sm">
                  <strong>Unlock Premium Features:</strong>
                  <ul className="mt-2 space-y-1 list-disc list-inside">
                    <li>🎰 Spin to Win participation</li>
                    <li>🤖 AI trading algorithms</li>
                    <li>🎁 QuantMission rewards</li>
                    <li>📊 Advanced analytics</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="flex gap-3">
                <Button
                  onClick={handleApprove}
                  disabled={isApproving}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isApproving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Approve Contract
                    </>
                  )}
                </Button>
                <Button onClick={onClose} variant="outline" disabled={isApproving}>
                  Later
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Safe & Secure • {QUANT_MISSION_ADDRESS.slice(0, 6)}...{QUANT_MISSION_ADDRESS.slice(-4)}
              </p>
            </>
          )}

          {isApproved && (
            <div className="text-center py-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4 animate-pulse" />
              <p className="text-lg font-semibold mb-2">Welcome to QuantTrade AI!</p>
              <p className="text-sm text-muted-foreground mb-4">
                All features are now unlocked
              </p>
              <Button onClick={onClose} className="w-full">
                Start Trading
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
