import { columnUndurDiriPetugas } from "@/components/columns/column-undur-diri";
import TableDateWrapper from "@/components/table/table-date-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RenderError } from "@/components/ui/render-error";
import { LABEL } from "@/lib/constan";
import { getPengunduranDiri } from "@/lib/server/data/data-undur-diri";
import { TUndurDiri } from "@/lib/types/undur-diri";
import { CheckCheck, CircleDotDashed, ListChecks } from "lucide-react";
import React from "react";

export default async function UndurDiriAnggota() {
  const [undurDiri] = await Promise.all([getPengunduranDiri()]);

  if (!undurDiri.ok || !undurDiri.data) {
    return RenderError("Pengunduran Diri Anggota", LABEL.ERROR.DESCRIPTION);
  }

  const { approvedUndurDiri, pendingUndurDiri, rejectedUndurDiri } =
    undurDiri.data?.reduce(
      (acc, item) => {
        if (item.statusPengunduranDiri === "APPROVED") {
          acc.approvedUndurDiri.push(item);
        } else if (item.statusPengunduranDiri === "PENDING") {
          acc.pendingUndurDiri.push(item);
        } else if (item.statusPengunduranDiri === "REJECTED") {
          acc.rejectedUndurDiri.push(item);
        }
        return acc;
      },
      {
        approvedUndurDiri: [] as TUndurDiri[],
        pendingUndurDiri: [] as TUndurDiri[],
        rejectedUndurDiri: [] as TUndurDiri[],
      }
    ) || {};

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-2xl font-medium">Pengunduran Diri Anggota</div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">
              Menunggu Persetujuan
            </CardTitle>
            <CircleDotDashed className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingUndurDiri.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">Disetujui</CardTitle>
            <CheckCheck className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedUndurDiri.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">
              Pengunduran Ditolak
            </CardTitle>
            <ListChecks className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedUndurDiri.length}</div>
          </CardContent>
        </Card>
      </div>

      {pendingUndurDiri && (
        <TableDateWrapper
          header="Pengajuan Pengunduran Diri Menunggu"
          description="Pengajuan pengunduran diri yang masih dalam proses verifikasi petugas"
          searchBy="namaAnggota"
          labelSearch="nama"
          filterDate="tanggalPengunduranDiri"
          data={pendingUndurDiri}
          columns={columnUndurDiriPetugas}
        />
      )}
      {approvedUndurDiri && (
        <TableDateWrapper
          header="Pengunduran Diri Disetujui"
          description="Pengajuan pengunduran diri telah disetujui"
          searchBy="namaAnggota"
          labelSearch="nama"
          filterDate="tanggalPengunduranDiri"
          data={approvedUndurDiri}
          columns={columnUndurDiriPetugas}
        />
      )}
      {rejectedUndurDiri && (
        <TableDateWrapper
          header="Pengunduran Diri Ditolak"
          description="Pengajuan pengunduran diri telah ditolak"
          searchBy="namaAnggota"
          labelSearch="nama"
          filterDate="tanggalPengunduranDiri"
          data={rejectedUndurDiri}
          columns={columnUndurDiriPetugas}
        />
      )}
    </div>
  );
}
