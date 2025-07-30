import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { formatToIDR } from "@/lib/helper";
import FormStatus from "../form/form-status";
import { TCalculateUndurDiri } from "@/lib/types/undur-diri";

interface ICardDetailPengunduranDiri {
  data: TCalculateUndurDiri;
}

export default function CardDetailPengunduranDiri({
  data,
}: ICardDetailPengunduranDiri) {
  const isMinus = data.totalBersih < 0;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">
          Informasi Pengunduran Diri
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.totalBersih < 0 && (
            <FormStatus
              status={false}
              message={`Simpanan Anda tidak cukup untuk melunasi seluruh pinjaman. Sisa kekurangan: ${formatToIDR(
                data.totalBersih
              )}`}
            />
          )}
          {/* Detail Simpanan */}
          <div>
            <h3 className="text-base font-semibold mb-2">Detail Simpanan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
              {[
                { label: "Wajib", value: data.wajib },
                { label: "Sukamana", value: data.sukamana },
                { label: "Lebaran", value: data.lebaran },
                { label: "Qurban", value: data.qurban },
                { label: "Ubar", value: data.ubar },
                { label: "Jumlah Tabungan", value: data.totalKotor },
              ].map(({ label, value }) => (
                <div key={label}>
                  <Label className="text-sm text-muted-foreground">
                    {label}
                  </Label>
                  <div className="text-base font-medium">
                    {formatToIDR(value)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pinjaman Produktif */}
          {data.pinjamanProduktif && (
            <div>
              <h3 className="text-base font-semibold mb-2">
                Pinjaman Produktif
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">
                    No Pinjaman
                  </Label>
                  <div className="text-base font-medium">
                    {data.pinjamanProduktif.pinjamanId}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Angsuran ke / dari
                  </Label>
                  <div className="text-base font-medium">
                    {data.pinjamanProduktif.angsuranKe} /{" "}
                    {data.pinjamanProduktif.angsuranDari}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Total Sudah Dibayar
                  </Label>
                  <div className="text-base font-medium">
                    {formatToIDR(data.pinjamanProduktif.totalBayar ?? 0)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Total Pelunasan (Termasuk Biaya Pelanti)
                  </Label>
                  <div className="text-base font-bold text-red-600">
                    - {formatToIDR(data.pinjamanProduktif.pelunasan ?? 0)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pinjaman Barang */}
          {data.pinjamanBarang && (
            <div>
              <h3 className="text-base font-semibold mb-2">Pinjaman Barang</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">
                    No Pinjaman
                  </Label>
                  <div className="text-base font-medium">
                    {data.pinjamanBarang.pinjamanId}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Angsuran ke / dari
                  </Label>
                  <div className="text-base font-medium">
                    {data.pinjamanBarang.angsuranKe} /{" "}
                    {data.pinjamanBarang.angsuranDari}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Total Sudah Dibayar
                  </Label>
                  <div className="text-base font-medium">
                    {formatToIDR(data.pinjamanBarang.totalBayar ?? 0)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Total Pelunasan (Termasuk Biaya Pelanti)
                  </Label>
                  <div className="text-base font-bold text-red-600">
                    - {formatToIDR(data.pinjamanBarang.pelunasan ?? 0)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Detail Administrasi */}
          <div>
            <h3 className="text-base font-semibold mb-2">
              Detail Administrasi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">
                  Biaya Administrasi
                </Label>
                <div className="text-base font-bold text-red-600">
                  - {formatToIDR(data.biaya)}
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  {isMinus ? "Sisa Kewajiban" : "Tabungan Bersih Diterima"}
                </Label>
                <div
                  className={`text-base font-bold ${
                    isMinus ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {formatToIDR(data.totalBersih)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
