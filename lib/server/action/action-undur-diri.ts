"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { eq, inArray } from "drizzle-orm";
import { auth } from "@/lib/auth";
import {
  UndurDiriUpdateOrDeleteSchema,
  ValidasiUndurDiriSchema,
} from "@/lib/schema/schema-anggota";
import {
  JENIS_SIMPANAN,
  LABEL,
  tagsAnggotaRevalidate,
  tagsNotifikasiRevalidate,
  tagsPengambilanSimpananRevalidate,
  tagsPengunduranDiriRevalidate,
  tagsPinjamanRevalidate,
  tagsPotonganRevalidate,
  tagsSimpananRevalidate,
} from "@/lib/constan";
import { getLastIdAngsuran, getLastPinjamanById } from "../data/data-pinjaman";
import {
  getAllSimpananById,
  getLastIdPengambilanSimpanan,
} from "../data/data-simpanan";
import { revalidateTag } from "next/cache";
import {
  calculateUndurDiri,
  chunkArray,
  generateIdAngsuran,
  generateIdPengambilanSimpanan,
  generateIdUndurDiri,
} from "@/lib/helper";
import {
  getLastIdUndurDiri,
  getPinjamanPengunduranDiri,
  getSimpananPengunduranDiri,
} from "../data/data-undur-diri";
import {
  anggotaTable,
  angsuranTable,
  pengambilanSimpananTable,
  pengunduranDiriTable,
  pinjamanPengunduranDiriTable,
  pinjamanTable,
  simpananPengunduranDiriTable,
  userTable,
} from "@/lib/db/schema";
import {
  TCalculateUndurDiri,
  TInputPinjamanUndurDiri,
  TInputSimpananUndurDiri,
} from "@/lib/types/undur-diri";
import { TInputPengambilanSimpanan } from "@/lib/types/simpanan";
import { JenisPinjamanType, JenisSimpananType } from "@/lib/types/helper";
import { typeTInputAngsuran } from "@/lib/types/potong-gaji";
import { notifPengunduran } from "./action-notifikasi";

export const validasiUndurDiri = async (
  values: z.infer<typeof ValidasiUndurDiriSchema>
) => {
  try {
    const session = await auth();

    if (!session?.user.noAnggota) {
      return {
        ok: false,
        message: LABEL.ERROR.NOT_LOGIN,
        data: null,
      };
    }

    const validateValues = ValidasiUndurDiriSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: "Invalid field!", data: null };
    }

    const tagsToRevalidate = Array.from(
      new Set([
        ...tagsSimpananRevalidate,
        ...tagsPengambilanSimpananRevalidate,
        ...tagsPinjamanRevalidate,
      ])
    );

    tagsToRevalidate.forEach((tag) => revalidateTag(tag));

    const [produktif, barang, simpanan] = await Promise.all([
      getLastPinjamanById(session.user.noAnggota, "PRODUKTIF", "APPROVED"),
      getLastPinjamanById(session.user.noAnggota, "BARANG", "APPROVED"),
      getAllSimpananById(session.user.noAnggota),
    ]);

    if (!simpanan.data) {
      return { ok: false, message: LABEL.ERROR.SERVER, data: null };
    }

    if (produktif.status === "ERROR" || barang.status === "ERROR") {
      return { ok: false, message: LABEL.ERROR.SERVER, data: null };
    }

    if (produktif.status === "PENDING") {
      return {
        ok: false,
        message: `validasi pengunduran diri gagal, ${produktif.message}`,
        data: null,
      };
    }

    if (barang.status === "PENDING") {
      return {
        ok: false,
        message: `validasi pengunduran diri gagal, ${produktif.message}`,
        data: null,
      };
    }

    const result = calculateUndurDiri(simpanan.data, produktif, barang);

    return {
      ok: true,
      message: "validasi pengunduran diri berhasil",
      data: result as TCalculateUndurDiri,
    };
  } catch (error) {
    console.error("error validasi pengunduran diri : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
      data: null,
    };
  }
};

export const insertUndurDiri = async (
  values: z.infer<typeof ValidasiUndurDiriSchema>
) => {
  try {
    const session = await auth();

    const noAnggota = session?.user.noAnggota;

    if (!noAnggota) {
      return {
        ok: false,
        message: LABEL.ERROR.NOT_LOGIN,
      };
    }

    const validateValues = ValidasiUndurDiriSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: "Invalid field!" };
    }

    const isValid = await validasiUndurDiri(values);

    if (!isValid.ok || !isValid.data) {
      return { ok: isValid.ok, message: isValid.message };
    }

    const id = await getLastIdUndurDiri();
    const noUndurDiri = generateIdUndurDiri(id);

    const simpananData: TInputSimpananUndurDiri[] = JENIS_SIMPANAN.map(
      (jenis) => {
        const key = jenis.toLowerCase() as keyof TCalculateUndurDiri;
        const jumlah = isValid.data[key];

        if (typeof jumlah === "number" && jumlah > 0) {
          return {
            noPengunduranDiri: noUndurDiri,
            jenisSimpananPengunduran: jenis,
            jumlahSimpananPengunduran: jumlah.toString(),
          };
        }

        return null;
      }
    ).filter((item): item is TInputSimpananUndurDiri => item !== null);

    const pinjamanData: TInputPinjamanUndurDiri[] = [
      isValid.data.pinjamanProduktif && {
        noPengunduranDiri: noUndurDiri,
        pinjamanId: isValid.data.pinjamanProduktif.pinjamanId,
        jenisPinjaman: "PRODUKTIF",
        angsuranKe: isValid.data.pinjamanProduktif.angsuranKe,
        angsuranDari: isValid.data.pinjamanProduktif.angsuranDari,
        jumlahSudahBayar: isValid.data.pinjamanProduktif.totalBayar.toString(),
        jumlahPelunasan: isValid.data.pinjamanProduktif.pelunasan.toString(),
      },
      isValid.data.pinjamanBarang && {
        noPengunduranDiri: noUndurDiri,
        pinjamanId: isValid.data.pinjamanBarang.pinjamanId,
        jenisPinjaman: "BARANG",
        angsuranKe: isValid.data.pinjamanBarang.angsuranKe,
        angsuranDari: isValid.data.pinjamanBarang.angsuranDari,
        jumlahSudahBayar: isValid.data.pinjamanBarang.totalBayar.toString(),
        jumlahPelunasan: isValid.data.pinjamanBarang.pelunasan.toString(),
      },
    ].filter(Boolean) as TInputPinjamanUndurDiri[];

    const result = await db.transaction(async (tx) => {
      const [pengunduran] = await tx
        .insert(pengunduranDiriTable)
        .values({
          noPengunduranDiri: noUndurDiri,
          noAnggota: noAnggota,
          keterangan: validateValues.data.keterangan,
          jumlahSimpananBersih: isValid.data.totalKotor.toString(),
          jumlahSimpananDiterima: isValid.data.totalBersih.toString(),
        })
        .returning();

      await tx.insert(simpananPengunduranDiriTable).values(simpananData);

      if (pinjamanData.length > 0) {
        await tx.insert(pinjamanPengunduranDiriTable).values(pinjamanData);
      }

      return pengunduran;
    });

    // buat notifikasi

    if (!result) {
      return {
        ok: false,
        message: "Pengunduran diri Anda gagal diajukan",
      };
    } else {
      await notifPengunduran({ data: result });

      const tagsToRevalidate = Array.from(
        new Set([...tagsNotifikasiRevalidate, ...tagsPengunduranDiriRevalidate])
      );

      tagsToRevalidate.forEach((tag) => revalidateTag(tag));

      return {
        ok: true,
        message: "Pengunduran diri Anda telah berhasil diajukan",
      };
    }
  } catch (error) {
    console.error("error insert pengunduran diri : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};

export const updateStatusPengunduran = async (values: unknown) => {
  try {
    const session = await auth();

    if (!session?.user.noAnggota || !session?.user.role) {
      return { ok: false, message: LABEL.ERROR.NOT_LOGIN };
    }

    if (session.user.role === "USER") {
      return { ok: false, message: LABEL.ERROR.UNAUTHORIZED };
    }

    const parsed = UndurDiriUpdateOrDeleteSchema.safeParse(values);
    if (!parsed.success) {
      return { ok: false, message: "Invalid field!" };
    }

    const { noPengunduran, action } = parsed.data;

    const pengambilanSimpananData: TInputPengambilanSimpanan[] = [];
    const angsuranData: typeTInputAngsuran[] = [];
    const completedPinjamanIds: string[] = [];

    if (action === "APPROVED") {
      const [lastSimpananId, lastAngsuranId, simpananList, pinjamanList] =
        await Promise.all([
          getLastIdPengambilanSimpanan(),
          getLastIdAngsuran(),
          getSimpananPengunduranDiri(noPengunduran),
          getPinjamanPengunduranDiri(noPengunduran),
        ]);

      // PROSES SIMPANAN
      if (simpananList.data) {
        simpananList.data.forEach((item) => {
          const jenis = item.jenisSimpananPengunduran as JenisSimpananType;
          const lastId = lastSimpananId[jenis]?.id || null;

          pengambilanSimpananData.push({
            noPengambilanSimpanan: generateIdPengambilanSimpanan(lastId, jenis),
            noAnggota: item.noAnggota,
            tanggalPengambilanSimpanan: item.tanggalSimpananPengunduranDiri,
            jenisPengambilanSimpanan: jenis,
            jumlahPengambilanSimpanan: item.jumlahSimpananPengunduran,
            statusPengambilanSimpanan: "APPROVED",
          });
        });
      }

      // PROSES PINJAMAN
      if (pinjamanList.data) {
        pinjamanList.data.forEach((item) => {
          const jenis = item.jenisPinjmanPengunduranDiri as JenisPinjamanType;

          angsuranData.push({
            noAngsuran: generateIdAngsuran(lastAngsuranId),
            pinjamanId: item.pinjamanId,
            jenisPinjaman: jenis,
            angsuranPinjamanKe: item.angsuranKe + 1,
            angsuranPinjamanDari: item.angsuranDari,
            jumlahAngsuran: item.jumlahPelunasan,
            statusAngsuran: "COMPLETED",
          });

          completedPinjamanIds.push(item.pinjamanId);
        });
      }
    }

    const result = await db.transaction(async (tx) => {
      const [pengunduran] = await tx
        .update(pengunduranDiriTable)
        .set({ statusPengunduranDiri: action })
        .where(eq(pengunduranDiriTable.noPengunduranDiri, noPengunduran))
        .returning();

      if (!pengunduran) throw new Error("Pengunduran tidak ditemukan");

      if (pengunduran.statusPengunduranDiri === "APPROVED") {
        if (pengambilanSimpananData.length > 0) {
          for (const chunk of chunkArray(pengambilanSimpananData, 100)) {
            await tx
              .insert(pengambilanSimpananTable)
              .values(chunk)
              .onConflictDoNothing();
          }
        }

        if (angsuranData.length > 0) {
          for (const chunk of chunkArray(angsuranData, 100)) {
            await tx.insert(angsuranTable).values(chunk).onConflictDoNothing();
          }
        }

        if (completedPinjamanIds.length > 0) {
          await tx
            .update(pinjamanTable)
            .set({ statusPinjaman: "COMPLETED" })
            .where(inArray(pinjamanTable.noPinjaman, completedPinjamanIds));
        }

        const [anggota] = await tx
          .update(anggotaTable)
          .set({ statusAnggota: "NOTACTIVE" })
          .where(eq(anggotaTable.noAnggota, pengunduran.noAnggota))
          .returning();

        if (!anggota) throw new Error("Anggota tidak ditemukan");

        const [user] = await tx
          .update(userTable)
          .set({ statusUser: "REJECTED" })
          .where(eq(userTable.username, anggota.username))
          .returning();

        if (!user) throw new Error("Anggota tidak ditemukan");
      }

      return pengunduran;
    });

    if (!result) {
      return { ok: false, message: "update pengunduran gagal" };
    } else {
      await notifPengunduran({ data: result });

      const tagsToRevalidate = Array.from(
        new Set([
          ...tagsPinjamanRevalidate,
          ...tagsSimpananRevalidate,
          ...tagsPotonganRevalidate,
          ...tagsNotifikasiRevalidate,
          ...tagsPengambilanSimpananRevalidate,
          ...tagsPengunduranDiriRevalidate,
          ...tagsAnggotaRevalidate,
        ])
      );

      tagsToRevalidate.forEach((tag) => revalidateTag(tag));

      return { ok: true, message: "update pengunduran berhasil" };
    }

    // if (action === "APPROVED") {
    //   const [lastSimpananId, lastAngsuranId, simpananList, pinjamanList] =
    //     await Promise.all([
    //       getLastIdPengambilanSimpanan(),
    //       getLastIdAngsuran(),
    //       getSimpananPengunduranDiri(noPengunduran),
    //       getPinjamanPengunduranDiri(noPengunduran),
    //     ]);

    //   const pengambilanSimpananData: TInputPengambilanSimpanan[] =
    //     simpananList.data
    //       ? simpananList.data.map((item) => {
    //           const jenis = item.jenisSimpananPengunduran as JenisSimpananType;
    //           const lastId = lastSimpananId[jenis]?.id || null;

    //           return {
    //             noPengambilanSimpanan: generateIdPengambilanSimpanan(
    //               lastId,
    //               jenis
    //             ),
    //             noAnggota: item.noAnggota,
    //             tanggalPengambilanSimpanan: item.tanggalSimpananPengunduranDiri,
    //             jenisPengambilanSimpanan: jenis,
    //             jumlahPengambilanSimpanan: item.jumlahSimpananPengunduran,
    //             statusPengambilanSimpanan: "APPROVED",
    //           };
    //         })
    //       : [];

    //   const angsuranData: typeTInputAngsuran[] = pinjamanList.data
    //     ? pinjamanList.data.map((item) => {
    //         const jenis = item.jenisPinjmanPengunduranDiri as JenisPinjamanType;

    //         return {
    //           noAngsuran: generateIdAngsuran(lastAngsuranId),
    //           pinjamanId: item.pinjamanId,
    //           jenisPinjaman: jenis,
    //           angsuranPinjamanKe: item.angsuranKe + 1,
    //           angsuranPinjamanDari: item.angsuranDari,
    //           jumlahAngsuran: item.jumlahPelunasan,
    //           statusAngsuran: "COMPLETED",
    //         };
    //       })
    //     : [];

    //   const completedPinjamanIds = [
    //     ...new Set(angsuranData.map((a) => a.pinjamanId)),
    //   ];

    //   const errorMessages: string[] = [];

    //   await db.transaction(async (tx) => {
    //     if (pengambilanSimpananData.length > 0) {
    //       for (const chunk of chunkArray(pengambilanSimpananData, 100)) {
    //         await tx
    //           .insert(pengambilanSimpananTable)
    //           .values(chunk)
    //           .onConflictDoNothing();
    //       }

    //       console.log("Insert pengambilan simpanan OK");
    //     }

    //     if (angsuranData.length > 0) {
    //       for (const chunk of chunkArray(angsuranData, 100)) {
    //         await tx.insert(angsuranTable).values(chunk).onConflictDoNothing();
    //       }

    //       console.log("Insert angsuran OK");
    //     }

    //     if (completedPinjamanIds.length > 0) {
    //       await tx
    //         .update(pinjamanTable)
    //         .set({ statusPinjaman: "COMPLETED" })
    //         .where(inArray(pinjamanTable.noPinjaman, completedPinjamanIds));

    //       console.log("Update status pinjaman OK");
    //     }

    //     const [anggota] = await tx
    //       .update(anggotaTable)
    //       .set({ statusAnggota: "NOTACTIVE" })
    //       .where(eq(anggotaTable.noAnggota, pengunduran.noAnggota))
    //       .returning();

    //     if (!anggota) {
    //       errorMessages.push("Gagal memperbarui status anggota.");
    //     }

    //     const [user] = await tx
    //       .update(userTable)
    //       .set({ statusUser: "REJECTED" })
    //       .where(eq(userTable.username, anggota.username))
    //       .returning();

    //     if (!user) {
    //       errorMessages.push("Gagal memperbarui status user.");
    //     }
    //   });

    //   if (errorMessages.length > 0) {
    //     return { ok: false, message: "update pengunduran gagal" };
    //   }
    // }
  } catch (error) {
    console.error("Error update status pengunduran:", error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : LABEL.ERROR.SERVER,
    };
  }
};
