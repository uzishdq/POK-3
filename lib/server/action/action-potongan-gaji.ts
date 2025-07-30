"use server";

import {
  chunkArray,
  formatFieldValidation,
  generateIdAngsuran,
  generateIdSimpanan,
  parseExcelRow,
  setPotonganGaji,
} from "@/lib/helper";
import {
  InputPotongGajiSchema,
  RowsValidationSchema,
  RowValidationSchema,
} from "@/lib/schema/schema-potong-gaji";
import { JenisSimpananType } from "@/lib/types/helper";
import {
  TInputSimpanan,
  TPotongGaji,
  typeTInputAngsuran,
} from "@/lib/types/potong-gaji";
import { z } from "zod";
import { getLastIdSimpanan } from "../data/data-simpanan";
import {
  angsuranTable,
  notificationsTable,
  pinjamanTable,
  potongGajiTable,
  simpananTable,
} from "@/lib/db/schema";
import { db } from "@/lib/db";
import {
  cekPelunasanPotongGaji,
  getLastIdAngsuran,
} from "../data/data-pinjaman";
import { getNumberAll } from "../data/data-anggota";
import { TNotifikasi } from "@/lib/types/notifikasi";
import {
  templatePotonganGajiAngsuran,
  templatePotonganGajiSimpanan,
} from "@/lib/template-notif";
import { eq, inArray } from "drizzle-orm";
import {
  LABEL,
  tagsNotifikasiRevalidate,
  tagsPengambilanSimpananRevalidate,
  tagsPinjamanRevalidate,
  tagsPotonganRevalidate,
  tagsSimpananRevalidate,
} from "@/lib/constan";
import { auth } from "@/lib/auth";
import { revalidateTag } from "next/cache";

export async function insertPotongan(
  values: z.infer<typeof RowsValidationSchema>
) {
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

    const validateValues = RowsValidationSchema.safeParse(values);
    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    const rows = validateValues.data;

    const [simpananId, angsuranId, numberAnggota] = await Promise.all([
      getLastIdSimpanan(),
      getLastIdAngsuran(),
      getNumberAll(),
    ]);

    const simpananData: TInputSimpanan[] = [];
    const angsuranData: typeTInputAngsuran[] = [];
    const historyPotongan = setPotonganGaji(rows);
    let angsuranCompletedData: typeTInputAngsuran[] = [];
    const pinjamanToNoAnggota = new Map<string, string>();

    // ===== SET SIMPANAN & PINJAMAN =====
    for (const row of rows) {
      const simpananTypes = [
        { key: "simpananWajib", jenis: "WAJIB" },
        { key: "simpananSukamana", jenis: "SUKAMANA" },
        { key: "simpananLebaran", jenis: "LEBARAN" },
        { key: "simpananQurban", jenis: "QURBAN" },
        { key: "simpananUbar", jenis: "UBAR" },
      ];

      for (const simpanan of simpananTypes) {
        const amount = row[simpanan.key as keyof typeof row] as number;
        if (amount > 0) {
          const id = simpananId[simpanan.jenis]?.id || null;
          const jenis = simpanan.jenis as JenisSimpananType;

          simpananData.push({
            noSimpanan: generateIdSimpanan(id, jenis),
            noAnggota: row.noAnggota,
            jenisSimpanan: jenis,
            jumlahSimpanan: amount.toString(),
          });
        }
      }

      if (row.jumlahAngsuranProduktif > 0) {
        const isOnProgress =
          row.angsuranKeProduktif < row.angsuranDariProduktif;
        const targetList = isOnProgress ? angsuranData : angsuranCompletedData;
        pinjamanToNoAnggota.set(row.pinjamanProduktif, row.noAnggota);

        targetList.push({
          noAngsuran: generateIdAngsuran(angsuranId),
          pinjamanId: row.pinjamanProduktif,
          jenisPinjaman: "PRODUKTIF",
          angsuranPinjamanKe: row.angsuranKeProduktif,
          angsuranPinjamanDari: row.angsuranDariProduktif,
          jumlahAngsuran: row.jumlahAngsuranProduktif.toString(),
          statusAngsuran: isOnProgress ? "ONPROGRESS" : "COMPLETED",
        });
      }

      if (row.jumlahAngsuranBarang > 0) {
        const isOnProgress = row.angsuranKeBarang < row.angsuranDariBarang;
        const targetList = isOnProgress ? angsuranData : angsuranCompletedData;
        pinjamanToNoAnggota.set(row.pinjamanBarang, row.noAnggota);

        targetList.push({
          noAngsuran: generateIdAngsuran(angsuranId),
          pinjamanId: row.pinjamanBarang,
          jenisPinjaman: "BARANG",
          angsuranPinjamanKe: row.angsuranKeBarang,
          angsuranPinjamanDari: row.angsuranDariBarang,
          jumlahAngsuran: row.jumlahAngsuranBarang.toString(),
          statusAngsuran: isOnProgress ? "ONPROGRESS" : "COMPLETED",
        });
      }
    }

    // ===== CEK LUNAS untuk angsuranCompletedData =====
    // pindahkan yg belum lunas ke angsuranData dan filter completed yg sudah benar
    const stillCompleted: typeTInputAngsuran[] = [];
    for (const angsuran of angsuranCompletedData) {
      const pinjamanId = angsuran.pinjamanId;

      const cekPelunasan = await cekPelunasanPotongGaji(pinjamanId);

      if (!cekPelunasan.isCompleted) {
        angsuran.statusAngsuran = "ONPROGRESS";
        angsuranData.push(angsuran);
      } else {
        stillCompleted.push(angsuran);
      }
    }
    angsuranCompletedData = stillCompleted;

    const simpananMap = new Map<string, TInputSimpanan[]>();
    for (const s of simpananData) {
      if (!simpananMap.has(s.noAnggota)) simpananMap.set(s.noAnggota, []);
      simpananMap.get(s.noAnggota)!.push(s);
    }

    const allAngsuran = [...angsuranData, ...angsuranCompletedData];
    const angsuranMap = new Map<string, typeTInputAngsuran[]>();
    for (const a of allAngsuran) {
      const noAnggota = pinjamanToNoAnggota.get(a.pinjamanId);
      if (!noAnggota) continue;
      if (!angsuranMap.has(noAnggota)) angsuranMap.set(noAnggota, []);
      angsuranMap.get(noAnggota)!.push(a);
    }

    // ===== SET NOTIFIKASI =====
    const notificationData: TNotifikasi[] = [];
    if (numberAnggota) {
      for (const anggota of numberAnggota) {
        const simpananList = simpananMap.get(anggota.noAnggota) || [];
        const angsuranList = angsuranMap.get(anggota.noAnggota) || [];

        const messages: string[] = [];

        if (simpananList.length > 0) {
          messages.push(
            templatePotonganGajiSimpanan({
              nama: anggota.namaAnggota,
              namaUnitkerja: anggota.namaUnitKerja,
              simpanan: simpananList,
            })
          );
        }

        if (angsuranList.length > 0) {
          messages.push(
            templatePotonganGajiAngsuran({
              nama: anggota.namaAnggota,
              namaUnitkerja: anggota.namaUnitKerja,
              angsuran: angsuranList,
            })
          );
        }

        if (messages.length > 0) {
          notificationData.push({
            noTelpNotification: anggota.noTelpAnggota,
            messageNotification: messages.join("\n\n"),
          });
        }
      }
    }

    // ===== BATCH INSERT TRANSAKSI =====
    await db.transaction(async (tx) => {
      for (const chunk of chunkArray(historyPotongan, 100)) {
        await tx.insert(potongGajiTable).values(chunk).onConflictDoNothing();
      }

      if (simpananData.length > 0) {
        for (const chunk of chunkArray(simpananData, 100)) {
          await tx.insert(simpananTable).values(chunk).onConflictDoNothing();
        }
      }

      if (angsuranData.length > 0) {
        for (const chunk of chunkArray(angsuranData, 100)) {
          await tx.insert(angsuranTable).values(chunk).onConflictDoNothing();
        }
      }

      if (angsuranCompletedData.length > 0) {
        for (const chunk of chunkArray(angsuranCompletedData, 100)) {
          await tx.insert(angsuranTable).values(chunk).onConflictDoNothing();

          const completedPinjamanIds = Array.from(
            new Set(chunk.map((a) => a.pinjamanId))
          );

          await tx
            .update(pinjamanTable)
            .set({ statusPinjaman: "COMPLETED" })
            .where(inArray(pinjamanTable.noPinjaman, completedPinjamanIds));
        }
      }

      if (notificationData.length > 0) {
        for (const chunk of chunkArray(notificationData, 100)) {
          await tx
            .insert(notificationsTable)
            .values(chunk)
            .onConflictDoNothing();
        }
      }
    });

    const tagsToRevalidate = Array.from(
      new Set([
        ...tagsPinjamanRevalidate,
        ...tagsSimpananRevalidate,
        ...tagsPotonganRevalidate,
        ...tagsNotifikasiRevalidate,
        ...tagsPengambilanSimpananRevalidate,
      ])
    );

    tagsToRevalidate.forEach((tag) => revalidateTag(tag));

    return { ok: true, message: LABEL.INPUT.SUCCESS.SAVED };
  } catch (error) {
    console.error("error insert potongan gaji : ", error);
    return { ok: false, message: LABEL.ERROR.SERVER };
  }
}
