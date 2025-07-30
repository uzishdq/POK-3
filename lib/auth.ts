import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import { ROUTES } from "./constan";

export const { auth, handlers, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET!,
  pages: {
    signIn: ROUTES.PUBLIC.LOGIN,
    signOut: ROUTES.PUBLIC.LOGIN,
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  jwt: {
    maxAge: 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.noAnggota = user.noAnggota;
        token.role = user.role;
        token.name = user.name!;
        token.email = user.email!;
        token.statusUser = user.statusUser;
      }
      return token;
    },
    async session({ token, session }) {
      if (session?.user) {
        session.user.id = token.id!;
        session.user.noAnggota = token.noAnggota!;
        session.user.email = token.email!;
        session.user.name = token.name;
        session.user.role = token.role;
        session.user.statusUser = token.statusUser;
      }
      return session;
    },
  },
  ...authConfig,
});
