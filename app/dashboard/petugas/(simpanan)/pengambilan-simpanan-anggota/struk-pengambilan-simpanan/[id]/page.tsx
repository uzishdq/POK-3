import ExportToPdf from "@/components/export/export-to-pdf";
import ContentPengambilanSimpanan from "@/components/struk/struk-simpanan/content-pengambilan-simpanan";
import { RenderError } from "@/components/ui/render-error";
import { formatDatebyMonth, isPengambilanSimpananIdValid } from "@/lib/helper";
import { getSuratPengambilanSimpanan } from "@/lib/server/data/data-simpanan";
import React from "react";

//masih ada page break

export default async function StrukPengambilanSimpanan({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  if (!isPengambilanSimpananIdValid(id)) {
    return RenderError("Surat Pengambilan Simpanan", "Data Tidak ditemukan.");
  }

  const struk = await getSuratPengambilanSimpanan(id);

  if (!struk.ok || !struk.data) {
    return RenderError("Surat Pengambilan Simpanan", "Data Tidak ditemukan.");
  }

  return (
    <div>
      <ExportToPdf
        docName={`Pengambilan Simpanan Anggota - ${struk.data.namaAnggota} - ${
          struk.data.namaUnitKerja
        } - ${formatDatebyMonth(struk.data.tanggalPengambilanSimpanan)}`}
      >
        <ContentPengambilanSimpanan data={struk.data} />
      </ExportToPdf>
    </div>
  );
}
