'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Prize } from '@/types/spin';

interface DoubleUpChallengeProps {
  prize: Prize;
  onAccept: () => void;
  onDecline: () => void;
  onResult: (doubled: boolean, newPrize: Prize | null) => void;
}

export default function DoubleUpChallenge({
  prize,
  onAccept,
  onDecline,
  onResult,
}: DoubleUpChallengeProps) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'win' | 'lose' | null>(null);

  const handleDoubleUp = () => {
    setIsFlipping(true);
    onAccept();

    // 50/50 chance
    const doubled = Math.random() < 0.5;

    setTimeout(() => {
      setResult(doubled ? 'win' : 'lose');
      setIsFlipping(false);

      // Wait for result animation before calling onResult
      setTimeout(() => {
        if (doubled) {
          const newPrize: Prize = {
            ...prize,
            amount: prize.amount * 2,
            label: `${prize.amount * 2}`,
          };
          onResult(true, newPrize);
        } else {
          onResult(false, null);
        }
      }, 2000);
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-8 rounded-3xl max-w-md w-full border-2 border-purple-500/50 shadow-2xl shadow-purple-500/50"
      >
        {!result ? (
          <>
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
              }}
              className="text-center mb-6"
            >
              <div className="text-6xl mb-4">🎲</div>
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 mb-2">
                Double or Nothing?
              </h2>
            </motion.div>

            <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 mb-6 border border-purple-400/30">
              <p className="text-center text-lg text-slate-200 mb-4">
                Risk your prize for a chance to <span className="text-amber-400 font-bold">DOUBLE IT!</span>
              </p>

              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="text-center">
                  <div className="text-xl text-slate-400 mb-1">Current Prize</div>
                  <div className="text-3xl font-bold text-white">
                    {prize.amount} {prize.currency}
                  </div>
                </div>

                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-4xl"
                >
                  →
                </motion.div>

                <div className="text-center">
                  <div className="text-xl text-slate-400 mb-1">Potential Win</div>
                  <div className="text-3xl font-bold text-amber-400">
                    {prize.amount * 2} {prize.currency}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>50% Win</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>50% Lose</span>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {isFlipping ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{
                      rotateY: [0, 360],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.5,
                      ease: 'linear',
                    }}
                    className="text-8xl mb-4 inline-block"
                  >
                    🪙
                  </motion.div>
                  <div className="text-2xl font-bold text-amber-400">Flipping...</div>
                </motion.div>
              ) : (
                <div className="flex gap-4">
                  <motion.button
                    onClick={handleDoubleUp}
                    disabled={isFlipping}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-400 hover:via-yellow-400 hover:to-amber-400 py-4 px-6 rounded-xl font-bold text-lg text-slate-900 shadow-lg shadow-amber-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    DOUBLE UP! 🔥
                  </motion.button>
                  <motion.button
                    onClick={onDecline}
                    disabled={isFlipping}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 py-4 px-6 rounded-xl font-bold text-lg text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Keep Prize ✓
                  </motion.button>
                </div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            {result === 'win' ? (
              <>
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 10, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 0.5 }}
                  className="text-8xl mb-4"
                >
                  🎉
                </motion.div>
                <h3 className="text-4xl font-bold text-green-400 mb-3">YOU DOUBLED IT!</h3>
                <div className="text-5xl font-bold text-amber-400 mb-6">
                  {prize.amount * 2} {prize.currency}
                </div>
                <p className="text-slate-300 text-lg">Amazing! Your prize has been doubled!</p>
              </>
            ) : (
              <>
                <motion.div
                  animate={{
                    rotate: [0, -10, 10, -10, 0],
                  }}
                  transition={{ duration: 0.5 }}
                  className="text-8xl mb-4"
                >
                  😢
                </motion.div>
                <h3 className="text-4xl font-bold text-red-400 mb-3">Oh no!</h3>
                <p className="text-slate-300 text-lg mb-4">
                  You lost the double-up challenge
                </p>
                <p className="text-slate-400">Better luck on your next spin!</p>
              </>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
