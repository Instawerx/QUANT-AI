/**
 * Referral system utilities
 */

/**
 * Generate a unique referral code from a user ID or wallet address
 * @param userId - User ID or wallet address
 * @returns A unique 8-character referral code
 */
export function generateReferralCode(userId: string): string {
  // Use base64 encoding and take first 8 chars, make uppercase
  const encoded = Buffer.from(userId).toString('base64');
  return encoded.substring(0, 8).toUpperCase().replace(/[+/=]/g, '');
}

/**
 * Generate referral URL with code
 * @param referralCode - The referral code
 * @param baseUrl - Base URL of the application (optional, uses window.location if in browser)
 * @returns Full referral URL
 */
export function generateReferralUrl(referralCode: string, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/spin?ref=${referralCode}`;
}

/**
 * Extract referral code from URL
 * @param url - URL or search params string
 * @returns Referral code or null if not found
 */
export function extractReferralCode(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('ref');
  } catch {
    // Try as search params only
    const params = new URLSearchParams(url);
    return params.get('ref');
  }
}

/**
 * Store referral code in localStorage for later tracking
 * @param referralCode - The referral code to store
 */
export function storeReferralCode(referralCode: string): void {
  if (typeof window !== 'undefined' && referralCode) {
    localStorage.setItem('quantai_referral_code', referralCode);
    // Store timestamp for expiry check (30 days)
    localStorage.setItem('quantai_referral_timestamp', Date.now().toString());
  }
}

/**
 * Get stored referral code from localStorage
 * @returns Referral code or null if not found or expired
 */
export function getStoredReferralCode(): string | null {
  if (typeof window === 'undefined') return null;

  const code = localStorage.getItem('quantai_referral_code');
  const timestamp = localStorage.getItem('quantai_referral_timestamp');

  if (!code || !timestamp) return null;

  // Check if expired (30 days)
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
  const isExpired = Date.now() - parseInt(timestamp) > THIRTY_DAYS;

  if (isExpired) {
    clearReferralCode();
    return null;
  }

  return code;
}

/**
 * Clear stored referral code
 */
export function clearReferralCode(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('quantai_referral_code');
    localStorage.removeItem('quantai_referral_timestamp');
  }
}
