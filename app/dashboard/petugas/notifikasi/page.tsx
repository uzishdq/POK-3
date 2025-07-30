import { columnNotifikasi } from "@/components/columns/column-notifikasi";
import { BulkNotifForm } from "@/components/form/notifikasi/form-notifikasi";
import TableDateWrapper from "@/components/table/table-date-wrapper";
import { RenderError } from "@/components/ui/render-error";
import { LABEL } from "@/lib/constan";
import { getNotifikasi } from "@/lib/server/data/data-notifikasi";
import React from "react";

export default async function Notifikasi() {
  const notifikasi = await getNotifikasi();

  if (!notifikasi.ok || !notifikasi.data) {
    return RenderError("Notifikasi", LABEL.ERROR.DESCRIPTION);
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-2xl font-medium">Notifikasi</div>
      <TableDateWrapper
        header="Data Notifikasi Anggota"
        description="Menampilkan semua notifikasi yang dikirim kepada anggota"
        searchBy="messageNotification"
        labelSearch="nama anggota"
        filterDate="tanggalNotification"
        data={notifikasi.data}
        columns={columnNotifikasi}
      >
        <BulkNotifForm />
      </TableDateWrapper>
    </div>
  );
}
