import { columnPendaftarSimpanan } from "@/components/columns/column-setting-simpanan";
import ExportExcell from "@/components/excell/export-excell";
import TableWrapper from "@/components/table/table-wrapper";
import { RenderError } from "@/components/ui/render-error";
import { LABEL } from "@/lib/constan";
import { pendaftarSimpananToExcell } from "@/lib/excell-columns";

import {
  getListPendaftarSimpanan,
  getSettingSimpananById,
} from "@/lib/server/data/data-simpanan";
import React from "react";
import { validate as isUuid } from "uuid";

export default async function PendaftarSimpananBerjangka({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  if (!isUuid(id)) {
    return RenderError("Pendaftar Simpanan Berjangka", "Data Tidak ditemukan.");
  }

  const [pendaftar, setting] = await Promise.all([
    getListPendaftarSimpanan(id),
    getSettingSimpananById(id),
  ]);

  if (!pendaftar.ok || !pendaftar.data || !setting) {
    return RenderError("Pendaftar Simpanan Berjangka", LABEL.ERROR.DESCRIPTION);
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-2xl font-medium">Pendaftar Simpanan Berjangka</div>

      <TableWrapper
        header={`Data Pendaftaran ${setting.namaPendaftaran}`}
        description={`List anggota yang mendaftar ${setting.namaPendaftaran}`}
        searchBy="namaAnggota"
        labelSearch="nama"
        data={pendaftar.data}
        columns={columnPendaftarSimpanan}
      >
        <ExportExcell
          data={pendaftar.data}
          columns={pendaftarSimpananToExcell}
          title={`List Pendaftar ${setting.namaPendaftaran}`}
          fileName={`Pendaftar ${setting.namaPendaftaran}`}
          buttonLabel="Download"
        />
      </TableWrapper>
    </div>
  );
}
