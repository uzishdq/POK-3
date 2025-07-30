"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import {
  PengajuanPinjamanSchema,
  UpdateStatusPinjamanSchema,
} from "@/lib/schema/schema-pinjaman";
import {
  calculateAsuransi,
  calculateLoanInstallment,
  countReceive,
  formatToIDR,
  generateIdAngsuran,
  generateIdAsuransi,
  generateIdPinjaman,
  predictLoanBasedOnSalary,
} from "@/lib/helper";
import { ICalculateAsuransi } from "@/lib/types/pinjaman";
import { getTanggalLahirById } from "../data/data-anggota";
import {
  getLastIdAngsuran,
  getLastIdPinjaman,
  getLastPinjamanById,
} from "../data/data-pinjaman";
import { uploadImage } from "./action-upload-image";
import { getLastIdAsuransi } from "../data/data-asuransi";
import { angsuranTable, asuransiTable, pinjamanTable } from "@/lib/db/schema";
import { revalidateTag } from "next/cache";
import {
  LABEL,
  tagsNotifikasiRevalidate,
  tagsPinjamanRevalidate,
  tagsPotonganRevalidate,
} from "@/lib/constan";
import { notifPinjaman } from "./action-notifikasi";

export const validasiPinjaman = async (limit: number, values: unknown) => {
  try {
    const schema = PengajuanPinjamanSchema(limit);
    const validateValues = schema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD, data: null };
    }

    const {
      ajuanPinjaman,
      jumlahPenghasilan,
      waktuPengembalian,
      noAnggota,
      jenisPinjaman,
    } = validateValues.data;

    const angsuran = calculateLoanInstallment(
      jumlahPenghasilan,
      ajuanPinjaman,
      waktuPengembalian
    );

    if (!angsuran.isEligible) {
      const prediksi = predictLoanBasedOnSalary(
        jumlahPenghasilan,
        ajuanPinjaman
      );

      const monthlyLimit = prediksi.monthlyInstallment;

      if (prediksi.maxLoanAmount > 0) {
        return {
          ok: false,
          message: `Maaf, pengajuan pinjaman belum memenuhi persyaratan. 
      Rekomendasi: Ajukan pinjaman sebesar ${formatToIDR(
        prediksi.maxLoanAmount
      )} 
      dengan waktu pengembalian ${prediksi.maxRepaymentTime} bulan.
      Batas maksimal angsuran bulanan: ${formatToIDR(monthlyLimit)}.`,
          data: null,
        };
      }

      return {
        ok: false,
        message: `Maaf, pengajuan pinjaman belum memenuhi persyaratan. 
    Batas maksimal angsuran per bulan adalah 35% dari gaji Anda, yaitu ${formatToIDR(
      monthlyLimit
    )}.`,
        data: null,
      };
    } else {
      const [tanggalLahir, lastPinjaman] = await Promise.all([
        getTanggalLahirById(noAnggota),
        getLastPinjamanById(noAnggota, jenisPinjaman, "APPROVED"),
      ]);

      if (tanggalLahir.data === null) {
        return {
          ok: false,
          message:
            "Tanggal lahir tidak valid. Silakan perbarui di profil Anda.",
          data: null,
        };
      }

      if (!lastPinjaman.ok) {
        return {
          ok: false,
          message: lastPinjaman.message,
          data: null,
        };
      }

      const pelunasanValue =
        lastPinjaman.status === "SUDAH_LUNAS_SEBAGIAN" && lastPinjaman.data
          ? lastPinjaman.data.pelunasan
          : 0;

      if (jenisPinjaman === "BARANG") {
        return {
          ok: true,
          message: "Validasi pinjaman berhasil.",
          data: {
            totalPremi: 0,
            admin: angsuran.admin,
            pelunasan: pelunasanValue,
            monthlyInstallment: angsuran.monthlyInstallment,
            receive: countReceive(
              ajuanPinjaman,
              angsuran.admin,
              0,
              pelunasanValue
            ),
          },
        };
      }

      const asuransi = calculateAsuransi(
        tanggalLahir.data,
        waktuPengembalian,
        ajuanPinjaman
      );

      if (!asuransi.status) {
        return { ok: false, message: asuransi.message, data: null };
      }

      const dataAsuransi: ICalculateAsuransi = {
        totalPremi: asuransi.totalPremi,
        admin: angsuran.admin,
        pelunasan: pelunasanValue,
        monthlyInstallment: angsuran.monthlyInstallment,
        receive: countReceive(
          ajuanPinjaman,
          angsuran.admin,
          asuransi.totalPremi,
          pelunasanValue
        ),
      };

      return {
        ok: true,
        message: "Validasi pinjaman berhasil.",
        data: dataAsuransi as ICalculateAsuransi,
      };
    }
  } catch (error) {
    console.error("error validasi pinjaman : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
      data: null,
    };
  }
};

export const insertPinjaman = async (limit: number, values: unknown) => {
  try {
    const session = await auth();

    if (!session?.user.noAnggota || !session?.user.role) {
      return {
        ok: false,
        message: LABEL.ERROR.NOT_LOGIN,
      };
    }

    const schema = PengajuanPinjamanSchema(limit);
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    const {
      tujuanPinjaman,
      noAnggota,
      waktuPengembalian,
      jenisPinjaman,
      ajuanPinjaman,
      jumlahPenghasilan,
      strukGaji,
    } = parsed.data;

    if (noAnggota !== session.user.noAnggota) {
      return {
        ok: false,
        message: LABEL.ERROR.NOT_ID_USER,
      };
    }

    const angsuran = calculateLoanInstallment(
      jumlahPenghasilan,
      ajuanPinjaman,
      waktuPengembalian
    );

    if (!angsuran.isEligible) {
      return {
        ok: false,
        message: "Pengajuan pinjaman belum memenuhi syarat!",
      };
    }

    const [
      tanggalLahir,
      lastPinjaman,
      lastIdPinjaman,
      lastIdAngsuran,
      lastIdAsuransi,
    ] = await Promise.all([
      getTanggalLahirById(noAnggota),
      getLastPinjamanById(noAnggota, jenisPinjaman, "APPROVED"),
      getLastIdPinjaman(jenisPinjaman),
      getLastIdAngsuran(),
      getLastIdAsuransi(),
    ]);

    if (!tanggalLahir.data) {
      return {
        ok: false,
        message: "Tanggal lahir tidak valid. Silakan perbarui di profil Anda.",
      };
    }

    if (!lastPinjaman.ok) {
      return { ok: false, message: lastPinjaman.message };
    }

    const pelunasanValue =
      lastPinjaman.status === "SUDAH_LUNAS_SEBAGIAN" && lastPinjaman.data
        ? lastPinjaman.data.pelunasan
        : 0;

    const pinjamanId = generateIdPinjaman(lastIdPinjaman, jenisPinjaman);
    const angsuranId = generateIdAngsuran(lastIdAngsuran);

    const newUUID = uuidv4();
    const nameStruk = `${noAnggota}/${newUUID}-struk-gaji.jpg`;

    const struk = await uploadImage(strukGaji, nameStruk, "struk-gaji");

    if (!struk.imageUrl) {
      return { ok: false, message: "Gagal upload struk gaji" };
    }

    let premi = 0;
    let asuransiData = null;

    if (jenisPinjaman === "PRODUKTIF") {
      const asuransi = calculateAsuransi(
        tanggalLahir.data,
        waktuPengembalian,
        ajuanPinjaman
      );

      if (!asuransi.status) {
        return { ok: false, message: asuransi.message };
      }

      premi = asuransi.totalPremi;

      asuransiData = {
        noAsuransi: generateIdAsuransi(lastIdAsuransi),
        pinjamanId,
        usiaAsuransi: asuransi.umur,
        tanggalAkhirAsuransi: asuransi.tglSelesaiAsuransi!,
        masaAsuransiTH: asuransi.tenor,
        masaAsuransiBL: 0,
        masaAsuransiJK: asuransi.tenor,
        premi,
      };
    }

    const dataPinjaman = {
      noPinjaman: pinjamanId,
      tujuanPinjaman,
      noAnggota,
      waktuPengembalian,
      jenisPinjman: jenisPinjaman,
      ajuanPinjaman: ajuanPinjaman.toString(),
      jumlahDiterima: countReceive(
        ajuanPinjaman,
        angsuran.admin,
        premi,
        pelunasanValue
      ).toString(),
      strukGaji: struk.imageUrl,
      jumlahPenghasilan: jumlahPenghasilan.toString(),
    };

    const dataAngsuran = {
      noAngsuran: angsuranId,
      pinjamanId,
      angsuranPinjamanKe: 0,
      angsuranPinjamanDari: waktuPengembalian,
      jumlahAngsuran: angsuran.monthlyInstallment.toString(),
    };

    const result = await db.transaction(async (tx) => {
      const [insertPinjaman] = await tx
        .insert(pinjamanTable)
        .values(dataPinjaman)
        .returning();

      if (!insertPinjaman) {
        return null;
      }

      await tx.insert(angsuranTable).values(dataAngsuran);

      if (asuransiData) {
        await tx.insert(asuransiTable).values(asuransiData);
      }

      await notifPinjaman({ data: insertPinjaman });

      return insertPinjaman;
    });

    if (!result) {
      return {
        ok: false,
        message: "Pengajuan pinjaman gagal.",
      };
    }

    const tagsToRevalidate = Array.from(
      new Set([...tagsPinjamanRevalidate, ...tagsNotifikasiRevalidate])
    );

    tagsToRevalidate.forEach((tag) => revalidateTag(tag));

    return {
      ok: true,
      message: "Pengajuan pinjaman berhasil.",
    };
  } catch (error) {
    console.error("Error insert pinjaman:", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};

export const updateStatusPinjaman = async (values: unknown) => {
  try {
    const session = await auth();

    if (!session?.user.noAnggota || !session?.user.role) {
      return {
        ok: false,
        message: LABEL.ERROR.NOT_LOGIN,
      };
    }

    if (session.user.role === "USER") {
      return {
        ok: false,
        message: LABEL.ERROR.UNAUTHORIZED,
      };
    }

    const validateValues = UpdateStatusPinjamanSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    const { pinjamanId, noAnggota, jenisPinjaman, action } =
      validateValues.data;

    if (action === "APPROVED") {
      const lastPinjaman = await getLastPinjamanById(
        noAnggota,
        jenisPinjaman,
        "APPROVED"
      );

      // berikan notif kalau pinjaman sudah selesai
      if (lastPinjaman.data && lastPinjaman.status === "SUDAH_LUNAS_SEBAGIAN") {
        const lastIdAngsuran = await getLastIdAngsuran();

        const { pinjamanId, angsuranKe, angsuranDari, pelunasan } =
          lastPinjaman.data;

        await db.transaction(async (tx) => {
          await tx
            .update(pinjamanTable)
            .set({ statusPinjaman: "COMPLETED" })
            .where(eq(pinjamanTable.noPinjaman, pinjamanId));

          await tx.insert(angsuranTable).values({
            noAngsuran: generateIdAngsuran(lastIdAngsuran),
            pinjamanId: pinjamanId,
            angsuranPinjamanKe: angsuranKe + 1,
            angsuranPinjamanDari: angsuranDari,
            jumlahAngsuran: pelunasan.toString(),
            statusAngsuran: "COMPLETED",
          });

          await tx
            .update(angsuranTable)
            .set({ statusAngsuran: "COMPLETED" })
            .where(eq(angsuranTable.pinjamanId, pinjamanId));
        });
      }
    }

    const [result] = await db
      .update(pinjamanTable)
      .set({ statusPinjaman: action })
      .where(eq(pinjamanTable.noPinjaman, pinjamanId))
      .returning();

    if (result) {
      await notifPinjaman({ data: result });

      const tagsToRevalidate = Array.from(
        new Set([
          ...tagsPinjamanRevalidate,
          ...tagsPotonganRevalidate,
          ...tagsNotifikasiRevalidate,
        ])
      );

      tagsToRevalidate.forEach((tag) => revalidateTag(tag));

      return { ok: true, message: "update pinjaman berhasil" };
    } else {
      return {
        ok: false,
        message: "update pinjaman gagal",
      };
    }
  } catch (error) {
    console.error("error update status pinjaman : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};
