import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const PASSWORD = process.env.SEED_DEFAULT_PASSWORD ?? 'Trailpass123!';
const QUOTA_DAYS = 60;

// DATA CONTOH untuk demo. Verifikasi aturan dan jalur ke situs resmi pengelola
// sebelum dianggap sama dengan kenyataan.
const mountains = [
  {
    slug: 'merbabu',
    name: 'Gunung Merbabu',
    province: 'Jawa Tengah',
    regency: 'Boyolali',
    elevationM: 3145,
    lat: -7.4553,
    lng: 110.4403,
    timezone: 'Asia/Jakarta',
    agency: 'Balai Taman Nasional Gunung Merbabu',
    rules: { minGroup: 3, maxGroup: 10, minAge: 10, bookingCutoffDays: 1, holdMinutes: 15, maxDurationDays: 2, rescheduleDeadlineDays: 3 },
    trails: [
      { name: 'Selo', price: 30000, quota: 300 },
      { name: 'Thekelan', price: 30000, quota: 150 },
      { name: 'Suwanting', price: 30000, quota: 200 },
      { name: 'Cuntel', price: 30000, quota: 150 },
      { name: 'Wekas', price: 30000, quota: 200 },
    ],
  },
  {
    slug: 'gede-pangrango',
    name: 'Gunung Gede Pangrango',
    province: 'Jawa Barat',
    regency: 'Cianjur',
    elevationM: 2958,
    lat: -6.7845,
    lng: 106.9847,
    timezone: 'Asia/Jakarta',
    agency: 'Balai Besar Taman Nasional Gunung Gede Pangrango',
    rules: { minGroup: 1, maxGroup: 15, minAge: 12, bookingCutoffDays: 1, holdMinutes: 15, maxDurationDays: 2, rescheduleDeadlineDays: 3 },
    trails: [
      { name: 'Cibodas', price: 35000, quota: 600 },
      { name: 'Gunung Putri', price: 35000, quota: 300 },
      { name: 'Salabintana', price: 35000, quota: 150 },
    ],
  },
];

function nextDates(n: number): Date[] {
  const base = new Date();
  base.setUTCHours(0, 0, 0, 0);
  return Array.from({ length: n }, (_, i) => new Date(base.getTime() + i * 86_400_000));
}

async function main() {
  console.log('Mengisi data demo...');
  const passwordHash = await bcrypt.hash(PASSWORD, 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@trailpass.test' },
    update: {},
    create: { email: 'admin@trailpass.test', fullName: 'Admin TrailPass', role: 'admin', passwordHash, emailVerifiedAt: new Date() },
  });

  await prisma.user.upsert({
    where: { email: 'organizer.merbabu@trailpass.test' },
    update: {},
    create: {
      email: 'organizer.merbabu@trailpass.test', fullName: 'Organizer Demo', role: 'organizer', passwordHash,
      organizationName: 'Pengelola Demo', organizerStatus: 'approved', emailVerifiedAt: new Date(), createdById: admin.id,
    },
  });

  const climber = await prisma.user.upsert({
    where: { email: 'pendaki1@trailpass.test' },
    update: {},
    create: { email: 'pendaki1@trailpass.test', fullName: 'Pendaki Terverifikasi', role: 'climber', passwordHash, emailVerifiedAt: new Date() },
  });

  await prisma.climberProfile.upsert({
    where: { userId: climber.id },
    update: {},
    create: {
      userId: climber.id, nik: '3201000000000001', idType: 'ktp', birthDate: new Date('2000-01-15'), gender: 'male',
      emergencyContactName: 'Kontak Darurat Demo', emergencyContactPhone: '081200000000', idPhotoUrl: 'seed/ktp-demo.png',
      privacyConsentAt: new Date(), verifiedStatus: 'verified', verifiedById: admin.id, verifiedAt: new Date(),
    },
  });

  const dates = nextDates(QUOTA_DAYS);

  for (const m of mountains) {
    const mountain = await prisma.mountain.upsert({
      where: { slug: m.slug },
      update: {},
      create: {
        slug: m.slug, name: m.name, province: m.province, regency: m.regency, elevationM: m.elevationM,
        lat: m.lat, lng: m.lng, timezone: m.timezone, managingAgency: m.agency, isActive: true,
        description: 'Data demo. Aturan dan jalur perlu diverifikasi ke situs resmi.',
      },
    });

    await prisma.mountainRule.upsert({
      where: { mountainId: mountain.id },
      update: {},
      create: { mountainId: mountain.id, ...m.rules },
    });

    for (const t of m.trails) {
      let trail = await prisma.trail.findFirst({ where: { mountainId: mountain.id, name: t.name } });
      if (!trail) {
        trail = await prisma.trail.create({
          data: { mountainId: mountain.id, name: t.name, price: t.price, queueEnabled: true, queueMaxActive: 3 },
        });
      }
      await prisma.trailQuota.createMany({
        data: dates.map((date) => ({ trailId: trail!.id, date, totalQuota: t.quota })),
        skipDuplicates: true,
      });
    }
  }

  console.log('Selesai. Akun demo: admin@trailpass.test, organizer.merbabu@trailpass.test, pendaki1@trailpass.test');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());