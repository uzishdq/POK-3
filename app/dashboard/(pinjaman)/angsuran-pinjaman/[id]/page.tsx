import { columnAngsuran } from "@/components/columns/column-pinjaman";
import TableDateWrapper from "@/components/table/table-date-wrapper";
import { RenderError } from "@/components/ui/render-error";
import { auth } from "@/lib/auth";
import { LABEL } from "@/lib/constan";
import { isPinjamanIdValid } from "@/lib/helper";
import { getAngsuranById } from "@/lib/server/data/data-pinjaman";
import React from "react";

export default async function AngsuranPinjaman({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  if (!isPinjamanIdValid(id)) {
    return RenderError("Angsuran Pinjaman", "Data Tidak ditemukan.");
  }

  const session = await auth();
  const noAnggota = session?.user.noAnggota;
  const role = session?.user.role;

  if (!noAnggota || !role) {
    return RenderError(
      "Angsuran Pinjaman",
      "Sesi Anda telah berakhir. Silakan login kembali."
    );
  }

  const angsuran = await getAngsuranById(id);

  if (!angsuran.ok || !angsuran.data) {
    return RenderError("Angsuran Pinjaman", LABEL.ERROR.DESCRIPTION);
  }

  if (role === "USER") {
    const isUnauthorized = angsuran.data.some(
      (trx) => trx.noAnggota === noAnggota
    );

    if (!isUnauthorized) {
      return RenderError("Angsuran Pinjaman", "Data Tidak ditemukan.");
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-2xl font-medium">Angsuran Pinjaman</div>
      <TableDateWrapper
        header="Detail Angsuran"
        description={`Data Angsuran Pinjaman : ${id}`}
        searchBy="noAngsuran"
        labelSearch="no angsuran"
        filterDate="tanggalAngsuran"
        data={angsuran.data}
        columns={columnAngsuran}
      />
    </div>
  );
}
