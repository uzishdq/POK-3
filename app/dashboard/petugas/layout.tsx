import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Koperasi Karyawan Yayasan Al ghifari",
  description: "Sedikit bicara, Banyak sedekah",
};
export default function PetugasLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <section>{children}</section>
    </div>
  );
}
