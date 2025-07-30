import * as z from "zod";
import {
  enumJenisKelamin,
  enumStatusPekerjaan,
  nik,
  nip,
  validatedStringSchema,
} from "./schema-helper";

export const MasterSchema = z.object({
  nikMaster: nik,
  nipMaster: nip,
  namaMaster: validatedStringSchema(5, 50),
  tanggalLahirMaster: z
    .string({ required_error: "Tanggal wajib diisi" })
    .min(1, "Tanggal wajib diisi"),
  tempatLahirMaster: validatedStringSchema(5, 50),
  jenisKelaminMaster: z.enum(enumJenisKelamin, {
    required_error: "tidak boleh kosong",
  }),
  alamatMaster: validatedStringSchema(5, 100),
  statusPekerjaan: z.enum(enumStatusPekerjaan, {
    required_error: "tidak boleh kosong",
  }),
  jabatanId: z
    .string({ required_error: "tidak boleh kosong" })
    .min(1, "jabatan harus dipilih"),
  unitKerjaId: z
    .string({ required_error: "tidak boleh kosong" })
    .min(1, "unit kerja harus dipilih"),
});

export const MasterUpdateOrDeleteSchema = z.object({
  idMaster: z
    .string({ required_error: "tidak boleh kosong" })
    .min(1, "tidak boleh kosong"),
  nikMaster: nik,
  nipMaster: nip,
  namaMaster: validatedStringSchema(5, 50),
  tanggalLahirMaster: z
    .string({ required_error: "Tanggal wajib diisi" })
    .min(1, "Tanggal wajib diisi"),
  tempatLahirMaster: validatedStringSchema(5, 50),
  jenisKelaminMaster: z.enum(enumJenisKelamin, {
    required_error: "tidak boleh kosong",
  }),
  alamatMaster: validatedStringSchema(5, 100),
  statusPekerjaan: z.enum(enumStatusPekerjaan, {
    required_error: "tidak boleh kosong",
  }),
  jabatanId: z
    .number({ required_error: "tidak boleh kosong" })
    .min(1, "jabatan harus dipilih"),
  unitKerjaId: z
    .number({ required_error: "tidak boleh kosong" })
    .min(1, "unit kerja harus dipilih"),
});
