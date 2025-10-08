'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Users, Gift } from 'lucide-react';
import { generateReferralCode, generateReferralUrl } from '@/lib/referral';

interface ReferralStatsProps {
  userId: string;
}

interface ReferralStats {
  referralCode: string;
  stats: {
    totalReferrals: number;
    spinsEarned: number;
    recentReferrals: Array<{
      refereeId: string;
      timestamp: number;
      bonusAwarded: boolean;
    }>;
  };
}

export default function ReferralStats({ userId }: ReferralStatsProps) {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const referralCode = generateReferralCode(userId);
  const referralUrl = generateReferralUrl(referralCode);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/referral/stats?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching referral stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchStats();
    }
  }, [userId]);

  const handleCopyReferralUrl = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (!userId) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-md border border-purple-500/30 rounded-2xl p-6 shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
          <Gift className="w-6 h-6 text-white" />
        </div>
        <div>
          <h4 className="text-xl font-bold text-white">Refer & Earn</h4>
          <p className="text-sm text-slate-400">Get +1 spin for each friend</p>
        </div>
      </div>

      {/* Referral Code */}
      <div className="mb-6">
        <label className="text-sm text-slate-400 mb-2 block">Your Referral Code</label>
        <div className="flex gap-2">
          <div className="flex-1 bg-black/40 border border-purple-500/30 rounded-xl px-4 py-3 font-mono text-lg text-amber-400 font-bold">
            {referralCode}
          </div>
          <button
            onClick={handleCopyReferralUrl}
            className="px-4 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl transition-colors flex items-center justify-center"
            title="Copy referral link"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-400" />
            ) : (
              <Copy className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {/* Total Referrals */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-black/40 border border-purple-500/20 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-slate-400 uppercase tracking-wide">Friends Joined</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {stats?.stats.totalReferrals || 0}
            </div>
          </motion.div>

          {/* Spins Earned */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-black/40 border border-amber-500/20 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-slate-400 uppercase tracking-wide">Bonus Spins</span>
            </div>
            <div className="text-3xl font-bold text-amber-400">
              {stats?.stats.spinsEarned || 0}
            </div>
          </motion.div>
        </div>
      )}

      {/* How it works */}
      <div className="mt-6 pt-6 border-t border-purple-500/20">
        <h5 className="text-sm font-semibold text-white mb-3">How it works:</h5>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-purple-400 mt-0.5">1.</span>
            <span>Share your referral link with friends</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400 mt-0.5">2.</span>
            <span>They connect wallet and spin</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400 mt-0.5">3.</span>
            <span>You get +1 bonus spin automatically</span>
          </li>
        </ul>
      </div>

      {/* Share buttons could go here */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleCopyReferralUrl}
        className="w-full mt-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl font-semibold text-white transition-all shadow-lg shadow-purple-500/30"
      >
        {copied ? 'Link Copied! 🎉' : 'Copy Referral Link'}
      </motion.button>
    </motion.div>
  );
}
