"use server";
import * as z from "zod";
import { LoginSchema } from "@/lib/schema/schema-auth";
import { db } from "@/lib/db";
import { anggotaTable, userTable } from "@/lib/db/schema";
import { and, eq, not, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const isUser = async (values: z.infer<typeof LoginSchema>) => {
  try {
    const validateValues = LoginSchema.safeParse(values);

    if (!validateValues.success) {
      return null;
    }

    const [user] = await db
      .select({
        idUser: userTable.idUser,
        noAnggota: anggotaTable.noAnggota,
        nama: anggotaTable.namaAnggota,
        username: userTable.username,
        password: userTable.password,
        role: userTable.role,
        statusUser: userTable.statusUser,
      })
      .from(userTable)
      .leftJoin(anggotaTable, eq(userTable.username, anggotaTable.username))
      .where(
        and(
          eq(userTable.username, validateValues.data.username),
          not(eq(userTable.statusUser, "REJECTED"))
        )
      )
      .limit(1);

    if (!user) return null;

    const isValid = await bcrypt.compare(
      validateValues.data.password,
      user.password
    );

    if (!isValid) {
      return null;
    }

    const { password, ...userWithoutPass } = user;

    return userWithoutPass;
  } catch (error) {
    console.error("error isUser : ", error);
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const [user] = await db
      .select({
        idUser: userTable.idUser,
        noAnggota: anggotaTable.noAnggota,
        nama: anggotaTable.namaAnggota,
        username: userTable.username,
        role: userTable.role,
        statusUser: userTable.statusUser,
      })
      .from(userTable)
      .leftJoin(anggotaTable, eq(userTable.username, anggotaTable.username))
      .where(eq(userTable.username, id))
      .limit(1);

    if (!user) return null;

    return user;
  } catch (error) {
    console.error("error user by id : ", error);
    return null;
  }
};

export const getUserByUsername = async (username: string) => {
  try {
    const [user] = await db
      .select({
        username: userTable.username,
      })
      .from(userTable)
      .where(eq(userTable.username, username))
      .limit(1);

    if (!user) return null;

    return user;
  } catch (error) {
    console.error("error user username : ", error);
    return null;
  }
};

export async function generateCustomID() {
  const [result] = await db
    .select({ maxNo: sql<string>`max(${anggotaTable.noAnggota})` })
    .from(anggotaTable);

  const maxID = result.maxNo || "A-000";
  const currentNumber = parseInt(maxID.split("-")[1], 10);
  const nextNumber = currentNumber + 1;
  const nextID = `A-${nextNumber.toString().padStart(3, "0")}`;

  return nextID;
}
