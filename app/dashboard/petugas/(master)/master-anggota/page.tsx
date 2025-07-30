import React from "react";
import { columnAnggota } from "@/components/columns/column-anggota";
import TableWrapper from "@/components/table/table-wrapper";
import {
  getAnggotaUser,
  getCountAnggota,
} from "@/lib/server/data/data-anggota";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, UserMinus } from "lucide-react";
import ExportExcell from "@/components/excell/export-excell";
import { masterAnggotaToExcell } from "@/lib/excell-columns";
import { RenderError } from "@/components/ui/render-error";
import { LABEL } from "@/lib/constan";

export default async function MasterAnggota() {
  const [anggota, total] = await Promise.all([
    getAnggotaUser(),
    getCountAnggota(),
  ]);

  if (!anggota.ok || !anggota.data) {
    return RenderError("Anggota Koperasi", LABEL.ERROR.DESCRIPTION);
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-2xl font-medium">Anggota Koperasi</div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-medium">Anggota Aktif</CardTitle>
            <UserCheck className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total.data?.active}</div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-medium">
              Mengundurkan Diri
            </CardTitle>
            <UserMinus className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total.data?.noActive}</div>
          </CardContent>
        </Card>
      </div>
      <TableWrapper
        header="Data Anggota Koperasi"
        description="Data yang terdaftar sebagai anggota dalam koperasi karyawan yayasan al ghifari"
        searchBy="namaAnggota"
        labelSearch="nama"
        data={anggota.data}
        columns={columnAnggota}
      >
        <ExportExcell
          data={anggota.data}
          columns={masterAnggotaToExcell}
          title="Data Anggota Koperasi Karyawan Yayasan Al Ghifari"
          fileName="Data Anggota Koperasi"
          buttonLabel="Download"
        />
      </TableWrapper>
    </div>
  );
}
