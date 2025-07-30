"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { revalidateTag } from "next/cache";
import {
  UnitKerjaSchema,
  UnitKerjaUpdateOrDeleteSchema,
} from "@/lib/schema/schema-unit-kerja";
import { unitKerjaTable } from "@/lib/db/schema";
import { LABEL, tagsUnitKerjaRevalidate } from "@/lib/constan";
import { getLastIdUnitKerja } from "../data/data-unit-kerja";

export const insertUnitKerja = async (
  values: z.infer<typeof UnitKerjaSchema>
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

    const validateValues = UnitKerjaSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    const id = await getLastIdUnitKerja();

    const result = await db
      .insert(unitKerjaTable)
      .values({
        noUnitKerja: id,
        namaUnitKerja: validateValues.data.namaUnitKerja,
        alamatUnitKerja: validateValues.data.alamatUnitKerja,
      })
      .returning();

    if (!result || result.length === 0) {
      return {
        ok: false,
        message: LABEL.INPUT.FAILED.SAVED,
      };
    }

    const tagsToRevalidate = Array.from(new Set([...tagsUnitKerjaRevalidate]));

    tagsToRevalidate.forEach((tag) => revalidateTag(tag));

    return {
      ok: true,
      message: LABEL.INPUT.SUCCESS.SAVED,
    };
  } catch (error) {
    console.error("error insert unit kerja : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};

export const updateUnitKerja = async (
  values: z.infer<typeof UnitKerjaUpdateOrDeleteSchema>
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

    const validateValues = UnitKerjaUpdateOrDeleteSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    const result = await db
      .update(unitKerjaTable)
      .set({
        namaUnitKerja: validateValues.data.namaUnitKerja,
        alamatUnitKerja: validateValues.data.alamatUnitKerja,
      })
      .where(eq(unitKerjaTable.noUnitKerja, validateValues.data.noUnitKerja))
      .returning();

    if (!result || result.length === 0) {
      return {
        ok: false,
        message: LABEL.INPUT.FAILED.UPDATE,
      };
    }

    const tagsToRevalidate = Array.from(new Set([...tagsUnitKerjaRevalidate]));

    tagsToRevalidate.forEach((tag) => revalidateTag(tag));

    return {
      ok: true,
      message: LABEL.INPUT.SUCCESS.UPDATE,
    };
  } catch (error) {
    console.error("error update unit kerja : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};

export const deleteUnitKerja = async (
  values: z.infer<typeof UnitKerjaUpdateOrDeleteSchema>
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

    const validateValues = UnitKerjaUpdateOrDeleteSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    const result = await db
      .delete(unitKerjaTable)
      .where(eq(unitKerjaTable.noUnitKerja, validateValues.data.noUnitKerja))
      .returning();

    if (!result || result.length === 0) {
      return {
        ok: false,
        message: LABEL.INPUT.FAILED.DELETE,
      };
    }

    const tagsToRevalidate = Array.from(new Set([...tagsUnitKerjaRevalidate]));

    tagsToRevalidate.forEach((tag) => revalidateTag(tag));

    return {
      ok: true,
      message: LABEL.INPUT.SUCCESS.DELETE,
    };
  } catch (error) {
    console.error("error delete unit kerja : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};
