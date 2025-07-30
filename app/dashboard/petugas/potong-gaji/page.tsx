import {
  columnHistoryPotongGaji,
  columnPotongGaji,
} from "@/components/columns/column-potongan-gaji";
import ExportExcell from "@/components/excell/export-excell";
import InputExcell from "@/components/excell/input-excell";
import FormStatus from "@/components/form/form-status";
import TableDateWrapper from "@/components/table/table-date-wrapper";
import TableWrapper from "@/components/table/table-wrapper";
import { RenderError } from "@/components/ui/render-error";
import { LABEL } from "@/lib/constan";
import { potonganGajiToExcell } from "@/lib/excell-columns";
import {
  getHistoryPotongGaji,
  getPotongGaji,
} from "@/lib/server/data/data-potong-gaji";
import React from "react";

export default async function PotongGaji() {
  const [potongan, history] = await Promise.all([
    getPotongGaji(),
    getHistoryPotongGaji(),
  ]);

  if (!potongan.ok || !potongan.data || !history.ok || !history.data) {
    return RenderError("Potongan Gaji", LABEL.ERROR.DESCRIPTION);
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-2xl font-medium">Potongan Gaji</div>
      <TableWrapper
        header="Data Potongan Gaji Anggota"
        description="Data potongan gaji anggota mencakup rincian potongan seperti simpanan dan angsuran pinjaman"
        searchBy="namaAnggota"
        labelSearch="nama"
        data={potongan.data}
        columns={columnPotongGaji}
      >
        <ExportExcell
          data={potongan.data}
          columns={potonganGajiToExcell}
          title="REKAP POTONGAN GAJI"
          fileName="REKAP POTONGAN GAJI"
          buttonLabel="Download"
        />
      </TableWrapper>
      <InputExcell />
      <TableDateWrapper
        header="Riwayat Potongan Gaji Anggota"
        description="Data potongan gaji anggota sudah berhasil diinput"
        searchBy="namaAnggota"
        labelSearch="nama"
        filterDate="tanggalPotongGaji"
        data={history.data}
        columns={columnHistoryPotongGaji}
      />
    </div>
  );
}
