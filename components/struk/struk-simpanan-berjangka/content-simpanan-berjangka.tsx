import { PICTURES } from "@/lib/constan";
import {
  formatDatebyMonth,
  formatToIDR,
  parseNamaPendaftaranDanTahun,
  toTerbilang,
} from "@/lib/helper";
import { TStrukSimpananBerjangka } from "@/lib/types/simpanan";

import Image from "next/image";
import React from "react";

interface IContentStrukSimpananBerjangka {
  data: TStrukSimpananBerjangka;
}

function ContentStrukSimpananBerjangka({
  data,
}: IContentStrukSimpananBerjangka) {
  const parseNamaPendaftaran = parseNamaPendaftaranDanTahun(
    data.namaPendaftaran
  );

  return (
    <div className="print-a4 w-[210mm] min-h-[297mm] p-8 bg-white text-black font-sans">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-green-700 text-4xl font-extrabold leading-tight">
            {parseNamaPendaftaran.nama.toUpperCase()}
          </h1>
          <h2 className="text-green-700 text-3xl font-extrabold mb-1">
            {parseNamaPendaftaran.tahun}
          </h2>
          <p className="text-red-600 text-lg font-semibold mt-2">
            {formatDatebyMonth(data.updatedAt)}
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative aspect-square w-24 h-24 rounded flex items-center justify-center overflow-hidden">
            <Image src={PICTURES.LOGO_STRUK} alt="logo" fill />
          </div>
          <p className="text-xs font-medium mt-1">KOPERASI KARYAWAN</p>
          <p className="text-xs font-medium mt-1">YAYASAN AL GHIFARI</p>
        </div>
      </div>

      {/* Pembuka */}
      <p className="font-bold mb-1">Assalamu’alaikum Wr. Wb.</p>
      <p className="mb-2">
        Terlampir kami sampaikan. Struk {data.namaPendaftaran} yang
        pembayarannya Insyaallah kami transfer paling lambat pada{" "}
        {formatDatebyMonth(data.tanggalPembagian)}. Terima kasih.
      </p>

      {/* Info Anggota */}
      <table className="w-full ">
        <tbody>
          <tr>
            <td className="p-1 font-medium text-muted-foreground whitespace-nowrap">
              No Anggota
            </td>
            <td className="p-1">:</td>
            <td className="p-1 font-semibold">{data.noAnggota}</td>
            <td className="p-1 font-medium text-muted-foreground whitespace-nowrap">
              Nama
            </td>
            <td className="p-1">:</td>
            <td className="p-1 font-semibold">{data.namaAnggota}</td>
          </tr>
          <tr>
            <td className="p-1 font-medium text-muted-foreground whitespace-nowrap">
              Unit Kerja
            </td>
            <td className="p-1">:</td>
            <td className="p-1 font-semibold">{data.namaUnitKerja}</td>
            <td className="p-1 font-medium text-muted-foreground whitespace-nowrap">
              Bank
            </td>
            <td className="p-1">:</td>
            <td className="p-1 font-semibold">{data.bankAnggota}</td>
          </tr>
          <tr>
            <td className="p-1 font-medium text-muted-foreground whitespace-nowrap">
              No Rekening
            </td>
            <td className="p-1">:</td>
            <td className="p-1 font-semibold" colSpan={4}>
              {data.rekeningAnggota}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Tabel Bulanan */}
      <table className="w-full border border-black text-center ">
        <thead>
          <tr className="bg-green-700 text-white">
            <th className="border border-black py-2 px-3 w-1/2">Bulan</th>
            <th className="border border-black py-2 px-3 w-1/2">Nominal</th>
          </tr>
        </thead>
        <tbody>
          {data.simpanan.map((item, idx) => {
            const bg = idx % 2 === 0 ? "bg-white" : "bg-lime-100";
            return (
              <tr key={idx} className={bg}>
                <td className="border border-black py-1 px-3">{item.bulan}</td>
                <td className="border border-black py-1 px-3">
                  {formatToIDR(item.total)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Rangkuman */}
      <table className="w-full ">
        <tbody>
          <tr>
            <td className="p-1 font-medium text-muted-foreground whitespace-nowrap">
              Jumlah Tabungan
            </td>
            <td className="p-1">:</td>
            <td className="p-1 font-semibold">
              {formatToIDR(data.totalSimpanan)}
            </td>
            <td className="p-1 font-medium text-muted-foreground whitespace-nowrap">
              Basil
            </td>
            <td className="p-1">:</td>
            <td className="p-1 font-semibold">{formatToIDR(data.basil)}</td>
          </tr>
          <tr>
            <td className="p-1 font-medium text-muted-foreground whitespace-nowrap">
              Tabungan + Basil
            </td>
            <td className="p-1">:</td>
            <td className="p-1 font-semibold">
              {formatToIDR(data.totalDenganBasil)}
            </td>
            <td className="p-1 font-medium text-muted-foreground whitespace-nowrap">
              Administrasi
            </td>
            <td className="p-1">:</td>
            <td className="p-1 font-semibold">{formatToIDR(data.admin)}</td>
          </tr>
          <tr>
            <td className="p-1 font-medium text-muted-foreground whitespace-nowrap">
              Tabungan Bersih
            </td>
            <td className="p-1">:</td>
            <td className="p-1 font-semibold" colSpan={4}>
              {formatToIDR(data.tabunganBersih)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Terbilang */}
      <p className="text-muted-foreground font-medium mb-4">
        Terbilang:{" "}
        <span className="italic">{toTerbilang(data.tabunganBersih)}</span>
      </p>

      {/* Kutipan */}
      <p className="italic  text-muted-foreground">
        Ketika kita bersyukur, maka ketakutan akan hilang dan keberkahan akan
        datang. Aamiin Ya Rabb.
      </p>

      {/* Penutup */}
      <p className="font-bold">Wassalamu’alaikum Wr. Wb</p>

      {/* Tanda Tangan */}
      <div className="mt-1 flex justify-end">
        <div className="flex flex-col items-end text-right">
          <p className=" mb-1">Ketua Koperasi Karyawan Yayasan Al Ghifari</p>
          <div className="w-32 h-32 relative">
            <Image
              src={PICTURES.TTD_KETUA}
              alt="Tanda Tangan"
              fill
              className="object-contain"
            />
          </div>
          <p className="font-semibold relative">Neneng Eva Farida, S.Pd.i</p>
        </div>
      </div>
    </div>
  );
}

export { ContentStrukSimpananBerjangka };
