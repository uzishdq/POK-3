import * as z from "zod";
import {
  basilSchema,
  enumJenisSimpananBerjangka,
  enumStatusPendaftaran,
  idPengambilanSimpananRegex,
  isUuidSchema,
  validatedJumlah,
  validatedNamaPendaftaranSchema,
} from "./schema-helper";

export const SettingSimpananSchema = z.object({
  namaPendaftaran: validatedNamaPendaftaranSchema(),
  jenisPendaftaranSimpanan: z.enum(enumJenisSimpananBerjangka),
  tanggalTutupSimpanan: z
    .string({ required_error: "Tanggal wajib diisi" })
    .min(1, "Tanggal wajib diisi"),
  tanggalAwalSimpanan: z
    .string({ required_error: "Tanggal wajib diisi" })
    .min(1, "Tanggal wajib diisi"),
  tanggalAkhirSimpanan: z
    .string({ required_error: "Tanggal wajib diisi" })
    .min(1, "Tanggal wajib diisi"),
});

export const SettingSimpananUpdateOrDeleteSchema = z.object({
  idSettingPendaftaran: isUuidSchema,
  namaPendaftaran: validatedNamaPendaftaranSchema(),
  jenisPendaftaranSimpanan: z.enum(enumJenisSimpananBerjangka),
  tanggalTutupSimpanan: z
    .string({ required_error: "Tanggal wajib diisi" })
    .min(1, "Tanggal wajib diisi"),
  tanggalAwalSimpanan: z
    .string({ required_error: "Tanggal wajib diisi" })
    .min(1, "Tanggal wajib diisi"),
  tanggalAkhirSimpanan: z
    .string({ required_error: "Tanggal wajib diisi" })
    .min(1, "Tanggal wajib diisi"),
  statusPendaftaranSimpanan: z.enum(enumStatusPendaftaran),
});

export const PembagianSimpananSchema = z.object({
  id: isUuidSchema,
  basil: basilSchema,
  tanggalPembagian: z
    .string({ required_error: "Tanggal wajib diisi" })
    .min(1, "Tanggal wajib diisi"),
});

export const PendaftaranSimpananSchema = z.object({
  settingPendaftaranId: isUuidSchema,
  jenisSimpanan: z.enum(enumJenisSimpananBerjangka),
  jumlahPilihan: validatedJumlah(15000, 1000000),
});

export const UpdatePendaftaranSimpananSchema = z.object({
  idPendaftar: isUuidSchema,
  jumlahPilihan: validatedJumlah(15000, 1000000),
});

export const noPengambilanSimpananSchema = z
  .string()
  .regex(idPengambilanSimpananRegex, {
    message: "Format kode tidak valid.",
  });
