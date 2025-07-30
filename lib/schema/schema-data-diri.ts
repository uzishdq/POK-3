import * as z from "zod";
import {
  allowedRegex,
  validatedPhonrSchema,
  validatedSukamana,
} from "./schema-helper";

export const DataDiriSchema = z.object({
  noTelp: validatedPhonrSchema,
  namaBank: z
    .string({
      required_error: "tidak boleh kosong",
    })
    .min(2, "harus terdiri setidaknya 2 karakter")
    .max(10, "tidak boleh lebih dari 10 karakter")
    .regex(
      allowedRegex,
      "Hanya boleh huruf, angka, spasi, titik, koma, dan slash"
    ),
  noRek: z
    .string({
      required_error: "tidak boleh kosong",
    })
    .min(10, { message: "harus terdiri setidaknya 10 karakter" })
    .max(20, { message: "tidak boleh lebih dari 20 karakter" })
    .regex(allowedRegex, {
      message: "Hanya boleh huruf, angka, spasi, titik, koma, dan slash",
    }),
  pilManasuka: validatedSukamana,
});
