"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import { TMaxPengambilan } from "@/lib/types/simpanan";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

interface IChartSimpanan {
  data: TMaxPengambilan | null;
}

export default function ChartSimpanan({ data }: IChartSimpanan) {
  const chartData = [
    {
      simpanan: "sukamana",
      jumlah: data?.sukamana ?? 0,
      fill: "var(--color-sukamana)",
    },
    {
      simpanan: "lebaran",
      jumlah: data?.lebaran ?? 0,
      fill: "var(--color-lebaran)",
    },
    {
      simpanan: "qurban",
      jumlah: data?.qurban ?? 0,
      fill: "var(--color-qurban)",
    },
    { simpanan: "ubar", jumlah: data?.ubar ?? 0, fill: "var(--color-ubar)" },
  ];

  const chartConfig = {
    jumlah: {
      label: "saldo",
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
      <CardHeader>
        <CardTitle className="text-xl font-medium text-center">
          Simpanan Berdasarkan Kategori
        </CardTitle>
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
    </Card>
  );
}
