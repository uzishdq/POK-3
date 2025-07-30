"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/lib/schema/schema-auth";
import { getMasterByNik } from "../data/data-master";
import { db } from "@/lib/db";
import { anggotaTable, masterTable, userTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateCustomID, getUserByUsername } from "../data/data-user";
import { revalidateTag } from "next/cache";
import {
  LABEL,
  tagsAnggotaRevalidate,
  tagsMasterRevalidate,
  tagsPotonganRevalidate,
} from "@/lib/constan";

export const createRegister = async (
  values: z.infer<typeof RegisterSchema>
) => {
  try {
    const validateValues = RegisterSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    const { nik, username, password } = validateValues.data;

    const [isMaster, isUsed] = await Promise.all([
      getMasterByNik(nik),
      getUserByUsername(username),
    ]);

    if (isUsed !== null) {
      return { ok: false, message: `Username : '${username}' sudah terpakai` };
    }

    if (!isMaster) {
      return {
        ok: false,
        message: "no.ktp / nip tidak terdaftar",
      };
    }

    if (isMaster.username !== null) {
      return { ok: false, message: "no.ktp / nip sudah terpakai" };
    }

    if (isMaster.username === username) {
      return { ok: false, message: "username sudah terpakai" };
    }

    const result = await db.transaction(async (tx) => {
      // Update masterTable: isi username
      const updateMasterEmail = await tx
        .update(masterTable)
        .set({ username })
        .where(eq(masterTable.idMaster, isMaster.idMaster))
        .returning();

      if (!updateMasterEmail || updateMasterEmail.length === 0) {
        throw new Error("Gagal update master");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Buat user login
      const createUser = await tx
        .insert(userTable)
        .values({ username, password: hashedPassword })
        .returning();

      if (!createUser || createUser.length === 0) {
        throw new Error("Gagal buat user");
      }

      // Generate custom ID anggota
      const customId = await generateCustomID();

      // Insert anggota
      const insertAnggota = await tx
        .insert(anggotaTable)
        .values({
          noAnggota: customId,
          nikAnggota: isMaster.nikMaster,
          nipAnggota: isMaster.nipMaster,
          namaAnggota: isMaster.namaMaster,
          tanggalLahirAnggota: isMaster.tanggalLahirMaster,
          tempatLahirAnggota: isMaster.tempatLahirMaster,
          jenisKelaminAnggota: isMaster.jenisKelaminMaster,
          alamatAnggota: isMaster.alamatMaster,
          statusPekerjaan: isMaster.statusPekerjaan,
          jabatanId: isMaster.jabatanId,
          unitKerjaId: isMaster.unitKerjaId,
          username,
        })
        .returning();

      if (!insertAnggota || insertAnggota.length === 0) {
        throw new Error("Gagal insert anggota");
      }

      return { ok: true };
    });

    if (!result.ok) {
      return {
        ok: false,
        message: "registrasi gagal",
      };
    }

    const tagsToRevalidate = Array.from(
      new Set([
        ...tagsAnggotaRevalidate,
        ...tagsMasterRevalidate,
        ...tagsPotonganRevalidate,
      ])
    );

    tagsToRevalidate.forEach((tag) => revalidateTag(tag));

    return {
      ok: true,
      message: "registrasi berhasil",
    };
  } catch (error) {
    console.error("error registrasi : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};
