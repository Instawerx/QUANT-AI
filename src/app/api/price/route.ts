import { NextResponse } from 'next/server';
import { getBnbPrice } from '@/lib/price-service';

export const dynamic = 'force-static';
export const revalidate = false;

export async function GET() {
  try {
    const price = await getBnbPrice();
    return NextResponse.json({ price });
  } catch (error: any) {
    console.error('Error fetching CoinMarketCap price:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch price from CoinMarketCap', details: error.message },
      { status: 500 }
    );
  }
}
