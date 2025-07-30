"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { LABEL } from "@/lib/constan";
import {
  ResetPasswordAnggotaSchema,
  ResetPasswordSchema,
  ResetUsernameAnggotaSchema,
  ValidasiResetPasswordSchema,
} from "@/lib/schema/schema-auth";
import { getMasterByNik } from "../data/data-master";
import { db } from "@/lib/db";
import { anggotaTable, masterTable, userTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export const validasiResetPassword = async (
  values: z.infer<typeof ValidasiResetPasswordSchema>
) => {
  try {
    const validateValues = ValidasiResetPasswordSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    const { nik, username } = validateValues.data;

    const isMaster = await getMasterByNik(nik);

    if (!isMaster) {
      return {
        ok: false,
        message: "no.ktp / nip tidak terdaftar",
      };
    }

    const isNikValid =
      nik === isMaster.nikMaster ||
      (isMaster.nipMaster ? nik === isMaster.nipMaster : false);

    if (isMaster.username !== username || !isNikValid) {
      return {
        ok: false,
        message: "no.ktp / nip tidak sesuai dengan username",
      };
    } else {
      return {
        ok: true,
        message: "verifikasi berhasil, silahkan ganti password",
      };
    }
  } catch (error) {
    console.error("error verifikasi reset password : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};

export const ResetForgetPassword = async (
  values: z.infer<typeof ResetPasswordSchema>
) => {
  try {
    const validateValues = ResetPasswordSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    const { username, password } = validateValues.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db
      .update(userTable)
      .set({ password: hashedPassword })
      .where(eq(userTable.username, username))
      .returning();

    if (result.length > 0) {
      return {
        ok: true,
        message: "reset password berhasil",
      };
    } else {
      return {
        ok: false,
        message: "reset password gagal",
      };
    }
  } catch (error) {
    console.error("error reset forget password : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};

export const ResetPasswordAnggota = async (
  values: z.infer<typeof ResetPasswordAnggotaSchema>
) => {
  try {
    const session = await auth();

    if (!session?.user.noAnggota || !session?.user.id) {
      return {
        ok: false,
        message: LABEL.ERROR.NOT_LOGIN,
      };
    }

    const validateValues = ResetPasswordAnggotaSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    const { prevPassword, newPassword } = validateValues.data;

    const [user] = await db
      .select({
        password: userTable.password,
      })
      .from(userTable)
      .where(eq(userTable.idUser, session.user.id))
      .limit(1);

    if (!user) {
      return {
        ok: false,
        message: LABEL.ERROR.SERVER,
      };
    }

    const [isMatchPrev, isSameAsOld, newHashedPassword] = await Promise.all([
      bcrypt.compare(prevPassword, user.password), // Apakah password lama cocok?
      bcrypt.compare(newPassword, user.password), // Apakah password baru sama?
      bcrypt.hash(newPassword, 10),
    ]);

    if (!isMatchPrev) {
      return {
        ok: false,
        message: "Password lama tidak sesuai.",
      };
    }

    if (isSameAsOld) {
      return {
        ok: false,
        message: "Password baru tidak boleh sama dengan Password sebelumnya.",
      };
    }

    const result = await db
      .update(userTable)
      .set({ password: newHashedPassword })
      .where(eq(userTable.idUser, session.user.id))
      .returning();

    if (result.length > 0) {
      return {
        ok: true,
        message: "Reset password berhasil",
      };
    } else {
      return {
        ok: false,
        message: "Reset password gagal",
      };
    }
  } catch (error) {
    console.error("error reset password : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};

export const ResetUsernameAnggota = async (
  values: z.infer<typeof ResetUsernameAnggotaSchema>
) => {
  try {
    const session = await auth();
    const noAnggota = session?.user?.noAnggota;
    const idUser = session?.user?.id;

    if (!noAnggota || !idUser || !session?.user.email) {
      return {
        ok: false,
        message: LABEL.ERROR.NOT_LOGIN,
      };
    }

    const validateValues = ResetUsernameAnggotaSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: "Invalid field!" };
    }

    const { prevUsername, newUsername } = validateValues.data;

    if (session.user.email !== prevUsername) {
      return {
        ok: false,
        message: "username lama tidak sesuai dengan username saat ini.",
      };
    }

    if (prevUsername === newUsername) {
      return {
        ok: false,
        message: "username baru harus berbeda dari username lama.",
      };
    }

    // cek apakah username sudah pernah di pakai ?
    const existing = await db.query.masterTable.findFirst({
      where: (u, { eq }) => eq(u.username, newUsername),
      columns: {
        username: true,
      },
    });

    if (existing) {
      return {
        ok: false,
        message: "Username sudah dipakai, Coba Username lain",
      };
    }

    const result = await db.transaction(async (tx) => {
      // Update di tabel users
      await tx
        .update(userTable)
        .set({ username: newUsername })
        .where(eq(userTable.idUser, idUser));

      // Update di tabel anggota
      await tx
        .update(anggotaTable)
        .set({ username: newUsername })
        .where(eq(anggotaTable.noAnggota, noAnggota));

      // Update di tabel master
      await tx
        .update(masterTable)
        .set({ username: newUsername })
        .where(eq(masterTable.username, prevUsername));
      return true;
    });

    if (!result) {
      return { ok: false, message: "Gagal memperbarui username." };
    }

    return { ok: true, message: "Username berhasil diperbarui." };
  } catch (error) {
    console.error("error reset username : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};
