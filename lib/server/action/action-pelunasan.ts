"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { and, eq, gt, max, sum } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import {
  cekPelunasanSchema,
  createPelunasanPinjaman,
  UpdatePelunasanPinjamanSchema,
} from "@/lib/schema/schema-pelunasan";
import { auth } from "@/lib/auth";
import {
  angsuranTable,
  pelunasanPinjamanTable,
  pinjamanTable,
} from "@/lib/db/schema";
import {
  calculatePercentage,
  generateIdAngsuran,
  generateIdPelunasanPinjaman,
} from "@/lib/helper";
import { TValidasiPelunasan } from "@/lib/types/pelunasan-pinjaman";
import {
  LABEL,
  tagsNotifikasiRevalidate,
  tagsPinjamanRevalidate,
  tagsPotonganRevalidate,
  tagsSimpananRevalidate,
} from "@/lib/constan";
import { uploadImage } from "./action-upload-image";
import { getLastIdPelunasan } from "../data/data-pelunasan";
import { revalidateTag } from "next/cache";
import { getLastIdAngsuran } from "../data/data-pinjaman";
import { notifPelunasanPinjaman } from "./action-notifikasi";

export const validasiPelunasan = async (
  values: z.infer<typeof cekPelunasanSchema>
): Promise<TValidasiPelunasan> => {
  try {
    const session = await auth();

    if (!session || !session.user.noAnggota) {
      return {
        ok: false,
        message: LABEL.ERROR.NOT_LOGIN,
        data: null,
      };
    }

    const validateValues = cekPelunasanSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD, data: null };
    }

    const [pinjaman] = await db
      .select()
      .from(pinjamanTable)
      .where(
        and(
          eq(pinjamanTable.noPinjaman, validateValues.data.pinjamanId),
          eq(pinjamanTable.noAnggota, session.user.noAnggota)
        )
      )
      .limit(1);

    if (!pinjaman) {
      return {
        ok: false,
        message: "validasi pelunasan pinjaman gagal, tidak ada pinjaman aktif",
        data: null,
      };
    } else {
      const [angsuran] = await db
        .select({
          angsuranPinjamanKe: max(angsuranTable.angsuranPinjamanKe),
          total: sum(angsuranTable.jumlahAngsuran).as("total"),
        })
        .from(angsuranTable)
        .where(
          and(
            gt(angsuranTable.angsuranPinjamanKe, 0),
            eq(angsuranTable.pinjamanId, validateValues.data.pinjamanId)
          )
        );

      const admin = calculatePercentage(Number(pinjaman.ajuanPinjaman), 1);

      // const totalSudahBayarValue = Number(angsuran?.total ?? 0);
      const totalSudahBayarValue = Math.round(
        Number(angsuran?.total ?? 0) -
          admin * (angsuran?.angsuranPinjamanKe ?? 0)
      );
      const jumlahPinjaman = Number(pinjaman.ajuanPinjaman);

      // const totalHarusBayar = jumlahPinjaman + tenor * admin;
      const totalHarusBayar = jumlahPinjaman;
      const pelunasan = totalHarusBayar - totalSudahBayarValue + admin;

      return {
        ok: true,
        message: "validasi pelunasan pinjaman berhasil",
        data: {
          noPinjaman: pinjaman.noPinjaman,
          tujuanPinjaman: pinjaman.tujuanPinjaman,
          tanggalPinjaman: pinjaman.tanggalPinjaman,
          jenisPinjman: pinjaman.jenisPinjman,
          ajuanPinjaman: pinjaman.ajuanPinjaman,
          angsuranKe: angsuran.angsuranPinjamanKe ?? 0,
          angsuranDari: pinjaman.waktuPengembalian,
          admin: admin,
          totalBayar: totalSudahBayarValue,
          pelunasan: pelunasan,
        },
      };
    }
  } catch (error) {
    console.error("error validasi pelunasan pinjaman : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
      data: null,
    };
  }
};

export const insertPelunasan = async (
  values: z.infer<typeof createPelunasanPinjaman>
) => {
  try {
    const validateValues = createPelunasanPinjaman.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    const {
      pinjamanId,
      jenisPelunasanPinjaman,
      sudahDibayarkan,
      angsuranKePelunasanPinjaman,
      jumlahPelunasanPinjaman,
      buktiPelunasan,
    } = validateValues.data;

    const isValid = await validasiPelunasan({ pinjamanId });

    if (!isValid.ok || !isValid.data) {
      return {
        ok: isValid.ok,
        message: isValid.message,
      };
    }
    const newUUID = uuidv4();
    const nameStruk = `${jenisPelunasanPinjaman}/${newUUID}-pelunasan-pinjaman.jpg`;

    const struk = await uploadImage(
      buktiPelunasan,
      nameStruk,
      "pelunasan-pinjaman"
    );

    if (!struk.imageUrl) {
      return { ok: false, message: "Gagal upload bukti pelunasan" };
    }

    const lastId = await getLastIdPelunasan(jenisPelunasanPinjaman);
    const newNoPelunasan = generateIdPelunasanPinjaman(
      lastId,
      jenisPelunasanPinjaman
    );

    const [result] = await db
      .insert(pelunasanPinjamanTable)
      .values({
        noPelunasanPinjaman: newNoPelunasan,
        pinjamanId: pinjamanId,
        jenisPelunasanPinjaman: jenisPelunasanPinjaman,
        angsuranKePelunasanPinjaman: angsuranKePelunasanPinjaman,
        sudahDibayarkan: sudahDibayarkan.toString(),
        jumlahPelunasanPinjaman: jumlahPelunasanPinjaman.toString(),
        buktiPelunasan: struk.imageUrl,
      })
      .returning();

    if (!result) {
      return {
        ok: false,
        message: "Pengajuan pelunasan pinjaman gagal",
      };
    }

    await notifPelunasanPinjaman({ data: result });

    const tagsToRevalidate = Array.from(
      new Set([
        ...tagsPinjamanRevalidate,
        ...tagsSimpananRevalidate,
        ...tagsPotonganRevalidate,
        ...tagsNotifikasiRevalidate,
      ])
    );

    tagsToRevalidate.forEach((tag) => revalidateTag(tag));

    return {
      ok: true,
      message: "Pengajuan pelunasan pinjaman berhasil",
    };
  } catch (error) {
    console.error("error insert pelunasan pinjaman : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};

export const updatePelunasan = async (
  values: z.infer<typeof UpdatePelunasanPinjamanSchema>
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

    const validateValues = UpdatePelunasanPinjamanSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    const {
      noPelunasanPinjaman,
      pinjamanId,
      angsuranKePelunasanPinjaman,
      jumlahPelunasanPinjaman,
      action,
    } = validateValues.data;

    const lastIdAngsuran = await getLastIdAngsuran();

    if (action === "APPROVED") {
      await db.transaction(async (tx) => {
        const [updatedPinjaman] = await tx
          .update(pinjamanTable)
          .set({ statusPinjaman: "COMPLETED" })
          .where(eq(pinjamanTable.noPinjaman, pinjamanId))
          .returning();

        if (!updatedPinjaman) {
          throw new Error("Pinjaman tidak ditemukan atau gagal diupdate.");
        }

        const angsuranDari = updatedPinjaman.waktuPengembalian;

        await tx.insert(angsuranTable).values({
          noAngsuran: generateIdAngsuran(lastIdAngsuran),
          pinjamanId: pinjamanId,
          angsuranPinjamanKe: angsuranKePelunasanPinjaman + 1,
          angsuranPinjamanDari: angsuranDari,
          jumlahAngsuran: jumlahPelunasanPinjaman.toString(),
          statusAngsuran: "COMPLETED",
        });

        await tx
          .update(angsuranTable)
          .set({ statusAngsuran: "COMPLETED" })
          .where(eq(angsuranTable.pinjamanId, pinjamanId));
      });
    }

    const [result] = await db
      .update(pelunasanPinjamanTable)
      .set({ statusPelunasanPinjaman: action })
      .where(
        eq(pelunasanPinjamanTable.noPelunasanPinjaman, noPelunasanPinjaman)
      )
      .returning();

    if (!result) {
      return {
        ok: false,
        message: "Update pelunasan pinjaman gagal",
      };
    }

    await notifPelunasanPinjaman({ data: result });

    const tagsToRevalidate = Array.from(
      new Set([
        ...tagsPinjamanRevalidate,
        ...tagsSimpananRevalidate,
        ...tagsPotonganRevalidate,
        ...tagsNotifikasiRevalidate,
      ])
    );

    tagsToRevalidate.forEach((tag) => revalidateTag(tag));

    return { ok: true, message: "Update pelunasan pinjaman berhasil" };
  } catch (error) {
    console.error("error validasi pelunasan pinjaman : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};
