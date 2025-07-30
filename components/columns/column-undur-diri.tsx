"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { TUndurDiri } from "@/lib/types/undur-diri";
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
import { Button } from "../ui/button";
import { ArrowUpDown, MoreHorizontal, Pencil, ReceiptText } from "lucide-react";
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
import { ROUTES } from "@/lib/constan";
import { updateStatusPengunduran } from "@/lib/server/action/action-undur-diri";
import { toast } from "sonner";
import { StatusPengunduranType } from "@/lib/types/helper";

export const columnUndurDiriPetugas: ColumnDef<TUndurDiri>[] = [
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
    accessorKey: "noPengunduranDiri",
    header: "No Pengunduran",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("noPengunduranDiri")}</div>
    ),
  },
      {
    accessorKey: "tanggalPengunduranDiri",
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
      const formattedDate = formatDatebyMonth(row.getValue("tanggalPengunduranDiri"));
      return <div className="capitalize">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "jumlahSimpananBersih",
    header: "Jumlah Tabungan",
    enableHiding: false,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("jumlahSimpananBersih"));
      return <div className="font-semibold">{formatted}</div>;
    },
  },
  {
    accessorKey: "jumlahSimpananDiterima",
    header: "Tabungan Bersih Diterima",
    enableHiding: false,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("jumlahSimpananDiterima"));
      return <div className="font-semibold text-red-600">{formatted}</div>;
    },
  },
  {
    accessorKey: "statusPengunduranDiri",
    header: "Status",
    cell: ({ row }) => (
      <BadgeCustom
        value={row.getValue("statusPengunduranDiri")}
        category="statusPinjaman"
      />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const dataRow = row.original;
      const isPending = dataRow.statusPengunduranDiri === "PENDING";

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
                <DialogAction data={dataRow} />
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
              <DialogDetail data={dataRow} />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href={ROUTES.AUTH.PETUGAS.SURAT_UNDUR_DIRI(
                  row.original.noPengunduranDiri
                )}
                target="_blank"
                className="w-full"
              >
                <Button size="icon" variant="ghost" className="w-full">
                  <ReceiptText className="mr-2 h-4 w-4" />
                  Surat
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
  data: TUndurDiri;
};

function DialogAction({ data }: TDialog) {
  const isMinus = Number(data.jumlahSimpananDiterima) < 0;
  const [isPending, startTranssition] = React.useTransition();

  const onSubmit = (action: StatusPengunduranType) => {
    startTranssition(() => {
      updateStatusPengunduran({
        noPengunduran: data.noPengunduranDiri,
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
          <DialogTitle>Options Pengunduran Diri</DialogTitle>
          <DialogDescription>
            Mohon tinjau pengunduran diri ini. Jika sesuai dengan kebijakan,
            Anda dapat memilih Accept untuk menyetujui atau Reject untuk
            menolak.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Detail Simpanan */}
          <div>
            <h3 className="text-base font-semibold mb-2">Detail Simpanan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.simpanan.map((item, index) => (
                <div key={index}>
                  <Label className="text-sm text-muted-foreground">
                    {item.jenisSimpananPengunduran}
                  </Label>
                  <div className="text-base font-medium">
                    {formatToIDR(Number(item.jumlahSimpananPengunduran))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detail pinjaman */}
          {data.pinjaman.length > 0 &&
            data.pinjaman.map((item, index) => (
              <div key={index}>
                <h3 className="text-base font-semibold mb-2">
                  Detail Pinjaman{" "}
                  {item.jenisPinjmanPengunduranDiri.toLowerCase()}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      No Pinjaman
                    </Label>
                    <div className="text-base font-medium">
                      {item.pinjamanId}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Angsuran ke / dari
                    </Label>
                    <div className="text-base font-medium">
                      {item.angsuranKe} / {item.angsuranDari}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Total Sudah Dibayar
                    </Label>
                    <div className="text-base font-medium">
                      {formatToIDR(Number(item.jumlahSudahBayar))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Total Pelunasan (Termasuk Biaya Pelanti)
                    </Label>
                    <div className="text-base font-bold text-red-600">
                      - {formatToIDR(Number(item.jumlahPelunasan))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

          {/* Detail Administrasi */}
          <div>
            <h3 className="text-base font-semibold mb-2">
              Detail Administrasi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">
                  Biaya Administrasi
                </Label>
                <div className="text-base font-bold text-red-600">
                  - {formatToIDR(25000)}
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  {isMinus ? "Sisa Kewajiban" : "Tabungan Bersih Diterima"}
                </Label>
                <div
                  className={`text-base font-bold ${
                    isMinus ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {formatToIDR(Number(data.jumlahSimpananDiterima))}
                </div>
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

function DialogDetail({ data }: TDialog) {
  const isMinus = Number(data.jumlahSimpananDiterima) < 0;
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
          <DialogTitle>Detail Simpanan & Pinjaman</DialogTitle>
          <DialogDescription>
            Informasi lengkap terkait hak dan kewajiban anggota
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Detail Simpanan */}
          <div>
            <h3 className="text-base font-semibold mb-2">Detail Simpanan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.simpanan.map((item, index) => (
                <div key={index}>
                  <Label className="text-sm text-muted-foreground">
                    {item.jenisSimpananPengunduran}
                  </Label>
                  <div className="text-base font-medium">
                    {formatToIDR(Number(item.jumlahSimpananPengunduran))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detail pinjaman */}
          {data.pinjaman.length > 0 &&
            data.pinjaman.map((item, index) => (
              <div key={index}>
                <h3 className="text-base font-semibold mb-2">
                  Detail Pinjaman{" "}
                  {item.jenisPinjmanPengunduranDiri.toLowerCase()}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      No Pinjaman
                    </Label>
                    <div className="text-base font-medium">
                      {item.pinjamanId}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Angsuran ke / dari
                    </Label>
                    <div className="text-base font-medium">
                      {item.angsuranKe} / {item.angsuranDari}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Total Sudah Dibayar
                    </Label>
                    <div className="text-base font-medium">
                      {formatToIDR(Number(item.jumlahSudahBayar))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Total Pelunasan (Termasuk Biaya Pelanti)
                    </Label>
                    <div className="text-base font-bold text-red-600">
                      - {formatToIDR(Number(item.jumlahPelunasan))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

          {/* Detail Administrasi */}
          <div>
            <h3 className="text-base font-semibold mb-2">
              Detail Administrasi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">
                  Biaya Administrasi
                </Label>
                <div className="text-base font-bold text-red-600">
                  - {formatToIDR(25000)}
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  {isMinus ? "Sisa Kewajiban" : "Tabungan Bersih Diterima"}
                </Label>
                <div
                  className={`text-base font-bold ${
                    isMinus ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {formatToIDR(Number(data.jumlahSimpananDiterima))}
                </div>
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
