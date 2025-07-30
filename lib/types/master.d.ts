import { JenisKelaminType, StatusPekerjaanType } from "./helper";

export type TMaster = {
  idMaster: string;
  username: string | null;
  nikMaster: string;
  nipMaster: string | null;
  namaMaster: string;
  tanggalLahirMaster: string;
  tempatLahirMaster: string;
  jenisKelaminMaster: JenisKelaminType;
  alamatMaster: string;
  statusPekerjaan: StatusPekerjaanType;
  jabatanId: number;
  unitKerjaId: number;
};
