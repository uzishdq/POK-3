"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { revalidateTag } from "next/cache";
import { AnggotaUpdateOrDeleteSchema } from "@/lib/schema/schema-anggota";
import { anggotaTable, userTable } from "@/lib/db/schema";
import {
  LABEL,
  tagsAnggotaRevalidate,
  tagsNumberRevalidate,
  tagsPendaftaranSimpananRevalidate,
  tagsPengambilanSimpananRevalidate,
  tagsPinjamanRevalidate,
  tagsPotonganRevalidate,
  tagsSimpananRevalidate,
} from "@/lib/constan";
import { RoleType, StatusUserType } from "@/lib/types/helper";

export const updateAnggota = async (
  values: z.infer<typeof AnggotaUpdateOrDeleteSchema>
) => {
  try {
    const session = await auth();

    if (!session?.user.noAnggota) {
      return {
        ok: false,
        message: LABEL.ERROR.NOT_LOGIN,
      };
    }

    if (session.user.role !== "ADMIN") {
      return { ok: false, message: LABEL.ERROR.UNAUTHORIZED };
    }

    const validateValues = AnggotaUpdateOrDeleteSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: "Invalid field!" };
    }

    const { idUser, noAnggota, role, statusAnggota } = validateValues.data;

    const result = await db.transaction(async (tx) => {
      const updateAnggota = await tx
        .update(anggotaTable)
        .set({
          statusAnggota: statusAnggota,
        })
        .where(eq(anggotaTable.noAnggota, noAnggota))
        .returning();

      if (!updateAnggota) throw new Error("Anggota tidak ditemukan");

      const userUpdateFields =
        statusAnggota === "NOTACTIVE"
          ? {
              role: role as RoleType,
              statusUser: "REJECTED" as StatusUserType,
            }
          : {
              role: role as RoleType,
            };

      const updateUser = await tx
        .update(userTable)
        .set(userUpdateFields)
        .where(eq(userTable.idUser, idUser))
        .returning();

      if (!updateUser) throw new Error("User tidak ditemukan");

      return updateAnggota;
    });

    if (!result) {
      return {
        ok: false,
        message: "update data gagal",
      };
    } else {
      const tagsToRevalidate = Array.from(
        new Set([
          ...tagsAnggotaRevalidate,
          ...tagsPinjamanRevalidate,
          ...tagsSimpananRevalidate,
          ...tagsNumberRevalidate,
          ...tagsPengambilanSimpananRevalidate,
          ...tagsPotonganRevalidate,
          ...tagsPendaftaranSimpananRevalidate,
        ])
      );

      tagsToRevalidate.forEach((tag) => revalidateTag(tag));

      return {
        ok: true,
        message: "update data berhasil",
      };
    }
  } catch (error) {
    console.error("error update anggota user : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};
