import * as z from "zod";
import {
  enumPinjaman,
  enumStatusPinjaman,
  idPinjamanRegex,
  inputFilePic,
  noAnggotaSchema,
  validatedJumlah,
  validatedStringSchema,
  validatedWaktuPinjaman,
} from "./schema-helper";

const createPengajuanPinjamanSchema = (limit: number) =>
  z.object({
    noAnggota: noAnggotaSchema,
    tujuanPinjaman: validatedStringSchema(5, 50),
    waktuPengembalian: validatedWaktuPinjaman(5, 36),
    jenisPinjaman: z.enum(enumPinjaman, {
      required_error: "tidak boleh kosong",
    }),
    ajuanPinjaman: validatedJumlah(50000, limit),
    strukGaji: inputFilePic,
    jumlahPenghasilan: validatedJumlah(50000, 20000000),
  });

export const PengajuanPinjamanSchema = createPengajuanPinjamanSchema;

export const noPinjamanSchema = z
  .string()
  .min(1, "No Pinjaman tidak boleh kosong")
  .regex(idPinjamanRegex, {
    message: "Format kode tidak valid.",
  });

export const UpdateStatusPinjamanSchema = z.object({
  pinjamanId: noPinjamanSchema,
  noAnggota: noAnggotaSchema,
  jenisPinjaman: z.enum(enumPinjaman, {
    required_error: "tidak boleh kosong",
  }),
  action: z.enum(enumStatusPinjaman, {
    required_error: "tidak boleh kosong",
  }),
});
