"use client";

import { formatDatebyMonth, formatToIDR } from "@/lib/helper";
import { THistoryPotongGaji, TPotongGaji } from "@/lib/types/potong-gaji";
import { ColumnDef } from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { ArrowUpDown, MoreHorizontal, ReceiptText } from "lucide-react";
import { Label } from "../ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export const columnPotongGaji: ColumnDef<TPotongGaji>[] = [
  {
    accessorKey: "noAnggota",
    header: "No Anggota",
    cell: ({ row }) => <div>{row.getValue("noAnggota")}</div>,
  },
  {
    accessorKey: "namaAnggota",
    header: "Nama",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("namaAnggota")}</div>
    ),
  },
  {
    accessorKey: "namaUnitKerja",
    header: "Unit Kerja",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("namaUnitKerja")}</div>
    ),
  },
  {
    accessorKey: "simpananWajib",
    header: "Wajib",
    enableHiding: false,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("simpananWajib"));
      return <div className="font-semibold">{formatted}</div>;
    },
  },
  {
    accessorKey: "simpananSukamana",
    header: "Sukamana",
    enableHiding: false,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("simpananSukamana"));
      return <div className="font-semibold">{formatted}</div>;
    },
  },
  {
    accessorKey: "simpananLebaran",
    header: "Lebaran",
    enableHiding: false,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("simpananLebaran"));
      return <div className="font-semibold">{formatted}</div>;
    },
  },
  {
    accessorKey: "simpananQurban",
    header: "Qurban",
    enableHiding: false,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("simpananQurban"));
      return <div className="font-semibold">{formatted}</div>;
    },
  },
  {
    accessorKey: "simpananUbar",
    header: "Ubar",
    enableHiding: false,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("simpananUbar"));
      return <div className="font-semibold">{formatted}</div>;
    },
  },
  {
    accessorKey: "pinjamanProduktif",
    header: "Pinjaman Produktif",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("pinjamanProduktif")}</div>
    ),
  },
  {
    accessorKey: "angsuranKeProduktif",
    header: "Angsuran Ke Produktif",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("angsuranKeProduktif")}</div>
    ),
  },
  {
    accessorKey: "angsuranDariProduktif",
    header: "Angsuran Dari Produktif",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("angsuranDariProduktif")}</div>
    ),
  },
  {
    accessorKey: "jumlahAngsuranProduktif",
    header: "Angsuran Produktif",
    enableHiding: false,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("jumlahAngsuranProduktif"));
      return <div className="font-semibold">{formatted}</div>;
    },
  },
  {
    accessorKey: "pinjamanBarang",
    header: "Pinjaman Barang",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("pinjamanBarang")}</div>
    ),
  },
  {
    accessorKey: "angsuranKeBarang",
    header: "Angsuran Ke Barang",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("angsuranKeBarang")}</div>
    ),
  },
  {
    accessorKey: "angsuranDariBarang",
    header: "Angsuran Dari Barang",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("angsuranDariBarang")}</div>
    ),
  },
  {
    accessorKey: "jumlahAngsuranBarang",
    header: "Angsuran Barang",
    enableHiding: false,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("jumlahAngsuranBarang"));
      return <div className="font-semibold">{formatted}</div>;
    },
  },
  {
    accessorKey: "totalPotongan",
    header: "Total",
    enableHiding: false,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("totalPotongan"));
      return <div className="font-semibold">{formatted}</div>;
    },
  },
];

export const columnHistoryPotongGaji: ColumnDef<THistoryPotongGaji>[] = [
  {
    accessorKey: "noAnggota",
    header: "No Anggota",
    cell: ({ row }) => <div>{row.getValue("noAnggota")}</div>,
  },
  {
    accessorKey: "namaAnggota",
    header: "Nama",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("namaAnggota")}</div>
    ),
  },
  {
    accessorKey: "namaUnitKerja",
    header: "Unit Kerja",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("namaUnitKerja")}</div>
    ),
  },
  {
    accessorKey: "tanggalPotongGaji",
    enableHiding: false,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tanggal
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const formattedDate = formatDatebyMonth(
        row.getValue("tanggalPotongGaji")
      );
      return <div className="capitalize">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "simpananWajib",
    header: "Wajib",
    enableHiding: false,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("simpananWajib"));
      return <div className="capitalize">{formatted}</div>;
    },
  },
  {
    accessorKey: "simpananSukamana",
    header: "Sukamana",
    enableHiding: false,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("simpananSukamana"));
      return <div className="capitalize">{formatted}</div>;
    },
  },
  {
    accessorKey: "simpananLebaran",
    header: "Lebaran",
    enableHiding: false,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("simpananLebaran"));
      return <div className="capitalize">{formatted}</div>;
    },
  },
  {
    accessorKey: "simpananQurban",
    header: "Qurban",
    enableHiding: false,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("simpananQurban"));
      return <div className="capitalize">{formatted}</div>;
    },
  },
  {
    accessorKey: "simpananUbar",
    header: "Ubar",
    enableHiding: false,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("simpananUbar"));
      return <div className="capitalize">{formatted}</div>;
    },
  },
  {
    accessorKey: "totalPotonganGaji",
    header: "Total",
    enableHiding: false,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("totalPotonganGaji"));
      return <div className="font-semibold">{formatted}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const dataRows = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open Menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="text-center">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
              <DialogDetail value={dataRows} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

type TDialog = {
  value: THistoryPotongGaji;
};

function DialogDetail({ value }: TDialog) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="w-full">
          <ReceiptText className="mr-2 h-4 w-4" />
          Detail
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Detail Potongan Pinjaman</DialogTitle>
          <DialogDescription>
            Informasi lengkap terkait potongan pinjaman.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-foreground">
            Pinjaman Produktif
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">
                No Pinjaman
              </Label>
              <div className="text-base font-medium">
                {value.noPinjamanProduktif}
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">
                Angsuran Ke / Dari
              </Label>
              <div className="text-base font-medium">
                {value.angsuranKeProduktif} / {value.angsuranDariProduktif}
              </div>
            </div>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">
              Jumlah Angsuran
            </Label>
            <div className="text-base font-medium">
              {formatToIDR(Number(value.jumlahAngsuranProduktif))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-foreground">
            Pinjaman Barang
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">
                No Pinjaman
              </Label>
              <div className="text-base font-medium">
                {value.noPinjamanBarang}
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">
                Angsuran Ke / Dari
              </Label>
              <div className="text-base font-medium">
                {value.angsuranKeBarang} / {value.angsuranDariBarang}
              </div>
            </div>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">
              Jumlah Angsuran
            </Label>
            <div className="text-base font-medium">
              {formatToIDR(Number(value.jumlahAngsuranBarang))}
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <DialogTrigger asChild>
            <Button variant="secondary">Kembali</Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
