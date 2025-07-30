"use client";

import * as z from "zod";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TValidasiPelunasanData } from "@/lib/types/pelunasan-pinjaman";
import { createPelunasanPinjaman } from "@/lib/schema/schema-pelunasan";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CardDetailPelunasanPinjaman from "@/components/card/card-detail-pelunasan-pinjaman";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { jenisPelunasanPinjaman } from "@/lib/constan";
import { insertPelunasan } from "@/lib/server/action/action-pelunasan";
import { toast } from "sonner";

interface IFormPengajuanPelunasan {
  data: NonNullable<TValidasiPelunasanData>;
}

export default function FormPengajuanPelunasan({
  data,
}: IFormPengajuanPelunasan) {
  const [isPending, startTranssition] = React.useTransition();

  const form = useForm<z.infer<typeof createPelunasanPinjaman>>({
    resolver: zodResolver(createPelunasanPinjaman),
    defaultValues: {
      pinjamanId: data.noPinjaman,
      jenisPelunasanPinjaman: undefined,
      buktiPelunasan: undefined,
      angsuranKePelunasanPinjaman: data.angsuranKe,
      sudahDibayarkan: data.totalBayar,
      jumlahPelunasanPinjaman: data.pelunasan,
    },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof createPelunasanPinjaman>) => {
    startTranssition(() => {
      insertPelunasan(values).then((data) => {
        if (data.ok) {
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CardDetailPelunasanPinjaman result={data} />
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="jenisPelunasanPinjaman"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cara Pembayaran</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih Cara Pembayaran" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {jenisPelunasanPinjaman.map((item, index) => (
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
            name="buktiPelunasan"
            render={({ field: { value, ...fieldValues } }) => (
              <FormItem>
                <FormLabel>Bukti Pelunasan / Transfer</FormLabel>
                <FormControl>
                  <Input
                    {...fieldValues}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      fieldValues.onChange(file);
                    }}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>jpg/jpeg/png & maks 2MB</FormDescription>
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Loading..." : "Ajukan Pelunasan Pinjaman"}
        </Button>
      </form>
    </Form>
  );
}
