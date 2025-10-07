'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

// Simple modal that appears 15s after first visit for new users only
// Rules:
// - Show only if user has NEVER played (localStorage key: 'spin_has_played' !== 'true')
// - Also only show once per browser even if they didn't play (localStorage key: 'spin_promo_shown' === 'true')
// - Allow user to close the popup

export default function SpinPromoModal() {
  const [open, setOpen] = useState(false);
  const enabled = process.env.NEXT_PUBLIC_ENABLE_SPIN_PROMO !== 'false';

  const markShown = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('spin_promo_shown', 'true');
        // lightweight telemetry
        console.info('[SpinPromo] promo marked as shown');
      }
    } catch {}
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    markShown();
    console.info('[SpinPromo] promo closed by user');
  }, [markShown]);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    let timer: number | undefined;

    try {
      if (typeof window === 'undefined') return;

      const hasPlayed = window.localStorage.getItem('spin_has_played') === 'true';
      const promoAlreadyShown = window.localStorage.getItem('spin_promo_shown') === 'true';

      if (hasPlayed || promoAlreadyShown) {
        // Do not show
        console.debug('[SpinPromo] not showing (hasPlayed:', hasPlayed, 'alreadyShown:', promoAlreadyShown, ')');
        return;
      }

      // 15 seconds after first visiting the homepage
      timer = window.setTimeout(() => {
        setOpen(true);
        // Mark as shown so we don't show again in the future
        markShown();
        console.info('[SpinPromo] promo opened after delay');
      }, 15000);
    } catch {
      // Ignore storage errors
    }

    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [enabled, markShown]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="relative z-10 w-[90%] max-w-md rounded-2xl overflow-hidden shadow-2xl border border-amber-500/30 bg-gradient-to-br from-slate-900 to-slate-800">
        {/* Header */}
        <div className="px-6 pt-6 pb-2 flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-amber-200 to-yellow-300 bg-clip-text text-transparent">
              Spin & Win Welcome Bonus
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              New users get 3 free spins to win BNB/ETH prizes.
            </p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="ml-4 rounded-lg p-2 text-slate-400 hover:text-amber-300 hover:bg-white/5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-6">
          <div className="rounded-xl border border-amber-500/20 p-4 bg-black/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-slate-900" viewBox="0 0 32 32" fill="currentColor">
                  <path d="M16 4l-4 4h8l-4-4zm-4 6l-4 4 4 4 4-4-4-4zm8 0l-4 4 4 4 4-4-4-4zm-12 8l-4 4 4 4 4-4-4-4zm8 0l-4 4 4 4 4-4-4-4zm8 0l-4 4 4 4 4-4-4-4zm-8 8l-4 4h8l-4-4z"/>
                </svg>
              </div>
              <div>
                <div className="text-amber-300 font-semibold">83% win rate on your first session</div>
                <div className="text-slate-400 text-xs">Connect wallet later to claim prizes</div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <Link
              href="/spin"
              onClick={markShown}
              className="flex-1 text-center rounded-xl px-5 py-3 font-semibold bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-slate-900 hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] transition-shadow"
            >
              Play Now
            </Link>
            <button
              onClick={handleClose}
              className="px-5 py-3 rounded-xl border border-slate-600 text-slate-300 hover:bg-white/5"
            >
              Not Now
            </button>
          </div>

          <p className="text-[11px] text-slate-500 mt-3 text-center">
            This promo will not show again on this device. If you play, we won't prompt you in the future.
          </p>
        </div>
      </div>
    </div>
  );
}
