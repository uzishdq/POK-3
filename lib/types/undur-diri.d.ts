import {
  JenisPinjamanType,
  JenisSimpananType,
  StatusPekerjaanType,
  StatusPengunduranType,
} from "./helper";

export type TCalculatePinjamanUndurDiri = {
  pinjamanId: string;
  angsuranKe: number;
  angsuranDari: number;
  totalBayar: number;
  pelunasan: number;
  persentaseLunas: number;
};

export type TCalculateUndurDiri = {
  wajib: number;
  sukamana: number;
  lebaran: number;
  qurban: number;
  ubar: number;
  biaya: number;
  totalKotor: number;
  totalBersih: number;
  pinjamanProduktif: TCalculatePinjamanUndurDiri | null;
  pinjamanBarang: TCalculatePinjamanUndurDiri | null;
};

export type TInputSimpananUndurDiri = {
  noPengunduranDiri: string;
  jenisSimpananPengunduran: JenisSimpananType;
  jumlahSimpananPengunduran: string;
};

export type TInputPinjamanUndurDiri = {
  noPengunduranDiri: string;
  pinjamanId: string;
  jenisPinjaman: JenisPinjamanType;
  angsuranKe: number;
  angsuranDari: number;
  jumlahSudahBayar: string;
  jumlahPelunasan: string;
};

export type TUndurDiri = {
  noPengunduranDiri: string;
  tanggalPengunduranDiri: string;
  noAnggota: string;
  namaAnggota: string;
  namaUnitKerja: string;
  keterangan: string;
  jumlahSimpananBersih: string;
  jumlahSimpananDiterima: string;
  statusPengunduranDiri: StatusPengunduranType;
  simpanan: TSimpananUndurDiri[];
  pinjaman: TPinjamanUndurDiri[];
};

export type TSimpananUndurDiri = {
  idSimpananPengunduranDiri: string;
  noPengunduranDiri: string;
  tanggalSimpananPengunduranDiri: string;
  jenisSimpananPengunduran: JenisSimpananType;
  jumlahSimpananPengunduran: string;
};

export type TGetSimpananUndurDiri = {
  idSimpananPengunduranDiri: string;
  noPengunduranDiri: string;
  noAnggota: string;
  tanggalSimpananPengunduranDiri: string;
  jenisSimpananPengunduran: JenisSimpananType;
  jumlahSimpananPengunduran: string;
};

export type TPinjamanUndurDiri = {
  idPinjamanPengunduranDiri: string;
  noPengunduranDiri: string;
  pinjamanId: string;
  tanggalPinjamanPengunduranDiri: string;
  jenisPinjmanPengunduranDiri: JenisPinjamanType;
  angsuranKe: number;
  angsuranDari: number;
  jumlahSudahBayar: string;
  jumlahPelunasan: string;
};

export type TSuratUndurDiri = {
  noPengunduranDiri: string;
  tanggalPengunduranDiri: string;
  nikAnggota: string;
  noAnggota: string;
  namaAnggota: string;
  tempatLahirAnggota: string;
  tanggalLahirAnggota: string;
  bank: string | null;
  rekeningAnggota: string | null;
  statusPekerjaan: StatusPekerjaanType;
  namaUnitKerja: string;
  keterangan: string;
  jumlahSimpananBersih: string;
  jumlahSimpananDiterima: string;
  statusPengunduranDiri: StatusPengunduranType;
  simpanan: TSimpananUndurDiri[];
  pinjaman: TPinjamanUndurDiri[];
};
