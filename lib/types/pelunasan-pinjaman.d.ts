import {
  JenisPelunasanPinjamanType,
  JenisPinjamanType,
  StatusPelunasanPinjamanType,
} from "./helper";

export type TPelunasanPinjaman = {
  noPelunasanPinjaman: string;
  pinjamanId: string;
  noAnggota: string;
  namaAnggota: string;
  namaUnitKerja: string;
  tanggalPelunasanPinjaman: string;
  jenisPelunasanPinjaman: JenisPelunasanPinjamanType;
  angsuranKePelunasanPinjaman: number;
  sudahDibayarkan: string;
  jumlahPelunasanPinjaman: string;
  buktiPelunasan: string;
  statusPelunasanPinjaman: StatusPelunasanPinjamanType;
};

export type TPelunasan = {
  noPinjaman: string;
};

export type TValidasiPelunasan = {
  ok: boolean;
  message: string;
  data: {
    noPinjaman: string;
    tujuanPinjaman: string;
    tanggalPinjaman: string;
    jenisPinjman: JenisPinjamanType;
    ajuanPinjaman: string;
    angsuranKe: number;
    angsuranDari: number;
    admin: number;
    totalBayar: number;
    pelunasan: number;
  } | null;
};

export type TValidasiPelunasanData = TValidasiPelunasan["data"];
