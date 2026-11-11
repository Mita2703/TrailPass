import crypto from 'node:crypto';
import { env } from '../config/env';

export interface QrTokenPayload {
  bookingId: string;
  bookingCode: string;
  trailId: string;
  climbDate: string; // YYYY-MM-DD
  memberCount: number;
}

/**
 * Membuat token QR bertanda tangan kriptografis HMAC-SHA256.
 * Format token: base64url(payload) + "." + hmacSignature
 */
export function signQrToken(payload: QrTokenPayload): string {
  const secret = env.QR_SIGNING_SECRET;
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(data).digest('base64url');
  return `${data}.${signature}`;
}

/**
 * Memverifikasi keaslian QR token dan mengembalikan payload aslinya jika valid.
 */
export function verifyQrToken(token: string): QrTokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [data, signature] = parts;
    const secret = env.QR_SIGNING_SECRET;
    const expected = crypto.createHmac('sha256', secret).update(data).digest('base64url');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      return null;
    }

    const json = Buffer.from(data, 'base64url').toString('utf-8');
    return JSON.parse(json) as QrTokenPayload;
  } catch {
    return null;
  }
}
