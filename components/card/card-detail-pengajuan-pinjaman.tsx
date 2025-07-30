import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ICalculateAsuransi } from "@/lib/types/pinjaman";
import { ArrowRightLeft } from "lucide-react";

interface ICardDetailPengajuanPinjaman {
  data: ICalculateAsuransi;
}

export default function CardDetailPengajuanPinjaman(
  props: ICardDetailPengajuanPinjaman
) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="text-indigo-600" />
          <CardTitle className="text-base font-semibold">
            Informasi Biaya Pinjaman
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 pt-2 text-sm text-muted-foreground">
        {props.data.pelunasan && props.data.pelunasan > 0 ? (
          <div className="flex justify-between">
            <span>Pelunasan</span>
            <span className="text-orange-500">
              Rp {props.data.pelunasan.toLocaleString("id-ID")}
            </span>
          </div>
        ) : null}
        {props.data.totalPremi && props.data.totalPremi > 0 ? (
          <div className="flex justify-between">
            <span>Biaya Premi</span>
            <span className="text-red-600">
              - Rp {props.data.totalPremi.toLocaleString("id-ID")}
            </span>
          </div>
        ) : null}
        <div className="flex justify-between">
          <span>Biaya Admin</span>
          <span className="text-red-600">
            - Rp {props.data.admin.toLocaleString("id-ID")}
          </span>
        </div>
        <div className="my-2 border-t border-gray-200" />
        <div className="flex justify-between">
          <span>Dana Diterima</span>
          <span className="text-green-600 font-semibold">
            Rp {props.data.receive.toLocaleString("id-ID")}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Cicilan per Bulan</span>
          <span>
            Rp {props.data.monthlyInstallment.toLocaleString("id-ID")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
