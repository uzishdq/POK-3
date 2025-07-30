"use client";
import { TAnggota } from "@/lib/types/anggota";
import { TJabatan } from "@/lib/types/jabatan";
import { TUnitKerja } from "@/lib/types/unit-kerja";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ProfileSchema } from "@/lib/schema/schema-profile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BANK, DEFAULT_LOGIN_REDIRECT, GENDER, PEKERJAAN } from "@/lib/constan";
import InputCurrency from "@/components/ui/input-currency";
import { toast } from "sonner";
import { updateProfile } from "@/lib/server/action/action-profile";

interface IProfileForm {
  data: TAnggota;
  jabatan: TJabatan[] | null;
  unitKerja: TUnitKerja[] | null;
}

export default function ProfileForm({
  data,
  jabatan,
  unitKerja,
}: IProfileForm) {
  const [isPending, startTranssition] = React.useTransition();

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      nikAnggota: data.nikAnggota,
      nipAnggota: data.nipAnggota ? data.nipAnggota : "",
      namaAnggota: data.namaAnggota,
      tanggalLahirAnggota: data.tanggalLahirAnggota.toString(),
      tempatLahirAnggota: data.tempatLahirAnggota,
      jenisKelaminAnggota: data.jenisKelaminAnggota,
      alamatAnggota: data.alamatAnggota,
      noTelpAnggota: data.noTelpAnggota,
      statusPekerjaan: data.statusPekerjaan,
      jabatanId: data.jabatanId,
      unitKerjaId: data.unitKerjaId,
      bankAnggota: data.bankAnggota,
      rekeningAnggota: data.rekeningAnggota,
      pilihanSukamana: data.pilihanSukamana ? Number(data.pilihanSukamana) : 0,
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof ProfileSchema>) => {
    startTranssition(() => {
      updateProfile(values).then((data) => {
        if (data.ok) {
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      });
    });
  };
  return (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle>Data Anggota</CardTitle>
        <CardDescription>
          Pastikan data Anda sudah benar. Jika sudah sesuai, tidak perlu
          mengedit atau mengubahnya.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="nikAnggota"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No.KTP</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="nipAnggota"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NIP {"(Nomor Induk Pegawai)"}</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>
                        Tidak wajib untuk mengisi nomor induk pegawai.
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="namaAnggota"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="jabatanId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jabatan</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih Jabatan Anda" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {jabatan
                            ? jabatan.map((item, index) => (
                                <SelectItem
                                  key={index}
                                  value={item.noJabatan.toString()}
                                >
                                  {item.namaJabatan}
                                </SelectItem>
                              ))
                            : null}
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
                  name="unitKerjaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit Kerja</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih Unit Kerja Anda" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {unitKerja
                            ? unitKerja.map((item, index) => (
                                <SelectItem
                                  key={index}
                                  value={item.noUnitKerja.toString()}
                                >
                                  {item.namaUnitKerja}
                                </SelectItem>
                              ))
                            : null}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="tempatLahirAnggota"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tempat Lahir</FormLabel>
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
                  name="tanggalLahirAnggota"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Tanggal Lahir</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="jenisKelaminAnggota"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jenis Kelamin</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih Jenis Kelamin Anda" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {GENDER.map((item, index) => (
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
                  name="statusPekerjaan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status Pekerjaan</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih Status Pekerjaan Anda" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PEKERJAAN.map((item, index) => (
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
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="bankAnggota"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Bank</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih Bank Anda" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {BANK.map((item, index) => (
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
                  name="rekeningAnggota"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Rekening</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="noTelpAnggota"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No Telp</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="pilihanSukamana"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pilihan Simpanan Sukamana</FormLabel>
                      <FormControl>
                        <InputCurrency
                          name="pilihanSukamana"
                          control={form.control}
                        />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>
                        Tidak wajib untuk mengisi pilihan simpanan sukamana.
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="alamatAnggota"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Silakan isi alamat Anda di sini"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-x-4 space-y-4">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Loading..." : "Simpan"}
              </Button>
              <Button variant="secondary" asChild>
                <Link href={DEFAULT_LOGIN_REDIRECT}>Kembali</Link>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
