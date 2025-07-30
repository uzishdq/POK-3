import * as z from "zod";
import { enumPinjaman, enumStatusPinjaman } from "./schema-helper";

export const laporanPinjamanSchema = z.object({
  jenisPinjaman: z.enum(enumPinjaman, {
    required_error: "tidak boleh kosong",
  }),
  statusPinjaman: z.enum(enumStatusPinjaman, {
    required_error: "tidak boleh kosong",
  }),
});

export const laporanSimpananSchema = z.object({
  noPendaftaran: z
    .string()
    .uuid({ message: "ID harus berupa UUID yang valid" }),
});
