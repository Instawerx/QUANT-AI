'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface WalletConnectButtonProps {
  onConnect: (address: string) => void;
  prize?: { amount: number; currency: string };
}

export default function WalletConnectButton({ onConnect, prize }: WalletConnectButtonProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

  const detectMetaMask = async (): Promise<boolean> => {
    // Check if ethereum provider exists
    if (typeof window.ethereum !== 'undefined') {
      return true;
    }

    // Wait for MetaMask to inject (it does this asynchronously)
    return new Promise((resolve) => {
      let attempts = 0;
      const maxAttempts = 10;

      const checkInterval = setInterval(() => {
        attempts++;

        if (typeof window.ethereum !== 'undefined') {
          clearInterval(checkInterval);
          resolve(true);
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          resolve(false);
        }
      }, 100); // Check every 100ms
    });
  };

  const connectWallet = async () => {
    setIsConnecting(true);

    try {
      // Wait for MetaMask detection
      const hasMetaMask = await detectMetaMask();

      if (hasMetaMask && window.ethereum) {
        // Request account access - this will open MetaMask popup
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });

        const address = accounts[0];
        setConnectedAddress(address);
        onConnect(address);

        // Switch to correct network if needed (BSC or Ethereum)
        // This would be implemented based on prize.currency
      } else {
        alert('MetaMask not detected. Please install MetaMask browser extension and refresh the page.');
        window.open('https://metamask.io/download/', '_blank');
      }
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);

      // Handle specific error cases
      if (error.code === 4001) {
        alert('You rejected the connection request. Please try again and approve the connection.');
      } else if (error.code === -32002) {
        alert('Connection request already pending. Please check your MetaMask extension.');
      } else {
        alert('Failed to connect wallet. Please try again.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  if (connectedAddress) {
    return (
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500 rounded-full px-6 py-3"
        >
          <span className="text-2xl">✅</span>
          <span className="text-green-400 font-bold">
            {connectedAddress.slice(0, 6)}...{connectedAddress.slice(-4)}
          </span>
        </motion.div>

        {prize && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/50 rounded-xl p-6"
          >
            <p className="text-gray-400 mb-2">Your prize is being sent to:</p>
            <p className="text-xl font-mono text-purple-400">{connectedAddress}</p>
            <motion.div
              className="mt-4 flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-400 text-sm">Processing transaction...</span>
            </motion.div>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <motion.button
      onClick={connectWallet}
      disabled={isConnecting}
      whileHover={!isConnecting ? { scale: 1.02, boxShadow: '0 0 40px rgba(251,191,36,0.4)' } : {}}
      whileTap={!isConnecting ? { scale: 0.98 } : {}}
      className={`
        relative w-full py-6 px-8 rounded-2xl font-bold text-xl
        transition-all duration-300 overflow-hidden tracking-wide
        ${
          isConnecting
            ? 'bg-gradient-to-r from-slate-700 to-slate-800 cursor-not-allowed text-slate-400'
            : 'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-slate-900 shadow-lg shadow-amber-500/30'
        }
      `}
    >
      {!isConnecting && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
        />
      )}
      {isConnecting ? (
        <span className="flex items-center justify-center gap-3 relative z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-6 h-6 border-3 border-slate-400 border-t-transparent rounded-full"
          />
          Connecting Wallet...
        </span>
      ) : (
        <span className="flex items-center justify-center gap-3 relative z-10">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Collect Now
          {prize && (
            <span className="ml-2 font-bold">
              - {prize.amount} {prize.currency}
            </span>
          )}
        </span>
      )}
    </motion.button>
  );
}
