-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('easy', 'medium', 'hard');

-- CreateTable
CREATE TABLE "mountains" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(160) NOT NULL,
    "province" VARCHAR(100) NOT NULL,
    "regency" VARCHAR(100) NOT NULL,
    "elevation_m" INTEGER NOT NULL,
    "lat" DECIMAL(9,6) NOT NULL,
    "lng" DECIMAL(9,6) NOT NULL,
    "timezone" VARCHAR(40) NOT NULL DEFAULT 'Asia/Jakarta',
    "description" TEXT,
    "cover_image" VARCHAR(500),
    "managing_agency" VARCHAR(200),
    "official_url" VARCHAR(500),
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mountains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mountain_rules" (
    "id" UUID NOT NULL,
    "mountain_id" UUID NOT NULL,
    "min_group" INTEGER NOT NULL DEFAULT 1,
    "max_group" INTEGER NOT NULL,
    "min_age" INTEGER,
    "booking_cutoff_days" INTEGER NOT NULL DEFAULT 0,
    "hold_minutes" INTEGER NOT NULL,
    "max_duration_days" INTEGER NOT NULL,
    "reschedule_deadline_days" INTEGER,
    "require_briefing" BOOLEAN NOT NULL DEFAULT false,
    "extra_rules" JSONB,

    CONSTRAINT "mountain_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trails" (
    "id" UUID NOT NULL,
    "mountain_id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "distance_km" DECIMAL(5,2),
    "estimated_hours" DECIMAL(4,1),
    "difficulty" "Difficulty",
    "price" INTEGER NOT NULL,
    "price_foreign" INTEGER,
    "extra_fees" JSONB,
    "queue_enabled" BOOLEAN NOT NULL DEFAULT true,
    "queue_max_active" INTEGER NOT NULL DEFAULT 30,
    "rule_overrides" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checkpoints" (
    "id" UUID NOT NULL,
    "trail_id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "order_no" INTEGER NOT NULL,
    "lat" DECIMAL(9,6),
    "lng" DECIMAL(9,6),
    "is_summit" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "checkpoints_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mountains_slug_key" ON "mountains"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "mountain_rules_mountain_id_key" ON "mountain_rules"("mountain_id");

-- CreateIndex
CREATE INDEX "trails_mountain_id_idx" ON "trails"("mountain_id");

-- CreateIndex
CREATE UNIQUE INDEX "checkpoints_trail_id_order_no_key" ON "checkpoints"("trail_id", "order_no");

-- AddForeignKey
ALTER TABLE "mountain_rules" ADD CONSTRAINT "mountain_rules_mountain_id_fkey" FOREIGN KEY ("mountain_id") REFERENCES "mountains"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trails" ADD CONSTRAINT "trails_mountain_id_fkey" FOREIGN KEY ("mountain_id") REFERENCES "mountains"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkpoints" ADD CONSTRAINT "checkpoints_trail_id_fkey" FOREIGN KEY ("trail_id") REFERENCES "trails"("id") ON DELETE CASCADE ON UPDATE CASCADE;
