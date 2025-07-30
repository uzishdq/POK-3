import * as z from "zod";
import { formatToIDR } from "../helper";
import { validate as isUUID } from "uuid";

const typeImage = ["image/png", "image/jpg", "image/jpeg"];

export const username = z
  .string({
    required_error: "tidak boleh kosong",
  })
  .min(5, "harus berisi setidaknya 5 karakter")
  .max(50, "paling banyak 50 karakter")
  .refine((username) => !/\s/.test(username), {
    message: "tidak boleh menggandung spasi",
  });

export const password = z
  .string({
    required_error: "tidak boleh kosong",
  })
  .min(6, "harus berisi setidaknya 6 karakter")
  .max(50, "paling banyak 50 karakter");

export const nik = z
  .string({
    required_error: "tidak boleh kosong",
  })
  .min(8, "harus berisi setidaknya 8 karakter")
  .max(20, "paling banyak 20 karakter")
  .refine((nik) => !/\s/.test(nik), {
    message: "tidak boleh menggandung spasi",
  });

export const nip = z
  .string()
  .min(8, "harus berisi setidaknya 8 karakter")
  .max(20, "paling banyak 20 karakter")
  .refine((nik) => !/\s/.test(nik), {
    message: "tidak boleh menggandung spasi",
  })
  .optional()
  .or(z.literal(""));

export const allowedRegex = /^[a-zA-Z0-9.,/ \-']+$/;

export const idPinjamanRegex = /^(PR|PB)-\d{6}-\d{3}$/;

export const idPengundurannRegex = /^(PD)-\d{6}-\d{3}$/;

export const idPengambilanSimpananRegex = /^PS-(LB|MA|WB|QB|UB)-\d{6}-\d{3}$/;

export const idPelunasanPinjamanRegex = /^PP-(TF|CH)-\d{6}-\d{3}$/;

export const NumberOrEmptyStringSchema = z.union([
  z.number(),
  z.string(),
  z.literal(""),
]);

export const noAnggotaSchema = z
  .string({ required_error: "tidak boleh kosong" })
  .min(1, "No Anggota tidak boleh kosong")
  .regex(/^A-\d{3}$/, {
    message: "Format harus 'A-xxx' dengan xxx adalah angka 3 digit",
  });

export const validatedStringSchema = (min = 5, max = 50) =>
  z
    .string({ required_error: "tidak boleh kosong" })
    .min(min, `minimal ${min} karakter`)
    .max(max, `maksimal ${max} karakter`)
    .regex(
      allowedRegex,
      "Hanya boleh huruf, angka, spasi, titik, koma, dan slash"
    );

export const basilSchema = z
  .string()
  .refine(
    (val) => {
      // Pastikan hanya angka desimal valid tanpa leading zero kecuali 0.xxx
      const pattern = /^(0(\.\d+)?|[1-9]\d{0,2}(\.\d+)?|100(\.0+)?)$/;
      return pattern.test(val);
    },
    {
      message: "Masukkan angka valid antara 0.1 dan 100 tanpa nol di depan",
    }
  )
  .refine(
    (val) => {
      const num = parseFloat(val);
      return num >= 0.1 && num <= 100;
    },
    {
      message: "Persentase harus antara 0.1% dan 100%",
    }
  );

export const validatedNamaPendaftaranSchema = (min = 5, max = 50) =>
  z
    .string({ required_error: "tidak boleh kosong" })
    .min(min, `minimal ${min} karakter`)
    .max(max, `maksimal ${max} karakter`)
    .regex(
      allowedRegex,
      "Hanya boleh huruf, angka, spasi, titik, koma, dan slash"
    )
    .refine((val) => val.toLowerCase().includes("tabungan"), {
      message: 'Harus mengandung kata "tabungan"',
    })
    .refine((val) => /\d{3,4}H/.test(val), {
      message: 'Harus mengandung tahun hijriah seperti "1446H"',
    });

export const validatedPhonrSchema = z
  .string({
    required_error: "Nomor telepon tidak boleh kosong",
  })
  .min(10, {
    message: "Nomor telepon harus terdiri setidaknya dari 10 karakter",
  })
  .max(15, { message: "Nomor telepon tidak boleh lebih dari 15 karakter" })
  .regex(/^[0-9]+$/, {
    message: "Nomor telepon hanya boleh mengandung angka",
  })
  .refine((value) => value.startsWith("0"), {
    message: "Nomor telepon harus dimulai dengan angka 0",
  });

export const validatedSukamana = z
  .number({
    invalid_type_error: "harus angka",
    required_error: "harus angka",
  })
  .refine((n) => (n >= 15000 && n <= 750000) || n === 0, {
    message: "simpanan sukamana hanya di antara Rp 15.000 dan Rp 750.000",
  })
  .optional();

export const validatedJumlah = (min = 0, max = 50000000) =>
  z
    .number({
      invalid_type_error: "harus angka",
      required_error: "harus angka",
    })
    .refine(
      (n) => {
        const allowZero = min === 0;
        return (n >= min && n <= max) || (allowZero && n === 0);
      },
      {
        message: `jumlah hanya di antara ${formatToIDR(min)} dan ${formatToIDR(
          max
        )}`,
      }
    );

export const validatedPengambilanJumlah = (
  min = 50000,
  max = 50000000,
  type: string
) =>
  z
    .number({
      invalid_type_error: "harus angka",
      required_error: "harus angka",
    })
    .refine(
      (n) => {
        const allowZero = min === 0;
        return (n >= min && n <= max) || (allowZero && n === 0);
      },
      {
        message:
          max === 0
            ? `maaf anda tidak dapat melakukan penarikan simpanan ${type} karena saldo anda ${formatToIDR(
                max
              )}`
            : max <= 50000
            ? `maaf anda tidak dapat melakukan penarikan simpanan ${type} karena saldo anda ${formatToIDR(
                max
              )} atau kurang dari Rp 50.000, coba jenis simpanan yang lain.`
            : `jumlah minimal penarikan simpanan ${type} Rp 50.000 dan maksimal ${formatToIDR(
                max
              )}`,
      }
    );

export const validatedWaktuPinjaman = (min = 0, max = 60) =>
  z.number().refine(
    (n) => {
      const allowZero = min === 0;
      return (n >= min && n <= max) || (allowZero && n === 0);
    },
    {
      message: `waktu hanya boleh antara ${min} dan ${max}, bulan`,
    }
  );

export const validatedSelectNumber = z
  .string({ required_error: "tidak boleh kosong" })
  .min(1, { message: "tidak boleh kosong" })
  .transform((val) => Number(val))
  .refine((val) => !isNaN(val) && val >= 1, {
    message: "tidak boleh kosong",
  });

export const inputFilePic = z
  .custom<File>()
  .refine((file) => {
    return !!file && typeImage.includes(file.type);
  }, "file harus berupa image")
  .refine((file) => {
    return !!file && file.size < 1024 * 1024 * 2;
  }, "ukuran maksimal file 2MB");

export const isUuidSchema = z.string().refine((val) => isUUID(val), {
  message: "ID tidak valid",
});

export const enumJenisKelamin = ["PRIA", "WANITA"] as const;

export const enumStatusPekerjaan = ["TETAP", "HONORER", "KONTRAK"] as const;

export const enumStatusAnggota = ["ACTIVE", "NOTACTIVE"] as const;

export const enumRole = ["ADMIN", "USER", "BENDAHARA", "SEKRETARIS"] as const;

export const enumJenisSimpananBerjangka = [
  "LEBARAN",
  "QURBAN",
  "UBAR",
] as const;

export const enumJenisPengambilanSimpanan = [
  "SUKAMANA",
  "LEBARAN",
  "QURBAN",
  "UBAR",
] as const;

export const enumStatusPengambilanSimpanan = [
  "PENDING",
  "APPROVED",
  "REJECTED",
] as const;

export const enumStatusPendaftaran = ["OPEN", "CLOSE"] as const;

export const enumPinjaman = ["PRODUKTIF", "BARANG"] as const;
export const enumStatusPinjaman = [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "COMPLETED",
] as const;

export const enumJenisPelunasanPinjaman = ["CASH", "TRANSFER"] as const;
export const enumStatusPelunasanPinjaman = [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "COMPLETED",
] as const;

export const enumStatusPengunduran = [
  "PENDING",
  "APPROVED",
  "REJECTED",
] as const;
