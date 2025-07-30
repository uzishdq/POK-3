import {
  JenisPendaftaranSimpananType,
  JenisSimpananType,
  StatusPendaftaranSimpananType,
} from "./helper";

export type TSettingSimpanan = {
  idSettingPendaftaran: string;
  namaPendaftaran: string;
  jenisPendaftaranSimpanan: JenisPendaftaranSimpananType;
  tanggalTutupSimpanan: string;
  tanggalAwalSimpanan: string;
  tanggalAkhirSimpanan: string;
  basilSimpanan: string | null;
  statusPendaftaranSimpanan: StatusPendaftaranSimpananType;
  createdAt: string;
};

export type TPendaftaranSimpanan = {
  idPendaftar: string;
  settingPendaftaranId: string;
  noAnggota: string;
  namaAnggota: string;
  namaUnitKerja: string;
  jumlahPilihan: string;
};

export type TSimpananUser = {
  noSimpanan: string;
  noAnggota: string;
  tanggalSimpanan: string;
  jenisSimpanan: JenisSimpananType;
  jumlahSimpanan: string;
};

export type TDetailPembagianSimpanan = {
  anggota: {
    idPendaftar: string;
    namaPendaftaran: string;
    noAnggota: string;
    Simpanan: {
      tanggalSimpanan: string;
      jenisSimpanan: JenisSimpananType;
      jumlahSimpanan: string;
    }[];
    PengambilanSimpanan: {
      tanggalPengambilanSimpanan: string;
      jenisPengambilanSimpanan: JenisSimpananType;
      jumlahPengambilanSimpanan: string;
    }[];
  };
};

export type TInputDetailPembagianSimpanan = {
  pendaftarId: string;
  tanggalDetailPembagian: string;
  jumlahDetailPembagian: string;
};

export type TInputDetailPengambilanSimpanan = {
  noPengambilanSimpanan: string;
  noAnggota: string;
  jenisPengambilanSimpanan: JenisSimpananType;
  jumlahPengambilanSimpanan: string;
  statusPengambilanSimpanan: StatusPengambilanSimpananType;
};

export type TResultTransformPembagianSimpanan = {
  detailPembagianSimpanan: TInputDetailPembagianSimpanan[];
  pengambilanSimpanan: TInputDetailPengambilanSimpanan[];
};
