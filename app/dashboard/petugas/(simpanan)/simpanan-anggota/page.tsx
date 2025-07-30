import { columnSimpananPetugas } from "@/components/columns/column-simpanan";
import ExportExcell from "@/components/excell/export-excell";
import TableWrapper from "@/components/table/table-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RenderError } from "@/components/ui/render-error";
import { LABEL } from "@/lib/constan";
import { simpananAnggotaToExcell } from "@/lib/excell-columns";
import { formatDatebyMonth, formatToIDR } from "@/lib/helper";
import { getSimpananAnggota } from "@/lib/server/data/data-simpanan";
import {
  Banknote,
  CalendarHeart,
  CircleDollarSign,
  Gift,
  HandCoins,
  HeartHandshake,
  Wallet,
} from "lucide-react";
import React from "react";

export default async function SimpananAnggota() {
  const [simpanan] = await Promise.all([getSimpananAnggota()]);

  if (!simpanan.ok || !simpanan.data) {
    return RenderError(
      `Simpanan Anggota Hingga ${formatDatebyMonth(new Date())}`,
      LABEL.ERROR.DESCRIPTION
    );
  }

  const {
    totalWajib,
    totalManasuka,
    totalLebaran,
    totalQurban,
    totalUbar,
    totalTaking,
    totalBalance,
  } = (simpanan.data ?? []).reduce(
    (acc, item) => {
      acc.totalWajib += item.wajib;
      acc.totalManasuka += item.manasuka;
      acc.totalLebaran += item.lebaran;
      acc.totalQurban += item.qurban;
      acc.totalUbar += item.ubar;
      acc.totalTaking += item.totalTaking;
      acc.totalBalance += item.totalBalance;
      return acc;
    },
    {
      totalWajib: 0,
      totalManasuka: 0,
      totalLebaran: 0,
      totalQurban: 0,
      totalUbar: 0,
      totalTaking: 0,
      totalBalance: 0,
    }
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-2xl font-medium">
        Simpanan Anggota Hingga {formatDatebyMonth(new Date())}
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">
              Total Pengambilan
            </CardTitle>
            <Wallet className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              - {formatToIDR(totalTaking)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">Total Saldo</CardTitle>
            <CircleDollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatToIDR(totalBalance)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">
              Simpanan Wajib
            </CardTitle>
            <Banknote className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold ">{formatToIDR(totalWajib)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">
              Simpanan Sukamana
            </CardTitle>
            <HeartHandshake className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold ">
              {formatToIDR(totalManasuka)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">
              Simpanan Lebaran
            </CardTitle>
            <Gift className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold ">
              {formatToIDR(totalLebaran)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">
              Simpanan Qurban
            </CardTitle>
            <HandCoins className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold ">
              {formatToIDR(totalQurban)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">Simpanan Ubar</CardTitle>
            <CalendarHeart className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold ">{formatToIDR(totalUbar)}</div>
          </CardContent>
        </Card>
      </div>

      <TableWrapper
        header="Data Simpanan Anggota"
        description="Menampilkan rincian simpanan anggota, serta total pengambilan dan saldo akhir simpanan"
        searchBy="namaAnggota"
        labelSearch="nama"
        data={simpanan.data}
        columns={columnSimpananPetugas}
      >
        <ExportExcell
          data={simpanan.data}
          columns={simpananAnggotaToExcell}
          title="Simpanan Anggota Hingga"
          fileName="Simpanan_Anggota"
          buttonLabel="Download"
        />
      </TableWrapper>
    </div>
  );
}
