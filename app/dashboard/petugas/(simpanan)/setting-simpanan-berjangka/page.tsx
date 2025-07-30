import { columnSettingSimpanan } from "@/components/columns/column-setting-simpanan";
import { FormSettingSimpanan } from "@/components/form/simpanan/form-setting-simpanan";
import TableWrapper from "@/components/table/table-wrapper";
import {
  getCountSimpananBerjangka,
  getSettingSimpanan,
} from "@/lib/server/data/data-simpanan";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { Users } from "lucide-react";
import { LABEL } from "@/lib/constan";
import { RenderError } from "@/components/ui/render-error";

export default async function SettingSimpananBerjangka() {
  const [setting, count] = await Promise.all([
    getSettingSimpanan(),
    getCountSimpananBerjangka(),
  ]);

  if (!setting.ok || !setting.data || !count.data) {
    return RenderError("Simpanan Berjangka", LABEL.ERROR.DESCRIPTION);
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-2xl font-medium">Simpanan Berjangka</div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-medium">
              Total Pendaftar Simpanan Lebaran
            </CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{count.data.lebaran.total}</div>
            <p className="mt-1 text-muted-foreground">
              {count.data.lebaran.nama}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-medium">
              Total Pendaftar Simpanan Qurban
            </CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{count.data.qurban.total}</div>
            <p className="mt-1 text-muted-foreground">
              {count.data.qurban.nama}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-medium">
              Total Pendaftar Simpanan Ubar
            </CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{count.data.ubar.total}</div>
            <p className="mt-1 text-muted-foreground">{count.data.ubar.nama}</p>
          </CardContent>
        </Card>
      </div>
      <TableWrapper
        header="Data Simpanan Berjangka"
        description="Pengaturan pendaftaran simpanan berjangka bagi anggota. Petugas dapat melihat anggota terdaftar"
        searchBy="namaPendaftaran"
        labelSearch="nama pendaftaran"
        data={setting.data}
        columns={columnSettingSimpanan}
      >
        <FormSettingSimpanan />
      </TableWrapper>
    </div>
  );
}
