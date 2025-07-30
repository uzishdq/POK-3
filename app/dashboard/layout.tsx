import React from "react";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import TopNav from "@/components/navigation/top-nav";

export const metadata: Metadata = {
  title: "Koperasi Karyawan Yayasan Al ghifari",
  description: "Sedikit bicara, Banyak sedekah",
};
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <TopNav />
      <section>{children}</section>
      <Toaster position="top-center" richColors closeButton expand={true} />
    </div>
  );
}
