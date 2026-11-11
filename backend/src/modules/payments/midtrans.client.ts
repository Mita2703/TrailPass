import crypto from 'node:crypto';
import { env } from '../../config/env';
import { AppError } from '../../middleware/errors';

const SNAP_SANDBOX_URL = 'https://app.sandbox.midtrans.com/snap/v1/transactions';
const SNAP_PRODUCTION_URL = 'https://app.midtrans.com/snap/v1/transactions';

export interface CreateSnapTransactionParams {
  orderId: string;
  grossAmount: number;
  expiryDurationMinutes: number;
  customerDetails: {
    fullName: string;
    email: string;
    phone?: string | null;
  };
  itemDetails: Array<{
    id: string;
    price: number;
    quantity: number;
    name: string;
  }>;
}

export interface SnapTransactionResponse {
  token: string;
  redirect_url: string;
}

export async function requestSnapToken(params: CreateSnapTransactionParams): Promise<SnapTransactionResponse> {
  const url = env.MIDTRANS_IS_PRODUCTION ? SNAP_PRODUCTION_URL : SNAP_SANDBOX_URL;
  const authHeader = `Basic ${Buffer.from(`${env.MIDTRANS_SERVER_KEY}:`).toString('base64')}`;

  const payload = {
    transaction_details: {
      order_id: params.orderId,
      gross_amount: params.grossAmount,
    },
    customer_details: {
      first_name: params.customerDetails.fullName,
      email: params.customerDetails.email,
      phone: params.customerDetails.phone || undefined,
    },
    item_details: params.itemDetails,
    expiry: {
      unit: 'minute',
      duration: Math.max(1, params.expiryDurationMinutes),
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: authHeader,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Midtrans Snap Error:', errorBody);
    throw new AppError(502, 'Gagal menghubungkan layanan pembayaran Midtrans', 'MIDTRANS_API_ERROR');
  }

  return (await response.json()) as SnapTransactionResponse;
}

/**
 * Verifikasi signature SHA512 dari notifikasi Webhook Midtrans.
 * Signature Formula: SHA512(order_id + status_code + gross_amount + ServerKey)
 */
export function verifyMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string,
): boolean {
  const raw = `${orderId}${statusCode}${grossAmount}${env.MIDTRANS_SERVER_KEY}`;
  const computed = crypto.createHash('sha512').update(raw).digest('hex');
  return computed === signatureKey;
}
