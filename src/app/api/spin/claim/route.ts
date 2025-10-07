import { NextRequest, NextResponse } from 'next/server';

// Skip this route during static export
export const dynamic = 'error';

interface ClaimRequest {
  spinId: string;
  walletAddress: string;
  signature: string;
}

// Simulate database
const claimedPrizes = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const body: ClaimRequest = await request.json();
    const { spinId, walletAddress, signature } = body;

    // Validate input
    if (!spinId || !walletAddress || !signature) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if already claimed
    if (claimedPrizes.has(spinId)) {
      return NextResponse.json(
        { error: 'Prize already claimed' },
        { status: 400 }
      );
    }

    // In production: Verify signature matches spin validation
    // const isValid = await verifySignature(spinId, signature);

    // Simulate smart contract interaction
    // In production: Call SpinRewardClaimer.sol
    const txHash = `0x${Math.random().toString(16).substring(2)}`;

    const claimRecord = {
      spinId,
      walletAddress,
      timestamp: Date.now(),
      txHash,
      status: 'pending'
    };

    claimedPrizes.set(spinId, claimRecord);

    // Simulate blockchain confirmation
    setTimeout(() => {
      const record = claimedPrizes.get(spinId);
      if (record) {
        record.status = 'confirmed';
        claimedPrizes.set(spinId, record);
      }
    }, 5000);

    return NextResponse.json({
      success: true,
      txHash,
      status: 'pending',
      message: 'Prize claim initiated. Transaction pending confirmation.'
    });
  } catch (error) {
    console.error('Claim error:', error);
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

  const claim = claimedPrizes.get(spinId);

  if (!claim) {
    return NextResponse.json(
      { error: 'Claim not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(claim);
}
