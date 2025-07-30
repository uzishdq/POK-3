import {
  TLaporanPinjaman,
  TLaporanSimpananBerjangka,
} from "@/lib/types/laporan";
import React from "react";
import TableDateWrapper from "./table-date-wrapper";
import { columnLaporanPinjaman } from "../columns/column-pinjaman";
import { JenisPinjamanType, StatusPinjamanType } from "@/lib/types/helper";
import ExportExcell from "../excell/export-excell";
import { columnsExcelLaporanPinjaman } from "@/lib/excell-columns";
import { columnLaporanSimpananBerjangka } from "../columns/column-simpanan";
import { generateSimpananBerjangkaExcellData } from "@/lib/helper";
import TableWrapper from "./table-wrapper";

interface ITabelLaporanPinjaman {
  data: TLaporanPinjaman[];
  jenis: JenisPinjamanType;
  status: StatusPinjamanType;
}

function TabelLaporanPinjaman({ data, jenis, status }: ITabelLaporanPinjaman) {
  return (
    <TableDateWrapper
      header={`Laporan Pinjaman ${jenis} Anggota`}
      description="Menampilkan rincian laporan pinjaman anggota"
      searchBy="nama"
      labelSearch="nama"
      filterDate="tanggalPinjaman"
      data={data}
      columns={columnLaporanPinjaman}
    >
      <ExportExcell
        data={data}
        columns={columnsExcelLaporanPinjaman}
        title={`Laporan Pinjaman ${jenis} Anggota - Status ${status} `}
        fileName={`Laporan_Pinjaman_${jenis}_Anggota `}
        buttonLabel="Download"
      />
    </TableDateWrapper>
  );
}

interface ITabelLaporanSimpanan {
  data: TLaporanSimpananBerjangka[];
  namePendaftaran: string;
  basil: number;
}
// tambahkan namaPendaftaran ke title
function TabelLaporanSimpanan({
  data,
  namePendaftaran,
  basil,
}: ITabelLaporanSimpanan) {
  const toExcell = generateSimpananBerjangkaExcellData(data, basil);

  return (
    <TableWrapper
      header={`Laporan ${namePendaftaran}`}
      description="Menampilkan rincian laporan simpanan anggota"
      searchBy="namaAnggota"
      labelSearch="nama"
      data={data}
      columns={columnLaporanSimpananBerjangka}
    >
      <ExportExcell
        data={toExcell.rows}
        columns={toExcell.columns}
        title={`Laporan ${namePendaftaran} `}
        fileName={`Laporan_${namePendaftaran}_Anggota `}
        buttonLabel="Download"
      />
    </TableWrapper>
  );
}

export { TabelLaporanPinjaman, TabelLaporanSimpanan };
