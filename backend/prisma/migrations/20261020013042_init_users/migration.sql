-- CreateEnum
CREATE TYPE "Role" AS ENUM ('climber', 'organizer', 'admin', 'officer');

-- CreateEnum
CREATE TYPE "OrganizerStatus" AS ENUM ('pending', 'approved', 'blocked');

-- CreateEnum
CREATE TYPE "IdType" AS ENUM ('ktp', 'sim', 'kia', 'passport');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "VerifiedStatus" AS ENUM ('pending', 'verified', 'rejected');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255),
    "google_id" VARCHAR(100),
    "role" "Role" NOT NULL,
    "full_name" VARCHAR(150) NOT NULL,
    "phone" VARCHAR(20),
    "email_verified_at" TIMESTAMP(3),
    "organization_name" VARCHAR(150),
    "organizer_status" "OrganizerStatus",
    "created_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "climber_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "nik" VARCHAR(16) NOT NULL,
    "id_type" "IdType" NOT NULL,
    "birth_date" DATE NOT NULL,
    "gender" "Gender" NOT NULL,
    "emergency_contact_name" VARCHAR(150) NOT NULL,
    "emergency_contact_phone" VARCHAR(20) NOT NULL,
    "id_photo_url" VARCHAR(500) NOT NULL,
    "privacy_consent_at" TIMESTAMP(3) NOT NULL,
    "verified_status" "VerifiedStatus" NOT NULL DEFAULT 'pending',
    "rejection_reason" TEXT,
    "verified_by" UUID,
    "verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "climber_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "climber_profiles_user_id_key" ON "climber_profiles"("user_id");

-- CreateIndex
CREATE INDEX "climber_profiles_nik_idx" ON "climber_profiles"("nik");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "climber_profiles" ADD CONSTRAINT "climber_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "climber_profiles" ADD CONSTRAINT "climber_profiles_verified_by_fkey" FOREIGN KEY ("verified_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
