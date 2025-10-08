# 🎰 Spin to Win - Missing Features & Implementation Plan

## 📊 Audit Summary (October 7, 2025)

### ✅ What's Already Implemented

| Feature | Status | Location |
|---------|--------|----------|
| **Core Spin Wheel** | ✅ Complete | `src/components/SpinToWin/SpinWheel.tsx` |
| **3D Wheel Graphics** | ✅ Complete | `src/components/SpinToWin/Wheel3D.tsx` |
| **Win Modal** | ✅ Complete | `src/components/SpinToWin/WinModal.tsx` |
| **Wallet Connection** | ✅ Complete | `src/components/SpinToWin/WalletConnectButton.tsx` |
| **Confetti Effects** | ✅ Complete | Uses `canvas-confetti` package |
| **Social Sharing Buttons** | ✅ Complete | `src/components/SpinToWin/ShareButtons.tsx` |
| **Spin Logic** | ✅ Complete | `src/hooks/useSpinLogic.ts` |
| **Prize Types** | ✅ Complete | `src/types/spin.ts` |
| **API Routes** | ✅ Complete | `src/app/api/spin/claim` & `validate` |
| **Mobile Responsive** | ✅ Complete | Responsive design implemented |

### ❌ Missing Features (From Original Plan)

| Feature | Status | Priority |
|---------|--------|----------|
| **Sound Effects** | ❌ Not Implemented | HIGH |
| **Double-Up Bonus Challenge** | ❌ Not Implemented | HIGH |
| **Leaderboard** | ❌ Not Implemented | MEDIUM |
| **Embeddable Widget** | ❌ Not Implemented | LOW |
| **Full Referral System** | ⚠️ Partial (needs backend) | HIGH |
| **OG Images / Metadata** | ❌ Not Implemented | MEDIUM |
| **WalletConnect Project ID** | ❌ Not Configured | CRITICAL |

---

## 🚨 CRITICAL: WalletConnect Project ID

**Status**: Missing from `.env.local`

**Current Issue**:
```bash
# In .env.local line 8:
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

**Action Required**:
1. Visit: https://cloud.walletconnect.com/
2. Create account (free)
3. Create new project
4. Copy Project ID
5. Update `.env.local`:
```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=abc123def456...
```

**Impact**: Without this, WalletConnect option won't work (MetaMask will still work)

---

## 🎵 Feature 1: Sound Effects

### Status: ❌ Not Implemented

### What's Needed:

**Sound Files Required**:
- `wheel-spin.mp3` - Ticking sound during spin
- `win-celebration.mp3` - Victory fanfare
- `lose-sound.mp3` - Gentle "try again" sound
- `click.mp3` - Button click feedback
- `coin-drop.mp3` - Prize collection sound

### Implementation Plan:

**Step 1: Add Sound Files**
```
public/
  sounds/
    ├── wheel-spin.mp3
    ├── win-celebration.mp3
    ├── lose-sound.mp3
    ├── click.mp3
    └── coin-drop.mp3
```

**Step 2: Create Sound Hook**
```typescript
// src/hooks/useSoundEffects.ts
import { useEffect, useRef, useState } from 'react';

export function useSoundEffects() {
  const [muted, setMuted] = useState(false);
  const sounds = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    sounds.current = {
      spin: new Audio('/sounds/wheel-spin.mp3'),
      win: new Audio('/sounds/win-celebration.mp3'),
      lose: new Audio('/sounds/lose-sound.mp3'),
      click: new Audio('/sounds/click.mp3'),
      coin: new Audio('/sounds/coin-drop.mp3'),
    };
  }, []);

  const play = (sound: string) => {
    if (!muted && sounds.current[sound]) {
      sounds.current[sound].play();
    }
  };

  return { play, muted, setMuted };
}
```

**Step 3: Integration**
Update `src/app/spin/page.tsx`:
```typescript
const { play, muted, setMuted } = useSoundEffects();

const handleSpin = async () => {
  play('spin'); // Start spinning sound
  // ... existing spin logic
  setTimeout(() => {
    if (result.isWin) {
      play('win');
    } else {
      play('lose');
    }
  }, 4000);
};
```

**Effort**: 2-3 hours
**Files to Create**: 1 hook, 5 sound files
**Files to Modify**: `src/app/spin/page.tsx`

---

## 🎲 Feature 2: Double-Up Bonus Challenge

### Status: ❌ Not Implemented (Mentioned in plan but no code)

### What It Is:
After winning, user can risk their prize for a chance to double it (50/50 odds).

### Implementation Plan:

**Step 1: Create Component**
```typescript
// src/components/SpinToWin/DoubleUpChallenge.tsx
interface DoubleUpChallengeProps {
  prize: Prize;
  onAccept: () => void;
  onDecline: () => void;
  onResult: (doubled: boolean, newPrize: Prize | null) => void;
}

export function DoubleUpChallenge({ prize, onAccept, onDecline, onResult }) {
  const [isFlipping, setIsFlipping] = useState(false);

  const handleDoubleUp = () => {
    setIsFlipping(true);
    onAccept();

    // 50/50 chance
    const doubled = Math.random() < 0.5;

    setTimeout(() => {
      if (doubled) {
        const newPrize = { ...prize, amount: prize.amount * 2 };
        onResult(true, newPrize);
      } else {
        onResult(false, null);
      }
      setIsFlipping(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-purple-900 to-blue-900 p-8 rounded-2xl max-w-md">
        <h2 className="text-3xl font-bold text-center mb-4">
          🎲 Double or Nothing?
        </h2>
        <p className="text-center mb-6">
          Risk your {prize.amount} {prize.currency} for a chance to win{' '}
          {prize.amount * 2} {prize.currency}!
        </p>
        <div className="flex gap-4">
          <button
            onClick={handleDoubleUp}
            disabled={isFlipping}
            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 py-3 rounded-lg font-bold"
          >
            {isFlipping ? 'Flipping...' : 'DOUBLE UP! 🔥'}
          </button>
          <button
            onClick={onDecline}
            disabled={isFlipping}
            className="flex-1 bg-gray-700 py-3 rounded-lg font-bold"
          >
            Keep Prize ✓
          </button>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Integration**
Update `src/app/spin/page.tsx`:
```typescript
const [showDoubleUp, setShowDoubleUp] = useState(false);

// After win modal
{showDoubleUp && (
  <DoubleUpChallenge
    prize={winPrize}
    onAccept={() => {}}
    onDecline={() => setShowDoubleUp(false)}
    onResult={(doubled, newPrize) => {
      if (doubled && newPrize) {
        setWinPrize(newPrize);
        // Show updated win modal
      } else {
        // Show "lost it all" message
      }
      setShowDoubleUp(false);
    }}
  />
)}
```

**Effort**: 3-4 hours
**Files to Create**: 1 component
**Files to Modify**: `src/app/spin/page.tsx`

---

## 🏆 Feature 3: Leaderboard (Recent Winners)

### Status: ❌ Not Implemented

### Implementation Plan:

**Step 1: Backend Storage**
Update Firebase/Database schema:
```typescript
// Firestore collection: spin_winners
interface WinnerRecord {
  id: string;
  walletAddress: string; // Anonymized (0x1234...5678)
  prize: {
    amount: number;
    currency: string;
  };
  timestamp: number;
  country?: string; // From IP lookup
}
```

**Step 2: Create Leaderboard Component**
```typescript
// src/components/SpinToWin/RecentWinners.tsx
export function RecentWinners() {
  const [winners, setWinners] = useState<WinnerRecord[]>([]);

  useEffect(() => {
    // Fetch recent 10 winners
    fetch('/api/spin/recent-winners')
      .then(res => res.json())
      .then(setWinners);
  }, []);

  return (
    <div className="bg-black/40 backdrop-blur-md rounded-xl p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        🏆 Recent Winners
      </h3>
      <div className="space-y-2">
        {winners.map((winner, i) => (
          <div key={winner.id} className="flex items-center justify-between py-2 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-gray-400">#{i + 1}</span>
              <span className="font-mono text-sm">{winner.walletAddress}</span>
              {winner.country && <span>{winner.country}</span>}
            </div>
            <div className="font-bold text-amber-400">
              {winner.prize.amount} {winner.prize.currency}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Step 3: API Route**
```typescript
// src/app/api/spin/recent-winners/route.ts
export async function GET() {
  // Fetch from database
  const winners = await db.collection('spin_winners')
    .orderBy('timestamp', 'desc')
    .limit(10)
    .get();

  return Response.json(winners);
}
```

**Effort**: 4-5 hours
**Files to Create**: 1 component, 1 API route
**Dependencies**: Database setup

---

## 🔗 Feature 4: Embeddable Widget

### Status: ❌ Not Implemented

### Implementation Plan:

**Step 1: Create Widget Endpoint**
```typescript
// src/app/spin/embed/page.tsx
export default function SpinWidgetEmbed() {
  return (
    <div className="min-h-screen bg-transparent">
      {/* Minimal spin wheel without header/footer */}
      <SpinWheel compact={true} />
    </div>
  );
}
```

**Step 2: Generate Embed Code**
```typescript
// src/components/SpinToWin/EmbedCodeGenerator.tsx
export function EmbedCodeGenerator() {
  const embedCode = `
<iframe
  src="https://quantai.com/spin/embed"
  width="500"
  height="600"
  frameborder="0"
  allow="wallet"
></iframe>
  `.trim();

  return (
    <div>
      <h3>Embed Spin to Win on Your Site</h3>
      <pre className="bg-gray-900 p-4 rounded">
        <code>{embedCode}</code>
      </pre>
      <button onClick={() => navigator.clipboard.writeText(embedCode)}>
        Copy Code
      </button>
    </div>
  );
}
```

**Effort**: 3-4 hours
**Files to Create**: 1 page, 1 component
**Priority**: LOW (nice to have)

---

## 🎁 Feature 5: Full Referral System

### Status: ⚠️ Partially Implemented

### What Exists:
- ✅ `referralCode` prop in `ShareButtons.tsx`
- ✅ Type definitions in `src/types/spin.ts`
- ✅ Share URL generation with `?ref=` parameter

### What's Missing:
- ❌ Referral code generation
- ❌ Tracking referee sign-ups
- ❌ Rewarding referrer with extra spin
- ❌ Dashboard to view referrals

### Implementation Plan:

**Step 1: Generate Referral Code**
```typescript
// src/lib/referral.ts
export function generateReferralCode(userId: string): string {
  return btoa(userId).substring(0, 8).toUpperCase();
}
```

**Step 2: Track Referrals**
```typescript
// src/app/api/referral/track/route.ts
export async function POST(req: Request) {
  const { referralCode, newUserId } = await req.json();

  // Find referrer by code
  const referrer = await db.users.findOne({ referralCode });

  if (referrer) {
    // Increment referrer's spins
    await db.users.update(referrer.id, {
      spinsRemaining: referrer.spinsRemaining + 1
    });

    // Record referral
    await db.referrals.create({
      referrerId: referrer.id,
      refereeId: newUserId,
      timestamp: Date.now()
    });
  }
}
```

**Step 3: Show Referral Stats**
```typescript
// src/components/SpinToWin/ReferralStats.tsx
export function ReferralStats({ userId }: { userId: string }) {
  const [stats, setStats] = useState({ count: 0, spinsEarned: 0 });

  useEffect(() => {
    fetch(`/api/referral/stats?userId=${userId}`)
      .then(res => res.json())
      .then(setStats);
  }, [userId]);

  return (
    <div className="bg-purple-900/30 p-4 rounded-lg">
      <h4>Your Referrals</h4>
      <div className="flex gap-4">
        <div>
          <div className="text-2xl font-bold">{stats.count}</div>
          <div className="text-sm">Friends Joined</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-amber-400">{stats.spinsEarned}</div>
          <div className="text-sm">Bonus Spins Earned</div>
        </div>
      </div>
    </div>
  );
}
```

**Effort**: 6-8 hours
**Files to Create**: 2 API routes, 2 components, 1 utility
**Priority**: HIGH (viral growth feature)

---

## 🖼️ Feature 6: OG Images / Social Metadata

### Status: ❌ Not Implemented

### What's Needed:

**Dynamic OG Images for Wins**:
When users share their win, generate a custom image.

### Implementation Plan:

**Step 1: Update Metadata**
```typescript
// src/app/spin/page.tsx
export const metadata: Metadata = {
  title: 'Spin to Win BNB & ETH | QuantAI',
  description: '🎰 Spin the wheel to win up to 1 BNB or 0.8 ETH! 83% win rate. Connect your wallet to claim prizes.',
  openGraph: {
    title: 'Spin to Win - Free BNB & ETH Prizes!',
    description: 'Try your luck on the wheel! 83% of players win crypto prizes.',
    images: [
      {
        url: '/og-images/spin-to-win-default.png',
        width: 1200,
        height: 630,
        alt: 'Spin to Win Wheel',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Spin to Win - QuantAI',
    description: '🎰 Free spins to win BNB & ETH!',
    images: ['/og-images/spin-to-win-default.png'],
  },
};
```

**Step 2: Dynamic OG Image Generation**
```typescript
// src/app/api/og/win/route.tsx
import { ImageResponse } from 'next/og';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const amount = searchParams.get('amount') || '0.5';
  const currency = searchParams.get('currency') || 'BNB';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <div style={{ fontSize: 80, fontWeight: 'bold', color: 'white' }}>
          🎉 I WON! 🎉
        </div>
        <div style={{ fontSize: 120, fontWeight: 'bold', color: '#FFD700' }}>
          {amount} {currency}
        </div>
        <div style={{ fontSize: 40, color: 'white', marginTop: 20 }}>
          on QuantAI Spin to Win!
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
```

**Step 3: Use Dynamic OG Image on Share**
```typescript
// When user wins and shares:
const shareUrl = `/api/og/win?amount=${prize.amount}&currency=${prize.currency}`;
```

**Effort**: 4-5 hours
**Files to Create**: 1 API route, 1 static image
**Files to Modify**: `src/app/spin/page.tsx`, `src/app/layout.tsx`

---

## 📋 Complete Implementation Checklist

### Phase 1: Critical (Do First)
- [ ] **Add WalletConnect Project ID** (5 minutes)
  - Visit cloud.walletconnect.com
  - Get Project ID
  - Update `.env.local`

### Phase 2: High Priority (1-2 weeks)
- [ ] **Sound Effects** (2-3 hours)
  - Find/create 5 sound files
  - Create `useSoundEffects` hook
  - Integrate into spin page
  - Add mute toggle

- [ ] **Double-Up Bonus** (3-4 hours)
  - Create `DoubleUpChallenge` component
  - Add coin flip animation
  - Integrate into win flow
  - Add analytics tracking

- [ ] **Full Referral System** (6-8 hours)
  - Generate referral codes
  - Track referee sign-ups
  - Reward referrers with spins
  - Create referral dashboard
  - Add referral stats display

### Phase 3: Medium Priority (2-3 weeks)
- [ ] **Leaderboard** (4-5 hours)
  - Set up database schema
  - Create `RecentWinners` component
  - Build API endpoint
  - Add real-time updates

- [ ] **OG Images** (4-5 hours)
  - Create default OG image
  - Build dynamic OG image generator
  - Update metadata
  - Test social sharing

### Phase 4: Nice to Have (Low Priority)
- [ ] **Embeddable Widget** (3-4 hours)
  - Create embed page
  - Build embed code generator
  - Test iframe integration
  - Add documentation

---

## 📊 Total Effort Estimate

| Feature | Hours | Priority |
|---------|-------|----------|
| WalletConnect Config | 0.1 | CRITICAL |
| Sound Effects | 2-3 | HIGH |
| Double-Up Bonus | 3-4 | HIGH |
| Full Referral System | 6-8 | HIGH |
| Leaderboard | 4-5 | MEDIUM |
| OG Images | 4-5 | MEDIUM |
| Embeddable Widget | 3-4 | LOW |
| **TOTAL** | **23-32 hours** | - |

---

## 🎯 Recommended Sequence

**Week 1:**
1. Configure WalletConnect ID (5 min)
2. Add Sound Effects (3 hours)
3. Implement Double-Up (4 hours)

**Week 2:**
4. Build Full Referral System (8 hours)
5. Add Leaderboard (5 hours)

**Week 3:**
6. Create OG Images (5 hours)
7. Build Embed Widget (4 hours) - Optional

---

## 🚀 Next Steps

To start implementation:

1. **Update .env.local** with WalletConnect Project ID
2. **Review and approve** this plan
3. **Prioritize** which features to build first
4. **Start with Phase 1** (Critical items)

Each feature can be built independently, so we can tackle them one at a time or in parallel.

---

**Last Updated**: October 7, 2025
**Status**: Ready for Implementation
