import {
  JenisPinjamanType,
  JenisSimpananType,
  StatusPinjamanType,
} from "./helper";

export type TDataPinjamanLaporan = {
  noAnggota: string;
  nama: string;
  namaUnitKerja: string;
  noPinjaman: string;
  tanggalPinjaman: string;
  waktuPengembalian: number;
  ajuanPinjaman: string;
  jenisPinjman: JenisPinjamanType;
  statusPinjaman: StatusPinjamanType;
  AngsuranPinjaman: {
    angsuranPinjamanKe: number;
    jumlahAngsuran: string;
  }[];
};

export type TLaporanPinjaman = {
  noAnggota: string;
  nama: string;
  namaUnitKerja: string;
  noPinjaman: string;
  tanggalPinjaman: string;
  waktuPengembalian: string;
  jenisPinjman: JenisPinjamanType;
  statusPinjaman: StatusPinjamanType;
  ajuanPinjaman: number;
  jumlahAngsuran: number;
  akad: number;
  pokokMasuk: number;
  jasaMasuk: number;
  sisaPokok: number;
};

export type TDataLaporanSimpananBerjangka = {
  anggota: {
    idPendaftar: string;
    noAnggota: string;
    namaAnggota: string;
    namaUnitKerja: string;
    Simpanan: {
      tanggalSimpanan: string;
      jenisSimpanan: JenisSimpananType;
      jumlahSimpanan: string;
    }[];
    PengambilanSimpanan: {
      tanggalPengambilanSimpanan: string;
      jenisPengambilanSimpanan: JenisSimpananType;
      jumlahPengambilanSimpanan: string;
    }[];
  };
};

export type TLaporanSimpananBerjangka = {
  namaPendaftaran: string;
  noAnggota: string;
  namaAnggota: string;
  namaUnitKerja: string;
  jenisSimpanan: JenisSimpananType;
  totalPengambilan: number;
  totalSimpanan: number;
  basil: number;
  totalDenganBasil: number;
  admin: number;
  tabunganBersih: number;
  simpanan: TDetailLaporanSimpananBerjangka[];
};

export type TDetailLaporanSimpananBerjangka = {
  bulan: string;
  total: number;
};
