"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { TAsuransi } from "@/lib/types/asuransi";
import { formatDatebyMonth, formatToIDR } from "@/lib/helper";
import { BadgeCustom } from "./badge-custom";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";

export const columnAsuransiPetugas: ColumnDef<TAsuransi>[] = [
  {
    accessorKey: "noAsuransi",
    header: "No Asuransi",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("noAsuransi")}</div>
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
    accessorKey: "usiaAsuransi",
    header: "Usia",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("usiaAsuransi")}</div>
    ),
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
    accessorKey: "tanggalAsuransi",
    enableHiding: false,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tanggal Awal Asuransi
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const formattedDate = formatDatebyMonth(row.getValue("tanggalAsuransi"));
      return <div className="capitalize">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "tanggalAkhirAsuransi",
    header: "Tanggal Akhir Asuransi",
    enableHiding: false,
    cell: ({ row }) => {
      const formattedDate = formatDatebyMonth(
        row.getValue("tanggalAkhirAsuransi")
      );
      return <div className="capitalize">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "masaAsuransiTH",
    header: "TH",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("masaAsuransiTH")}</div>
    ),
  },
  {
    accessorKey: "masaAsuransiBL",
    header: "BL",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("masaAsuransiBL")}</div>
    ),
  },
  {
    accessorKey: "masaAsuransiJK",
    header: "JK",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("masaAsuransiJK")}</div>
    ),
  },
  {
    accessorKey: "UP",
    header: "UP",
    enableHiding: false,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("UP"));
      return <div className="capitalize">{formatted}</div>;
    },
  },
  {
    accessorKey: "statusPinjaman",
    header: "Status",
    enableHiding: false,
    cell: ({ row }) => (
      <BadgeCustom
        value={row.getValue("statusPinjaman")}
        category="statusPinjaman"
      />
    ),
  },
  {
    accessorKey: "premi",
    header: "Jumlah Premi",
    enableHiding: false,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("premi"));
      return <div className="font-semibold">{formatted}</div>;
    },
  },
];
