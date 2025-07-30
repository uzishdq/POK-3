import {
  JenisKelaminType,
  RoleType,
  StatusAnggotaType,
  StatusPekerjaanType,
} from "./helper";

export type TAnggota = {
  noAnggota: string;
  nikAnggota: string;
  nipAnggota?: string;
  namaAnggota: string;
  tanggalLahirAnggota: string;
  tempatLahirAnggota: string;
  jenisKelaminAnggota: JenisKelaminType;
  alamatAnggota?: string;
  noTelpAnggota?: string;
  statusPekerjaan: StatusPekerjaanType;
  jabatanId: number;
  unitKerjaId: number;
  bankAnggota?: string;
  rekeningAnggota?: string;
  pilihanSukamana?: string;
  statusAnggota: StatusAnggotaType;
};

export type TAnggotaUser = {
  noAnggota: string;
  idUser: string;
  username: string;
  namaAnggota: string;
  jenisKelaminAnggota: JenisKelaminType;
  noTelpAnggota?: string;
  unitKerjaId: number;
  namaUnitKerja: string;
  bankAnggota?: string;
  rekeningAnggota?: string;
  pilihanSukamana?: string;
  statusAnggota: StatusAnggotaType;
  role: RoleType;
};
