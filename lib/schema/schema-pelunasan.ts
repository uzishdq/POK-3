import * as z from "zod";
import {
  enumJenisPelunasanPinjaman,
  enumStatusPelunasanPinjaman,
  idPelunasanPinjamanRegex,
  idPinjamanRegex,
  inputFilePic,
  validatedJumlah,
  validatedWaktuPinjaman,
} from "./schema-helper";
import { noPinjamanSchema } from "./schema-pinjaman";

export const noPelunasanPinjamanSchema = z
  .string({ required_error: "tidak boleh kosong" })
  .min(1, "No Pelunasan tidak boleh kosong")
  .regex(idPelunasanPinjamanRegex, {
    message: "Format kode tidak valid.",
  });

export const cekPelunasanSchema = z.object({
  pinjamanId: z
    .string()
    .min(5, "harus terdiri setidaknya 5 karakter")
    .max(15, "paling banyak 15 karakter")
    .regex(idPinjamanRegex, {
      message: "Format kode tidak valid.",
    }),
});

export const createPelunasanPinjaman = z.object({
  pinjamanId: noPinjamanSchema,
  jenisPelunasanPinjaman: z.enum(enumJenisPelunasanPinjaman, {
    required_error: "tidak boleh kosong",
  }),
  buktiPelunasan: inputFilePic,
  angsuranKePelunasanPinjaman: validatedWaktuPinjaman(0, 36),
  sudahDibayarkan: validatedJumlah(0, 100000000),
  jumlahPelunasanPinjaman: validatedJumlah(50000, 100000000),
});

export const UpdatePelunasanPinjamanSchema = z.object({
  noPelunasanPinjaman: noPelunasanPinjamanSchema,
  pinjamanId: noPinjamanSchema,
  angsuranKePelunasanPinjaman: validatedWaktuPinjaman(0, 36),
  jumlahPelunasanPinjaman: validatedJumlah(50000, 100000000),
  action: z.enum(enumStatusPelunasanPinjaman, {
    required_error: "tidak boleh kosong",
  }),
});
