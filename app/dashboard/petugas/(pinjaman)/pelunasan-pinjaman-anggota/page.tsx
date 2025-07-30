import { columnPelunasanPinjaman } from "@/components/columns/column-pelunasan";
import TableDateWrapper from "@/components/table/table-date-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RenderError } from "@/components/ui/render-error";
import { LABEL } from "@/lib/constan";
import { getPelunasanPinjaman } from "@/lib/server/data/data-pelunasan";
import { TPelunasanPinjaman } from "@/lib/types/pelunasan-pinjaman";
import { CheckCheck, CircleDotDashed } from "lucide-react";
import React from "react";

export default async function PelunasanPinjamanAnggota() {
  const pelunasan = await getPelunasanPinjaman();

  if (!pelunasan.ok || !pelunasan.data) {
    return RenderError("Pelunasan Pinjaman Anggota", LABEL.ERROR.DESCRIPTION);
  }

  const { approvedPelunasan, pendingPelunasan, completedPelunasan } =
    pelunasan.data?.reduce(
      (acc, item) => {
        if (item.statusPelunasanPinjaman === "APPROVED") {
          acc.approvedPelunasan.push(item);
        } else if (item.statusPelunasanPinjaman === "PENDING") {
          acc.pendingPelunasan.push(item);
        } else if (item.statusPelunasanPinjaman === "COMPLETED") {
          acc.completedPelunasan.push(item);
        }
        return acc;
      },
      {
        approvedPelunasan: [] as TPelunasanPinjaman[],
        pendingPelunasan: [] as TPelunasanPinjaman[],
        completedPelunasan: [] as TPelunasanPinjaman[],
      }
    ) || {};

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-2xl font-medium">Pelunasan Pinjaman Anggota</div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-medium">
              Menunggu Persetujuan
            </CardTitle>
            <CircleDotDashed className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPelunasan.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-medium">Disetujui</CardTitle>
            <CheckCheck className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedPelunasan.length}</div>
          </CardContent>
        </Card>
      </div>

      {pendingPelunasan && (
        <TableDateWrapper
          header="Pengajuan Pelunasan Pinjaman Menunggu"
          description="Pelunasan pinjaman yang masih dalam proses verifikasi petugas"
          searchBy="namaAnggota"
          labelSearch="nama"
          filterDate="tanggalPelunasanPinjaman"
          data={pendingPelunasan}
          columns={columnPelunasanPinjaman}
        />
      )}

      {approvedPelunasan && (
        <TableDateWrapper
          header="Pelunasan Pinjaman Disetujui"
          description="Pelunasan pinjaman yang telah disetujui"
          searchBy="namaAnggota"
          labelSearch="nama"
          filterDate="tanggalPelunasanPinjaman"
          data={approvedPelunasan}
          columns={columnPelunasanPinjaman}
        />
      )}
    </div>
  );
}
