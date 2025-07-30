import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { isUser } from "./lib/server/data/data-user";
import { LoginSchema } from "./lib/schema/schema-auth";

export default {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: {
          label: "username",
          type: "text",
        },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        let user = null;
        const validateFields = LoginSchema.safeParse(credentials);

        if (!validateFields.success) {
          return user;
        }

        user = await isUser(validateFields.data);

        if (!user) return null;

        return {
          id: user.idUser,
          noAnggota: user.noAnggota,
          name: user.nama,
          email: user.username,
          role: user.role,
          statusUser: user.statusUser,
        };
      },
    }),
  ],
} satisfies NextAuthConfig;
