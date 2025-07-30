import { TColumnExcell } from "./types/excell";

export const potonganGajiToExcell: TColumnExcell[] = [
  { header: "No Anggota", value: "noAnggota" },
  { header: "Nama", value: "namaAnggota" },
  { header: "Unit Kerja", value: "namaUnitKerja" },
  { header: "Simpanan Wajib", value: "simpananWajib" },
  { header: "Simpanan Sukamana", value: "simpananSukamana" },
  { header: "Simpanan Lebaran", value: "simpananLebaran" },
  { header: "Simpanan Qurban", value: "simpananQurban" },
  { header: "Simpanan Ubar", value: "simpananUbar" },
  { header: "No Pinjaman Produktif", value: "pinjamanProduktif" },
  { header: "Angsuran Produktif Ke", value: "angsuranKeProduktif" },
  { header: "Angsuran Produktif Dari", value: "angsuranDariProduktif" },
  { header: "Jumlah Angsuran Produktif", value: "jumlahAngsuranProduktif" },
  { header: "No Pinjaman Barang", value: "pinjamanBarang" },
  { header: "Angsuran Barang Ke", value: "angsuranKeBarang" },
  { header: "Angsuran Barang Dari", value: "angsuranDariBarang" },
  { header: "Jumlah Angsuran Barang", value: "jumlahAngsuranBarang" },
  { header: "Total Potongan", value: "totalPotongan" },
];

export const pendaftarSimpananToExcell: TColumnExcell[] = [
  { header: "No Anggota", value: "noAnggota" },
  { header: "Nama", value: "namaAnggota" },
  { header: "Unit Kerja", value: "namaUnitKerja" },
  { header: "Jumlah Simpanan", value: "jumlahPilihan" },
];

export const masterAnggotaToExcell: TColumnExcell[] = [
  { header: "No Anggota", value: "noAnggota" },
  { header: "Nama", value: "namaAnggota" },
  { header: "Unit Kerja", value: "namaUnitKerja" },
  { header: "Jenis Kelamin", value: "jenisKelaminAnggota" },
  { header: "No Telp", value: "noTelpAnggota" },
  { header: "Bank", value: "bankAnggota" },
  { header: "Rekening", value: "rekeningAnggota" },
  { header: "Sukamana", value: "pilihanSukamana" },
  { header: "Status Anggota", value: "statusAnggota" },
];

export const asuransiToExcell: TColumnExcell[] = [
  { header: "No Asuransi", value: "noAsuransi" },
  { header: "Nama", value: "namaAnggota" },
  { header: "Unit Kerja", value: "namaUnitKerja" },
  { header: "Usia", value: "usiaAsuransi" },
  { header: "No Pinjaman", value: "pinjamanId" },
  { header: "Tanggal Awal Asuransi", value: "tanggalAsuransi" },
  { header: "Tanggal Akhir Asuransi", value: "tanggalAkhirAsuransi" },
  { header: "TH", value: "masaAsuransiTH" },
  { header: "BL", value: "masaAsuransiBL" },
  { header: "JK", value: "masaAsuransiJK" },
  { header: "UP", value: "UP" },
  { header: "Status", value: "statusPinjaman" },
  { header: "Jumlah Premi", value: "premi" },
];

export const simpananAnggotaToExcell: TColumnExcell[] = [
  { header: "No Anggota", value: "noAnggota" },
  { header: "Nama", value: "namaAnggota" },
  { header: "Unit Kerja", value: "namaUnitKerja" },
  { header: "Wajib", value: "wajib" },
  { header: "Manasuka", value: "manasuka" },
  { header: "Lebaran", value: "lebaran" },
  { header: "Qurban", value: "qurban" },
  { header: "Ubar", value: "ubar" },
  { header: "Jumlah Penarikan", value: "totalTaking" },
  { header: "Saldo", value: "totalBalance" },
];

export const pengambilanSimpananAnggotaToExcell: TColumnExcell[] = [
  { header: "No Pengambilan Simpanan", value: "noPengambilanSimpanan" },
  { header: "No Anggota", value: "noAnggota" },
  { header: "Nama", value: "namaAnggota" },
  { header: "Unit Kerja", value: "namaUnitKerja" },
  { header: "Tanggal", value: "tanggalPengambilanSimpanan" },
  { header: "Jenis", value: "jenisPengambilanSimpanan" },
  { header: "Status", value: "statusPengambilanSimpanan" },
  { header: "Jumlah", value: "jumlahPengambilanSimpanan" },
];

export const columnsExcelLaporanPinjaman: TColumnExcell[] = [
  { header: "No Anggota", value: "noAnggota" },
  { header: "Nama", value: "nama" },
  { header: "Unit Garapan", value: "namaUnitKerja" },
  { header: "No Pinjaman", value: "noPinjaman" },
  { header: "Jenis", value: "jenisPinjman" },
  { header: "Akad", value: "akad" },
  { header: "Jumlah Pinjaman", value: "ajuanPinjaman" },
  { header: "Tanggal", value: "tanggalPinjaman" },
  { header: "Angsuran Ke", value: "waktuPengembalian" },
  { header: "Pokok Masuk", value: "pokokMasuk" },
  { header: "Jasa Masuk", value: "jasaMasuk" },
  { header: "Sisa Pokok", value: "sisaPokok" },
  { header: "Status Pinjaman", value: "statusPinjaman" },
];
