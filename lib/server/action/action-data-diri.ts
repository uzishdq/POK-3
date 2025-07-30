"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { DataDiriSchema } from "@/lib/schema/schema-data-diri";
import { auth } from "@/lib/auth";
import { anggotaTable, userTable } from "@/lib/db/schema";
import { revalidateTag } from "next/cache";
import {
  LABEL,
  tagsAnggotaRevalidate,
  tagsNumberRevalidate,
  tagsPotonganRevalidate,
} from "@/lib/constan";

export const updateDataDiri = async (
  values: z.infer<typeof DataDiriSchema>
) => {
  try {
    const session = await auth();

    if (!session) {
      return {
        ok: false,
        message: LABEL.ERROR.NOT_LOGIN,
      };
    }

    const validateValues = DataDiriSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: "Invalid field!" };
    }

    if (session.user.id && session.user.noAnggota) {
      const { namaBank, noRek, noTelp, pilManasuka } = validateValues.data;

      const updateMaster = await db
        .update(userTable)
        .set({ statusUser: "APPROVED" })
        .where(eq(userTable.idUser, session.user.id))
        .returning();

      if (updateMaster.length === 0) {
        return {
          ok: false,
          message: "simpan data gagal",
        };
      }

      const sukamana: number = pilManasuka ? pilManasuka : 0;

      const result = await db
        .update(anggotaTable)
        .set({
          noTelpAnggota: noTelp,
          bankAnggota: namaBank,
          rekeningAnggota: noRek,
          pilihanSukamana: sukamana.toString(),
        })
        .where(eq(anggotaTable.noAnggota, session.user.noAnggota))
        .returning();

      if (result.length === 0) {
        return {
          ok: false,
          message: "simpan data gagal",
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
        message: "simpan data berhasil",
      };
    } else {
      return {
        ok: false,
        message: "Sesi telah berakhir. Silakan masuk kembali.",
      };
    }
  } catch (error) {
    console.error("error data diri : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};
