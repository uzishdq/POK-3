"use server";

import { auth } from "@/lib/auth";
import {
  tagsAnggotaRevalidate,
  tagsJabatanRevalidate,
  tagsMasterRevalidate,
  tagsNotifikasiRevalidate,
  tagsNumberRevalidate,
  tagsPendaftaranSimpananRevalidate,
  tagsPengambilanSimpananRevalidate,
  tagsPengunduranDiriRevalidate,
  tagsPinjamanRevalidate,
  tagsPotonganRevalidate,
  tagsSimpananRevalidate,
  tagsUnitKerjaRevalidate,
} from "@/lib/constan";
import { revalidateTag } from "next/cache";

export const refreshData = async () => {
  try {
    const session = await auth();

    if (session) {
      const tagsToRevalidate = Array.from(
        new Set([
          ...tagsNumberRevalidate,
          ...tagsUnitKerjaRevalidate,
          ...tagsJabatanRevalidate,
          ...tagsMasterRevalidate,
          ...tagsAnggotaRevalidate,
          ...tagsPotonganRevalidate,
          ...tagsNotifikasiRevalidate,
          ...tagsPinjamanRevalidate,
          ...tagsPendaftaranSimpananRevalidate,
          ...tagsSimpananRevalidate,
          ...tagsPengambilanSimpananRevalidate,
          ...tagsPengunduranDiriRevalidate,
        ])
      );

      tagsToRevalidate.forEach((tag) => revalidateTag(tag));

      return { ok: true, message: "Refresh Data Berhasil" };
    } else {
      return { ok: false, message: "Refresh Data Gagal" };
    }
  } catch (error) {
    return { ok: false, message: "Refresh Data Gagal" };
  }
};
