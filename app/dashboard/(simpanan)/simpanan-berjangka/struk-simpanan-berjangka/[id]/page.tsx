import { RenderError } from "@/components/ui/render-error";
import { validate as isUuid } from "uuid";
import { auth } from "@/lib/auth";
import React from "react";
import { LABEL } from "@/lib/constan";
import { getStrukSimpananBerjangkaById } from "@/lib/server/data/data-simpanan";
import ExportToPdf from "@/components/export/export-to-pdf";
import { ContentStrukSimpananBerjangka } from "@/components/struk/struk-simpanan-berjangka/content-simpanan-berjangka";

export default async function StrukSimpananBerjangka({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  if (!isUuid(id)) {
    return RenderError("Struk Simpanan Berjangka", "Data Tidak ditemukan.");
  }

  const session = await auth();
  const noAnggota = session?.user.noAnggota;
  const role = session?.user.role;

  if (!noAnggota || !role) {
    return RenderError(
      "Struk Simpanan Berjangka",
      "Sesi Anda telah berakhir. Silakan login kembali."
    );
  }

  const struk = await getStrukSimpananBerjangkaById(id);

  if (!struk.ok || !struk.data) {
    return RenderError("Struk Simpanan Berjangka", LABEL.ERROR.DESCRIPTION);
  }

  return (
    <ExportToPdf
      docName={`Struk - ${struk.data.namaPendaftaran} - ${struk.data.noAnggota} - ${struk.data.namaAnggota} - ${struk.data.namaUnitKerja}`}
    >
      <ContentStrukSimpananBerjangka data={struk.data} />
    </ExportToPdf>
  );
}
