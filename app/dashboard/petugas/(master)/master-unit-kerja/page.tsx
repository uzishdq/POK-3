import { columnUnitKerja } from "@/components/columns/column-unit-kerja";
import FormStatus from "@/components/form/form-status";
import { UnitKerjaForm } from "@/components/form/unit-kerja/unit-kerja-form";
import TableWrapper from "@/components/table/table-wrapper";
import { RenderError } from "@/components/ui/render-error";
import { LABEL } from "@/lib/constan";
import { getUnitKerja } from "@/lib/server/data/data-unit-kerja";
import React from "react";

export default async function MasterUnitKerja() {
  const unitKerja = await getUnitKerja();

  if (!unitKerja.ok || !unitKerja.data) {
    return RenderError("Unit Kerja", LABEL.ERROR.DESCRIPTION);
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-2xl font-medium">Unit Kerja</div>
      <TableWrapper
        header="Data Unit Kerja"
        description="Data yang terdaftar sebagai unit garapan / unit kerja dalam yayasan al ghifari"
        searchBy="namaUnitKerja"
        labelSearch="nama unit kerja"
        data={unitKerja.data}
        columns={columnUnitKerja}
      >
        <UnitKerjaForm />
      </TableWrapper>
    </div>
  );
}
