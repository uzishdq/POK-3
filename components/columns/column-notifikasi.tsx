"use client";

import { TGetNotifikasi } from "@/lib/types/notifikasi";
import { ColumnDef } from "@tanstack/react-table";
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
import { ArrowUpDown, MoreHorizontal, SquareUserRound } from "lucide-react";
import { formatDatebyMonth } from "@/lib/helper";
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
import { Textarea } from "../ui/textarea";

function judulPesan(pesan: string): string | null {
  const match = pesan.match(/\*([^*]+)\*/);
  return match ? match[1] : null;
}

export const columnNotifikasi: ColumnDef<TGetNotifikasi>[] = [
  {
    accessorKey: "noTelpNotification",
    header: "No Telp",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("noTelpNotification")}</div>
    ),
  },
  {
    accessorKey: "messageNotification",
    header: "Pesan",
    enableHiding: false,
    cell: ({ row }) => {
      const formattedString = judulPesan(row.getValue("messageNotification"));
      return <div className="capitalize">{formattedString}</div>;
    },
  },
      {
    accessorKey: "tanggalNotification",
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
      const formattedDate = formatDatebyMonth(row.getValue("tanggalNotification"));
      return <div className="capitalize">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "statusNotification",
    header: "Status",
    enableHiding: false,
    cell: ({ row }) => (
      <BadgeCustom
        value={row.getValue("statusNotification")}
        category="statusNotifikasi"
      />
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
  value: TGetNotifikasi;
};

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
          <DialogTitle>Detail Pesan</DialogTitle>
          <DialogDescription>
            Pesan ini dikirim sebagai pemberitahuan untuk anggota
          </DialogDescription>
        </DialogHeader>
        <Textarea
          className="h-48 max-h-56 resize-none"
          placeholder="Type your message here."
          defaultValue={value.messageNotification}
          id={value.idNotification}
        />
        <DialogFooter>
          <DialogTrigger asChild>
            <Button variant="secondary">Kembali</Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
