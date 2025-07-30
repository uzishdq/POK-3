"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { revalidateTag } from "next/cache";
import {
  JabatanSchema,
  JabatanUpdateOrDeleteSchema,
} from "@/lib/schema/schema-jabatan";
import { jabatanTable } from "@/lib/db/schema";
import { LABEL, tagsJabatanRevalidate } from "@/lib/constan";
import { getLastIdJabatan } from "../data/data-jabatan";

export const insertJabatan = async (values: z.infer<typeof JabatanSchema>) => {
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

    const validateValues = JabatanSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    const id = await getLastIdJabatan();

    const result = await db
      .insert(jabatanTable)
      .values({
        noJabatan: id,
        namaJabatan: validateValues.data.namaJabatan,
      })
      .returning();

    if (!result || result.length === 0) {
      return {
        ok: false,
        message: LABEL.INPUT.FAILED.SAVED,
      };
    }

    const tagsToRevalidate = Array.from(new Set([...tagsJabatanRevalidate]));

    tagsToRevalidate.forEach((tag) => revalidateTag(tag));

    return {
      ok: true,
      message: LABEL.INPUT.SUCCESS.SAVED,
    };
  } catch (error) {
    console.error("error insert jabatan : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};

export const updateJabatan = async (
  values: z.infer<typeof JabatanUpdateOrDeleteSchema>
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

    const validateValues = JabatanUpdateOrDeleteSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    const result = await db
      .update(jabatanTable)
      .set({
        namaJabatan: validateValues.data.namaJabatan,
      })
      .where(eq(jabatanTable.noJabatan, validateValues.data.noJabatan))
      .returning();

    if (!result || result.length === 0) {
      return {
        ok: false,
        message: LABEL.INPUT.FAILED.UPDATE,
      };
    }

    const tagsToRevalidate = Array.from(new Set([...tagsJabatanRevalidate]));

    tagsToRevalidate.forEach((tag) => revalidateTag(tag));

    return {
      ok: true,
      message: LABEL.INPUT.SUCCESS.UPDATE,
    };
  } catch (error) {
    console.error("error update jabatan : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};

export const deleteJabatan = async (
  values: z.infer<typeof JabatanUpdateOrDeleteSchema>
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

    const validateValues = JabatanUpdateOrDeleteSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    const result = await db
      .delete(jabatanTable)
      .where(eq(jabatanTable.noJabatan, validateValues.data.noJabatan))
      .returning();

    if (result.length === 0) {
      return {
        ok: false,
        message: LABEL.INPUT.FAILED.DELETE,
      };
    }

    const tagsToRevalidate = Array.from(new Set([...tagsJabatanRevalidate]));

    tagsToRevalidate.forEach((tag) => revalidateTag(tag));

    return {
      ok: true,
      message: LABEL.INPUT.SUCCESS.DELETE,
    };
  } catch (error) {
    console.error("error delete jabatan : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};
