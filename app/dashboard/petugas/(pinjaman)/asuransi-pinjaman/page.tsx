import { columnAsuransiPetugas } from "@/components/columns/column-asuransi";
import ExportExcell from "@/components/excell/export-excell";
import TableDateWrapper from "@/components/table/table-date-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RenderError } from "@/components/ui/render-error";
import { LABEL } from "@/lib/constan";
import { asuransiToExcell } from "@/lib/excell-columns";
import { getAsuransi } from "@/lib/server/data/data-asuransi";
import { TAsuransi } from "@/lib/types/asuransi";
import { CheckCheck, CircleDotDashed, ListChecks } from "lucide-react";
import React from "react";

export default async function AsuransiPinjaman() {
  const pelunasan = await getAsuransi();

  if (!pelunasan.ok || !pelunasan.data) {
    return RenderError("Asuransi Pinjaman Anggota", LABEL.ERROR.DESCRIPTION);
  }

  const { approvedPinjaman, pendingPinjaman, completedPinjaman } =
    pelunasan.data?.reduce(
      (acc, item) => {
        if (item.statusPinjaman === "APPROVED") {
          acc.approvedPinjaman.push(item);
        } else if (item.statusPinjaman === "PENDING") {
          acc.pendingPinjaman.push(item);
        } else if (item.statusPinjaman === "COMPLETED") {
          acc.completedPinjaman.push(item);
        }
        return acc;
      },
      {
        approvedPinjaman: [] as TAsuransi[],
        pendingPinjaman: [] as TAsuransi[],
        completedPinjaman: [] as TAsuransi[],
      }
    ) || {};

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-2xl font-medium">Asuransi Pinjaman Anggota</div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-medium">
              Asuransi Pinjaman Pending
            </CardTitle>
            <CircleDotDashed className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPinjaman.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-medium">
              Asuransi Pinjaman Disetujui
            </CardTitle>
            <CheckCheck className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedPinjaman.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-medium">
              Asuransi Pinjaman Selesai
            </CardTitle>
            <ListChecks className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedPinjaman.length}</div>
          </CardContent>
        </Card>
      </div>

      {pendingPinjaman && (
        <TableDateWrapper
          header="Asuransi Pinjaman Pending"
          description="Asuransi yang menunggu pinjaman disetujui"
          searchBy="namaAnggota"
          labelSearch="nama"
          filterDate="tanggalAsuransi"
          data={pendingPinjaman}
          columns={columnAsuransiPetugas}
        >
          <ExportExcell
            data={pendingPinjaman}
            columns={asuransiToExcell}
            title="Asuransi Pinjaman Pending"
            fileName="Asuransi_Pinjaman_Pending"
            buttonLabel="Download"
          />
        </TableDateWrapper>
      )}

      {approvedPinjaman && (
        <TableDateWrapper
          header="Asuransi Pinjaman Disetujui"
          description="Asuransi untuk pinjaman yang telah disetujui"
          searchBy="namaAnggota"
          labelSearch="nama"
          filterDate="tanggalAsuransi"
          data={approvedPinjaman}
          columns={columnAsuransiPetugas}
        >
          <ExportExcell
            data={approvedPinjaman}
            columns={asuransiToExcell}
            title="Asuransi Pinjaman Disetujui"
            fileName="Asuransi_Pinjaman_Disetujui"
            buttonLabel="Download"
          />
        </TableDateWrapper>
      )}

      {completedPinjaman && (
        <TableDateWrapper
          header="Asuransi Pinjaman Selesai"
          description="Asuransi untuk pinjaman yang telah disetujui selesai"
          searchBy="namaAnggota"
          labelSearch="nama"
          filterDate="tanggalAsuransi"
          data={completedPinjaman}
          columns={columnAsuransiPetugas}
        >
          <ExportExcell
            data={completedPinjaman}
            columns={asuransiToExcell}
            title="Asuransi Pinjaman Selesai"
            fileName="Asuransi_Pinjaman_Selesai"
            buttonLabel="Download"
          />
        </TableDateWrapper>
      )}
    </div>
  );
}
