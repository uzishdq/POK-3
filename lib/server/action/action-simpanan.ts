"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { revalidateTag } from "next/cache";
import {
  PembagianSimpananSchema,
  PendaftaranSimpananSchema,
  SettingSimpananSchema,
  SettingSimpananUpdateOrDeleteSchema,
  UpdatePendaftaranSimpananSchema,
} from "@/lib/schema/schema-simpanan";
import {
  detailPembagianSimpananTable,
  pendaftaranSimpananTable,
  pengambilanSimpananTable,
  settingPendaftaranSimpananTable,
} from "@/lib/db/schema";
import {
  PengambilanSimpananSchema,
  UpdateStatusPengambilanSimpananSchema,
} from "@/lib/schema/schema-pengambilan-simpanan";
import {
  LABEL,
  tagsNotifikasiRevalidate,
  tagsNumberRevalidate,
  tagsPendaftaranSimpananRevalidate,
  tagsPengambilanSimpananRevalidate,
  tagsPinjamanRevalidate,
  tagsPotonganRevalidate,
  tagsSimpananRevalidate,
} from "@/lib/constan";
import {
  getLastIdPengambilanSimpanan,
  getPembagianSimpananBerjangka,
  verifPengambilanSimpananBerjangka,
} from "../data/data-simpanan";
import { chunkArray, generateIdPengambilanSimpanan } from "@/lib/helper";
import {
  notifPembagianSimpanan,
  notifPengambilanSimpanan,
  notifPengumumanSimpanan,
} from "./action-notifikasi";

export const insertSettingSimpananBerjangka = async (
  values: z.infer<typeof SettingSimpananSchema>
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

    const validateValues = SettingSimpananSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    const [result] = await db
      .insert(settingPendaftaranSimpananTable)
      .values({
        namaPendaftaran: validateValues.data.namaPendaftaran,
        jenisPendaftaranSimpanan: validateValues.data.jenisPendaftaranSimpanan,
        tanggalTutupSimpanan: validateValues.data.tanggalTutupSimpanan,
        tanggalAwalSimpanan: validateValues.data.tanggalAwalSimpanan,
        tanggalAkhirSimpanan: validateValues.data.tanggalAkhirSimpanan,
      })
      .returning();

    if (!result) {
      return {
        ok: false,
        message: LABEL.INPUT.FAILED.SAVED,
      };
    }

    // ===== SET NOTIFIKASI =====
    await notifPengumumanSimpanan({ data: result });

    const tagsToRevalidate = Array.from(
      new Set([
        ...tagsNotifikasiRevalidate,
        ...tagsSimpananRevalidate,
        ...tagsPendaftaranSimpananRevalidate,
        ...tagsPengambilanSimpananRevalidate,
        ...tagsPotonganRevalidate,
        ...tagsNotifikasiRevalidate,
      ])
    );

    tagsToRevalidate.forEach((tag) => revalidateTag(tag));

    return {
      ok: true,
      message: LABEL.INPUT.SUCCESS.SAVED,
    };
  } catch (error) {
    console.error("error insert setting simpanan : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};

export const updateSettingSimpananBerjangka = async (
  values: z.infer<typeof SettingSimpananUpdateOrDeleteSchema>
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

    const validateValues =
      SettingSimpananUpdateOrDeleteSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    const [result] = await db
      .update(settingPendaftaranSimpananTable)
      .set({
        namaPendaftaran: validateValues.data.namaPendaftaran,
        jenisPendaftaranSimpanan: validateValues.data.jenisPendaftaranSimpanan,
        tanggalTutupSimpanan: validateValues.data.tanggalTutupSimpanan,
        tanggalAwalSimpanan: validateValues.data.tanggalAwalSimpanan,
        tanggalAkhirSimpanan: validateValues.data.tanggalAkhirSimpanan,
      })
      .where(
        eq(
          settingPendaftaranSimpananTable.idSettingPendaftaran,
          validateValues.data.idSettingPendaftaran
        )
      )
      .returning();

    if (!result) {
      return {
        ok: false,
        message: LABEL.INPUT.FAILED.UPDATE,
      };
    }

    const tagsToRevalidate = Array.from(
      new Set([
        ...tagsNotifikasiRevalidate,
        ...tagsSimpananRevalidate,
        ...tagsPendaftaranSimpananRevalidate,
        ...tagsPengambilanSimpananRevalidate,
        ...tagsPotonganRevalidate,
      ])
    );

    tagsToRevalidate.forEach((tag) => revalidateTag(tag));

    return {
      ok: true,
      message: LABEL.INPUT.SUCCESS.UPDATE,
    };
  } catch (error) {
    console.error("error update setting simpanan : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};

export const deleteSettingSimpananBerjangka = async (
  values: z.infer<typeof SettingSimpananUpdateOrDeleteSchema>
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

    const validateValues =
      SettingSimpananUpdateOrDeleteSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    const [result] = await db
      .delete(settingPendaftaranSimpananTable)
      .where(
        eq(
          settingPendaftaranSimpananTable.idSettingPendaftaran,
          validateValues.data.idSettingPendaftaran
        )
      )
      .returning();

    if (!result) {
      return {
        ok: false,
        message: LABEL.INPUT.FAILED.DELETE,
      };
    }

    const tagsToRevalidate = Array.from(
      new Set([
        ...tagsNotifikasiRevalidate,
        ...tagsSimpananRevalidate,
        ...tagsPendaftaranSimpananRevalidate,
        ...tagsPengambilanSimpananRevalidate,
        ...tagsPotonganRevalidate,
      ])
    );

    tagsToRevalidate.forEach((tag) => revalidateTag(tag));

    return {
      ok: true,
      message: LABEL.INPUT.SUCCESS.DELETE,
    };
  } catch (error) {
    console.error("error delete setting simpanan : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};

export const insertPendaftaranSimpanan = async (
  values: z.infer<typeof PendaftaranSimpananSchema>
) => {
  try {
    const session = await auth();

    if (!session?.user.noAnggota || !session?.user.role) {
      return {
        ok: false,
        message: LABEL.ERROR.NOT_LOGIN,
      };
    }

    const validateValues = PendaftaranSimpananSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    const [isDaftar] = await db
      .select({ idPendaftar: pendaftaranSimpananTable.idPendaftar })
      .from(pendaftaranSimpananTable)
      .where(
        and(
          eq(
            pendaftaranSimpananTable.settingPendaftaranId,
            validateValues.data.settingPendaftaranId
          ),
          eq(pendaftaranSimpananTable.noAnggota, session.user.noAnggota)
        )
      );

    if (isDaftar) {
      return { ok: false, message: "pendaftaran gagal, sudah terdaftar" };
    }

    const [result] = await db
      .insert(pendaftaranSimpananTable)
      .values({
        settingPendaftaranId: validateValues.data.settingPendaftaranId,
        noAnggota: session.user.noAnggota,
        jumlahPilihan: validateValues.data.jumlahPilihan?.toString(),
      })
      .returning();

    if (!result) {
      return {
        ok: false,
        message: "pendaftaran gagal",
      };
    }

    const tagsToRevalidate = Array.from(
      new Set([
        ...tagsNumberRevalidate,
        ...tagsNotifikasiRevalidate,
        ...tagsSimpananRevalidate,
        ...tagsPendaftaranSimpananRevalidate,
        ...tagsPengambilanSimpananRevalidate,
        ...tagsPotonganRevalidate,
      ])
    );

    tagsToRevalidate.forEach((tag) => revalidateTag(tag));

    return {
      ok: true,
      message: "pendaftaran berhasil",
    };
  } catch (error) {
    console.error("error insert pendaftaran simpanan : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};

export const updatePendaftaranSimpanan = async (
  values: z.infer<typeof UpdatePendaftaranSimpananSchema>
) => {
  try {
    const session = await auth();

    if (!session?.user.noAnggota || !session?.user.role) {
      return {
        ok: false,
        message: LABEL.ERROR.NOT_LOGIN,
      };
    }

    const validateValues = UpdatePendaftaranSimpananSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: "Invalid field!" };
    }

    const [result] = await db
      .update(pendaftaranSimpananTable)
      .set({ jumlahPilihan: validateValues.data.jumlahPilihan.toString() })
      .where(
        eq(
          pendaftaranSimpananTable.idPendaftar,
          validateValues.data.idPendaftar
        )
      )
      .returning();

    if (!result) {
      return {
        ok: false,
        message: "perbarui jumlah simpanan gagal",
      };
    }

    const tagsToRevalidate = Array.from(
      new Set([
        ...tagsSimpananRevalidate,
        ...tagsPendaftaranSimpananRevalidate,
        ...tagsPengambilanSimpananRevalidate,
        ...tagsPotonganRevalidate,
      ])
    );

    tagsToRevalidate.forEach((tag) => revalidateTag(tag));

    return {
      ok: true,
      message: "perbarui jumlah simpanan berhasil",
    };
  } catch (error) {
    console.error("error update pendaftaran simpanan : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};

export const insertPengambilanSimpanan = async (
  limit: number,
  type: string,
  values: unknown
) => {
  try {
    const session = await auth();

    if (!session?.user.noAnggota) {
      return {
        ok: false,
        message: LABEL.ERROR.NOT_LOGIN,
      };
    }

    // Validasi input
    const schema = PengambilanSimpananSchema(limit, type);
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    const { noAnggota, jenisPengambilanSimpanan, jumlahPengambilanSimpanan } =
      parsed.data;

    // Cegah manipulasi noAnggota
    if (session.user.noAnggota !== noAnggota) {
      return {
        ok: false,
        message: LABEL.ERROR.NOT_ID_USER,
      };
    }

    const verif = await verifPengambilanSimpananBerjangka(
      noAnggota,
      jenisPengambilanSimpanan
    );

    if (!verif.ok) {
      return {
        ok: false,
        message: verif.message || "Verifikasi pengambilan simpanan gagal.",
      };
    }

    const lastId = await getLastIdPengambilanSimpanan();
    const id = lastId[jenisPengambilanSimpanan]?.id || null;

    // Lakukan insert ke tabel
    const [result] = await db
      .insert(pengambilanSimpananTable)
      .values({
        noPengambilanSimpanan: generateIdPengambilanSimpanan(
          id,
          jenisPengambilanSimpanan
        ),
        noAnggota,
        jenisPengambilanSimpanan,
        jumlahPengambilanSimpanan: jumlahPengambilanSimpanan.toString(),
      })
      .returning();

    if (!result) {
      return {
        ok: false,
        message: "Pengambilan simpanan gagal disimpan.",
      };
    }

    await notifPengambilanSimpanan({ data: result });

    const tagsToRevalidate = Array.from(
      new Set([
        ...tagsNotifikasiRevalidate,
        ...tagsSimpananRevalidate,
        ...tagsPendaftaranSimpananRevalidate,
        ...tagsPengambilanSimpananRevalidate,
      ])
    );

    tagsToRevalidate.forEach((tag) => revalidateTag(tag));

    return {
      ok: true,
      message: "Pengambilan simpanan berhasil.",
    };
  } catch (error) {
    console.error("error insert pengambilan simpanan:", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};

export const updatePengambilanSimpanan = async (values: unknown) => {
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

    const validateValues =
      UpdateStatusPengambilanSimpananSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    const { noPengambilanSimpanan, action } = validateValues.data;

    const [result] = await db
      .update(pengambilanSimpananTable)
      .set({ statusPengambilanSimpanan: action })
      .where(
        eq(
          pengambilanSimpananTable.noPengambilanSimpanan,
          noPengambilanSimpanan
        )
      )
      .returning();

    if (!result) {
      return {
        ok: false,
        message: "Update pengambilan simpanan gagal.",
      };
    }

    await notifPengambilanSimpanan({ data: result });

    const tagsToRevalidate = Array.from(
      new Set([
        ...tagsNotifikasiRevalidate,
        ...tagsSimpananRevalidate,
        ...tagsPendaftaranSimpananRevalidate,
        ...tagsPengambilanSimpananRevalidate,
        ...tagsPinjamanRevalidate,
      ])
    );

    tagsToRevalidate.forEach((tag) => revalidateTag(tag));

    return {
      ok: true,
      message: "Update pengambilan simpanan berhasil.",
    };
  } catch (error) {
    console.error("error insert pengambilan simpanan:", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};

export const pembagianSimpanan = async (
  values: z.infer<typeof PembagianSimpananSchema>
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

    const validateValues = PembagianSimpananSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    const detailDataSimpanan = await getPembagianSimpananBerjangka(
      validateValues.data.id
    );

    if (!detailDataSimpanan.ok || !detailDataSimpanan.data) {
      return {
        ok: false,
        message: "pembagian pinjaman gagal",
      };
    }

    const [update] = await db
      .update(settingPendaftaranSimpananTable)
      .set({
        basilSimpanan: validateValues.data.basil,
        tanggalPembagian: validateValues.data.tanggalPembagian,
        statusPendaftaranSimpanan: "CLOSE",
        updatedAt: new Date().toISOString(),
      })
      .where(
        eq(
          settingPendaftaranSimpananTable.idSettingPendaftaran,
          validateValues.data.id
        )
      )
      .returning();

    console.log(update);

    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };

    // const result = await db.transaction(async (tx) => {
    //   const [update] = await tx
    //     .update(settingPendaftaranSimpananTable)
    //     .set({
    //       basilSimpanan: validateValues.data.basil,
    //       tanggalPembagian: validateValues.data.tanggalPembagian,
    //       statusPendaftaranSimpanan: "CLOSE",
    //       updatedAt: new Date().toISOString(),
    //     })
    //     .where(
    //       eq(
    //         settingPendaftaranSimpananTable.idSettingPendaftaran,
    //         validateValues.data.id
    //       )
    //     )
    //     .returning();
    //   // Insert detail pembagian simpanan (jika ada)
    //   if (detailDataSimpanan.data.detailPembagianSimpanan.length > 0) {
    //     for (const chunk of chunkArray(
    //       detailDataSimpanan.data.detailPembagianSimpanan,
    //       100
    //     )) {
    //       await tx
    //         .insert(detailPembagianSimpananTable)
    //         .values(chunk)
    //         .onConflictDoNothing();
    //     }
    //   }

    //   // Insert pengambilan simpanan (jika ada)
    //   if (detailDataSimpanan.data.pengambilanSimpanan.length > 0) {
    //     for (const chunk of chunkArray(
    //       detailDataSimpanan.data.pengambilanSimpanan,
    //       100
    //     )) {
    //       await tx
    //         .insert(pengambilanSimpananTable)
    //         .values(chunk)
    //         .onConflictDoNothing();
    //     }
    //   }
    //   return update;
    // });

    // if (!result) {
    //   return {
    //     ok: false,
    //     message: "pembagian pinjaman gagal",
    //   };
    // } else {
    //   await notifPembagianSimpanan({
    //     idSettingPendaftaran: result.idSettingPendaftaran,
    //     namaPendaftaran: result.namaPendaftaran,
    //     jenisPengambilanSimpanan: result.jenisPendaftaranSimpanan,
    //   });

    //   const tagsToRevalidate = Array.from(
    //     new Set([
    //       ...tagsSimpananRevalidate,
    //       ...tagsPendaftaranSimpananRevalidate,
    //       ...tagsPengambilanSimpananRevalidate,
    //       ...tagsPotonganRevalidate,
    //       ...tagsNotifikasiRevalidate,
    //     ])
    //   );

    //   tagsToRevalidate.forEach((tag) => revalidateTag(tag));

    //   return {
    //     ok: true,
    //     message: "pembagian pinjaman berhasil",
    //   };
    // }
  } catch (error) {
    console.error("error pembagian simpanan : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};
