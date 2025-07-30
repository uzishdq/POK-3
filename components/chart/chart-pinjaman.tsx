"use client";
import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { TLastPinjamanByIdData } from "@/lib/types/pinjaman";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { TrendingUp } from "lucide-react";
import { formatToIDR } from "@/lib/helper";

interface IChartPinjaman {
  produktif: TLastPinjamanByIdData;
  barang: TLastPinjamanByIdData;
}
export default function ChartPinjaman({ produktif, barang }: IChartPinjaman) {
  if (!produktif && !barang) {
    return null;
  }

  const hasBoth = produktif && barang;

  const chartDataProduktif = [
    {
      name: "lunas",
      jumlah: produktif?.totalBayar,
      fill: "var(--color-lunas)",
    },
    { name: "sisa", jumlah: produktif?.pelunasan, fill: "var(--color-sisa)" },
  ];

  const chartConfigProduktif = {
    jumlah: {
      label: "Jumlah",
    },
    lunas: {
      label: "Lunas",
      color: "var(--chart-1)",
    },
    sisa: {
      label: "Sisa",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const chartDataBarang = [
    { name: "lunas", jumlah: barang?.totalBayar, fill: "var(--color-lunas)" },
    { name: "sisa", jumlah: barang?.pelunasan, fill: "var(--color-sisa)" },
  ];

  const chartConfigBarang = {
    jumlah: {
      label: "Jumlah",
    },
    lunas: {
      label: "Lunas",
      color: "var(--chart-1)",
    },
    sisa: {
      label: "Sisa",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  return (
    <div className={`grid gap-4 ${hasBoth ? "md:grid-cols-2" : "grid-cols-1"}`}>
      {produktif && (
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle className="text-xl font-medium text-center">
              Progress Pinjaman Produktif Anda
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-2">
            {produktif.totalBayar > 0 ? (
              <ChartContainer
                config={chartConfigProduktif}
                className="[&_.recharts-pie-label-text]:fill-foreground w-full max-w-md mx-auto max-h-[250px]"
              >
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={chartDataProduktif}
                    dataKey="jumlah"
                    label={({ payload, ...props }) => {
                      return (
                        <text
                          className="font-medium text-sm"
                          cx={props.cx}
                          cy={props.cy}
                          x={props.x}
                          y={props.y}
                          textAnchor={props.textAnchor}
                          dominantBaseline={props.dominantBaseline}
                          fill="hsla(var(--foreground))"
                        >
                          {payload.name}
                        </text>
                      );
                    }}
                    nameKey="name"
                  />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-muted-foreground text-xl font-medium">
                  Tidak ada data pembayaran untuk ditampilkan.
                </div>
              </div>
            )}
          </CardContent>
          {produktif.totalBayar > 0 && (
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 text-base font-medium leading-none">
                Pembayaran lunas sebesar {formatToIDR(produktif.totalBayar)}{" "}
                dari sisa {formatToIDR(produktif.pelunasan)}
                <TrendingUp className="h-4 w-4" />
              </div>
            </CardFooter>
          )}
        </Card>
      )}
      {barang && (
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle className="text-xl font-medium text-center">
              Progress Pinjaman Barang Anda
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-2">
            {barang.totalBayar > 0 ? (
              <ChartContainer
                config={chartConfigBarang}
                className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
              >
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={chartDataBarang}
                    dataKey="jumlah"
                    label={({ payload, ...props }) => {
                      return (
                        <text
                          className="font-medium text-sm"
                          cx={props.cx}
                          cy={props.cy}
                          x={props.x}
                          y={props.y}
                          textAnchor={props.textAnchor}
                          dominantBaseline={props.dominantBaseline}
                          fill="hsla(var(--foreground))"
                        >
                          {payload.name}
                        </text>
                      );
                    }}
                    nameKey="name"
                  />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-muted-foreground text-xl font-medium">
                  Tidak ada data pembayaran untuk ditampilkan.
                </div>
              </div>
            )}
          </CardContent>
          {barang.totalBayar > 0 && (
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 text-base font-medium leading-none">
                Pembayaran lunas sebesar {formatToIDR(barang.totalBayar)} dari
                sisa {formatToIDR(barang.pelunasan)}
                <TrendingUp className="h-4 w-4" />
              </div>
            </CardFooter>
          )}
        </Card>
      )}
    </div>
  );
}
