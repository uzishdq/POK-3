import ExportToPdf from "@/components/export/export-to-pdf";
import ContentUndurDiri from "@/components/struk/struk-undur-diri/content-undur-diri";
import { RenderError } from "@/components/ui/render-error";
import { formatDatebyMonth, isPengunduranValid } from "@/lib/helper";
import { getSuratPengunduranDiri } from "@/lib/server/data/data-undur-diri";
import React from "react";

export default async function SuratPernyataanUndurDiri({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  if (!isPengunduranValid(id)) {
    return RenderError("Surat Pengunduran Anggota", "Data Tidak ditemukan.");
  }

  const struk = await getSuratPengunduranDiri(id);

  if (!struk.ok || !struk.data) {
    return RenderError("Surat Pengunduran Anggota", "Data Tidak ditemukan.");
  }

  return (
    <div>
      <ExportToPdf
        docName={`Resign Koperasi - ${struk.data.namaAnggota} - ${
          struk.data.namaUnitKerja
        } - ${formatDatebyMonth(struk.data.tanggalPengunduranDiri)}`}
      >
        <ContentUndurDiri data={struk.data} />
      </ExportToPdf>
    </div>
  );
}
