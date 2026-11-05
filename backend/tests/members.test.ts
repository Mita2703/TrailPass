import { describe, expect, it } from "vitest";
import { setMembersSchema } from "../src/modules/bookings/members.schema";
import {
  ageOn,
  calcTotals,
  maskNik,
  parseFees,
} from "../src/modules/bookings/members.utils";

const wni = {
  fullName: "Budi Santoso",
  nik: "3201000000000011",
  birthDate: "1998-05-10",
  gender: "male",
  emergencyContact: "Ibu Budi 081200000001",
};

describe("ageOn", () => {
  it("belum berulang tahun pada tanggal pendakian", () => {
    expect(ageOn("2014-12-01", "2026-11-30")).toBe(11);
  });
  it("tepat berulang tahun pada hari pendakian", () => {
    expect(ageOn("2014-12-01", "2026-12-01")).toBe(12);
  });
  it("lahir 29 Februari, pendakian 28 Februari tahun biasa", () => {
    expect(ageOn("2000-02-29", "2025-02-28")).toBe(24);
  });
});

describe("maskNik", () => {
  it("menyamarkan NIK 16 digit", () => {
    expect(maskNik("3201000000000011")).toBe("3201********0011");
  });
  it("menyamarkan paspor pendek tanpa error", () => {
    expect(maskNik("A123456")).toBe("*****56");
  });
});

describe("calcTotals", () => {
  it("3 WNI tanpa biaya tambahan", () => {
    const r = calcTotals(
      [{ isForeign: false }, { isForeign: false }, { isForeign: false }],
      { base: 30000, foreign: 150000 },
      [],
    );
    expect(r.subtotal).toBe(90000);
    expect(r.total).toBe(90000);
  });
  it("campuran WNI dan WNA + biaya per orang dan per booking", () => {
    const r = calcTotals(
      [{ isForeign: false }, { isForeign: true }],
      { base: 35000, foreign: 300000 },
      [
        { name: "Asuransi", amount: 5000, per: "person" },
        { name: "Administrasi", amount: 2000, per: "booking" },
      ],
    );
    expect(r.perMember).toEqual([35000, 300000]);
    expect(r.extraFees).toEqual([
      { name: "Asuransi", amount: 10000 },
      { name: "Administrasi", amount: 2000 },
    ]);
    expect(r.total).toBe(35000 + 300000 + 10000 + 2000);
  });
});

describe("parseFees", () => {
  it("null atau bentuk salah dianggap tidak ada biaya", () => {
    expect(parseFees(null)).toEqual([]);
    expect(parseFees({ x: 1 })).toEqual([]);
    expect(parseFees([{ name: "A", amount: -5, per: "person" }])).toEqual([]);
  });
  it("membaca daftar yang benar", () => {
    expect(
      parseFees([{ name: "Asuransi", amount: 5000, per: "person" }]),
    ).toHaveLength(1);
  });
});

describe("setMembersSchema", () => {
  it("menerima anggota WNI yang valid", () => {
    const r = setMembersSchema.parse({ members: [wni] });
    expect(r.members[0].isForeign).toBe(false);
  });
  it("menolak NIK 15 digit untuk WNI", () => {
    expect(
      setMembersSchema.safeParse({
        members: [{ ...wni, nik: "320100000000001" }],
      }).success,
    ).toBe(false);
  });
  it("menolak NIK berisi huruf untuk WNI", () => {
    expect(
      setMembersSchema.safeParse({
        members: [{ ...wni, nik: "32010000000000AB" }],
      }).success,
    ).toBe(false);
  });
  it("menerima paspor huruf kecil untuk WNA dan mengubahnya jadi huruf besar", () => {
    const r = setMembersSchema.parse({
      members: [{ ...wni, isForeign: true, nik: "a1234567" }],
    });
    expect(r.members[0].nik).toBe("A1234567");
  });
  it("menolak tanggal lahir di masa depan", () => {
    expect(
      setMembersSchema.safeParse({
        members: [{ ...wni, birthDate: "2999-01-01" }],
      }).success,
    ).toBe(false);
  });
  it("menolak jenis kelamin di luar daftar", () => {
    expect(
      setMembersSchema.safeParse({ members: [{ ...wni, gender: "x" }] })
        .success,
    ).toBe(false);
  });
  it("menolak daftar kosong", () => {
    expect(setMembersSchema.safeParse({ members: [] }).success).toBe(false);
  });
});
