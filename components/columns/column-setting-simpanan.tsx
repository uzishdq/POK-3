"use client";

import { formatDatebyMonth, formatToIDR } from "@/lib/helper";
import {
  TPendaftaranSimpanan,
  TSettingSimpanan,
} from "@/lib/types/setting-simpanan";
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
  MoreHorizontal,
  Pencil,
  Send,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  FormDeleteSettingSimpanan,
  FormPembagianSimpanan,
  FormUpdateSettingSimpanan,
} from "../form/simpanan/form-setting-simpanan";
import Link from "next/link";
import { ROUTES } from "@/lib/constan";
import { BadgeCustom } from "./badge-custom";
import FormStatus from "../form/form-status";

export const columnSettingSimpanan: ColumnDef<TSettingSimpanan>[] = [
  {
    accessorKey: "namaPendaftaran",
    header: "Nama Pendaftaran",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("namaPendaftaran")}</div>
    ),
  },
  {
    accessorKey: "jenisPendaftaranSimpanan",
    header: "Jenis",
    enableHiding: false,
    cell: ({ row }) => (
      <BadgeCustom
        value={row.getValue("jenisPendaftaranSimpanan")}
        category="jenisSimpanan"
      />
    ),
  },
  {
    accessorKey: "tanggalTutupSimpanan",
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
        row.getValue("tanggalTutupSimpanan")
      );
      return <div className="capitalize">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "tanggalAwalSimpanan",
    header: "Rentang Waktu Simpanan",
    cell: ({ row }) => {
      const formattedDate1 = formatDatebyMonth(
        row.getValue("tanggalAwalSimpanan")
      );
      const formattedDate2 = formatDatebyMonth(
        row.original.tanggalAkhirSimpanan
      );
      return (
        <div className="capitalize">
          {formattedDate1} - {formattedDate2}
        </div>
      );
    },
  },
  {
    accessorKey: "basilSimpanan",
    header: "Basil",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("basilSimpanan") ?? 0} %</div>
    ),
  },
  {
    accessorKey: "statusPendaftaranSimpanan",
    header: "Status",
    enableHiding: false,
    cell: ({ row }) => (
      <BadgeCustom
        value={row.getValue("statusPendaftaranSimpanan")}
        category="statusPendaftaranSimpanan"
      />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const dataRows = row.original;
      const isOpen = dataRows.statusPendaftaranSimpanan === "OPEN";
      const isPembagian = new Date() > new Date(dataRows.tanggalAkhirSimpanan);

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="text-center">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {isOpen && (
              <>
                {isPembagian && (
                  <DropdownMenuItem
                    asChild
                    onSelect={(e) => e.preventDefault()}
                  >
                    <DialogShare value={dataRows} />
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                  <DialogEdit value={dataRows} />
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <DialogDelete value={dataRows} />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}

            <DropdownMenuItem>
              <Link
                href={ROUTES.AUTH.PETUGAS.SIMPANAN.PENDAFTAR_SIMPANAN(
                  dataRows.idSettingPendaftaran
                )}
                target="_blank"
                className="w-full"
              >
                List Pendaftar
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

type TDialog = {
  value: TSettingSimpanan;
};

function DialogEdit({ value }: TDialog) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="w-full">
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Pendaftaran Simpanan</DialogTitle>
          <DialogDescription>
            Buat perubahan pada Pendaftaran Simpanan di sini. Klik simpan
            setelah selesai.
          </DialogDescription>
        </DialogHeader>
        <FormUpdateSettingSimpanan values={value} />
      </DialogContent>
    </Dialog>
  );
}

function DialogDelete({ value }: TDialog) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="w-full">
          <Trash2 className="mr-2 h-4 w-4" />
          Hapus
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hapus Pendaftaran Simpanan</DialogTitle>
          <DialogDescription>
            Yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
            Klik Hapus untuk melanjutkan atau Batal untuk membatalkan.
          </DialogDescription>
        </DialogHeader>
        <FormDeleteSettingSimpanan values={value} />
      </DialogContent>
    </Dialog>
  );
}

function DialogShare({ value }: TDialog) {
  const isPembagian = new Date() > new Date(value.tanggalAkhirSimpanan);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="w-full">
          <Send className="mr-2 h-4 w-4" />
          Bagikan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pembagian {value.namaPendaftaran}</DialogTitle>
          <DialogDescription>
            Yakin membagikan {value.namaPendaftaran}? Periksa simulasi biaya dan
            basil terlebih dahulu melalui tombol Tampilkan Simulasi.
          </DialogDescription>
        </DialogHeader>
        {isPembagian ? (
          <FormPembagianSimpanan
            idSettingPendaftaran={value.idSettingPendaftaran}
          />
        ) : (
          <FormStatus message="Pembagian hanya dapat dilakukan setelah melewati tanggal akhir simpanan" />
        )}
      </DialogContent>
    </Dialog>
  );
}

export const columnPendaftarSimpanan: ColumnDef<TPendaftaranSimpanan>[] = [
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
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("namaUnitKerja")}</div>
    ),
  },
  {
    accessorKey: "jumlahPilihan",
    header: "Jumlah Simpanan",
    enableHiding: false,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("jumlahPilihan"));
      return <div className="font-semibold">{formatted}</div>;
    },
  },
];
