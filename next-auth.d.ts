import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string | null | undefined;
      noAnggota: string | null | undefined;
      name: string | null | undefined;
      email: string | null | undefined;
      role: string;
      statusUser: string;
    };
  }

  interface User extends DefaultUser {
    noAnggota: string | null | undefined;
    role: string;
    statusUser: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string | null | undefined;
    noAnggota: string | null | undefined;
    name: string | null | undefined;
    email: string | null | undefined;
    role: string;
    statusUser: string;
  }
}
