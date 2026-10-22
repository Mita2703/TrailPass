import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const BASE = `http://localhost:${process.env.PORT ?? 4000}/api/v1`;
const PASSWORD = process.env.SEED_DEFAULT_PASSWORD!;
const TOTAL = 3;
const ATTEMPTS = 10;

async function main() {
  const loginRes = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "pendaki1@trailpass.test",
      password: PASSWORD,
    }),
  });
  const loginBody: any = await loginRes.json();
  const token = loginBody.data?.token;
  if (!token)
    throw new Error(
      "Login gagal. Cek SEED_DEFAULT_PASSWORD di .env dan pastikan server berjalan.",
    );

  const trail = await prisma.trail.findFirstOrThrow({
    where: { name: "Cibodas" },
  });
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + 10);
  const dateStr = date.toISOString().slice(0, 10);

  const original = await prisma.trailQuota.findUniqueOrThrow({
    where: { trailId_date: { trailId: trail.id, date } },
  });
  await prisma.booking.deleteMany({
    where: { trailId: trail.id, climbDate: date },
  });
  await prisma.trailQuota.update({
    where: { id: original.id },
    data: { totalQuota: TOTAL, sold: 0 },
  });

  console.log(
    `Uji: ${ATTEMPTS} permintaan bersamaan, kuota ${TOTAL}, jalur Cibodas, tanggal ${dateStr}`,
  );

  const results = await Promise.all(
    Array.from({ length: ATTEMPTS }, async (_, i) => {
      const res = await fetch(`${BASE}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Idempotency-Key": `race-${Date.now()}-${i}`,
        },
        body: JSON.stringify({
          trailId: trail.id,
          climbDate: dateStr,
          memberCount: 1,
        }),
      });
      const body: any = await res.json();
      return `${res.status} ${body.error?.code ?? "OK"}`;
    }),
  );

  const tally: Record<string, number> = {};
  for (const r of results) tally[r] = (tally[r] ?? 0) + 1;
  console.log("Hasil:", tally);

  const held = await prisma.booking.aggregate({
    _sum: { memberCount: true },
    where: { trailId: trail.id, climbDate: date, status: "pending" },
  });
  console.log(
    `Anggota yang ditahan di database: ${held._sum.memberCount ?? 0} (batas ${TOTAL})`,
  );

  await prisma.booking.deleteMany({
    where: { trailId: trail.id, climbDate: date },
  });
  await prisma.trailQuota.update({
    where: { id: original.id },
    data: { totalQuota: original.totalQuota, sold: original.sold },
  });
  console.log("Data uji dikembalikan.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
