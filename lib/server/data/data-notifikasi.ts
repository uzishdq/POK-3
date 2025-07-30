"use server";

import { db } from "@/lib/db";
import { notificationsTable } from "@/lib/db/schema";
import { TGetNotifikasi } from "@/lib/types/notifikasi";
import { desc } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const getNotifikasi = unstable_cache(
  async () => {
    try {
      const result = await db
        .select()
        .from(notificationsTable)
        .orderBy(desc(notificationsTable.tanggalNotification));

      if (result.length > 0) {
        return { ok: true, data: result as TGetNotifikasi[] };
      } else {
        return { ok: true, data: [] as TGetNotifikasi[] };
      }
    } catch (error) {
      console.error("error data jabatan : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-notifikasi"],
  {
    tags: ["get-notifikasi"],
  }
);
