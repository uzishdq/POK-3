import { StatusPinjamanType } from "./helper";

export type TAsuransi = {
  noAsuransi: string;
  pinjamanId: string;
  namaAnggota: string;
  namaUnitKerja: string;
  usiaAsuransi: number;
  tanggalAsuransi: string;
  tanggalAkhirAsuransi: string;
  masaAsuransiTH: number;
  masaAsuransiBL: number;
  masaAsuransiJK: number;
  UP: string;
  premi: number;
  statusPinjaman: StatusPinjamanType;
};
