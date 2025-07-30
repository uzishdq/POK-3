import { columnPengambilanSimpananPetugas } from "@/components/columns/column-simpanan";
import ExportExcell from "@/components/excell/export-excell";
import TableDateWrapper from "@/components/table/table-date-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RenderError } from "@/components/ui/render-error";
import { LABEL } from "@/lib/constan";
import { pengambilanSimpananAnggotaToExcell } from "@/lib/excell-columns";
import { formatToIDR } from "@/lib/helper";
import { getPengambilanSimpanan } from "@/lib/server/data/data-simpanan";
import { JenisSimpananType } from "@/lib/types/helper";
import { TPengambilanSimpanan } from "@/lib/types/simpanan";
import { ArrowBigDownDash, Banknote } from "lucide-react";
import React from "react";

export default async function PengambilanSimpananAnggota() {
  const [pengambilanSimpanan] = await Promise.all([getPengambilanSimpanan()]);

  if (!pengambilanSimpanan.ok || !pengambilanSimpanan.data) {
    return RenderError("Pengambilan Simpanan Anggota", LABEL.ERROR.DESCRIPTION);
  }

  const {
    approvedPengambilan,
    pendingPengambilan,
    rejectedPengambilan,
    approvedTotalByJenis,
    totalApprovedJumlah,
  } = pengambilanSimpanan.data.reduce(
    (acc, item) => {
      const {
        statusPengambilanSimpanan,
        jenisPengambilanSimpanan,
        jumlahPengambilanSimpanan = 0,
      } = item;

      const numericJumlah = Number(jumlahPengambilanSimpanan || 0);

      if (statusPengambilanSimpanan === "APPROVED") {
        acc.approvedPengambilan.push(item);

        if (jenisPengambilanSimpanan in acc.approvedTotalByJenis) {
          acc.approvedTotalByJenis[
            jenisPengambilanSimpanan as JenisSimpananType
          ] += numericJumlah;
          acc.totalApprovedJumlah += numericJumlah;
        }
      } else if (statusPengambilanSimpanan === "PENDING") {
        acc.pendingPengambilan.push(item);
      } else if (statusPengambilanSimpanan === "REJECTED") {
        acc.rejectedPengambilan.push(item);
      }

      return acc;
    },
    {
      approvedPengambilan: [] as TPengambilanSimpanan[],
      pendingPengambilan: [] as TPengambilanSimpanan[],
      rejectedPengambilan: [] as TPengambilanSimpanan[],
      approvedTotalByJenis: {
        WAJIB: 0,
        SUKAMANA: 0,
        LEBARAN: 0,
        QURBAN: 0,
        UBAR: 0,
      } as Record<JenisSimpananType, number>,
      totalApprovedJumlah: 0,
    }
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-2xl font-medium">Pengambilan Simpanan Anggota</div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-medium">
              Total Pengambilan Simpanan
            </CardTitle>
            <ArrowBigDownDash className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatToIDR(totalApprovedJumlah)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-medium">
              Pengambilan Simpanan Sukamana
            </CardTitle>
            <Banknote className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatToIDR(approvedTotalByJenis.SUKAMANA)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-medium">
              Pengambilan Simpanan Lebaran
            </CardTitle>
            <Banknote className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatToIDR(approvedTotalByJenis.LEBARAN)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-medium">
              Pengambilan Simpanan Qurban
            </CardTitle>
            <Banknote className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatToIDR(approvedTotalByJenis.QURBAN)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-medium">
              Pengambilan Simpanan Ubar
            </CardTitle>
            <Banknote className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatToIDR(approvedTotalByJenis.UBAR)}
            </div>
          </CardContent>
        </Card>
      </div>

      {pendingPengambilan && (
        <TableDateWrapper
          header="Menunggu Persetujuan"
          description="Pengajuan masih dalam proses verifikasi oleh petugas"
          searchBy="namaAnggota"
          labelSearch="nama"
          filterDate="tanggalPengambilanSimpanan"
          data={pendingPengambilan}
          columns={columnPengambilanSimpananPetugas}
        />
      )}
      {approvedPengambilan && (
        <TableDateWrapper
          header="Pengambilan Disetujui"
          description="Pengambilan simpanan telah disetujui dan siap dicairkan"
          searchBy="namaAnggota"
          labelSearch="nama"
          filterDate="tanggalPengambilanSimpanan"
          data={approvedPengambilan}
          columns={columnPengambilanSimpananPetugas}
        >
          <ExportExcell
            data={approvedPengambilan}
            columns={pengambilanSimpananAnggotaToExcell}
            title="Pengambilan Simpanan Anggota"
            fileName="Pengambilan_Simpanan_Anggota"
            buttonLabel="Download"
          />
        </TableDateWrapper>
      )}
      {rejectedPengambilan && (
        <TableDateWrapper
          header="Pengambilan Ditolak"
          description="Pengajuan pengambilan simpanan ditolak oleh petugas"
          searchBy="namaAnggota"
          labelSearch="nama"
          filterDate="tanggalPengambilanSimpanan"
          data={rejectedPengambilan}
          columns={columnPengambilanSimpananPetugas}
        />
      )}
    </div>
  );
}
