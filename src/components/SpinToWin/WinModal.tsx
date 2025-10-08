'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Prize } from '@/types/spin';
import ShareButtons from './ShareButtons';
import WalletConnectButton from './WalletConnectButton';
import { collectPrizeNow } from '@/lib/contractInteraction';
import { BrowserProvider } from 'ethers';

interface WinModalProps {
  prize: Prize;
  onClose: () => void;
  referralCode?: string;
}

export default function WinModal({ prize, onClose, referralCode }: WinModalProps) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isCollecting, setIsCollecting] = useState(false);
  const [collectStatus, setCollectStatus] = useState<'idle' | 'collecting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    // Fire confetti on mount
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#D4AF37', '#FFD700', '#FDB813', '#FCDC00']
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#D4AF37', '#FFD700', '#FDB813', '#FCDC00']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  const handleWalletConnect = async (address: string) => {
    setWalletAddress(address);

    // Immediately trigger "Collect Now" approval prompt
    if (typeof window !== 'undefined' && window.ethereum) {
      setIsCollecting(true);
      setCollectStatus('collecting');

      try {
        const provider = new BrowserProvider(window.ethereum);

        const result = await collectPrizeNow({
          provider,
          walletAddress: address,
          prizeAmount: prize.amount,
          prizeCurrency: prize.currency,
        });

        if (result.success) {
          setCollectStatus('success');
          console.log('🎉 Prize collected successfully!', result.txHash);
        } else {
          setCollectStatus('error');
          setErrorMessage(result.error || 'Failed to collect prize');
        }
      } catch (error: any) {
        console.error('Failed to collect prize:', error);
        setCollectStatus('error');
        setErrorMessage(error.message || 'Failed to collect prize');
      } finally {
        setIsCollecting(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0.5, rotate: 10 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 max-w-2xl w-full border-2 border-amber-500/30 shadow-2xl shadow-amber-500/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Premium Trophy Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 shadow-[0_0_60px_rgba(251,191,36,0.5)]">
            <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
        </motion.div>

        {/* Executive Win Message */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-6xl font-bold text-center mb-2 tracking-tight"
        >
          <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent">
            Exceptional Win
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-slate-400 mb-8 font-light tracking-wide"
        >
          Your fortune has been secured
        </motion.p>

        {/* Premium Prize Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-10 mb-8 border border-amber-500/20 backdrop-blur-sm"
        >
          <p className="text-amber-400 text-sm text-center mb-4 tracking-widest uppercase font-semibold">Prize Award</p>
          <div className="text-7xl md:text-8xl font-bold text-center mb-2">
            <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(251,191,36,0.3)]">
              {prize.amount}
            </span>
          </div>
          <p className="text-amber-400 text-2xl text-center font-light tracking-wider">
            {prize.currency}
          </p>
        </motion.div>

        {/* Premium Connect Wallet CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <WalletConnectButton onConnect={handleWalletConnect} prize={prize} />

          {/* Collection Status */}
          {collectStatus === 'collecting' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-4 text-center"
            >
              <div className="flex items-center justify-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full"
                />
                <span className="text-blue-300 font-semibold">Please approve "Collect Now" in your wallet...</span>
              </div>
            </motion.div>
          )}

          {collectStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-500/20 border border-emerald-500/50 rounded-xl p-4 text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl">✅</span>
                <span className="text-emerald-300 font-bold">Prize Collected!</span>
              </div>
              <p className="text-emerald-200 text-sm">Transaction confirmed on blockchain</p>
            </motion.div>
          )}

          {collectStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl">⚠️</span>
                <span className="text-red-300 font-bold">Collection Failed</span>
              </div>
              <p className="text-red-200 text-sm">{errorMessage}</p>
            </motion.div>
          )}

          <p className="text-slate-400 text-center text-sm font-light">
            {collectStatus === 'idle' && !walletAddress && 'Connect wallet to collect your prize'}
            {collectStatus === 'idle' && walletAddress && 'Prize collection in progress...'}
            {collectStatus === 'collecting' && 'Awaiting wallet approval...'}
            {collectStatus === 'success' && 'Prize successfully claimed!'}
            {collectStatus === 'error' && 'Please try again or contact support'}
          </p>
        </motion.div>

        {/* Premium Share Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 pt-6 border-t border-slate-700/50"
        >
          <p className="text-slate-300 text-center mb-4 font-light tracking-wide">Share your achievement</p>
          <ShareButtons prize={prize} referralCode={referralCode} />
        </motion.div>

        {/* Executive Close Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={onClose}
          className="absolute top-6 right-6 w-12 h-12 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50 transition-all flex items-center justify-center text-slate-400 hover:text-amber-400"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>

        {/* Sparkle Effects */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 0,
                scale: 0,
                x: '50%',
                y: '50%'
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`
              }}
              transition={{
                duration: 2,
                delay: Math.random() * 2,
                repeat: Infinity,
                repeatDelay: Math.random() * 3
              }}
              className="absolute text-2xl"
            >
              ✨
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
