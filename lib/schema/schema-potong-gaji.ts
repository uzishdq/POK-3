import * as z from "zod";
import {
  noAnggotaSchema,
  validatedJumlah,
  validatedStringSchema,
  validatedWaktuPinjaman,
} from "./schema-helper";

const typeExcell = [
  "application/vnd.ms-excel", // .xls
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
];

const inputFile = z
  .custom<File>()
  .refine((file) => {
    return !!file && typeExcell.includes(file.type);
  }, "hanya file .xlsx atau .xls yang diperbolehkan")
  .refine((file) => {
    return !!file && file.size < 1024 * 1024 * 5;
  }, "ukuran maksimal file 5MB");

export const InputPotongGajiSchema = z.object({
  file: inputFile,
});

export const RowValidationSchema = z.object({
  noAnggota: noAnggotaSchema,
  namaAnggota: validatedStringSchema(1, 100),
  namaUnitKerja: validatedStringSchema(5, 50),
  simpananWajib: validatedJumlah(),
  simpananSukamana: validatedJumlah(),
  simpananLebaran: validatedJumlah(),
  simpananQurban: validatedJumlah(),
  simpananUbar: validatedJumlah(),
  pinjamanProduktif: validatedStringSchema(1, 20),
  angsuranKeProduktif: validatedWaktuPinjaman(),
  angsuranDariProduktif: validatedWaktuPinjaman(),
  jumlahAngsuranProduktif: validatedJumlah(),
  pinjamanBarang: validatedStringSchema(1, 20),
  angsuranKeBarang: validatedWaktuPinjaman(),
  angsuranDariBarang: validatedWaktuPinjaman(),
  jumlahAngsuranBarang: validatedJumlah(),
  totalPotongan: validatedJumlah(),
});

export const RowsValidationSchema = z.array(RowValidationSchema);
