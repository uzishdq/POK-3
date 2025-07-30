import {
  JenisPinjamanType,
  JenisSimpananType,
  StatusAngsuranType,
} from "./helper";

export type TPotongGaji = {
  noAnggota: string;
  namaAnggota: string;
  namaUnitKerja: string;
  simpananWajib: number;
  simpananSukamana: number;
  simpananLebaran: number;
  simpananQurban: number;
  simpananUbar: number;
  pinjamanProduktif: string;
  angsuranKeProduktif: number;
  angsuranDariProduktif: number;
  jumlahAngsuranProduktif: number;
  pinjamanBarang: string;
  angsuranKeBarang: number;
  angsuranDariBarang: number;
  jumlahAngsuranBarang: number;
  totalPotongan: number;
};

export type THistoryPotongGaji = {
  idPotongGaji: string;
  tanggalPotongGaji: string;
  noAnggota: string;
  namaAnggota: string;
  namaUnitKerja: string;
  simpananWajib: number | null;
  simpananSukamana: number | null;
  simpananLebaran: number | null;
  simpananQurban: number | null;
  simpananUbar: number | null;
  noPinjamanProduktif: string | null;
  angsuranKeProduktif: number | null;
  angsuranDariProduktif: number | null;
  jumlahAngsuranProduktif: string | null;
  noPinjamanBarang: string | null;
  angsuranKeBarang: number | null;
  angsuranDariBarang: number | null;
  jumlahAngsuranBarang: string | null;
  totalPotonganGaji: string | null;
};

export type TInputPotongGaji = {
  noAnggota: string;
  simpananWajib: number | null;
  simpananSukamana: number | null;
  simpananLebaran: number | null;
  simpananQurban: number | null;
  simpananUbar: number | null;
  noPinjamanProduktif: string | null;
  angsuranKeProduktif: number | null;
  angsuranDariProduktif: number | null;
  jumlahAngsuranProduktif: string | null;
  noPinjamanBarang: string | null;
  angsuranKeBarang: number | null;
  angsuranDariBarang: number | null;
  jumlahAngsuranBarang: string | null;
  totalPotonganGaji: string | null;
};

export type TAnggotaPotongGaji = {
  noAnggota: string;
  namaAnggota: string;
  namaUnitKerja: string | null;
  pilihanSukamana: string | null;
};

export type TSimpananPotongGaji = {
  noAnggota: string;
  jenisSimpanan: "LEBARAN" | "QURBAN" | "UBAR" | null;
  jumlahPilihan: string;
};

export type TPinjamanPotongGaji = {
  noPinjaman: string;
  noAnggota: string;
  jenisPinjaman: "PRODUKTIF" | "BARANG";
  angsuranKe: number;
  angsuranDari: number;
  jumlahAngsuran: string;
};

export type TInputSimpanan = {
  noSimpanan: string;
  noAnggota: string;
  jenisSimpanan: JenisSimpananType;
  jumlahSimpanan: string;
};

export type typeTInputAngsuran = {
  noAngsuran: string;
  pinjamanId: string;
  jenisPinjaman: "PRODUKTIF" | "BARANG";
  angsuranPinjamanKe: number;
  angsuranPinjamanDari: number;
  jumlahAngsuran: string;
  statusAngsuran: StatusAngsuranType;
};
