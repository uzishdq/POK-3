import { columnJabatan } from "@/components/columns/column-jabatan";
import FormStatus from "@/components/form/form-status";
import { JabatanForm } from "@/components/form/jabatan/jabatan-form";
import TableWrapper from "@/components/table/table-wrapper";
import { RenderError } from "@/components/ui/render-error";
import { LABEL } from "@/lib/constan";
import { getJabatan } from "@/lib/server/data/data-jabatan";
import React from "react";

export default async function MasterJabatan() {
  const jabatan = await getJabatan();

  if (!jabatan.ok || !jabatan.data) {
    return RenderError("Jabatan", LABEL.ERROR.DESCRIPTION);
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-2xl font-medium">Jabatan</div>
      <TableWrapper
        header="Data Jabatan"
        description="Data yang terdaftar sebagai jabatan dalam yayasan al ghifari"
        searchBy="namaJabatan"
        labelSearch="nama jabatan"
        data={jabatan.data}
        columns={columnJabatan}
      >
        <JabatanForm />
      </TableWrapper>
    </div>
  );
}
