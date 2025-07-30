"use client";
import { TJabatan } from "@/lib/types/jabatan";
import { TMaster } from "@/lib/types/master";
import { TUnitKerja } from "@/lib/types/unit-kerja";

import * as z from "zod";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MasterSchema,
  MasterUpdateOrDeleteSchema,
} from "@/lib/schema/schema-master";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GENDER, PEKERJAAN } from "@/lib/constan";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FormModal from "../form-modal";
import {
  deleteMaster,
  insertMaster,
  updateMaster,
} from "@/lib/server/action/action-master";
import { toast } from "sonner";

interface MasterFormProps {
  values?: TMaster;
  jabatan?: TJabatan[];
  unitkerja?: TUnitKerja[];
}

function FormMaster({ values, jabatan, unitkerja }: MasterFormProps) {
  const [isPending, startTranssition] = React.useTransition();

  const form = useForm<z.infer<typeof MasterSchema>>({
    resolver: zodResolver(MasterSchema),
    defaultValues: {
      nikMaster: "",
      nipMaster: "",
      namaMaster: "",
      tanggalLahirMaster: "",
      tempatLahirMaster: "",
      jenisKelaminMaster: undefined,
      alamatMaster: "",
      statusPekerjaan: undefined,
      jabatanId: undefined,
      unitKerjaId: undefined,
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof MasterSchema>) => {
    startTranssition(() => {
      insertMaster(values).then((data) => {
        if (data.ok) {
          form.reset();
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      });
    });
  };
  return (
    <FormModal
      buttonLabel="Tambah Data"
      title="Tambah Data Master"
      desc="Menambahkan data baru pada untuk karyawan yayasan al ghifari"
      className="h-5/6"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="nipMaster"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIP {"(Nomor Induk Pegawai)"}</FormLabel>
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
              name="nikMaster"
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
              name="namaMaster"
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
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="tempatLahirMaster"
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
              name="tanggalLahirMaster"
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
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="jenisKelaminMaster"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Kelamin</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih Jenis Kelamin" />
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
              name="alamatMaster"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Silakan isi alamat di sini"
                      className="resize-none"
                      {...field}
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
                        <SelectValue placeholder="Pilih Status Pekerjaan" />
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
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="jabatanId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jabatan</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih Jabatan" />
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
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih Unit Kerja" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {unitkerja
                        ? unitkerja.map((item, index) => (
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
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Loading..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </FormModal>
  );
}

function FormMasterUpdate({ values, jabatan, unitkerja }: MasterFormProps) {
  const [isPending, startTranssition] = React.useTransition();

  const form = useForm<z.infer<typeof MasterUpdateOrDeleteSchema>>({
    resolver: zodResolver(MasterUpdateOrDeleteSchema),
    defaultValues: {
      idMaster: values?.idMaster,
      nikMaster: values?.nikMaster,
      nipMaster: values?.nipMaster ? values.nipMaster : "",
      namaMaster: values?.namaMaster,
      tanggalLahirMaster: values?.tanggalLahirMaster,
      tempatLahirMaster: values?.tempatLahirMaster,
      jenisKelaminMaster: values?.jenisKelaminMaster,
      alamatMaster: values?.alamatMaster,
      statusPekerjaan: values?.statusPekerjaan,
      jabatanId: values?.jabatanId,
      unitKerjaId: values?.unitKerjaId,
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof MasterUpdateOrDeleteSchema>) => {
    startTranssition(() => {
      updateMaster(values).then((data) => {
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
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="nipMaster"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NIP {"(Nomor Induk Pegawai)"}</FormLabel>
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
            name="nikMaster"
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
            name="namaMaster"
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
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="tempatLahirMaster"
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
            name="tanggalLahirMaster"
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
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="jenisKelaminMaster"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jenis Kelamin</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih Jenis Kelamin" />
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
            name="alamatMaster"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alamat</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Silakan isi alamat di sini"
                    className="resize-none"
                    {...field}
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
                      <SelectValue placeholder="Pilih Status Pekerjaan" />
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
        <DialogFooter>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Loading..." : "Simpan"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

function FormMasterDelete({ values, jabatan, unitkerja }: MasterFormProps) {
  const [isPending, startTranssition] = React.useTransition();

  const form = useForm<z.infer<typeof MasterUpdateOrDeleteSchema>>({
    resolver: zodResolver(MasterUpdateOrDeleteSchema),
    defaultValues: {
      idMaster: values?.idMaster,
      nikMaster: values?.nikMaster,
      nipMaster: values?.nipMaster ? values.nipMaster : "",
      namaMaster: values?.namaMaster,
      tanggalLahirMaster: values?.tanggalLahirMaster,
      tempatLahirMaster: values?.tempatLahirMaster,
      jenisKelaminMaster: values?.jenisKelaminMaster,
      alamatMaster: values?.alamatMaster,
      statusPekerjaan: values?.statusPekerjaan,
      jabatanId: values?.jabatanId,
      unitKerjaId: values?.unitKerjaId,
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof MasterUpdateOrDeleteSchema>) => {
    startTranssition(() => {
      deleteMaster(values).then((data) => {
        if (data.ok) {
          form.reset();
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
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="nikMaster"
            render={({ field }) => (
              <FormItem>
                <FormLabel>No.KTP</FormLabel>
                <FormControl>
                  <Input {...field} type="number" readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="namaMaster"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama</FormLabel>
                <FormControl>
                  <Input {...field} type="text" readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="tempatLahirMaster"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tempat Lahir</FormLabel>
                <FormControl>
                  <Input {...field} type="text" readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="jenisKelaminMaster"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jenis Kelamin</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full" disabled>
                      <SelectValue placeholder="Pilih Jenis Kelamin" />
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
                    <SelectTrigger className="w-full" disabled>
                      <SelectValue placeholder="Pilih Status Pekerjaan" />
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
        <DialogFooter>
          <Button type="submit" disabled={isPending} variant="destructive">
            {isPending ? "Loading..." : "Hapus"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export { FormMaster, FormMasterUpdate, FormMasterDelete };
