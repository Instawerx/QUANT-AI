import { NextResponse } from 'next/server';

export async function GET() {
  // Using Binance's public API which does not require an API key for this endpoint.
  const url = 'https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT';

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
      next: {
        revalidate: 10 // Revalidate every 10 seconds
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorDetails;
      try {
        errorDetails = JSON.parse(errorText);
      } catch (e) {
        errorDetails = { message: errorText };
      }
      console.error('Binance API Error:', { status: response.status, details: errorDetails });
      return NextResponse.json({ error: 'Failed to fetch price from Binance API', details: errorDetails.msg || errorDetails.message || 'Unknown API error' }, { status: response.status });
    }

    const data = await response.json();
    
    // The price from Binance is a string, so we need to parse it to a number.
    const price = parseFloat(data.price);

    if (isNaN(price)) {
      console.error('Binance API Error: Invalid price format received', data);
      return NextResponse.json({ error: 'Invalid price format received from Binance' }, { status: 500 });
    }

    return NextResponse.json({ price: price });
  } catch (error: any) {
    console.error('Failed to fetch BNB price due to a network or other error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
