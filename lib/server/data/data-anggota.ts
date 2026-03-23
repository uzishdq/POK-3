"use server";

import { db } from "@/lib/db";
import {
  anggotaTable,
  pendaftaranSimpananTable,
  pengambilanSimpananTable,
  pinjamanTable,
  settingPendaftaranSimpananTable,
  simpananTable,
  unitKerjaTable,
  userTable,
} from "@/lib/db/schema";
import { isUuidSchema, noAnggotaSchema } from "@/lib/schema/schema-helper";
import { noPinjamanSchema } from "@/lib/schema/schema-pinjaman";
import { TAnggota, TAnggotaTrx, TAnggotaUser } from "@/lib/types/anggota";
import { RoleType } from "@/lib/types/helper";
import { and, asc, count, eq, inArray, isNotNull, not, sum } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const getNumberAll = unstable_cache(
  async () => {
    try {
      const result = (await db
        .select({
          noAnggota: anggotaTable.noAnggota,
          namaAnggota: anggotaTable.namaAnggota,
          namaUnitKerja: unitKerjaTable.namaUnitKerja,
          noTelpAnggota: anggotaTable.noTelpAnggota,
        })
        .from(anggotaTable)
        .leftJoin(
          unitKerjaTable,
          eq(anggotaTable.unitKerjaId, unitKerjaTable.noUnitKerja),
        )
        .where(
          and(
            eq(anggotaTable.statusAnggota, "ACTIVE"),
            isNotNull(anggotaTable.noTelpAnggota),
          ),
        )) as {
        noAnggota: string;
        namaAnggota: string;
        namaUnitKerja: string;
        noTelpAnggota: string;
      }[];

      return result;
    } catch (error) {
      console.error("error data number anggota: ", error);
      return null;
    }
  },
  ["get-number-all"],
  { tags: ["get-number-all"] },
);

export const getNumberById = unstable_cache(
  async (noAnggota: string) => {
    try {
      const validateValues = noAnggotaSchema.safeParse(noAnggota);

      if (!validateValues.success) {
        return null;
      }

      const result = await db
        .select({
          noAnggota: anggotaTable.noAnggota,
          namaAnggota: anggotaTable.namaAnggota,
          namaUnitKerja: unitKerjaTable.namaUnitKerja,
          noTelpAnggota: anggotaTable.noTelpAnggota,
        })
        .from(anggotaTable)
        .innerJoin(
          unitKerjaTable,
          eq(anggotaTable.unitKerjaId, unitKerjaTable.noUnitKerja),
        )
        .where(
          and(
            eq(anggotaTable.noAnggota, noAnggota),
            eq(anggotaTable.statusAnggota, "ACTIVE"),
            isNotNull(anggotaTable.noTelpAnggota),
            isNotNull(anggotaTable.unitKerjaId), // pastikan unit kerja tidak null
          ),
        )
        .limit(1);

      if (!result[0]) return null;

      const data = result[0];

      // Karena sudah di-filter di query, kamu bisa dengan aman cast
      return {
        noAnggota: data.noAnggota,
        namaAnggota: data.namaAnggota,
        namaUnitKerja: data.namaUnitKerja as string,
        noTelpAnggota: data.noTelpAnggota as string,
      };
    } catch (error) {
      console.error("error data number anggota byId: ", error);
      return null;
    }
  },
  ["get-number-by-id"],
  { tags: ["get-number-by-id"] },
);

export const getNumberByIdPinjaman = unstable_cache(
  async (id: string) => {
    try {
      const validateValues = noPinjamanSchema.safeParse(id);

      if (!validateValues.success) {
        return null;
      }

      const result = await db
        .select({
          noAnggota: anggotaTable.noAnggota,
          namaAnggota: anggotaTable.namaAnggota,
          namaUnitKerja: unitKerjaTable.namaUnitKerja,
          noTelpAnggota: anggotaTable.noTelpAnggota,
        })
        .from(pinjamanTable)
        .innerJoin(
          anggotaTable,
          eq(pinjamanTable.noAnggota, anggotaTable.noAnggota),
        )
        .innerJoin(
          unitKerjaTable,
          eq(anggotaTable.unitKerjaId, unitKerjaTable.noUnitKerja),
        )
        .where(
          and(
            eq(pinjamanTable.noPinjaman, id),
            eq(anggotaTable.statusAnggota, "ACTIVE"),
            isNotNull(anggotaTable.noTelpAnggota),
            isNotNull(anggotaTable.unitKerjaId),
          ),
        )
        .limit(1);

      if (!result[0]) return null;

      const data = result[0];

      // Karena sudah di-filter di query, kamu bisa dengan aman cast
      return {
        noAnggota: data.noAnggota,
        namaAnggota: data.namaAnggota,
        namaUnitKerja: data.namaUnitKerja as string,
        noTelpAnggota: data.noTelpAnggota as string,
      };
    } catch (error) {
      console.error("error data number anggota pinjamanId: ", error);
      return null;
    }
  },
  ["get-number-by-id-pinjaman"],
  { tags: ["get-number-by-id-pinjaman"] },
);

export const getNumberByIdSettingPendaftaran = unstable_cache(
  async (id: string) => {
    try {
      const validateValues = isUuidSchema.safeParse(id);

      if (!validateValues.success) {
        return null;
      }
      const result = (await db
        .select({
          noAnggota: anggotaTable.noAnggota,
          namaAnggota: anggotaTable.namaAnggota,
          namaUnitKerja: unitKerjaTable.namaUnitKerja,
          noTelpAnggota: anggotaTable.noTelpAnggota,
        })
        .from(settingPendaftaranSimpananTable)
        .innerJoin(
          pendaftaranSimpananTable,
          eq(
            settingPendaftaranSimpananTable.idSettingPendaftaran,
            pendaftaranSimpananTable.settingPendaftaranId,
          ),
        )
        .innerJoin(
          anggotaTable,
          eq(pendaftaranSimpananTable.noAnggota, anggotaTable.noAnggota),
        )
        .innerJoin(
          unitKerjaTable,
          eq(anggotaTable.unitKerjaId, unitKerjaTable.noUnitKerja),
        )
        .where(
          and(
            eq(settingPendaftaranSimpananTable.idSettingPendaftaran, id),
            isNotNull(anggotaTable.noTelpAnggota),
            eq(anggotaTable.statusAnggota, "ACTIVE"),
          ),
        )) as {
        noAnggota: string;
        namaAnggota: string;
        namaUnitKerja: string;
        noTelpAnggota: string;
      }[];

      return result;
    } catch (error) {
      console.error("error data number anggota pinjamanId: ", error);
      return null;
    }
  },
  ["get-number-by-pendaftaran-id"],
  { tags: ["get-number-by-pendaftaran-id"] },
);

export const getNumberNonUserRole = unstable_cache(
  async () => {
    try {
      const result = await db
        .select({
          noAnggota: anggotaTable.noAnggota,
          namaAnggota: anggotaTable.namaAnggota,
          role: userTable.role,
          noTelpAnggota: anggotaTable.noTelpAnggota,
        })
        .from(anggotaTable)
        .innerJoin(userTable, eq(anggotaTable.username, userTable.username))
        .where(
          and(
            isNotNull(anggotaTable.noTelpAnggota),
            not(eq(userTable.role, "USER")),
          ),
        );

      return result as {
        noAnggota: string;
        namaAnggota: string;
        role: RoleType;
        noTelpAnggota: string;
      }[];
    } catch (error) {
      console.error("error data number petugas: ", error);
      return null;
    }
  },
  ["get-number-nonuser"],
  { tags: ["get-number-nonuser"] },
);

export const getProfile = unstable_cache(
  async (noAnggota: string) => {
    try {
      const validateValues = noAnggotaSchema.safeParse(noAnggota);

      if (!validateValues.success) {
        return { ok: false, data: null };
      }

      const [result] = await db
        .select()
        .from(anggotaTable)
        .where(eq(anggotaTable.noAnggota, noAnggota))
        .limit(1);

      if (!result) {
        return { ok: true, data: null };
      } else {
        return { ok: true, data: result as TAnggota };
      }
    } catch (error) {
      console.error("error data profile : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-profile"],
  {
    tags: ["get-profile"],
  },
);

export const getAnggotaUser = unstable_cache(
  async () => {
    try {
      const result = await db
        .select({
          noAnggota: anggotaTable.noAnggota,
          idUser: userTable.idUser,
          username: userTable.username,
          namaAnggota: anggotaTable.namaAnggota,
          jenisKelaminAnggota: anggotaTable.jenisKelaminAnggota,
          noTelpAnggota: anggotaTable.noTelpAnggota,
          unitKerjaId: anggotaTable.unitKerjaId,
          namaUnitKerja: unitKerjaTable.namaUnitKerja,
          bankAnggota: anggotaTable.bankAnggota,
          rekeningAnggota: anggotaTable.rekeningAnggota,
          pilihanSukamana: anggotaTable.pilihanSukamana,
          statusAnggota: anggotaTable.statusAnggota,
          role: userTable.role,
        })
        .from(anggotaTable)
        .leftJoin(userTable, eq(anggotaTable.username, userTable.username))
        .leftJoin(
          unitKerjaTable,
          eq(anggotaTable.unitKerjaId, unitKerjaTable.noUnitKerja),
        )
        .orderBy(asc(anggotaTable.noAnggota));

      if (result.length > 0) {
        return { ok: true, data: result as TAnggotaUser[] };
      } else {
        return { ok: true, data: [] as TAnggotaUser[] };
      }
    } catch (error) {
      console.error("error data anggota user: ", error);
      return { ok: false, data: null };
    }
  },
  ["get-anggota-user"],
  {
    tags: ["get-anggota-user"],
  },
);

export const getCountAnggota = unstable_cache(
  async () => {
    try {
      const [active] = await db
        .select({ total: count() })
        .from(anggotaTable)
        .where(eq(anggotaTable.statusAnggota, "ACTIVE"));

      const [notActive] = await db
        .select({ total: count() })
        .from(anggotaTable)
        .where(eq(anggotaTable.statusAnggota, "NOTACTIVE"));

      const total = {
        active: active.total ?? 0,
        noActive: notActive.total ?? 0,
      };

      return { ok: true, data: total };
    } catch (error) {
      console.error("error count anggota: ", error);
      return { ok: false, data: null };
    }
  },
  ["count-anggota"],
  {
    tags: ["count-anggota"],
  },
);

export const getTanggalLahirById = unstable_cache(
  async (noAnggota: string) => {
    try {
      const validateValues = noAnggotaSchema.safeParse(noAnggota);

      if (!validateValues.success) {
        return { ok: false, data: null };
      }

      const [result] = await db
        .select({
          tanggalLahir: anggotaTable.tanggalLahirAnggota,
        })
        .from(anggotaTable)
        .where(eq(anggotaTable.noAnggota, noAnggota))
        .limit(1);

      if (!result) {
        return { ok: false, data: null };
      } else {
        return { ok: true, data: result.tanggalLahir };
      }
    } catch (error) {
      console.error("error data tanggal anggota : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-tanggal-lahir-byId"],
  {
    tags: ["get-tanggal-lahir-byId"],
  },
);

export const getAnggotaTrx = unstable_cache(
  async () => {
    try {
      // Query 1: ambil semua anggota aktif
      const result = await db
        .select({
          noAnggota: anggotaTable.noAnggota,
          namaAnggota: anggotaTable.namaAnggota,
          unitKerjaId: anggotaTable.unitKerjaId,
          namaUnitKerja: unitKerjaTable.namaUnitKerja,
        })
        .from(anggotaTable)
        .leftJoin(
          unitKerjaTable,
          eq(anggotaTable.unitKerjaId, unitKerjaTable.noUnitKerja),
        )
        .where(eq(anggotaTable.statusAnggota, "ACTIVE"))
        .orderBy(asc(anggotaTable.noAnggota));

      if (result.length === 0) {
        return { ok: true, data: [] as TAnggotaTrx[] };
      }

      const noAnggotaList = result.map((r) => r.noAnggota);

      // Query 2: total simpanan per anggota (batch)
      const simpananRows = await db
        .select({
          noAnggota: simpananTable.noAnggota,
          total: sum(simpananTable.jumlahSimpanan).as("total"),
        })
        .from(simpananTable)
        .where(
          and(
            inArray(simpananTable.noAnggota, noAnggotaList),
            inArray(simpananTable.jenisSimpanan, ["WAJIB", "SUKAMANA"]),
          ),
        )
        .groupBy(simpananTable.noAnggota);

      // Query 3: total pengambilan per anggota (batch)
      const pengambilanRows = await db
        .select({
          noAnggota: pengambilanSimpananTable.noAnggota,
          total: sum(pengambilanSimpananTable.jumlahPengambilanSimpanan).as(
            "total",
          ),
        })
        .from(pengambilanSimpananTable)
        .where(
          and(
            inArray(pengambilanSimpananTable.noAnggota, noAnggotaList),
            inArray(pengambilanSimpananTable.jenisPengambilanSimpanan, [
              "WAJIB",
              "SUKAMANA",
            ]),
            inArray(pengambilanSimpananTable.statusPengambilanSimpanan, [
              "APPROVED",
              "PENDING",
            ]),
          ),
        )
        .groupBy(pengambilanSimpananTable.noAnggota);

      // Buat Map untuk O(1) lookup
      const simpananMap = new Map(
        simpananRows.map((s) => [s.noAnggota, Number(s.total ?? 0)]),
      );
      const pengambilanMap = new Map(
        pengambilanRows.map((p) => [p.noAnggota, Number(p.total ?? 0)]),
      );

      // Gabungkan hasil
      const data: TAnggotaTrx[] = result.map((anggota) => {
        const totalSimpananBruto = simpananMap.get(anggota.noAnggota) ?? 0;
        const totalPengambilan = pengambilanMap.get(anggota.noAnggota) ?? 0;
        const sisaSaldo = totalSimpananBruto - totalPengambilan;
        const maxPinjaman = Math.min(sisaSaldo * 15, 50_000_000);

        return {
          ...anggota,
          totalSimpanan: sisaSaldo,
          maxPinjaman,
        };
      });

      return { ok: true, data };
    } catch (error) {
      console.error("error data anggota trx: ", error);
      return { ok: false, data: null };
    }
  },
  ["get-anggota-trx"],
  {
    tags: ["get-anggota-trx"],
  },
);
