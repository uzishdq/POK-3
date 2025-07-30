import { TValidasiPelunasanData } from "@/lib/types/pelunasan-pinjaman";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { formatDatebyMonth, formatToIDR } from "@/lib/helper";

interface ICardDetailPelunasanPinjaman {
  result: TValidasiPelunasanData;
}

export default function CardDetailPelunasanPinjaman({
  result,
}: ICardDetailPelunasanPinjaman) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">
          Informasi Pelunasan Pinjaman
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Bagian Tujuan & Jenis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">
                Tujuan Pinjaman
              </Label>
              <div className="text-base font-medium">
                {result?.tujuanPinjaman}
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">
                Jenis Pinjaman
              </Label>
              <div className="text-base font-medium">
                {result?.jenisPinjman}
              </div>
            </div>
          </div>

          {/* Bagian No & Tanggal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">
                No Pinjaman
              </Label>
              <div className="text-base font-medium">{result?.noPinjaman}</div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">
                Tanggal Pinjaman
              </Label>
              <div className="text-base font-medium">
                {formatDatebyMonth(result?.tanggalPinjaman ?? "")}
              </div>
            </div>
          </div>

          {/* Bagian Ajuan & Angsuran */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">
                Pinjaman Diajukan
              </Label>
              <div className="text-base font-medium">
                {formatToIDR(Number(result?.ajuanPinjaman ?? 0))}
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">
                Angsuran ke / dari
              </Label>
              <div className="text-base font-medium">
                {result?.angsuranKe} / {result?.angsuranDari}
              </div>
            </div>
          </div>

          {/* Bagian Total Bayar & Biaya Pelanti */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">
                Total Sudah Dibayar
              </Label>
              <div className="text-base font-medium">
                {formatToIDR(Number(result?.totalBayar ?? 0))}
              </div>
            </div>
            <div>
              <Label className="text-sm text-orange-600">Biaya Pelanti</Label>
              <div className="text-base font-medium text-orange-600">
                {formatToIDR(Number(result?.admin ?? 0))}
              </div>
            </div>
          </div>

          {/* Total Pelunasan */}
          <div>
            <Label className="text-sm text-red-500">
              Total Pelunasan (Termasuk Biaya Pelanti)
            </Label>
            <div className="text-base font-bold text-red-600">
              {formatToIDR(Number(result?.pelunasan ?? 0))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
