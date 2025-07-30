import ChartPinjamanPetugas from "@/components/chart/chart-pinjaman-petugas";
import ChartSimpananPetugas from "@/components/chart/chart-simpanan-petugas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatToIDR } from "@/lib/helper";
import { getCountAnggota } from "@/lib/server/data/data-anggota";
import { getCountStatusPinjaman } from "@/lib/server/data/data-pinjaman";
import { getSumSimpananAnggota } from "@/lib/server/data/data-simpanan";
import { CircleDollarSign, UserRoundCheck } from "lucide-react";
import React from "react";

export default async function Petugas() {
  const [countStatusPinjaman, countSimpanan, countAnggota] = await Promise.all([
    getCountStatusPinjaman(),
    getSumSimpananAnggota(),
    getCountAnggota(),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-2xl font-medium">Dashboard Petugas</div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-medium">
              Saldo Simpanan
            </CardTitle>
            <CircleDollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {formatToIDR(countSimpanan.SALDO)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-medium">Anggota Aktif</CardTitle>
            <UserRoundCheck className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {countAnggota.data?.active ?? 0}
            </div>
          </CardContent>
        </Card>
      </div>
      <ChartSimpananPetugas data={countSimpanan} />
      <ChartPinjamanPetugas data={countStatusPinjaman} />
    </div>
  );
}
