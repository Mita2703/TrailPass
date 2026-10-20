DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'trail_quotas_sold_range') THEN
    ALTER TABLE trail_quotas
      ADD CONSTRAINT trail_quotas_sold_range CHECK (sold >= 0 AND sold <= total_quota);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'trail_quotas_total_nonneg') THEN
    ALTER TABLE trail_quotas
      ADD CONSTRAINT trail_quotas_total_nonneg CHECK (total_quota >= 0);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bookings_member_count_pos') THEN
    ALTER TABLE bookings
      ADD CONSTRAINT bookings_member_count_pos CHECK (member_count >= 1);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mountain_rules_group_range') THEN
    ALTER TABLE mountain_rules
      ADD CONSTRAINT mountain_rules_group_range CHECK (min_group >= 1 AND max_group >= min_group);
  END IF;
END $$;