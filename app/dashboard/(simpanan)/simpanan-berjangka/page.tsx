import { columnSimpananBerjangka } from "@/components/columns/column-simpanan";
import TableDateWrapper from "@/components/table/table-date-wrapper";
import { RenderError } from "@/components/ui/render-error";
import { auth } from "@/lib/auth";
import { LABEL } from "@/lib/constan";
import { getSimpananBerjangkaById } from "@/lib/server/data/data-simpanan";
import React from "react";

export default async function SimpananBerjangka() {
  const session = await auth();

  const noAnggota = session?.user?.noAnggota;

  if (!noAnggota) {
    return RenderError(
      "Simpanan Berjangka",
      "Sesi Anda telah berakhir. Silakan login kembali."
    );
  }

  const [berjangka] = await Promise.all([getSimpananBerjangkaById(noAnggota)]);

  if (!berjangka.ok || !berjangka.data) {
    return RenderError("Simpanan Berjangka", LABEL.ERROR.DESCRIPTION);
  }

  // tambah detail dan struk kalo sudah close

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-2xl font-medium">Simpanan Berjangka</div>
      <TableDateWrapper
        header="Data Pendaftaran Simpanan"
        description="Menampilkan Simpanan Berjangka yang Anda ikuti"
        searchBy="namaPendaftaran"
        labelSearch="nama pendaftaran"
        filterDate="tanggalPendaftaran"
        data={berjangka.data}
        columns={columnSimpananBerjangka}
      />
    </div>
  );
}
