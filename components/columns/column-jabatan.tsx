"use client";

import { TJabatan } from "@/lib/types/jabatan";
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
import {
  JabatanDeleteForm,
  JabatanUpdateForm,
} from "../form/jabatan/jabatan-form";

export const columnJabatan: ColumnDef<TJabatan>[] = [
  {
    accessorKey: "namaJabatan",
    header: "Jabatan",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("namaJabatan")}</div>
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
  value: TJabatan;
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
          <DialogTitle>Edit Jabatan</DialogTitle>
          <DialogDescription>
            Buat perubahan pada data jabatan di sini. Klik update setelah
            selesai.
          </DialogDescription>
        </DialogHeader>
        <JabatanUpdateForm values={value} />
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
          <DialogTitle>Hapus Jabatan</DialogTitle>
          <DialogDescription>
            Yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
            Klik Hapus untuk melanjutkan.
          </DialogDescription>
        </DialogHeader>
        <JabatanDeleteForm values={value} />
      </DialogContent>
    </Dialog>
  );
}
