'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Gift, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function SpinPromoPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if already shown this session
    const shownThisSession = sessionStorage.getItem('spin_popup_shown');
    if (shownThisSession === 'true') {
      setHasShown(true);
      return;
    }

    // Show popup after 15 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
      sessionStorage.setItem('spin_popup_shown', 'true');
      setHasShown(true);
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (hasShown && !isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden border-2 border-purple-500">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <div className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-blue-800 p-8 text-white">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="flex justify-center mb-4"
          >
            <div className="relative">
              <Sparkles className="h-16 w-16 text-yellow-400 animate-pulse" />
              <Gift className="h-12 w-12 text-white absolute top-2 left-2" />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-center mb-2"
          >
            🎰 Spin to Win!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center text-purple-100 mb-6"
          >
            Try your luck! Win crypto, tokens, and exclusive rewards.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-400 rounded-full p-2">
                  <Sparkles className="h-5 w-5 text-purple-900" />
                </div>
                <div>
                  <p className="font-semibold">3 Free Spins</p>
                  <p className="text-sm text-purple-200">For new users!</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-white/10 rounded p-2 text-center">
                <div className="font-bold text-yellow-400">$QUANT</div>
                <div className="text-xs text-purple-200">Tokens</div>
              </div>
              <div className="bg-white/10 rounded p-2 text-center">
                <div className="font-bold text-green-400">BNB</div>
                <div className="text-xs text-purple-200">Crypto</div>
              </div>
              <div className="bg-white/10 rounded p-2 text-center">
                <div className="font-bold text-blue-400">NFTs</div>
                <div className="text-xs text-purple-200">Rewards</div>
              </div>
              <div className="bg-white/10 rounded p-2 text-center">
                <div className="font-bold text-purple-400">Access</div>
                <div className="text-xs text-purple-200">Premium</div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="p-6 bg-background">
          <Link href="/spin" onClick={handleClose}>
            <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg py-6">
              <Sparkles className="mr-2 h-5 w-5" />
              Start Spinning Now!
            </Button>
          </Link>
          <p className="text-center text-sm text-muted-foreground mt-3">
            No purchase necessary • Connect wallet to play
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
