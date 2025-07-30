import { GetLastPinjamanByIdResult } from "@/lib/types/pinjaman";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { formatToIDR } from "@/lib/helper";

interface ICardPinjaman {
  title: string;
  icon: React.ReactNode;
  result: GetLastPinjamanByIdResult;
}

export default function CardPinjaman({ title, icon, result }: ICardPinjaman) {
  const statusColorMap: Record<string, string> = {
    BELUM_LUNAS: "bg-yellow-100 text-yellow-800",
    SUDAH_LUNAS: "bg-green-100 text-green-800",
    SUDAH_LUNAS_SEBAGIAN: "bg-orange-100 text-orange-800",
    PENDING: "bg-gray-200 text-gray-700",
    ERROR: "bg-red-100 text-red-700",
    TIDAK_ADA_PINJAMAN: "bg-gray-100 text-gray-500",
  };

  const displayValue = result.data ? result.data.totalBayar : 0;
  const progressValue = result.data ? result.data.persentaseLunas : 0;
  const status = result.status;
  const statusBadgeClass =
    statusColorMap[status] || "bg-muted text-muted-foreground";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xl font-medium flex items-center gap-2">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-3xl font-bold">{formatToIDR(displayValue)}</div>
        <Progress value={progressValue} className="h-2" />
        <Badge className={statusBadgeClass}>
          {status.replaceAll("_", " ")}
        </Badge>
      </CardContent>
    </Card>
  );
}
