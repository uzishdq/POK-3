import { columnMaster } from "@/components/columns/column-master";
import FormStatus from "@/components/form/form-status";
import { FormMaster } from "@/components/form/master/form-maste";
import TableWrapper from "@/components/table/table-wrapper";
import { RenderError } from "@/components/ui/render-error";
import { LABEL } from "@/lib/constan";
import { getJabatan } from "@/lib/server/data/data-jabatan";
import { getMaster } from "@/lib/server/data/data-master";
import { getUnitKerja } from "@/lib/server/data/data-unit-kerja";
import React from "react";

export default async function MasterKaryawanYayasan() {
  const [data, jabatan, unitKerja] = await Promise.all([
    getMaster(),
    getJabatan(),
    getUnitKerja(),
  ]);

  if (
    !data.ok ||
    !jabatan.ok ||
    !unitKerja.ok ||
    data.data === null ||
    jabatan.data === null ||
    unitKerja.data === null
  ) {
    return RenderError("Karyawan Yayasan", LABEL.ERROR.DESCRIPTION);
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-2xl font-medium">Karyawan Yayasan</div>
      <TableWrapper
        header="Data Karyawan Yayasan"
        description="Data yang terdaftar sebagai karyawan dalam yayasan al ghifari"
        searchBy="namaMaster"
        labelSearch="nama"
        data={data.data}
        columns={columnMaster}
      >
        <FormMaster jabatan={jabatan.data} unitkerja={unitKerja.data} />
      </TableWrapper>
    </div>
  );
}
