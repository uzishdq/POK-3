import { columnPinjaman } from "@/components/columns/column-pinjaman";
import TableDateWrapper from "@/components/table/table-date-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RenderError } from "@/components/ui/render-error";
import { auth } from "@/lib/auth";
import { LABEL } from "@/lib/constan";
import { getPinjamanById } from "@/lib/server/data/data-pinjaman";
import { TPinjaman } from "@/lib/types/pinjaman";
import { CheckCheck, CircleDotDashed, ListChecks } from "lucide-react";
import React from "react";

export default async function PinjamanBarang() {
  const session = await auth();
  const noAnggota = session?.user?.noAnggota;

  if (!noAnggota) {
    return RenderError(
      "Pinjaman Barang",
      "Sesi Anda telah berakhir. Silakan login kembali."
    );
  }

  const [pinjaman] = await Promise.all([getPinjamanById(noAnggota, "BARANG")]);

  if (!pinjaman.ok || !pinjaman.data) {
    return RenderError("Pinjaman Barang", LABEL.ERROR.DESCRIPTION);
  }

  const { approvedPinjaman, pendingPinjaman, completedPinjaman } =
    pinjaman.data?.reduce(
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
        approvedPinjaman: [] as TPinjaman[],
        pendingPinjaman: [] as TPinjaman[],
        completedPinjaman: [] as TPinjaman[],
      }
    ) || {};
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-2xl font-medium">Pinjaman Barang</div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-medium">
              Menunggu Persetujuan
            </CardTitle>
            <CircleDotDashed className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPinjaman.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-medium">Disetujui</CardTitle>
            <CheckCheck className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedPinjaman.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-medium">
              Pinjaman Selesai
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
          header="Pengajuan Barang Menunggu"
          description="Pinjaman yang masih dalam proses verifikasi petugas"
          searchBy="namaAnggota"
          labelSearch="nama"
          filterDate="tanggalPinjaman"
          data={pendingPinjaman}
          columns={columnPinjaman}
        />
      )}

      {approvedPinjaman && (
        <TableDateWrapper
          header="Pinjaman Barang Disetujui"
          description="Pinjaman yang telah disetujui"
          searchBy="namaAnggota"
          labelSearch="nama"
          filterDate="tanggalPinjaman"
          data={approvedPinjaman}
          columns={columnPinjaman}
        />
      )}

      {completedPinjaman && (
        <TableDateWrapper
          header="Pinjaman Barang Selesai"
          description="Pinjaman yang telah selesai atau lunas"
          searchBy="namaAnggota"
          labelSearch="nama"
          filterDate="tanggalPinjaman"
          data={completedPinjaman}
          columns={columnPinjaman}
        />
      )}
    </div>
  );
}
