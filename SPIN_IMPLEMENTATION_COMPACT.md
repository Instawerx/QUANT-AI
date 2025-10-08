# 🎰 Spin to Win - Quick Implementation Guide

## ✅ Status: WalletConnect Configured!

### Missing Features (7 items, ~25 hours total)

| # | Feature | Hours | Priority | Files |
|---|---------|-------|----------|-------|
| 1 | **Sound Effects** | 3 | HIGH | +1 hook, +5 sounds, ~1 page |
| 2 | **Double-Up Bonus** | 4 | HIGH | +1 component, ~1 page |
| 3 | **Referral System** | 8 | HIGH | +2 APIs, +2 components, +1 lib |
| 4 | **Leaderboard** | 5 | MED | +1 component, +1 API |
| 5 | **OG Images** | 5 | MED | +1 API, ~1 metadata |
| 6 | **Embeddable Widget** | 3 | LOW | +1 page, +1 component |

---

## 🎵 1. Sound Effects (3 hours)

**Add:**
- `public/sounds/` - 5 audio files
- `src/hooks/useSoundEffects.ts`

**Update:**
- `src/app/spin/page.tsx` - integrate sounds

**Sounds needed:**
- wheel-spin.mp3, win-celebration.mp3, lose-sound.mp3, click.mp3, coin-drop.mp3

---

## 🎲 2. Double-Up Bonus (4 hours)

**Add:**
- `src/components/SpinToWin/DoubleUpChallenge.tsx`

**Update:**
- `src/app/spin/page.tsx` - show after win

**Logic:** 50/50 coin flip to double prize or lose it all

---

## 🎁 3. Full Referral System (8 hours)

**Add:**
- `src/lib/referral.ts` - code generation
- `src/app/api/referral/track/route.ts` - track signups
- `src/app/api/referral/stats/route.ts` - get stats
- `src/components/SpinToWin/ReferralStats.tsx` - display

**Update:**
- `src/app/spin/page.tsx` - track refs on load
- Database schema for referrals

**Flow:** Share link → Friend signs up → Get +1 spin

---

## 🏆 4. Leaderboard (5 hours)

**Add:**
- `src/components/SpinToWin/RecentWinners.tsx`
- `src/app/api/spin/recent-winners/route.ts`

**Update:**
- `src/app/spin/page.tsx` - show sidebar
- Database: `spin_winners` collection

**Shows:** Last 10 winners with anonymized wallets

---

## 🖼️ 5. OG Images (5 hours)

**Add:**
- `public/og-images/spin-to-win-default.png` (1200x630)
- `src/app/api/og/win/route.tsx` - dynamic generation

**Update:**
- `src/app/spin/page.tsx` - metadata
- `src/app/layout.tsx` - global OG tags

**Result:** Beautiful share cards when posting wins

---

## 🔗 6. Embeddable Widget (3 hours) - OPTIONAL

**Add:**
- `src/app/spin/embed/page.tsx`
- `src/components/SpinToWin/EmbedCodeGenerator.tsx`

**Creates:** `<iframe>` code for external sites

---

## 📅 3-Week Plan

**Week 1 (11 hours):**
- ✅ WalletConnect configured
- Day 1-2: Sound Effects (3h)
- Day 3-4: Double-Up Bonus (4h)
- Day 5: Start Referral System (4h)

**Week 2 (9 hours):**
- Day 1-2: Finish Referral System (4h)
- Day 3-4: Leaderboard (5h)

**Week 3 (8 hours):**
- Day 1-2: OG Images (5h)
- Day 3: Widget (3h) - optional

---

## 🚀 Start Implementation

**Choose one:**
1. Start with Sound Effects (easiest, high impact)
2. Start with Double-Up (most exciting feature)
3. Start with Referrals (viral growth)
4. Do all HIGH priority in sequence

**Ready when you are!** 🎯
