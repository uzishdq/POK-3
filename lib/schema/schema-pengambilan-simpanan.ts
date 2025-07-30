import * as z from "zod";
import {
  enumJenisPengambilanSimpanan,
  enumStatusPengambilanSimpanan,
  idPengambilanSimpananRegex,
  noAnggotaSchema,
  validatedPengambilanJumlah,
} from "./schema-helper";

export const noPengambilanSimpananSchema = z
  .string({ required_error: "tidak boleh kosong" })
  .min(1, "No Pelunasan tidak boleh kosong")
  .regex(idPengambilanSimpananRegex, {
    message: "Format kode tidak valid.",
  });

const createPengambilanSimpananSchema = (limit: number, type: string) =>
  z.object({
    noAnggota: noAnggotaSchema,
    jenisPengambilanSimpanan: z.enum(enumJenisPengambilanSimpanan, {
      required_error: "tidak boleh kosong",
    }),
    jumlahPengambilanSimpanan: validatedPengambilanJumlah(50000, limit, type),
  });

export const PengambilanSimpananSchema = createPengambilanSimpananSchema;

export const UpdateStatusPengambilanSimpananSchema = z.object({
  noPengambilanSimpanan: noPengambilanSimpananSchema,
  noAnggota: noAnggotaSchema,
  jenisPengambilanSimpanan: z.enum(enumJenisPengambilanSimpanan, {
    required_error: "tidak boleh kosong",
  }),
  action: z.enum(enumStatusPengambilanSimpanan, {
    required_error: "tidak boleh kosong",
  }),
});
