import { formatDatebyMonth, formatToIDR } from "@/lib/helper";
import { TStrukPinjaman } from "@/lib/types/struk";
import React from "react";
import AsuransiHeader from "../asuransi-header";

interface IPernyataanPinjaman {
  data: TStrukPinjaman;
}

export default function PernyataanPinjaman({ data }: IPernyataanPinjaman) {
  const calonPeserta = [
    {
      field: "Nama Lengkap",
      value: data.namaAnggota,
    },
    {
      field: "Tempat & Tanggal lahir",
      value: `${data.tempatLahirAnggota} - ${formatDatebyMonth(
        new Date(data.tanggalLahirAnggota)
      )}`,
    },
    {
      field: "Alamat Tempat tinggal",
      value: data.alamatAnggota,
    },
    {
      field: "Pekerjaan",
      value: data.namaJabatan,
    },
    {
      field: "Instansi Tempat Kerja",
      value: data.namaUnitKerja,
    },
  ];

  const permintaanAsuransi = [
    {
      field: "Uang Pertanggungan",
      value: "",
    },
    {
      field: "Masa Asuransi",
      value: "",
    },
    {
      field: "Premi Asuransi",
      value: "",
    },
    {
      field: "Cara Bayar Premi",
      value: "",
    },
  ];

  const pembiayaan = [
    {
      field: "jumlah Pinjaman",
      value: formatToIDR(Number(data.ajuanPinjaman)),
    },
    {
      field: "Tujuan Pinjaman",
      value: data.tujuanPinjaman,
    },
    {
      field: "Penghasilan Tetap per tahun",
      value: "",
    },
    {
      field: "Penghasilan Tambahan",
      value: "",
    },
    {
      field: "Pengeluaran Rutin per tahun",
      value: "",
    },
  ];

  const kesehatan = [
    {
      field: "apakah anda sekarang dalam keadaan sehat ?",
      value: "YA / TIDAK",
    },
    {
      field:
        "Dalam 2 tahun terakhir, apakah anda pernah dioperasi / dirawat di rumah sakit / menjalani pengobatan / perawatan yang membutuhkan obat-obatan dalam masa yang lama ?",
      value: "YA / TIDAK",
    },
    {
      field:
        "Dalam 2 tahun terakhir, apakah anda pernah sakit atau sedang menderita penyakit Asma,Cacat, Tumor/Kanker, TBC, Kencing manis, Hati, Ginjal, Jantung, Stroke, Tekanan DarahTinggi, Epilepsi, Gangguan jiwa, Keterbatasan mental atau idiot ?",
      value: "YA / TIDAK",
    },
    {
      field: "Khusus Wanita, apakah anda sedang dalam keadaan hamil ?",
      value: "YA / TIDAK",
    },
    {
      field:
        "Riwayat Keluarga, apakah diantara orang tua / saudara anda, ada yang pernah sakit atau sedang menderita penyakit Asma, Cacat, Tumor/Kanker, TBC, Kencing manis, Hati,Ginjal, Jantung, Stroke, Tekanan Darah Tinggi, Epilepsi, Gangguan jiwa, Keterbatasan mental atau idiot ?",
      value: "YA / TIDAK",
    },
    {
      field: "Apakah anda seorang kidal ? ",
      value: "YA / TIDAK",
    },
  ];

  const kesehatan2 = [
    {
      field:
        "Apakah diantara orang tua / saudara kandung anda, ada yang pernah melakukan percobaan bunuh diri ?",
      value: "YA / TIDAK",
    },
    {
      field: "Apakah anda seorang perokok ?",
      value: "YA / TIDAK",
    },
    {
      field:
        "Pernahkah berat badan anda bertambah atau berkurang ≥ 5 Kg dalam 12 bulan terakhir ?",
      value: "YA / TIDAK",
    },
    {
      field: "Berapakah Berat Badan dan Tinggi Badan saat ini ?",
      value: "YA / TIDAK",
    },
  ];

  const asuransi = [
    {
      field:
        "Apakah anda dalam masa pengcoveran Asuransi Jiwa oleh AJB Bumiputera 1912 jika “Ya”,berapa besarnya Uang Pertanggungan yang masih berlaku ?",
      value: "YA / TIDAK",
    },
  ];

  return (
    <div className="print-a4 w-[210mm] min-h-[297mm] p-8 bg-white text-black font-serif">
      <AsuransiHeader />
      <div className="my-5 self-center">
        <ol className="list-decimal text-left">
          <li className="mb-2 font-bold">DATA CALON PESERTA</li>
          <table className="mb-5 w-full">
            <tbody>
              {calonPeserta.map((data, index) => (
                <tr key={index} className="border border-black">
                  <td className="w-48 p-1 pb-1">{data.field}</td>
                  <td className="w-2 p-1">:</td>
                  <td className="p-1">{data.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <li className="mb-2 font-bold">DATA PERMINTAAN ASURANSI</li>
          <table className="mb-5 w-full">
            <tbody>
              {permintaanAsuransi.map((data, index) => (
                <tr key={index} className="border border-black">
                  <td className="w-48 p-1">{data.field}</td>
                  <td className="w-2 p-1">:</td>
                  <td className="p-1">{data.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <li className="mb-2 font-bold">DATA PEMBIAYAAN & KEUANGAN</li>
          <table className="mb-5 w-full">
            <tbody>
              {pembiayaan.map((data, index) => (
                <tr key={index} className="border border-black">
                  <td className="w-48 p-1">{data.field}</td>
                  <td className="w-2 p-1">:</td>
                  <td className="p-1">{data.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <li className="mb-2 font-bold">
            KETERANGAN KESEHATAN {"(diisi oleh calon peserta)"}
          </li>
          <table className="mb-5 w-full">
            <thead className="text-center text-sm font-bold">
              <tr>
                <td className="border border-black p-1">No</td>
                <td className="border border-black p-1">PERTANYAAN</td>
                <td className="border border-black p-1">JAWABAN</td>
              </tr>
            </thead>
            <tbody>
              {kesehatan.map((data, index) => (
                <tr key={index}>
                  <td className="border border-black p-1">{index + 1}</td>
                  <td className="border border-black p-1">{data.field}</td>
                  <td className="border border-black p-1 text-sm">
                    {data.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <br />
          <table className="mb-5 w-full ">
            <thead className="text-center text-sm font-bold">
              <tr>
                <td className="border border-black p-1">No</td>
                <td className="border border-black p-1">PERTANYAAN</td>
                <td className="border border-black p-1">JAWABAN</td>
              </tr>
            </thead>
            <tbody>
              {kesehatan2.map((data, index) => (
                <tr key={index}>
                  <td className="border border-black p-1">{index + 7}</td>
                  <td className="border border-black p-1">{data.field}</td>
                  <td className="border border-black p-1 text-sm">
                    {data.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <li className="mb-2 font-bold">
            DATA ASURANSI {"(diisi oleh calon peserta)"}
          </li>
          <table className="mb-5 w-full ">
            <thead className="text-center text-sm font-bold">
              <tr>
                <td className="border border-black p-1">PERTANYAAN</td>
                <td className="border border-black p-1">JAWABAN</td>
              </tr>
            </thead>
            <tbody>
              {asuransi.map((data, index) => (
                <tr key={index}>
                  <td className="border border-black p-1">{data.field}</td>
                  <td className="border border-black p-1 text-sm">
                    {data.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <li className="mb-2 font-bold">PERNYATAAN</li>
          <ol className="list-disc pl-4 text-justify text-sm">
            <li className="mb-1">
              Pernyataan ini saya buat sesuai dengan keadaan yang sebenarnya dan
              saya menyatakan jika ada keterangan yang tidak benar maka AJB
              Bumiputera 1912 berhak membatalkan perjanjian asuransi saya dan
              dibebaskan dari kewajiban membayar apapun
            </li>
            <li className="mb-1">
              Saya menyetujui dan memberikan izin kepada AJB Bumiputera 1912
              untuk dapat meminta data riwayat kesehatan saya di BPJS Kesehatan
              / rumah sakit / klinik / puskesmas / dokter / intansi kesehatan
              lainnya berdasarkan UU Kesehatan No 36 Thn 2009 Pasal 57 ayat 2
            </li>
            <li className="mb-1">
              Dalam hal saya terbukti sebagai penderita HIV / AIDS maka AJB
              Bumiputera 1912 dibebaskan dari kewajiban untuk membayar apapun
            </li>
            <li className="mb-1">
              Segala bentuk copy dan persyaratan ini sama kuatnya dan sah
              seperti aslinya dan merupakan pernyataan yang menjadi satu
              kesatuan yang tidak terpisahkan dan polis
            </li>
          </ol>
        </ol>
        <table className="my-5 mb-5 w-full text-center font-bold ">
          <thead>
            <tr>
              <td className="w-auto border border-black p-1">
                Mengetahui {"(pemegang polis)"}
              </td>
              <td className="w-auto border border-black p-1">
                Yang Memberikan Pernyataan {"(calon peserta)"}
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="h-20  border border-black p-1"></td>
              <td className="h-20  border border-black p-1"></td>
            </tr>
            <tr>
              <td className=" border border-black p-1"></td>
              <td className=" border border-black p-1">{data.namaAnggota}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
