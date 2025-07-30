import FormStatus from "@/components/form/form-status";
import {
  LaporanPinjamanForm,
  LaporanSimpananForm,
} from "@/components/form/laporan/form-laporan";
import {
  TabelLaporanPinjaman,
  TabelLaporanSimpanan,
} from "@/components/table/tabel-laporan";

import { RenderError } from "@/components/ui/render-error";
import { jenisPinjaman, LABEL } from "@/lib/constan";
import {
  getCountStatusPinjaman,
  getLaporanPinjaman,
} from "@/lib/server/data/data-pinjaman";
import {
  getLaporanSimpananBerjangka,
  getSettingSimpanan,
} from "@/lib/server/data/data-simpanan";
import { JenisPinjamanType, StatusPinjamanType } from "@/lib/types/helper";
import {
  TLaporanPinjaman,
  TLaporanSimpananBerjangka,
} from "@/lib/types/laporan";
import React from "react";

export default async function Laporan({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [setting, pinjaman] = await Promise.all([
    getSettingSimpanan(),
    getCountStatusPinjaman(),
  ]);

  if (!setting.ok || !setting.data) {
    return RenderError(
      "Laporan Simpanan Berjangka & Pinjaman Anggota",
      LABEL.ERROR.DESCRIPTION
    );
  }

  const availableJenisPinjaman = jenisPinjaman.filter((item) => {
    if (item.value === "PRODUKTIF") return pinjaman.produktif.TOTAL > 0;
    if (item.value === "BARANG") return pinjaman.barang.TOTAL > 0;
    return false;
  });

  const value = await searchParams;

  const jenisPinjamanParams = value.jenisPinjaman ?? "";
  const statusPinjamanParams = value.statusPinjaman ?? "";
  const noPendaftaranParams = Array.isArray(value.noPendaftaran)
    ? value.noPendaftaran[0]
    : value.noPendaftaran ?? "";

  const isFiltered = Boolean(jenisPinjamanParams && statusPinjamanParams);

  let laporanPinjaman: TLaporanPinjaman[] | null = null;
  let laporanSimpanan: TLaporanSimpananBerjangka[] | null = null;

  let statusPinjaman = false;
  let statusSimpanan = false;

  let messagePinjaman: string | undefined;
  let messageSimpanan: string | undefined;

  let namePendaftaran = "";
  let basil = 0;

  if (isFiltered) {
    const response = await getLaporanPinjaman({
      jenisPinjaman: jenisPinjamanParams as JenisPinjamanType,
      statusPinjaman: statusPinjamanParams as StatusPinjamanType,
    });

    statusPinjaman = response.ok;
    messagePinjaman = response.message;
    laporanPinjaman = response.ok ? response.data : null;
  }

  if (noPendaftaranParams) {
    const response = await getLaporanSimpananBerjangka(noPendaftaranParams);

    statusSimpanan = response.ok;
    messageSimpanan = response.message;
    namePendaftaran = response.data.namePendaftaran ?? "";
    basil = response.data.basil;
    laporanSimpanan = response.ok ? response.data.result : null;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-2xl font-medium">
        Laporan Simpanan Berjangka & Pinjaman Anggota
      </div>
      {pinjaman.produktif.TOTAL > 0 || pinjaman.barang.TOTAL > 0 ? (
        <LaporanPinjamanForm
          message={messagePinjaman}
          status={statusPinjaman}
          jenisPinjaman={availableJenisPinjaman}
        />
      ) : (
        <FormStatus message="Tidak ada pinjaman saat ini." />
      )}

      {laporanPinjaman && laporanPinjaman.length > 0 && (
        <TabelLaporanPinjaman
          data={laporanPinjaman}
          jenis={jenisPinjamanParams as JenisPinjamanType}
          status={statusPinjamanParams as StatusPinjamanType}
        />
      )}
      {setting.data.length > 0 ? (
        <LaporanSimpananForm
          data={setting.data}
          message={messageSimpanan}
          status={statusSimpanan}
        />
      ) : (
        <FormStatus message="Tidak ada simpanan berjangka saat ini." />
      )}

      {laporanSimpanan && laporanSimpanan.length > 0 && (
        <TabelLaporanSimpanan
          data={laporanSimpanan}
          namePendaftaran={namePendaftaran}
          basil={basil}
        />
      )}
    </div>
  );
}
