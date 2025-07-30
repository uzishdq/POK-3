"use server";

import { auth } from "@/lib/auth";
import {
  JENIS_SIMPANAN,
  JENIS_SIMPANAN_DATE_RANGE,
  LABEL,
} from "@/lib/constan";
import { db } from "@/lib/db";
import {
  anggotaTable,
  detailPembagianSimpananTable,
  pendaftaranSimpananTable,
  pengambilanSimpananTable,
  settingPendaftaranSimpananTable,
  simpananTable,
  unitKerjaTable,
} from "@/lib/db/schema";
import {
  formatTanggalID,
  formatTglPrefixId,
  isRangeDate,
  isValidId,
  transformLaporanSimpananBerjangka,
  transformPembagianSimpanan,
  transformStrukSimpananBerjangka,
} from "@/lib/helper";
import {
  noPengambilanSimpananSchema,
  PembagianSimpananSchema,
} from "@/lib/schema/schema-simpanan";
import {
  JenisPendaftaranSimpananType,
  JenisSimpananType,
} from "@/lib/types/helper";
import {
  TDataLaporanSimpananBerjangka,
  TLaporanSimpananBerjangka,
} from "@/lib/types/laporan";
import {
  TDetailPembagianSimpanan,
  TInputDetailPembagianSimpanan,
  TPendaftaranSimpanan,
  TResultTransformPembagianSimpanan,
  TSettingSimpanan,
  TSimpananUser,
} from "@/lib/types/setting-simpanan";
import {
  LastIdSimpananMap,
  TDataStrukSimpananBerjangka,
  TMaxPengambilan,
  TPengambilanSimpanan,
  TPengambilanSimpananById,
  TSimpananAnggota,
  TSimpananBerjangka,
  TStrukPengambilanSimpanan,
  TStrukSimpananBerjangka,
  TSumSimpananAnggota,
} from "@/lib/types/simpanan";
import {
  and,
  count,
  desc,
  eq,
  gte,
  inArray,
  like,
  lte,
  or,
  sum,
} from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { validate as isUuid } from "uuid";

export const getLastIdSimpanan = async () => {
  const lastId: LastIdSimpananMap = {
    WAJIB: { id: null, jenis: "WAJIB" },
    SUKAMANA: { id: null, jenis: "SUKAMANA" },
    LEBARAN: { id: null, jenis: "LEBARAN" },
    QURBAN: { id: null, jenis: "QURBAN" },
    UBAR: { id: null, jenis: "UBAR" },
  };

  for (const type of JENIS_SIMPANAN) {
    const pattern = formatTglPrefixId(type);

    const result = await db
      .select({ id: simpananTable.noSimpanan })
      .from(simpananTable)
      .where(
        and(
          eq(simpananTable.jenisSimpanan, type as JenisSimpananType),
          like(simpananTable.noSimpanan, pattern)
        )
      )
      .orderBy(desc(simpananTable.noSimpanan))
      .limit(1)
      .execute();

    lastId[type] = {
      id: result.length > 0 ? result[0].id : null,
      jenis: type,
    };
  }

  return lastId;
};

export const getLastIdPengambilanSimpanan = async () => {
  const lastId: LastIdSimpananMap = {
    WAJIB: { id: null, jenis: "WAJIB" },
    SUKAMANA: { id: null, jenis: "SUKAMANA" },
    LEBARAN: { id: null, jenis: "LEBARAN" },
    QURBAN: { id: null, jenis: "QURBAN" },
    UBAR: { id: null, jenis: "UBAR" },
  };

  for (const type of JENIS_SIMPANAN) {
    const pattern = formatTglPrefixId(type);

    const result = await db
      .select({ id: pengambilanSimpananTable.noPengambilanSimpanan })
      .from(pengambilanSimpananTable)
      .where(
        and(
          eq(
            pengambilanSimpananTable.jenisPengambilanSimpanan,
            type as JenisSimpananType
          ),
          like(pengambilanSimpananTable.noPengambilanSimpanan, pattern)
        )
      )
      .orderBy(desc(pengambilanSimpananTable.noPengambilanSimpanan))
      .limit(1)
      .execute();

    lastId[type] = {
      id: result.length > 0 ? result[0].id : null,
      jenis: type,
    };
  }

  return lastId;
};

export const getSettingSimpanan = unstable_cache(
  async () => {
    try {
      const result = await db
        .select()
        .from(settingPendaftaranSimpananTable)
        .orderBy(desc(settingPendaftaranSimpananTable.createdAt));

      if (result.length > 0) {
        return { ok: true, data: result as TSettingSimpanan[] };
      } else {
        return { ok: true, data: [] as TSettingSimpanan[] };
      }
    } catch (error) {
      console.error("error data setting simpanan : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-setting-simpanan"],
  {
    tags: ["get-setting-simpanan"],
  }
);

export const getSettingSimpananById = unstable_cache(
  async (id: string) => {
    try {
      if (!isUuid(id)) {
        return null;
      }

      const [result] = await db
        .select()
        .from(settingPendaftaranSimpananTable)
        .where(eq(settingPendaftaranSimpananTable.idSettingPendaftaran, id))
        .limit(1);

      if (!result) return null;

      return result as TSettingSimpanan;
    } catch (error) {
      console.error("error data setting simpanan by id : ", error);
      return null;
    }
  },
  ["get-setting-simpanan-by-id"],
  {
    tags: ["get-setting-simpanan-by-id"],
  }
);

export const getListPendaftarSimpanan = unstable_cache(
  async (id: string) => {
    try {
      if (!isUuid(id)) {
        return { ok: true, data: [] as TPendaftaranSimpanan[] };
      }

      const result = await db
        .select({
          idPendaftar: pendaftaranSimpananTable.idPendaftar,
          noAnggota: pendaftaranSimpananTable.noAnggota,
          namaAnggota: anggotaTable.namaAnggota,
          namaUnitKerja: unitKerjaTable.namaUnitKerja,
          jumlahPilihan: pendaftaranSimpananTable.jumlahPilihan,
          settingPendaftaranId: pendaftaranSimpananTable.settingPendaftaranId,
        })
        .from(pendaftaranSimpananTable)
        .leftJoin(
          anggotaTable,
          eq(pendaftaranSimpananTable.noAnggota, anggotaTable.noAnggota)
        )
        .leftJoin(
          unitKerjaTable,
          eq(anggotaTable.unitKerjaId, unitKerjaTable.noUnitKerja)
        )
        .where(eq(pendaftaranSimpananTable.settingPendaftaranId, id));

      if (result.length > 0) {
        return { ok: true, data: result as TPendaftaranSimpanan[] };
      } else {
        return { ok: true, data: [] as TPendaftaranSimpanan[] };
      }
    } catch (error) {
      console.error("error data list pendaftaran simpanan : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-list-pendaftar-simpanan"],
  {
    tags: ["get-list-pendaftar-simpanan"],
  }
);

export const getPendaftarSimpanan = unstable_cache(
  async (jenis: JenisPendaftaranSimpananType) => {
    try {
      const [result] = await db
        .select()
        .from(settingPendaftaranSimpananTable)
        .where(
          and(
            eq(settingPendaftaranSimpananTable.jenisPendaftaranSimpanan, jenis),
            eq(
              settingPendaftaranSimpananTable.statusPendaftaranSimpanan,
              "OPEN"
            )
          )
        )
        .orderBy(desc(settingPendaftaranSimpananTable.createdAt))
        .limit(1);

      return { ok: true, data: result as TSettingSimpanan };
    } catch (error) {
      console.error("error data pendaftaran simpanan : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-pendaftar-simpanan"],
  {
    tags: ["get-pendaftar-simpanan"],
  }
);

export const getSumSimpananBerjangka = async (
  jenis: JenisPendaftaranSimpananType
) => {
  try {
    const result = await getPendaftarSimpanan(jenis);

    if (result.data === null) {
      return {
        nama: "none",
        total: 0,
      };
    }

    const [total] = await db
      .select({ sum: count() })
      .from(pendaftaranSimpananTable)
      .where(
        eq(
          pendaftaranSimpananTable.settingPendaftaranId,
          result.data.idSettingPendaftaran
        )
      );

    return {
      nama: result.data.namaPendaftaran,
      total: total.sum,
    };
  } catch (error) {
    return {
      nama: "none",
      total: 0,
    };
  }
};

export const getCountSimpananBerjangka = unstable_cache(
  async () => {
    try {
      let result = {
        lebaran: {
          nama: "none",
          total: 0,
        },
        qurban: {
          nama: "none",
          total: 0,
        },
        ubar: {
          nama: "none",
          total: 0,
        },
      };

      const [lebaran, qurban, ubar] = await Promise.all([
        getSumSimpananBerjangka("LEBARAN"),
        getSumSimpananBerjangka("QURBAN"),
        getSumSimpananBerjangka("UBAR"),
      ]);

      result = {
        lebaran: {
          nama: lebaran.nama,
          total: lebaran.total,
        },
        qurban: {
          nama: qurban.nama,
          total: qurban.total,
        },
        ubar: {
          nama: ubar.nama,
          total: ubar.total,
        },
      };

      return { ok: true, data: result };
    } catch (error) {
      console.error("error data pendaftaran simpanan : ", error);
      return { ok: false, data: null };
    }
  },
  ["count-pendaftar-simpanan"],
  {
    tags: ["count-pendaftar-simpanan"],
  }
);

export const getSimpanan = unstable_cache(
  async (jenis: JenisSimpananType, id: string) => {
    try {
      if (!isValidId(id)) {
        return {
          ok: false,
          data: null,
        };
      }

      const result = await db
        .select()
        .from(simpananTable)
        .where(
          and(
            eq(simpananTable.jenisSimpanan, jenis),
            eq(simpananTable.noAnggota, id)
          )
        )
        .orderBy(desc(simpananTable.tanggalSimpanan));

      if (result.length > 0) {
        return { ok: true, data: result as TSimpananUser[] };
      } else {
        return { ok: true, data: [] as TSimpananUser[] };
      }
    } catch (error) {
      console.error("error data simpanan : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-simpanan"],
  {
    tags: ["get-simpanan"],
  }
);

export const getSimpananBerjangka = unstable_cache(
  async (jenis: JenisPendaftaranSimpananType, id: string) => {
    try {
      if (!isValidId(id)) {
        return {
          ok: false,
          data: null,
        };
      }

      const [berjangka] = await db
        .select()
        .from(settingPendaftaranSimpananTable)
        .where(
          eq(settingPendaftaranSimpananTable.jenisPendaftaranSimpanan, jenis)
        )
        .orderBy(desc(settingPendaftaranSimpananTable.createdAt))
        .limit(1);

      if (!berjangka) {
        return {
          ok: true,
          data: [] as TSimpananUser[],
        };
      }

      if (
        !isRangeDate(
          berjangka.tanggalAwalSimpanan,
          berjangka.tanggalAkhirSimpanan
        )
      ) {
        return {
          ok: true,
          data: [] as TSimpananUser[],
        };
      }

      const result = await db
        .select()
        .from(simpananTable)
        .where(
          and(
            eq(simpananTable.jenisSimpanan, jenis),
            eq(simpananTable.noAnggota, id),
            gte(simpananTable.tanggalSimpanan, berjangka.tanggalAwalSimpanan),
            lte(simpananTable.tanggalSimpanan, berjangka.tanggalAkhirSimpanan)
          )
        )
        .orderBy(desc(simpananTable.tanggalSimpanan));

      if (result.length > 0) {
        return { ok: true, data: result as TSimpananUser[] };
      } else {
        return { ok: true, data: [] as TSimpananUser[] };
      }
    } catch (error) {
      console.error("error data simpanan berjangka : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-simpanan-berjangka"],
  {
    tags: ["get-simpanan-berjangka"],
  }
);

export const getSumSimpanan = unstable_cache(
  async (jenis: JenisSimpananType, id: string) => {
    try {
      if (!isValidId(id)) {
        return {
          ok: false,
          data: null,
        };
      }

      let skipPengambilan = false;
      let dateFilter: { start: string; end: string } | null = null;

      if (JENIS_SIMPANAN_DATE_RANGE.includes(jenis)) {
        const [setting] = await db
          .select({
            dateStart: settingPendaftaranSimpananTable.tanggalAwalSimpanan,
            dateEnd: settingPendaftaranSimpananTable.tanggalAkhirSimpanan,
            statusPendaftaranSimpanan:
              settingPendaftaranSimpananTable.statusPendaftaranSimpanan,
          })
          .from(settingPendaftaranSimpananTable)
          .where(
            eq(
              settingPendaftaranSimpananTable.jenisPendaftaranSimpanan,
              jenis as JenisPendaftaranSimpananType
            )
          )
          .orderBy(desc(settingPendaftaranSimpananTable.tanggalAkhirSimpanan))
          .limit(1);

        if (setting?.statusPendaftaranSimpanan === "CLOSE") {
          skipPengambilan = true;
        } else if (setting?.dateStart && setting?.dateEnd) {
          dateFilter = {
            start: setting.dateStart,
            end: setting.dateEnd,
          };
        }
      }

      const savingWhere = [
        eq(simpananTable.noAnggota, id),
        eq(simpananTable.jenisSimpanan, jenis),
        ...(dateFilter
          ? [
              gte(simpananTable.tanggalSimpanan, dateFilter.start),
              lte(simpananTable.tanggalSimpanan, dateFilter.end),
            ]
          : []),
      ];

      const takingWhere = [
        eq(pengambilanSimpananTable.noAnggota, id),
        eq(pengambilanSimpananTable.jenisPengambilanSimpanan, jenis),
        eq(pengambilanSimpananTable.statusPengambilanSimpanan, "APPROVED"),
        ...(dateFilter
          ? [
              gte(
                pengambilanSimpananTable.tanggalPengambilanSimpanan,
                dateFilter.start
              ),
              lte(
                pengambilanSimpananTable.tanggalPengambilanSimpanan,
                dateFilter.end
              ),
            ]
          : []),
      ];

      let savingResultTotal = 0;
      let takingResultTotal = 0;

      if (!skipPengambilan) {
        // Query total saving
        const [savingResult] = await db
          .select({ total: sum(simpananTable.jumlahSimpanan).as("total") })
          .from(simpananTable)
          .where(and(...savingWhere));

        savingResultTotal = Number(savingResult.total) || 0;
      }

      if (!skipPengambilan) {
        // Query total taking
        const [takingResult] = await db
          .select({
            total: sum(pengambilanSimpananTable.jumlahPengambilanSimpanan).as(
              "total"
            ),
          })
          .from(pengambilanSimpananTable)
          .where(and(...takingWhere));

        takingResultTotal = Number(takingResult.total) || 0;
      }

      // Hitung saldo akhir
      const result = savingResultTotal - takingResultTotal;

      return { ok: true, data: result };
    } catch (error) {
      console.error("error data sum simpanan : ", error);
      return { ok: false, data: null };
    }
  },
  ["sum-simpanan"],
  {
    tags: ["sum-simpanan"],
  }
);

export const getMaxPengambilanSimpanan = async (id: string) => {
  try {
    let result: TMaxPengambilan = {
      sukamana: 0,
      lebaran: 0,
      qurban: 0,
      ubar: 0,
      total: 0,
    };

    if (!isValidId(id)) {
      return {
        ok: false,
        data: null,
      };
    }

    const [sukamana, lebaran, qurban, ubar] = await Promise.all([
      getSumSimpanan("SUKAMANA", id),
      getSumSimpanan("LEBARAN", id),
      getSumSimpanan("QURBAN", id),
      getSumSimpanan("UBAR", id),
    ]);

    result.sukamana = sukamana.ok && sukamana.data ? sukamana.data : 0;
    result.lebaran = lebaran.ok && lebaran.data ? lebaran.data : 0;
    result.qurban = qurban.ok && qurban.data ? qurban.data : 0;
    result.ubar = ubar.ok && ubar.data ? ubar.data : 0;
    result.total =
      result.sukamana + result.lebaran + result.qurban + result.ubar;

    return {
      ok: true,
      data: result as TMaxPengambilan,
    };
  } catch (error) {
    console.error("error sum max pengambilan simpanan : ", error);
    return { ok: false, data: null };
  }
};

export const getAllSimpananById = async (id: string) => {
  try {
    let result: TSumSimpananAnggota = {
      WAJIB: 0,
      SUKAMANA: 0,
      LEBARAN: 0,
      QURBAN: 0,
      UBAR: 0,
      PENGAMBILAN: 0,
      SALDO: 0,
    };

    if (!isValidId(id)) {
      return {
        ok: false,
        data: null,
      };
    }

    const [wajib, sukamana, lebaran, qurban, ubar] = await Promise.all([
      getSumSimpanan("WAJIB", id),
      getSumSimpanan("SUKAMANA", id),
      getSumSimpanan("LEBARAN", id),
      getSumSimpanan("QURBAN", id),
      getSumSimpanan("UBAR", id),
    ]);

    result.WAJIB = wajib.ok && wajib.data ? wajib.data : 0;
    result.SUKAMANA = sukamana.ok && sukamana.data ? sukamana.data : 0;
    result.LEBARAN = lebaran.ok && lebaran.data ? lebaran.data : 0;
    result.QURBAN = qurban.ok && qurban.data ? qurban.data : 0;
    result.UBAR = ubar.ok && ubar.data ? ubar.data : 0;
    result.SALDO =
      result.WAJIB +
      result.SUKAMANA +
      result.LEBARAN +
      result.QURBAN +
      result.UBAR;

    return {
      ok: true,
      data: result as TSumSimpananAnggota,
    };
  } catch (error) {
    console.error("error sum max pengambilan simpanan : ", error);
    return { ok: false, data: null };
  }
};

export const getSumPengambilanById = async (
  id: string,
  jenis: JenisSimpananType
) => {
  try {
    if (!isValidId(id)) {
      return null;
    }

    const [takingResult] = await db
      .select({
        total: sum(pengambilanSimpananTable.jumlahPengambilanSimpanan).as(
          "total"
        ),
      })
      .from(pengambilanSimpananTable)
      .where(
        and(
          eq(pengambilanSimpananTable.noAnggota, id),
          eq(pengambilanSimpananTable.jenisPengambilanSimpanan, jenis),
          eq(pengambilanSimpananTable.statusPengambilanSimpanan, "APPROVED")
        )
      );

    return Number(takingResult.total ?? 0);
  } catch (error) {
    console.error("error sum pengambilan simpanan : ", error);
    return null;
  }
};

export const getTotalSumPengambilanById = unstable_cache(
  async (id: string) => {
    try {
      if (!isValidId(id)) return null;

      const jenisList = ["SUKAMANA", "LEBARAN", "QURBAN", "UBAR"] as const;

      const results = await Promise.all(
        jenisList.map((jenis) => getSumPengambilanById(id, jenis))
      );

      const [sukamana, lebaran, qurban, ubar] = results;

      const hasil =
        (sukamana || 0) + (lebaran || 0) + (qurban || 0) + (ubar || 0);

      return { sukamana, lebaran, qurban, ubar, hasil };
    } catch (error) {
      console.error("error total sum pengambilan simpanan:", error);
      return null;
    }
  },
  ["get-total-sum-pengambilan-by-id"],
  {
    tags: ["get-total-sum-pengambilan-by-id"],
  }
);

export const getPengambilanSimpananById = unstable_cache(
  async (id: string) => {
    try {
      if (!isValidId(id)) {
        return {
          ok: false,
          data: null,
        };
      }

      const result = await db
        .select()
        .from(pengambilanSimpananTable)
        .where(eq(pengambilanSimpananTable.noAnggota, id))
        .orderBy(desc(pengambilanSimpananTable.tanggalPengambilanSimpanan));

      if (result.length > 0) {
        return { ok: true, data: result as TPengambilanSimpananById[] };
      } else {
        return { ok: true, data: [] as TPengambilanSimpananById[] };
      }
    } catch (error) {
      console.error("error data pengambilan simpanan by id : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-pengambilan-simpanan-by-id"],
  {
    tags: ["get-pengambilan-simpanan-by-id"],
  }
);

export const getPengambilanSimpanan = unstable_cache(
  async () => {
    try {
      const result = await db
        .select({
          noPengambilanSimpanan: pengambilanSimpananTable.noPengambilanSimpanan,
          noAnggota: pengambilanSimpananTable.noAnggota,
          namaAnggota: anggotaTable.namaAnggota,
          namaUnitKerja: unitKerjaTable.namaUnitKerja,
          noTelp: anggotaTable.noTelpAnggota,
          bank: anggotaTable.bankAnggota,
          rek: anggotaTable.rekeningAnggota,
          tanggalPengambilanSimpanan:
            pengambilanSimpananTable.tanggalPengambilanSimpanan,
          jenisPengambilanSimpanan:
            pengambilanSimpananTable.jenisPengambilanSimpanan,
          jumlahPengambilanSimpanan:
            pengambilanSimpananTable.jumlahPengambilanSimpanan,
          statusPengambilanSimpanan:
            pengambilanSimpananTable.statusPengambilanSimpanan,
        })
        .from(pengambilanSimpananTable)
        .leftJoin(
          anggotaTable,
          eq(pengambilanSimpananTable.noAnggota, anggotaTable.noAnggota)
        )
        .leftJoin(
          unitKerjaTable,
          eq(anggotaTable.unitKerjaId, unitKerjaTable.noUnitKerja)
        )
        .orderBy(desc(pengambilanSimpananTable.tanggalPengambilanSimpanan));

      if (result.length > 0) {
        return { ok: true, data: result as TPengambilanSimpanan[] };
      } else {
        return { ok: true, data: [] as TPengambilanSimpanan[] };
      }
    } catch (error) {
      console.error("error data pengambilan simpanan : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-pengambilan-simpanan"],
  {
    tags: ["get-pengambilan-simpanan"],
  }
);

export const verifPengambilanSimpananBerjangka = unstable_cache(
  async (id: string, jenis: JenisSimpananType) => {
    try {
      if (!isValidId(id)) {
        return {
          ok: false,
          message: "Verifikasi pengambilan simpanan gagal. ID tidak valid.",
        };
      }

      const [pending] = await db
        .select()
        .from(pengambilanSimpananTable)
        .where(
          and(
            eq(pengambilanSimpananTable.noAnggota, id),
            eq(pengambilanSimpananTable.jenisPengambilanSimpanan, jenis),
            eq(pengambilanSimpananTable.statusPengambilanSimpanan, "PENDING")
          )
        )
        .limit(1);

      if (pending) {
        return {
          ok: false,
          message: `Pengambilan ${jenis} masih dalam status persetujuan. No pengambilan: ${pending.noPengambilanSimpanan}.`,
        };
      }

      if (JENIS_SIMPANAN_DATE_RANGE.includes(jenis)) {
        const [setting] = await db
          .select({
            tanggalAwalSimpanan:
              settingPendaftaranSimpananTable.tanggalAwalSimpanan,
            tanggalAkhirSimpanan:
              settingPendaftaranSimpananTable.tanggalAkhirSimpanan,
          })
          .from(settingPendaftaranSimpananTable)
          .where(
            and(
              eq(
                settingPendaftaranSimpananTable.jenisPendaftaranSimpanan,
                jenis as JenisPendaftaranSimpananType
              ),
              eq(
                settingPendaftaranSimpananTable.statusPendaftaranSimpanan,
                "OPEN"
              )
            )
          )
          .orderBy(desc(settingPendaftaranSimpananTable.createdAt))
          .limit(1);

        if (!setting) {
          return {
            ok: false,
            message: `Pengaturan simpanan ${jenis} tidak ditemukan.`,
          };
        }

        const [alreadyTaken] = await db
          .select()
          .from(pengambilanSimpananTable)
          .where(
            and(
              eq(pengambilanSimpananTable.noAnggota, id),
              eq(pengambilanSimpananTable.jenisPengambilanSimpanan, jenis),
              gte(
                pengambilanSimpananTable.tanggalPengambilanSimpanan,
                setting.tanggalAwalSimpanan
              ),
              lte(
                pengambilanSimpananTable.tanggalPengambilanSimpanan,
                setting.tanggalAkhirSimpanan
              )
            )
          )
          .limit(1);

        if (alreadyTaken) {
          return {
            ok: false,
            message: `Pengambilan ${jenis} sudah pernah dilakukan dalam periode ini. No Pengambilan ${alreadyTaken.noPengambilanSimpanan}`,
          };
        }
      }

      return {
        ok: true,
        message: "Verifikasi pengambilan simpanan berhasil.",
      };
    } catch (error) {
      console.error("error sum pengambilan simpanan : ", error);
      return {
        ok: false,
        message: "Verifikasi pengambilan simpanan gagal.",
      };
    }
  },
  ["verif-pengambilan-simpanan-berjangka"],
  {
    tags: ["verif-pengambilan-simpanan-berjangka"],
  }
);

export const getSuratPengambilanSimpanan = async (id: string) => {
  try {
    const validateValues = noPengambilanSimpananSchema.safeParse(id);

    if (!validateValues.success) {
      return { ok: false, data: null };
    }

    const [result] = await db
      .select({
        noAnggota: anggotaTable.noAnggota,
        namaAnggota: anggotaTable.namaAnggota,
        namaUnitKerja: unitKerjaTable.namaUnitKerja,
        noPengambilanSimpanan: pengambilanSimpananTable.noPengambilanSimpanan,
        tanggalPengambilanSimpanan:
          pengambilanSimpananTable.tanggalPengambilanSimpanan,
        jenisPengambilanSimpanan:
          pengambilanSimpananTable.jenisPengambilanSimpanan,
        jumlahPengambilanSimpanan:
          pengambilanSimpananTable.jumlahPengambilanSimpanan,
      })
      .from(pengambilanSimpananTable)
      .leftJoin(
        anggotaTable,
        eq(pengambilanSimpananTable.noAnggota, anggotaTable.noAnggota)
      )
      .leftJoin(
        unitKerjaTable,
        eq(anggotaTable.unitKerjaId, unitKerjaTable.noUnitKerja)
      )
      .where(eq(pengambilanSimpananTable.noPengambilanSimpanan, id))
      .limit(1);

    if (!result) {
      return { ok: true, data: null };
    } else {
      return { ok: true, data: result as TStrukPengambilanSimpanan };
    }
  } catch (error) {
    console.error("error surat pengambilan simpanan:", error);
    return { ok: false, data: null };
  }
};

export const getSimpananAnggota = unstable_cache(
  async () => {
    try {
      const users = await db
        .select({
          noAnggota: anggotaTable.noAnggota,
          namaAnggota: anggotaTable.namaAnggota,
          namaUnitKerja: unitKerjaTable.namaUnitKerja,
        })
        .from(anggotaTable)
        .leftJoin(
          unitKerjaTable,
          eq(anggotaTable.unitKerjaId, unitKerjaTable.noUnitKerja)
        )
        .where(eq(anggotaTable.statusAnggota, "ACTIVE"));

      if (!users || users.length === 0) {
        return { ok: true, data: [] as TSimpananAnggota[] };
      }

      const noAnggotaList = users.map((u) => u.noAnggota);

      // Get all savings and takings for active users
      const [simpanan, pengambilan] = await Promise.all([
        db
          .select({
            noAnggota: simpananTable.noAnggota,
            jenisSimpanan: simpananTable.jenisSimpanan,
            jumlahSimpanan: simpananTable.jumlahSimpanan,
          })
          .from(simpananTable)
          .where(inArray(simpananTable.noAnggota, noAnggotaList)),

        db
          .select({
            noAnggota: pengambilanSimpananTable.noAnggota,
            jenisPengambilanSimpanan:
              pengambilanSimpananTable.jenisPengambilanSimpanan,
            jumlahPengambilanSimpanan:
              pengambilanSimpananTable.jumlahPengambilanSimpanan,
          })
          .from(pengambilanSimpananTable)
          .where(
            and(
              inArray(pengambilanSimpananTable.noAnggota, noAnggotaList),
              eq(pengambilanSimpananTable.statusPengambilanSimpanan, "APPROVED")
            )
          ),
      ]);

      // Build per-user data
      const result = users.map((user) => {
        const balances: Record<JenisSimpananType, number> = {
          WAJIB: 0,
          SUKAMANA: 0,
          LEBARAN: 0,
          QURBAN: 0,
          UBAR: 0,
        };

        let totalTaking = 0;

        // Hitung total simpanan
        for (const jenis of JENIS_SIMPANAN) {
          const totalSaving = simpanan
            .filter(
              (s) => s.noAnggota === user.noAnggota && s.jenisSimpanan === jenis
            )
            .reduce((sum, s) => sum + Number(s.jumlahSimpanan), 0);

          const totalTakingJenis = pengambilan
            .filter(
              (t) =>
                t.noAnggota === user.noAnggota &&
                t.jenisPengambilanSimpanan === jenis
            )
            .reduce((sum, t) => sum + Number(t.jumlahPengambilanSimpanan), 0);

          const balance = totalSaving - totalTakingJenis;

          balances[jenis as JenisSimpananType] = balance;
          totalTaking += totalTakingJenis;
        }

        const total =
          balances.WAJIB +
          balances.SUKAMANA +
          balances.LEBARAN +
          balances.QURBAN +
          balances.UBAR;

        return {
          noAnggota: user.noAnggota,
          namaAnggota: user.namaAnggota,
          namaUnitKerja: user.namaUnitKerja ?? "-",
          wajib: balances.WAJIB,
          manasuka: balances.SUKAMANA,
          lebaran: balances.LEBARAN,
          qurban: balances.QURBAN,
          ubar: balances.UBAR,
          totalTaking,
          totalBalance: total,
        };
      });

      return { ok: true, data: result as TSimpananAnggota[] };
    } catch (error) {
      console.error("error data simpanan anggota : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-simpanan-anggota"],
  {
    tags: ["get-simpanan-anggota"],
  }
);

export const getSumSimpananAnggota = unstable_cache(
  async () => {
    const result: TSumSimpananAnggota = {
      WAJIB: 0,
      SUKAMANA: 0,
      LEBARAN: 0,
      QURBAN: 0,
      UBAR: 0,
      PENGAMBILAN: 0,
      SALDO: 0,
    };

    const users = await db
      .select({
        noAnggota: anggotaTable.noAnggota,
      })
      .from(anggotaTable)
      .where(eq(anggotaTable.statusAnggota, "ACTIVE"));

    if (!users || users.length === 0) {
      return result;
    }

    const noAnggotaList = users.map((u) => u.noAnggota);

    // Get all simpanan & pengambilan for active users
    const [simpanan, pengambilan] = await Promise.all([
      db
        .select({
          noAnggota: simpananTable.noAnggota,
          jenisSimpanan: simpananTable.jenisSimpanan,
          jumlahSimpanan: simpananTable.jumlahSimpanan,
        })
        .from(simpananTable)
        .where(inArray(simpananTable.noAnggota, noAnggotaList)),

      db
        .select({
          noAnggota: pengambilanSimpananTable.noAnggota,
          jenisPengambilanSimpanan:
            pengambilanSimpananTable.jenisPengambilanSimpanan,
          jumlahPengambilanSimpanan:
            pengambilanSimpananTable.jumlahPengambilanSimpanan,
        })
        .from(pengambilanSimpananTable)
        .where(
          and(
            inArray(pengambilanSimpananTable.noAnggota, noAnggotaList),
            eq(pengambilanSimpananTable.statusPengambilanSimpanan, "APPROVED")
          )
        ),
    ]);

    for (const jenis of JENIS_SIMPANAN) {
      const totalSaving = simpanan
        .filter((s) => s.jenisSimpanan === jenis)
        .reduce((sum, s) => sum + Number(s.jumlahSimpanan), 0);

      const totalTaking = pengambilan
        .filter((p) => p.jenisPengambilanSimpanan === jenis)
        .reduce((sum, p) => sum + Number(p.jumlahPengambilanSimpanan), 0);

      const balance = totalSaving - totalTaking;

      result[jenis as JenisSimpananType] = balance;
      result.PENGAMBILAN += totalTaking;
      result.SALDO += balance;
    }

    return result;
  },
  ["get-sum-simpanan-anggota"],
  {
    tags: ["get-sum-simpanan-anggota"],
  }
);

export const getLaporanSimpananBerjangka = unstable_cache(
  async (idSettingPendaftaran: string, basilParams?: number) => {
    try {
      if (!isUuid(idSettingPendaftaran)) {
        return {
          ok: false,
          message: "data tidak ditemukan",
          data: { result: null, namePendaftaran: "tidak ada data", basil: 0 },
        };
      }

      const [setting] = await db
        .select()
        .from(settingPendaftaranSimpananTable)
        .where(
          eq(
            settingPendaftaranSimpananTable.idSettingPendaftaran,
            idSettingPendaftaran
          )
        )
        .limit(1);

      if (!setting) {
        return {
          ok: false,
          message: "data tidak ditemukan",
          data: { result: null, namePendaftaran: "tidak ada data", basil: 0 },
        };
      }

      const basil = Number(setting?.basilSimpanan ?? basilParams ?? 0);

      const result = await db.transaction<TDataLaporanSimpananBerjangka[]>(
        async (tx) => {
          // 1. Get all anggota via pendaftar
          const pendaftar = await tx
            .select({
              idPendaftar: pendaftaranSimpananTable.idPendaftar,
              noAnggota: anggotaTable.noAnggota,
              namaAnggota: anggotaTable.namaAnggota,
              namaUnitKerja: unitKerjaTable.namaUnitKerja,
            })
            .from(pendaftaranSimpananTable)
            .innerJoin(
              anggotaTable,
              eq(pendaftaranSimpananTable.noAnggota, anggotaTable.noAnggota)
            )
            .innerJoin(
              unitKerjaTable,
              eq(anggotaTable.unitKerjaId, unitKerjaTable.noUnitKerja)
            )
            .where(
              and(
                eq(
                  pendaftaranSimpananTable.settingPendaftaranId,
                  setting.idSettingPendaftaran
                ),
                eq(anggotaTable.statusAnggota, "ACTIVE")
              )
            );

          const noAnggotaList = pendaftar.map((p) => p.noAnggota);

          // 2. Get Simpanan
          const simpanan = await tx
            .select()
            .from(simpananTable)
            .where(
              and(
                inArray(simpananTable.noAnggota, noAnggotaList),
                eq(
                  simpananTable.jenisSimpanan,
                  setting.jenisPendaftaranSimpanan
                ),
                gte(simpananTable.tanggalSimpanan, setting.tanggalAwalSimpanan),
                lte(simpananTable.tanggalSimpanan, setting.tanggalAkhirSimpanan)
              )
            );

          // 3. Get PengambilanSimpanan
          const pengambilan = await tx
            .select()
            .from(pengambilanSimpananTable)
            .where(
              and(
                inArray(pengambilanSimpananTable.noAnggota, noAnggotaList),
                eq(
                  pengambilanSimpananTable.jenisPengambilanSimpanan,
                  setting.jenisPendaftaranSimpanan
                ),
                gte(
                  pengambilanSimpananTable.tanggalPengambilanSimpanan,
                  setting.tanggalAwalSimpanan
                ),
                lte(
                  pengambilanSimpananTable.tanggalPengambilanSimpanan,
                  setting.tanggalAkhirSimpanan
                )
              )
            );

          // 4. Gabungkan hasil akhir
          const merged = pendaftar.map((item) => ({
            anggota: {
              idPendaftar: item.idPendaftar,
              noAnggota: item.noAnggota,
              namaAnggota: item.namaAnggota,
              namaUnitKerja: item.namaUnitKerja,
              Simpanan: simpanan.filter((s) => s.noAnggota === item.noAnggota),
              PengambilanSimpanan: pengambilan.filter(
                (p) => p.noAnggota === item.noAnggota
              ),
            },
          }));

          return merged;
        }
      );

      if (!result.length) {
        return {
          ok: false,
          message: "data tidak ditemukan",
          data: { result: null, namePendaftaran: "tidak ada data", basil: 0 },
        };
      }

      const transformData = transformLaporanSimpananBerjangka({
        simpananData: result,
        setting: {
          basil: basil,
          startDate: setting.tanggalAwalSimpanan,
          endDate: setting.tanggalAkhirSimpanan,
          jenisSimpanan: setting.jenisPendaftaranSimpanan,
        },
      });

      return {
        ok: true,
        message: "data ditemukan",
        data: {
          result: transformData as TLaporanSimpananBerjangka[],
          namePendaftaran: setting.namaPendaftaran,
          basil: basil,
        },
      };
    } catch (error) {
      console.error("error data laporan simpanan berjangka : ", error);
      return {
        ok: false,
        message: LABEL.ERROR.SERVER,
        data: { result: null, namePendaftaran: "tidak ada data", basil: 0 },
      };
    }
  },
  ["get-laporan-simpanan-berjangka"],
  {
    tags: ["get-laporan-simpanan-berjangka"],
  }
);

export const getPembagianSimpananBerjangka = unstable_cache(
  async (idSetting: string) => {
    try {
      if (!isUuid(idSetting)) {
        return {
          ok: false,
          message: "data tidak ditemukan",
          data: null,
        };
      }

      const [settingData] = await db
        .select()
        .from(settingPendaftaranSimpananTable)
        .where(
          eq(settingPendaftaranSimpananTable.idSettingPendaftaran, idSetting)
        )
        .limit(1);

      if (!settingData) {
        return {
          ok: false,
          message: "data tidak ditemukan",
          data: null,
        };
      }

      const result = await db.transaction(async (tx) => {
        // 1. Get all anggota via pendaftar
        const pendaftar = await tx
          .select({
            idPendaftar: pendaftaranSimpananTable.idPendaftar,
            noAnggota: pendaftaranSimpananTable.noAnggota,
          })
          .from(pendaftaranSimpananTable)
          .innerJoin(
            anggotaTable,
            eq(pendaftaranSimpananTable.noAnggota, anggotaTable.noAnggota)
          )
          .where(
            and(
              eq(
                pendaftaranSimpananTable.settingPendaftaranId,
                settingData.idSettingPendaftaran
              ),
              eq(anggotaTable.statusAnggota, "ACTIVE")
            )
          );

        const noAnggotaList = pendaftar.map((p) => p.noAnggota);

        // 2. Get Simpanan
        const simpanan = await tx
          .select()
          .from(simpananTable)
          .where(
            and(
              inArray(simpananTable.noAnggota, noAnggotaList),
              eq(
                simpananTable.jenisSimpanan,
                settingData.jenisPendaftaranSimpanan
              ),
              gte(
                simpananTable.tanggalSimpanan,
                settingData.tanggalAwalSimpanan
              ),
              lte(
                simpananTable.tanggalSimpanan,
                settingData.tanggalAkhirSimpanan
              )
            )
          );

        // 3. Get PengambilanSimpanan
        const pengambilan = await tx
          .select()
          .from(pengambilanSimpananTable)
          .where(
            and(
              inArray(pengambilanSimpananTable.noAnggota, noAnggotaList),
              eq(
                pengambilanSimpananTable.jenisPengambilanSimpanan,
                settingData.jenisPendaftaranSimpanan
              ),
              gte(
                pengambilanSimpananTable.tanggalPengambilanSimpanan,
                settingData.tanggalAwalSimpanan
              ),
              lte(
                pengambilanSimpananTable.tanggalPengambilanSimpanan,
                settingData.tanggalAkhirSimpanan
              )
            )
          );

        const lastId = await getLastIdPengambilanSimpanan();

        // 4. Gabungkan hasil akhir
        const merged = pendaftar.map((item) => ({
          anggota: {
            idPendaftar: item.idPendaftar,
            namaPendaftaran: settingData.namaPendaftaran,
            noAnggota: item.noAnggota,
            Simpanan: simpanan.filter((s) => s.noAnggota === item.noAnggota),
            PengambilanSimpanan: pengambilan.filter(
              (p) => p.noAnggota === item.noAnggota
            ),
          },
        }));

        return { merged: merged, lastId: lastId };
      });

      if (!result.merged.length) {
        return {
          ok: false,
          message: "data tidak ditemukan",
          data: null,
        };
      }

      const transformData = transformPembagianSimpanan({
        simpananData: result.merged,
        lastId: result.lastId,
        setting: {
          startDate: settingData.tanggalAwalSimpanan,
          endDate: settingData.tanggalAkhirSimpanan,
          jenisSimpanan: settingData.jenisPendaftaranSimpanan,
        },
      });

      return {
        ok: true,
        message: "data ditemukan",
        data: transformData as TResultTransformPembagianSimpanan,
      };
    } catch (error) {
      console.error("error data pembagian simpanan berjangka : ", error);
      return {
        ok: false,
        message: LABEL.ERROR.SERVER,
        data: null,
      };
    }
  },
  ["get-pembagian-simpanan-berjangka"],
  {
    tags: ["get-pembagian-simpanan-berjangka"],
  }
);

export const getSimpananBerjangkaById = unstable_cache(
  async (id: string) => {
    try {
      if (!isValidId(id)) {
        return {
          ok: false,
          data: null,
        };
      }

      const result = await db
        .select({
          idPendaftar: pendaftaranSimpananTable.idPendaftar,
          noAnggota: pendaftaranSimpananTable.noAnggota,
          settingPendaftaranId: pendaftaranSimpananTable.settingPendaftaranId,
          namaPendaftaran: settingPendaftaranSimpananTable.namaPendaftaran,
          jenisPendaftaranSimpanan:
            settingPendaftaranSimpananTable.jenisPendaftaranSimpanan,
          statusPendaftaranSimpanan:
            settingPendaftaranSimpananTable.statusPendaftaranSimpanan,
          tanggalPendaftaran: pendaftaranSimpananTable.tanggalPendaftaran,
          jumlahPilihan: pendaftaranSimpananTable.jumlahPilihan,
        })
        .from(pendaftaranSimpananTable)
        .innerJoin(
          settingPendaftaranSimpananTable,
          eq(
            pendaftaranSimpananTable.settingPendaftaranId,
            settingPendaftaranSimpananTable.idSettingPendaftaran
          )
        )
        .where(eq(pendaftaranSimpananTable.noAnggota, id))
        .orderBy(desc(pendaftaranSimpananTable.tanggalPendaftaran));

      if (result.length > 0) {
        return { ok: true, data: result as TSimpananBerjangka[] };
      } else {
        return { ok: true, data: [] as TSimpananBerjangka[] };
      }
    } catch (error) {
      console.error("error data pengambilan simpanan by id : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-simpanan-berjangka-by-id"],
  {
    tags: ["get-simpanan-berjangka-by-id"],
  }
);

export const getStrukSimpananBerjangkaById = unstable_cache(
  async (idPendaftar: string) => {
    try {
      if (!isUuid(idPendaftar)) {
        return {
          ok: false,
          data: null,
        };
      }

      const [anggota, detailSimpanan] = await Promise.all([
        db
          .select({
            noAnggota: pendaftaranSimpananTable.noAnggota,
            namaAnggota: anggotaTable.namaAnggota,
            bankAnggota: anggotaTable.bankAnggota,
            rekeningAnggota: anggotaTable.rekeningAnggota,
            namaUnitKerja: unitKerjaTable.namaUnitKerja,
            idSettingPendaftaran:
              settingPendaftaranSimpananTable.idSettingPendaftaran,
            namaPendaftaran: settingPendaftaranSimpananTable.namaPendaftaran,
            basilSimpanan: settingPendaftaranSimpananTable.basilSimpanan,
            tanggalAwalSimpanan:
              settingPendaftaranSimpananTable.tanggalAwalSimpanan,
            tanggalAkhirSimpanan:
              settingPendaftaranSimpananTable.tanggalAkhirSimpanan,
            tanggalPembagian: settingPendaftaranSimpananTable.tanggalPembagian,
            updatedAt: settingPendaftaranSimpananTable.updatedAt,
            jenisPendaftaranSimpanan:
              settingPendaftaranSimpananTable.jenisPendaftaranSimpanan,
          })
          .from(pendaftaranSimpananTable)
          .innerJoin(
            anggotaTable,
            eq(pendaftaranSimpananTable.noAnggota, anggotaTable.noAnggota)
          )
          .innerJoin(
            unitKerjaTable,
            eq(anggotaTable.unitKerjaId, unitKerjaTable.noUnitKerja)
          )
          .innerJoin(
            settingPendaftaranSimpananTable,
            eq(
              pendaftaranSimpananTable.settingPendaftaranId,
              settingPendaftaranSimpananTable.idSettingPendaftaran
            )
          )
          .where(eq(pendaftaranSimpananTable.idPendaftar, idPendaftar))
          .limit(1)
          .then((res) => res[0]),

        db
          .select({
            idDetailPembagian: detailPembagianSimpananTable.idDetailPembagian,
            pendaftarId: detailPembagianSimpananTable.pendaftarId,
            tanggalDetailPembagian:
              detailPembagianSimpananTable.tanggalDetailPembagian,
            jumlahDetailPembagian:
              detailPembagianSimpananTable.jumlahDetailPembagian,
          })
          .from(detailPembagianSimpananTable)
          .where(eq(detailPembagianSimpananTable.pendaftarId, idPendaftar)),
      ]);

      if (!anggota || !detailSimpanan || detailSimpanan.length === 0) {
        return {
          ok: false,
          data: null,
        };
      }

      const result: TDataStrukSimpananBerjangka = {
        ...anggota,
        detailSimpanan,
      };

      const transformData = transformStrukSimpananBerjangka({
        simpananData: result,
      });

      return {
        ok: true,
        data: transformData as TStrukSimpananBerjangka,
      };
    } catch (error) {
      console.error("error data struk simpanan berjangka : ", error);
      return {
        ok: false,
        data: null,
      };
    }
  },
  ["get-struk-simpanan-berjangka"],
  {
    tags: ["get-struk-simpanan-berjangka"],
  }
);
