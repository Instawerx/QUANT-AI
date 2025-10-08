'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpinLogic } from '@/hooks/useSpinLogic';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import WinModal from '@/components/SpinToWin/WinModal';
import DoubleUpChallenge from '@/components/SpinToWin/DoubleUpChallenge';
import { PRIZES, DEGREES_PER_SEGMENT } from '@/types/spin';
import { Volume2, VolumeX } from 'lucide-react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useQuantMissionContract, AGREEMENT_HASH } from '@/hooks/useQuantMissionContract';
import { parseEther } from 'viem';
import { generateReferralCode } from '@/lib/referral';

export default function SpinEmbedPage() {
  const { executeSpin, spinsRemaining, isSpinning, canSpin } = useSpinLogic();
  const { play, muted, setMuted } = useSoundEffects();
  const [rotation, setRotation] = useState(0);
  const [showWinModal, setShowWinModal] = useState(false);
  const [showDoubleUp, setShowDoubleUp] = useState(false);
  const [winPrize, setWinPrize] = useState<any>(null);

  // Wallet connection
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  // Contract interaction
  const contract = useQuantMissionContract();
  const [contractApproved, setContractApproved] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const userReferralCode = address ? generateReferralCode(address) : undefined;

  const handleSpin = async () => {
    if (!canSpin) return;
    play('click');
    const result = await executeSpin();
    if (!result) return;
    play('spin');
    const spins = 5;
    const finalRotation = rotation + (360 * spins) + result.rotation;
    setRotation(finalRotation);
    setTimeout(() => {
      if (result.isWin && result.prize) {
        play('win');
        setWinPrize(result.prize);
        setShowWinModal(true);
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
        play('lose');
      }
    }, 4000);
  };

  const handleContractApproval = async () => {
    if (!address || !contract.write) return;
    setIsApproving(true);
    try {
      // Approve QuantMissionAI contract with mission confirmation
      const tx = await contract.write.confirmMissionAndContribute(
        ['Empower QuantAI Development', AGREEMENT_HASH],
        { value: parseEther('0.01') }
      );
      setContractApproved(true);
      console.log('Contract approved:', tx);
    } catch (error) {
      console.error('Contract approval failed:', error);
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0F1A] via-[#151B2E] to-[#0B0F1A] overflow-hidden relative">
      {/* Compact Header */}
      <div className="relative z-20 pt-4 text-center px-4">
        <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight leading-none">
          <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
            SPIN & WIN
          </span>
        </h1>
        <p className="text-sm text-slate-400 mt-2">Powered by QuantAI</p>
      </div>

      {/* Mute Toggle */}
      <button
        onClick={() => setMuted(!muted)}
        className="absolute top-4 left-4 z-30 w-10 h-10 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-amber-400"
        title={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

      {/* Compact Wheel */}
      <div className="relative z-10 flex items-center justify-center mt-8 mb-4">
        <div className="relative">
          <motion.div
            className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full"
            animate={{ rotate: rotation }}
            transition={{ duration: 4, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ boxShadow: '0 0 60px rgba(0,0,0,0.5)' }}
          >
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 z-40">
              <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-amber-400" />
            </div>

            {/* Outer Ring */}
            <div className="absolute inset-0 rounded-full border-[8px] border-gradient-to-r from-amber-600 via-yellow-500 to-amber-600" style={{ borderImage: 'linear-gradient(135deg, #D4AF37, #FFD700, #D4AF37) 1' }} />

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
                  <div className="w-full h-full relative" style={{
                    background: isEven
                      ? 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)'
                      : 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
                  }}>
                    <div className="absolute top-[60px] left-1/2 -translate-x-1/2 text-center w-24" style={{ transform: `translateX(-50%) rotate(${DEGREES_PER_SEGMENT / 2}deg)` }}>
                      <div className="text-amber-400 font-bold text-lg">{prize.label}</div>
                      <div className="text-slate-400 text-xs">{prize.currency}</div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Center Hub */}
            <div className="absolute inset-0 m-auto w-24 h-24 rounded-full z-20">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-600 via-yellow-600 to-amber-800" />
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
                <svg className="w-8 h-8 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Spins Counter */}
      <div className="flex justify-center gap-2 mb-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              i < spinsRemaining
                ? 'bg-gradient-to-br from-amber-500 to-yellow-600 shadow-lg'
                : 'bg-slate-700 opacity-40'
            }`}
          >
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
        ))}
      </div>

      {/* Wallet Connection & Contract Approval */}
      {!isConnected ? (
        <div className="flex justify-center mb-4">
          <button
            onClick={() => connect({ connector: connectors[0] })}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg"
          >
            Connect Wallet to Play
          </button>
        </div>
      ) : !contractApproved ? (
        <div className="flex flex-col items-center gap-3 mb-4 px-4">
          <div className="bg-blue-900/30 border border-blue-500/50 rounded-xl p-4 max-w-md text-center">
            <p className="text-blue-300 text-sm mb-2">
              Approve QuantAI Mission Contract to unlock spins
            </p>
            <p className="text-slate-400 text-xs">
              Mission: "Empower QuantAI Development" (0.01 {contract.chainId === 137 ? 'MATIC' : 'BNB'})
            </p>
          </div>
          <button
            onClick={handleContractApproval}
            disabled={isApproving}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all shadow-lg disabled:opacity-50"
          >
            {isApproving ? 'Approving...' : 'Approve Contract & Play'}
          </button>
        </div>
      ) : null}

      {/* Spin Button */}
      {contractApproved && (
        <div className="flex justify-center mb-6">
          <motion.button
            onClick={handleSpin}
            disabled={!canSpin}
            className={`px-16 py-5 text-xl font-bold rounded-xl ${
              canSpin
                ? 'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-slate-900 shadow-xl cursor-pointer'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
            whileHover={canSpin ? { scale: 1.05 } : {}}
            whileTap={canSpin ? { scale: 0.95 } : {}}
          >
            {isSpinning ? 'SPINNING...' : canSpin ? 'SPIN NOW' : 'NO SPINS LEFT'}
          </motion.button>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-xs text-slate-500 pb-4">
        <p>Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
        <p className="mt-1">
          <a href="/" target="_blank" className="text-amber-400 hover:underline">
            Visit QuantAI Platform
          </a>
        </p>
      </div>

      {/* Win Modal */}
      <AnimatePresence>
        {showWinModal && winPrize && (
          <WinModal
            prize={winPrize}
            referralCode={userReferralCode}
            onClose={() => {
              setShowWinModal(false);
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
            onAccept={() => play('doubleup')}
            onDecline={() => setShowDoubleUp(false)}
            onResult={(doubled, newPrize) => {
              if (doubled && newPrize) {
                play('fanfare');
                setWinPrize(newPrize);
                if (typeof window !== 'undefined') {
                  import('canvas-confetti').then(confetti => {
                    confetti.default({
                      particleCount: 150,
                      spread: 100,
                      origin: { y: 0.5 }
                    });
                  });
                }
              } else {
                play('lose');
              }
              setShowDoubleUp(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
