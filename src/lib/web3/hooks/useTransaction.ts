'use client';

import { useState, useCallback } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { parseEther, type Address, type Hash } from 'viem';
import { toast } from '@/components/ui/use-toast';

export interface TransactionState {
  isPending: boolean;
  isConfirming: boolean;
  isConfirmed: boolean;
  error?: Error;
  hash?: Hash;
  receipt?: any;
}

export interface UseTransactionReturn {
  state: TransactionState;
  writeContract: (params: any) => void;
  reset: () => void;
}

export function useTransaction(): UseTransactionReturn {
  const [hash, setHash] = useState<Hash>();
  const chainId = useChainId();

  const {
    writeContract: writeContractMutation,
    isPending,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract({
    mutation: {
      onSuccess: (hash) => {
        setHash(hash);
        toast({
          title: 'Transaction Submitted',
          description: 'Your transaction has been submitted to the blockchain.',
        });
      },
      onError: (error) => {
        console.error('Transaction error:', error);
        toast({
          title: 'Transaction Failed',
          description: error.message || 'Failed to submit transaction.',
          variant: 'destructive',
        });
      },
    },
  });

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    data: receipt,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash,
    },
  });

  // Handle transaction confirmation
  React.useEffect(() => {
    if (isConfirmed && receipt) {
      toast({
        title: 'Transaction Confirmed',
        description: 'Your transaction has been confirmed on the blockchain.',
      });
    }
  }, [isConfirmed, receipt]);

  const writeContract = useCallback((params: any) => {
    writeContractMutation(params);
  }, [writeContractMutation]);

  const reset = useCallback(() => {
    setHash(undefined);
    resetWrite();
  }, [resetWrite]);

  const state: TransactionState = {
    isPending,
    isConfirming,
    isConfirmed,
    error: writeError || confirmError,
    hash,
    receipt,
  };

  return {
    state,
    writeContract,
    reset,
  };
}

// Specific transaction hooks
export function useSendETH() {
  const transaction = useTransaction();

  const sendETH = useCallback((to: Address, value: string) => {
    transaction.writeContract({
      to,
      value: parseEther(value),
    });
  }, [transaction]);

  return {
    ...transaction,
    sendETH,
  };
}

export function useCreatePortfolio() {
  const transaction = useTransaction();
  const chainId = useChainId();

  const createPortfolio = useCallback((
    contractAddress: Address,
    abi: any[],
    name: string,
    tokens: Address[],
    weights: bigint[]
  ) => {
    transaction.writeContract({
      address: contractAddress,
      abi,
      functionName: 'createPortfolio',
      args: [name, tokens, weights],
    });
  }, [transaction]);

  return {
    ...transaction,
    createPortfolio,
  };
}

export function useStartTrading() {
  const transaction = useTransaction();

  const startTrading = useCallback((
    contractAddress: Address,
    abi: any[],
    strategy: string,
    amount: bigint,
    riskLevel: number
  ) => {
    transaction.writeContract({
      address: contractAddress,
      abi,
      functionName: 'startTrading',
      args: [strategy, amount, riskLevel],
    });
  }, [transaction]);

  return {
    ...transaction,
    startTrading,
  };
}