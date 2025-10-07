'use client';

import { useState, useCallback } from 'react';
import { Prize, SpinResult, PRIZES, DEGREES_PER_SEGMENT } from '@/types/spin';

export function useSpinLogic() {
  const [currentSpin, setCurrentSpin] = useState(0);
  const [spinsRemaining, setSpinsRemaining] = useState(3);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winHistory, setWinHistory] = useState<Prize[]>([]);

  const calculateSpinResult = useCallback((spinNumber: number): SpinResult => {
    // Spin 1: Always near-miss (lands 1 segment before/after a prize)
    if (spinNumber === 1) {
      const nearMissSegment = 6; // "Try Again" segment
      return {
        prize: null,
        spinNumber,
        isWin: false,
        isNearMiss: true,
        rotation: nearMissSegment * DEGREES_PER_SEGMENT + DEGREES_PER_SEGMENT / 2
      };
    }

    // Spin 2: 75% win rate
    // Spin 3: 90% win rate (ensures overall 83% win rate)
    const winProbability = spinNumber === 2 ? 0.75 : 0.90;
    const random = Math.random();

    if (random < winProbability) {
      // Winner! Select prize based on probability distribution
      const prizeRandom = Math.random();
      let cumulative = 0;

      const winPrizes = PRIZES.filter(p => p.amount > 0);

      for (const prize of winPrizes) {
        cumulative += prize.probability;
        if (prizeRandom <= cumulative) {
          return {
            prize,
            spinNumber,
            isWin: true,
            isNearMiss: false,
            rotation: (prize.id - 1) * DEGREES_PER_SEGMENT + DEGREES_PER_SEGMENT / 2
          };
        }
      }

      // Fallback to first prize
      const firstPrize = winPrizes[0];
      return {
        prize: firstPrize,
        spinNumber,
        isWin: true,
        isNearMiss: false,
        rotation: (firstPrize.id - 1) * DEGREES_PER_SEGMENT + DEGREES_PER_SEGMENT / 2
      };
    }

    // No win - near miss again
    const nearMissSegment = 6;
    return {
      prize: null,
      spinNumber,
      isWin: false,
      isNearMiss: true,
      rotation: nearMissSegment * DEGREES_PER_SEGMENT + DEGREES_PER_SEGMENT / 2
    };
  }, []);

  const executeSpin = useCallback(async (): Promise<SpinResult | null> => {
    if (isSpinning || spinsRemaining === 0) {
      return null;
    }

    setIsSpinning(true);
    const nextSpin = currentSpin + 1;
    setCurrentSpin(nextSpin);

    // Mark that the user has played at least once so we never show the homepage promo again
    if (nextSpin === 1) {
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('spin_has_played', 'true');
        }
      } catch {
        // Ignore storage errors
      }
    }

    const result = calculateSpinResult(nextSpin);

    // Simulate spin duration
    await new Promise(resolve => setTimeout(resolve, 4000));

    setIsSpinning(false);
    setSpinsRemaining(prev => prev - 1);

    if (result.isWin && result.prize) {
      setWinHistory(prev => [...prev, result.prize!]);
    }

    return result;
  }, [isSpinning, spinsRemaining, currentSpin, calculateSpinResult]);

  const resetSpins = useCallback(() => {
    setCurrentSpin(0);
    setSpinsRemaining(3);
    setWinHistory([]);
    setIsSpinning(false);
  }, []);

  return {
    executeSpin,
    resetSpins,
    spinsRemaining,
    currentSpin,
    isSpinning,
    winHistory,
    canSpin: spinsRemaining > 0 && !isSpinning
  };
}
