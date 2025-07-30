"use client";

import React from "react";
import { formatDatebyMonth, formatToIDR } from "@/lib/helper";
import { TSimpananUser } from "@/lib/types/setting-simpanan";
import {
  TPengambilanSimpanan,
  TPengambilanSimpananById,
  TSimpananAnggota,
  TSimpananBerjangka,
} from "@/lib/types/simpanan";
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
import { ArrowUpDown, FileDown, ListCollapse, MoreHorizontal, Pencil } from "lucide-react";
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
import { StatusPengambilanSimpananType } from "@/lib/types/helper";
import { ROUTES } from "@/lib/constan";
import { updatePengambilanSimpanan } from "@/lib/server/action/action-simpanan";
import { toast } from "sonner";
import { BadgeCustom } from "./badge-custom";
import {
  TDetailLaporanSimpananBerjangka,
  TLaporanSimpananBerjangka,
} from "@/lib/types/laporan";
import { FormUpdatePendaftranSimpanan } from "../form/simpanan/form-pendaftran-simpanan";

export const columnSimpananUser: ColumnDef<TSimpananUser>[] = [
  {
    accessorKey: "noSimpanan",
    header: "No Simpanan",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("noSimpanan")}</div>
    ),
  },
  {
    accessorKey: "noAnggota",
    header: "No Anggota",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("noAnggota")}</div>
    ),
  },
      {
    accessorKey: "tanggalSimpanan",
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
      const formattedDate = formatDatebyMonth(row.getValue("tanggalSimpanan"));
      return <div className="capitalize">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "jenisSimpanan",
    header: "Jenis",
    enableHiding: false,
    cell: ({ row }) => (
      <BadgeCustom
        value={row.getValue("jenisSimpanan")}
        category="jenisSimpanan"
      />
    ),
  },
  {
    accessorKey: "jumlahSimpanan",
    header: "Jumlah",
    enableHiding: false,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("jumlahSimpanan"));
      return <div className="font-semibold">{formatted}</div>;
    },
  },
];

export const columnPengambilanSimpananUser: ColumnDef<TPengambilanSimpananById>[] =
  [
    {
      accessorKey: "noPengambilanSimpanan",
      header: "No Pengambilan Simpanan",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue("noPengambilanSimpanan")}
        </div>
      ),
    },
    {
      accessorKey: "noAnggota",
      header: "No Anggota",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("noAnggota")}</div>
      ),
    },
        {
        accessorKey: "tanggalPengambilanSimpanan",
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
          const formattedDate = formatDatebyMonth(row.getValue("tanggalPengambilanSimpanan"));
          return <div className="capitalize">{formattedDate}</div>;
        },
      },
    {
      accessorKey: "jenisPengambilanSimpanan",
      header: "Jenis",
      enableHiding: false,
      cell: ({ row }) => (
        <BadgeCustom
          value={row.getValue("jenisPengambilanSimpanan")}
          category="jenisSimpanan"
        />
      ),
    },
    {
      accessorKey: "statusPengambilanSimpanan",
      header: "Status",
      enableHiding: false,
      cell: ({ row }) => (
        <BadgeCustom
          value={row.getValue("statusPengambilanSimpanan")}
          category="statusPengambilanSimpanan"
        />
      ),
    },
    {
      accessorKey: "jumlahPengambilanSimpanan",
      header: "Jumlah",
      enableHiding: false,
      cell: ({ row }) => {
        const formatted = formatToIDR(
          row.getValue("jumlahPengambilanSimpanan")
        );
        return <div className="font-semibold">{formatted}</div>;
      },
    },
  ];

export const columnPengambilanSimpananPetugas: ColumnDef<TPengambilanSimpanan>[] =
  [
    {
      accessorKey: "noPengambilanSimpanan",
      header: "No Pengambilan Simpanan",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue("noPengambilanSimpanan")}
        </div>
      ),
    },
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
        accessorKey: "tanggalPengambilanSimpanan",
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
          const formattedDate = formatDatebyMonth(row.getValue("tanggalPengambilanSimpanan"));
          return <div className="capitalize">{formattedDate}</div>;
        },
      },
    {
      accessorKey: "jenisPengambilanSimpanan",
      header: "Jenis",
      enableHiding: false,
      cell: ({ row }) => (
        <BadgeCustom
          value={row.getValue("jenisPengambilanSimpanan")}
          category="jenisSimpanan"
        />
      ),
    },
    {
      accessorKey: "statusPengambilanSimpanan",
      header: "Status",
      enableHiding: false,
      cell: ({ row }) => (
        <BadgeCustom
          value={row.getValue("statusPengambilanSimpanan")}
          category="statusPengambilanSimpanan"
        />
      ),
    },
    {
      accessorKey: "jumlahPengambilanSimpanan",
      header: "Jumlah",
      enableHiding: false,
      cell: ({ row }) => {
        const formatted = formatToIDR(
          row.getValue("jumlahPengambilanSimpanan")
        );
        return <div className="font-semibold">{formatted}</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const dataRows = row.original;
        const isPending = dataRows.statusPengambilanSimpanan === "PENDING";
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
              {isPending && (
                <>
                  <DropdownMenuItem
                    asChild
                    onSelect={(e) => e.preventDefault()}
                  >
                    <DialogAction value={dataRows} />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem>
                <Link
                  href={ROUTES.AUTH.PETUGAS.SIMPANAN.STRUK_PENGAMBILAN_SIMPANAN(
                    dataRows.noPengambilanSimpanan
                  )}
                  target="_blank"
                  className="w-full"
                >
                  <Button size="icon" variant="ghost" className="w-full h-5">
                    <FileDown className="mr-2 h-4 w-4" />
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
  value: TPengambilanSimpanan;
};

function DialogAction({ value }: TDialog) {
  const [isPending, startTranssition] = React.useTransition();

  const onSubmit = (action: StatusPengambilanSimpananType) => {
    startTranssition(() => {
      updatePengambilanSimpanan({
        noPengambilanSimpanan: value.noPengambilanSimpanan,
        noAnggota: value.noAnggota,
        jenisPengambilanSimpanan: value.jenisPengambilanSimpanan,
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
          <DialogTitle>Options Pengambilan Simpanan</DialogTitle>
          <DialogDescription>
            Mohon tinjau pengambilan simpanan ini. Jika sesuai dengan kebijakan,
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">
                Jenis Simpanan
              </Label>
              <div className="text-base font-medium">
                {value.jenisPengambilanSimpanan}
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Jumlah</Label>
              <div className="text-base font-medium">
                {formatToIDR(
                  value.jumlahPengambilanSimpanan
                    ? Number(value.jumlahPengambilanSimpanan)
                    : null
                )}
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

export const columnSimpananBerjangka: ColumnDef<TSimpananBerjangka>[] = [
  {
    accessorKey: "noAnggota",
    header: "No Anggota",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("noAnggota")}</div>
    ),
  },
  {
    accessorKey: "namaPendaftaran",
    header: "Nama Pendaftaran",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("namaPendaftaran")}</div>
    ),
  },
    {
    accessorKey: "tanggalPendaftaran",
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
      const formattedDate = formatDatebyMonth(row.getValue("tanggalPendaftaran"));
      return <div className="capitalize">{formattedDate}</div>;
    },
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
    accessorKey: "jumlahPilihan",
    header: "Jumlah",
    enableHiding: false,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("jumlahPilihan"));
      return <div className="font-semibold">{formatted}</div>;
    },
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
              <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                <DialogSimpananBerjangkaAction value={dataRows} />
              </DropdownMenuItem>
            )}
            {!isOpen && (
              <DropdownMenuItem>
                <Link
                  href={ROUTES.AUTH.USER.SIMPANAN.STRUK_SIMPANAN_BERJANGKA(
                    dataRows.idPendaftar
                  )}
                  target="_blank"
                >
                  Struk Simpanan
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

type TDialogSimpananBerjangka = {
  value: TSimpananBerjangka;
};

function DialogSimpananBerjangkaAction({ value }: TDialogSimpananBerjangka) {
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
          <DialogTitle>Perbarui Jumlah Simpanan</DialogTitle>
          <DialogDescription>
            Mengubah jumlah simpanan untuk {value.namaPendaftaran}
          </DialogDescription>
          <div className="mt-4">
            <FormUpdatePendaftranSimpanan
              idPendaftar={value.idPendaftar}
              jumlah={Number(value.jumlahPilihan)}
            />
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export const columnSimpananPetugas: ColumnDef<TSimpananAnggota>[] = [
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
    accessorKey: "wajib",
    header: "Wajib",
    enableHiding: false,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("wajib"));
      return <div className="capitalize">{formatted}</div>;
    },
  },
  {
    accessorKey: "manasuka",
    header: "Sukamana",
    enableHiding: false,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("manasuka"));
      return <div className="capitalize">{formatted}</div>;
    },
  },
  {
    accessorKey: "lebaran",
    header: "Lebaran",
    enableHiding: false,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("lebaran"));
      return <div className="capitalize">{formatted}</div>;
    },
  },
  {
    accessorKey: "qurban",
    header: "Qurban",
    enableHiding: false,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("qurban"));
      return <div className="capitalize">{formatted}</div>;
    },
  },
  {
    accessorKey: "ubar",
    header: "Ubar",
    enableHiding: false,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("ubar"));
      return <div className="capitalize">{formatted}</div>;
    },
  },
  {
    accessorKey: "totalTaking",
    header: "Jumlah Penarikan",
    enableHiding: false,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("totalTaking"));
      return <div className="font-semibold text-red-600">- {formatted}</div>;
    },
  },
  {
    accessorKey: "totalBalance",
    header: "Saldo",
    enableHiding: false,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("totalBalance"));
      return <div className="font-semibold text-green-600">{formatted}</div>;
    },
  },
];

export const columnLaporanSimpananBerjangka: ColumnDef<TLaporanSimpananBerjangka>[] =
  [
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
      accessorKey: "jenisSimpanan",
      header: "Jenis",
      enableHiding: false,
      cell: ({ row }) => (
        <BadgeCustom
          value={row.getValue("jenisSimpanan")}
          category="jenisSimpanan"
        />
      ),
    },
    {
      accessorKey: "totalPengambilan",
      header: "Jumlah Pengambilan",
      enableHiding: false,
      cell: ({ row }) => {
        const formatted = formatToIDR(row.getValue("totalPengambilan"));
        return <div className="font-semibold text-red-600">- {formatted}</div>;
      },
    },
    {
      accessorKey: "totalSimpanan",
      header: "Jumlah Tabungan",
      enableHiding: false,
      cell: ({ row }) => {
        const formatted = formatToIDR(row.getValue("totalSimpanan"));
        return <div className="font-semibold text-green-600">{formatted}</div>;
      },
    },
    {
      accessorKey: "basil",
      header: "Basil",
      enableHiding: false,
      cell: ({ row }) => {
        const formatted = formatToIDR(row.getValue("basil"));
        return <div className="capitalize">{formatted}</div>;
      },
    },
    {
      accessorKey: "totalDenganBasil",
      header: "Tabungan + basil",
      enableHiding: false,
      cell: ({ row }) => {
        const formatted = formatToIDR(row.getValue("totalDenganBasil"));
        return <div className="capitalize">{formatted}</div>;
      },
    },
    {
      accessorKey: "admin",
      header: "Admin",
      enableHiding: false,
      cell: ({ row }) => {
        const formatted = formatToIDR(row.getValue("admin"));
        return <div className="capitalize">{formatted}</div>;
      },
    },
    {
      accessorKey: "tabunganBersih",
      header: "Tabungan Bersih",
      enableHiding: false,
      cell: ({ row }) => {
        const formatted = formatToIDR(row.getValue("tabunganBersih"));
        return <div className="font-semibold">{formatted}</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const dataRows = row.original.simpanan;
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
              <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                <DetailLaporanDialog value={dataRows} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

type TDetailLaporanDialog = {
  value: TDetailLaporanSimpananBerjangka[];
};

function DetailLaporanDialog({ value }: TDetailLaporanDialog) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="w-full">
          <ListCollapse className="mr-2 h-4 w-4" />
          Detail Simpanan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Detail Simpanan Anggota</DialogTitle>
          <DialogDescription>
            Menampilkan informasi mengenai bulan dan jumlah simpanan anggota.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {value.length === 0 ? (
            <div className="text-muted-foreground py-4 text-center">
              Tidak ada data untuk ditampilkan.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {value.map((item, index) => (
                <div key={index}>
                  <Label className="text-sm text-muted-foreground">
                    {item.bulan}
                  </Label>
                  <div className="text-base font-medium">
                    {formatToIDR(item.total)}
                  </div>
                </div>
              ))}
            </div>
          )}
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
