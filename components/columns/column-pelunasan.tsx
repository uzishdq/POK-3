"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { TPelunasanPinjaman } from "@/lib/types/pelunasan-pinjaman";
import { Button } from "../ui/button";
import {
  ArrowUpDown,
  FileImage,
  MoreHorizontal,
  Pencil,
  ReceiptText,
} from "lucide-react";
import { formatDatebyMonth, formatToIDR } from "@/lib/helper";
import { BadgeCustom } from "./badge-custom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { StatusPelunasanPinjamanType } from "@/lib/types/helper";
import { updatePelunasan } from "@/lib/server/action/action-pelunasan";
import { toast } from "sonner";

export const columnPelunasanPinjaman: ColumnDef<TPelunasanPinjaman>[] = [
  {
    accessorKey: "noPelunasanPinjaman",
    header: "No Pelunasan",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("noPelunasanPinjaman")}</div>
    ),
  },
  {
    accessorKey: "namaAnggota",
    header: "Nama",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("namaAnggota")}</div>
    ),
  },
  {
    accessorKey: "namaUnitKerja",
    header: "Unit Kerja",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("namaUnitKerja")}</div>
    ),
  },
  {
    accessorKey: "tanggalPelunasanPinjaman",
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
        row.getValue("tanggalPelunasanPinjaman")
      );
      return <div className="capitalize">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "pinjamanId",
    header: "No Pinjaman",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("pinjamanId")}</div>
    ),
  },
  {
    accessorKey: "jenisPelunasanPinjaman",
    header: "Metode Pembayaran",
    cell: ({ row }) => (
      <BadgeCustom
        value={row.getValue("jenisPelunasanPinjaman")}
        category="jenisPelunasanPinjaman"
      />
    ),
  },
  {
    accessorKey: "jumlahPelunasanPinjaman",
    header: "Sisa Pelunasan",
    enableHiding: false,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("jumlahPelunasanPinjaman"));
      return <div className="font-semibold">{formatted}</div>;
    },
  },
  {
    accessorKey: "statusPelunasanPinjaman",
    header: "Status",
    cell: ({ row }) => (
      <BadgeCustom
        value={row.getValue("statusPelunasanPinjaman")}
        category="statusPinjaman"
      />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const dataRows = row.original;

      const isPending = dataRows.statusPelunasanPinjaman === "PENDING";

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
            {isPending && (
              <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                <DialogAction value={dataRows} />
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
              <DialogDetail value={dataRows} />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                href={row.original.buktiPelunasan}
                target="_blank"
                className="w-full"
              >
                <Button size="icon" variant="ghost" className="w-full">
                  <FileImage className="mr-2 h-4 w-4" />
                  Bukti Pelunasan
                </Button>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

type TDialog = {
  value: TPelunasanPinjaman;
};

function DialogAction({ value }: TDialog) {
  const [isPending, startTranssition] = React.useTransition();

  const onSubmit = (action: StatusPelunasanPinjamanType) => {
    startTranssition(() => {
      updatePelunasan({
        noPelunasanPinjaman: value.noPelunasanPinjaman,
        pinjamanId: value.pinjamanId,
        angsuranKePelunasanPinjaman: value.angsuranKePelunasanPinjaman,
        jumlahPelunasanPinjaman: Number(value.jumlahPelunasanPinjaman),
        action,
      }).then((data) => {
        if (data.ok) {
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      });
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="w-full">
          <Pencil className="mr-2 h-4 w-4" />
          Options
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Options Pengajuan Pinjaman</DialogTitle>
          <DialogDescription>
            Mohon tinjau pengajuan pinjaman ini. Jika sesuai dengan kebijakan,
            Anda dapat memilih Accept untuk menyetujui atau Reject untuk
            menolak.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-sm text-muted-foreground">
              Tanggal Pengajuan
            </Label>
            <div className="text-base font-medium">
              {formatDatebyMonth(value.tanggalPelunasanPinjaman)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">
                No Anggota
              </Label>
              <div className="text-base font-medium">{value.noAnggota}</div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Nama</Label>
              <div className="text-base font-medium">{value.namaAnggota}</div>
            </div>
          </div>

          <div>
            <Label className="text-sm text-muted-foreground">Unit Kerja</Label>
            <div className="text-base font-medium">{value.namaUnitKerja}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">
                No Pinjaman
              </Label>
              <div className="text-base font-medium">{value.pinjamanId}</div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">
                Angsuran Ke
              </Label>
              <div className="text-base font-medium">
                {value.angsuranKePelunasanPinjaman}
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm text-muted-foreground">
              Metode Pembayaran
            </Label>
            <div className="text-base font-medium">
              {value.jenisPelunasanPinjaman}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">
                Total Bayar
              </Label>
              <div className="text-base font-medium text-green-600">
                {formatToIDR(Number(value.sudahDibayarkan))}
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">
                Sisa Pelunasan
              </Label>
              <div className="text-base font-medium text-red-600">
                {formatToIDR(Number(value.jumlahPelunasanPinjaman))}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="destructive"
            onClick={() => onSubmit("REJECTED")}
            disabled={isPending}
          >
            Reject
          </Button>
          <Button onClick={() => onSubmit("APPROVED")} disabled={isPending}>
            Accept
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
          <DialogTitle>Detail Pelunasan Pinjaman</DialogTitle>
          <DialogDescription>
            Informasi lengkap mengenai metode, jumlah, dan riwayat pelunasan
            pinjaman.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-sm text-muted-foreground">
              Tanggal Pengajuan
            </Label>
            <div className="text-base font-medium">
              {formatDatebyMonth(value.tanggalPelunasanPinjaman)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">
                No Anggota
              </Label>
              <div className="text-base font-medium">{value.noAnggota}</div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Nama</Label>
              <div className="text-base font-medium">{value.namaAnggota}</div>
            </div>
          </div>

          <div>
            <Label className="text-sm text-muted-foreground">Unit Kerja</Label>
            <div className="text-base font-medium">{value.namaUnitKerja}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">
                No Pinjaman
              </Label>
              <div className="text-base font-medium">{value.pinjamanId}</div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">
                Angsuran Ke
              </Label>
              <div className="text-base font-medium">
                {value.angsuranKePelunasanPinjaman}
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm text-muted-foreground">
              Metode Pembayaran
            </Label>
            <div className="text-base font-medium">
              {value.jenisPelunasanPinjaman}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">
                Total Bayar
              </Label>
              <div className="text-base font-medium text-green-600">
                {formatToIDR(Number(value.sudahDibayarkan))}
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">
                Sisa Pelunasan
              </Label>
              <div className="text-base font-medium text-red-600">
                {formatToIDR(Number(value.jumlahPelunasanPinjaman))}
              </div>
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
