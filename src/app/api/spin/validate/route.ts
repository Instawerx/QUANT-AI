import { NextRequest, NextResponse } from 'next/server';
import { keccak256, toUtf8Bytes } from 'ethers';

// Skip this route during static export
export const dynamic = 'error';

// In production, store this securely in environment variables
const SERVER_PRIVATE_KEY = process.env.SPIN_SERVER_PRIVATE_KEY || '';

interface SpinValidationRequest {
  spinId: string;
  userId: string;
  prize: {
    amount: number;
    currency: string;
  };
  userFingerprint: string;
}

// Simulate database storage (in production, use PostgreSQL/MongoDB)
const validatedSpins = new Map<string, any>();
const userSpinCount = new Map<string, number>();

export async function POST(request: NextRequest) {
  try {
    const body: SpinValidationRequest = await request.json();
    const { spinId, userId, prize, userFingerprint } = body;

    // Validate input
    if (!spinId || !userId || !prize || !userFingerprint) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user has already spun (anti-fraud)
    const existingSpins = userSpinCount.get(userFingerprint) || 0;
    if (existingSpins >= 3) {
      return NextResponse.json(
        { error: 'Maximum spins reached' },
        { status: 429 }
      );
    }

    // Check if spin already validated
    if (validatedSpins.has(spinId)) {
      return NextResponse.json(
        { error: 'Spin already validated' },
        { status: 400 }
      );
    }

    // Generate server signature for smart contract verification
    const message = `${spinId}:${userId}:${prize.amount}:${prize.currency}`;
    const messageHash = keccak256(toUtf8Bytes(message));

    // Store validated spin
    const spinRecord = {
      spinId,
      userId,
      prize,
      userFingerprint,
      timestamp: Date.now(),
      messageHash,
      claimed: false
    };

    validatedSpins.set(spinId, spinRecord);
    userSpinCount.set(userFingerprint, existingSpins + 1);

    return NextResponse.json({
      success: true,
      spinId,
      signature: messageHash, // In production, sign with private key
      prize,
      spinsRemaining: 3 - (existingSpins + 1)
    });
  } catch (error) {
    console.error('Spin validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const spinId = searchParams.get('spinId');

  if (!spinId) {
    return NextResponse.json(
      { error: 'spinId required' },
      { status: 400 }
    );
  }

  const spin = validatedSpins.get(spinId);

  if (!spin) {
    return NextResponse.json(
      { error: 'Spin not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(spin);
}
