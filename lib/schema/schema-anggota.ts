import * as z from "zod";
import {
  enumRole,
  enumStatusAnggota,
  enumStatusPengunduran,
  idPengundurannRegex,
  noAnggotaSchema,
  validatedStringSchema,
} from "./schema-helper";

export const AnggotaUpdateOrDeleteSchema = z.object({
  noAnggota: noAnggotaSchema,
  idUser: validatedStringSchema(5, 100),
  statusAnggota: z.enum(enumStatusAnggota),
  role: z.enum(enumRole),
});

export const ValidasiUndurDiriSchema = z.object({
  keterangan: validatedStringSchema(5, 50),
});

export const noPengunduranSchema = z
  .string()
  .min(1, "No Pengunduran tidak boleh kosong")
  .regex(idPengundurannRegex, {
    message: "Format kode tidak valid.",
  });

export const UndurDiriUpdateOrDeleteSchema = z.object({
  noPengunduran: noPengunduranSchema,
  action: z.enum(enumStatusPengunduran, {
    required_error: "tidak boleh kosong",
  }),
});
