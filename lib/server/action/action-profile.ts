"use server";
import { auth } from "@/lib/auth";
import {
  LABEL,
  tagsAnggotaRevalidate,
  tagsNumberRevalidate,
  tagsPotonganRevalidate,
} from "@/lib/constan";
import { db } from "@/lib/db";
import { anggotaTable } from "@/lib/db/schema";
import { ProfileSchema } from "@/lib/schema/schema-profile";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import * as z from "zod";

export const updateProfile = async (values: z.infer<typeof ProfileSchema>) => {
  try {
    const validateValues = ProfileSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    const session = await auth();

    if (!session?.user.id || !session.user.noAnggota) {
      return {
        ok: false,
        message: LABEL.ERROR.NOT_LOGIN,
      };
    }

    const [result] = await db
      .update(anggotaTable)
      .set({
        nikAnggota: validateValues.data.nikAnggota,
        nipAnggota: validateValues.data.nipAnggota || null,
        namaAnggota: validateValues.data.namaAnggota,
        tanggalLahirAnggota: validateValues.data.tanggalLahirAnggota,
        tempatLahirAnggota: validateValues.data.tempatLahirAnggota,
        jenisKelaminAnggota: validateValues.data.jenisKelaminAnggota,
        alamatAnggota: validateValues.data.alamatAnggota,
        noTelpAnggota: validateValues.data.noTelpAnggota,
        statusPekerjaan: validateValues.data.statusPekerjaan,
        jabatanId: validateValues.data.jabatanId,
        unitKerjaId: validateValues.data.unitKerjaId,
        bankAnggota: validateValues.data.bankAnggota,
        rekeningAnggota: validateValues.data.rekeningAnggota,
        pilihanSukamana: validateValues.data.pilihanSukamana?.toString(),
      })
      .where(eq(anggotaTable.noAnggota, session.user.noAnggota))
      .returning();

    if (!result) {
      return {
        ok: false,
        message: LABEL.INPUT.FAILED.UPDATE,
      };
    }

    const tagsToRevalidate = Array.from(
      new Set([
        ...tagsNumberRevalidate,
        ...tagsAnggotaRevalidate,
        ...tagsPotonganRevalidate,
      ])
    );

    tagsToRevalidate.forEach((tag) => revalidateTag(tag));

    return {
      ok: true,
      message: LABEL.INPUT.SUCCESS.UPDATE,
    };
  } catch (error) {
    console.error("error update profile : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};
