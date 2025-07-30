import { formatDatebyMonth, formatToIDR } from "./helper";
import {
  JenisPelunasanPinjamanType,
  JenisPendaftaranSimpananType,
  JenisPinjamanType,
  JenisSimpananType,
  StatusPelunasanPinjamanType,
  StatusPengambilanSimpananType,
  StatusPengunduranType,
  StatusPinjamanType,
} from "./types/helper";
import { TInputSimpanan, typeTInputAngsuran } from "./types/potong-gaji";

function getCurrentYear(): number {
  return new Date().getFullYear();
}

export interface ITemplateBulk {
  title: string;
  nama: string;
  pesan: string;
}

export const templateBulk = (props: ITemplateBulk) => {
  return `*${props.title}*

_Assalamualaikum_, 
${props.nama}

${props.pesan}

Hormat kami,
KOPKAR YAG ${getCurrentYear()}`;
};

//NOTIFIKASI POTONG GAJI
export interface ITemplatePotonganGajiSimpanan {
  nama: string;
  namaUnitkerja: string;
  simpanan: TInputSimpanan[];
}

export interface ITemplatePotonganGajiAngsuran {
  nama: string;
  namaUnitkerja: string;
  angsuran: typeTInputAngsuran[];
}

export const templatePotonganGajiSimpanan = (
  props: ITemplatePotonganGajiSimpanan
) => {
  return `*Pemberitahuan Simpanan*

_Assalamualaikum_, 
Kepada Yth.  
Bapak/Ibu ${props.nama}  
di ${props.namaUnitkerja}

Kami senang memberitahu bahwa simpanan anda telah berhasil masuk. Detail transaksi dapat dilihat di bawah ini:
${props.simpanan
  .map(
    (item) => `
Simpanan *${item.jenisSimpanan}* :
- No.Simpanan: ${item.noSimpanan} 
- Tanggal: ${formatDatebyMonth(new Date())}
- Jumlah: ${formatToIDR(Number(item.jumlahSimpanan))}`
  )
  .join("\n")}

Terima kasih telah mempercayakan layanan kami. Untuk pertanyaan atau informasi tambahan, hubungi petugas koperasi.

Hormat kami,  
KOPKAR YAG ${getCurrentYear()}`;
};

export const templatePotonganGajiAngsuran = (
  props: ITemplatePotonganGajiAngsuran
) => {
  return `*Pemberitahuan Angsuran Pinjaman*

_Assalamualaikum_, 
Kepada Yth.  
Bapak/Ibu ${props.nama}  
di ${props.namaUnitkerja}

Kami ingin memberitahu bahwa angsuran pinjaman anda telah berhasil masuk. Detail transaksi dapat dilihat di bawah ini:
${props.angsuran
  .map(
    (item) => `
No Pinjaman: ${item.pinjamanId}
Pinjaman: *${item.jenisPinjaman}*
- No.Angsuran: ${item.noAngsuran} 
- Tanggal: ${formatDatebyMonth(new Date())}
- Angsuran Ke: ${item.angsuranPinjamanKe} Dari: ${item.angsuranPinjamanDari}
- Jumlah Angsuran: ${formatToIDR(Number(item.jumlahAngsuran))}

Status Pinjaman: *${item.statusAngsuran}*
`
  )
  .join("\n")}

Terima kasih telah mempercayakan layanan kami. Untuk pertanyaan atau informasi tambahan, hubungi petugas koperasi.

Hormat kami,  
KOPKAR YAG ${getCurrentYear()}`;
};

//NOTIFIKASI PENDAFTARAN SIMPANAN BERJANGKA
export interface ITemplatePengumumamPendaftaranSimpanan {
  nama: string;
  namaPendaftaran: string;
  jenisPendaftaranSimpanan: JenisPendaftaranSimpananType;
  tanggalAwalSimpanan: string;
  tanggalAkhirSimpanan: string;
  tanggalTutupPendaftaran: string;
  createdAt: string;
}

export const templatePengumumamPendaftaranSimpanan = (
  props: ITemplatePengumumamPendaftaranSimpanan
) => {
  return `*Pemberitahuan Pendaftaran Simpanan ${props.jenisPendaftaranSimpanan}*

_Assalamualaikum_,
Kepada Yth,
Bapak/Ibu ${props.nama}
Anggota Koperasi Karyawan Yayasan Al Ghifari
Di tempat

Dengan Hormat,

Kami dengan senang hati mengumumkan bahwa dibukanya pendaftaran ${
    props.namaPendaftaran
  } bagi seluruh anggota koperasi. Adapun rincian informasi terkait pendaftaran simpanan adalah sebagai berikut:

Jenis Simpanan : *${props.jenisPendaftaranSimpanan}*

- Waktu Pendaftaran : ${formatDatebyMonth(
    props.createdAt
  )} s/d ${formatDatebyMonth(props.tanggalTutupPendaftaran)}
- Jangka Waktu Simpanan : ${formatDatebyMonth(
    props.tanggalAwalSimpanan
  )} s/d ${formatDatebyMonth(props.tanggalAkhirSimpanan)}

Silakan mendaftar di aplikasi POK melalui halaman pendaftaran simpanan.Terima kasih telah mempercayakan layanan kami. Untuk pertanyaan atau informasi tambahan, hubungi petugas koperasi.

Hormat kami,  
KOPKAR YAG ${getCurrentYear()}`;
};

//NOTIFIKASI PENGAJUAN PINJAMAN
export interface ITemplatePengajuanPinjaman {
  nama: string;
  namaUnitkerja: string;
  noPinjaman: string;
  tujuanPinjaman: string;
  tanggalPinjaman: string;
  waktuPengembalian: number;
  jenisPinjman: JenisPinjamanType;
  ajuanPinjaman: string;
  statusPinjaman: StatusPinjamanType;
}

export interface ITemplatePengajuanPinjamanPetugas
  extends ITemplatePengajuanPinjaman {
  namaPetugas: string;
  role: string;
}

export const templatePengajuanPinjaman = (
  props: ITemplatePengajuanPinjaman
) => {
  let opening = "";
  let closing =
    "Terima kasih telah mempercayakan layanan kami. Untuk pertanyaan atau informasi tambahan, hubungi petugas koperasi.";

  switch (props.statusPinjaman) {
    case "PENDING":
      opening =
        "Kami dengan senang hati menginformasikan bahwa pengajuan pinjaman Anda telah berhasil diajukan :";
      closing =
        "Terima kasih telah mempercayakan layanan kami. Proses memperlukan 3-5 hari kerja. Untuk pertanyaan atau informasi tambahan, hubungi petugas koperasi.";
      break;
    case "APPROVED":
      opening =
        "Kami dengan senang hati menginformasikan bahwa pengajuan pinjaman Anda telah berhasil diproses :";
      break;
    case "REJECTED":
      opening =
        "Mohon Maaf, Kami menginformasikan bahwa pengajuan pinjaman Anda telah gagal diproses :";
      break;
    default:
      break;
  }

  return `*Pemberitahuan Pengajuan Pinjaman*

_Assalamualaikum_, 
Kepada Yth.  
Bapak/Ibu ${props.nama}  
di ${props.namaUnitkerja}

${opening}

- No Pinjaman: ${props.noPinjaman}
- Jenis Pinjaman : ${props.jenisPinjman}
- Tanggal: ${formatDatebyMonth(props.tanggalPinjaman)}
- Waktu Pengembalian: ${props.waktuPengembalian} Bulan
- Jumlah: ${formatToIDR(Number(props.ajuanPinjaman))}
- Tujuan: ${props.tujuanPinjaman}

Status Pinjaman : *${props.statusPinjaman}*

${closing}

Hormat kami,  
KOPKAR YAG ${getCurrentYear()}`;
};

export const templatePengajuanPinjamanPetugas = (
  props: ITemplatePengajuanPinjamanPetugas
) => {
  return `*Pemberitahuan Pengajuan Pinjaman Anggota*

_Assalamualaikum_,
${props.namaPetugas} - ${props.role}

Kami ingin memberitahukan bahwa permohonan Pinjaman anggota telah diajukan. Detail Pinjaman Anggota:

Nama: ${props.nama}
Unit Garapan: ${props.namaUnitkerja}
Jenis Pinjaman: ${props.jenisPinjman}

- No Pinjaman: ${props.noPinjaman}
- Tanggal: ${formatDatebyMonth(props.tanggalPinjaman)}
- Waktu Pengembalian: ${props.waktuPengembalian} Bulan
- Jumlah: ${formatToIDR(Number(props.ajuanPinjaman))}
- Tujuan: ${props.tujuanPinjaman}

Harap segera meninjau dan memproses permohonan ini sesuai dengan prosedur yang berlaku. Terimakasih

Hormat kami,
KOPKAR YAG ${getCurrentYear()}`;
};

//NOTIFIKASI PEGAMBILAN SIMPANAN
export interface ITemplatePengambilanSimpanan {
  nama: string;
  namaUnitkerja: string;
  noPengambilanSimpanan: string;
  tanggalPengambilanSimpanan: string;
  jenisPengambilanSimpanan: JenisSimpananType;
  jumlahPengambilanSimpanan: string;
  statusPengambilanSimpanan: StatusPengambilanSimpananType;
}

export interface ITemplatePengambilanSimpananPetugas
  extends ITemplatePengambilanSimpanan {
  namaPetugas: string;
  role: string;
}

export const templatePengambilanSimpanan = (
  props: ITemplatePengambilanSimpanan
) => {
  let opening = "";
  let closing =
    "Terima kasih telah mempercayakan layanan kami. Untuk pertanyaan atau informasi tambahan, hubungi petugas koperasi.";

  switch (props.statusPengambilanSimpanan) {
    case "PENDING":
      opening =
        "Kami dengan senang hati menginformasikan bahwa Pengambilan simpanan Anda telah berhasil diajukan :";
      closing =
        "Terima kasih telah mempercayakan layanan kami. Proses memperlukan 3-5 hari kerja. Untuk pertanyaan atau informasi tambahan, hubungi petugas koperasi.";
      break;
    case "APPROVED":
      opening =
        "Kami dengan senang hati menginformasikan bahwa pengambilan simpanan Anda telah berhasil diproses :";
      break;
    case "REJECTED":
      opening =
        "Mohon Maaf, Kami menginformasikan bahwa pengambilan simpanan Anda telah gagal diproses :";
      break;
    default:
      break;
  }

  return `*Pemberitahuan Pengambilan Simpanan*
  
_Assalamualaikum_,
Kepada Yth.  
Bapak/Ibu ${props.nama}  
di ${props.namaUnitkerja}

${opening}

- Nomor Transaksi: ${props.noPengambilanSimpanan}
- Tanggal: ${formatDatebyMonth(props.tanggalPengambilanSimpanan)}
- Jenis Simpanan: ${props.jenisPengambilanSimpanan}
- Jumlah Penarikan: ${formatToIDR(Number(props.jumlahPengambilanSimpanan))}

Status Pengambilan: *${props.statusPengambilanSimpanan}*

${closing}

Hormat kami,  
KOPKAR YAG ${getCurrentYear()}`;
};

export const templatePengambilanSimpananPetugas = (
  props: ITemplatePengambilanSimpananPetugas
) => {
  return `*Pemberitahuan Pengambilan Simpanan Anggota*

_Assalamualaikum_,
${props.namaPetugas} - ${props.role}

Kami ingin memberitahukan bahwa permohonan pengambilan simpanan anggota telah diajukan. Detail pengambilan simpanan:

Nama: ${props.nama}
Unit Garapan : ${props.namaUnitkerja}

- Nomor Transaksi: ${props.noPengambilanSimpanan}
- Tanggal: ${formatDatebyMonth(props.tanggalPengambilanSimpanan)}
- Jenis Simpanan: ${props.jenisPengambilanSimpanan}
- Jumlah Penarikan: ${formatToIDR(Number(props.jumlahPengambilanSimpanan))}

Harap segera meninjau dan memproses permohonan ini sesuai dengan prosedur yang berlaku. Terimakasih

Hormat kami,  
KOPKAR YAG ${getCurrentYear()}`;
};

//NOTIFIKASI PELUNASAN PINJAMAN
export interface ITemplatePelunasanPinjaman {
  nama: string;
  namaUnitkerja: string;
  pinjamanId: string;
  jenisPelunasanPinjaman: JenisPelunasanPinjamanType;
  buktiPelunasan: string;
  angsuranKePelunasanPinjaman: number;
  sudahDibayarkan: string;
  jumlahPelunasanPinjaman: string;
  noPelunasanPinjaman: string;
  tanggalPelunasanPinjaman: string;
  statusPelunasanPinjaman: StatusPelunasanPinjamanType;
}

export interface ITemplatePelunasanPinjamanPetugas
  extends ITemplatePelunasanPinjaman {
  namaPetugas: string;
  role: string;
}

export const templatePelunasanPinjaman = (
  props: ITemplatePelunasanPinjaman
) => {
  let opening = "";
  let closing =
    "Terima kasih telah mempercayakan layanan kami. Untuk pertanyaan atau informasi tambahan, hubungi petugas koperasi.";

  switch (props.statusPelunasanPinjaman) {
    case "PENDING":
      opening =
        "Kami dengan senang hati menginformasikan bahwa pengajuan pelunasan pinjaman Anda telah berhasil diajukan :";
      closing =
        "Terima kasih telah mempercayakan layanan kami. Proses memperlukan 3-5 hari kerja. Untuk pertanyaan atau informasi tambahan, hubungi petugas koperasi.";
      break;
    case "APPROVED":
      opening =
        "Kami dengan senang hati menginformasikan bahwa pengajuan pelunasan pinjaman Anda telah berhasil diproses :";
      break;
    case "REJECTED":
      opening =
        "Mohon Maaf, Kami menginformasikan bahwa pengajuan pelunasan pinjaman Anda telah gagal diproses :";
      break;
    default:
      break;
  }

  return `*Pemberitahuan Pelunasan Pinjaman*
  
_Assalamualaikum_, 
Kepada Yth.  
Bapak/Ibu ${props.nama}  
di ${props.namaUnitkerja}

${opening}

Pinjaman:
- No Pinjaman: ${props.pinjamanId}
- Angsuran ke : ${props.angsuranKePelunasanPinjaman} Bulan 
- Total Bayar: ${formatToIDR(Number(props.sudahDibayarkan))}

Pelunasan Pinjaman: 
- Nomor Transaksi: ${props.noPelunasanPinjaman}
- Tanggal: ${formatDatebyMonth(props.tanggalPelunasanPinjaman)}
- Jumlah Pelunasan: ${formatToIDR(Number(props.jumlahPelunasanPinjaman))}
- Metode Pembayaran: ${props.jenisPelunasanPinjaman}

Status Pelunasan : *${props.statusPelunasanPinjaman}*

${closing}

Hormat kami,  
KOPKAR YAG ${getCurrentYear()}`;
};

export const templatePelunasanPinjamanPetugas = (
  props: ITemplatePelunasanPinjamanPetugas
) => {
  return `*Pemberitahuan Pelunasan Pinjaman Anggota*

_Assalamualaikum_, 
${props.namaPetugas} - ${props.role}

Kami ingin memberitahukan bahwa permohonan Pelunasan Pinjaman anggota telah diajukan. Detail Pelunasan Anggota:

Nama: ${props.nama}
Unit Garapan: ${props.namaUnitkerja}
Jenis Pinjaman: jenisPinjaman

Pinjaman:
- No Pinjaman: ${props.pinjamanId}
- Angsuran ke : ${props.angsuranKePelunasanPinjaman} Bulan 
- Total Bayar: ${formatToIDR(Number(props.sudahDibayarkan))}

Pelunasan Pinjaman: 
- Nomor Transaksi: ${props.noPelunasanPinjaman}
- Tanggal: ${formatDatebyMonth(props.tanggalPelunasanPinjaman)}
- Jumlah Pelunasan: ${formatToIDR(Number(props.jumlahPelunasanPinjaman))}
- Metode Pembayaran: ${props.jenisPelunasanPinjaman}

Status Pelunasan : *${props.statusPelunasanPinjaman}*

Harap segera meninjau dan memproses permohonan ini sesuai dengan prosedur yang berlaku. Terimakasih

Hormat kami,  
KOPKAR YAG 2025`;
};

//NOTIFIKASI PENGUNDURAN ANGGOA
export interface ITemplatePengunduranDiri {
  nama: string;
  namaUnitkerja: string;
  keterangan: string;
  noPengunduranDiri: string;
  tanggalPengunduranDiri: string;
  jumlahSimpananBersih: string;
  jumlahSimpananDiterima: string;
  statusPengunduranDiri: StatusPengunduranType;
}

export interface ITemplatePengunduranDiriPetugas
  extends ITemplatePengunduranDiri {
  namaPetugas: string;
  role: string;
}

export const templatePengunduranDiri = (props: ITemplatePengunduranDiri) => {
  let opening = "";
  let closing =
    "Terima kasih telah mempercayakan layanan kami. Untuk pertanyaan atau informasi tambahan, hubungi petugas koperasi.";

  switch (props.statusPengunduranDiri) {
    case "PENDING":
      opening =
        "Kami ingin menginformasikan bahwa permohonan pengunduran diri Anda telah diajukan. Berikut adalah rincian pengunduran diri Anda:";
      closing =
        "Terima kasih telah mempercayakan layanan kami. Proses memperlukan 3-5 hari kerja. Untuk pertanyaan atau informasi tambahan, hubungi petugas koperasi.";
      break;
    case "APPROVED":
      opening = `Kami menginformasikan bahwa permohonan pengunduran diri Anda telah kami terima dan disetujui. Tanggal efektif pengunduran diri Anda adalah *${formatDatebyMonth(
        props.tanggalPengunduranDiri
      )}*. Terima kasih atas kontribusi Anda selama ini.`;
      break;
    case "REJECTED":
      opening =
        "Mohon maaf, permohonan pengunduran diri Anda tidak dapat kami terima saat ini. Untuk pertanyaan atau informasi tambahan, hubungi petugas koperasi.";
      break;
    default:
      break;
  }

  const isPending = props.statusPengunduranDiri === "PENDING";

  return `*Pemberitahuan Pengajuan Pengunduran Diri*

_Assalamualaikum_, 
Kepada Yth.  
Bapak/Ibu ${props.nama}  
di ${props.namaUnitkerja}

${opening}

${
  isPending
    ? `- No Pengunduran: ${props.noPengunduranDiri}
- Tanggal Pengunduran: ${formatDatebyMonth(props.tanggalPengunduranDiri)}
- Alasan Pengunduran: ${props.keterangan}

Total Keseluruhan:
- Administrasi: ${formatToIDR(25000)}
- Jumlah Tabungan: ${formatToIDR(Number(props.jumlahSimpananBersih))}
- Jumlah Tabungan Bersih: ${formatToIDR(Number(props.jumlahSimpananDiterima))}

${closing}

`
    : ""
}
Hormat kami,  
KOPKAR YAG ${getCurrentYear()}`;
};

export const templatePengunduranDiriPetugas = (
  props: ITemplatePengunduranDiriPetugas
) => {
  return `*Pemberitahuan Pengajuan Pengunduran Diri Anggota*

_Assalamualaikum_,
${props.namaPetugas} - ${props.role}

Kami ingin memberitahukan bahwa permohonan pengunduran anggota telah diajukan. Detail :

Nama: ${props.nama}
Unit Garapan: ${props.namaUnitkerja}

- No Pengunduran: ${props.noPengunduranDiri}
- Tanggal Pengunduran: ${formatDatebyMonth(props.tanggalPengunduranDiri)}
- Alasan Pengunduran: ${props.keterangan}

Total Keseluruhan:
- Administrasi: ${formatToIDR(25000)}
- Jumlah Tabungan: ${formatToIDR(Number(props.jumlahSimpananBersih))}
- Jumlah Tabungan Bersih: ${formatToIDR(Number(props.jumlahSimpananDiterima))}

Harap segera meninjau dan memproses permohonan ini sesuai dengan prosedur yang berlaku. Terimakasih

Hormat kami,
KOPKAR YAG ${getCurrentYear()}`;
};

//NOTIFIKASI PEMBAGIAN SIMPANAN
export interface ITemplatePembagianSimpanan {
  nama: string;
  namaUnitkerja: string;
  namaPendaftaran: string;
  jenisPengambilanSimpanan: JenisSimpananType;
}

export const templatePembagianSimpanan = (
  props: ITemplatePembagianSimpanan
) => {
  let opening = "";

  switch (props.jenisPengambilanSimpanan) {
    case "LEBARAN":
      opening =
        "Selamat menjalankan Ibadah puasa dan semoga Ramadhan kali ini menjadi momen untuk meningkatkan keimanan dan memperbaiki diri agar menjadi insan yang lebih bertakwa. Amiin Ya Allah.";
      break;
    case "QURBAN":
      opening =
        "Semoga semangat berkurban menjadi wujud keikhlasan dan kepedulian kita terhadap sesama. Mari jadikan momen Iduladha ini sebagai sarana untuk mendekatkan diri kepada Allah SWT dan menebar kebaikan bagi sesama.";
      break;
    case "UBAR":
      opening =
        "Nikmati kebersamaan dan ciptakan kenangan indah bersama anggota lainnya. Semoga kegiatan UBAR ini mempererat tali persaudaraan, membangun semangat kekeluargaan, dan membawa keceriaan untuk kita semua.";
      break;
    default:
      break;
  }
  return `*Pengumuman Pembagian Struk ${props.namaPendaftaran}*

_Assalamualaikum_, 
Kepada Yth.  
Bapak/Ibu ${props.nama}  
di ${props.namaUnitkerja}

${opening}

📄 Struk tabungan ${props.jenisPengambilanSimpanan.toLowerCase()} tersedia di halaman Simpanan Berjangka pada aplikasi POK.

Terima kasih telah mempercayakan layanan kami. Untuk pertanyaan atau informasi tambahan, hubungi petugas koperasi.

Hormat kami,
KOPKAR YAG ${getCurrentYear()}`;
};
