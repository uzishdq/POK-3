"use client";

import { TAnggotaUser } from "@/lib/types/anggota";
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
import { MoreHorizontal, Pencil, SquareUserRound } from "lucide-react";
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
import { formatToIDR } from "@/lib/helper";
import { FormUpdateAnggota } from "../form/anggota/form-anggota";
import { BadgeCustom } from "./badge-custom";

export const columnAnggota: ColumnDef<TAnggotaUser>[] = [
  {
    accessorKey: "noAnggota",
    header: "No Anggota",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("noAnggota")}</div>
    ),
  },
  {
    accessorKey: "username",
    header: "Username",
    enableHiding: false,
    cell: ({ row }) => <div>{row.getValue("username")}</div>,
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
    accessorKey: "jenisKelaminAnggota",
    header: "Jenis Kelamin",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("jenisKelaminAnggota")}</div>
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
    accessorKey: "statusAnggota",
    header: "Status Anggota",
    enableHiding: false,
    cell: ({ row }) => (
      <BadgeCustom
        value={row.getValue("statusAnggota")}
        category="statusAnggota"
      />
    ),
  },
  {
    accessorKey: "pilihanSukamana",
    header: "Sukamana",
    enableHiding: false,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("pilihanSukamana"));
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
              <DialogEdit value={dataRows} />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <DialogDetail value={dataRows} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

type TDialog = {
  value: TAnggotaUser;
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
          <DialogTitle>Edit Anggota Koperasi</DialogTitle>
          <DialogDescription>
            Buat perubahan pada data status dan role anggota koperasi di sini.
            Klik update setelah selesai.
          </DialogDescription>
        </DialogHeader>
        <FormUpdateAnggota values={value} />
      </DialogContent>
    </Dialog>
  );
}

function DialogDetail({ value }: TDialog) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="w-full">
          <SquareUserRound className="mr-2 h-4 w-4" />
          Detail
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Detail Anggota Koperasi</DialogTitle>
          <DialogDescription>
            Yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
            Klik Hapus untuk melanjutkan.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">
                No.Anggota
              </Label>
              <div className="text-base font-medium">{value.noAnggota}</div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Username</Label>
              <div className="text-base font-medium">{value.username}</div>
            </div>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Nama</Label>
            <div className="text-base font-medium">{value.namaAnggota}</div>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Unit Kerja</Label>
            <div className="text-base font-medium">{value.namaUnitKerja}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">
                Jenis Kelamin
              </Label>
              <div className="text-base font-medium">
                {value.jenisKelaminAnggota}
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">No.Telp</Label>
              <div className="text-base font-medium">{value.noTelpAnggota}</div>
            </div>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">
              Bank / Rekening
            </Label>
            <div className="text-base font-medium">
              {value.bankAnggota} / {value.rekeningAnggota}
            </div>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Sukamana</Label>
            <div className="text-base font-medium">
              {formatToIDR(
                value.pilihanSukamana ? Number(value.pilihanSukamana) : null
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Status</Label>
              <div className="text-base font-medium">{value.statusAnggota}</div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Role</Label>
              <div className="text-base font-medium">{value.role}</div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button variant="secondary">Kembali</Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
