"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import {
  anggotaTable,
  angsuranTable,
  jabatanTable,
  pengambilanSimpananTable,
  pinjamanTable,
  simpananTable,
  unitKerjaTable,
} from "@/lib/db/schema";
import {
  and,
  asc,
  count,
  desc,
  eq,
  gt,
  inArray,
  like,
  max,
  or,
  sql,
  sum,
} from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { noAnggotaSchema } from "@/lib/schema/schema-helper";
import {
  JenisPinjamanType,
  StatusPinjamanPrioritasType,
} from "@/lib/types/helper";
import {
  GetLastPinjamanByIdResult,
  TAngsuran,
  TChartPinjaman,
  TPinjaman,
} from "@/lib/types/pinjaman";
import { noPinjamanSchema } from "@/lib/schema/schema-pinjaman";
import { TStrukPinjaman } from "@/lib/types/struk";
import {
  calculatePercentage,
  formatTglPrefixId,
  transformLaporanPinjaman,
} from "@/lib/helper";
import { laporanPinjamanSchema } from "@/lib/schema/schema-laporan";
import { LABEL } from "@/lib/constan";
import { TDataPinjamanLaporan, TLaporanPinjaman } from "@/lib/types/laporan";

export const getLastIdAngsuran = async () => {
  const keyword = formatTglPrefixId("ANGSURAN");

  const [result] = await db
    .select({ id: angsuranTable.noAngsuran })
    .from(angsuranTable)
    .where(like(angsuranTable.noAngsuran, keyword))
    .orderBy(desc(angsuranTable.noAngsuran))
    .limit(1)
    .execute();
  return result ? result.id : null;
};

export const getLastIdPinjaman = async (jenis: JenisPinjamanType) => {
  const keyword = formatTglPrefixId(jenis);

  const [result] = await db
    .select({ id: pinjamanTable.noPinjaman })
    .from(pinjamanTable)
    .where(
      and(
        like(pinjamanTable.noPinjaman, keyword),
        eq(pinjamanTable.jenisPinjman, jenis)
      )
    )
    .orderBy(desc(pinjamanTable.noPinjaman))
    .limit(1)
    .execute();

  return result ? result.id : null;
};

export const cekPelunasanPotongGaji = async (noPinjaman: string) => {
  const [pinjaman] = await db
    .select({
      noPinjaman: pinjamanTable.noPinjaman,
      waktuPengembalian: pinjamanTable.waktuPengembalian,
      ajuanPinjaman: pinjamanTable.ajuanPinjaman,
    })
    .from(pinjamanTable)
    .where(eq(pinjamanTable.noPinjaman, noPinjaman))
    .limit(1);

  if (!pinjaman) {
    return {
      isCompleted: false,
      totalHarusBayar: 0,
      totalSudahBayar: 0,
      message: `Tidak ada pinjaman dengan no pinjaman: ${noPinjaman}`,
    };
  }

  const [totalSudahBayar] = await db
    .select({
      total: sum(angsuranTable.jumlahAngsuran).as("total"),
    })
    .from(angsuranTable)
    .where(eq(angsuranTable.pinjamanId, noPinjaman));

  const totalSudahBayarValue = Number(totalSudahBayar?.total ?? 0);
  const jumlahPinjaman = Number(pinjaman.ajuanPinjaman);
  const tenor = Number(pinjaman.waktuPengembalian);

  const totalHarusBayar = jumlahPinjaman + tenor * (jumlahPinjaman * 0.01);

  if (totalSudahBayarValue < totalHarusBayar) {
    return {
      isCompleted: false,
      totalHarusBayar,
      totalSudahBayar: totalSudahBayarValue,
      message: "pinjaman masih belum lunas",
    };
  } else {
    return {
      isCompleted: true,
      totalHarusBayar,
      totalSudahBayar: totalSudahBayarValue,
      message: "pinjaman sudah lunas",
    };
  }
};

export const getLastPinjamanById = unstable_cache(
  async (
    noAnggota: string,
    jenis: JenisPinjamanType,
    prioritasStatus: StatusPinjamanPrioritasType
  ): Promise<GetLastPinjamanByIdResult> => {
    try {
      const validateValues = noAnggotaSchema.safeParse(noAnggota);

      if (!validateValues.success) {
        return {
          ok: false,
          status: "ERROR",
          message: "No anggota tidak valid",
        };
      }

      const orderClause = sql`
      CASE
        WHEN ${pinjamanTable.statusPinjaman} = ${prioritasStatus} THEN 0
        ELSE 1
      END
      `;

      const [pinjaman] = await db
        .select()
        .from(pinjamanTable)
        .where(
          and(
            eq(pinjamanTable.noAnggota, noAnggota),
            eq(pinjamanTable.jenisPinjman, jenis),
            or(
              eq(pinjamanTable.statusPinjaman, "PENDING"),
              eq(pinjamanTable.statusPinjaman, "APPROVED")
            )
          )
        )
        .orderBy(orderClause, desc(pinjamanTable.tanggalPinjaman))
        .limit(1);

      if (!pinjaman) {
        return {
          ok: true,
          status: "TIDAK_ADA_PINJAMAN",
          message: "Belum ada pinjaman aktif",
        };
      }

      if (pinjaman.statusPinjaman === "PENDING") {
        return {
          ok: false,
          status: "PENDING",
          message: `Pinjaman ${pinjaman.noPinjaman} masih dalam proses persetujuan.`,
        };
      }

      const [angsuran] = await db
        .select({
          angsuranPinjamanKe: max(angsuranTable.angsuranPinjamanKe),
          total: sum(angsuranTable.jumlahAngsuran).as("total"),
        })
        .from(angsuranTable)
        .where(
          and(
            eq(angsuranTable.pinjamanId, pinjaman.noPinjaman),
            gt(angsuranTable.angsuranPinjamanKe, 0)
          )
        );

      // cek lagi perhitungan nyaa
      const admin = calculatePercentage(Number(pinjaman.ajuanPinjaman), 1);
      // const totalSudahBayarValue = Number(angsuran?.total ?? 0);

      const totalSudahBayarValue = Math.round(
        Number(angsuran?.total ?? 0) -
          admin * (angsuran?.angsuranPinjamanKe ?? 0)
      );

      const jumlahPinjaman = Number(pinjaman.ajuanPinjaman);
      // const tenor = Number(pinjaman.waktuPengembalian);

      // const totalHarusBayar = jumlahPinjaman + tenor * admin;
      const totalHarusBayar = jumlahPinjaman;
      const pelunasan = totalHarusBayar - totalSudahBayarValue + admin;

      const persentaseLunas = Number(
        ((totalSudahBayarValue / totalHarusBayar) * 100).toFixed(2)
      );

      if (persentaseLunas < 50) {
        return {
          ok: false,
          status: "BELUM_LUNAS",
          message: `Status pelunasan untuk Pinjaman ${pinjaman.noPinjaman}: ${persentaseLunas}% dan belum mencapai 50% pelunasan.`,
          data: {
            pinjamanId: pinjaman.noPinjaman,
            angsuranKe: angsuran.angsuranPinjamanKe ?? 0,
            angsuranDari: pinjaman.waktuPengembalian,
            totalBayar: totalSudahBayarValue,
            pelunasan: pelunasan,
            persentaseLunas: persentaseLunas,
          },
        };
      }

      if (persentaseLunas < 100) {
        return {
          ok: true,
          status: "SUDAH_LUNAS_SEBAGIAN",
          message: `Status pelunasan untuk Pinjaman ${pinjaman.noPinjaman}: ${persentaseLunas}%. Pengajuan baru kini diizinkan.`,
          data: {
            pinjamanId: pinjaman.noPinjaman,
            angsuranKe: angsuran.angsuranPinjamanKe ?? 0,
            angsuranDari: pinjaman.waktuPengembalian,
            totalBayar: totalSudahBayarValue,
            pelunasan: pelunasan,
            persentaseLunas: persentaseLunas,
          },
        };
      }

      return {
        ok: true,
        status: "SUDAH_LUNAS",
        message: "Pinjaman sebelumnya sudah lunas.",
        data: {
          pinjamanId: pinjaman.noPinjaman,
          angsuranKe: angsuran.angsuranPinjamanKe ?? 0,
          angsuranDari: pinjaman.waktuPengembalian,
          totalBayar: totalSudahBayarValue,
          pelunasan: pelunasan,
          persentaseLunas: persentaseLunas,
        },
      };
    } catch (error) {
      console.error("error last pinjaman ById:", error);
      return {
        ok: false,
        status: "ERROR",
        message: "Terjadi kesalahan saat mengambil data pinjaman.",
      };
    }
  },
  ["get-last-pinjaman-by-id"],
  {
    tags: ["get-last-pinjaman-by-id"],
  }
);

export const getMaxJumlahPinjamanById = unstable_cache(
  async (noAnggota: string) => {
    try {
      const validateValues = noAnggotaSchema.safeParse(noAnggota);

      if (!validateValues.success) {
        return {
          ok: false,
          message: "No anggota tidak valid",
        };
      }

      const [simpanan] = await db
        .select({
          total: sum(simpananTable.jumlahSimpanan).as("total"),
        })
        .from(simpananTable)
        .where(
          and(
            eq(simpananTable.noAnggota, noAnggota),
            inArray(simpananTable.jenisSimpanan, ["WAJIB", "SUKAMANA"])
          )
        );

      const [pengambilan] = await db
        .select({
          total: sum(pengambilanSimpananTable.jumlahPengambilanSimpanan).as(
            "total"
          ),
        })
        .from(pengambilanSimpananTable)
        .where(
          and(
            eq(pengambilanSimpananTable.noAnggota, noAnggota),
            inArray(pengambilanSimpananTable.jenisPengambilanSimpanan, [
              "WAJIB",
              "SUKAMANA",
            ]),
            inArray(pengambilanSimpananTable.statusPengambilanSimpanan, [
              "APPROVED",
              "PENDING",
            ])
          )
        );

      // Normalisasi nilai null ke 0
      const totalSimpanan = simpanan?.total ? Number(simpanan.total) : 0;
      const totalPengambilan = pengambilan?.total
        ? Number(pengambilan.total)
        : 0;

      const sisaSaldo = totalSimpanan - totalPengambilan;

      let hasil = sisaSaldo * 15;

      if (hasil > 50000000) hasil = 50000000;

      return {
        ok: true,
        totalSimpanan: sisaSaldo,
        maxPinjaman: hasil,
      };
    } catch (error) {
      console.error("error max jumlah pinjaman ById:", error);
      return {
        ok: false,
        message: "Terjadi kesalahan saat menghitung maksimum pinjaman.",
      };
    }
  },
  ["get-max-jumlah-pinjaman-by-id"],
  {
    tags: ["get-max-jumlah-pinjaman-by-id"],
  }
);

export const getPinjaman = unstable_cache(
  async (jenis: JenisPinjamanType) => {
    try {
      const result = await db
        .select({
          noPinjaman: pinjamanTable.noPinjaman,
          tujuanPinjaman: pinjamanTable.tujuanPinjaman,
          noAnggota: pinjamanTable.noAnggota,
          namaAnggota: anggotaTable.namaAnggota,
          namaUnitKerja: unitKerjaTable.namaUnitKerja,
          noTelp: anggotaTable.noTelpAnggota,
          bank: anggotaTable.bankAnggota,
          rek: anggotaTable.rekeningAnggota,
          tanggalPinjaman: pinjamanTable.tanggalPinjaman,
          waktuPengembalian: pinjamanTable.waktuPengembalian,
          jenisPinjman: pinjamanTable.jenisPinjman,
          ajuanPinjaman: pinjamanTable.ajuanPinjaman,
          jumlahDiterima: pinjamanTable.jumlahDiterima,
          strukGaji: pinjamanTable.strukGaji,
          jumlahPenghasilan: pinjamanTable.jumlahPenghasilan,
          statusPinjaman: pinjamanTable.statusPinjaman,
        })
        .from(pinjamanTable)
        .leftJoin(
          anggotaTable,
          eq(pinjamanTable.noAnggota, anggotaTable.noAnggota)
        )
        .leftJoin(
          unitKerjaTable,
          eq(anggotaTable.unitKerjaId, unitKerjaTable.noUnitKerja)
        )
        .where(eq(pinjamanTable.jenisPinjman, jenis))
        .orderBy(desc(pinjamanTable.tanggalPinjaman));

      if (result.length > 0) {
        return { ok: true, data: result as TPinjaman[] };
      } else {
        return { ok: true, data: [] as TPinjaman[] };
      }
    } catch (error) {
      console.error("error pinjaman:", error);
      return { ok: false, data: null };
    }
  },
  ["get-pinjaman"],
  {
    tags: ["get-pinjaman"],
  }
);

export const getPinjamanById = unstable_cache(
  async (noAnggota: string, jenis: JenisPinjamanType) => {
    try {
      const result = await db
        .select({
          noPinjaman: pinjamanTable.noPinjaman,
          tujuanPinjaman: pinjamanTable.tujuanPinjaman,
          noAnggota: pinjamanTable.noAnggota,
          namaAnggota: anggotaTable.namaAnggota,
          namaUnitKerja: unitKerjaTable.namaUnitKerja,
          tanggalPinjaman: pinjamanTable.tanggalPinjaman,
          waktuPengembalian: pinjamanTable.waktuPengembalian,
          jenisPinjman: pinjamanTable.jenisPinjman,
          ajuanPinjaman: pinjamanTable.ajuanPinjaman,
          jumlahDiterima: pinjamanTable.jumlahDiterima,
          strukGaji: pinjamanTable.strukGaji,
          jumlahPenghasilan: pinjamanTable.jumlahPenghasilan,
          statusPinjaman: pinjamanTable.statusPinjaman,
        })
        .from(pinjamanTable)
        .leftJoin(
          anggotaTable,
          eq(pinjamanTable.noAnggota, anggotaTable.noAnggota)
        )
        .leftJoin(
          unitKerjaTable,
          eq(anggotaTable.unitKerjaId, unitKerjaTable.noUnitKerja)
        )
        .where(
          and(
            eq(pinjamanTable.jenisPinjman, jenis),
            eq(pinjamanTable.noAnggota, noAnggota)
          )
        )
        .orderBy(desc(pinjamanTable.tanggalPinjaman));

      if (result.length > 0) {
        return { ok: true, data: result as TPinjaman[] };
      } else {
        return { ok: true, data: [] as TPinjaman[] };
      }
    } catch (error) {
      console.error("error pinjaman ById:", error);
      return { ok: false, data: null };
    }
  },
  ["get-pinjaman-by-id"],
  {
    tags: ["get-pinjaman-by-id"],
  }
);

export const getAngsuranById = unstable_cache(
  async (id: string) => {
    try {
      const validateValues = noPinjamanSchema.safeParse(id);

      if (!validateValues.success) {
        return { ok: false, data: [] };
      }

      const result = await db
        .select({
          noAngsuran: angsuranTable.noAngsuran,
          tanggalAngsuran: angsuranTable.tanggalAngsuran,
          noAnggota: pinjamanTable.noAnggota,
          pinjamanId: angsuranTable.pinjamanId,
          angsuranPinjamanKe: angsuranTable.angsuranPinjamanKe,
          angsuranPinjamanDari: angsuranTable.angsuranPinjamanDari,
          jumlahAngsuran: angsuranTable.jumlahAngsuran,
          statusAngsuran: angsuranTable.statusAngsuran,
        })
        .from(angsuranTable)
        .leftJoin(
          pinjamanTable,
          eq(angsuranTable.pinjamanId, pinjamanTable.noPinjaman)
        )
        .where(
          and(
            eq(angsuranTable.pinjamanId, id),
            gt(angsuranTable.angsuranPinjamanKe, 0)
          )
        )
        .orderBy(asc(angsuranTable.angsuranPinjamanKe));

      if (result.length > 0) {
        return { ok: true, data: result as TAngsuran[] };
      } else {
        return { ok: true, data: [] as TAngsuran[] };
      }
    } catch (error) {
      console.error("error pinjaman ById:", error);
      return { ok: false, data: null };
    }
  },
  ["get-angsuran-by-id"],
  {
    tags: ["get-angsuran-by-id"],
  }
);

export const getSuratPinjamanById = async (id: string) => {
  try {
    const validateValues = noPinjamanSchema.safeParse(id);

    if (!validateValues.success) {
      return { ok: false, data: null };
    }

    const [result] = await db
      .select({
        nikAnggota: anggotaTable.nikAnggota,
        namaAnggota: anggotaTable.namaAnggota,
        tanggalLahirAnggota: anggotaTable.tanggalLahirAnggota,
        tempatLahirAnggota: anggotaTable.tempatLahirAnggota,
        alamatAnggota: anggotaTable.alamatAnggota,
        noTelpAnggota: anggotaTable.noTelpAnggota,
        namaJabatan: jabatanTable.namaJabatan,
        namaUnitKerja: unitKerjaTable.namaUnitKerja,
        alamatUnitKerja: unitKerjaTable.alamatUnitKerja,
        noPinjaman: pinjamanTable.noPinjaman,
        tujuanPinjaman: pinjamanTable.tujuanPinjaman,
        tanggalPinjaman: pinjamanTable.tanggalPinjaman,
        waktuPengembalian: pinjamanTable.waktuPengembalian,
        jenisPinjaman: pinjamanTable.jenisPinjman,
        ajuanPinjaman: pinjamanTable.ajuanPinjaman,
        jumlahPenghasilan: pinjamanTable.jumlahPenghasilan,
      })
      .from(pinjamanTable)
      .leftJoin(
        anggotaTable,
        eq(pinjamanTable.noAnggota, anggotaTable.noAnggota)
      )
      .leftJoin(
        jabatanTable,
        eq(anggotaTable.jabatanId, jabatanTable.noJabatan)
      )
      .leftJoin(
        unitKerjaTable,
        eq(anggotaTable.unitKerjaId, unitKerjaTable.noUnitKerja)
      )
      .where(eq(pinjamanTable.noPinjaman, id))
      .limit(1);

    if (!result) {
      return { ok: true, data: null };
    } else {
      return { ok: true, data: result as TStrukPinjaman };
    }
  } catch (error) {
    console.error("error surat pinjaman:", error);
    return { ok: false, data: null };
  }
};

export const getLaporanPinjaman = unstable_cache(
  async (values: z.infer<typeof laporanPinjamanSchema>) => {
    try {
      const validateValues = laporanPinjamanSchema.safeParse(values);

      if (!validateValues.success) {
        return { ok: false, message: "Invalid field!", data: null };
      }

      const result = await db.transaction<TDataPinjamanLaporan[]>(
        async (tx) => {
          const pinjaman = await tx
            .select({
              noAnggota: anggotaTable.noAnggota,
              nama: anggotaTable.namaAnggota,
              namaUnitKerja: unitKerjaTable.namaUnitKerja,
              noPinjaman: pinjamanTable.noPinjaman,
              tanggalPinjaman: pinjamanTable.tanggalPinjaman,
              ajuanPinjaman: pinjamanTable.ajuanPinjaman,
              jenisPinjman: pinjamanTable.jenisPinjman,
              statusPinjaman: pinjamanTable.statusPinjaman,
              waktuPengembalian: pinjamanTable.waktuPengembalian,
            })
            .from(pinjamanTable)
            .innerJoin(
              anggotaTable,
              eq(pinjamanTable.noAnggota, anggotaTable.noAnggota)
            )
            .innerJoin(
              unitKerjaTable,
              eq(anggotaTable.unitKerjaId, unitKerjaTable.noUnitKerja)
            )
            .where(
              and(
                eq(
                  pinjamanTable.jenisPinjman,
                  validateValues.data.jenisPinjaman
                ),
                eq(
                  pinjamanTable.statusPinjaman,
                  validateValues.data.statusPinjaman
                )
              )
            );

          const pinjamanIds = pinjaman.map((p) => p.noPinjaman);

          const angsuran = await tx
            .select({
              pinjamanId: angsuranTable.pinjamanId,
              angsuranPinjamanKe: angsuranTable.angsuranPinjamanKe,
              jumlahAngsuran: angsuranTable.jumlahAngsuran,
            })
            .from(angsuranTable)
            .where(
              and(
                inArray(angsuranTable.pinjamanId, pinjamanIds),
                gt(angsuranTable.angsuranPinjamanKe, 0)
              )
            );

          // Step 3: Gabungkan pinjaman + angsuran
          const combined = pinjaman.map((p) => ({
            ...p,
            AngsuranPinjaman: angsuran
              .filter((a) => a.pinjamanId === p.noPinjaman)
              .map(({ angsuranPinjamanKe, jumlahAngsuran }) => ({
                angsuranPinjamanKe,
                jumlahAngsuran,
              })),
          }));

          return combined;
        }
      );

      if (!result.length) {
        return {
          ok: false,
          message: "data tidak ditemukan",
          data: null,
        };
      }

      const transformData = transformLaporanPinjaman(result);

      return {
        ok: true,
        message: "data ditemukan",
        data: transformData as TLaporanPinjaman[],
      };
    } catch (error) {
      console.error("error get data pinjaman :", error);
      return {
        ok: false,
        message: LABEL.ERROR.SERVER,
        data: null,
      };
    }
  },
  ["get-laporan-pinjaman"],
  { tags: ["get-laporan-pinjaman"] }
);

export const getCountStatusPinjaman = unstable_cache(
  async () => {
    const result: TChartPinjaman = {
      produktif: { PENDING: 0, APPROVED: 0, COMPLETED: 0, TOTAL: 0 },
      barang: { PENDING: 0, APPROVED: 0, COMPLETED: 0, TOTAL: 0 },
    };

    const grouped = await db
      .select({
        jenis: pinjamanTable.jenisPinjman,
        status: pinjamanTable.statusPinjaman,
        jumlah: count(),
      })
      .from(pinjamanTable)
      .groupBy(pinjamanTable.jenisPinjman, pinjamanTable.statusPinjaman);

    // Masukkan hasil ke dalam objek result
    grouped.forEach((row) => {
      const jenis = row.jenis.toLowerCase() as "produktif" | "barang";
      const status = row.status.toUpperCase() as
        | "PENDING"
        | "APPROVED"
        | "COMPLETED";
      const jumlah = Number(row.jumlah);

      if (result[jenis] && status in result[jenis]) {
        result[jenis][status] += jumlah;
        result[jenis].TOTAL += jumlah;
      }
    });

    return result as TChartPinjaman;
  },
  ["get-count-status-pinjaman"],
  { tags: ["get-count-status-pinjaman"] }
);
