"use client";

import { TMaster } from "@/lib/types/master";
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
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { FormMasterDelete, FormMasterUpdate } from "../form/master/form-maste";
import { formatDatebyMonth } from "@/lib/helper";

export const columnMaster: ColumnDef<TMaster>[] = [
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => <div>{row.getValue("username")}</div>,
  },
  {
    accessorKey: "nipMaster",
    header: "Nip",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("nipMaster")}</div>
    ),
  },
  {
    accessorKey: "nikMaster",
    header: "No.KTP",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("nikMaster")}</div>
    ),
  },
  {
    accessorKey: "namaMaster",
    header: "Nama",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("namaMaster")}</div>
    ),
  },
  {
    accessorKey: "tempatLahirMaster",
    header: "Tempat Lahir",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("tempatLahirMaster")}</div>
    ),
  },
  {
    accessorKey: "tanggalLahirMaster",
    header: "Tanggal Lahir",
    enableHiding: false,
    cell: ({ row }) => {
      const formattedDate = formatDatebyMonth(
        row.getValue("tanggalLahirMaster")
      );
      return <div className="capitalize">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "jenisKelaminMaster",
    header: "Jenis Kelamin",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("jenisKelaminMaster")}</div>
    ),
  },
  {
    accessorKey: "statusPekerjaan",
    header: "Status Pekerjaan",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("statusPekerjaan")}</div>
    ),
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
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="text-center">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <DialogEdit value={dataRows} />
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <DialogDelete value={dataRows} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

type TDialog = {
  value: TMaster;
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
      <DialogContent className="overflow-auto sm:max-w-[425px] h-5/6">
        <DialogHeader>
          <DialogTitle>Edit Karyawan Yayasan</DialogTitle>
          <DialogDescription>
            Buat perubahan pada data karyawan yayasan di sini. Klik simpan
            setelah selesai.
          </DialogDescription>
        </DialogHeader>
        <FormMasterUpdate values={value} />
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
          <DialogTitle>Hapus Karyawan Yayasan</DialogTitle>
          <DialogDescription>
            Yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
            Klik Hapus untuk melanjutkan.
          </DialogDescription>
        </DialogHeader>
        <FormMasterDelete values={value} />
      </DialogContent>
    </Dialog>
  );
}
