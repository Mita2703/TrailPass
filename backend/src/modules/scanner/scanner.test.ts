import { describe, expect, it } from 'vitest';
import {
  checkInSchema,
  checkOutSchema,
  markMemberSchema,
  resolveQrSchema,
  searchQuerySchema,
} from './scanner.schema';

describe('Scanner Schema Validations', () => {
  it('validasi resolveQrSchema menerima qrToken atau bookingCode', () => {
    expect(resolveQrSchema.safeParse({ qrToken: 'valid-token' }).success).toBe(true);
    expect(resolveQrSchema.safeParse({ bookingCode: 'TP-7K3M9Q' }).success).toBe(true);
    expect(resolveQrSchema.safeParse({}).success).toBe(false);
  });

  it('validasi checkInSchema membutuhkan bookingId, trailId, dan minimal 1 memberId', () => {
    const valid = {
      bookingId: 'f56860d5-d01c-4b6e-a22a-2a1387693e50',
      trailId: '984cfb77-b1a9-4b67-a229-373f1d4ca810',
      memberIds: ['7a097223-1498-4b72-b88e-67096e8140f0'],
      method: 'qr' as const,
    };
    expect(checkInSchema.safeParse(valid).success).toBe(true);

    const emptyMembers = {
      ...valid,
      memberIds: [],
    };
    expect(checkInSchema.safeParse(emptyMembers).success).toBe(false);

    const invalidUuid = {
      ...valid,
      bookingId: 'invalid-id',
    };
    expect(checkInSchema.safeParse(invalidUuid).success).toBe(false);
  });

  it('validasi checkOutSchema mendukung catatan sampah / kondisi pendaki', () => {
    const valid = {
      bookingId: 'f56860d5-d01c-4b6e-a22a-2a1387693e50',
      trailId: '984cfb77-b1a9-4b67-a229-373f1d4ca810',
      memberIds: ['7a097223-1498-4b72-b88e-67096e8140f0'],
      method: 'manual' as const,
      note: 'Sampah lengkap 2 kantong, kondisi sehat',
    };
    const parsed = checkOutSchema.safeParse(valid);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.note).toBe('Sampah lengkap 2 kantong, kondisi sehat');
      expect(parsed.data.method).toBe('manual');
    }
  });

  it('validasi markMemberSchema hanya menerima status manual_exit dan cancelled dengan alasan', () => {
    expect(
      markMemberSchema.safeParse({
        status: 'manual_exit',
        reason: 'Evakuasi medis karena cedera kaki',
      }).success,
    ).toBe(true);

    expect(
      markMemberSchema.safeParse({
        status: 'cancelled',
        reason: 'Batal di pos karena sakit flu',
      }).success,
    ).toBe(true);

    // Ditolak jika status bukan yang diizinkan
    expect(
      markMemberSchema.safeParse({
        status: 'exited',
        reason: 'Sudah keluar normal',
      }).success,
    ).toBe(false);

    // Ditolak jika alasan terlalu pendek
    expect(
      markMemberSchema.safeParse({
        status: 'manual_exit',
        reason: 'ab',
      }).success,
    ).toBe(false);
  });

  it('validasi searchQuerySchema membutuhkan minimal 3 karakter pencarian', () => {
    expect(searchQuerySchema.safeParse({ q: 'Budi', type: 'in' }).success).toBe(true);
    expect(searchQuerySchema.safeParse({ q: 'TP-7K', type: 'out' }).success).toBe(true);
    expect(searchQuerySchema.safeParse({ q: 'ab', type: 'in' }).success).toBe(false);
    expect(searchQuerySchema.safeParse({ q: 'Budi', type: 'unknown' }).success).toBe(false);
  });
});

describe('Scanner Business Logic Rules', () => {
  it('mengecek apakah semua status akhir menyelesaikan status booking (completed)', () => {
    const finalStatuses = new Set(['exited', 'manual_exit', 'cancelled', 'no_show']);

    // Kasus 1: Seluruh anggota sudah exited / final
    const group1 = ['exited', 'exited', 'manual_exit'];
    const isCompleted1 = group1.every((s) => finalStatuses.has(s));
    expect(isCompleted1).toBe(true);

    // Kasus 2: Sebagian anggota masih di atas (climbing) -> rombongan turun terpisah
    const group2 = ['exited', 'climbing', 'exited'];
    const isCompleted2 = group2.every((s) => finalStatuses.has(s));
    expect(isCompleted2).toBe(false);

    // Kasus 3: Satu anggota batal sebelum naik (cancelled) dan satu sudah turun (exited)
    const group3 = ['cancelled', 'exited'];
    const isCompleted3 = group3.every((s) => finalStatuses.has(s));
    expect(isCompleted3).toBe(true);
  });

  it('zona waktu gunung menghasilkan format YYYY-MM-DD yang benar', () => {
    const dWib = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());
    const dWita = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Makassar' }).format(new Date());
    const dWit = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jayapura' }).format(new Date());

    expect(dWib).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(dWita).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(dWit).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
