-- CreateEnum
CREATE TYPE "AdvisoryStatus" AS ENUM ('open', 'limited', 'closed');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('info', 'warning', 'danger');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('tutorial', 'faq', 'checklist', 'news');

-- CreateTable
CREATE TABLE "mountain_organizers" (
    "mountain_id" UUID NOT NULL,
    "organizer_id" UUID NOT NULL,
    "assigned_by" UUID,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mountain_organizers_pkey" PRIMARY KEY ("mountain_id","organizer_id")
);

-- CreateTable
CREATE TABLE "officer_assignments" (
    "officer_id" UUID NOT NULL,
    "mountain_id" UUID NOT NULL,

    CONSTRAINT "officer_assignments_pkey" PRIMARY KEY ("officer_id","mountain_id")
);

-- CreateTable
CREATE TABLE "trail_advisories" (
    "id" UUID NOT NULL,
    "trail_id" UUID NOT NULL,
    "status" "AdvisoryStatus" NOT NULL,
    "max_checkpoint_id" UUID,
    "reason" VARCHAR(200),
    "message" TEXT,
    "severity" "Severity" NOT NULL DEFAULT 'info',
    "valid_from" TIMESTAMP(3) NOT NULL,
    "valid_until" TIMESTAMP(3),
    "source_url" VARCHAR(500),
    "set_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trail_advisories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attractions" (
    "id" UUID NOT NULL,
    "mountain_id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "image" VARCHAR(500),
    "lat" DECIMAL(9,6),
    "lng" DECIMAL(9,6),

    CONSTRAINT "attractions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" UUID NOT NULL,
    "mountain_id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "file_url" VARCHAR(500) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mountain_contents" (
    "id" UUID NOT NULL,
    "mountain_id" UUID NOT NULL,
    "type" "ContentType" NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "body" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "mountain_contents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "trail_advisories_trail_id_valid_from_idx" ON "trail_advisories"("trail_id", "valid_from");

-- CreateIndex
CREATE INDEX "mountain_contents_mountain_id_type_sort_order_idx" ON "mountain_contents"("mountain_id", "type", "sort_order");

-- AddForeignKey
ALTER TABLE "mountain_organizers" ADD CONSTRAINT "mountain_organizers_mountain_id_fkey" FOREIGN KEY ("mountain_id") REFERENCES "mountains"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mountain_organizers" ADD CONSTRAINT "mountain_organizers_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mountain_organizers" ADD CONSTRAINT "mountain_organizers_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "officer_assignments" ADD CONSTRAINT "officer_assignments_officer_id_fkey" FOREIGN KEY ("officer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "officer_assignments" ADD CONSTRAINT "officer_assignments_mountain_id_fkey" FOREIGN KEY ("mountain_id") REFERENCES "mountains"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trail_advisories" ADD CONSTRAINT "trail_advisories_trail_id_fkey" FOREIGN KEY ("trail_id") REFERENCES "trails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trail_advisories" ADD CONSTRAINT "trail_advisories_max_checkpoint_id_fkey" FOREIGN KEY ("max_checkpoint_id") REFERENCES "checkpoints"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trail_advisories" ADD CONSTRAINT "trail_advisories_set_by_fkey" FOREIGN KEY ("set_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attractions" ADD CONSTRAINT "attractions_mountain_id_fkey" FOREIGN KEY ("mountain_id") REFERENCES "mountains"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_mountain_id_fkey" FOREIGN KEY ("mountain_id") REFERENCES "mountains"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mountain_contents" ADD CONSTRAINT "mountain_contents_mountain_id_fkey" FOREIGN KEY ("mountain_id") REFERENCES "mountains"("id") ON DELETE CASCADE ON UPDATE CASCADE;
