import {
  JenisPelunasanPinjamanType,
  JenisPinjamanType,
  JenisSimpananType,
  StatusNotificationType,
  StatusPelunasanPinjamanType,
  StatusPengambilanSimpananType,
  StatusPinjamanType,
} from "./helper";

export type TNotifikasi = {
  noTelpNotification: string;
  messageNotification: string;
};

export type TGetNotifikasi = {
  idNotification: string;
  tanggalNotification: string;
  noTelpNotification: string | null;
  messageNotification: string;
  statusNotification: StatusNotificationType;
};

export type TPhoneNumber = {
  name: string;
  noTelp: string;
};

export type TPinjamanNotifikasi = {
  noPinjaman: string;
  tujuanPinjaman: string;
  noAnggota: string;
  tanggalPinjaman: string;
  waktuPengembalian: number;
  jenisPinjman: JenisPinjamanType;
  ajuanPinjaman: string;
  jumlahDiterima: string;
  strukGaji: string;
  jumlahPenghasilan: string;
  statusPinjaman: StatusPinjamanType;
};

export type TPelunasanPinjamanNotifikasi = {
  pinjamanId: string;
  jenisPelunasanPinjaman: JenisPelunasanPinjamanType;
  buktiPelunasan: string;
  angsuranKePelunasanPinjaman: number;
  sudahDibayarkan: string;
  jumlahPelunasanPinjaman: string;
  noPelunasanPinjaman: string;
  tanggalPelunasanPinjaman: string;
  statusPelunasanPinjaman: StatusPelunasanPinjamanType;
};

export type TPengambilanSimpananNotifikasi = {
  noAnggota: string;
  noPengambilanSimpanan: string;
  tanggalPengambilanSimpanan: string;
  jenisPengambilanSimpanan: JenisSimpananType;
  jumlahPengambilanSimpanan: string;
  statusPengambilanSimpanan: StatusPengambilanSimpananType;
};

export type TUndurDiriNotifikasi = {
  keterangan: string;
  noAnggota: string;
  noPengunduranDiri: string;
  tanggalPengunduranDiri: string;
  jumlahSimpananBersih: string;
  jumlahSimpananDiterima: string;
  statusPengunduranDiri: StatusPengunduranType;
};
