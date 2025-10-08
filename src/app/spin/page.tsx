'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpinLogic } from '@/hooks/useSpinLogic';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import WinModal from '@/components/SpinToWin/WinModal';
import DoubleUpChallenge from '@/components/SpinToWin/DoubleUpChallenge';
import ReferralStats from '@/components/SpinToWin/ReferralStats';
import WalletConnectButton from '@/components/SpinToWin/WalletConnectButton';
import { PRIZES, DEGREES_PER_SEGMENT } from '@/types/spin';
import { Volume2, VolumeX } from 'lucide-react';
import { generateReferralCode, extractReferralCode, storeReferralCode, getStoredReferralCode } from '@/lib/referral';

export default function SpinPage() {
  const { executeSpin, spinsRemaining, isSpinning, canSpin } = useSpinLogic();
  const { play, muted, setMuted } = useSoundEffects();
  const [rotation, setRotation] = useState(0);
  const [showWinModal, setShowWinModal] = useState(false);
  const [showDoubleUp, setShowDoubleUp] = useState(false);
  const [winPrize, setWinPrize] = useState<any>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Track referral code on page load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlReferralCode = extractReferralCode(window.location.search);
      if (urlReferralCode) {
        storeReferralCode(urlReferralCode);
      }
    }
  }, []);

  // Track referral when wallet is connected
  useEffect(() => {
    const trackReferral = async () => {
      const referralCode = getStoredReferralCode();
      if (walletAddress && referralCode) {
        try {
          await fetch('/api/referral/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              referralCode,
              newUserId: walletAddress,
            }),
          });
        } catch (error) {
          console.error('Failed to track referral:', error);
        }
      }
    };

    if (walletAddress) {
      trackReferral();
    }
  }, [walletAddress]);

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address);
  };

  // Generate referral code for current user
  const userReferralCode = walletAddress ? generateReferralCode(walletAddress) : undefined;

  const handleSpin = async () => {
    if (!canSpin) return;

    // Play click sound
    play('click');

    const result = await executeSpin();
    if (!result) return;

    // Play spinning sound
    play('spin');

    // Calculate final rotation
    const spins = 5; // 5 full rotations
    const finalRotation = rotation + (360 * spins) + result.rotation;
    setRotation(finalRotation);

    // Show result after animation
    setTimeout(() => {
      if (result.isWin && result.prize) {
        // Play win sound
        play('win');

        setWinPrize(result.prize);
        setShowWinModal(true);

        // Fire confetti
        if (typeof window !== 'undefined') {
          import('canvas-confetti').then(confetti => {
            confetti.default({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
          });
        }
      } else {
        // Play lose sound
        play('lose');
      }
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0F1A] via-[#151B2E] to-[#0B0F1A] overflow-hidden relative">
      {/* Sophisticated Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 175, 55, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Ambient Glow Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-radial from-amber-500/30 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-radial from-blue-500/20 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      {/* Floating Crypto Icons Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden" suppressHydrationWarning>
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              scale: 0.5 + Math.random() * 0.5,
              rotate: Math.random() * 360
            }}
            animate={{
              y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              rotate: [0, 360],
              scale: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 20 + Math.random() * 20,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            {i % 4 === 0 && (
              <svg className="w-20 h-20 text-amber-500" viewBox="0 0 32 32" fill="currentColor">
                <path d="M16 4l-4 4h8l-4-4zm-4 6l-4 4 4 4 4-4-4-4zm8 0l-4 4 4 4 4-4-4-4zm-12 8l-4 4 4 4 4-4-4-4zm8 0l-4 4 4 4 4-4-4-4zm8 0l-4 4 4 4 4-4-4-4zm-8 8l-4 4h8l-4-4z"/>
              </svg>
            )}
            {i % 4 === 1 && (
              <svg className="w-20 h-20 text-blue-500" viewBox="0 0 32 32" fill="currentColor">
                <path d="M15.927 23.959l-9.823-5.797 9.817 13.839 9.828-13.839-9.828 5.797zM16.073 0l-9.819 16.297 9.819 5.807 9.823-5.801z"/>
              </svg>
            )}
            {i % 4 === 2 && (
              <svg className="w-20 h-20 text-orange-500" viewBox="0 0 32 32" fill="currentColor">
                <path d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 16-16 16zm7.189-17.98c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z"/>
              </svg>
            )}
            {i % 4 === 3 && (
              <svg className="w-16 h-16 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            )}
          </motion.div>
        ))}
      </div>

      {/* Engaging Header with Crypto Icons */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-20 pt-8 text-center px-4"
      >
        {/* QuantAI Branding */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
            QUANT AI
          </h2>
          <p className="text-xs md:text-sm text-slate-400 font-gaming tracking-widest uppercase">
            Intelligent Trading Platform
          </p>
        </motion.div>

        {/* Promotion Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="inline-flex items-center gap-2 px-5 py-2.5 mb-6 rounded-full border-2 border-amber-400/50 bg-gradient-to-r from-amber-600/20 via-yellow-500/20 to-amber-600/20 backdrop-blur-sm shadow-lg shadow-amber-500/20"
        >
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, delay: 1 }}
            className="text-2xl"
          >
            🎁
          </motion.span>
          <span className="text-amber-300 font-bold text-sm md:text-base tracking-wide uppercase">
            New User Welcome Bonus
          </span>
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-xl"
          >
            ✨
          </motion.span>
        </motion.div>

        {/* Main Headline with Crypto Icons */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <div className="text-5xl md:text-7xl lg:text-8xl font-display font-black mb-3 tracking-tight leading-none">
            <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(251,191,36,0.6)]">
              SPIN & WIN
            </span>
          </div>

          {/* Crypto Rewards Display */}
          <div className="flex items-center justify-center gap-4 md:gap-8 mt-6 flex-wrap">
            {/* BNB */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-3 bg-gradient-to-br from-slate-800/80 to-slate-900/80 px-6 py-4 rounded-2xl border border-amber-500/30 shadow-xl"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-500/50">
                <svg className="w-7 h-7 md:w-8 md:h-8 text-slate-900 font-bold" viewBox="0 0 32 32" fill="currentColor">
                  <path d="M16 4l-4 4h8l-4-4zm-4 6l-4 4 4 4 4-4-4-4zm8 0l-4 4 4 4 4-4-4-4zm-12 8l-4 4 4 4 4-4-4-4zm8 0l-4 4 4 4 4-4-4-4zm8 0l-4 4 4 4 4-4-4-4zm-8 8l-4 4h8l-4-4z"/>
                </svg>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-amber-400">BNB</div>
                <div className="text-xs text-slate-400 font-gaming">up to 1.0</div>
              </div>
            </motion.div>

            {/* OR */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7 }}
              className="text-slate-500 font-bold text-xl hidden md:block"
            >
              OR
            </motion.div>

            {/* ETH */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-3 bg-gradient-to-br from-slate-800/80 to-slate-900/80 px-6 py-4 rounded-2xl border border-blue-500/30 shadow-xl"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/50">
                <svg className="w-7 h-7 md:w-8 md:h-8 text-white" viewBox="0 0 32 32" fill="currentColor">
                  <path d="M15.927 23.959l-9.823-5.797 9.817 13.839 9.828-13.839-9.828 5.797zM16.073 0l-9.819 16.297 9.819 5.807 9.823-5.801z"/>
                </svg>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-blue-400">ETH</div>
                <div className="text-xs text-slate-400 font-gaming">up to 0.8</div>
              </div>
            </motion.div>
          </div>
        </motion.h1>

        {/* Value Proposition */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="max-w-2xl mx-auto mt-6"
        >
          <p className="text-base md:text-lg text-slate-300 font-gaming font-light leading-relaxed">
            Join <span className="text-amber-400 font-semibold">10,000+ traders</span> using AI-powered strategies
          </p>
          <div className="flex items-center justify-center gap-6 mt-4 text-sm text-slate-400 flex-wrap">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span className="font-gaming">Instant Rewards</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span className="font-gaming">No Deposit Required</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Mute Toggle Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        onClick={() => setMuted(!muted)}
        className="absolute top-6 left-6 z-30 w-12 h-12 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50 transition-all flex items-center justify-center text-slate-400 hover:text-amber-400 backdrop-blur-sm"
        title={muted ? 'Unmute sounds' : 'Mute sounds'}
      >
        {muted ? (
          <VolumeX className="w-6 h-6" />
        ) : (
          <Volume2 className="w-6 h-6" />
        )}
      </motion.button>

      {/* Close/Collapse Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        onClick={() => window.history.back()}
        className="absolute top-6 right-6 z-30 w-12 h-12 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50 transition-all flex items-center justify-center text-slate-400 hover:text-amber-400 backdrop-blur-sm"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </motion.button>

      {/* Pre-Play Social Share Section */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute top-40 right-10 z-20"
      >
        <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-6 shadow-2xl">
          <p className="text-amber-400 text-sm font-semibold mb-3 tracking-wider uppercase text-center">Share</p>
          <div className="flex flex-col gap-3">
            {/* TikTok */}
            <motion.a
              href={`https://www.tiktok.com/upload?caption=${encodeURIComponent('🎰 Spin to win crypto! High Roller Spin - Join now!')}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 hover:from-[#00f2ea] hover:to-[#ff0050] flex items-center justify-center transition-all shadow-lg hover:shadow-pink-500/30"
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </motion.a>

            {/* X (Twitter) */}
            <motion.a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('🎰 Just found this amazing crypto spin wheel! 83% win rate! 🔥')}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&hashtags=Crypto,QuantAI,HighRoller`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 hover:from-slate-900 hover:to-black flex items-center justify-center transition-all shadow-lg hover:shadow-slate-500/30"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </motion.a>

            {/* Facebook */}
            <motion.a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 hover:from-[#1877f2] hover:to-[#0a4fb8] flex items-center justify-center transition-all shadow-lg hover:shadow-blue-500/30"
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </motion.a>

            {/* Instagram */}
            <motion.a
              href={`https://www.instagram.com/`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 hover:from-[#f09433] hover:via-[#e6683c] hover:to-[#bc1888] flex items-center justify-center transition-all shadow-lg hover:shadow-pink-500/30"
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </motion.a>
          </div>
          <p className="text-slate-400 text-xs mt-3 font-light text-center">
            Spread the word
          </p>
        </div>
      </motion.div>

      {/* Premium Wheel Container */}
      <div className="relative z-10 flex items-center justify-center mt-16 mb-8">
        <div className="relative">
          {/* Outer Glow Ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 blur-2xl scale-110" />

          {/* Premium Pointer */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 z-40"
            animate={{
              y: [0, -8, 0],
              filter: ['drop-shadow(0 0 10px rgba(251,191,36,0.5))', 'drop-shadow(0 0 20px rgba(251,191,36,0.8))', 'drop-shadow(0 0 10px rgba(251,191,36,0.5))']
            }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <div className="relative">
              {/* Pointer Shadow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-t-[60px] border-t-black/40 blur-sm" />
              {/* Main Pointer */}
              <div className="relative w-0 h-0 border-l-[28px] border-l-transparent border-r-[28px] border-r-transparent border-t-[56px] border-t-amber-400">
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-1 h-12 bg-gradient-to-b from-amber-300 to-amber-500" />
              </div>
            </div>
          </motion.div>

          {/* Main Wheel */}
          <div className="relative">
            {/* Wheel Shadow */}
            <div className="absolute inset-0 rounded-full bg-black/50 blur-xl scale-95" />

            {/* Rotating Wheel */}
            <motion.div
              className="relative w-[500px] h-[500px] rounded-full"
              animate={{ rotate: rotation }}
              transition={{ duration: 4, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                boxShadow: '0 0 60px rgba(0,0,0,0.5), inset 0 0 30px rgba(0,0,0,0.3)'
              }}
            >
              {/* Outer Ring */}
              <div className="absolute inset-0 rounded-full border-[12px] border-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 shadow-[0_0_40px_rgba(251,191,36,0.4)]" style={{
                borderImage: 'linear-gradient(135deg, #D4AF37, #FFD700, #D4AF37) 1'
              }} />

              {/* Inner Decorative Ring */}
              <div className="absolute inset-4 rounded-full border-4 border-amber-900/50" />

              {/* Prize Segments */}
              {PRIZES.map((prize, index) => {
                const angle = index * DEGREES_PER_SEGMENT;
                const isEven = index % 2 === 0;

                return (
                  <div
                    key={prize.id}
                    className="absolute inset-0 origin-center"
                    style={{
                      transform: `rotate(${angle}deg)`,
                      clipPath: `polygon(50% 50%, 100% 0%, 100% 14.28%)`
                    }}
                  >
                    {/* Segment Background with Premium Gradient */}
                    <div
                      className="w-full h-full relative"
                      style={{
                        background: isEven
                          ? 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)'
                          : 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
                      }}
                    >
                      {/* Segment Border */}
                      <div className="absolute inset-0 border-r border-amber-900/30" />

                      {/* Prize Text */}
                      <div
                        className="absolute top-[80px] left-1/2 -translate-x-1/2 text-center w-32"
                        style={{ transform: `translateX(-50%) rotate(${DEGREES_PER_SEGMENT / 2}deg)` }}
                      >
                        <div className="text-amber-400 font-bold text-xl tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                          {prize.label}
                        </div>
                        <div className="text-slate-400 text-xs mt-1 font-light tracking-wider">
                          {prize.currency}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Center Hub */}
              <div className="absolute inset-0 m-auto w-32 h-32 rounded-full z-20">
                {/* Hub Shadow */}
                <div className="absolute inset-0 rounded-full bg-black/60 blur-md" />

                {/* Hub Gradient */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-600 via-yellow-600 to-amber-800 shadow-[0_0_30px_rgba(251,191,36,0.5)]" />

                {/* Hub Border */}
                <div className="absolute inset-2 rounded-full border-4 border-amber-400/50" />

                {/* Hub Center */}
                <div className="absolute inset-6 rounded-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
                  <svg className="w-12 h-12 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Premium Spins Counter & Wallet Status */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute top-40 left-10 z-20 space-y-4"
      >
        {/* Spins Counter */}
        <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-6 shadow-2xl">
          <p className="text-amber-400 text-sm font-semibold mb-3 tracking-wider uppercase">Complimentary Spins</p>
          <div className="flex gap-3">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 ${
                  i < spinsRemaining
                    ? 'bg-gradient-to-br from-amber-500 to-yellow-600 shadow-lg shadow-amber-500/50'
                    : 'bg-gradient-to-br from-slate-700 to-slate-800 opacity-40'
                }`}
              >
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </motion.div>
            ))}
          </div>
          <p className="text-slate-400 text-xs mt-3 font-light">
            {spinsRemaining} {spinsRemaining === 1 ? 'opportunity' : 'opportunities'} remaining
          </p>
        </div>

        {/* Wallet Connection Status */}
        <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-6 shadow-2xl max-w-xs">
          <p className="text-amber-400 text-sm font-semibold mb-3 tracking-wider uppercase">Wallet Status</p>
          {walletAddress ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="space-y-2"
            >
              <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/50 rounded-xl px-3 py-2">
                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <span className="text-emerald-400 font-semibold text-sm">Connected</span>
              </div>
              <p className="text-slate-300 font-mono text-xs break-all">
                {walletAddress.slice(0, 10)}...{walletAddress.slice(-8)}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-2">
              <WalletConnectButton onConnect={handleWalletConnect} />
              <p className="text-slate-400 text-xs font-light text-center">
                Connect to claim prizes
              </p>
            </div>
          )}
        </div>

        {/* Referral Stats - Only show if wallet is connected */}
        {walletAddress && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <ReferralStats userId={walletAddress} />
          </motion.div>
        )}
      </motion.div>

      {/* Premium Spin Button */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.button
          onClick={handleSpin}
          disabled={!canSpin}
          className={`
            relative px-20 py-7 text-2xl font-bold rounded-2xl overflow-hidden
            transition-all duration-300 tracking-wide
            ${
              canSpin
                ? 'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-slate-900 shadow-2xl shadow-amber-500/50 cursor-pointer'
                : 'bg-gradient-to-r from-slate-700 to-slate-800 text-slate-500 cursor-not-allowed'
            }
          `}
          whileHover={canSpin ? { scale: 1.02, boxShadow: '0 0 60px rgba(251,191,36,0.6)' } : {}}
          whileTap={canSpin ? { scale: 0.98 } : {}}
        >
          {canSpin && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            />
          )}
          <span className="relative z-10 drop-shadow-sm">
            {isSpinning ? 'SPINNING...' : canSpin ? 'SPIN THE WHEEL' : 'NO SPINS REMAINING'}
          </span>
        </motion.button>

        {canSpin && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-slate-400 text-sm mt-4 font-light tracking-wide"
          >
            Press to engage the wheel
          </motion.p>
        )}
      </motion.div>

      {/* Win Modal */}
      <AnimatePresence>
        {showWinModal && winPrize && (
          <WinModal
            prize={winPrize}
            referralCode={userReferralCode}
            onClose={() => {
              setShowWinModal(false);
              // Show double-up challenge after closing win modal
              setShowDoubleUp(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* Double-Up Challenge */}
      <AnimatePresence>
        {showDoubleUp && winPrize && (
          <DoubleUpChallenge
            prize={winPrize}
            onAccept={() => {
              play('doubleup');
            }}
            onDecline={() => {
              setShowDoubleUp(false);
            }}
            onResult={(doubled, newPrize) => {
              if (doubled && newPrize) {
                // Player won the double-up!
                play('fanfare');
                setWinPrize(newPrize);
                // Show confetti for double win
                if (typeof window !== 'undefined') {
                  import('canvas-confetti').then(confetti => {
                    confetti.default({
                      particleCount: 150,
                      spread: 100,
                      origin: { y: 0.5 },
                      colors: ['#FFD700', '#FFA500', '#FF6347']
                    });
                  });
                }
              } else {
                // Player lost the double-up
                play('lose');
              }
              setShowDoubleUp(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* QuantAI Platform CTA - Bottom Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-full max-w-4xl px-4"
      >
        <div className="bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-2 border-amber-500/20 rounded-3xl p-6 md:p-8 shadow-2xl">
          <div className="text-center">
            {/* Platform Promotion */}
            <h3 className="text-2xl md:text-3xl font-display font-bold mb-3">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Start Trading with QuantAI
              </span>
            </h3>
            <p className="text-slate-300 font-gaming text-sm md:text-base mb-6 max-w-2xl mx-auto leading-relaxed">
              Join thousands of traders using our <span className="text-amber-400 font-semibold">AI-powered trading algorithms</span> to maximize crypto profits. Get started with your welcome bonus!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.a
                href="/"
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(251,191,36,0.5)' }}
                whileTap={{ scale: 0.95 }}
                className="relative px-8 py-4 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-slate-900 font-bold text-lg rounded-2xl shadow-lg shadow-amber-500/30 overflow-hidden w-full sm:w-auto"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Start Trading Now
                </span>
              </motion.a>

              <motion.a
                href="/"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-slate-800/50 hover:bg-slate-700/50 border-2 border-slate-600 text-slate-200 font-bold text-lg rounded-2xl transition-all w-full sm:w-auto"
              >
                Learn More
              </motion.a>
            </div>

            {/* Trust Indicators */}
            <div className="mt-6 pt-6 border-t border-slate-700/50">
              <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-gaming">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Secure & Licensed</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span>4.8/5 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                  </svg>
                  <span>10,000+ Active Traders</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
