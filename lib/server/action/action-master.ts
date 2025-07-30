"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { revalidateTag } from "next/cache";
import {
  MasterSchema,
  MasterUpdateOrDeleteSchema,
} from "@/lib/schema/schema-master";
import { masterTable } from "@/lib/db/schema";
import { LABEL, tagsMasterRevalidate } from "@/lib/constan";

export const insertMaster = async (values: z.infer<typeof MasterSchema>) => {
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

    const validateValues = MasterSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    const result = await db
      .insert(masterTable)
      .values({
        nikMaster: validateValues.data.nikMaster,
        nipMaster:
          validateValues.data.nipMaster === ""
            ? null
            : validateValues.data.nipMaster,
        namaMaster: validateValues.data.namaMaster,
        tanggalLahirMaster: validateValues.data.tanggalLahirMaster,
        tempatLahirMaster: validateValues.data.tempatLahirMaster,
        jenisKelaminMaster: validateValues.data.jenisKelaminMaster,
        alamatMaster: validateValues.data.alamatMaster,
        statusPekerjaan: validateValues.data.statusPekerjaan,
        jabatanId: Number(validateValues.data.jabatanId),
        unitKerjaId: Number(validateValues.data.unitKerjaId),
      })
      .returning();

    if (!result || result.length === 0) {
      return {
        ok: false,
        message: LABEL.INPUT.FAILED.SAVED,
      };
    }

    const tagsToRevalidate = Array.from(new Set([...tagsMasterRevalidate]));

    tagsToRevalidate.forEach((tag) => revalidateTag(tag));

    return {
      ok: true,
      message: LABEL.INPUT.SUCCESS.SAVED,
    };
  } catch (error) {
    console.error("error insert master : ", error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
};

export const updateMaster = async (
  values: z.infer<typeof MasterUpdateOrDeleteSchema>
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

    const validateValues = MasterUpdateOrDeleteSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    const result = await db
      .update(masterTable)
      .set({
        nikMaster: validateValues.data.nikMaster,
        nipMaster: validateValues.data.nipMaster,
        namaMaster: validateValues.data.namaMaster,
        tanggalLahirMaster: validateValues.data.tanggalLahirMaster,
        tempatLahirMaster: validateValues.data.tempatLahirMaster,
        jenisKelaminMaster: validateValues.data.jenisKelaminMaster,
        alamatMaster: validateValues.data.alamatMaster,
        statusPekerjaan: validateValues.data.statusPekerjaan,
        jabatanId: Number(validateValues.data.jabatanId),
        unitKerjaId: Number(validateValues.data.unitKerjaId),
      })
      .where(eq(masterTable.idMaster, validateValues.data.idMaster))
      .returning();

    if (!result || result.length === 0) {
      return {
        ok: false,
        message: LABEL.INPUT.FAILED.UPDATE,
      };
    }

    const tagsToRevalidate = Array.from(new Set([...tagsMasterRevalidate]));

    tagsToRevalidate.forEach((tag) => revalidateTag(tag));

    return {
      ok: true,
      message: LABEL.INPUT.SUCCESS.UPDATE,
    };
  } catch (error) {
    console.error("error update master : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};

export const deleteMaster = async (
  values: z.infer<typeof MasterUpdateOrDeleteSchema>
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

    const validateValues = MasterUpdateOrDeleteSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    const result = await db
      .delete(masterTable)
      .where(eq(masterTable.idMaster, validateValues.data.idMaster))
      .returning();

    if (!result || result.length === 0) {
      return {
        ok: false,
        message: LABEL.INPUT.FAILED.DELETE,
      };
    }

    const tagsToRevalidate = Array.from(new Set([...tagsMasterRevalidate]));

    tagsToRevalidate.forEach((tag) => revalidateTag(tag));

    return {
      ok: true,
      message: LABEL.INPUT.SUCCESS.DELETE,
    };
  } catch (error) {
    console.error("error delete master : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};
