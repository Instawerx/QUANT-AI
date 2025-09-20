"use client";

import { useState, useCallback } from 'react';
import { ethers } from 'ethers';

export type TransactionStatus = 'idle' | 'pending' | 'success' | 'error';

export type Transaction = {
  id: string;
  hash?: string;
  status: TransactionStatus;
  type: string;
  description: string;
  timestamp: number;
  error?: string;
  receipt?: ethers.TransactionReceipt;
};

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Add a new transaction
  const addTransaction = useCallback((
    type: string,
    description: string,
    id?: string
  ): string => {
    const transactionId = id || `${type}-${Date.now()}`;
    const newTransaction: Transaction = {
      id: transactionId,
      status: 'pending',
      type,
      description,
      timestamp: Date.now(),
    };

    setTransactions(prev => [newTransaction, ...prev]);
    return transactionId;
  }, []);

  // Update transaction with hash
  const updateTransactionHash = useCallback((id: string, hash: string) => {
    setTransactions(prev =>
      prev.map(tx =>
        tx.id === id ? { ...tx, hash } : tx
      )
    );
  }, []);

  // Mark transaction as successful
  const markTransactionSuccess = useCallback((
    id: string,
    receipt: ethers.TransactionReceipt
  ) => {
    setTransactions(prev =>
      prev.map(tx =>
        tx.id === id
          ? { ...tx, status: 'success' as TransactionStatus, receipt }
          : tx
      )
    );
  }, []);

  // Mark transaction as failed
  const markTransactionError = useCallback((id: string, error: string) => {
    setTransactions(prev =>
      prev.map(tx =>
        tx.id === id
          ? { ...tx, status: 'error' as TransactionStatus, error }
          : tx
      )
    );
  }, []);

  // Execute a transaction with automatic status tracking
  const executeTransaction = useCallback(async (
    type: string,
    description: string,
    transactionPromise: () => Promise<ethers.ContractTransactionResponse>
  ): Promise<ethers.TransactionReceipt> => {
    const txId = addTransaction(type, description);

    try {
      // Execute the transaction
      const tx = await transactionPromise();
      updateTransactionHash(txId, tx.hash);

      // Wait for confirmation
      const receipt = await tx.wait();

      if (receipt && receipt.status === 1) {
        markTransactionSuccess(txId, receipt);
        return receipt;
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error: any) {
      console.error('Transaction error:', error);
      const errorMessage = error.reason || error.message || 'Transaction failed';
      markTransactionError(txId, errorMessage);
      throw new Error(errorMessage);
    }
  }, [addTransaction, updateTransactionHash, markTransactionSuccess, markTransactionError]);

  // Clear transactions
  const clearTransactions = useCallback(() => {
    setTransactions([]);
  }, []);

  // Remove specific transaction
  const removeTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  }, []);

  // Get pending transactions
  const pendingTransactions = transactions.filter(tx => tx.status === 'pending');
  const completedTransactions = transactions.filter(tx => tx.status !== 'pending');

  return {
    transactions,
    pendingTransactions,
    completedTransactions,
    addTransaction,
    updateTransactionHash,
    markTransactionSuccess,
    markTransactionError,
    executeTransaction,
    clearTransactions,
    removeTransaction,
    hasPendingTransactions: pendingTransactions.length > 0,
  };
}