import * as z from "zod";
import { validatedStringSchema } from "./schema-helper";

export const UnitKerjaSchema = z.object({
  namaUnitKerja: validatedStringSchema(),
  alamatUnitKerja: validatedStringSchema(5, 100),
});

export const UnitKerjaUpdateOrDeleteSchema = z.object({
  noUnitKerja: z.number().min(1),
  namaUnitKerja: validatedStringSchema(),
  alamatUnitKerja: validatedStringSchema(5, 100),
});
