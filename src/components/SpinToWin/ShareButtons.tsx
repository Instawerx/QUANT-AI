'use client';

import { motion } from 'framer-motion';
import {
  TwitterShareButton,
  FacebookShareButton,
  TelegramShareButton,
  TwitterIcon,
  FacebookIcon,
  TelegramIcon
} from 'react-share';
import { Prize } from '@/types/spin';

interface ShareButtonsProps {
  prize: Prize;
  referralCode?: string;
}

export default function ShareButtons({ prize, referralCode = '' }: ShareButtonsProps) {
  const shareUrl = `https://quantai.com/spin${referralCode ? `?ref=${referralCode}` : ''}`;
  const shareTitle = `🎰 I just won ${prize.amount} ${prize.currency} on QuantAI's Spin to Win! 🏆\n\n83% win rate - Try your luck now!`;
  const hashtags = ['QuantAI', 'SpinToWin', 'Crypto', prize.currency];

  return (
    <div className="flex justify-center gap-4">
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <TwitterShareButton url={shareUrl} title={shareTitle} hashtags={hashtags}>
          <div className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-colors shadow-lg">
            <TwitterIcon size={32} round />
          </div>
        </TwitterShareButton>
      </motion.div>

      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <FacebookShareButton url={shareUrl} hashtag="#QuantAI">
          <div className="w-14 h-14 rounded-full bg-blue-700 hover:bg-blue-800 flex items-center justify-center transition-colors shadow-lg">
            <FacebookIcon size={32} round />
          </div>
        </FacebookShareButton>
      </motion.div>

      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <TelegramShareButton url={shareUrl} title={shareTitle}>
          <div className="w-14 h-14 rounded-full bg-blue-400 hover:bg-blue-500 flex items-center justify-center transition-colors shadow-lg">
            <TelegramIcon size={32} round />
          </div>
        </TelegramShareButton>
      </motion.div>

      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <button
          onClick={() => {
            navigator.clipboard.writeText(shareUrl);
            alert('Link copied to clipboard!');
          }}
          className="w-14 h-14 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors shadow-lg"
        >
          <span className="text-2xl">🔗</span>
        </button>
      </motion.div>
    </div>
  );
}
