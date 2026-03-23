import * as z from "zod";
import {
  enumPinjaman,
  enumStatusPinjaman,
  idPinjamanRegex,
  inputFilePic,
  inputFilePicOpt,
  noAnggotaSchema,
  validatedJumlah,
  validatedJumlahMin,
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

const tambahAngsuranSchema = z
  .array(
    z.object({
      tanggalAngsuran: z
        .string({ required_error: "Tanggal wajib diisi" })
        .min(1, "Tanggal wajib diisi")
        .date("Format tanggal tidak valid"),
      keAngsuran: z
        .number({ required_error: "Angsuran ke wajib diisi" })
        .min(1, "Minimal angsuran ke-1"),
      jumlahAngsuran: validatedJumlahMin(50000),
    }),
  )
  .optional();

const tambahPinjamanSchema = (limit: number) =>
  z
    .object({
      noAnggota: noAnggotaSchema,
      tujuanPinjaman: validatedStringSchema(5, 50),
      tanggalPinjaman: z
        .string({ required_error: "Tanggal wajib diisi" })
        .min(1, "Tanggal wajib diisi")
        .date("Format tanggal tidak valid"),
      waktuPengembalian: validatedWaktuPinjaman(5, 36),
      jenisPinjaman: z.enum(enumPinjaman, {
        required_error: "tidak boleh kosong",
      }),
      ajuanPinjaman: validatedJumlah(50000, limit),
      strukGaji: inputFilePicOpt,
      jumlahPenghasilan: validatedJumlah(50000, 20000000),
      isAngsuran: z.boolean({ required_error: "Pilihan wajib diisi" }),
      angsuran: tambahAngsuranSchema,
    })
    .refine(
      (data) => {
        if (data.isAngsuran && (!data.angsuran || data.angsuran.length === 0)) {
          return false;
        }
        return true;
      },
      { message: "Minimal 1 angsuran wajib diisi", path: ["angsuran"] },
    )
    .refine(
      (data) => {
        if (!data.angsuran || data.angsuran.length === 0) return true;
        return data.angsuran.every((item) => item.keAngsuran <= data.waktuPengembalian);
      },
      {
        message: "Angsuran ke tidak boleh melebihi waktu pengembalian",
        path: ["angsuran"],
      },
    )
    .superRefine((data, ctx) => {
      if (!data.angsuran || data.angsuran.length === 0) return;
      data.angsuran.forEach((item, index) => {
        if (item.jumlahAngsuran > data.ajuanPinjaman) {
          ctx.addIssue({
            code: z.ZodIssueCode.too_big,
            maximum: data.ajuanPinjaman,
            type: "number",
            inclusive: true,
            message: `Jumlah angsuran tidak boleh melebihi besaran pinjaman (Rp ${data.ajuanPinjaman.toLocaleString("id-ID")})`,
            path: ["angsuran", index, "jumlahAngsuran"],
          });
        }
      });
    });

export const TambahPinjamanSchema = tambahPinjamanSchema;

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
