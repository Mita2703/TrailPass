import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const BASE_URL = `http://localhost:${process.env.PORT ?? 4000}/api/v1`;
const TOTAL_QUOTA = 20;
const CONCURRENT_USERS = 100; // Dapat dinaikkan hingga 500

async function main() {
  console.log('=====================================================');
  console.log('TrailPass High Concurrency & Anti-Overselling Test');
  console.log(`Menguji ${CONCURRENT_USERS} permintaan bersamaan untuk kuota ${TOTAL_QUOTA}`);
  console.log('=====================================================');

  // 1. Dapatkan token pengguna demo
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'pendaki1@trailpass.test',
      password: process.env.SEED_DEFAULT_PASSWORD || 'trailpass2703',
    }),
  });

  const loginBody: any = await loginRes.json();
  const token = loginBody.data?.token;
  if (!token) {
    console.warn('Login gagal. Memastikan server lokal aktif di port 4000 sebelum pengujian.');
    console.info('Tip: Jalankan backend terlebih dahulu dengan "npm run dev".');
    return;
  }

  // 2. Siapkan data jalur uji
  const trail = await prisma.trail.findFirstOrThrow({
    where: { name: 'Cibodas' },
  });

  const targetDate = new Date();
  targetDate.setUTCHours(0, 0, 0, 0);
  targetDate.setUTCDate(targetDate.getUTCDate() + 14);
  const dateStr = targetDate.toISOString().slice(0, 10);

  // Reset kuota & booking untuk tanggal uji
  await prisma.booking.deleteMany({
    where: { trailId: trail.id, climbDate: targetDate },
  });

  await prisma.trailQuota.upsert({
    where: { trailId_date: { trailId: trail.id, date: targetDate } },
    update: { totalQuota: TOTAL_QUOTA, sold: 0, isClosed: false },
    create: { trailId: trail.id, date: targetDate, totalQuota: TOTAL_QUOTA, sold: 0, isClosed: false },
  });

  console.log(`Menjalankan ${CONCURRENT_USERS} permintaan booking serentak...`);
  const startTime = Date.now();

  const requests = Array.from({ length: CONCURRENT_USERS }, async (_, index) => {
    try {
      const res = await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'Idempotency-Key': `load-test-${startTime}-${index}`,
        },
        body: JSON.stringify({
          trailId: trail.id,
          climbDate: dateStr,
          memberCount: 1,
        }),
      });
      const data: any = await res.json();
      return { status: res.status, code: data.error?.code ?? 'OK' };
    } catch (e: any) {
      return { status: 500, code: e.message };
    }
  });

  const results = await Promise.all(requests);
  const elapsed = Date.now() - startTime;

  const summary: Record<string, number> = {};
  for (const r of results) {
    const key = `${r.status} ${r.code}`;
    summary[key] = (summary[key] || 0) + 1;
  }

  console.log('\n--- HASIL UJI KONKURENSI ---');
  console.log(`Waktu eksekusi: ${elapsed} ms (~${Math.round((CONCURRENT_USERS / elapsed) * 1000)} req/s)`);
  console.log('Rangkuman respon:', summary);

  const heldBookings = await prisma.booking.count({
    where: { trailId: trail.id, climbDate: targetDate, status: 'pending' },
  });

  console.log(`\nVerifikasi Database:`);
  console.log(`Booking 'pending' yang berhasil dibuat: ${heldBookings} tiket`);
  console.log(`Batas kuota yang tersedia: ${TOTAL_QUOTA}`);

  if (heldBookings <= TOTAL_QUOTA) {
    console.log('✅ UJI BERHASIL: Tidak terjadi overselling (kuota aman terlindungi oleh transaksi atomik Prisma).');
  } else {
    console.error('❌ UJI GAGAL: Terjadi overselling kuota melebihi batas!');
  }

  // Bersihkan data uji
  await prisma.booking.deleteMany({
    where: { trailId: trail.id, climbDate: targetDate },
  });
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(() => prisma.$disconnect());
