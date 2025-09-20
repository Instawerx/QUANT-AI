// src/lib/price-service.ts
import 'server-only';

type Cache = {
  price: number | null;
  lastFetched: number;
};

// Simple in-memory cache. In a larger-scale application, you might use Redis or a similar service.
const cache: Cache = {
  price: null,
  lastFetched: 0,
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Fetches the latest BNB price from CoinMarketCap, with in-memory caching.
 * This function is marked 'server-only' to ensure it's never run on the client.
 */
export async function getBnbPrice(): Promise<number> {
  const now = Date.now();

  // If cache is fresh, return cached price
  if (cache.price !== null && now - cache.lastFetched < CACHE_DURATION) {
    return cache.price;
  }

  const apiKey = process.env.COINMARKETCAP_API_KEY;
  if (!apiKey || apiKey === 'YOUR_COINMARKETCAP_API_KEY') {
    throw new Error('CoinMarketCap API key is not configured in .env file.');
  }

  const url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BNB';

  try {
    const response = await fetch(url, {
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
        'Accept': 'application/json',
      },
      // Next.js revalidation strategy
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(`API error: ${response.status} ${response.statusText} - ${errorBody?.status?.error_message}`);
    }

    const data = await response.json();
    const bnbData = data.data.BNB;

    if (!bnbData || !bnbData.quote || !bnbData.quote.USD) {
      throw new Error('Invalid data structure from CoinMarketCap API.');
    }

    const price = bnbData.quote.USD.price;
    const roundedPrice = parseFloat(price.toFixed(2));

    // Update cache
    cache.price = roundedPrice;
    cache.lastFetched = now;

    return roundedPrice;
  } catch (error) {
    console.error('Failed to fetch from CoinMarketCap:', error);
    // If fetching fails, return the last known price from cache if it exists,
    // otherwise re-throw the error.
    if (cache.price !== null) {
      return cache.price;
    }
    throw error;
  }
}
