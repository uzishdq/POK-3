import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Koperasi Karyawan Yayasan Al ghifari",
  description: "Sedikit bicara, Banyak sedekah",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.className} min-h-screen bg-background antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
