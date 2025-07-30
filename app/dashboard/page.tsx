import CardPinjaman from "@/components/card/card-pinjaman";
import ChartPinjaman from "@/components/chart/chart-pinjaman";
import ChartSimpanan from "@/components/chart/chart-simpanan";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RenderError } from "@/components/ui/render-error";
import { auth } from "@/lib/auth";
import { formatToIDR } from "@/lib/helper";
import { getLastPinjamanById } from "@/lib/server/data/data-pinjaman";
import { getMaxPengambilanSimpanan } from "@/lib/server/data/data-simpanan";
import { CircleDollarSign, Factory, Package } from "lucide-react";
import React from "react";

export default async function Dashboard() {
  const session = await auth();
  const noAnggota = session?.user?.noAnggota;

  if (!noAnggota) {
    return RenderError(
      "Dashboard",
      "Sesi Anda telah berakhir. Silakan login kembali."
    );
  }

  const [produktif, barang, simpanan] = await Promise.all([
    getLastPinjamanById(noAnggota, "PRODUKTIF", "APPROVED"),
    getLastPinjamanById(noAnggota, "BARANG", "APPROVED"),
    getMaxPengambilanSimpanan(noAnggota),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-2xl font-medium">Dashboard</div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">
              Saldo Simpanan
            </CardTitle>
            <CircleDollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {formatToIDR(simpanan?.data?.total ?? 0)}
            </div>
          </CardContent>
        </Card>
        <CardPinjaman
          title="Pinjaman Produktif"
          icon={<Factory className="h-5 w-5 text-muted-foreground" />}
          result={produktif}
        />
        <CardPinjaman
          title="Pinjaman Barang"
          icon={<Package className="h-5 w-5 text-muted-foreground" />}
          result={barang}
        />
      </div>
      <ChartSimpanan data={simpanan.data} />
      <ChartPinjaman produktif={produktif.data} barang={barang.data} />
    </div>
  );
}
