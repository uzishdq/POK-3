"use server";

import { db } from "@/lib/db";
import {
  anggotaTable,
  angsuranTable,
  pendaftaranSimpananTable,
  pinjamanTable,
  potongGajiTable,
  settingPendaftaranSimpananTable,
  unitKerjaTable,
} from "@/lib/db/schema";
import { generatePotongGaji, isRangeDate } from "@/lib/helper";
import {
  JenisPendaftaranSimpananType,
  JenisPinjamanType,
} from "@/lib/types/helper";
import { THistoryPotongGaji, TPotongGaji } from "@/lib/types/potong-gaji";
import { and, asc, desc, eq, max, or } from "drizzle-orm";
import { unstable_cache } from "next/cache";

const getAnggotaPotonganGaji = async () => {
  try {
    const result = await db
      .select({
        noAnggota: anggotaTable.noAnggota,
        namaAnggota: anggotaTable.namaAnggota,
        namaUnitKerja: unitKerjaTable.namaUnitKerja,
        pilihanSukamana: anggotaTable.pilihanSukamana,
      })
      .from(anggotaTable)
      .leftJoin(
        unitKerjaTable,
        eq(anggotaTable.unitKerjaId, unitKerjaTable.noUnitKerja)
      )
      .where(eq(anggotaTable.statusAnggota, "ACTIVE"))
      .orderBy(asc(anggotaTable.noAnggota));

    return result;
  } catch (error) {
    console.error("error data anggota potong gaji : ", error);
    return null;
  }
};

const getSimpananBerjankaPotonganGaji = async (
  jenis: JenisPendaftaranSimpananType
) => {
  try {
    const [pendaftaran] = await db
      .select({
        idSettingPendaftaran:
          settingPendaftaranSimpananTable.idSettingPendaftaran,
        jenisPendaftaranSimpanan:
          settingPendaftaranSimpananTable.jenisPendaftaranSimpanan,
        tanggalAwalSimpanan:
          settingPendaftaranSimpananTable.tanggalAwalSimpanan,
        tanggalAkhirSimpanan:
          settingPendaftaranSimpananTable.tanggalAkhirSimpanan,
      })
      .from(settingPendaftaranSimpananTable)
      .where(
        and(
          eq(settingPendaftaranSimpananTable.jenisPendaftaranSimpanan, jenis),
          eq(settingPendaftaranSimpananTable.statusPendaftaranSimpanan, "OPEN")
        )
      )
      .orderBy(desc(settingPendaftaranSimpananTable.createdAt))
      .limit(1);

    if (
      !pendaftaran ||
      !isRangeDate(
        pendaftaran.tanggalAwalSimpanan,
        pendaftaran.tanggalAkhirSimpanan
      )
    ) {
      return null;
    }

    const result = await db
      .select({
        noAnggota: pendaftaranSimpananTable.noAnggota,
        jenisSimpanan: settingPendaftaranSimpananTable.jenisPendaftaranSimpanan,
        jumlahPilihan: pendaftaranSimpananTable.jumlahPilihan,
      })
      .from(pendaftaranSimpananTable)
      .leftJoin(
        settingPendaftaranSimpananTable,
        eq(
          pendaftaranSimpananTable.settingPendaftaranId,
          pendaftaran.idSettingPendaftaran
        )
      )
      .where(
        eq(
          pendaftaranSimpananTable.settingPendaftaranId,
          pendaftaran.idSettingPendaftaran
        )
      );

    if (result.length > 0) {
      return result;
    } else {
      return null;
    }
  } catch (error) {
    console.error("error data simpanan berjangka potong gaji : ", error);
    return null;
  }
};

const getPinjamanPotonganGaji = async (jenis: JenisPinjamanType) => {
  try {
    const latestAngsuran = db
      .select({
        noPinjaman: angsuranTable.pinjamanId,
        maxAngsuranKe: max(angsuranTable.angsuranPinjamanKe).as(
          "maxAngsuranKe"
        ),
      })
      .from(angsuranTable)
      .groupBy(angsuranTable.pinjamanId)
      .as("latest");

    const result = await db
      .select({
        noPinjaman: pinjamanTable.noPinjaman,
        noAnggota: pinjamanTable.noAnggota,
        jenisPinjaman: pinjamanTable.jenisPinjman,
        angsuranKe: angsuranTable.angsuranPinjamanKe,
        angsuranDari: angsuranTable.angsuranPinjamanDari,
        jumlahAngsuran: angsuranTable.jumlahAngsuran,
      })
      .from(pinjamanTable)
      .innerJoin(
        angsuranTable,
        eq(pinjamanTable.noPinjaman, angsuranTable.pinjamanId)
      )
      .innerJoin(
        latestAngsuran,
        and(
          eq(angsuranTable.pinjamanId, latestAngsuran.noPinjaman),
          eq(angsuranTable.angsuranPinjamanKe, latestAngsuran.maxAngsuranKe)
        )
      )
      .where(
        and(
          eq(pinjamanTable.jenisPinjman, jenis),
          eq(pinjamanTable.statusPinjaman, "APPROVED")
        )
      );

    if (result.length > 0) {
      return result;
    } else {
      return null;
    }
  } catch (error) {
    console.error("error data pinjaman potong gaji : ", error);
    return null;
  }
};

export const getPotongGaji = unstable_cache(
  async () => {
    try {
      const [
        anggota,
        simpananLebaran,
        simpananQurban,
        simpananUbar,
        pinjamanProduktif,
        pinjamanBarang,
      ] = await Promise.all([
        getAnggotaPotonganGaji(),
        getSimpananBerjankaPotonganGaji("LEBARAN"),
        getSimpananBerjankaPotonganGaji("QURBAN"),
        getSimpananBerjankaPotonganGaji("UBAR"),
        getPinjamanPotonganGaji("PRODUKTIF"),
        getPinjamanPotonganGaji("BARANG"),
      ]);

      const hasilPotonganGaji = generatePotongGaji(
        anggota,
        simpananLebaran,
        simpananQurban,
        simpananUbar,
        pinjamanProduktif,
        pinjamanBarang
      );
      return { ok: true, data: hasilPotonganGaji as TPotongGaji[] };
    } catch (error) {
      console.error("error data potong gaji : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-potong-gaji"],
  {
    tags: ["get-potong-gaji"],
  }
);

export const getHistoryPotongGaji = unstable_cache(
  async () => {
    try {
      const result = await db
        .select({
          idPotongGaji: potongGajiTable.idPotongGaji,
          tanggalPotongGaji: potongGajiTable.tanggalPotongGaji,
          noAnggota: potongGajiTable.noAnggota,
          namaAnggota: anggotaTable.namaAnggota,
          namaUnitKerja: unitKerjaTable.namaUnitKerja,
          simpananWajib: potongGajiTable.simpananWajib,
          simpananSukamana: potongGajiTable.simpananSukamana,
          simpananLebaran: potongGajiTable.simpananLebaran,
          simpananQurban: potongGajiTable.simpananQurban,
          simpananUbar: potongGajiTable.simpananUbar,
          noPinjamanProduktif: potongGajiTable.noPinjamanProduktif,
          angsuranKeProduktif: potongGajiTable.angsuranKeProduktif,
          angsuranDariProduktif: potongGajiTable.angsuranDariProduktif,
          jumlahAngsuranProduktif: potongGajiTable.jumlahAngsuranProduktif,
          noPinjamanBarang: potongGajiTable.noPinjamanBarang,
          angsuranKeBarang: potongGajiTable.angsuranKeBarang,
          angsuranDariBarang: potongGajiTable.angsuranDariBarang,
          jumlahAngsuranBarang: potongGajiTable.jumlahAngsuranBarang,
          totalPotonganGaji: potongGajiTable.totalPotonganGaji,
        })
        .from(potongGajiTable)
        .innerJoin(
          anggotaTable,
          eq(potongGajiTable.noAnggota, anggotaTable.noAnggota)
        )
        .innerJoin(
          unitKerjaTable,
          eq(anggotaTable.unitKerjaId, unitKerjaTable.noUnitKerja)
        )
        .orderBy(
          desc(potongGajiTable.tanggalPotongGaji),
          asc(potongGajiTable.noAnggota)
        );

      if (result.length > 0) {
        return { ok: true, data: result as THistoryPotongGaji[] };
      } else {
        return { ok: true, data: [] as THistoryPotongGaji[] };
      }
    } catch (error) {
      console.error("error data potong gaji : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-history-potong-gaji"],
  {
    tags: ["get-history-potong-gaji"],
  }
);
