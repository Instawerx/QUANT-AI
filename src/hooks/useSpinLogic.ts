'use client';

import { useState, useCallback } from 'react';
import { Prize, SpinResult, PRIZES } from '@/types/spin';

interface UseSpinLogicReturn {
  executeSpin: () => Promise<SpinResult>;
  spinsRemaining: number;
  isSpinning: boolean;
  canSpin: boolean;
  resetSpins: () => void;
}

export function useSpinLogic(): UseSpinLogicReturn {
  const [spinsRemaining, setSpinsRemaining] = useState(3);
  const [isSpinning, setIsSpinning] = useState(false);

  const executeSpin = useCallback(async (): Promise<SpinResult> => {
    if (spinsRemaining <= 0 || isSpinning) {
      return {
        prize: null,
        spinNumber: 0,
        isWin: false,
        isNearMiss: false,
        rotation: 0,
      };
    }

    setIsSpinning(true);

    // Simulate spin delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Determine if this spin is a win
    const random = Math.random();
    let cumulativeProbability = 0;
    let selectedPrize: Prize | null = null;

    // Weighted random selection based on probabilities
    for (const prize of PRIZES) {
      cumulativeProbability += prize.probability;
      if (random <= cumulativeProbability && prize.id !== 7) {
        selectedPrize = prize;
        break;
      }
    }

    // If no prize selected, use "Try Again"
    if (!selectedPrize) {
      selectedPrize = PRIZES.find(p => p.id === 7) || PRIZES[0];
    }

    const isWin = selectedPrize.id !== 7;
    const prizeIndex = PRIZES.findIndex(p => p.id === selectedPrize!.id);
    const degreesPerSegment = 360 / PRIZES.length;

    // Calculate rotation (multiple full rotations + landing position)
    const baseRotation = 360 * 5; // 5 full rotations
    const targetRotation = baseRotation + (prizeIndex * degreesPerSegment);

    const result: SpinResult = {
      prize: selectedPrize,
      spinNumber: 3 - spinsRemaining + 1,
      isWin,
      isNearMiss: !isWin && Math.random() < 0.3,
      rotation: targetRotation,
    };

    setSpinsRemaining(prev => Math.max(0, prev - 1));

    // Reset spinning state after animation
    setTimeout(() => {
      setIsSpinning(false);
    }, 4000);

    return result;
  }, [spinsRemaining, isSpinning]);

  const resetSpins = useCallback(() => {
    setSpinsRemaining(3);
    setIsSpinning(false);
  }, []);

  return {
    executeSpin,
    spinsRemaining,
    isSpinning,
    canSpin: spinsRemaining > 0 && !isSpinning,
    resetSpins,
  };
}
