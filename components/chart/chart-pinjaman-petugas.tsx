"use client";
import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { TChartPinjaman } from "@/lib/types/pinjaman";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { TrendingUp } from "lucide-react";
import { formatDatebyMonth } from "@/lib/helper";

interface IChartPinjamanPetugas {
  data: TChartPinjaman;
}
export default function ChartPinjamanPetugas({ data }: IChartPinjamanPetugas) {
  if (data.produktif.TOTAL === 0 && data.barang.TOTAL === 0) {
    return null;
  }

  const hasBoth = data.produktif.TOTAL > 0 && data.barang.TOTAL > 0;

  const chartDataProduktif = [
    {
      name: "pending",
      jumlah: data.produktif.PENDING,
      fill: "var(--color-pending)",
    },
    {
      name: "berjalan",
      jumlah: data.produktif.APPROVED,
      fill: "var(--color-berjalan)",
    },
    {
      name: "selesai",
      jumlah: data.produktif.COMPLETED,
      fill: "var(--color-selesai)",
    },
  ];

  const chartConfigProduktif = {
    jumlah: {
      label: "Jumlah",
    },
    pending: {
      label: "Pending",
      color: "var(--chart-1)",
    },
    berjalan: {
      label: "Berjalan",
      color: "var(--chart-2)",
    },
    selesai: {
      label: "Selesai",
      color: "var(--chart-3)",
    },
  } satisfies ChartConfig;

  const chartDataBarang = [
    {
      name: "pending",
      jumlah: data.barang.PENDING,
      fill: "var(--color-pending)",
    },
    {
      name: "berjalan",
      jumlah: data.barang.APPROVED,
      fill: "var(--color-berjalan)",
    },
    {
      name: "selesai",
      jumlah: data.barang.COMPLETED,
      fill: "var(--color-selesai)",
    },
  ];

  const chartConfigBarang = {
    jumlah: {
      label: "Jumlah",
    },
    pending: {
      label: "Pending",
      color: "var(--chart-1)",
    },
    berjalan: {
      label: "berjalan",
      color: "var(--chart-2)",
    },
    selesai: {
      label: "selesai",
      color: "var(--chart-3)",
    },
  } satisfies ChartConfig;

  return (
    <div className={`grid gap-4 ${hasBoth ? "md:grid-cols-2" : "grid-cols-1"}`}>
      <Card className="flex flex-col">
        <CardHeader className="items-center text-center pb-0">
          <CardTitle className="text-xl font-medium ">
            Pinjaman Produktif Anggota
          </CardTitle>
          <CardDescription>{formatDatebyMonth(new Date())}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-2">
          {data.produktif.TOTAL > 0 ? (
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
                Tidak ada data pinjaman untuk ditampilkan.
              </div>
            </div>
          )}
        </CardContent>
        {data.produktif.TOTAL > 0 && (
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 text-base text-muted-foreground font-medium leading-none">
              Total {data.produktif.TOTAL} pinjaman produktif:{" "}
              {data.produktif.APPROVED} disetujui, {data.produktif.COMPLETED}{" "}
              selesai, dan {data.produktif.PENDING} menunggu persetujuan.
            </div>
          </CardFooter>
        )}
      </Card>
      <Card className="flex flex-col">
        <CardHeader className="items-center text-center pb-0">
          <CardTitle className="text-xl font-medium ">
            Progress Pinjaman Barang Anda
          </CardTitle>
          <CardDescription>{formatDatebyMonth(new Date())}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-2">
          {data.barang.TOTAL > 0 ? (
            <ChartContainer
              config={chartConfigBarang}
              className="[&_.recharts-pie-label-text]:fill-foreground w-full max-w-md mx-auto max-h-[250px]"
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
                Tidak ada data pinjaman untuk ditampilkan.
              </div>
            </div>
          )}
        </CardContent>
        {data.barang.TOTAL > 0 && (
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 text-base text-muted-foreground font-medium leading-none">
              Total {data.barang.TOTAL} pinjaman barang: {data.barang.APPROVED}{" "}
              disetujui, {data.barang.COMPLETED} selesai, dan{" "}
              {data.barang.PENDING} menunggu persetujuan.
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
