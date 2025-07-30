import { formatDatebyMonth, formatToIDR, toTerbilang } from "@/lib/helper";
import { TStrukPengambilanSimpanan } from "@/lib/types/simpanan";
import React from "react";
import StrukHeader from "../struk-header";

interface IContentPengambilanSimpanan {
  data: TStrukPengambilanSimpanan;
}

export default function ContentPengambilanSimpanan({
  data,
}: IContentPengambilanSimpanan) {
  const strukData = [
    {
      field: "Dibayarkan Kepada",
      value: data.namaAnggota,
    },
    {
      field: "Tanggal",
      value: formatDatebyMonth(data.tanggalPengambilanSimpanan),
    },
    {
      field: "Unit Kerja",
      value: data.namaUnitKerja,
    },
    {
      field: "Jenis Simpanan",
      value: data.jenisPengambilanSimpanan,
    },
    {
      field: "Jumlah",
      value: formatToIDR(Number(data.jumlahPengambilanSimpanan)),
    },
    {
      field: "Terbilang",
      value: toTerbilang(Number(data.jumlahPengambilanSimpanan)),
    },
    {
      field: "Keterangan",
      value:
        ".......................................................................................................",
    },
  ];

  return (
    <div className="print-a4 w-[210mm] min-h-[297mm] p-8 bg-white text-black font-serif">
      <StrukHeader />
      <p className="text-end">No: {data.noPengambilanSimpanan}</p>

      <div className="my-5 flex w-full flex-col items-center justify-center gap-1 text-base font-bold ">
        <p>BUKTI PEMBAYARAN KAS/BANK</p>
      </div>

      <table className="mb-5 w-full self-center">
        <tbody>
          {strukData.map((item, index) => (
            <tr key={index}>
              <td className="p-1">{index + 1}.</td>
              <td className="p-1">{item.field}</td>
              <td className="p-1">:</td>
              <td className="p-1">{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <table className="w-full mb-10 border-collapse border border-black">
        <thead>
          <tr>
            <th className="h-10 w-52 border border-slate-600">Disetujui</th>
            <th className="h-10 w-52 border border-slate-600">Diperiksa</th>
            <th className="h-10 w-52 border border-slate-600">Dibukukan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-black">
              <br />
              <br />
              <br />
            </td>
            <td className="border border-black">
              <br />
              <br />
              <br />
            </td>
            <td className="border border-black">
              <br />
              <br />
              <br />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mt-1 flex justify-end">
        <div className="flex flex-col items-end text-right">
          <p className=" mb-1">Bandung, {formatDatebyMonth(new Date())}</p>
          <p>Yang Menerima,</p>
          <div className="h-24 relative" />
          <p className="font-semibold relative">{data.namaAnggota}</p>
        </div>
      </div>
    </div>
  );
}
