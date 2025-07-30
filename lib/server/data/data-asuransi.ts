"use server";

import { db } from "@/lib/db";
import {
  anggotaTable,
  asuransiTable,
  pinjamanTable,
  unitKerjaTable,
} from "@/lib/db/schema";
import { formatTglPrefixId } from "@/lib/helper";
import { TAsuransi } from "@/lib/types/asuransi";
import { desc, eq, like } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const getLastIdAsuransi = async () => {
  const keyword = formatTglPrefixId("ASURANSI");

  const [result] = await db
    .select({ id: asuransiTable.noAsuransi })
    .from(asuransiTable)
    .where(like(asuransiTable.noAsuransi, keyword))
    .orderBy(desc(asuransiTable.noAsuransi))
    .limit(1)
    .execute();
  return result ? result.id : null;
};

export const getAsuransi = unstable_cache(
  async () => {
    try {
      const result = await db
        .select({
          noAsuransi: asuransiTable.noAsuransi,
          pinjamanId: asuransiTable.pinjamanId,
          namaAnggota: anggotaTable.namaAnggota,
          namaUnitKerja: unitKerjaTable.namaUnitKerja,
          usiaAsuransi: asuransiTable.usiaAsuransi,
          tanggalAsuransi: asuransiTable.tanggalAsuransi,
          tanggalAkhirAsuransi: asuransiTable.tanggalAkhirAsuransi,
          masaAsuransiTH: asuransiTable.masaAsuransiTH,
          masaAsuransiBL: asuransiTable.masaAsuransiBL,
          masaAsuransiJK: asuransiTable.masaAsuransiJK,
          UP: pinjamanTable.ajuanPinjaman,
          premi: asuransiTable.premi,
          statusPinjaman: pinjamanTable.statusPinjaman,
        })
        .from(asuransiTable)
        .innerJoin(
          pinjamanTable,
          eq(asuransiTable.pinjamanId, pinjamanTable.noPinjaman)
        )
        .innerJoin(
          anggotaTable,
          eq(pinjamanTable.noAnggota, anggotaTable.noAnggota)
        )
        .innerJoin(
          unitKerjaTable,
          eq(anggotaTable.unitKerjaId, unitKerjaTable.noUnitKerja)
        )
        .orderBy(desc(asuransiTable.tanggalAsuransi));

      if (result.length > 0) {
        return { ok: true, data: result as TAsuransi[] };
      } else {
        return { ok: true, data: [] as TAsuransi[] };
      }
    } catch (error) {
      console.error("error data jabatan : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-asuransi"],
  {
    tags: ["get-asuransi"],
  }
);
