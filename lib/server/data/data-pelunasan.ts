"use server";

import { db } from "@/lib/db";
import {
  anggotaTable,
  pelunasanPinjamanTable,
  pinjamanTable,
  unitKerjaTable,
} from "@/lib/db/schema";
import { formatTglPrefixId } from "@/lib/helper";
import { noAnggotaSchema } from "@/lib/schema/schema-helper";
import { JenisPelunasanPinjamanType } from "@/lib/types/helper";
import { TPelunasan, TPelunasanPinjaman } from "@/lib/types/pelunasan-pinjaman";
import { and, desc, eq, isNull, like, or } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const getLastIdPelunasan = async (jenis: JenisPelunasanPinjamanType) => {
  const keyword = formatTglPrefixId(jenis);

  const [result] = await db
    .select({ id: pelunasanPinjamanTable.noPelunasanPinjaman })
    .from(pelunasanPinjamanTable)
    .where(like(pelunasanPinjamanTable.noPelunasanPinjaman, keyword))
    .orderBy(desc(pelunasanPinjamanTable.noPelunasanPinjaman))
    .limit(1)
    .execute();

  return result ? result.id : null;
};

export const getApprovedPinjamanById = unstable_cache(
  async (noAnggota: string) => {
    try {
      const validateValues = noAnggotaSchema.safeParse(noAnggota);

      if (!validateValues.success) {
        return { ok: false, data: null };
      }

      const result = await db
        .select({ noPinjaman: pinjamanTable.noPinjaman })
        .from(pinjamanTable)
        .leftJoin(
          pelunasanPinjamanTable,
          and(
            eq(pelunasanPinjamanTable.pinjamanId, pinjamanTable.noPinjaman),
            or(
              eq(pelunasanPinjamanTable.statusPelunasanPinjaman, "APPROVED"),
              eq(pelunasanPinjamanTable.statusPelunasanPinjaman, "PENDING")
            )
          )
        )
        .where(
          and(
            eq(pinjamanTable.noAnggota, noAnggota),
            eq(pinjamanTable.statusPinjaman, "APPROVED"),
            isNull(pelunasanPinjamanTable.pinjamanId) // hanya pinjaman yang belum diajukan pelunasan
          )
        );

      if (result.length > 0) {
        return { ok: true, data: result as TPelunasan[] };
      } else {
        return { ok: true, data: [] as TPelunasan[] };
      }
    } catch (error) {
      console.error("error approved pinjaman ById:", error);
      return { ok: false, data: null };
    }
  },
  ["get-approved-pinjaman-by-id"],
  {
    tags: ["get-approved-pinjaman-by-id"],
  }
);

export const getPelunasanPinjaman = unstable_cache(
  async () => {
    try {
      const result = await db
        .select({
          noPelunasanPinjaman: pelunasanPinjamanTable.noPelunasanPinjaman,
          pinjamanId: pelunasanPinjamanTable.pinjamanId,
          noAnggota: pinjamanTable.noAnggota,
          namaAnggota: anggotaTable.namaAnggota,
          namaUnitKerja: unitKerjaTable.namaUnitKerja,
          tanggalPelunasanPinjaman:
            pelunasanPinjamanTable.tanggalPelunasanPinjaman,
          jenisPelunasanPinjaman: pelunasanPinjamanTable.jenisPelunasanPinjaman,
          angsuranKePelunasanPinjaman:
            pelunasanPinjamanTable.angsuranKePelunasanPinjaman,
          sudahDibayarkan: pelunasanPinjamanTable.sudahDibayarkan,
          jumlahPelunasanPinjaman:
            pelunasanPinjamanTable.jumlahPelunasanPinjaman,
          buktiPelunasan: pelunasanPinjamanTable.buktiPelunasan,
          statusPelunasanPinjaman:
            pelunasanPinjamanTable.statusPelunasanPinjaman,
        })
        .from(pelunasanPinjamanTable)
        .leftJoin(
          pinjamanTable,
          eq(pelunasanPinjamanTable.pinjamanId, pinjamanTable.noPinjaman)
        )
        .leftJoin(
          anggotaTable,
          eq(pinjamanTable.noAnggota, anggotaTable.noAnggota)
        )
        .leftJoin(
          unitKerjaTable,
          eq(anggotaTable.unitKerjaId, unitKerjaTable.noUnitKerja)
        )
        .orderBy(desc(pelunasanPinjamanTable.tanggalPelunasanPinjaman));

      if (result.length > 0) {
        return { ok: true, data: result as TPelunasanPinjaman[] };
      } else {
        return { ok: true, data: [] as TPelunasanPinjaman[] };
      }
    } catch (error) {
      console.error("error data jabatan : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-pelunasan-pinjaman"],
  {
    tags: ["get-pelunasan-pinjaman"],
  }
);
