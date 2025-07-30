"use client";
import { signOut } from "next-auth/react";

export default function ButtonSignOut() {
  return (
    <button
      className="w-full text-left"
      onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
    >
      Logout
    </button>
  );
}
