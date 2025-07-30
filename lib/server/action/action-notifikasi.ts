"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { notificationsTable } from "@/lib/db/schema";
import { chunkArray } from "@/lib/helper";
import {
  TNotifikasi,
  TPelunasanPinjamanNotifikasi,
  TPengambilanSimpananNotifikasi,
  TPinjamanNotifikasi,
  TUndurDiriNotifikasi,
} from "@/lib/types/notifikasi";
import {
  getNumberAll,
  getNumberById,
  getNumberByIdPinjaman,
  getNumberByIdSettingPendaftaran,
  getNumberNonUserRole,
} from "../data/data-anggota";
import {
  templateBulk,
  templatePelunasanPinjaman,
  templatePelunasanPinjamanPetugas,
  templatePembagianSimpanan,
  templatePengajuanPinjaman,
  templatePengajuanPinjamanPetugas,
  templatePengambilanSimpanan,
  templatePengambilanSimpananPetugas,
  templatePengumumamPendaftaranSimpanan,
  templatePengunduranDiri,
  templatePengunduranDiriPetugas,
} from "@/lib/template-notif";
import { TSettingSimpanan } from "@/lib/types/setting-simpanan";
import { LABEL, tagsNotifikasiRevalidate } from "@/lib/constan";
import { BulkNotifFormSchema } from "@/lib/schema/schema-notifikasi";
import { auth } from "@/lib/auth";
import { revalidateTag } from "next/cache";
import { JenisSimpananType } from "@/lib/types/helper";

export async function saveNotifications(notificationData: TNotifikasi[]) {
  if (!notificationData?.length) return;

  await db.transaction(async (tx) => {
    for (const chunk of chunkArray(notificationData, 100)) {
      await tx.insert(notificationsTable).values(chunk).onConflictDoNothing();
    }
  });
}

export const notifAnggotaAll = async (
  values: z.infer<typeof BulkNotifFormSchema>
) => {
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

    const validateValues = BulkNotifFormSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: "Invalid Field!" };
    }

    const { title, text } = validateValues.data;

    const numberAnggota = await getNumberAll();

    if (!numberAnggota?.length) {
      return { ok: false, message: "Kirim Notifikasi Anggota Gagal" };
    }

    const notificationData: TNotifikasi[] = (numberAnggota ?? []).map(
      (anggota) => ({
        noTelpNotification: anggota.noTelpAnggota,
        messageNotification: templateBulk({
          nama: anggota.namaAnggota,
          title: title,
          pesan: text,
        }),
      })
    );

    await saveNotifications(notificationData);

    const tagsToRevalidate = Array.from(new Set([...tagsNotifikasiRevalidate]));

    tagsToRevalidate.forEach((tag) => revalidateTag(tag));

    return { ok: true, message: "Kirim Notifikasi Anggota Berhasil" };
  } catch (error) {
    console.error("error kirim BulkNotif Wa : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};

interface INotifPengumumanSimpanan {
  data: TSettingSimpanan;
}

export async function notifPengumumanSimpanan({
  data,
}: INotifPengumumanSimpanan) {
  const numberAnggota = await getNumberAll();

  if (!numberAnggota?.length) return;

  const notificationData: TNotifikasi[] = (numberAnggota ?? []).map(
    (anggota) => ({
      noTelpNotification: anggota.noTelpAnggota,
      messageNotification: templatePengumumamPendaftaranSimpanan({
        nama: anggota.namaAnggota,
        namaPendaftaran: data.namaPendaftaran,
        jenisPendaftaranSimpanan: data.jenisPendaftaranSimpanan,
        tanggalAwalSimpanan: data.tanggalAwalSimpanan,
        tanggalAkhirSimpanan: data.tanggalAkhirSimpanan,
        tanggalTutupPendaftaran: data.tanggalTutupSimpanan,
        createdAt: data.createdAt,
      }),
    })
  );

  await saveNotifications(notificationData);
}

interface INotifPinjaman {
  data: TPinjamanNotifikasi;
}

export async function notifPinjaman({ data }: INotifPinjaman) {
  const [anggota, petugasList] = await Promise.all([
    getNumberById(data.noAnggota), // ini return satu orang, bukan array
    getNumberNonUserRole(),
  ]);

  if (!anggota || !anggota.noTelpAnggota) return;

  const notificationData: TNotifikasi[] = [];

  // === Notifikasi ke Anggota
  notificationData.push({
    noTelpNotification: anggota.noTelpAnggota,
    messageNotification: templatePengajuanPinjaman({
      nama: anggota.namaAnggota,
      namaUnitkerja: anggota.namaUnitKerja,
      noPinjaman: data.noPinjaman,
      tujuanPinjaman: data.tujuanPinjaman,
      tanggalPinjaman: data.tanggalPinjaman,
      waktuPengembalian: data.waktuPengembalian,
      jenisPinjman: data.jenisPinjman,
      ajuanPinjaman: data.ajuanPinjaman,
      statusPinjaman: data.statusPinjaman,
    }),
  });

  // === Notifikasi ke Petugas jika status PENDING
  if (data.statusPinjaman === "PENDING" && petugasList?.length) {
    const notifPetugas = petugasList.map((petugas) => ({
      noTelpNotification: petugas.noTelpAnggota,
      messageNotification: templatePengajuanPinjamanPetugas({
        namaPetugas: petugas.namaAnggota,
        role: petugas.role,
        nama: anggota.namaAnggota,
        namaUnitkerja: anggota.namaUnitKerja,
        noPinjaman: data.noPinjaman,
        tujuanPinjaman: data.tujuanPinjaman,
        tanggalPinjaman: data.tanggalPinjaman,
        waktuPengembalian: data.waktuPengembalian,
        jenisPinjman: data.jenisPinjman,
        ajuanPinjaman: data.ajuanPinjaman,
        statusPinjaman: data.statusPinjaman,
      }),
    }));

    notificationData.push(...notifPetugas);
  }

  await saveNotifications(notificationData);
}

interface INotifPelunasanPinjaman {
  data: TPelunasanPinjamanNotifikasi;
}

export async function notifPelunasanPinjaman({
  data,
}: INotifPelunasanPinjaman) {
  const [anggota, petugasList] = await Promise.all([
    getNumberByIdPinjaman(data.pinjamanId), // ini return satu orang, bukan array
    getNumberNonUserRole(),
  ]);

  if (!anggota || !anggota.noTelpAnggota) return;

  const notificationData: TNotifikasi[] = [];

  // === Notifikasi ke Anggota
  notificationData.push({
    noTelpNotification: anggota.noTelpAnggota,
    messageNotification: templatePelunasanPinjaman({
      nama: anggota.namaAnggota,
      namaUnitkerja: anggota.namaUnitKerja,
      pinjamanId: data.pinjamanId,
      jenisPelunasanPinjaman: data.jenisPelunasanPinjaman,
      buktiPelunasan: data.buktiPelunasan,
      angsuranKePelunasanPinjaman: data.angsuranKePelunasanPinjaman,
      sudahDibayarkan: data.sudahDibayarkan,
      jumlahPelunasanPinjaman: data.jumlahPelunasanPinjaman,
      noPelunasanPinjaman: data.noPelunasanPinjaman,
      tanggalPelunasanPinjaman: data.tanggalPelunasanPinjaman,
      statusPelunasanPinjaman: data.statusPelunasanPinjaman,
    }),
  });

  // === Notifikasi ke Petugas jika status PENDING
  if (data.statusPelunasanPinjaman === "PENDING" && petugasList?.length) {
    const notifPetugas = petugasList.map((petugas) => ({
      noTelpNotification: petugas.noTelpAnggota,
      messageNotification: templatePelunasanPinjamanPetugas({
        namaPetugas: petugas.namaAnggota,
        role: petugas.role,
        nama: anggota.namaAnggota,
        namaUnitkerja: anggota.namaUnitKerja,
        pinjamanId: data.pinjamanId,
        jenisPelunasanPinjaman: data.jenisPelunasanPinjaman,
        buktiPelunasan: data.buktiPelunasan,
        angsuranKePelunasanPinjaman: data.angsuranKePelunasanPinjaman,
        sudahDibayarkan: data.sudahDibayarkan,
        jumlahPelunasanPinjaman: data.jumlahPelunasanPinjaman,
        noPelunasanPinjaman: data.noPelunasanPinjaman,
        tanggalPelunasanPinjaman: data.tanggalPelunasanPinjaman,
        statusPelunasanPinjaman: data.statusPelunasanPinjaman,
      }),
    }));

    notificationData.push(...notifPetugas);
  }

  await saveNotifications(notificationData);
}

interface INotifPengambilanSimpanan {
  data: TPengambilanSimpananNotifikasi;
}

export async function notifPengambilanSimpanan({
  data,
}: INotifPengambilanSimpanan) {
  const [anggota, petugasList] = await Promise.all([
    getNumberById(data.noAnggota), // ini return satu orang, bukan array
    getNumberNonUserRole(),
  ]);

  if (!anggota || !anggota.noTelpAnggota) return;

  const notificationData: TNotifikasi[] = [];

  // === Notifikasi ke Anggota
  notificationData.push({
    noTelpNotification: anggota.noTelpAnggota,
    messageNotification: templatePengambilanSimpanan({
      nama: anggota.namaAnggota,
      namaUnitkerja: anggota.namaUnitKerja,
      noPengambilanSimpanan: data.noPengambilanSimpanan,
      tanggalPengambilanSimpanan: data.tanggalPengambilanSimpanan,
      jenisPengambilanSimpanan: data.jenisPengambilanSimpanan,
      jumlahPengambilanSimpanan: data.jumlahPengambilanSimpanan,
      statusPengambilanSimpanan: data.statusPengambilanSimpanan,
    }),
  });

  // === Notifikasi ke Petugas jika status PENDING
  if (data.statusPengambilanSimpanan === "PENDING" && petugasList?.length) {
    const notifPetugas = petugasList.map((petugas) => ({
      noTelpNotification: petugas.noTelpAnggota,
      messageNotification: templatePengambilanSimpananPetugas({
        namaPetugas: petugas.namaAnggota,
        role: petugas.role,
        nama: anggota.namaAnggota,
        namaUnitkerja: anggota.namaUnitKerja,
        noPengambilanSimpanan: data.noPengambilanSimpanan,
        tanggalPengambilanSimpanan: data.tanggalPengambilanSimpanan,
        jenisPengambilanSimpanan: data.jenisPengambilanSimpanan,
        jumlahPengambilanSimpanan: data.jumlahPengambilanSimpanan,
        statusPengambilanSimpanan: data.statusPengambilanSimpanan,
      }),
    }));

    notificationData.push(...notifPetugas);
  }

  await saveNotifications(notificationData);
}

interface INotifPengunduran {
  data: TUndurDiriNotifikasi;
}

export async function notifPengunduran({ data }: INotifPengunduran) {
  const [anggota, petugasList] = await Promise.all([
    getNumberById(data.noAnggota),
    getNumberNonUserRole(),
  ]);

  if (!anggota || !anggota.noTelpAnggota) return;

  const notificationData: TNotifikasi[] = [];

  // === Notifikasi ke Anggota
  notificationData.push({
    noTelpNotification: anggota.noTelpAnggota,
    messageNotification: templatePengunduranDiri({
      nama: anggota.namaAnggota,
      namaUnitkerja: anggota.namaUnitKerja,
      keterangan: data.keterangan,
      noPengunduranDiri: data.noPengunduranDiri,
      tanggalPengunduranDiri: data.tanggalPengunduranDiri,
      jumlahSimpananBersih: data.jumlahSimpananBersih,
      jumlahSimpananDiterima: data.jumlahSimpananDiterima,
      statusPengunduranDiri: data.statusPengunduranDiri,
    }),
  });

  // === Notifikasi ke Petugas jika status PENDING
  if (data.statusPengunduranDiri === "PENDING" && petugasList?.length) {
    const notifPetugas = petugasList.map((petugas) => ({
      noTelpNotification: petugas.noTelpAnggota,
      messageNotification: templatePengunduranDiriPetugas({
        namaPetugas: petugas.namaAnggota,
        role: petugas.role,
        nama: anggota.namaAnggota,
        namaUnitkerja: anggota.namaUnitKerja,
        keterangan: data.keterangan,
        noPengunduranDiri: data.noPengunduranDiri,
        tanggalPengunduranDiri: data.tanggalPengunduranDiri,
        jumlahSimpananBersih: data.jumlahSimpananBersih,
        jumlahSimpananDiterima: data.jumlahSimpananDiterima,
        statusPengunduranDiri: data.statusPengunduranDiri,
      }),
    }));

    notificationData.push(...notifPetugas);
  }

  await saveNotifications(notificationData);
}

export interface INotifPembagianSimpanan {
  idSettingPendaftaran: string;
  namaPendaftaran: string;
  jenisPengambilanSimpanan: JenisSimpananType;
}

export async function notifPembagianSimpanan({
  idSettingPendaftaran,
  namaPendaftaran,
  jenisPengambilanSimpanan,
}: INotifPembagianSimpanan) {
  const numberAnggota = await getNumberByIdSettingPendaftaran(
    idSettingPendaftaran
  );

  if (!numberAnggota?.length) return;

  const notificationData: TNotifikasi[] = (numberAnggota ?? []).map(
    (anggota) => ({
      noTelpNotification: anggota.noTelpAnggota,
      messageNotification: templatePembagianSimpanan({
        nama: anggota.namaAnggota,
        namaUnitkerja: anggota.namaUnitKerja,
        namaPendaftaran: namaPendaftaran,
        jenisPengambilanSimpanan: jenisPengambilanSimpanan,
      }),
    })
  );

  await saveNotifications(notificationData);
}
