import FormTambahPinjaman from "@/components/form/pinjaman/form-tambah-pinjaman";
import { RenderError } from "@/components/ui/render-error";
import { LABEL } from "@/lib/constan";
import { getAnggotaTrx } from "@/lib/server/data/data-anggota";
import React from "react";

export default async function PengajuanPinjamanAnggotaPage() {
  const [anggota] = await Promise.all([getAnggotaTrx()]);

  if (!anggota.ok || !anggota.data) {
    return RenderError("Tambah Pinjaman Anggota", LABEL.ERROR.DESCRIPTION);
  }

  if (anggota.data.length === 0) {
    return RenderError(
      "Data Tidak Ditemukan",
      "Tidak ada anggota aktif yang terdaftar saat ini.",
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-2xl font-medium">Tambah Pinjaman Anggota</div>
      <FormTambahPinjaman anggota={anggota.data} />
    </div>
  );
}
