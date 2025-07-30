"use server";

import { db } from "@/lib/db";
import {
  anggotaTable,
  pengunduranDiriTable,
  pinjamanPengunduranDiriTable,
  simpananPengunduranDiriTable,
  unitKerjaTable,
} from "@/lib/db/schema";
import { formatTglPrefixId, isPengunduranValid, isValidId } from "@/lib/helper";
import {
  TGetSimpananUndurDiri,
  TPinjamanUndurDiri,
  TSuratUndurDiri,
  TUndurDiri,
} from "@/lib/types/undur-diri";
import { desc, eq, inArray, like } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const getLastIdUndurDiri = async () => {
  const keyword = formatTglPrefixId("UNDUR_DIRI");

  const [result] = await db
    .select({ id: pengunduranDiriTable.noPengunduranDiri })
    .from(pengunduranDiriTable)
    .where(like(pengunduranDiriTable.noPengunduranDiri, keyword))
    .orderBy(desc(pengunduranDiriTable.noPengunduranDiri))
    .limit(1)
    .execute();
  return result ? result.id : null;
};

export const getCekPengunduranDiriById = unstable_cache(
  async (id: string) => {
    try {
      if (!isValidId(id)) {
        return {
          ok: false,
          data: null,
        };
      }

      const [result] = await db
        .select({ noPengunduranDiri: pengunduranDiriTable.noPengunduranDiri })
        .from(pengunduranDiriTable)
        .where(eq(pengunduranDiriTable.noAnggota, id))
        .limit(1);

      if (result) {
        return { ok: true, data: result };
      } else {
        return { ok: true, data: null };
      }
    } catch (error) {
      console.error("error data cek pengunduran diri : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-cek-pengunduran-diri-by-id"],
  {
    tags: ["get-cek-pengunduran-diri-by-id"],
  }
);

export const getPengunduranDiri = unstable_cache(
  async () => {
    try {
      const result = await db.transaction(async (tx) => {
        const pengunduranList = await tx
          .select({
            noPengunduranDiri: pengunduranDiriTable.noPengunduranDiri,
            tanggalPengunduranDiri: pengunduranDiriTable.tanggalPengunduranDiri,
            noAnggota: pengunduranDiriTable.noAnggota,
            namaAnggota: anggotaTable.namaAnggota,
            namaUnitKerja: unitKerjaTable.namaUnitKerja,
            keterangan: pengunduranDiriTable.keterangan,
            jumlahSimpananBersih: pengunduranDiriTable.jumlahSimpananBersih,
            jumlahSimpananDiterima: pengunduranDiriTable.jumlahSimpananDiterima,
            statusPengunduranDiri: pengunduranDiriTable.statusPengunduranDiri,
          })
          .from(pengunduranDiriTable)
          .innerJoin(
            anggotaTable,
            eq(pengunduranDiriTable.noAnggota, anggotaTable.noAnggota)
          )
          .innerJoin(
            unitKerjaTable,
            eq(anggotaTable.unitKerjaId, unitKerjaTable.noUnitKerja)
          );

        const semuaNo = pengunduranList.map((p) => p.noPengunduranDiri);

        const [simpanan, pinjaman] = await Promise.all([
          tx
            .select()
            .from(simpananPengunduranDiriTable)
            .where(
              inArray(simpananPengunduranDiriTable.noPengunduranDiri, semuaNo)
            ),

          tx
            .select()
            .from(pinjamanPengunduranDiriTable)
            .where(
              inArray(pinjamanPengunduranDiriTable.noPengunduranDiri, semuaNo)
            ),
        ]);

        const final: TUndurDiri[] = pengunduranList.map((p) => ({
          ...p,
          simpanan: simpanan.filter(
            (s) => s.noPengunduranDiri === p.noPengunduranDiri
          ),
          pinjaman: pinjaman.filter(
            (pn) => pn.noPengunduranDiri === p.noPengunduranDiri
          ),
        }));

        return final;
      });

      if (result) {
        return { ok: true, data: result as TUndurDiri[] };
      } else {
        return { ok: true, data: [] as TUndurDiri[] };
      }
    } catch (error) {
      console.error("error data pengunduran diri : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-pengunduran-diri"],
  {
    tags: ["get-pengunduran-diri"],
  }
);

export const getSimpananPengunduranDiri = unstable_cache(
  async (id: string) => {
    try {
      if (!isPengunduranValid(id)) {
        return { ok: false, data: null };
      }

      const result = await db
        .select({
          idSimpananPengunduranDiri:
            simpananPengunduranDiriTable.idSimpananPengunduranDiri,
          noPengunduranDiri: simpananPengunduranDiriTable.noPengunduranDiri,
          noAnggota: pengunduranDiriTable.noAnggota,
          tanggalSimpananPengunduranDiri:
            simpananPengunduranDiriTable.tanggalSimpananPengunduranDiri,
          jenisSimpananPengunduran:
            simpananPengunduranDiriTable.jenisSimpananPengunduran,
          jumlahSimpananPengunduran:
            simpananPengunduranDiriTable.jumlahSimpananPengunduran,
        })
        .from(simpananPengunduranDiriTable)
        .innerJoin(
          pengunduranDiriTable,
          eq(
            simpananPengunduranDiriTable.noPengunduranDiri,
            pengunduranDiriTable.noPengunduranDiri
          )
        )
        .where(eq(simpananPengunduranDiriTable.noPengunduranDiri, id));

      if (result) {
        return { ok: true, data: result as TGetSimpananUndurDiri[] };
      } else {
        return { ok: true, data: [] as TGetSimpananUndurDiri[] };
      }
    } catch (error) {
      console.error("error data simpanan pengunduran diri : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-simpanan-pengunduran-diri"],
  {
    tags: ["get-simpanan-pengunduran-diri"],
  }
);

export const getPinjamanPengunduranDiri = unstable_cache(
  async (id: string) => {
    try {
      if (!isPengunduranValid(id)) {
        return { ok: false, data: null };
      }

      const result = await db
        .select()
        .from(pinjamanPengunduranDiriTable)
        .where(eq(pinjamanPengunduranDiriTable.noPengunduranDiri, id));

      if (result) {
        return { ok: true, data: result as TPinjamanUndurDiri[] };
      } else {
        return { ok: true, data: [] as TPinjamanUndurDiri[] };
      }
    } catch (error) {
      console.error("error data pinjaman pengunduran diri : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-pinjaman-pengunduran-diri"],
  {
    tags: ["get-pinjaman-pengunduran-diri"],
  }
);

export const getSuratPengunduranDiri = unstable_cache(
  async (id: string) => {
    try {
      if (!isPengunduranValid(id)) {
        return { ok: false, data: null };
      }

      const result = await db.transaction(async (tx) => {
        const [pengunduran] = await tx
          .select({
            noPengunduranDiri: pengunduranDiriTable.noPengunduranDiri,
            tanggalPengunduranDiri: pengunduranDiriTable.tanggalPengunduranDiri,
            nikAnggota: anggotaTable.nikAnggota,
            noAnggota: pengunduranDiriTable.noAnggota,
            namaAnggota: anggotaTable.namaAnggota,
            tempatLahirAnggota: anggotaTable.tempatLahirAnggota,
            tanggalLahirAnggota: anggotaTable.tanggalLahirAnggota,
            bank: anggotaTable.bankAnggota,
            rekeningAnggota: anggotaTable.rekeningAnggota,
            statusPekerjaan: anggotaTable.statusPekerjaan,
            namaUnitKerja: unitKerjaTable.namaUnitKerja,
            keterangan: pengunduranDiriTable.keterangan,
            jumlahSimpananBersih: pengunduranDiriTable.jumlahSimpananBersih,
            jumlahSimpananDiterima: pengunduranDiriTable.jumlahSimpananDiterima,
            statusPengunduranDiri: pengunduranDiriTable.statusPengunduranDiri,
          })
          .from(pengunduranDiriTable)
          .innerJoin(
            anggotaTable,
            eq(pengunduranDiriTable.noAnggota, anggotaTable.noAnggota)
          )
          .innerJoin(
            unitKerjaTable,
            eq(anggotaTable.unitKerjaId, unitKerjaTable.noUnitKerja)
          )
          .where(eq(pengunduranDiriTable.noPengunduranDiri, id))
          .limit(1);

        if (!pengunduran) {
          throw new Error("Data pengunduran diri tidak ditemukan.");
        }

        const [simpanan, pinjaman] = await Promise.all([
          tx
            .select()
            .from(simpananPengunduranDiriTable)
            .where(
              eq(
                simpananPengunduranDiriTable.noPengunduranDiri,
                pengunduran.noPengunduranDiri
              )
            ),

          tx
            .select()
            .from(pinjamanPengunduranDiriTable)
            .where(
              eq(
                pinjamanPengunduranDiriTable.noPengunduranDiri,
                pengunduran.noPengunduranDiri
              )
            ),
        ]);

        const final: TSuratUndurDiri = {
          ...pengunduran,
          simpanan,
          pinjaman,
        };

        return final;
      });

      if (result) {
        return { ok: true, data: result as TSuratUndurDiri };
      } else {
        return { ok: true, data: null };
      }
    } catch (error) {
      console.error("error surat pengunduran diri : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-surat-pengunduran-diri"],
  {
    tags: ["get-surat-pengunduran-diri"],
  }
);
