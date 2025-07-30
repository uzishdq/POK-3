import * as z from "zod";
import { validatedStringSchema } from "./schema-helper";

export const JabatanSchema = z.object({
  namaJabatan: validatedStringSchema(),
});

export const JabatanUpdateOrDeleteSchema = z.object({
  noJabatan: z.number().min(1),
  namaJabatan: validatedStringSchema(),
});
