'use client';

import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Wheel3D from './Wheel3D';
import WheelPointer from './WheelPointer';
import WinModal from './WinModal';
import { useSpinLogic } from '@/hooks/useSpinLogic';
import { SpinResult } from '@/types/spin';

export default function SpinWheel() {
  const { executeSpin, spinsRemaining, isSpinning, canSpin } = useSpinLogic();
  const [spinResult, setSpinResult] = useState<SpinResult | null>(null);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [showWinModal, setShowWinModal] = useState(false);

  const handleSpin = async () => {
    if (!canSpin) return;

    const result = await executeSpin();
    if (!result) return;

    setWheelRotation(result.rotation);
    setSpinResult(result);

    // Show result after animation
    setTimeout(() => {
      if (result.isWin) {
        fireConfetti();
        setShowWinModal(true);
      } else if (result.isNearMiss) {
        // Show "so close" message
        showNearMissMessage();
      }
    }, 4500);
  };

  const fireConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      confetti({
        particleCount: 3,
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
        colors: ['#FFD700', '#00F0FF', '#B030FF', '#FF6B9D']
      });
    }, 50);
  };

  const showNearMissMessage = () => {
    // Could add toast notification or animated message
    console.log('So close! Try again!');
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-[#0A0E27] via-[#1A1F3A] to-[#0A0E27] overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000" />
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-10 left-1/2 transform -translate-x-1/2 text-center z-20"
      >
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Spin to Win!
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mt-2">
          🎰 Win up to <span className="text-yellow-400 font-bold">1 BNB</span> or{' '}
          <span className="text-blue-400 font-bold">0.8 ETH</span>!
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-full">
            <span className="text-green-400 font-bold text-lg">83% Win Rate! 🔥</span>
          </div>
        </div>
      </motion.div>

      {/* 3D Wheel Canvas */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full max-w-4xl">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full">
                <div className="text-white text-2xl">Loading Wheel...</div>
              </div>
            }
          >
            <Canvas>
              <PerspectiveCamera makeDefault position={[0, 0, 12]} />
              <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />

              {/* Lighting */}
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1} castShadow />
              <spotLight position={[-10, -10, 10]} angle={0.3} penumbra={1} intensity={0.5} />
              <pointLight position={[0, 0, 5]} intensity={0.5} color="#00F0FF" />

              {/* Environment for reflections */}
              <Environment preset="city" />

              {/* Wheel and Pointer */}
              <Wheel3D rotation={wheelRotation} spinning={isSpinning} />
              <WheelPointer />
            </Canvas>
          </Suspense>
        </div>
      </div>

      {/* Spins remaining indicator */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-32 left-10 z-20"
      >
        <div className="bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6">
          <p className="text-gray-400 text-sm mb-2">Free Spins Left</p>
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                  i < spinsRemaining ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gray-700'
                }`}
              >
                {i < spinsRemaining ? '🎰' : '❌'}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Spin Button */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.button
          onClick={handleSpin}
          disabled={!canSpin}
          className={`
            relative px-16 py-6 text-3xl font-bold rounded-full
            transition-all duration-300 transform
            ${
              canSpin
                ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/80 hover:scale-105 cursor-pointer'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }
          `}
          whileHover={canSpin ? { scale: 1.05 } : {}}
          whileTap={canSpin ? { scale: 0.95 } : {}}
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={
              canSpin
                ? {
                    x: ['-100%', '100%']
                  }
                : {}
            }
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: 'linear'
            }}
          />
          <span className="relative z-10">
            {isSpinning ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="inline-block"
                >
                  🎰
                </motion.span>{' '}
                SPINNING...
              </>
            ) : canSpin ? (
              <>🎲 SPIN NOW!</>
            ) : (
              <>🚫 NO SPINS LEFT</>
            )}
          </span>
        </motion.button>

        {canSpin && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-4 text-gray-400"
          >
            Click to spin the wheel!
          </motion.p>
        )}
      </motion.div>

      {/* Win Modal */}
      <AnimatePresence>
        {showWinModal && spinResult?.prize && (
          <WinModal
            prize={spinResult.prize}
            onClose={() => setShowWinModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Near Miss Message */}
      <AnimatePresence>
        {spinResult?.isNearMiss && !showWinModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30"
          >
            <div className="bg-yellow-500/20 border-2 border-yellow-500 rounded-2xl p-8 backdrop-blur-md">
              <h3 className="text-4xl font-bold text-yellow-400 text-center">SO CLOSE! 😱</h3>
              <p className="text-2xl text-white text-center mt-2">Try again!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
