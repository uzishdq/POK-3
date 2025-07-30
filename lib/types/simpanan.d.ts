import { JENIS_SIMPANAN } from "../constan";
import {
  JenisPendaftaranSimpananType,
  JenisSimpananType,
  StatusPendaftaranSimpananType,
  StatusPengambilanSimpananType,
} from "./helper";
import {
  TDetailLaporanSimpananBerjangka,
  TLaporanSimpananBerjangka,
} from "./laporan";

export type LastIdSimpananMap = Record<
  string,
  {
    id: string | null;
    jenis: string;
  }
>;

export type TInputPengambilanSimpanan = {
  noAnggota: string;
  noPengambilanSimpanan: string;
  tanggalPengambilanSimpanan: string;
  jenisPengambilanSimpanan: JenisSimpananType;
  jumlahPengambilanSimpanan: string;
  statusPengambilanSimpanan: StatusPengambilanSimpananType;
};

export type TMaxPengambilan = {
  sukamana: number;
  lebaran: number;
  qurban: number;
  ubar: number;
  total: number;
};

export type TSumSimpananAnggota = {
  WAJIB: number;
  SUKAMANA: number;
  LEBARAN: number;
  QURBAN: number;
  UBAR: number;
  PENGAMBILAN: number;
  SALDO: number;
};

export type TSimpananAnggota = {
  noAnggota: string;
  namaAnggota: string;
  namaUnitKerja: string;
  wajib: number;
  manasuka: number;
  lebaran: number;
  qurban: number;
  ubar: number;
  totalTaking: number;
  totalBalance: number;
};

export type TSimpananBerjangka = {
  idPendaftar: string;
  noAnggota: string;
  settingPendaftaranId: string;
  namaPendaftaran: string;
  jenisPendaftaranSimpanan: JenisPendaftaranSimpananType;
  statusPendaftaranSimpanan: StatusPendaftaranSimpananType;
  tanggalPendaftaran: string;
  jumlahPilihan: string;
};

export type TPengambilanSimpananById = {
  noPengambilanSimpanan: string;
  noAnggota: string;
  tanggalPengambilanSimpanan: string;
  jenisPengambilanSimpanan: JenisSimpananType;
  jumlahPengambilanSimpanan: string;
  statusPengambilanSimpanan: StatusPengambilanSimpananType;
};

export type TPengambilanSimpanan = {
  noPengambilanSimpanan: string;
  noAnggota: string;
  namaAnggota: string;
  namaUnitKerja: string;
  noTelp: string;
  bank: string;
  rek: string;
  tanggalPengambilanSimpanan: string;
  jenisPengambilanSimpanan: JenisSimpananType;
  jumlahPengambilanSimpanan: string;
  statusPengambilanSimpanan: StatusPengambilanSimpananType;
};

export type TStrukPengambilanSimpanan = {
  noAnggota: string;
  namaAnggota: string;
  namaUnitKerja: string;
  noPengambilanSimpanan: string;
  tanggalPengambilanSimpanan: string;
  jenisPengambilanSimpanan: JenisSimpananType;
  jumlahPengambilanSimpanan: string;
};

export type TDataStrukSimpananBerjangka = {
  noAnggota: string;
  namaAnggota: string;
  bankAnggota: string | null;
  rekeningAnggota: string | null;
  namaUnitKerja: string;
  idSettingPendaftaran: string;
  namaPendaftaran: string;
  basilSimpanan: string | null;
  tanggalAwalSimpanan: string;
  tanggalAkhirSimpanan: string;
  tanggalPembagian: string;
  updatedAt: string;
  jenisPendaftaranSimpanan: JenisPendaftaranSimpananType;
  detailSimpanan: {
    idDetailPembagian: string;
    pendaftarId: string;
    tanggalDetailPembagian: string;
    jumlahDetailPembagian: string;
  }[];
};

export type TStrukSimpananBerjangka = {
  noAnggota: string;
  namaAnggota: string;
  bankAnggota: string | null;
  rekeningAnggota: string | null;
  namaUnitKerja: string;
  namaPendaftaran: string;
  jenisSimpanan: JenisSimpananType;
  tanggalPembagian: string;
  updatedAt: string;
  totalSimpanan: number;
  basil: number;
  totalDenganBasil: number;
  admin: number;
  tabunganBersih: number;
  simpanan: TDetailLaporanSimpananBerjangka[];
};

export type TPembagianSimpanan = TLaporanSimpananBerjangka & {
  basil: number;
  totalDenganBasil: number;
  admin: number;
  tabunganBersih: number;
};
