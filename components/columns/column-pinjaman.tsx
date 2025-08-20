"use client";

import React from "react";
import { TAngsuran, TPinjaman } from "@/lib/types/pinjaman";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  ArrowUpDown,
  FileDown,
  FileImage,
  FileText,
  MoreHorizontal,
  Pencil,
  ReceiptText,
} from "lucide-react";
import { formatDatebyMonth, formatToIDR } from "@/lib/helper";
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
import Link from "next/link";
import { JenisPinjamanType, StatusPinjamanType } from "@/lib/types/helper";
import { updateStatusPinjaman } from "@/lib/server/action/action-pinjaman";
import { toast } from "sonner";
import { ROUTES } from "@/lib/constan";
import { BadgeCustom } from "./badge-custom";
import { TLaporanPinjaman } from "@/lib/types/laporan";

export const columnPinjamanPetugas: ColumnDef<TPinjaman>[] = [
  {
    accessorKey: "noAnggota",
    header: "No Anggota",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("noAnggota")}</div>
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
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("namaUnitKerja")}</div>
    ),
  },
  {
    accessorKey: "noPinjaman",
    header: "No Pinjaman",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("noPinjaman")}</div>
    ),
  },
  {
    accessorKey: "tanggalPinjaman",
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
      const formattedDate = formatDatebyMonth(row.getValue("tanggalPinjaman"));
      return <div className="capitalize">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "jenisPinjman",
    header: "Jenis",
    enableHiding: false,
    cell: ({ row }) => (
      <BadgeCustom
        value={row.getValue("jenisPinjman")}
        category="jenisPinjaman"
      />
    ),
  },
  {
    accessorKey: "ajuanPinjaman",
    header: "Jumlah Pinjaman",
    enableHiding: false,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("ajuanPinjaman"));
      return <div className="font-semibold">{formatted}</div>;
    },
  },
  {
    accessorKey: "waktuPengembalian",
    header: "Tenor",
    cell: ({ row }) => {
      return (
        <div className="font-semibold">
          {row.getValue("waktuPengembalian")} Bulan
        </div>
      );
    },
  },
  {
    accessorKey: "statusPinjaman",
    header: "Status",
    cell: ({ row }) => (
      <BadgeCustom
        value={row.getValue("statusPinjaman")}
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

      const isPending = dataRows.statusPinjaman === "PENDING";
      const isCompleted = dataRows.statusPinjaman === "COMPLETED";

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

            {isPending ? (
              <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                <DialogAction value={dataRows} />
              </DropdownMenuItem>
            ) : (
              <>
                <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                  <DialogDetail value={dataRows} />
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href={ROUTES.AUTH.PETUGAS.PINJAMAN.ANGSURAN_ANGGOTA(
                      dataRows.noPinjaman
                    )}
                    target="_blank"
                    className="w-full"
                  >
                    <Button size="icon" variant="ghost" className="w-full">
                      <FileText className="mr-2 h-4 w-4" />
                      Angsuran
                    </Button>
                  </Link>
                </DropdownMenuItem>
              </>
            )}

            {!isCompleted && (
              <>
                <DropdownMenuItem>
                  <Link
                    href={row.original.strukGaji}
                    target="_blank"
                    className="w-full"
                  >
                    <Button size="icon" variant="ghost" className="w-full">
                      <FileImage className="mr-2 h-4 w-4" />
                      Struk Gaji
                    </Button>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href={ROUTES.AUTH.PETUGAS.PINJAMAN.SURAT_PINJAMAN(
                      dataRows.noPinjaman
                    )}
                    target="_blank"
                    className="w-full"
                  >
                    <Button size="icon" variant="ghost" className="w-full">
                      <FileDown className="mr-2 h-4 w-4" />
                      Surat Pinjaman
                    </Button>
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

type TDialog = {
  value: TPinjaman;
};

function DialogAction({ value }: TDialog) {
  const [isPending, startTranssition] = React.useTransition();

  const onSubmit = (
    action: StatusPinjamanType,
    jenisPinjaman: JenisPinjamanType
  ) => {
    startTranssition(() => {
      updateStatusPinjaman({
        pinjamanId: value.noPinjaman,
        noAnggota: value.noAnggota,
        jenisPinjaman: jenisPinjaman,
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">
                Unit Kerja
              </Label>
              <div className="text-base font-medium">{value.namaUnitKerja}</div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">No.Telp</Label>
              <div className="text-base font-medium">{value.noTelp}</div>
            </div>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">
              Bank / Rekening
            </Label>
            <div className="text-base font-medium">
              {value.bank} / {value.rek}
            </div>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">
              Tujuan Pinjaman
            </Label>
            <div className="text-base font-medium">{value.tujuanPinjaman}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">
                Pinjaman Yang Diajukan
              </Label>
              <div className="text-base font-medium">
                {formatToIDR(
                  value.ajuanPinjaman ? Number(value.ajuanPinjaman) : null
                )}
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">
                Penghasilan / Bulan
              </Label>
              <div className="text-base font-medium">
                {formatToIDR(
                  value.jumlahPenghasilan
                    ? Number(value.jumlahPenghasilan)
                    : null
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Tenor</Label>
              <div className="text-base font-medium">
                {value.waktuPengembalian} Bulan
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">
                Pinjaman Diterima
              </Label>
              <div className="text-base font-medium">
                {formatToIDR(
                  value.jumlahDiterima ? Number(value.jumlahDiterima) : null
                )}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="destructive"
            onClick={() => onSubmit("REJECTED", value.jenisPinjman)}
            disabled={isPending}
          >
            Reject
          </Button>
          <Button
            onClick={() => onSubmit("APPROVED", value.jenisPinjman)}
            disabled={isPending}
          >
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
          <DialogTitle>Detail Pengajuan Pinjaman</DialogTitle>
          <DialogDescription>
            Informasi lengkap terkait pengajuan pinjaman, termasuk jumlah,
            jenis, dan tanggal pengajuan.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">
                Unit Kerja
              </Label>
              <div className="text-base font-medium">{value.namaUnitKerja}</div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">No.Telp</Label>
              <div className="text-base font-medium">{value.noTelp}</div>
            </div>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">
              Bank / Rekening
            </Label>
            <div className="text-base font-medium">
              {value.bank} / {value.rek}
            </div>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">
              Tujuan Pinjaman
            </Label>
            <div className="text-base font-medium">{value.tujuanPinjaman}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">
                Pinjaman Yang Diajukan
              </Label>
              <div className="text-base font-medium">
                {formatToIDR(
                  value.ajuanPinjaman ? Number(value.ajuanPinjaman) : null
                )}
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">
                Penghasilan / Bulan
              </Label>
              <div className="text-base font-medium">
                {formatToIDR(
                  value.jumlahPenghasilan
                    ? Number(value.jumlahPenghasilan)
                    : null
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Tenor</Label>
              <div className="text-base font-medium">
                {value.waktuPengembalian} Bulan
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">
                Pinjaman Diterima
              </Label>
              <div className="text-base font-medium">
                {formatToIDR(
                  value.jumlahDiterima ? Number(value.jumlahDiterima) : null
                )}
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

export const columnPinjaman: ColumnDef<TPinjaman>[] = [
  {
    accessorKey: "noAnggota",
    header: "No Anggota",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("noAnggota")}</div>
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
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("namaUnitKerja")}</div>
    ),
  },
  {
    accessorKey: "noPinjaman",
    header: "No Pinjaman",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("noPinjaman")}</div>
    ),
  },
  {
    accessorKey: "tanggalPinjaman",
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
      const formattedDate = formatDatebyMonth(row.getValue("tanggalPinjaman"));
      return <div className="capitalize">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "jenisPinjman",
    header: "Jenis",
    enableHiding: false,
    cell: ({ row }) => (
      <BadgeCustom
        value={row.getValue("jenisPinjman")}
        category="jenisPinjaman"
      />
    ),
  },
  {
    accessorKey: "ajuanPinjaman",
    header: "Jumlah Pinjaman",
    enableHiding: false,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("ajuanPinjaman"));
      return <div className="font-semibold">{formatted}</div>;
    },
  },
  {
    accessorKey: "waktuPengembalian",
    header: "Tenor",
    cell: ({ row }) => {
      return (
        <div className="font-semibold">
          {row.getValue("waktuPengembalian")} Bulan
        </div>
      );
    },
  },
  {
    accessorKey: "statusPinjaman",
    header: "Status",
    cell: ({ row }) => (
      <BadgeCustom
        value={row.getValue("statusPinjaman")}
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
      const isPending = dataRows.statusPinjaman === "PENDING";
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
            {isPending ? (
              <DropdownMenuItem>
                <Link
                  href={row.original.strukGaji}
                  target="_blank"
                  className="w-full"
                >
                  <Button size="icon" variant="ghost" className="w-full">
                    <FileImage className="mr-2 h-4 w-4" />
                    Struk Gaji
                  </Button>
                </Link>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem>
                <Link
                  href={ROUTES.AUTH.USER.PINJAMAN.ANGSURAN(dataRows.noPinjaman)}
                  target="_blank"
                  className="w-full"
                >
                  <Button size="icon" variant="ghost" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Angsuran
                  </Button>
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const columnAngsuran: ColumnDef<TAngsuran>[] = [
  {
    accessorKey: "pinjamanId",
    header: "No Pinjaman",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("pinjamanId")}</div>
    ),
  },
  {
    accessorKey: "noAngsuran",
    header: "No Angsuran",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("noAngsuran")}</div>
    ),
  },
  {
    accessorKey: "tanggalAngsuran",
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
      const formattedDate = formatDatebyMonth(row.getValue("tanggalAngsuran"));
      return <div className="capitalize">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "angsuranPinjamanKe",
    header: "Angsuran Ke / Bulan",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">
        {row.original.angsuranPinjamanKe} / {row.original.angsuranPinjamanDari}{" "}
        bulan
      </div>
    ),
  },
  {
    accessorKey: "jumlahAngsuran",
    header: "Jumlah Angsuran",
    enableHiding: false,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("jumlahAngsuran"));
      return <div className="font-semibold">{formatted}</div>;
    },
  },
  {
    accessorKey: "statusAngsuran",
    header: "Status",
    cell: ({ row }) => (
      <BadgeCustom
        value={row.getValue("statusAngsuran")}
        category="statusPinjaman"
      />
    ),
  },
];

export const columnLaporanPinjaman: ColumnDef<TLaporanPinjaman>[] = [
  {
    accessorKey: "noAnggota",
    header: "No Anggota",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("noAnggota")}</div>
    ),
  },
  {
    accessorKey: "nama",
    header: "Nama",
    enableHiding: false,
    cell: ({ row }) => <div className="capitalize">{row.getValue("nama")}</div>,
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
    accessorKey: "noPinjaman",
    header: "No Pinjaman",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("noPinjaman")}</div>
    ),
  },
  {
    accessorKey: "jenisPinjman",
    header: "Jenis",
    cell: ({ row }) => (
      <BadgeCustom
        value={row.getValue("jenisPinjman")}
        category="jenisPinjaman"
      />
    ),
  },
  {
    accessorKey: "akad",
    header: "Akad",
    enableHiding: false,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("akad"));
      return <div className="font-semibold">{formatted}</div>;
    },
  },
  {
    accessorKey: "ajuanPinjaman",
    header: "Jumlah Pinjaman",
    enableHiding: false,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("ajuanPinjaman"));
      return <div className="font-semibold">{formatted}</div>;
    },
  },

  {
    accessorKey: "tanggalPinjaman",
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
      const formattedDate = formatDatebyMonth(row.getValue("tanggalPinjaman"));
      return <div className="capitalize">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "waktuPengembalian",
    header: "Angsuran Ke",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("waktuPengembalian")}</div>
    ),
  },

  {
    accessorKey: "pokokMasuk",
    header: "Pokok Masuk",
    enableHiding: false,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("pokokMasuk"));
      return <div className="font-semibold">{formatted}</div>;
    },
  },
  {
    accessorKey: "jasaMasuk",
    header: "Jasa Masuk",
    enableHiding: false,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("jasaMasuk"));
      return <div className="font-semibold">{formatted}</div>;
    },
  },
  {
    accessorKey: "sisaPokok",
    header: "Sisa Pokok",
    enableHiding: false,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("sisaPokok"));
      return <div className="font-semibold">{formatted}</div>;
    },
  },
  {
    accessorKey: "statusPinjaman",
    header: "Status Pinjaman",
    cell: ({ row }) => (
      <BadgeCustom
        value={row.getValue("statusPinjaman")}
        category="statusPinjaman"
      />
    ),
  },
];
