-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('pending', 'paid', 'completed', 'expired', 'failed', 'rescheduled', 'cancelled_by_closure', 'refund_requested', 'refunded');

-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('not_entered', 'climbing', 'exited', 'manual_exit', 'cancelled', 'no_show');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'settlement', 'expire', 'cancel', 'deny');

-- CreateEnum
CREATE TYPE "RefundStatus" AS ENUM ('requested', 'refunded', 'rejected');

-- CreateEnum
CREATE TYPE "ScanType" AS ENUM ('in', 'out');

-- CreateEnum
CREATE TYPE "ScanMethod" AS ENUM ('qr', 'manual');

-- CreateTable
CREATE TABLE "trail_quotas" (
    "id" UUID NOT NULL,
    "trail_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "total_quota" INTEGER NOT NULL,
    "sold" INTEGER NOT NULL DEFAULT 0,
    "is_closed" BOOLEAN NOT NULL DEFAULT false,
    "price_override" INTEGER,
    "booking_opens_at" TIMESTAMP(3),

    CONSTRAINT "trail_quotas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" UUID NOT NULL,
    "booking_code" VARCHAR(12) NOT NULL,
    "qr_token" VARCHAR(255),
    "leader_user_id" UUID NOT NULL,
    "trail_id" UUID NOT NULL,
    "climb_date" DATE NOT NULL,
    "member_count" INTEGER NOT NULL,
    "total_amount" INTEGER NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'pending',
    "expires_at" TIMESTAMP(3) NOT NULL,
    "rescheduled_count" INTEGER NOT NULL DEFAULT 0,
    "rescheduled_from_date" DATE,
    "idempotency_key" VARCHAR(80),
    "agreed_rules_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_members" (
    "id" UUID NOT NULL,
    "booking_id" UUID NOT NULL,
    "full_name" VARCHAR(150) NOT NULL,
    "nik" VARCHAR(16) NOT NULL,
    "birth_date" DATE NOT NULL,
    "gender" "Gender" NOT NULL,
    "emergency_contact" VARCHAR(200) NOT NULL,
    "is_foreign" BOOLEAN NOT NULL DEFAULT false,
    "price_applied" INTEGER NOT NULL,
    "parent_letter_url" VARCHAR(500),
    "health_letter_url" VARCHAR(500),
    "status" "MemberStatus" NOT NULL DEFAULT 'not_entered',
    "checkin_at" TIMESTAMP(3),
    "checkin_by" UUID,
    "checkout_at" TIMESTAMP(3),
    "checkout_by" UUID,
    "checkout_note" TEXT,

    CONSTRAINT "booking_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "booking_id" UUID NOT NULL,
    "midtrans_order_id" VARCHAR(100) NOT NULL,
    "snap_token" VARCHAR(255),
    "method" VARCHAR(50),
    "gross_amount" INTEGER NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "raw_notification" JSONB,
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refund_requests" (
    "id" UUID NOT NULL,
    "booking_id" UUID NOT NULL,
    "reason" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" "RefundStatus" NOT NULL DEFAULT 'requested',
    "processed_by" UUID,
    "processed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refund_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gate_scans" (
    "id" UUID NOT NULL,
    "booking_id" UUID NOT NULL,
    "trail_id" UUID NOT NULL,
    "scan_type" "ScanType" NOT NULL,
    "scan_method" "ScanMethod" NOT NULL,
    "scanned_by" UUID NOT NULL,
    "scanned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,

    CONSTRAINT "gate_scans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gate_scan_members" (
    "scan_id" UUID NOT NULL,
    "member_id" UUID NOT NULL,

    CONSTRAINT "gate_scan_members_pkey" PRIMARY KEY ("scan_id","member_id")
);

-- CreateTable
CREATE TABLE "blacklists" (
    "id" UUID NOT NULL,
    "nik" VARCHAR(16) NOT NULL,
    "full_name" VARCHAR(150) NOT NULL,
    "reason" TEXT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blacklists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "actor_id" UUID,
    "action" VARCHAR(100) NOT NULL,
    "target_type" VARCHAR(50),
    "target_id" UUID,
    "detail" JSONB,
    "ip_address" VARCHAR(45),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_companions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "full_name" VARCHAR(150) NOT NULL,
    "nik" VARCHAR(16) NOT NULL,
    "birth_date" DATE NOT NULL,
    "gender" "Gender" NOT NULL,
    "emergency_contact" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_companions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "trail_quotas_trail_id_date_key" ON "trail_quotas"("trail_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_booking_code_key" ON "bookings"("booking_code");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_qr_token_key" ON "bookings"("qr_token");

-- CreateIndex
CREATE INDEX "bookings_trail_id_climb_date_status_idx" ON "bookings"("trail_id", "climb_date", "status");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_leader_user_id_idempotency_key_key" ON "bookings"("leader_user_id", "idempotency_key");

-- CreateIndex
CREATE INDEX "booking_members_booking_id_idx" ON "booking_members"("booking_id");

-- CreateIndex
CREATE INDEX "booking_members_nik_idx" ON "booking_members"("nik");

-- CreateIndex
CREATE INDEX "booking_members_status_idx" ON "booking_members"("status");

-- CreateIndex
CREATE UNIQUE INDEX "payments_midtrans_order_id_key" ON "payments"("midtrans_order_id");

-- CreateIndex
CREATE INDEX "payments_booking_id_idx" ON "payments"("booking_id");

-- CreateIndex
CREATE INDEX "gate_scans_booking_id_scanned_at_idx" ON "gate_scans"("booking_id", "scanned_at");

-- CreateIndex
CREATE INDEX "blacklists_nik_idx" ON "blacklists"("nik");

-- CreateIndex
CREATE INDEX "audit_logs_actor_id_created_at_idx" ON "audit_logs"("actor_id", "created_at");

-- AddForeignKey
ALTER TABLE "trail_quotas" ADD CONSTRAINT "trail_quotas_trail_id_fkey" FOREIGN KEY ("trail_id") REFERENCES "trails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_leader_user_id_fkey" FOREIGN KEY ("leader_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_trail_id_fkey" FOREIGN KEY ("trail_id") REFERENCES "trails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_members" ADD CONSTRAINT "booking_members_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_members" ADD CONSTRAINT "booking_members_checkin_by_fkey" FOREIGN KEY ("checkin_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_members" ADD CONSTRAINT "booking_members_checkout_by_fkey" FOREIGN KEY ("checkout_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refund_requests" ADD CONSTRAINT "refund_requests_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refund_requests" ADD CONSTRAINT "refund_requests_processed_by_fkey" FOREIGN KEY ("processed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gate_scans" ADD CONSTRAINT "gate_scans_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gate_scans" ADD CONSTRAINT "gate_scans_trail_id_fkey" FOREIGN KEY ("trail_id") REFERENCES "trails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gate_scans" ADD CONSTRAINT "gate_scans_scanned_by_fkey" FOREIGN KEY ("scanned_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gate_scan_members" ADD CONSTRAINT "gate_scan_members_scan_id_fkey" FOREIGN KEY ("scan_id") REFERENCES "gate_scans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gate_scan_members" ADD CONSTRAINT "gate_scan_members_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "booking_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blacklists" ADD CONSTRAINT "blacklists_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_companions" ADD CONSTRAINT "saved_companions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
