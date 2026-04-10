/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import * as z from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { TambahPinjamanSchema } from "@/lib/schema/schema-pinjaman";
import { TAnggotaTrx } from "@/lib/types/anggota";
import { ICalculateAsuransi } from "@/lib/types/pinjaman";
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
import CardDetailPengajuanPinjaman from "@/components/card/card-detail-pengajuan-pinjaman";
import { jenisPinjaman } from "@/lib/constan";
import { Input } from "@/components/ui/input";
import InputCurrency from "@/components/ui/input-currency";
import { Button } from "@/components/ui/button";
import CustomSelect from "@/components/ui/custom-select";
import { tambahPinjaman, validasiTambahPinjaman } from "@/lib/server/action/action-pinjaman";
import { toast } from "sonner";
import FormStatus from "../form-status";
import { Switch } from "@/components/ui/switch";

interface FormTambahPinjamanProps {
  anggota: TAnggotaTrx[];
}

export default function FormTambahPinjaman({ anggota }: FormTambahPinjamanProps) {
  const [isPending, startTranssition] = React.useTransition();
  const [maxLimit, setMaxLimit] = React.useState<number>(0);
  const [maxAjuanPinjaman, setMaxAjuanPinjaman] = React.useState<number>(0);
  const [biayaPinjaman, setBiayaPinjaman] = React.useState<ICalculateAsuransi | null>(null);
  const [isValid, setIsValid] = React.useState(false);
  const [validasi, setValidasi] = React.useState<{ ok: boolean; message: string } | null>(null);
  const TambahPinjamanSchemaForm = TambahPinjamanSchema(maxAjuanPinjaman);

  const form = useForm<z.infer<typeof TambahPinjamanSchemaForm>>({
    resolver: zodResolver(TambahPinjamanSchemaForm),
    defaultValues: {
      noAnggota: "",
      tujuanPinjaman: "",
      tanggalPinjaman: new Date().toLocaleDateString("en-CA"),
      waktuPengembalian: 0,
      jenisPinjaman: undefined,
      ajuanPinjaman: 0,
      strukGaji: undefined,
      jumlahPenghasilan: 0,
      isAngsuran: false,
      angsuran: [],
    },
    mode: "onChange",
  });

  const pilihanAnggota = form.watch("noAnggota");
  const pilihanPinjaman = form.watch("jenisPinjaman");

  // Set maxLimit berdasarkan anggota yang dipilih
  React.useEffect(() => {
    if (!pilihanAnggota) {
      setMaxLimit(0);
      setMaxAjuanPinjaman(0);
      setIsValid(false); // ← reset valid
      return;
    }
    const selected = anggota.find((a) => a.noAnggota === pilihanAnggota);
    setMaxLimit(selected?.maxPinjaman ?? 0);
    setIsValid(false); // ← reset valid saat ganti anggota
    form.resetField("jenisPinjaman");
    form.resetField("ajuanPinjaman");
  }, [pilihanAnggota, anggota, form]);

  // Set maxAjuanPinjaman berdasarkan jenis pinjaman
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
    setIsValid(false); // ← reset valid saat ganti jenis pinjaman
    form.resetField("ajuanPinjaman");
  }, [pilihanPinjaman, maxLimit, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "angsuran",
  });

  const isAngsuran = form.watch("isAngsuran");

  const handleRemove = (index: number) => {
    remove(index);
    // re-index setelah hapus
    setTimeout(() => {
      fields.forEach((_, i) => {
        if (i >= index) {
          form.setValue(`angsuran.${i}.keAngsuran`, i + 1);
        }
      });
    }, 0);
  };

  const onValidate = (values: z.infer<typeof TambahPinjamanSchemaForm>) => {
    startTranssition(() => {
      validasiTambahPinjaman(maxAjuanPinjaman, values).then((data) => {
        setIsValid(data.ok);
        if (data.ok) {
          toast.success(data.message);
          setValidasi(data.data?.lastPinjaman ?? null);
          setBiayaPinjaman(data.data);
        } else {
          toast.error(data.message);
        }
      });
    });
  };

  const onSubmit = (values: z.infer<typeof TambahPinjamanSchemaForm>) => {
    startTranssition(() => {
      tambahPinjaman(maxAjuanPinjaman, values).then((data) => {
        setIsValid(false);
        if (data.ok) {
          form.reset();
          setBiayaPinjaman(null);
          setValidasi(null);
          toast.success(data.message);
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
          PERSYARATAN PINJAMAN ANGGOTA KOPERASI KARYAWAN YAYASAN AL GHIFARI
        </CardTitle>
        <ul className="mt-3 list-decimal pl-4 pt-4 text-sm text-muted-foreground">
          <li className="mb-4 text-justify">
            Besaran pinjaman maksimal adalah 15 kali dari jumlah simpanan wajib dan manasuka, dengan
            catatan besaran pinjaman tidak boleh melebihi 50 juta.
          </li>
          <li className="mb-4 text-justify">
            Besaran pinjaman yang dapat disetujui berdasarkan kemampuan angsuran masing-masing
            anggota perbulan dan ketentuan batasan minimum “Take Home Pay” (THP) <b>35%</b> dari
            Gaji Bersih.
          </li>
          <li className="mb-4 text-justify">Struk Gaji terakhir.</li>

          <li className="mb-2 text-justify">Biaya yang dikenakan sekali pada saat penarikan :</li>
          <ul className="list-disc pl-4">
            <li className="mb-2 text-justify">
              Biaya administrasi sebesar <b>1%</b> dari jumlah pinjaman.
            </li>
            <li className="mb-2 text-justify">
              Biaya premi asuransi jiwa, dihitung berdasarkan usia dan jangka waktu pinjaman.
            </li>
          </ul>
        </ul>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(isValid ? onSubmit : onValidate)} className="space-y-4">
            {validasi && <FormStatus status={validasi.ok} message={validasi.message} />}
            {biayaPinjaman && <CardDetailPengajuanPinjaman data={biayaPinjaman} />}

            <CustomSelect
              name="noAnggota"
              label="Anggota"
              control={form.control}
              data={anggota}
              valueKey="noAnggota"
              labelKey="namaAnggota"
              required
            />

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
                name="tanggalPinjaman"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Pinjaman</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
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
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
                      <InputCurrency name="ajuanPinjaman" control={form.control} />
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
                    <FormDescription>jpg/jpeg/png & maks 2MB (opsional)</FormDescription>
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
                      <InputCurrency name="jumlahPenghasilan" control={form.control} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="isAngsuran"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Angsuran</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Apakah pinjaman ini sudah memiliki riwayat angsuran?
                    </p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isAngsuran && (
              <div className="space-y-4">
                {fields.map((item, index) => (
                  <div key={item.id} className="rounded-lg border p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">Angsuran ke-{index + 1}</p>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemove(index)}>
                        Hapus
                      </Button>
                    </div>

                    {/* Tanggal Angsuran */}
                    <FormField
                      control={form.control}
                      name={`angsuran.${index}.tanggalAngsuran`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tanggal Angsuran</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Ke Angsuran */}
                    <FormField
                      control={form.control}
                      name={`angsuran.${index}.keAngsuran`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Angsuran Ke</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              readOnly
                              className="bg-muted cursor-not-allowed"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Jumlah Angsuran */}
                    <FormField
                      control={form.control}
                      name={`angsuran.${index}.jumlahAngsuran`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jumlah Angsuran</FormLabel>
                          <FormControl>
                            <InputCurrency
                              name={`angsuran.${index}.jumlahAngsuran`}
                              control={form.control}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const waktuPengembalian = form.getValues("waktuPengembalian");

                    // Jika waktuPengembalian belum diisi
                    if (!waktuPengembalian) {
                      form.setError("angsuran", {
                        message: "Isi waktu pengembalian terlebih dahulu",
                      });
                      return;
                    }

                    if (fields.length >= waktuPengembalian) {
                      form.setError("angsuran", {
                        message: `Maksimal ${waktuPengembalian} angsuran sesuai waktu pengembalian`,
                      });
                      return;
                    }

                    append({
                      tanggalAngsuran: new Date().toLocaleDateString("en-CA"),
                      keAngsuran: fields.length + 1,
                      jumlahAngsuran: 0,
                    });
                  }}>
                  + Tambah Angsuran
                </Button>
              </div>
            )}

            {form.formState.errors.angsuran && (
              <p className="text-sm text-destructive">{form.formState.errors.angsuran.message}</p>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full"
              variant={isValid ? "default" : "destructive"}>
              {isPending
                ? "Loading..."
                : isValid
                  ? "Tambah Pinjaman Anggota"
                  : "Cek Pengajuan Pinjaman"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
