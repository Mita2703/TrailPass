import { describe, it, expect } from 'vitest';
import { signQrToken, verifyQrToken } from '../../lib/qr';
import { verifyMidtransSignature } from './midtrans.client';
import crypto from 'node:crypto';

describe('QR Token Signature', () => {
  it('berhasil membuat dan memverifikasi token QR bertanda tangan valid', () => {
    const payload = {
      bookingId: 'f56860d5-d01c-4b6e-a22a-2a1387693e50',
      bookingCode: 'TP-7K3M9Q',
      trailId: '984cfb77-b1a9-4b67-a229-373f1d4ca810',
      climbDate: '2026-11-20',
      memberCount: 3,
    };

    const token = signQrToken(payload);
    expect(typeof token).toBe('string');
    expect(token).toContain('.');

    const verified = verifyQrToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.bookingCode).toBe('TP-7K3M9Q');
    expect(verified?.memberCount).toBe(3);
  });

  it('menolak token QR yang dimanipulasi atau signature salah', () => {
    const payload = {
      bookingId: 'f56860d5-d01c-4b6e-a22a-2a1387693e50',
      bookingCode: 'TP-7K3M9Q',
      trailId: '984cfb77-b1a9-4b67-a229-373f1d4ca810',
      climbDate: '2026-11-20',
      memberCount: 3,
    };

    const token = signQrToken(payload);
    const tampered = token.slice(0, -4) + 'abcd';
    expect(verifyQrToken(tampered)).toBeNull();
  });
});

describe('Midtrans Signature Verification', () => {
  it('memvalidasi signature SHA512 Midtrans dengan benar', () => {
    const orderId = 'TP-7K3M9Q-123456';
    const statusCode = '200';
    const grossAmount = '150000.00';
    const serverKey = process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-mwArcF4YukozoC_EqnFg-sue';

    const raw = `${orderId}${statusCode}${grossAmount}${serverKey}`;
    const validSignature = crypto.createHash('sha512').update(raw).digest('hex');

    expect(verifyMidtransSignature(orderId, statusCode, grossAmount, validSignature)).toBe(true);
    expect(verifyMidtransSignature(orderId, statusCode, grossAmount, 'invalidsignature123')).toBe(false);
  });
});
