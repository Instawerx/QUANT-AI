import { ethers } from 'ethers';
import { log } from './logger';

export class MetaMaskAuth {
  // Generate authentication message for user to sign
  static generateAuthMessage(address: string, timestamp: number): string {
    return `Please sign this message to authenticate with QuantAI:

Address: ${address}
Timestamp: ${timestamp}
Nonce: ${Math.random().toString(36).substring(7)}

By signing this message, you confirm that you own this wallet address and want to access QuantAI services.`;
  }

  // Verify MetaMask signature
  static async verifySignature(address: string, message: string, signature: string): Promise<boolean> {
    try {
      // Recover the address from the signature
      const recoveredAddress = ethers.verifyMessage(message, signature);

      // Compare addresses (case-insensitive)
      const isValid = recoveredAddress.toLowerCase() === address.toLowerCase();

      log.auth(address, 'signature_verification', {
        isValid,
        recoveredAddress,
        providedAddress: address,
      });

      return isValid;
    } catch (error) {
      log.error('Signature verification failed', {
        address,
        error: error instanceof Error ? error.message : error,
      });
      return false;
    }
  }

  // Validate message timestamp (prevent replay attacks)
  static isMessageTimestampValid(timestamp: number, maxAgeMs: number = 5 * 60 * 1000): boolean {
    const now = Date.now();
    const messageAge = now - timestamp;

    // Message should not be too old or from the future
    const isValid = messageAge >= 0 && messageAge <= maxAgeMs;

    if (!isValid) {
      log.security('invalid_message_timestamp', {
        timestamp,
        now,
        messageAge,
        maxAgeMs,
      });
    }

    return isValid;
  }

  // Extract timestamp from authentication message
  static extractTimestampFromMessage(message: string): number | null {
    try {
      const timestampMatch = message.match(/Timestamp: (\d+)/);
      if (!timestampMatch) {
        return null;
      }
      return parseInt(timestampMatch[1], 10);
    } catch (error) {
      log.error('Failed to extract timestamp from message', { message, error });
      return null;
    }
  }

  // Generate session ID
  static generateSessionId(): string {
    return ethers.id(Math.random().toString() + Date.now().toString()).substring(0, 32);
  }

  // Validate Ethereum address format
  static isValidAddress(address: string): boolean {
    try {
      return ethers.isAddress(address);
    } catch {
      return false;
    }
  }
}

// Authentication middleware helper
export function requireAuth(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Missing or invalid authorization header',
    });
  }

  const sessionId = authHeader.substring(7); // Remove 'Bearer ' prefix

  // Session validation will be handled by the auth middleware
  req.sessionId = sessionId;
  next();
}