import { describe, expect, it } from 'vitest';
import { closureChoiceSchema, rescheduleSchema } from './refunds.schema';

describe('Reschedule and Refund Schema Validations', () => {
  it('validasi rescheduleSchema menerima format tanggal YYYY-MM-DD yang sah', () => {
    expect(rescheduleSchema.safeParse({ newClimbDate: '2026-12-15' }).success).toBe(true);
    expect(rescheduleSchema.safeParse({ newClimbDate: 'invalid' }).success).toBe(false);
  });

  it('validasi closureChoiceSchema untuk pilihan reschedule saat jalur ditutup', () => {
    const validReschedule = {
      choice: 'reschedule' as const,
      newClimbDate: '2026-12-20',
    };
    expect(closureChoiceSchema.safeParse(validReschedule).success).toBe(true);

    const invalidReschedule = {
      choice: 'reschedule' as const,
      newClimbDate: 'bad-date',
    };
    expect(closureChoiceSchema.safeParse(invalidReschedule).success).toBe(false);
  });

  it('validasi closureChoiceSchema untuk pilihan refund membutuhkan data rekening lengkap', () => {
    const validRefund = {
      choice: 'refund' as const,
      bankName: 'BCA',
      accountNumber: '1234567890',
      accountHolder: 'Budi Santoso',
    };
    expect(closureChoiceSchema.safeParse(validRefund).success).toBe(true);

    const missingBank = {
      choice: 'refund' as const,
      bankName: '',
      accountNumber: '1234567890',
      accountHolder: 'Budi Santoso',
    };
    expect(closureChoiceSchema.safeParse(missingBank).success).toBe(false);

    const shortAccount = {
      choice: 'refund' as const,
      bankName: 'BCA',
      accountNumber: '12',
      accountHolder: 'Budi Santoso',
    };
    expect(closureChoiceSchema.safeParse(shortAccount).success).toBe(false);
  });

  it('menolak opsi choice di luar reschedule dan refund', () => {
    const invalidChoice = {
      choice: 'voucher',
    };
    expect(closureChoiceSchema.safeParse(invalidChoice).success).toBe(false);
  });
});

describe('Reschedule Business Logic Rules', () => {
  function daysBetween(fromDate: string, toDate: string): number {
    return Math.round((Date.parse(`${toDate}T00:00:00Z`) - Date.parse(`${fromDate}T00:00:00Z`)) / 86_400_000);
  }

  it('menghitung selisih hari untuk batas H-N reschedule dengan benar', () => {
    const today = '2026-11-10';
    const climbDateH3 = '2026-11-13';
    const climbDateH2 = '2026-11-12';

    expect(daysBetween(today, climbDateH3)).toBe(3);
    expect(daysBetween(today, climbDateH2)).toBe(2);

    const deadlineDays = 3;
    expect(daysBetween(today, climbDateH3) >= deadlineDays).toBe(true); // boleh reschedule
    expect(daysBetween(today, climbDateH2) >= deadlineDays).toBe(false); // batas lewat
  });
});
