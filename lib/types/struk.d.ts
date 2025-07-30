import { JenisPinjamanType } from "./helper";

export type TStrukPinjaman = {
  nikAnggota: string;
  namaAnggota: string;
  tanggalLahirAnggota: string;
  tempatLahirAnggota: string;
  alamatAnggota: string;
  noTelpAnggota: string;
  namaJabatan: string;
  namaUnitKerja: string;
  alamatUnitKerja: string;
  noPinjaman: string;
  tujuanPinjaman: string;
  tanggalPinjaman: string;
  waktuPengembalian: number;
  jenisPinjaman: JenisPinjamanType;
  ajuanPinjaman: string;
  jumlahPenghasilan: string;
};
