"use server";

import * as z from "zod";
import { auth } from "@/lib/auth";
import {
  laporanPinjamanSchema,
  laporanSimpananSchema,
} from "@/lib/schema/schema-laporan";
import { LABEL } from "@/lib/constan";

export const findLaporanPinjaman = async (
  values: z.infer<typeof laporanPinjamanSchema>
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

    const validateValues = laporanPinjamanSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD, data: null };
    }

    return {
      ok: true,
      message: "validasi pinjaman berhasil",
    };
  } catch (error) {
    console.error("error find laporan pinjaman : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};

export const findLaporanSimpananBerjangka = async (
  values: z.infer<typeof laporanSimpananSchema>
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

    const validateValues = laporanSimpananSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD, data: null };
    }

    return {
      ok: true,
      message: "validasi simpanan berjangka berhasil",
    };
  } catch (error) {
    console.error("error find laporan simpanan berjangka : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};
