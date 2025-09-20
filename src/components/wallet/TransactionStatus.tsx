'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  ExternalLink,
  Copy
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import type { TransactionState } from '@/lib/web3/hooks/useTransaction';

interface TransactionStatusProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: TransactionState;
  title?: string;
  description?: string;
}

export function TransactionStatus({
  isOpen,
  onClose,
  transaction,
  title = 'Transaction Status',
  description = 'Track the progress of your transaction',
}: TransactionStatusProps) {
  const { isPending, isConfirming, isConfirmed, error, hash, receipt } = transaction;

  const getStatus = () => {
    if (error) return 'error';
    if (isConfirmed) return 'confirmed';
    if (isConfirming) return 'confirming';
    if (isPending) return 'pending';
    return 'idle';
  };

  const getStatusIcon = () => {
    const status = getStatus();
    const iconClass = "h-6 w-6";

    switch (status) {
      case 'confirmed':
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      case 'error':
        return <XCircle className={`${iconClass} text-red-500`} />;
      case 'confirming':
        return <Clock className={`${iconClass} text-blue-500`} />;
      case 'pending':
        return <Loader2 className={`${iconClass} text-yellow-500 animate-spin`} />;
      default:
        return <Clock className={`${iconClass} text-gray-500`} />;
    }
  };

  const getStatusText = () => {
    const status = getStatus();

    switch (status) {
      case 'confirmed':
        return 'Transaction Confirmed';
      case 'error':
        return 'Transaction Failed';
      case 'confirming':
        return 'Confirming Transaction';
      case 'pending':
        return 'Transaction Pending';
      default:
        return 'Ready to Submit';
    }
  };

  const getStatusDescription = () => {
    const status = getStatus();

    switch (status) {
      case 'confirmed':
        return 'Your transaction has been successfully confirmed on the blockchain.';
      case 'error':
        return error?.message || 'Something went wrong with your transaction.';
      case 'confirming':
        return 'Your transaction is being confirmed on the blockchain. This may take a few moments.';
      case 'pending':
        return 'Your transaction is being submitted to the blockchain.';
      default:
        return 'Your transaction is ready to be submitted.';
    }
  };

  const getProgress = () => {
    const status = getStatus();

    switch (status) {
      case 'confirmed':
        return 100;
      case 'confirming':
        return 75;
      case 'pending':
        return 25;
      case 'error':
        return 0;
      default:
        return 0;
    }
  };

  const copyHash = async () => {
    if (hash) {
      await navigator.clipboard.writeText(hash);
      toast({
        title: 'Transaction Hash Copied',
        description: 'Transaction hash copied to clipboard',
      });
    }
  };

  const openInExplorer = () => {
    if (hash) {
      // This would be dynamic based on the current network
      window.open(`https://etherscan.io/tx/${hash}`, '_blank');
    }
  };

  const getStatusVariant = () => {
    const status = getStatus();

    switch (status) {
      case 'confirmed':
        return 'success' as const;
      case 'error':
        return 'destructive' as const;
      case 'confirming':
        return 'default' as const;
      case 'pending':
        return 'secondary' as const;
      default:
        return 'outline' as const;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon()}
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status Badge */}
          <div className="flex justify-center">
            <Badge variant={getStatusVariant()} className="px-3 py-1">
              {getStatusText()}
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={getProgress()} className="h-2" />
            <p className="text-sm text-muted-foreground text-center">
              {getStatusDescription()}
            </p>
          </div>

          {/* Transaction Hash */}
          {hash && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Transaction Hash:</label>
              <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                <code className="text-xs flex-1 truncate">
                  {hash}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyHash}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={openInExplorer}
                  className="h-6 w-6 p-0"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          {/* Receipt Information */}
          {receipt && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Transaction Details:</label>
              <div className="space-y-1 p-2 bg-muted rounded-md text-xs">
                <div className="flex justify-between">
                  <span>Block Number:</span>
                  <span>{receipt.blockNumber?.toString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Gas Used:</span>
                  <span>{receipt.gasUsed?.toString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={receipt.status === 'success' ? 'text-green-600' : 'text-red-600'}>
                    {receipt.status}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Error Details */}
          {error && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-red-600">Error Details:</label>
              <div className="p-2 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">{error.message}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            {isConfirmed && (
              <Button onClick={onClose} className="flex-1">
                Done
              </Button>
            )}
            {error && (
              <Button onClick={onClose} variant="outline" className="flex-1">
                Close
              </Button>
            )}
            {(isPending || isConfirming) && (
              <Button onClick={onClose} variant="outline" className="flex-1">
                Close
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}