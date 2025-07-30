import {
  capitalizeFirst,
  formatDatebyMonth,
  formatToIDR,
  toTerbilang,
} from "@/lib/helper";
import React from "react";
import StrukHeader from "../struk-header";
import { TSuratUndurDiri } from "@/lib/types/undur-diri";

interface IContentPengambilanSimpanan {
  data: TSuratUndurDiri;
}

export default function ContentUndurDiri({
  data,
}: IContentPengambilanSimpanan) {
  const isMinus = Number(data.jumlahSimpananDiterima) < 0;
  const strukData = [
    {
      field: "NO.KTP",
      value: data.nikAnggota,
    },
    {
      field: "Nama",
      value: data.namaAnggota,
    },
    {
      field: "Tempat/Tanggal lahir",
      value: `${data.tempatLahirAnggota} / ${formatDatebyMonth(
        data.tanggalLahirAnggota
      )}`,
    },
    {
      field: "Unit Garapan",
      value: data.namaUnitKerja,
    },
    {
      field: "Status Pegawai",
      value: capitalizeFirst(data.statusPekerjaan),
    },
  ];

  const hakKewajiban = [
    {
      field: `${isMinus ? "Sisa Kewajiban" : "Total Keseluruhan"}`,
      value: formatToIDR(Number(data.jumlahSimpananDiterima)),
    },
  ];

  const bankData = [
    {
      field: "Bank",
      value: data.bank,
    },
    {
      field: "No.Rekening",
      value: data.rekeningAnggota,
    },
    {
      field: "Atas nama",
      value: data.namaAnggota,
    },
  ];

  return (
    <div className="grid w-full place-items-center bg-white font-serif text-sm leading-relaxed text-justify">
      <div className="w-full max-w-[794px] p-4">
        <StrukHeader />

        {/* No Surat */}
        <p className="text-end font-medium">No: {data.noPengunduranDiri}</p>

        {/* Judul */}
        <div className="my-2 flex justify-center font-bold text-base">
          <p>SURAT PERNYATAAN</p>
        </div>

        <p className="my-2">Saya yang bertanda tangan di bawah ini :</p>

        {/* Tabel Data Pribadi */}
        <table className="w-full table-auto ml-10 items-center justify-center">
          <tbody>
            {strukData.map((item, index) => (
              <tr key={index}>
                <td className="px-3 py-1 w-[30%] font-medium">{item.field}</td>
                <td className="px-1 py-1 w-[5%] text-center">:</td>
                <td className="px-3 py-1 w-[65%] ">{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paragraf Surat */}
        <p className="my-2">
          Dengan ini saya menyatakan mengundurkan diri sebagai anggota Koperasi
          Karyawan Yayasan Al Ghifari, terhitung sejak{" "}
          <b>{formatDatebyMonth(data.tanggalPengunduranDiri)}</b>. Dikarenakan:{" "}
          <b>{data.keterangan}</b>
        </p>

        <p className="my-2">
          Mohon kiranya apa yang menjadi hak-hak keanggotaan saya, baik berupa
          simpanan pokok, simpanan wajib, simpanan manasuka, dan atau simpanan
          lainnya, setelah dikurangi administrasi penutupan tabungan dan
          kewajiban (apabila masih ada kewajiban), dibayarkan secara ditransfer:
        </p>

        {/* Tabel Bank */}
        <table className="my-2 w-full ml-10 table-auto border-separate border-spacing-y-1">
          <tbody>
            {Array.from({ length: Math.ceil(bankData.length / 2) }).map(
              (_, i) => {
                const first = bankData[i * 2];
                const second = bankData[i * 2 + 1];
                return (
                  <tr key={i}>
                    {/* Kolom kiri */}
                    <td className="w-[20%] p-1 font-medium ">{first?.field}</td>
                    <td className="w-[2%] text-center">:</td>
                    <td className="w-[28%] p-1 ">{first?.value}</td>

                    {/* Kolom kanan (jika ada) */}
                    {second ? (
                      <>
                        <td className="w-[20%] p-1 pl-6 font-medium ">
                          {second.field}
                        </td>
                        <td className="w-[2%] text-center">:</td>
                        <td className="w-[28%] p-1 ">{second.value}</td>
                      </>
                    ) : (
                      <td colSpan={3}></td>
                    )}
                  </tr>
                );
              }
            )}
          </tbody>
        </table>

        <p className="my-2">
          Hak simpanan yang akan dikembalikan setelah pengunduran diri adalah
          sebagai berikut:
        </p>

        {/* Tabel Simpanan & Kewajiban */}
        <table className="my-2 w-[90%] mx-auto table-fixed border-separate border-spacing-y-1">
          <tbody>
            {Array.from({
              length: Math.ceil(
                (data.simpanan.length + hakKewajiban.length) / 2
              ),
            }).map((_, i) => {
              const allData = [
                ...data.simpanan.map((item) => ({
                  field: item.jenisSimpananPengunduran,
                  value: formatToIDR(Number(item.jumlahSimpananPengunduran)),
                })),
                ...hakKewajiban,
              ];
              const first = allData[i * 2];
              const second = allData[i * 2 + 1];
              return (
                <tr key={i}>
                  <td className="w-[20%] p-1">
                    {capitalizeFirst(first?.field)}
                  </td>
                  <td className="w-[2%]">:</td>
                  <td className="w-[28%]">{first?.value}</td>

                  {second ? (
                    <>
                      <td className="w-[20%] p-1 pl-6">
                        {capitalizeFirst(second.field)}
                      </td>
                      <td className="w-[2%]">:</td>
                      <td className="w-[28%]">{second.value}</td>
                    </>
                  ) : (
                    <td colSpan={3}></td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Penutup */}
        <p className="my-2">
          Demikian surat pernyataan ini saya sampaikan dengan sebenarnya, tanpa
          ada paksaan dan desakan dari pihak manapun. Jika ada tutur kata atau
          tingkah kurang berkenan selama jadi anggota, mohon dimaafkan. Atas
          perhatian dan kerjasamanya saya ucapkan terima kasih.
        </p>

        <p className="my-4 text-end">
          Bandung, {formatDatebyMonth(data.tanggalPengunduranDiri)}
        </p>

        {/* Tanda Tangan */}
        <div className="grid w-full grid-cols-2 text-center mt-6">
          <div>
            <p className="mb-16">Menyetujui</p>
            <p className="font-bold">Pengurus Koperasi</p>
          </div>
          <div>
            <p className="mb-16">Hormat Saya</p>
            <p className="font-bold">{data.namaAnggota}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
