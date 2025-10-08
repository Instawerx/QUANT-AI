import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = false;

/**
 * Get referral statistics for a user
 * GET /api/referral/stats?userId=0x123...
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    // TODO: Implement database query
    // Example implementation:
    /*
    const user = await db.users.findOne({ id: userId });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get referral count
    const referralCount = await db.referrals.count({
      referrerId: userId
    });

    // Get referral details
    const referrals = await db.referrals.find({
      referrerId: userId
    }).sort({ timestamp: -1 }).limit(10);

    // Calculate spins earned
    const spinsEarned = await db.referrals.count({
      referrerId: userId,
      bonusAwarded: true
    });

    return NextResponse.json({
      userId,
      referralCode: user.referralCode,
      stats: {
        totalReferrals: referralCount,
        spinsEarned,
        recentReferrals: referrals.map(r => ({
          refereeId: r.refereeId,
          timestamp: r.timestamp,
          bonusAwarded: r.bonusAwarded
        }))
      }
    });
    */

    // Temporary mock data for development
    const mockStats = {
      userId,
      referralCode: Buffer.from(userId).toString('base64').substring(0, 8).toUpperCase(),
      stats: {
        totalReferrals: 0,
        spinsEarned: 0,
        recentReferrals: []
      }
    };

    return NextResponse.json(mockStats);

  } catch (error) {
    console.error('Error fetching referral stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch referral stats' },
      { status: 500 }
    );
  }
}

/**
 * Get leaderboard of top referrers
 * GET /api/referral/stats/leaderboard
 */
export async function POST(req: NextRequest) {
  try {
    const { limit = 10 } = await req.json();

    // TODO: Implement database query
    // Example:
    /*
    const topReferrers = await db.users
      .aggregate([
        {
          $lookup: {
            from: 'referrals',
            localField: '_id',
            foreignField: 'referrerId',
            as: 'referrals'
          }
        },
        {
          $project: {
            userId: '$_id',
            referralCount: { $size: '$referrals' },
            walletAddress: 1
          }
        },
        {
          $sort: { referralCount: -1 }
        },
        {
          $limit: limit
        }
      ]);

    return NextResponse.json({
      leaderboard: topReferrers.map((user, index) => ({
        rank: index + 1,
        userId: user.userId,
        walletAddress: user.walletAddress,
        referralCount: user.referralCount
      }))
    });
    */

    // Temporary mock leaderboard
    return NextResponse.json({
      leaderboard: []
    });

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
