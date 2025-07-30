"use client";
import React from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ICalculateAsuransi, JenisPinjamanOption } from "@/lib/types/pinjaman";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import InputCurrency from "@/components/ui/input-currency";
import { PengajuanPinjamanSchema } from "@/lib/schema/schema-pinjaman";
import {
  insertPinjaman,
  validasiPinjaman,
} from "@/lib/server/action/action-pinjaman";
import { toast } from "sonner";
import CardDetailPengajuanPinjaman from "@/components/card/card-detail-pengajuan-pinjaman";

interface IFormPengajuanPinjaman {
  id: string;
  maxLimit: number;
  jenisPinjaman: JenisPinjamanOption[];
}

export default function FormPengajuanPinjaman({
  id,
  maxLimit,
  jenisPinjaman,
}: IFormPengajuanPinjaman) {
  const [isPending, startTranssition] = React.useTransition();
  const [maxAjuanPinjaman, setMaxAjuanPinjaman] = React.useState(0);
  const [biayaPinjaman, setBiayaPinjaman] =
    React.useState<ICalculateAsuransi | null>(null);
  const [isValid, setIsValid] = React.useState(false);
  const PengajuanPinjamanSchemaForm = PengajuanPinjamanSchema(maxAjuanPinjaman);

  const form = useForm<z.infer<typeof PengajuanPinjamanSchemaForm>>({
    resolver: zodResolver(PengajuanPinjamanSchemaForm),
    defaultValues: {
      noAnggota: id,
      tujuanPinjaman: "",
      waktuPengembalian: 0,
      jenisPinjaman: undefined,
      ajuanPinjaman: 0,
      strukGaji: undefined,
      jumlahPenghasilan: 0,
    },
    mode: "onChange",
  });

  const pilihanPinjaman = form.watch("jenisPinjaman");
  React.useEffect(() => {
    let newMaxLimit = 0;
    switch (pilihanPinjaman) {
      case "PRODUKTIF":
        newMaxLimit = maxLimit;
        break;
      case "BARANG":
        newMaxLimit = maxLimit ? 750000 : 0;
        break;
      default:
        newMaxLimit = 0;
    }
    setMaxAjuanPinjaman(newMaxLimit);
  }, [pilihanPinjaman, maxLimit]);

  const onValidate = (values: z.infer<typeof PengajuanPinjamanSchemaForm>) => {
    startTranssition(() => {
      validasiPinjaman(maxAjuanPinjaman, values).then((data) => {
        setIsValid(data.ok);
        if (data.ok) {
          toast.success(data.message);
          setBiayaPinjaman(data.data);
        } else {
          toast.error(data.message);
        }
      });
    });
  };

  const onSubmit = (values: z.infer<typeof PengajuanPinjamanSchemaForm>) => {
    startTranssition(() => {
      insertPinjaman(maxAjuanPinjaman, values).then((data) => {
        setIsValid(false);
        if (data.ok) {
          form.reset();
          setBiayaPinjaman(null);
          toast.success(data.message);
        } else {
          setBiayaPinjaman(null);
          toast.error(data.message);
        }
      });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">
          PERSYARATAN PINJAMAN KOPERASI KARYAWAN YAYASAN AL GHIFARI
        </CardTitle>
        <ul className="mt-3 list-decimal pl-4 pt-4 text-sm text-muted-foreground">
          <li className="mb-4 text-justify">
            Besaran pinjaman maksimal adalah 15 kali dari jumlah simpanan wajib
            dan manasuka, dengan catatan besaran pinjaman tidak boleh melebihi
            50 juta.
          </li>
          <li className="mb-4 text-justify">
            Besaran pinjaman yang dapat disetujui berdasarkan kemampuan angsuran
            masing-masing anggota perbulan dan ketentuan batasan minimum “Take
            Home Pay” (THP) <b>35%</b> dari Gaji Bersih.
          </li>
          <li className="mb-4 text-justify">Struk Gaji terakhir.</li>

          <li className="mb-2 text-justify">
            Biaya yang dikenakan sekali pada saat penarikan :
          </li>
          <ul className="list-disc pl-4">
            <li className="mb-2 text-justify">
              Biaya administrasi sebesar <b>1%</b> dari jumlah pinjaman.
            </li>
            <li className="mb-2 text-justify">
              Biaya premi asuransi jiwa, dihitung berdasarkan usia dan jangka
              waktu pinjaman.
            </li>
          </ul>
        </ul>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(isValid ? onSubmit : onValidate)}
            className="space-y-4"
          >
            {biayaPinjaman && (
              <CardDetailPengajuanPinjaman data={biayaPinjaman} />
            )}
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
                name="tujuanPinjaman"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tujuan Pinjaman</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="waktuPengembalian"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Waktu Pengembalian</FormLabel>
                    <FormControl>
                      <div className="flex w-full items-center space-x-2">
                        <Input
                          type="number"
                          {...field}
                          value={isNaN(field.value) ? "" : field.value}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                        <span>bulan</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="ajuanPinjaman"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Besaran Pinjaman</FormLabel>
                    <FormControl>
                      <InputCurrency
                        name="ajuanPinjaman"
                        control={form.control}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="strukGaji"
                render={({ field: { value, ...fieldValues } }) => (
                  <FormItem>
                    <FormLabel>Struk Gaji</FormLabel>
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
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="jumlahPenghasilan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Penghasilan Berdasarkan Struk Gaji</FormLabel>
                    <FormControl>
                      <InputCurrency
                        name="jumlahPenghasilan"
                        control={form.control}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full"
              variant={isValid ? "default" : "destructive"}
            >
              {isPending
                ? "Loading..."
                : isValid
                ? "Ajukan Pengajuan Pinjaman"
                : "Cek Pengajuan Pinjaman"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
