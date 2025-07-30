import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/lib/db/schema";

const client = postgres(process.env.DATABASE_URL!, { ssl: "require" });
export const db = drizzle(client, { schema });
