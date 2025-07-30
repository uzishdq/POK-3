import ExportToPdf from "@/components/export/export-to-pdf";
import ContentPinjaman from "@/components/struk/struk-pinjaman/content-pinjaman";
import PernyataanPinjaman from "@/components/struk/struk-pinjaman/pernyataan-pinjaman";
import SyaratPinjaman from "@/components/struk/struk-pinjaman/syarat-pinjaman";
import { RenderError } from "@/components/ui/render-error";
import { formatDatebyMonth, isPinjamanIdValid } from "@/lib/helper";
import { getSuratPinjamanById } from "@/lib/server/data/data-pinjaman";
import React from "react";

export default async function SuratPermohonanPinjaman({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  if (!isPinjamanIdValid(id)) {
    return RenderError("Surat Permohonan Pinjaman", "Data Tidak ditemukan.");
  }

  const struk = await getSuratPinjamanById(id);

  if (!struk.ok || !struk.data) {
    return RenderError("Surat Permohonan Pinjaman", "Data Tidak ditemukan.");
  }

  return (
    <div>
      <ExportToPdf
        docName={`Pinjaman Anggota - ${struk.data.namaAnggota} - ${
          struk.data.namaUnitKerja
        } - ${formatDatebyMonth(struk.data.tanggalPinjaman)}`}
      >
        <SyaratPinjaman />
        <div className="break-page" />
        <ContentPinjaman data={struk.data} />
        {struk.data.jenisPinjaman === "PRODUKTIF" ? (
          <>
            <div className="break-page" />
            <PernyataanPinjaman data={struk.data} />
          </>
        ) : null}
      </ExportToPdf>
    </div>
  );
}
