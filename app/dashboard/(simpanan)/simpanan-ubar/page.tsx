import { columnSimpananUser } from "@/components/columns/column-simpanan";
import TableDateWrapper from "@/components/table/table-date-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RenderError } from "@/components/ui/render-error";
import { auth } from "@/lib/auth";
import { LABEL } from "@/lib/constan";
import { formatToIDR } from "@/lib/helper";
import {
  getSimpananBerjangka,
  getSumSimpanan,
} from "@/lib/server/data/data-simpanan";
import { CalendarHeart } from "lucide-react";
import React from "react";

export default async function SimpananUbar() {
  const session = await auth();

  const noAnggota = session?.user?.noAnggota;

  if (!noAnggota) {
    return RenderError(
      "Simpanan Ubar",
      "Sesi Anda telah berakhir. Silakan login kembali."
    );
  }
  const [total, ubar] = await Promise.all([
    getSumSimpanan("UBAR", noAnggota),
    getSimpananBerjangka("UBAR", noAnggota),
  ]);

  if (!ubar.ok || !ubar.data || !total.ok) {
    return RenderError("Simpanan Ubar", LABEL.ERROR.DESCRIPTION);
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-2xl font-medium">Simpanan Ubar</div>
      <div className="grid gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-medium">
              Saldo Simpanan Ubar
            </CardTitle>
            <CalendarHeart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatToIDR(total.data)}</div>
          </CardContent>
        </Card>
      </div>
      <TableDateWrapper
        header="Data Simpanan Ubar"
        description="Berikut adalah riwayat simpanan ubar yang tercantum"
        searchBy="noSimpanan"
        labelSearch="no simpanan"
        filterDate="tanggalSimpanan"
        data={ubar.data}
        columns={columnSimpananUser}
      />
    </div>
  );
}
