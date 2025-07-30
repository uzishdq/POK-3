import * as z from "zod";
import {
  enumJenisKelamin,
  enumStatusPekerjaan,
  nik,
  nip,
  validatedPhonrSchema,
  validatedStringSchema,
  validatedSukamana,
} from "./schema-helper";

export const ProfileSchema = z.object({
  nikAnggota: nik,
  nipAnggota: nip,
  namaAnggota: validatedStringSchema(5, 50),
  tanggalLahirAnggota: z
    .string({ required_error: "Tanggal wajib diisi" })
    .min(1, "Tanggal wajib diisi"),
  tempatLahirAnggota: validatedStringSchema(5, 50),
  jenisKelaminAnggota: z.enum(enumJenisKelamin),
  alamatAnggota: validatedStringSchema(5, 100),
  noTelpAnggota: validatedPhonrSchema,
  statusPekerjaan: z.enum(enumStatusPekerjaan),
  jabatanId: z.number().min(1, "jabatan harus dipilih"),
  unitKerjaId: z.number().min(1, "unit kerja harus dipilih"),
  bankAnggota: validatedStringSchema(2, 50),
  rekeningAnggota: validatedStringSchema(10, 20),
  pilihanSukamana: validatedSukamana,
});
