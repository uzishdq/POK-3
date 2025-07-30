import FormCekPelunasan from "@/components/form/pelunasan-pinjaman/form-cek-pelunasan";
import { RenderError } from "@/components/ui/render-error";
import { auth } from "@/lib/auth";
import { LABEL } from "@/lib/constan";
import { getApprovedPinjamanById } from "@/lib/server/data/data-pelunasan";
import React from "react";

export default async function PelunasanPinjaman() {
  const session = await auth();
  const noAnggota = session?.user?.noAnggota;

  if (!noAnggota) {
    return RenderError(
      "Pelunasan Pinjaman",
      "Sesi Anda telah berakhir. Silakan login kembali."
    );
  }

  const pinjaman = await getApprovedPinjamanById(noAnggota);

  if (!pinjaman.ok || !pinjaman.data) {
    return RenderError("Pelunasan Pinjaman", LABEL.ERROR.DESCRIPTION);
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-2xl font-medium">Pelunasan Pinjaman</div>
      <FormCekPelunasan pinjaman={pinjaman.data} />
    </div>
  );
}
