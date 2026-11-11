import { describe, expect, it } from 'vitest';
import {
  BulkUpdateQuotaSchema,
  CreateOfficerSchema,
  CreateTrailSchema,
  OrgRevenueFilterSchema,
} from './organizer.schema';

describe('Phase 4: Organizer Validation & Rules', () => {
  describe('Create Trail Schema', () => {
    it('accepts valid trail data', () => {
      const valid = {
        name: 'Jalur Cibodas',
        distanceKm: 8.5,
        estimatedHours: 6.5,
        difficulty: 'medium',
        price: 35000,
        priceForeign: 150000,
        queueEnabled: true,
        queueMaxActive: 25,
      };
      const parsed = CreateTrailSchema.safeParse(valid);
      expect(parsed.success).toBe(true);
    });

    it('rejects negative price', () => {
      const invalid = {
        name: 'Jalur Selabintana',
        price: -5000,
      };
      const parsed = CreateTrailSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
    });
  });

  describe('Bulk Quota Schema', () => {
    it('validates array of quotas with YYYY-MM-DD date format', () => {
      const valid = {
        quotas: [
          { date: '2026-11-01', totalQuota: 100, isClosed: false },
          { date: '2026-11-02', totalQuota: 100, isClosed: false, priceOverride: 40000 },
          { date: '2026-11-03', totalQuota: 0, isClosed: true },
        ],
      };
      const parsed = BulkUpdateQuotaSchema.safeParse(valid);
      expect(parsed.success).toBe(true);
    });

    it('rejects invalid date format', () => {
      const invalid = {
        quotas: [
          { date: '01-11-2026', totalQuota: 50 },
        ],
      };
      const parsed = BulkUpdateQuotaSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
    });
  });

  describe('Create Officer Schema', () => {
    it('requires valid email and min 8 characters password', () => {
      const valid = {
        fullName: 'Petugas Pos Kandang Badak',
        email: 'petugas1@gedepangrango.id',
        password: 'passwordAman123',
        phone: '081234567890',
      };
      expect(CreateOfficerSchema.safeParse(valid).success).toBe(true);

      const invalidEmail = { ...valid, email: 'not-an-email' };
      expect(CreateOfficerSchema.safeParse(invalidEmail).success).toBe(false);

      const invalidPassword = { ...valid, password: 'short' };
      expect(CreateOfficerSchema.safeParse(invalidPassword).success).toBe(false);
    });
  });

  describe('Revenue Filter Schema', () => {
    it('validates dates in YYYY-MM-DD format', () => {
      const valid = {
        dateFrom: '2026-11-01',
        dateTo: '2026-11-30',
      };
      expect(OrgRevenueFilterSchema.safeParse(valid).success).toBe(true);
    });
  });
});
