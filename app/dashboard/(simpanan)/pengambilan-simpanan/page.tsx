import { columnPengambilanSimpananUser } from "@/components/columns/column-simpanan";
import FormPengambilanSimpanan from "@/components/form/simpanan/form-pengambilan-simpanan";
import TableDateWrapper from "@/components/table/table-date-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RenderError } from "@/components/ui/render-error";
import { auth } from "@/lib/auth";
import { LABEL } from "@/lib/constan";
import { formatToIDR } from "@/lib/helper";
import { getLastPinjamanById } from "@/lib/server/data/data-pinjaman";
import {
  getMaxPengambilanSimpanan,
  getPengambilanSimpananById,
  getTotalSumPengambilanById,
} from "@/lib/server/data/data-simpanan";
import {
  ArrowBigDownDash,
  CalendarHeart,
  Gift,
  HandCoins,
  HeartHandshake,
} from "lucide-react";
import React from "react";

export default async function PengambilanSimpanan() {
  const session = await auth();
  const noAnggota = session?.user?.noAnggota;

  if (!noAnggota) {
    return RenderError(
      "Pengambilan Simpanan",
      "Sesi Anda telah berakhir. Silakan login kembali."
    );
  }

  const [maxSimpanan, lastProduktif, pengambilanSimpanan, total] =
    await Promise.all([
      getMaxPengambilanSimpanan(noAnggota),
      getLastPinjamanById(noAnggota, "PRODUKTIF", "APPROVED"),
      getPengambilanSimpananById(noAnggota),
      getTotalSumPengambilanById(noAnggota),
    ]);

  if (
    !maxSimpanan.ok ||
    !maxSimpanan.data ||
    lastProduktif.status === "ERROR" ||
    !pengambilanSimpanan.ok ||
    !pengambilanSimpanan.data ||
    !total
  ) {
    return RenderError("Pengambilan Simpanan", LABEL.ERROR.DESCRIPTION);
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-2xl font-medium">Pengambilan Simpanan</div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-medium">
              Total Pengambilan Simpanan
            </CardTitle>
            <ArrowBigDownDash className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatToIDR(total.hasil)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-medium">
              Pengambilan Simpanan Sukamana
            </CardTitle>
            <HeartHandshake className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatToIDR(total.sukamana)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-medium">
              Pengambilan Simpanan Lebaran
            </CardTitle>
            <Gift className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatToIDR(total.lebaran)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-medium">
              Pengambilan Simpanan Qurban
            </CardTitle>
            <HandCoins className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatToIDR(total.qurban)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-medium">
              Pengambilan Simpanan Ubar
            </CardTitle>
            <CalendarHeart className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatToIDR(total.ubar)}</div>
          </CardContent>
        </Card>
      </div>
      <TableDateWrapper
        header="Data Pengambilan Simpanan"
        description="Berikut adalah riwayat pengambilan simpanan yang tercantum"
        searchBy="noPengambilanSimpanan"
        labelSearch="no pengambilan simpanan"
        filterDate="tanggalPengambilanSimpanan"
        data={pengambilanSimpanan.data}
        columns={columnPengambilanSimpananUser}
      >
        <FormPengambilanSimpanan
          maxSimpanan={maxSimpanan.data}
          status={lastProduktif.status}
          id={noAnggota}
        />
      </TableDateWrapper>
    </div>
  );
}
