export type RoleType = "ADMIN" | "USER" | "BENDAHARA" | "SEKRETARIS";
export type StatusUserType = "PENDING" | "APPROVED" | "REJECTED";

export type StatusAnggotaType = "ACTIVE" | "NOTACTIVE";
export type StatusPekerjaanType = "TETAP" | "KONTRAK" | "HONORER";
export type JenisKelaminType = "PRIA" | "WANITA";
export type JenisPendaftaranSimpananType = "LEBARAN" | "QURBAN" | "UBAR";
export type StatusPendaftaranSimpananType = "OPEN" | "CLOSE";

export type JenisSimpananType =
  | "WAJIB"
  | "SUKAMANA"
  | "LEBARAN"
  | "QURBAN"
  | "UBAR";
export type StatusPinjamanType =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "COMPLETED";
export type StatusPengambilanSimpananType = "PENDING" | "APPROVED" | "REJECTED";

export type StatusPelunasanAngsuranType =
  | "ERROR"
  | "PENDING"
  | "TIDAK_ADA_PINJAMAN"
  | "BELUM_LUNAS"
  | "SUDAH_LUNAS_SEBAGIAN"
  | "SUDAH_LUNAS";

export type JenisPinjamanType = "PRODUKTIF" | "BARANG";
export type StatusPinjamanPrioritasType = "PENDING" | "APPROVED";
export type StatusAngsuranType = "PENDING" | "ONPROGRESS" | "COMPLETED";

export type JenisPelunasanPinjamanType = "CASH" | "TRANSFER";
export type StatusPelunasanPinjamanType =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "COMPLETED";

export type StatusPengunduranType = "PENDING" | "APPROVED" | "REJECTED";

export type StatusNotificationType = "PENDING" | "SENT" | "FAILED";
