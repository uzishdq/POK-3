import {
  JenisPinjamanType,
  StatusAngsuranType,
  StatusPinjamanType,
} from "./helper";

export interface JenisPinjamanOption {
  name: string;
  value: JenisPinjamanType;
}

export interface ICalculateAsuransi {
  totalPremi: number;
  admin: number;
  pelunasan?: number;
  monthlyInstallment: number;
  receive: number;
}

export type GetLastPinjamanByIdResult = {
  ok: boolean;
  status:
    | "ERROR"
    | "PENDING"
    | "TIDAK_ADA_PINJAMAN"
    | "BELUM_LUNAS"
    | "SUDAH_LUNAS_SEBAGIAN"
    | "SUDAH_LUNAS";
  message: string;
  data?: {
    pinjamanId: string;
    angsuranKe: number;
    angsuranDari: number;
    totalBayar: number;
    pelunasan: number;
    persentaseLunas: number;
  };
};

export type TLastPinjamanByIdData = GetLastPinjamanByIdResult["data"];

export type TPinjaman = {
  noPinjaman: string;
  tujuanPinjaman: string;
  noAnggota: string;
  namaAnggota: string;
  namaUnitKerja: string;
  noTelp: string;
  bank: string;
  rek: string;
  tanggalPinjaman: string;
  waktuPengembalian: number;
  jenisPinjman: JenisPinjamanType;
  ajuanPinjaman: string;
  jumlahDiterima: string;
  strukGaji: string;
  jumlahPenghasilan: string;
  statusPinjaman: StatusPinjamanType;
};

export type TChartPinjaman = {
  produktif: {
    PENDING: number;
    APPROVED: number;
    COMPLETED: number;
    TOTAL: number;
  };
  barang: {
    PENDING: number;
    APPROVED: number;
    COMPLETED: number;
    TOTAL: number;
  };
};

export type TAngsuran = {
  noAngsuran: string;
  tanggalAngsuran: string;
  noAnggota: string;
  pinjamanId: string;
  angsuranPinjamanKe: number;
  angsuranPinjamanDari: number;
  jumlahAngsuran: string;
  statusAngsuran: StatusAngsuranType;
};
