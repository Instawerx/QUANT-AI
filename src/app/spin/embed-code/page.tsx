'use client';

import EmbedCodeGenerator from '@/components/SpinToWin/EmbedCodeGenerator';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EmbedCodePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0F1A] via-[#151B2E] to-[#0B0F1A] py-12 px-4">
      {/* Back Button */}
      <div className="max-w-3xl mx-auto mb-8">
        <Link href="/spin">
          <motion.button
            whileHover={{ x: -4 }}
            className="flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Spin to Win
          </motion.button>
        </Link>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Embed Spin to Win
          </span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Add the QuantAI Spin to Win widget to your website. Fully functional with wallet connection and contract approval.
        </p>
      </motion.div>

      {/* Generator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <EmbedCodeGenerator />
      </motion.div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-3xl mx-auto mt-12"
      >
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">Why Embed Spin to Win?</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-300">
            <div>
              <h3 className="font-semibold text-amber-400 mb-2">Increase Engagement</h3>
              <p className="text-slate-400">
                Interactive gamification keeps users on your site longer and increases return visits.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-amber-400 mb-2">Web3 Onboarding</h3>
              <p className="text-slate-400">
                Seamlessly introduce users to crypto wallets and blockchain interactions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-amber-400 mb-2">Mission Alignment</h3>
              <p className="text-slate-400">
                Every spin supports QuantAI development through the QuantMissionAI contract.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-amber-400 mb-2">Viral Growth</h3>
              <p className="text-slate-400">
                Built-in referral system encourages users to share and spread awareness.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
