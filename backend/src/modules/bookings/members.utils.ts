import { z } from "zod";

/** Umur (tahun penuh) pada tanggal tertentu. Format tanggal: YYYY-MM-DD. */
export function ageOn(birthDate: string, onDate: string): number {
  const [by, bm, bd] = birthDate.split("-").map(Number);
  const [oy, om, od] = onDate.split("-").map(Number);
  let age = oy - by;
  if (om < bm || (om === bm && od < bd)) age--;
  return age;
}

/** Menyamarkan nomor identitas: 3201********0011. */
export function maskNik(nik: string): string {
  if (nik.length <= 8)
    return "*".repeat(Math.max(0, nik.length - 2)) + nik.slice(-2);
  return nik.slice(0, 4) + "*".repeat(nik.length - 8) + nik.slice(-4);
}

const feesSchema = z
  .array(
    z.object({
      name: z.string(),
      amount: z.number().int().nonnegative(),
      per: z.enum(["person", "booking"]),
    }),
  )
  .catch([]);

export type ExtraFee = z.infer<typeof feesSchema>[number];

/** Membaca kolom JSON extra_fees dengan aman; bentuk yang salah dianggap tidak ada biaya tambahan. */
export function parseFees(raw: unknown): ExtraFee[] {
  return feesSchema.parse(raw ?? []);
}

export interface PriceInput {
  isForeign: boolean;
}

/**
 * Menghitung biaya.
 *  - WNI: harga dasar (atau tarif khusus tanggal bila ada)
 *  - WNA: tarif WNA bila diisi, jika tidak memakai harga dasar
 *  - biaya tambahan: per orang dikalikan jumlah anggota, per booking dihitung sekali
 */
export function calcTotals(
  members: PriceInput[],
  prices: { base: number; foreign: number },
  fees: ExtraFee[],
) {
  const perMember = members.map((m) =>
    m.isForeign ? prices.foreign : prices.base,
  );
  const subtotal = perMember.reduce((a, b) => a + b, 0);
  const extraFees = fees.map((f) => ({
    name: f.name,
    amount: f.per === "person" ? f.amount * members.length : f.amount,
  }));
  const feesTotal = extraFees.reduce((a, f) => a + f.amount, 0);
  return { perMember, subtotal, extraFees, total: subtotal + feesTotal };
}
