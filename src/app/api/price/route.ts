import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.COINAPI_KEY;
  if (!apiKey) {
    console.error('COINAPI_KEY is not configured in .env file');
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
      // Try to get more detailed error information from CoinAPI's response
      const errorText = await response.text();
      let errorDetails;
      try {
        errorDetails = JSON.parse(errorText);
      } catch (e) {
        errorDetails = { message: errorText };
      }
      console.error('CoinAPI Error:', { status: response.status, details: errorDetails });
      return NextResponse.json({ error: 'Failed to fetch price from CoinAPI', details: errorDetails.error || errorDetails.message || 'Unknown API error' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ price: data.rate });
  } catch (error: any) {
    console.error('Failed to fetch BNB price due to a network or other error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
