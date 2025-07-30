import FormStatus from "@/components/form/form-status";
import { TabelLaporanSimpanan } from "@/components/table/tabel-laporan";
import { RenderError } from "@/components/ui/render-error";
import { PembagianSimpananSchema } from "@/lib/schema/schema-simpanan";
import { getLaporanSimpananBerjangka } from "@/lib/server/data/data-simpanan";
import { TLaporanSimpananBerjangka } from "@/lib/types/laporan";
import React from "react";

export default async function PembagianSimpananBerjangka({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const value = await searchParams;

  const idParams = value.id ?? "";
  const basilParams = value.basil ?? "";

  const parse = PembagianSimpananSchema.safeParse({
    id: idParams,
    basil: basilParams,
    tanggalPembagian: new Date().toDateString(),
  });

  if (!parse.success) {
    return RenderError(
      "Simulasi Pembagian Simpanan Berjangka",
      "Data Tidak ditemukan."
    );
  }

  let laporanSimpanan: TLaporanSimpananBerjangka[] | null = null;
  let status = false;
  let message: string | undefined;
  let namePendaftaran = "";
  let basil = 0;

  if (parse.success) {
    const response = await getLaporanSimpananBerjangka(
      parse.data.id,
      Number(parse.data.basil)
    );

    status = response.ok;
    message = response.message;
    namePendaftaran = response.data.namePendaftaran ?? "";
    basil = response.data.basil;
    laporanSimpanan = response.ok ? response.data.result : null;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-2xl font-medium">
        Simulasi Pembagian Simpanan Berjangka
      </div>

      {laporanSimpanan && laporanSimpanan.length > 0 ? (
        <TabelLaporanSimpanan
          data={laporanSimpanan}
          namePendaftaran={`Simulasi ${namePendaftaran} & Basil : ${basilParams} % `}
          basil={basil}
        />
      ) : (
        <FormStatus status={status} message={message} />
      )}
    </div>
  );
}
