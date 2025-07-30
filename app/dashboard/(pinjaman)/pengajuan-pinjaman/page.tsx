import FormPengajuanPinjaman from "@/components/form/pinjaman/form-pengajuan-pinjaman";
import {
  RenderError,
  RenderErrorPengajuanPinjaman,
} from "@/components/ui/render-error";
import { auth } from "@/lib/auth";
import { jenisPinjaman } from "@/lib/constan";
import {
  getLastPinjamanById,
  getMaxJumlahPinjamanById,
} from "@/lib/server/data/data-pinjaman";
import React from "react";

export default async function PengajuanPinjaman() {
  const session = await auth();
  const noAnggota = session?.user?.noAnggota;

  if (!noAnggota) {
    return RenderError(
      "Pengajuan Pinjaman",
      "Sesi Anda telah berakhir. Silakan login kembali."
    );
  }

  const [lastPinjamanProduktif, lastPinjamanBarang, maxPinjaman] =
    await Promise.all([
      getLastPinjamanById(noAnggota, "PRODUKTIF", "PENDING"),
      getLastPinjamanById(noAnggota, "BARANG", "PENDING"),
      getMaxJumlahPinjamanById(noAnggota),
    ]);

  const isEligibleProduktif = checkEligibility(lastPinjamanProduktif);
  const isEligibleBarang = checkEligibility(lastPinjamanBarang);

  const isEligibleToApply = isEligibleProduktif || isEligibleBarang;

  if (!isEligibleToApply) {
    const messages = [];

    if (lastPinjamanProduktif?.message) {
      messages.push(lastPinjamanProduktif.message);
    }

    if (lastPinjamanBarang?.message) {
      messages.push(lastPinjamanBarang.message);
    }

    const errorMsg =
      messages.length > 0
        ? messages.join(" dan ")
        : "Anda belum dapat mengajukan pinjaman baru.";

    return RenderErrorPengajuanPinjaman("Pengajuan Pinjaman", errorMsg);
  }

  if (!maxPinjaman || !maxPinjaman.ok || !maxPinjaman.maxPinjaman) {
    return RenderErrorPengajuanPinjaman(
      "Pengajuan Pinjaman",
      maxPinjaman?.message ||
        "Tidak dapat mengajukan pinjaman karena saldo simpanan kosong."
    );
  }

  const availableJenisPinjaman = jenisPinjaman.filter((item) => {
    if (item.value === "PRODUKTIF") return isEligibleProduktif;
    if (item.value === "BARANG") return isEligibleBarang;
    return false;
  });

  // ✅ Siap tampilkan form pengajuan pinjaman
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-2xl font-medium">Pengajuan Pinjaman</div>
      <FormPengajuanPinjaman
        id={noAnggota}
        maxLimit={maxPinjaman.maxPinjaman}
        jenisPinjaman={availableJenisPinjaman}
      />
    </div>
  );
}

function checkEligibility(
  lastPinjaman: Awaited<ReturnType<typeof getLastPinjamanById>>
) {
  if (!lastPinjaman || !lastPinjaman.ok) return false;

  const allowedStatus = [
    "TIDAK_ADA_PINJAMAN",
    "SUDAH_LUNAS",
    "SUDAH_LUNAS_SEBAGIAN",
  ];

  return allowedStatus.includes(lastPinjaman.status);
}
