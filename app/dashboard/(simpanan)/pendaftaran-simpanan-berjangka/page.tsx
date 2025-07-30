import CardPendaftaranSimpanan from "@/components/card/card-pendaftaran-simpanan";
import FormStatus from "@/components/form/form-status";
import { RenderError } from "@/components/ui/render-error";
import { LABEL } from "@/lib/constan";
import { getPendaftarSimpanan } from "@/lib/server/data/data-simpanan";
import React from "react";

export default async function PendaftaranSimpanan() {
  const [lebaran, qurban, ubar] = await Promise.all([
    getPendaftarSimpanan("LEBARAN"),
    getPendaftarSimpanan("QURBAN"),
    getPendaftarSimpanan("UBAR"),
  ]);

  if (!lebaran.ok || !qurban.ok || !ubar.ok) {
    return RenderError("Pendaftaran Simpanan", LABEL.ERROR.DESCRIPTION);
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-2xl font-medium">Pendaftaran Simpanan</div>

      {lebaran.data ? (
        <CardPendaftaranSimpanan
          descriptions="Menyambut Lebaran dengan Tabungan Berkah"
          data={lebaran.data}
        />
      ) : (
        <FormStatus message="Pendaftaran simpanan lebaran belum tersedia saat ini" />
      )}

      {qurban.data ? (
        <CardPendaftaranSimpanan
          descriptions="Qurban Lebih Mudah dengan Tabungan Khusus"
          data={qurban.data}
        />
      ) : (
        <FormStatus message="Pendaftaran simpanan qurban belum tersedia saat ini" />
      )}

      {ubar.data ? (
        <CardPendaftaranSimpanan
          descriptions="Liburan Lebih Seru, Hemat, dan Terencana!"
          data={ubar.data}
        />
      ) : (
        <FormStatus message="Pendaftaran simpanan ulin bareng belum tersedia saat ini" />
      )}
    </div>
  );
}
