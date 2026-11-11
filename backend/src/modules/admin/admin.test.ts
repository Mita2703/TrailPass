import { describe, expect, it } from 'vitest';
import { SetAdvisorySchema } from './advisories.schema';
import { VerifyProfileSchema } from './profiles.schema';
import { CreateBlacklistSchema } from './blacklist.schema';
import { CreateMountainSchema, SetMountainRulesSchema } from './organizers.schema';
import { ProcessRefundSchema } from './admin.schema';

describe('Phase 4: Admin Validation & Business Logic Rules', () => {
  describe('Advisories Schema', () => {
    it('validates a valid trail advisory input', () => {
      const valid = {
        status: 'closed',
        reason: 'Cuaca ekstrem badai',
        message: 'Jalur ditutup sementara demi keselamatan',
        severity: 'danger',
        validFrom: new Date().toISOString(),
        closureDateFrom: '2026-11-15',
        closureDateTo: '2026-11-17',
        cancelAffected: true,
      };
      const parsed = SetAdvisorySchema.safeParse(valid);
      expect(parsed.success).toBe(true);
    });

    it('rejects invalid status', () => {
      const invalid = {
        status: 'unknown_status',
        validFrom: new Date().toISOString(),
      };
      const parsed = SetAdvisorySchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
    });
  });

  describe('Profile Verification Schema', () => {
    it('allows verified decision without rejectionReason', () => {
      const valid = { decision: 'verified' };
      const parsed = VerifyProfileSchema.safeParse(valid);
      expect(parsed.success).toBe(true);
    });

    it('requires rejectionReason when decision is rejected', () => {
      const invalid = { decision: 'rejected' };
      const parsed = VerifyProfileSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);

      const valid = { decision: 'rejected', rejectionReason: 'Foto KTP buram dan tidak terbaca' };
      const parsedValid = VerifyProfileSchema.safeParse(valid);
      expect(parsedValid.success).toBe(true);
    });
  });

  describe('Blacklist Schema', () => {
    it('requires 16 digit NIK', () => {
      const invalid = {
        nik: '12345',
        fullName: 'Budi Santoso',
        reason: 'Merusak fasilitas pos 3',
        startDate: '2026-11-01',
      };
      const parsed = CreateBlacklistSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);

      const valid = {
        nik: '3201012345678901',
        fullName: 'Budi Santoso',
        reason: 'Merusak fasilitas pos 3',
        startDate: '2026-11-01',
      };
      const parsedValid = CreateBlacklistSchema.safeParse(valid);
      expect(parsedValid.success).toBe(true);
    });

    it('rejects endDate earlier than startDate', () => {
      const invalid = {
        nik: '3201012345678901',
        fullName: 'Budi Santoso',
        reason: 'Merusak fasilitas pos 3',
        startDate: '2026-11-10',
        endDate: '2026-11-05',
      };
      const parsed = CreateBlacklistSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
    });
  });

  describe('Mountain & Rules Schema', () => {
    it('validates slug format with alphanumeric and dash only', () => {
      const valid = {
        name: 'Gunung Rinjani',
        slug: 'gunung-rinjani',
        province: 'NTB',
        regency: 'Lombok Timur',
        elevationM: 3726,
        lat: -8.4167,
        lng: 116.4583,
      };
      const parsed = CreateMountainSchema.safeParse(valid);
      expect(parsed.success).toBe(true);

      const invalid = {
        ...valid,
        slug: 'Gunung Rinjani With Space',
      };
      const parsedInvalid = CreateMountainSchema.safeParse(invalid);
      expect(parsedInvalid.success).toBe(false);
    });

    it('validates mountain rules bounds', () => {
      const valid = {
        minGroup: 1,
        maxGroup: 10,
        holdMinutes: 30,
        maxDurationDays: 3,
        bookingCutoffDays: 1,
      };
      const parsed = SetMountainRulesSchema.safeParse(valid);
      expect(parsed.success).toBe(true);

      const invalid = {
        minGroup: 0, // min is 1
        maxGroup: 10,
        holdMinutes: 2, // min is 5
        maxDurationDays: 3,
      };
      const parsedInvalid = SetMountainRulesSchema.safeParse(invalid);
      expect(parsedInvalid.success).toBe(false);
    });
  });

  describe('Refund Processing Schema', () => {
    it('validates approve and reject action', () => {
      expect(ProcessRefundSchema.safeParse({ action: 'approve' }).success).toBe(true);
      expect(ProcessRefundSchema.safeParse({ action: 'reject', note: 'Bukan penutupan resmi' }).success).toBe(true);
      expect(ProcessRefundSchema.safeParse({ action: 'invalid' }).success).toBe(false);
    });
  });
});
