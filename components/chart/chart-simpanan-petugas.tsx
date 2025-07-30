"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import { TMaxPengambilan, TSumSimpananAnggota } from "@/lib/types/simpanan";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { formatDatebyMonth, formatToIDR } from "@/lib/helper";

interface IChartSimpananPetugas {
  data: TSumSimpananAnggota;
}

export default function ChartSimpananPetugas({ data }: IChartSimpananPetugas) {
  const chartData = [
    {
      simpanan: "wajib",
      jumlah: data.WAJIB,
      fill: "var(--color-wajib)",
    },
    {
      simpanan: "sukamana",
      jumlah: data.SUKAMANA,
      fill: "var(--color-sukamana)",
    },
    {
      simpanan: "lebaran",
      jumlah: data.LEBARAN,
      fill: "var(--color-lebaran)",
    },
    {
      simpanan: "qurban",
      jumlah: data.QURBAN,
      fill: "var(--color-qurban)",
    },
    { simpanan: "ubar", jumlah: data.UBAR, fill: "var(--color-ubar)" },
  ];

  const chartConfig = {
    jumlah: {
      label: "saldo",
    },
    wajib: {
      label: "Wajib",
      color: "#1E40AF",
    },
    sukamana: {
      label: "Sukamana",
      color: "#059669",
    },
    lebaran: {
      label: "Lebaran",
      color: "#ca8a04",
    },
    qurban: {
      label: "Qurban",
      color: "#dc2626",
    },
    ubar: {
      label: "Ubar",
      color: "#9333ea",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-medium">
          Rekapitulasi Simpanan Anggota
        </CardTitle>
        <CardDescription>{formatDatebyMonth(new Date())}</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-4 ">
        <ChartContainer className="h-[200px] w-full" config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 10,
              right: 10,
              top: 0,
              bottom: 0,
            }}
            barSize={32}
            barGap={2}
          >
            <YAxis
              dataKey="simpanan"
              type="category"
              tickLine={false}
              tickMargin={5}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <XAxis dataKey="jumlah" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="jumlah" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 text-base font-medium leading-none">
          Total saldo:{" "}
          <p className="text-green-600">{formatToIDR(data.SALDO)}</p> |
          Pengambilan:{" "}
          <p className="text-red-600">- {formatToIDR(data.PENGAMBILAN)}</p>
        </div>
      </CardFooter>
    </Card>
  );
}
