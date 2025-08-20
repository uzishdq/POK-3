/* eslint-disable prefer-const */
import { taripAsuransi } from "./data-asuransi";
import { TColumnExcell } from "./types/excell";
import {
  JenisPelunasanPinjamanType,
  JenisPinjamanType,
  JenisSimpananType,
} from "./types/helper";
import {
  TDataLaporanSimpananBerjangka,
  TDataPinjamanLaporan,
  TDetailLaporanSimpananBerjangka,
  TLaporanPinjaman,
  TLaporanSimpananBerjangka,
} from "./types/laporan";
import { GetLastPinjamanByIdResult } from "./types/pinjaman";
import {
  TAnggotaPotongGaji,
  TInputPotongGaji,
  TPinjamanPotongGaji,
  TPotongGaji,
  TSimpananPotongGaji,
} from "./types/potong-gaji";
import {
  TDetailPembagianSimpanan,
  TInputDetailPembagianSimpanan,
  TInputDetailPengambilanSimpanan,
  TResultTransformPembagianSimpanan,
} from "./types/setting-simpanan";
import {
  LastIdSimpananMap,
  TDataStrukSimpananBerjangka,
  TStrukSimpananBerjangka,
  TSumSimpananAnggota,
} from "./types/simpanan";
import { TCalculateUndurDiri } from "./types/undur-diri";

export function formatToIDR(data: number | null): string | null {
  const formattedAmount = data !== null ? data : 0;
  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(formattedAmount);

  return formatted;
}

export function formatDatebyMonth(dateString: Date | string) {
  const dateObject = new Date(dateString);

  const year = dateObject.getFullYear();
  const month = new Intl.DateTimeFormat("id-ID", { month: "long" }).format(
    dateObject
  );
  const day = dateObject.getDate();

  return `${day} ${month} ${year}`;
}

export function isRangeDate(startDate?: string, endDate?: string): boolean {
  if (!startDate || !endDate) return false;

  const today = new Date();
  const todayISO = today.toISOString().split("T")[0]; // ambil YYYY-MM-DD
  const todayDate = new Date(todayISO); // normalisasi ke tanggal saja

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Validasi
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;

  return todayDate >= start && todayDate <= end;
}

export function isValidId(id: string): boolean {
  const pattern = /^A-\d{3}$/;
  return pattern.test(id);
}

export function capitalizeFirst(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const generatePotongGaji = (
  anggota: TAnggotaPotongGaji[] | null,
  simpananLebaran: TSimpananPotongGaji[] | null,
  simpananQurban: TSimpananPotongGaji[] | null,
  simpananUbar: TSimpananPotongGaji[] | null,
  pinjamanProduktif: TPinjamanPotongGaji[] | null,
  pinjamanBarang: TPinjamanPotongGaji[] | null
): TPotongGaji[] => {
  if (!anggota) return [];

  return anggota.map((a) => {
    const lebaran = simpananLebaran?.find(
      (s) => s.noAnggota === a.noAnggota && s.jenisSimpanan === "LEBARAN"
    );
    const qurban = simpananQurban?.find(
      (s) => s.noAnggota === a.noAnggota && s.jenisSimpanan === "QURBAN"
    );
    const ubar = simpananUbar?.find(
      (s) => s.noAnggota === a.noAnggota && s.jenisSimpanan === "UBAR"
    );

    const produktif = pinjamanProduktif?.find(
      (p) => p.noAnggota === a.noAnggota
    );
    const barang = pinjamanBarang?.find((p) => p.noAnggota === a.noAnggota);

    const simpananWajib = 15000;
    const simpananSukamana = a.pilihanSukamana
      ? parseInt(a.pilihanSukamana)
      : 0;
    const jumlahLebaran = lebaran ? parseInt(lebaran.jumlahPilihan) : 0;
    const jumlahQurban = qurban ? parseInt(qurban.jumlahPilihan) : 0;
    const jumlahUbar = ubar ? parseInt(ubar.jumlahPilihan) : 0;

    const jumlahAngsuranProduktif = produktif
      ? parseInt(produktif.jumlahAngsuran)
      : 0;
    const jumlahAngsuranBarang = barang ? parseInt(barang.jumlahAngsuran) : 0;

    const totalPotongan =
      simpananWajib +
      simpananSukamana +
      jumlahLebaran +
      jumlahQurban +
      jumlahUbar +
      jumlahAngsuranProduktif +
      jumlahAngsuranBarang;

    return {
      noAnggota: a.noAnggota,
      namaAnggota: a.namaAnggota,
      namaUnitKerja: a.namaUnitKerja ?? "-",
      simpananWajib,
      simpananSukamana,
      simpananLebaran: jumlahLebaran,
      simpananQurban: jumlahQurban,
      simpananUbar: jumlahUbar,
      pinjamanProduktif: produktif?.noPinjaman ?? "-",
      angsuranKeProduktif: produktif ? produktif.angsuranKe + 1 : 0,
      angsuranDariProduktif: produktif?.angsuranDari ?? 0,
      jumlahAngsuranProduktif,
      pinjamanBarang: barang?.noPinjaman ?? "-",
      angsuranKeBarang: barang ? barang.angsuranKe + 1 : 0,
      angsuranDariBarang: barang?.angsuranDari ?? 0,
      jumlahAngsuranBarang,
      totalPotongan,
    };
  });
};

export function formatFieldValidation(field: string) {
  return field
    .replace(/([A-Z])/g, " $1") // tambah spasi sebelum huruf besar
    .replace(/^./, (str) => str.toUpperCase()); // huruf pertama jadi kapital
}

export function parseNamaPendaftaranDanTahun(input: string): {
  nama: string;
  tahun: string | null;
} {
  const regex = /^(.*?)(\s+(\d{3,4}H))$/i;
  const match = input.trim().match(regex);

  if (match) {
    const nama = match[1].trim();
    const tahun = match[3].trim();
    return { nama, tahun };
  }

  return { nama: input.trim(), tahun: null }; // fallback kalau tidak ditemukan tahun
}

export function parseExcelRow(values: (string | number)[]): TPotongGaji {
  return {
    noAnggota: values[1]?.toString(),
    namaAnggota: values[2]?.toString(),
    namaUnitKerja: values[3]?.toString(),
    simpananWajib: Number(values[4]),
    simpananSukamana: Number(values[5]),
    simpananLebaran: Number(values[6]),
    simpananQurban: Number(values[7]),
    simpananUbar: Number(values[8]),
    pinjamanProduktif: values[9]?.toString(),
    angsuranKeProduktif: Number(values[10]),
    angsuranDariProduktif: Number(values[11]),
    jumlahAngsuranProduktif: Number(values[12]),
    pinjamanBarang: values[13]?.toString(),
    angsuranKeBarang: Number(values[14]),
    angsuranDariBarang: Number(values[15]),
    jumlahAngsuranBarang: Number(values[16]),
    totalPotongan: Number(values[17]),
  };
}

export function formatTanggalID(date: Date) {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yy = String(date.getFullYear()).slice(-2);
  return `${mm}${dd}${yy}`;
}

export function formatTglPrefixId(prefix?: string) {
  let counter = "XX";

  //untuk pengambilan simpanan belum
  switch (prefix) {
    case "ANGSURAN":
      counter = "AP";
      break;
    case "ASURANSI":
      counter = "AS";
      break;
    case "BARANG":
      counter = "PB";
      break;
    case "PRODUKTIF":
      counter = "PR";
      break;
    case "CASH":
      counter = "PP-CH";
      break;
    case "TRANSFER":
      counter = "PP-TF";
      break;
    case "WAJIB":
      counter = "S-WB";
      break;
    case "SUKAMANA":
      counter = "S-MA";
      break;
    case "LEBARAN":
      counter = "S-LB";
      break;
    case "QURBAN":
      counter = "S-QB";
      break;
    case "UBAR":
      counter = "S-UB";
      break;
    case "UNDUR_DIRI":
      counter = "PD";
      break;
    default:
      counter = "XX";
      break;
  }

  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");

  const tanggal = `${pad(now.getDate())}${pad(now.getMonth() + 1)}${now
    .getFullYear()
    .toString()
    .slice(-2)}`;

  return prefix ? `%${counter}-${tanggal}%` : `%${tanggal}%`;
}

const counterMapSimpanan: Partial<Record<JenisSimpananType, number>> = {};

export function generateIdSimpanan(
  lastId: string | null,
  jenis: JenisSimpananType
): string {
  const kodeMap: Record<JenisSimpananType, string> = {
    WAJIB: "WB",
    SUKAMANA: "MA",
    LEBARAN: "LB",
    QURBAN: "QB",
    UBAR: "UB",
  };

  const kode = kodeMap[jenis];

  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const tanggal = `${pad(now.getDate())}${pad(now.getMonth() + 1)}${now
    .getFullYear()
    .toString()
    .slice(-2)}`;

  // HANYA inisialisasi jika belum pernah
  if (counterMapSimpanan[jenis] === undefined) {
    if (lastId) {
      const parts = lastId.split("-");
      const lastNumber = parseInt(parts[3], 10);
      counterMapSimpanan[jenis] = isNaN(lastNumber) ? 1 : lastNumber + 1;
    } else {
      counterMapSimpanan[jenis] = 1;
    }
  } else {
    counterMapSimpanan[jenis]! += 1;
  }

  const nomorUrut = counterMapSimpanan[jenis]!.toString().padStart(3, "0");

  return `S-${kode}-${tanggal}-${nomorUrut}`;
}

let counterMapPengambilanSimpanan: Partial<Record<JenisSimpananType, number>> =
  {};

export function generateIdPengambilanSimpanan(
  lastId: string | null,
  jenis: JenisSimpananType
): string {
  const kodeMap: Record<JenisSimpananType, string> = {
    WAJIB: "WB",
    SUKAMANA: "MA",
    LEBARAN: "LB",
    QURBAN: "QB",
    UBAR: "UB",
  };

  const kode = kodeMap[jenis];

  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const tanggal = `${pad(now.getDate())}${pad(now.getMonth() + 1)}${now
    .getFullYear()
    .toString()
    .slice(-2)}`;

  // HANYA inisialisasi jika belum pernah
  if (counterMapPengambilanSimpanan[jenis] === undefined) {
    if (lastId) {
      const parts = lastId.split("-");
      const lastNumber = parseInt(parts[3], 10);
      counterMapPengambilanSimpanan[jenis] = isNaN(lastNumber)
        ? 1
        : lastNumber + 1;
    } else {
      counterMapPengambilanSimpanan[jenis] = 1;
    }
  } else {
    counterMapPengambilanSimpanan[jenis]! += 1;
  }

  const nomorUrut = counterMapPengambilanSimpanan[jenis]!.toString().padStart(
    3,
    "0"
  );

  return `PS-${kode}-${tanggal}-${nomorUrut}`;
}

export function generateIdPinjaman(
  lastId: string | null,
  jenis: JenisPinjamanType
): string {
  const kodeMap: Record<JenisPinjamanType, string> = {
    PRODUKTIF: "PR",
    BARANG: "PB",
  };

  const kode = kodeMap[jenis];

  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const tanggal = `${pad(now.getDate())}${pad(now.getMonth() + 1)}${now
    .getFullYear()
    .toString()
    .slice(-2)}`;

  let nextNumber = 1;

  if (lastId) {
    const parts = lastId.split("-");
    const lastNumber = parseInt(parts[2], 10);
    if (!isNaN(lastNumber)) {
      nextNumber = lastNumber + 1;
    }
  }

  const nomorUrut = nextNumber.toString().padStart(3, "0");

  return `${kode}-${tanggal}-${nomorUrut}`;
}

let counterMapAngsuran: number = 0;

export function generateIdAngsuran(lastId: string | null): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const tanggal = `${pad(now.getDate())}${pad(now.getMonth() + 1)}${now
    .getFullYear()
    .toString()
    .slice(-2)}`;

  if (lastId) {
    const parts = lastId.split("-");
    const lastNumber = parseInt(parts[2], 10);
    if (!isNaN(lastNumber)) {
      counterMapAngsuran = lastNumber + 1;
    } else {
      counterMapAngsuran = 1;
    }
  } else {
    counterMapAngsuran += 1;
  }

  const nomorUrut = counterMapAngsuran.toString().padStart(3, "0");
  return `AP-${tanggal}-${nomorUrut}`;
}

let counterMapAsuransi: number = 0;

export function generateIdAsuransi(lastId: string | null): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const tanggal = `${pad(now.getDate())}${pad(now.getMonth() + 1)}${now
    .getFullYear()
    .toString()
    .slice(-2)}`;

  if (lastId) {
    const parts = lastId.split("-");
    const lastNumber = parseInt(parts[2], 10);
    if (!isNaN(lastNumber)) {
      counterMapAsuransi = lastNumber + 1;
    } else {
      counterMapAsuransi = 1;
    }
  } else {
    counterMapAsuransi += 1;
  }

  const nomorUrut = counterMapAsuransi.toString().padStart(3, "0");
  return `AS-${tanggal}-${nomorUrut}`;
}

const counterMapPelunasanPinjaman: Partial<
  Record<JenisPelunasanPinjamanType, number>
> = {};

export function generateIdPelunasanPinjaman(
  lastId: string | null,
  jenis: JenisPelunasanPinjamanType
): string {
  const kodeMap: Record<JenisPelunasanPinjamanType, string> = {
    CASH: "CH",
    TRANSFER: "TF",
  };

  const kode = kodeMap[jenis];

  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const tanggal = `${pad(now.getDate())}${pad(now.getMonth() + 1)}${now
    .getFullYear()
    .toString()
    .slice(-2)}`;

  // HANYA inisialisasi jika belum pernah
  if (counterMapPelunasanPinjaman[jenis] === undefined) {
    if (lastId) {
      const parts = lastId.split("-");
      const lastNumber = parseInt(parts[3], 10);
      counterMapPelunasanPinjaman[jenis] = isNaN(lastNumber)
        ? 1
        : lastNumber + 1;
    } else {
      counterMapPelunasanPinjaman[jenis] = 1;
    }
  } else {
    counterMapPelunasanPinjaman[jenis]! += 1;
  }

  const nomorUrut = counterMapPelunasanPinjaman[jenis]!.toString().padStart(
    3,
    "0"
  );

  return `PP-${kode}-${tanggal}-${nomorUrut}`;
}

let counterMapUndurDiri: number = 0;

export function generateIdUndurDiri(lastId: string | null): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const tanggal = `${pad(now.getDate())}${pad(now.getMonth() + 1)}${now
    .getFullYear()
    .toString()
    .slice(-2)}`;

  if (lastId) {
    const parts = lastId.split("-");
    const lastNumber = parseInt(parts[2], 10);
    if (!isNaN(lastNumber)) {
      counterMapUndurDiri = lastNumber + 1;
    } else {
      counterMapUndurDiri = 1;
    }
  } else {
    counterMapUndurDiri += 1;
  }

  const nomorUrut = counterMapUndurDiri.toString().padStart(3, "0");
  return `PD-${tanggal}-${nomorUrut}`;
}

export function calculatePercentage(value: number, percentage: number): number {
  return value * (percentage / 100);
}

export function calculateTakeHomePay(salary: number): number {
  const percentage = 0.35;
  const takeHomePay = salary * percentage;
  return takeHomePay;
}

interface IPredictLoanBasedOnSalary {
  maxLoanAmount: number;
  maxRepaymentTime: number;
  monthlyInstallment: number;
}

export function predictLoanBasedOnSalary(
  gaji: number,
  pinjaman: number
): IPredictLoanBasedOnSalary {
  // Menghitung batasan maksimum angsuran bulanan yang diizinkan (35% dari gaji bulanan)
  const maxInstallmentAllowed = calculateTakeHomePay(gaji);
  const admin = calculatePercentage(pinjaman, 1);

  let maxLoanAmount = 0;
  let maxRepaymentTime = 0;

  for (let i = 5; i <= 36; i++) {
    const potentialLoanAmount = pinjaman / i + admin;
    if (potentialLoanAmount <= maxInstallmentAllowed) {
      maxLoanAmount = pinjaman;
      maxRepaymentTime = i;
      break;
    }
  }

  return {
    maxLoanAmount,
    maxRepaymentTime,
    monthlyInstallment: maxInstallmentAllowed,
  };
}

export interface ICalculateLoanInstallment {
  monthlyInstallment: number;
  admin: number;
  isEligible: boolean;
}

export function calculateLoanInstallment(
  gaji: number,
  pinjaman: number,
  waktuPengembalian: number
): ICalculateLoanInstallment {
  const admin = calculatePercentage(pinjaman, 1);

  const maxInstallmentAllowed = calculateTakeHomePay(gaji);

  const monthlyInstallment = pinjaman / waktuPengembalian + admin;

  const isEligible = monthlyInstallment <= maxInstallmentAllowed;

  return {
    monthlyInstallment: isEligible ? monthlyInstallment : 0,
    admin,
    isEligible,
  };
}

export function countReceive(
  data1: number,
  data2: number,
  data3: number,
  data4: number
): number {
  const pinjaman = data1 ?? 0;
  const admin = data2 ?? 0;
  const totalPremi = data3 ?? 0;
  const pelunasan = data4 ?? 0;

  const receive = pinjaman - (admin + totalPremi + pelunasan);
  return receive;
}

function countAge(tanggal: Date | string): number {
  const tanggalLahir = new Date(tanggal);
  const tanggalSekarang = new Date();

  const tahunLahir = tanggalLahir.getFullYear();
  const bulanLahir = tanggalLahir.getMonth();
  const tanggalLahirInt = tanggalLahir.getDate();

  const tahunSekarang = tanggalSekarang.getFullYear();
  const bulanSekarang = tanggalSekarang.getMonth();
  const tanggalSekarangInt = tanggalSekarang.getDate();

  let umur = tahunSekarang - tahunLahir;

  if (
    bulanSekarang < bulanLahir ||
    (bulanSekarang === bulanLahir && tanggalSekarangInt < tanggalLahirInt)
  ) {
    umur--;
  }

  return umur;
}

function countTenor(bulan: number): number {
  if (bulan <= 12) {
    return 1;
  } else {
    const tahun = Math.floor(bulan / 12);
    const sisaBulan = bulan % 12;
    return sisaBulan > 0 ? tahun + 1 : tahun;
  }
}

function countEndDateAsuransi(tenor: number): string {
  const tanggalNow = new Date();
  tanggalNow.setFullYear(tanggalNow.getFullYear() + tenor);

  let tanggal = tanggalNow.getDate();
  let bulan = tanggalNow.getMonth() + 1;
  let tahun = tanggalNow.getFullYear();

  const tanggalAsuransi = (tanggal < 10 ? "0" : "") + tanggal.toString();
  const bulanAsuransi = (bulan < 10 ? "0" : "") + bulan.toString();

  const hasil = `${tahun}-${bulanAsuransi}-${tanggalAsuransi}T00:00:00Z`;
  return hasil;
}

function countPremi(pinjaman: number, tenor: number | string): number {
  let result: number;
  if (typeof tenor === "string") {
    if (tenor === "-") {
      result = 0;
    } else {
      result = parseFloat(tenor);
    }
  } else {
    result = tenor;
  }
  const premi = (result * pinjaman) / 1000;
  return Math.round(premi);
}

export function calculateAsuransi(
  tanggal: Date | string,
  waktuPengembalian: number,
  pinjaman: number
) {
  const umur = countAge(tanggal);

  if (umur < 21) {
    return {
      status: false,
      umur: umur,
      tenor: 0,
      totalPremi: 0,
      tglSelesaiAsuransi: null,
      message: `Maaf, data tanggal lahir tidak valid. Umur: ${umur} tahun.`,
    };
  }

  const tenor = countTenor(waktuPengembalian);

  if (!taripAsuransi[umur] || taripAsuransi[umur][tenor] === undefined) {
    return {
      status: false,
      umur: umur,
      tenor: 0,
      totalPremi: 0,
      tglSelesaiAsuransi: null,
      message:
        "Maaf, data tarif asuransi tidak tersedia untuk umur atau tenor ini.",
    };
  }

  const value = taripAsuransi[umur][tenor];
  const tanggalAkhir = countEndDateAsuransi(tenor);
  const totalPremi = countPremi(pinjaman, value);

  if (totalPremi <= 0) {
    return {
      status: false,
      umur: umur,
      tenor: 0,
      totalPremi: 0,
      tglSelesaiAsuransi: null,
      message:
        "Maaf, Tidak bisa mengajukan pinjaman karena tidak ada asuransi yang tersedia.",
    };
  }

  return {
    status: true,
    umur: umur,
    tenor,
    totalPremi,
    tglSelesaiAsuransi: tanggalAkhir,
    message:
      "Pengajuan pinjaman Anda berhasil melewati pengecekan persyaratan! Silakan ajukan pinjaman untuk melanjutkan.",
  };
}

export function isPinjamanIdValid(id: string) {
  return /^(PR|PB)-\d{6}-\d{3}$/.test(id);
}

export function isPengambilanSimpananIdValid(id: string) {
  return /^PS-(LB|MA|WB|QB|UB)-\d{6}-\d{3}$/.test(id);
}

export function isPengunduranValid(id: string) {
  return /^(PD)-\d{6}-\d{3}$/.test(id);
}

export function toTerbilang(n: number): string {
  const satuan = [
    "",
    "satu",
    "dua",
    "tiga",
    "empat",
    "lima",
    "enam",
    "tujuh",
    "delapan",
    "sembilan",
    "sepuluh",
    "sebelas",
  ];

  const terbilang = (n: number): string => {
    if (n < 12) {
      return satuan[n];
    } else if (n < 20) {
      return terbilang(n - 10) + " belas";
    } else if (n < 100) {
      return terbilang(Math.floor(n / 10)) + " puluh " + terbilang(n % 10);
    } else if (n < 200) {
      return "seratus " + terbilang(n - 100);
    } else if (n < 1000) {
      return terbilang(Math.floor(n / 100)) + " ratus " + terbilang(n % 100);
    } else if (n < 2000) {
      return "seribu " + terbilang(n - 1000);
    } else if (n < 1000000) {
      return terbilang(Math.floor(n / 1000)) + " ribu " + terbilang(n % 1000);
    } else if (n < 1000000000) {
      return (
        terbilang(Math.floor(n / 1000000)) + " juta " + terbilang(n % 1000000)
      );
    } else if (n < 1000000000000) {
      return (
        terbilang(Math.floor(n / 1000000000)) +
        " milyar " +
        terbilang(n % 1000000000)
      );
    } else if (n < 1000000000000000) {
      return (
        terbilang(Math.floor(n / 1000000000000)) +
        " triliun " +
        terbilang(n % 1000000000000)
      );
    } else {
      return "";
    }
  };

  return terbilang(n) + " rupiah";
}

export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function transformLaporanPinjaman(
  data: TDataPinjamanLaporan[]
): TLaporanPinjaman[] {
  const pinjaman = data.map((item) => {
    const jasa = calculatePercentage(Number(item.ajuanPinjaman), 1);
    const akad = jasa * item.waktuPengembalian;
    const angsuran = item.AngsuranPinjaman.reduce(
      (acc, current) => {
        acc.lastAngsuran = current.angsuranPinjamanKe;
        acc.jumlahAngsuran += Number(current.jumlahAngsuran);
        return acc;
      },
      {
        lastAngsuran: 0,
        jumlahAngsuran: 0,
      }
    );
    const pokokMasuk = angsuran.jumlahAngsuran - jasa * angsuran.lastAngsuran;
    const sisaPokok = Number(item.ajuanPinjaman) - pokokMasuk;
    const jasaMasuk = jasa * angsuran.lastAngsuran;
    return {
      noAnggota: item.noAnggota,
      nama: item.nama,
      namaUnitKerja: item.namaUnitKerja,
      noPinjaman: item.noPinjaman,
      tanggalPinjaman: item.tanggalPinjaman,
      waktuPengembalian: `${angsuran.lastAngsuran} / ${item.waktuPengembalian}`,
      jenisPinjman: item.jenisPinjman,
      statusPinjaman: item.statusPinjaman,
      ajuanPinjaman: Number(item.ajuanPinjaman),
      jumlahAngsuran: angsuran.jumlahAngsuran,
      akad: akad,
      pokokMasuk: pokokMasuk,
      jasaMasuk: jasaMasuk,
      sisaPokok: sisaPokok,
    };
  });

  return pinjaman;
}

function generateRangeMonth(
  startDate: Date | string,
  endDate: Date | string
): string[] {
  const result: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  let current = new Date(start.getFullYear(), start.getMonth(), 1);
  const last = new Date(end.getFullYear(), end.getMonth(), 1);

  while (current <= last) {
    const monthName = current.toLocaleString("id-ID", { month: "long" });
    const year = current.getFullYear();
    result.push(`${monthName} - ${year}`);
    current.setMonth(current.getMonth() + 1);
  }

  return result;
}

function formatBulan(date: Date | string): string {
  const end = new Date(date);
  const tahun = end.getFullYear();
  const bulan = end.toLocaleString("id-ID", { month: "long" });

  return `${bulan} - ${tahun}`;
}

interface ITransformLaporanSimpananBerjangka {
  simpananData: TDataLaporanSimpananBerjangka[];
  setting: {
    basil: number | null;
    startDate: string;
    endDate: string;
    jenisSimpanan: JenisSimpananType;
  };
}

export function transformLaporanSimpananBerjangka({
  simpananData,
  setting,
}: ITransformLaporanSimpananBerjangka): TLaporanSimpananBerjangka[] {
  const bulanRange = generateRangeMonth(setting.startDate, setting.endDate);

  return simpananData.map((data) => {
    const bulanMap = new Map<string, number>();
    bulanRange.forEach((bulan) => bulanMap.set(bulan, 0));

    let totalPengambilan = 0;

    for (const simpanan of data.anggota.Simpanan) {
      const bulan = formatBulan(simpanan.tanggalSimpanan);
      bulanMap.set(
        bulan,
        (bulanMap.get(bulan) ?? 0) + Number(simpanan.jumlahSimpanan)
      );
    }

    for (const pengambilan of data.anggota.PengambilanSimpanan) {
      const bulan = formatBulan(pengambilan.tanggalPengambilanSimpanan);
      const jumlah = Number(pengambilan.jumlahPengambilanSimpanan);
      bulanMap.set(bulan, (bulanMap.get(bulan) ?? 0) - jumlah);
      totalPengambilan += jumlah;
    }

    const simpanan: TDetailLaporanSimpananBerjangka[] = bulanRange.map(
      (bulan) => ({
        bulan,
        total: bulanMap.get(bulan) ?? 0,
      })
    );

    const totalSimpanan = simpanan.reduce((sum, s) => sum + s.total, 0);

    const totalBulan = simpanan.length;
    const persenBasil = setting.basil ?? 0;

    const basil = simpanan.reduce((acc, curr, index) => {
      const bobot = totalBulan - index;
      return acc + curr.total * (persenBasil / 100) * bobot;
    }, 0);

    const totalDenganBasil = totalSimpanan + basil;
    const admin = 5000;
    const tabunganBersih = totalDenganBasil - admin;

    return {
      noAnggota: data.anggota.noAnggota,
      namaAnggota: data.anggota.namaAnggota,
      namaUnitKerja: data.anggota.namaUnitKerja,
      namaPendaftaran: "-",
      jenisSimpanan: setting.jenisSimpanan,
      totalSimpanan,
      basil,
      totalDenganBasil,
      admin,
      tabunganBersih,
      totalPengambilan,
      simpanan,
    };
  });
}

interface ITransformPembagianSimpanan {
  simpananData: TDetailPembagianSimpanan[];
  lastId: LastIdSimpananMap;
  setting: {
    startDate: string;
    endDate: string;
    jenisSimpanan: JenisSimpananType;
  };
}

export function transformPembagianSimpanan({
  simpananData,
  lastId,
  setting,
}: ITransformPembagianSimpanan): TResultTransformPembagianSimpanan {
  const detailPembagianSimpanan: TInputDetailPembagianSimpanan[] = [];
  const pengambilanSimpanan: TInputDetailPengambilanSimpanan[] = [];

  const bulanRange = generateRangeMonth(setting.startDate, setting.endDate);

  for (const data of simpananData) {
    if (!data?.anggota) continue;

    const {
      idPendaftar,
      noAnggota,
      Simpanan,
      PengambilanSimpanan: Pengambilan,
    } = data.anggota;

    const bulanMap = new Map<string, number>();
    const bulanTanggalMap = new Map<string, string>();

    bulanRange.forEach((b) => bulanMap.set(b, 0));

    for (const s of Simpanan) {
      if (s.jenisSimpanan !== setting.jenisSimpanan) continue;

      const bulan = formatBulan(s.tanggalSimpanan);
      const jumlah = Number(s.jumlahSimpanan) || 0;

      bulanMap.set(bulan, (bulanMap.get(bulan) || 0) + jumlah);

      if (!bulanTanggalMap.has(bulan)) {
        bulanTanggalMap.set(bulan, s.tanggalSimpanan);
      }
    }

    for (const p of Pengambilan) {
      if (p.jenisPengambilanSimpanan !== setting.jenisSimpanan) continue;

      const bulan = formatBulan(p.tanggalPengambilanSimpanan);
      const jumlah = Number(p.jumlahPengambilanSimpanan) || 0;

      bulanMap.set(bulan, (bulanMap.get(bulan) || 0) - jumlah);
    }

    for (const bulan of bulanRange) {
      const total = bulanMap.get(bulan) ?? 0;

      if (total !== 0) {
        detailPembagianSimpanan.push({
          pendaftarId: idPendaftar,
          tanggalDetailPembagian: bulanTanggalMap.get(bulan) || bulan,
          jumlahDetailPembagian: total.toString(), // jika DB minta string
        });
      }
    }

    // Hitung total bersih
    const totalBersih =
      Simpanan.filter((s) => s.jenisSimpanan === setting.jenisSimpanan).reduce(
        (acc, s) => acc + Number(s.jumlahSimpanan),
        0
      ) -
      Pengambilan.filter(
        (p) => p.jenisPengambilanSimpanan === setting.jenisSimpanan
      ).reduce((acc, p) => acc + Number(p.jumlahPengambilanSimpanan), 0);

    if (totalBersih > 0) {
      const last = lastId[setting.jenisSimpanan]?.id ?? null;
      const newId = generateIdPengambilanSimpanan(last, setting.jenisSimpanan);

      // Update lastId supaya tidak terjadi duplikasi
      lastId[setting.jenisSimpanan] = {
        id: newId,
        jenis: setting.jenisSimpanan,
      };

      pengambilanSimpanan.push({
        noPengambilanSimpanan: newId,
        noAnggota,
        jenisPengambilanSimpanan: setting.jenisSimpanan,
        jumlahPengambilanSimpanan: totalBersih.toString(),
        statusPengambilanSimpanan: "APPROVED",
      });
    }
  }

  return {
    detailPembagianSimpanan,
    pengambilanSimpanan,
  };
}

interface ITransformStrukSimpananBerjangka {
  simpananData: TDataStrukSimpananBerjangka;
}

export function transformStrukSimpananBerjangka({
  simpananData,
}: ITransformStrukSimpananBerjangka): TStrukSimpananBerjangka {
  const bulanRange = generateRangeMonth(
    simpananData.tanggalAwalSimpanan,
    simpananData.tanggalAkhirSimpanan
  );
  const persenBasil = Number(simpananData.basilSimpanan) ?? 0;

  const bulanMap = new Map<string, number>();
  bulanRange.forEach((bulan) => bulanMap.set(bulan, 0));

  for (const simpanan of simpananData.detailSimpanan) {
    const bulan = formatBulan(simpanan.tanggalDetailPembagian);
    bulanMap.set(
      bulan,
      (bulanMap.get(bulan) ?? 0) + Number(simpanan.jumlahDetailPembagian)
    );
  }

  const simpanan: TDetailLaporanSimpananBerjangka[] = bulanRange.map(
    (bulan) => ({
      bulan,
      total: bulanMap.get(bulan) ?? 0,
    })
  );

  const totalSimpanan = simpanan.reduce((sum, s) => sum + s.total, 0);
  const totalBulan = simpanan.length;

  const basil = simpanan.reduce((acc, curr, index) => {
    const bobot = totalBulan - index;
    return acc + curr.total * (persenBasil / 100) * bobot;
  }, 0);

  const totalDenganBasil = totalSimpanan + basil;
  const admin = 5000;
  const tabunganBersih = totalDenganBasil - admin;

  return {
    noAnggota: simpananData.noAnggota,
    namaAnggota: simpananData.namaAnggota,
    bankAnggota: simpananData.bankAnggota,
    rekeningAnggota: simpananData.rekeningAnggota,
    namaUnitKerja: simpananData.namaUnitKerja,
    namaPendaftaran: simpananData.namaPendaftaran,
    jenisSimpanan: simpananData.jenisPendaftaranSimpanan,
    tanggalPembagian: simpananData.tanggalPembagian,
    updatedAt: simpananData.updatedAt,
    totalSimpanan: totalSimpanan,
    basil: basil,
    totalDenganBasil: totalDenganBasil,
    admin: admin,
    tabunganBersih: tabunganBersih,
    simpanan: simpanan,
  };
}

export function generateSimpananBerjangkaExcellData(
  laporan: TLaporanSimpananBerjangka[],
  basil: number
): {
  columns: TColumnExcell[];
  rows: Record<string, unknown>[];
} {
  const allBulanSet = new Set<string>();

  // Ambil semua bulan dari simpanan
  laporan.forEach((item) => {
    item.simpanan.forEach((simp) => {
      allBulanSet.add(simp.bulan);
    });
  });

  const allBulan = Array.from(allBulanSet);

  // Ubah bulan ke format tanpa spasi: "Agustus - 2025" → "Agustus_2025"
  const bulanValueMap = Object.fromEntries(
    allBulan.map((bulan) => [bulan, bulan.replace(/\s|-/g, "_")])
  );

  // Buat kolom Excel
  const columns: TColumnExcell[] = [
    { header: "No Anggota", value: "noAnggota" },
    { header: "Nama", value: "namaAnggota" },
    { header: "Unit Kerja", value: "namaUnitKerja" },
    ...allBulan.map((bulan) => ({
      header: bulan,
      value: bulanValueMap[bulan], // pakai nama value yang sudah diubah
    })),
    { header: "Jumlah Pengambilan", value: "totalPengambilan" },
    { header: "Jumlah Tabungan", value: "totalSimpanan" },
    { header: `Basil ${basil}% / bulan`, value: "basil" },
    { header: "Tabungan + Basil", value: "totalDenganBasil" },
    { header: "Administrasi", value: "admin" },
    { header: "Tabungan Bersih", value: "tabunganBersih" },
  ];

  // Buat baris data
  const rows = laporan.map((item) => {
    const row: Record<string, unknown> = {
      noAnggota: item.noAnggota,
      namaAnggota: item.namaAnggota,
      namaUnitKerja: item.namaUnitKerja,
      totalPengambilan: item.totalPengambilan,
      totalSimpanan: item.totalSimpanan,
      basil: item.basil,
      totalDenganBasil: item.totalDenganBasil,
      admin: item.admin,
      tabunganBersih: item.tabunganBersih,
    };

    // Set default semua bulan = 0
    allBulan.forEach((bulan) => {
      row[bulanValueMap[bulan]] = 0;
    });

    // Isi data total per bulan
    item.simpanan.forEach((simp) => {
      row[bulanValueMap[simp.bulan]] = simp.total;
    });

    return row;
  });

  return { columns, rows };
}

export function setPotonganGaji(data: TPotongGaji[]): TInputPotongGaji[] {
  const dataPotongan: TInputPotongGaji[] = [];
  data.forEach((item) => {
    dataPotongan.push({
      noAnggota: item.noAnggota,
      simpananWajib: item.simpananWajib,
      simpananSukamana: item.simpananSukamana,
      simpananLebaran: item.simpananLebaran,
      simpananQurban: item.simpananQurban,
      simpananUbar: item.simpananUbar,
      noPinjamanProduktif: item.pinjamanProduktif,
      angsuranKeProduktif: item.angsuranKeProduktif,
      angsuranDariProduktif: item.angsuranDariProduktif,
      jumlahAngsuranProduktif: item.jumlahAngsuranProduktif.toString(),
      noPinjamanBarang: item.pinjamanBarang,
      angsuranKeBarang: item.angsuranKeBarang,
      angsuranDariBarang: item.angsuranDariBarang,
      jumlahAngsuranBarang: item.jumlahAngsuranBarang.toString(),
      totalPotonganGaji: item.totalPotongan.toString(),
    });
  });
  return dataPotongan;
}

export function calculateUndurDiri(
  simpanan: TSumSimpananAnggota,
  produktif: GetLastPinjamanByIdResult,
  barang: GetLastPinjamanByIdResult
): TCalculateUndurDiri {
  let pelunasanProduktif = produktif.data?.pelunasan ?? 0;
  let pelunasanBarang = barang.data?.pelunasan ?? 0;

  const biaya = 25000;
  const totalSimpanan =
    simpanan.WAJIB +
    simpanan.SUKAMANA +
    simpanan.LEBARAN +
    simpanan.QURBAN +
    simpanan.UBAR;

  const totalPelunasan = pelunasanProduktif + pelunasanBarang + biaya;

  const tabunganBersih = totalSimpanan - totalPelunasan;

  return {
    wajib: simpanan.WAJIB,
    sukamana: simpanan.SUKAMANA,
    lebaran: simpanan.LEBARAN,
    qurban: simpanan.QURBAN,
    ubar: simpanan.UBAR,
    biaya: biaya,
    totalKotor: totalSimpanan,
    totalBersih: tabunganBersih,
    pinjamanProduktif: produktif.data ?? null,
    pinjamanBarang: barang.data ?? null,
  };
}
