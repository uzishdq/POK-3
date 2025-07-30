import { columnSimpananUser } from "@/components/columns/column-simpanan";
import TableDateWrapper from "@/components/table/table-date-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RenderError } from "@/components/ui/render-error";
import { auth } from "@/lib/auth";
import { LABEL } from "@/lib/constan";
import { formatToIDR } from "@/lib/helper";
import { getSimpanan, getSumSimpanan } from "@/lib/server/data/data-simpanan";
import { Banknote } from "lucide-react";
import React from "react";

export default async function SimpananWajib() {
  const session = await auth();

  const noAnggota = session?.user?.noAnggota;

  if (!noAnggota) {
    return RenderError(
      "Simpanan Wajib",
      "Sesi Anda telah berakhir. Silakan login kembali."
    );
  }

  const [total, wajib] = await Promise.all([
    getSumSimpanan("WAJIB", noAnggota),
    getSimpanan("WAJIB", noAnggota),
  ]);

  if (!wajib.ok || !wajib.data || !total.ok) {
    return RenderError("Simpanan Wajib", LABEL.ERROR.DESCRIPTION);
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-2xl font-medium">Simpanan Wajib</div>
      <div className="grid gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-medium">
              Saldo Simpanan Wajib
            </CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatToIDR(total.data)}</div>
          </CardContent>
        </Card>
      </div>
      <TableDateWrapper
        header="Data Simpanan Wajib"
        description="Berikut adalah riwayat simpanan wajib yang tercantum"
        searchBy="noSimpanan"
        labelSearch="no simpanan"
        filterDate="tanggalSimpanan"
        data={wajib.data}
        columns={columnSimpananUser}
      />
    </div>
  );
}
