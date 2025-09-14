import { NextResponse } from 'next/server';
import { getBnbPrice } from '@/lib/price-service';

export const revalidate = 0;

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
