import { columnAngsuran } from "@/components/columns/column-pinjaman";
import TableDateWrapper from "@/components/table/table-date-wrapper";
import { RenderError } from "@/components/ui/render-error";
import { LABEL } from "@/lib/constan";
import { isPinjamanIdValid } from "@/lib/helper";
import { getAngsuranById } from "@/lib/server/data/data-pinjaman";
import React from "react";

export default async function AngsuranPinjamanAnggota({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  if (!isPinjamanIdValid(id)) {
    return RenderError("Angsuran Pinjaman Anggota", "Data Tidak ditemukan.");
  }

  const angsuran = await getAngsuranById(id);

  if (!angsuran.ok || !angsuran.data) {
    return RenderError("Angsuran Pinjaman Anggota", LABEL.ERROR.DESCRIPTION);
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-2xl font-medium">Angsuran Pinjaman Anggota</div>
      <TableDateWrapper
        header="Detail Angsuran Anggota"
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
