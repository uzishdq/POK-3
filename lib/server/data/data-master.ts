"use server";

import { db } from "@/lib/db";
import { masterTable } from "@/lib/db/schema";
import { TMaster } from "@/lib/types/master";
import { eq, or } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const getMasterByNik = async (value: string) => {
  try {
    const [user] = await db
      .select()
      .from(masterTable)
      .where(
        or(eq(masterTable.nikMaster, value), eq(masterTable.nipMaster, value))
      )
      .limit(1);

    if (!user) return null;

    return user;
  } catch (error) {
    console.error("error data master : ", error);
    return null;
  }
};

export const getMaster = unstable_cache(
  async () => {
    try {
      const result = await db.select().from(masterTable);

      if (result.length > 0) {
        return { ok: true, data: result as TMaster[] };
      } else {
        return { ok: true, data: [] as TMaster[] };
      }
    } catch (error) {
      console.error("error data unit kerja : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-master"],
  {
    tags: ["get-master"],
  }
);
