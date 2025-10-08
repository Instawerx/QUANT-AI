import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = false;

/**
 * Track referral when a new user signs up
 * POST /api/referral/track
 *
 * Body: {
 *   referralCode: string,
 *   newUserId: string (wallet address)
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const { referralCode, newUserId } = await req.json();

    if (!referralCode || !newUserId) {
      return NextResponse.json(
        { error: 'Missing referralCode or newUserId' },
        { status: 400 }
      );
    }

    // TODO: Implement database storage
    // For now, this is a placeholder that would:
    // 1. Find referrer by referralCode
    // 2. Check if newUserId hasn't already been referred
    // 3. Increment referrer's spins
    // 4. Record referral in database

    // Example implementation (requires database):
    /*
    const referrer = await db.users.findOne({ referralCode });

    if (!referrer) {
      return NextResponse.json(
        { error: 'Invalid referral code' },
        { status: 404 }
      );
    }

    // Check if user was already referred
    const existingReferral = await db.referrals.findOne({
      refereeId: newUserId
    });

    if (existingReferral) {
      return NextResponse.json(
        { error: 'User already referred' },
        { status: 400 }
      );
    }

    // Award bonus spin to referrer
    await db.users.update(referrer.id, {
      spinsRemaining: (referrer.spinsRemaining || 0) + 1
    });

    // Record referral
    await db.referrals.create({
      referrerId: referrer.id,
      refereeId: newUserId,
      referralCode,
      timestamp: Date.now(),
      bonusAwarded: true
    });
    */

    // Temporary success response
    return NextResponse.json({
      success: true,
      message: 'Referral tracked successfully',
      // In production, would return: { referrerId, bonusSpinsAwarded: 1 }
    });

  } catch (error) {
    console.error('Error tracking referral:', error);
    return NextResponse.json(
      { error: 'Failed to track referral' },
      { status: 500 }
    );
  }
}

/**
 * Get referral information by code
 * GET /api/referral/track?code=ABC123
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: 'Missing referral code' },
        { status: 400 }
      );
    }

    // TODO: Look up referral code in database
    // Example:
    /*
    const referrer = await db.users.findOne({ referralCode: code });

    if (!referrer) {
      return NextResponse.json(
        { error: 'Invalid referral code' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      valid: true,
      referrerName: referrer.name || 'A friend',
      bonusOffer: '+1 Free Spin'
    });
    */

    // Temporary response
    return NextResponse.json({
      valid: true,
      referrerName: 'A friend',
      bonusOffer: '+1 Free Spin'
    });

  } catch (error) {
    console.error('Error checking referral code:', error);
    return NextResponse.json(
      { error: 'Failed to check referral code' },
      { status: 500 }
    );
  }
}
