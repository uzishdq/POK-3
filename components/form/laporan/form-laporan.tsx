"use client";
import * as z from "zod";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  laporanPinjamanSchema,
  laporanSimpananSchema,
} from "@/lib/schema/schema-laporan";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROUTES, STATUS_PINJAMAN } from "@/lib/constan";
import { Button } from "@/components/ui/button";
import {
  findLaporanPinjaman,
  findLaporanSimpananBerjangka,
} from "@/lib/server/action/action-laporan";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import FormStatus from "../form-status";
import { TSettingSimpanan } from "@/lib/types/setting-simpanan";
import { JenisPinjamanOption } from "@/lib/types/pinjaman";

interface ILaporanPinjamanForm {
  status: boolean | undefined;
  message: string | undefined;
  jenisPinjaman: JenisPinjamanOption[];
}

function LaporanPinjamanForm({
  status,
  message,
  jenisPinjaman,
}: ILaporanPinjamanForm) {
  const router = useRouter();
  const [isPending, startTranssition] = React.useTransition();

  const form = useForm<z.infer<typeof laporanPinjamanSchema>>({
    resolver: zodResolver(laporanPinjamanSchema),
    defaultValues: {
      jenisPinjaman: undefined,
      statusPinjaman: undefined,
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof laporanPinjamanSchema>) => {
    startTranssition(() => {
      findLaporanPinjaman(values).then((data) => {
        if (data.ok) {
          form.reset();
          toast.success(data.message);
          const query = new URLSearchParams(values).toString();
          router.push(ROUTES.AUTH.PETUGAS.FIND_LAPORAN(query));
        } else {
          toast.error(data.message);
        }
      });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">
          LAPORAN PINJAMAN ANGGOTA KOPERASI KARYAWAN YAYASAN AL GHIFARI
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormStatus status={status} message={message} />
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="jenisPinjaman"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis Pinjaman</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih Jenis Pinjaman" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {jenisPinjaman.map((item, index) => (
                          <SelectItem key={index} value={item.value}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="statusPinjaman"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status Pinjaman</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih Status Pinjaman" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STATUS_PINJAMAN.map((item, index) => (
                          <SelectItem key={index} value={item.value}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Loading..." : "Cari Data"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

interface ILaporanSimpananBerjangkaForm {
  data: TSettingSimpanan[];
  status: boolean | undefined;
  message: string | undefined;
}

function LaporanSimpananForm({
  status,
  message,
  data,
}: ILaporanSimpananBerjangkaForm) {
  const router = useRouter();
  const [isPending, startTranssition] = React.useTransition();

  const form = useForm<z.infer<typeof laporanSimpananSchema>>({
    resolver: zodResolver(laporanSimpananSchema),
    defaultValues: {
      noPendaftaran: undefined,
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof laporanSimpananSchema>) => {
    startTranssition(() => {
      findLaporanSimpananBerjangka(values).then((data) => {
        if (data.ok) {
          form.reset();
          toast.success(data.message);
          const query = new URLSearchParams(values).toString();
          router.push(ROUTES.AUTH.PETUGAS.FIND_LAPORAN(query));
        } else {
          toast.error(data.message);
        }
      });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">
          LAPORAN SIMPANAN BERJANGKA ANGGOTA KOPERASI KARYAWAN YAYASAN AL
          GHIFARI
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormStatus status={status} message={message} />
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="noPendaftaran"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Simpanan Berjangka</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih Simpanan Berjangka" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {data.map((item, index) => (
                          <SelectItem
                            key={index}
                            value={item.idSettingPendaftaran}
                          >
                            {item.namaPendaftaran}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Loading..." : "Cari Data"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export { LaporanPinjamanForm, LaporanSimpananForm };
