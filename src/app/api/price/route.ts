import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.COINAPI_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  const url = 'https://rest.coinapi.io/v1/exchangerate/BNB/USD';

  try {
    const response = await fetch(url, {
      headers: {
        'X-CoinAPI-Key': apiKey,
      },
      next: {
        revalidate: 10 // Revalidate every 10 seconds
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('CoinAPI Error:', errorData);
      return NextResponse.json({ error: 'Failed to fetch price from CoinAPI', details: errorData }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ price: data.rate });
  } catch (error) {
    console.error('Failed to fetch BNB price:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
