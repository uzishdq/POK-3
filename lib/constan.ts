export const PICTURES = {
  LOGO: "/logo/logo_koperasi.svg",
  LOGO_STRUK: "/logo/logo_koperasi.png",
  LOGO_ASURANSI: "/logo/bumiputera.png",
  PENDAFTARAN_LEBARAN: "/pendaftaran/1.svg",
  PENDAFTARAN_QURBAN: "/pendaftaran/2.svg",
  PENDAFTARAN_UBAR: "/pendaftaran/3.svg",
  TTD_KETUA: "/logo/ttd_ketua.png",
};

export const LABEL = {
  CARD: {
    HEADER: "KOPERASI KARYAWAN YAYASAN AL GHIFARI",
    DESCRIPTION: "sedikit bicara banyak sedekah.",
  },
  INPUT: {
    SUCCESS: {
      SAVED: "Data berhasil disimpan.",
      UPDATE: "Data berhasil diperbarui.",
      DELETE: "Data berhasil dihapus.",
    },
    FAILED: {
      SAVED: "Gagal menyimpan data.",
      UPDATE: "Gagal memperbarui data.",
      DELETE: "Gagal menghapus data.",
    },
  },
  ERROR: {
    INVALID_FIELD: "Data yang dimasukkan tidak valid. Harap periksa kembali",
    DESCRIPTION:
      "Mohon diperhatikan bahwa koneksi kami sedang terganggu. Coba beberapa saat lagi.",
    SERVER: "Terjadi kesalahan pada server. Coba lagi nanti.",
    NOT_LOGIN: "Akses ditolak. Silakan login terlebih dahulu.",
    NOT_ID_USER: "Akses ditolak. No Anggota tidak sesuai.",
    UNAUTHORIZED:
      "Akses ditolak. Hanya petugas yang diizinkan melakukan aksi ini.",
  },
};

export const ROUTES = {
  PUBLIC: {
    LOGIN: "/",
    REGISTRASI: "/registrasi",
    RESET_PASSWORD: "/reset-password",
  },
  AUTH: {
    DATA_DIRI: "/data-diri",
    USER: {
      DASHBOARD: "/dashboard",
      PROFILE: "/dashboard/profile",
      SETTING: "/dashboard/setting",
      UNDUR_DIRI: "/dashboard/undur-diri",
      SIMPANAN: {
        PENDAFTARAN: "/dashboard/pendaftaran-simpanan-berjangka",
        PENGAMBILAN: "/dashboard/pengambilan-simpanan",
        BERJANGKA: "/dashboard/simpanan-berjangka",
        STRUK_SIMPANAN_BERJANGKA: (id: string) =>
          `/dashboard/simpanan-berjangka/struk-simpanan-berjangka/${id}`,
        WAJIB: "/dashboard/simpanan-wajib",
        SUKAMANA: "/dashboard/simpanan-sukamana",
        LEBARAN: "/dashboard/simpanan-lebaran",
        QURBAN: "/dashboard/simpanan-qurban",
        UBAR: "/dashboard/simpanan-ubar",
      },
      PINJAMAN: {
        PENGAJUAN: "/dashboard/pengajuan-pinjaman",
        PELUNASAN: "/dashboard/pelunasan-pinjaman",
        PRODUKTIF: "/dashboard/pinjaman-produktif",
        BARANG: "/dashboard/pinjaman-barang",
        ANGSURAN: (id: string) => `/dashboard/angsuran-pinjaman/${id}`,
      },
    },
    PETUGAS: {
      DASHBOARD: "/dashboard/petugas",
      POTONG_GAJI: "/dashboard/petugas/potong-gaji",
      LAPORAN: "/dashboard/petugas/laporan",
      FIND_LAPORAN: (query: string) => `/dashboard/petugas/laporan?${query}`,
      NOTIFIKASI: "/dashboard/petugas/notifikasi",
      UNDUR_DIRI_ANGGOTA: "/dashboard/petugas/undur-diri-anggota",
      SURAT_UNDUR_DIRI: (id: string) =>
        `/dashboard/petugas/undur-diri-anggota/surat-pernyataan-undur-diri/${id}`,
      MASTER: {
        JABATAN: "/dashboard/petugas/master-jabatan",
        UNIT_KERJA: "/dashboard/petugas/master-unit-kerja",
        KARYAWAN: "/dashboard/petugas/master-karyawan-yayasan",
        ANGGOTA: "/dashboard/petugas/master-anggota",
      },
      SIMPANAN: {
        SETTING_SIMPANAN: "/dashboard/petugas/setting-simpanan-berjangka",
        PENDAFTAR_SIMPANAN: (id: string) =>
          `/dashboard/petugas/setting-simpanan-berjangka/pendaftar-simpanan-berjangka/${id}`,
        PEMBAGIAN_SIMPANAN: (query: string) =>
          `/dashboard/petugas/setting-simpanan-berjangka/pembagian-simpanan-berjangka?${query}`,
        SIMPANAN_ANGGOTA: "/dashboard/petugas/simpanan-anggota",
        PENGAMBILAN_SIMPANAN_ANGGOTA:
          "/dashboard/petugas/pengambilan-simpanan-anggota",
        STRUK_PENGAMBILAN_SIMPANAN: (id: string) =>
          `/dashboard/petugas/pengambilan-simpanan-anggota/struk-pengambilan-simpanan/${id}`,
      },
      PINJAMAN: {
        ASURANSI_PINJAMAN: "/dashboard/petugas/asuransi-pinjaman",
        PELUNASAN_PINJAMAN: "/dashboard/petugas/pelunasan-pinjaman-anggota",
        PRODUKTIF: "/dashboard/petugas/pinjaman-produktif-anggota",
        BARANG: "/dashboard/petugas/pinjaman-barang-anggota",
        SURAT_PINJAMAN: (id: string) =>
          `/dashboard/petugas/surat-permohonan-pinjaman/${id}`,
        ANGSURAN_ANGGOTA: (id: string) =>
          `/dashboard/petugas/angsuran-pinjaman-anggota/${id}`,
      },
    },
  },
};

export const PUBLIC_ROUTES = [
  ROUTES.PUBLIC.LOGIN,
  ROUTES.PUBLIC.REGISTRASI,
  ROUTES.PUBLIC.RESET_PASSWORD,
];

export const API_AUTH = "/api/auth";
export const DEFAULT_LOGIN_REDIRECT = ROUTES.AUTH.USER.DASHBOARD;
export const DEFAULT_API_URL = "/api";
export const PUBLIC_API_URL = "/api/notifications";
export const DEFAULT_AUTH = "/api/auth";
export const PROTECTED_ROUTE = "/dashboard/petugas";
export const LOGIN_REQUIRED = ROUTES.AUTH.DATA_DIRI;

export const BENDAHARA_ROUTES = [
  ROUTES.AUTH.PETUGAS.POTONG_GAJI,
  ROUTES.AUTH.PETUGAS.SIMPANAN.SIMPANAN_ANGGOTA,
  ROUTES.AUTH.PETUGAS.SIMPANAN.SETTING_SIMPANAN,
  ROUTES.AUTH.PETUGAS.SIMPANAN.PENGAMBILAN_SIMPANAN_ANGGOTA,
  ROUTES.AUTH.PETUGAS.PINJAMAN.ASURANSI_PINJAMAN,
  ROUTES.AUTH.PETUGAS.PINJAMAN.PELUNASAN_PINJAMAN,
  ROUTES.AUTH.PETUGAS.PINJAMAN.PRODUKTIF,
  ROUTES.AUTH.PETUGAS.PINJAMAN.BARANG,
  ROUTES.AUTH.PETUGAS.LAPORAN,
];

export const MASTER_ROUTES = [
  { name: "Karyawan Yayasan", href: ROUTES.AUTH.PETUGAS.MASTER.KARYAWAN },
  { name: "Anggota Koperasi", href: ROUTES.AUTH.PETUGAS.MASTER.ANGGOTA },
  { name: "Jabatan", href: ROUTES.AUTH.PETUGAS.MASTER.JABATAN },
  { name: "Unit Kerja", href: ROUTES.AUTH.PETUGAS.MASTER.UNIT_KERJA },
];

export const SIMPANAN_PETUGAS_ROUTES = [
  {
    name: "Pengambilan Simpanan Anggota",
    href: ROUTES.AUTH.PETUGAS.SIMPANAN.PENGAMBILAN_SIMPANAN_ANGGOTA,
  },
  {
    name: "Simpanan Berjangka Anggota",
    href: ROUTES.AUTH.PETUGAS.SIMPANAN.SETTING_SIMPANAN,
  },
  {
    name: "Simpanan Anggota",
    href: ROUTES.AUTH.PETUGAS.SIMPANAN.SIMPANAN_ANGGOTA,
  },
];

export const PINJAMAN_PETUGAS_ROUTES = [
  {
    name: "Asuransi Pinjaman Anggota",
    href: ROUTES.AUTH.PETUGAS.PINJAMAN.ASURANSI_PINJAMAN,
  },
  {
    name: "Pelunasan Pinjaman Anggota",
    href: ROUTES.AUTH.PETUGAS.PINJAMAN.PELUNASAN_PINJAMAN,
  },
  {
    name: "Pinjaman Produktif",
    href: ROUTES.AUTH.PETUGAS.PINJAMAN.PRODUKTIF,
  },
  {
    name: "Pinjaman Barang",
    href: ROUTES.AUTH.PETUGAS.PINJAMAN.BARANG,
  },
];

export const BENDAHARA_LAINNYA = [
  {
    name: "Potongan Gaji",
    href: ROUTES.AUTH.PETUGAS.POTONG_GAJI,
  },
  {
    name: "Laporan",
    href: ROUTES.AUTH.PETUGAS.LAPORAN,
  },
  {
    name: "Pengunduran Anggota",
    href: ROUTES.AUTH.PETUGAS.UNDUR_DIRI_ANGGOTA,
  },
];

export const SEKRETARIS_LAINNYA = [
  {
    name: "Kirim Notifikasi",
    href: ROUTES.AUTH.PETUGAS.NOTIFIKASI,
  },
  {
    name: "Pengunduran Anggota",
    href: ROUTES.AUTH.PETUGAS.UNDUR_DIRI_ANGGOTA,
  },
];

export const SIMPANAN_USER_ROUTES = [
  {
    name: "Pendaftaran Simpanan",
    href: ROUTES.AUTH.USER.SIMPANAN.PENDAFTARAN,
  },
  {
    name: "Simpanan Berjangka",
    href: ROUTES.AUTH.USER.SIMPANAN.BERJANGKA,
  },
  {
    name: "Pengambilan Simpanan",
    href: ROUTES.AUTH.USER.SIMPANAN.PENGAMBILAN,
  },
  {
    name: "Wajib",
    href: ROUTES.AUTH.USER.SIMPANAN.WAJIB,
  },
  {
    name: "Sukamana",
    href: ROUTES.AUTH.USER.SIMPANAN.SUKAMANA,
  },
  {
    name: "Lebaran",
    href: ROUTES.AUTH.USER.SIMPANAN.LEBARAN,
  },
  {
    name: "Qurban",
    href: ROUTES.AUTH.USER.SIMPANAN.QURBAN,
  },
  {
    name: "Ubar",
    href: ROUTES.AUTH.USER.SIMPANAN.UBAR,
  },
];

export const PINJAMAN_USER_ROUTES = [
  {
    name: "Pengajuan Pinjaman",
    href: ROUTES.AUTH.USER.PINJAMAN.PENGAJUAN,
  },
  {
    name: "Pelunasan Pinjaman",
    href: ROUTES.AUTH.USER.PINJAMAN.PELUNASAN,
  },
  {
    name: "Produktif",
    href: ROUTES.AUTH.USER.PINJAMAN.PRODUKTIF,
  },
  {
    name: "Barang",
    href: ROUTES.AUTH.USER.PINJAMAN.BARANG,
  },
];

export const BANK = [
  {
    name: "BCA",
    value: "BCA",
  },
  {
    name: "BNI",
    value: "BNI",
  },
  {
    name: "BJB",
    value: "BJB",
  },
  {
    name: "MANDIRI",
    value: "MANDIRI",
  },
  {
    name: "BTN",
    value: "BTN",
  },
  {
    name: "BRI",
    value: "BRI",
  },
  {
    name: "BSI",
    value: "BSI",
  },
  {
    name: "BTPN",
    value: "BTPN",
  },
  {
    name: "CIMB NIAGA",
    value: "CIMB NIAGA",
  },
  {
    name: "PANIN BANK",
    value: "PANIN BANK",
  },
];

export const PEKERJAAN = [
  {
    name: "Tetap",
    value: "TETAP",
  },
  {
    name: "Honorer",
    value: "HONORER",
  },
  {
    name: "Kontrak",
    value: "KONTRAK",
  },
];

export const GENDER = [
  {
    name: "Pria",
    value: "PRIA",
  },
  {
    name: "Wanita",
    value: "WANITA",
  },
];

export const STATUS_ANGGOTA = [
  {
    name: "Active",
    value: "ACTIVE",
  },
  {
    name: "Not Active",
    value: "NOTACTIVE",
  },
];

export const ROLE = [
  {
    name: "Admin",
    value: "ADMIN",
  },
  {
    name: "User",
    value: "USER",
  },
  {
    name: "Bendahara",
    value: "BENDAHARA",
  },
  {
    name: "Sekretaris",
    value: "SEKRETARIS",
  },
];

export const JENIS_SIMPANAN_BERJANGKA = [
  {
    name: "Lebaran",
    value: "LEBARAN",
  },
  {
    name: "Qurban",
    value: "QURBAN",
  },
  {
    name: "Ubar",
    value: "UBAR",
  },
];

export const JENIS_PENGAMBILAN_SIMPANAN = [
  {
    name: "Simpanan Sukamana",
    value: "SUKAMANA",
  },
  {
    name: "Simpanan Lebaran",
    value: "LEBARAN",
  },
  {
    name: "Simpanan Qurban",
    value: "QURBAN",
  },
  {
    name: "Simpanan Ubar",
    value: "UBAR",
  },
];

export const JENIS_SIMPANAN = [
  "WAJIB",
  "SUKAMANA",
  "LEBARAN",
  "QURBAN",
  "UBAR",
];

export const JENIS_SIMPANAN_DATE_RANGE = ["LEBARAN", "QURBAN", "UBAR"];

export const STATUS_SIMPANAN_BERJANGKA = [
  {
    name: "Open",
    value: "OPEN",
  },
  {
    name: "Close",
    value: "CLOSE",
  },
];

export const STATUS_PINJAMAN = [
  {
    name: "Pinjaman Disetujui",
    value: "APPROVED",
  },
  {
    name: "Pinjaman Selesai",
    value: "COMPLETED",
  },
];

export const YEARS = ["2022", "2023", "2024", "2025", "2026", "2027"];

export const MONTHS = [
  {
    title: "Januari",
    value: "01",
  },
  {
    title: "Februari",
    value: "02",
  },
  {
    title: "Maret",
    value: "03",
  },
  {
    title: "April",
    value: "04",
  },
  {
    title: "Mei",
    value: "05",
  },
  {
    title: "Juni",
    value: "06",
  },
  {
    title: "Juli",
    value: "07",
  },
  {
    title: "Agustus",
    value: "08",
  },
  {
    title: "September",
    value: "09",
  },
  {
    title: "Oktober",
    value: "10",
  },
  {
    title: "November",
    value: "11",
  },
  {
    title: "Desember",
    value: "12",
  },
];

export const jenisPinjaman = [
  {
    name: "Pinjaman Produktif",
    value: "PRODUKTIF",
  },
  {
    name: "Pinjaman Barang",
    value: "BARANG",
  },
] as const;

export const jenisPelunasanPinjaman = [
  {
    name: "Cash",
    value: "CASH",
  },
  {
    name: "Transfer",
    value: "TRANSFER",
  },
] as const;

// TAGS VALIDATION
export const tagsNumberRevalidate = [
  "get-number-by-pendaftaran-id",
  "get-number-by-id-pinjaman",
  "get-number-nonuser",
  "get-number-by-id",
  "get-number-all",
];

export const tagsUnitKerjaRevalidate = [
  "get-unit-kerja",
  "get-last-unit-kerja",
];

export const tagsJabatanRevalidate = ["get-jabatan", "get-last-jabatan"];

export const tagsMasterRevalidate = ["get-master"];

export const tagsAnggotaRevalidate = [
  "get-struk-simpanan-berjangka",
  "get-tanggal-lahir-byId",
  "get-anggota-user",
  "count-anggota",
  "get-profile",
];

export const tagsPotonganRevalidate = [
  "get-potong-gaji",
  "get-history-potong-gaji",
];

export const tagsNotifikasiRevalidate = ["get-notifikasi"];

export const tagsPinjamanRevalidate = [
  "get-max-jumlah-pinjaman-by-id",
  "get-approved-pinjaman-by-id",
  "get-count-status-pinjaman",
  "get-last-pinjaman-by-id",
  "get-pelunasan-pinjaman",
  "get-laporan-pinjaman",
  "get-pinjaman-by-id",
  "get-angsuran-by-id",
  "get-pinjaman",
  "get-asuransi",
];

export const tagsPendaftaranSimpananRevalidate = [
  "get-laporan-simpanan-berjangka",
  "get-simpanan-berjangka-by-id",
  "get-list-pendaftar-simpanan",
  "get-setting-simpanan-by-id",
  "get-struk-simpanan-berjangka",
  "get-pembagian-simpanan-berjangka",
  "count-pendaftar-simpanan",
  "get-simpanan-berjangka",
  "get-pendaftar-simpanan",
  "get-setting-simpanan",
];

export const tagsSimpananRevalidate = [
  "get-laporan-simpanan-berjangka",
  "get-struk-simpanan-berjangka",
  "get-pembagian-simpanan-berjangka",
  "get-simpanan-berjangka-by-id",
  "get-sum-simpanan-anggota",
  "get-simpanan-berjangka",
  "get-simpanan-anggota",
  "get-simpanan",
  "sum-simpanan",
];

export const tagsPengambilanSimpananRevalidate = [
  "verif-pengambilan-simpanan-berjangka",
  "get-pembagian-simpanan-berjangka",
  "get-total-sum-pengambilan-by-id",
  "get-laporan-simpanan-berjangka",
  "get-pengambilan-simpanan-by-id",
  "get-simpanan-berjangka-by-id",
  "get-struk-simpanan-berjangka",
  "get-sum-simpanan-anggota",
  "get-pengambilan-simpanan",
];

export const tagsPengunduranDiriRevalidate = [
  "get-cek-pengunduran-diri-by-id",
  "get-simpanan-pengunduran-diri",
  "get-pinjaman-pengunduran-diri",
  "get-surat-pengunduran-diri",
  "get-pengunduran-diri",
];
