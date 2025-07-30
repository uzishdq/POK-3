"use server";

import { db } from "@/lib/db";
import { unitKerjaTable } from "@/lib/db/schema";
import { TUnitKerja } from "@/lib/types/unit-kerja";
import { asc, desc } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const getLastIdUnitKerja = unstable_cache(
  async () => {
    const [lastRecord] = await db
      .select({ id: unitKerjaTable.noUnitKerja })
      .from(unitKerjaTable)
      .orderBy(desc(unitKerjaTable.noUnitKerja))
      .limit(1);

    return (lastRecord?.id ?? 0) + 1;
  },
  ["get-last-unit-kerja"],
  {
    tags: ["get-last-unit-kerja"],
  }
);

export const getUnitKerja = unstable_cache(
  async () => {
    try {
      const result = await db
        .select()
        .from(unitKerjaTable)
        .orderBy(asc(unitKerjaTable.noUnitKerja));

      if (result.length > 0) {
        return { ok: true, data: result as TUnitKerja[] };
      } else {
        return { ok: true, data: [] as TUnitKerja[] };
      }
    } catch (error) {
      console.error("error data unit kerja : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-unit-kerja"],
  {
    tags: ["get-unit-kerja"],
  }
);
