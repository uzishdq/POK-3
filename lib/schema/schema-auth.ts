import * as z from "zod";
import { nik, password, username } from "./schema-helper";

export const LoginSchema = z.object({
  username: username,
  password: password,
});

export const RegisterSchema = z
  .object({
    nik: nik,
    username: username,
    password: password,
    confirmPassword: z
      .string({
        required_error: "tidak boleh kosong",
      })
      .min(6, "harus berisi setidaknya 6 karakter"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "password tidak sama !",
    path: ["confirmPassword"],
  });

export const ValidasiResetPasswordSchema = z.object({
  nik: nik,
  username: username,
});

export const ResetPasswordSchema = z
  .object({
    username: username,
    password: password,
    confirmPassword: z
      .string({ required_error: "tidak boleh kosong" })
      .min(6, "harus terdiri setidaknya 6 karakter"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "password tidak sama !",
    path: ["confirmPassword"],
  });

export const ResetUsernameAnggotaSchema = z.object({
  prevUsername: username,
  newUsername: username,
});

export const ResetPasswordAnggotaSchema = z
  .object({
    prevPassword: password,
    newPassword: password,
    newConfirmPassword: z
      .string({ required_error: "tidak boleh kosong" })
      .min(6, "harus terdiri setidaknya 6 karakter"),
  })
  .refine((data) => data.newPassword === data.newConfirmPassword, {
    message: "password tidak sama !",
    path: ["newConfirmPassword"],
  });
