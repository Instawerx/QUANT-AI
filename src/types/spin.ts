export interface Prize {
  id: number;
  amount: number;
  currency: 'BNB' | 'ETH';
  color: string;
  probability: number;
  label: string;
}

export interface SpinResult {
  prize: Prize | null;
  spinNumber: number;
  isWin: boolean;
  isNearMiss: boolean;
  rotation: number;
}

export interface UserSpinData {
  spinsRemaining: number;
  totalSpins: number;
  wins: Prize[];
  fingerprint: string;
  referralCode?: string;
}

export interface WinRecord {
  id: string;
  userId: string;
  prize: Prize;
  timestamp: number;
  claimed: boolean;
  signature?: string;
  walletAddress?: string;
}

export const PRIZES: Prize[] = [
  {
    id: 1,
    amount: 0.25,
    currency: 'BNB',
    color: '#FFD700',
    probability: 0.35,
    label: '0.25 BNB'
  },
  {
    id: 2,
    amount: 0.5,
    currency: 'BNB',
    color: '#FF6B9D',
    probability: 0.25,
    label: '0.5 BNB'
  },
  {
    id: 3,
    amount: 0.125,
    currency: 'ETH',
    color: '#00F0FF',
    probability: 0.20,
    label: '0.125 ETH'
  },
  {
    id: 4,
    amount: 1,
    currency: 'BNB',
    color: '#B030FF',
    probability: 0.10,
    label: '1 BNB'
  },
  {
    id: 5,
    amount: 0.5,
    currency: 'ETH',
    color: '#4ECDC4',
    probability: 0.07,
    label: '0.5 ETH'
  },
  {
    id: 6,
    amount: 0.8,
    currency: 'ETH',
    color: '#FF6B35',
    probability: 0.03,
    label: '0.8 ETH'
  },
  {
    id: 7,
    amount: 0,
    currency: 'BNB',
    color: '#1A1F3A',
    probability: 0,
    label: 'Try Again'
  }
];

export const SEGMENT_COUNT = PRIZES.length;
export const DEGREES_PER_SEGMENT = 360 / SEGMENT_COUNT;
