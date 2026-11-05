import { z } from "zod";

const dateOnly = z
  .string({ required_error: "Tanggal lahir wajib diisi" })
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD")
  .refine(
    (v) => !Number.isNaN(Date.parse(`${v}T00:00:00Z`)),
    "Tanggal tidak valid",
  )
  .refine(
    (v) => Date.parse(`${v}T00:00:00Z`) <= Date.now(),
    "Tanggal lahir tidak boleh di masa depan",
  );

export const memberSchema = z
  .object({
    fullName: z.string().trim().min(2, "Nama minimal 2 karakter").max(150),
    nik: z
      .string()
      .trim()
      .toUpperCase()
      .min(6, "Nomor identitas minimal 6 karakter")
      .max(16, "Nomor identitas maksimal 16 karakter"),
    birthDate: dateOnly,
    gender: z.enum(["male", "female"], {
      errorMap: () => ({ message: "Jenis kelamin harus male atau female" }),
    }),
    emergencyContact: z
      .string()
      .trim()
      .min(3, "Kontak darurat minimal 3 karakter")
      .max(200),
    isForeign: z.boolean().default(false),
  })
  .superRefine((m, ctx) => {
    // WNI memakai NIK 16 digit; WNA memakai nomor paspor (huruf dan angka).
    const ok = m.isForeign
      ? /^[A-Z0-9]{6,16}$/.test(m.nik)
      : /^\d{16}$/.test(m.nik);
    if (!ok) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["nik"],
        message: m.isForeign
          ? "Nomor paspor harus 6 sampai 16 huruf atau angka"
          : "NIK harus 16 digit angka",
      });
    }
  });

export const setMembersSchema = z.object({
  members: z
    .array(memberSchema)
    .min(1, "Minimal 1 anggota")
    .max(50, "Maksimal 50 anggota"),
});

export type MemberInput = z.infer<typeof memberSchema>;
export type SetMembersInput = z.infer<typeof setMembersSchema>;
