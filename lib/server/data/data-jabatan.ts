"use server";

import { db } from "@/lib/db";
import { jabatanTable } from "@/lib/db/schema";
import { TJabatan } from "@/lib/types/jabatan";
import { asc, desc } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const getLastIdJabatan = unstable_cache(
  async () => {
    const [lastRecord] = await db
      .select({ id: jabatanTable.noJabatan })
      .from(jabatanTable)
      .orderBy(desc(jabatanTable.noJabatan))
      .limit(1);

    return (lastRecord?.id ?? 0) + 1;
  },
  ["get-last-jabatan"],
  {
    tags: ["get-last-jabatan"],
  }
);

export const getJabatan = unstable_cache(
  async () => {
    try {
      const result = await db
        .select()
        .from(jabatanTable)
        .orderBy(asc(jabatanTable.noJabatan));

      if (result.length > 0) {
        return { ok: true, data: result as TJabatan[] };
      } else {
        return { ok: true, data: [] as TJabatan[] };
      }
    } catch (error) {
      console.error("error data jabatan : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-jabatan"],
  {
    tags: ["get-jabatan"],
  }
);
