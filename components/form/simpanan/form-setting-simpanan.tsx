"use client";
import React from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PembagianSimpananSchema,
  SettingSimpananSchema,
  SettingSimpananUpdateOrDeleteSchema,
} from "@/lib/schema/schema-simpanan";
import FormModal from "../form-modal";
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
import {
  JENIS_SIMPANAN_BERJANGKA,
  ROUTES,
  STATUS_SIMPANAN_BERJANGKA,
} from "@/lib/constan";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  deleteSettingSimpananBerjangka,
  insertSettingSimpananBerjangka,
  pembagianSimpanan,
  updateSettingSimpananBerjangka,
} from "@/lib/server/action/action-simpanan";
import { toast } from "sonner";
import { TSettingSimpanan } from "@/lib/types/setting-simpanan";

interface FormSettingSimpananProps {
  values: TSettingSimpanan;
}

function FormSettingSimpanan() {
  const [isPending, startTranssition] = React.useTransition();

  const form = useForm<z.infer<typeof SettingSimpananSchema>>({
    resolver: zodResolver(SettingSimpananSchema),
    defaultValues: {
      namaPendaftaran: "",
      jenisPendaftaranSimpanan: undefined,
      tanggalTutupSimpanan: "",
      tanggalAwalSimpanan: "",
      tanggalAkhirSimpanan: "",
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof SettingSimpananSchema>) => {
    startTranssition(() => {
      insertSettingSimpananBerjangka(values).then((data) => {
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
      title="Tambah Pendaftaran Simpanan"
      desc="Menambahkan data Pendaftaran Simpanan"
      className="h-fit"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="namaPendaftaran"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Pendaftaran</FormLabel>
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
              name="jenisPendaftaranSimpanan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Simpanan</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih Jenis Simpanan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {JENIS_SIMPANAN_BERJANGKA.map((item, index) => (
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
              name="tanggalTutupSimpanan"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Tutup Pendaftaran</FormLabel>
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
              name="tanggalAwalSimpanan"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Awal Simpanan</FormLabel>
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
              name="tanggalAkhirSimpanan"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Akhir Simpanan</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
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

function FormUpdateSettingSimpanan({ values }: FormSettingSimpananProps) {
  const [isPending, startTranssition] = React.useTransition();

  const form = useForm<z.infer<typeof SettingSimpananUpdateOrDeleteSchema>>({
    resolver: zodResolver(SettingSimpananUpdateOrDeleteSchema),
    defaultValues: {
      idSettingPendaftaran: values.idSettingPendaftaran,
      namaPendaftaran: values.namaPendaftaran,
      jenisPendaftaranSimpanan: values.jenisPendaftaranSimpanan,
      tanggalTutupSimpanan: values.tanggalTutupSimpanan,
      tanggalAwalSimpanan: values.tanggalAwalSimpanan,
      tanggalAkhirSimpanan: values.tanggalAkhirSimpanan,
      statusPendaftaranSimpanan: values.statusPendaftaranSimpanan,
    },
    mode: "onChange",
  });

  const onUpdate = (
    values: z.infer<typeof SettingSimpananUpdateOrDeleteSchema>
  ) => {
    startTranssition(() => {
      updateSettingSimpananBerjangka(values).then((data) => {
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
      <form onSubmit={form.handleSubmit(onUpdate)} className="space-y-4">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="namaPendaftaran"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Pendaftaran</FormLabel>
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
            name="jenisPendaftaranSimpanan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jenis Simpanan</FormLabel>
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
                    {JENIS_SIMPANAN_BERJANGKA.map((item, index) => (
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
            name="tanggalTutupSimpanan"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tanggal Tutup Pendaftaran</FormLabel>
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
            name="tanggalAwalSimpanan"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tanggal Awal Simpanan</FormLabel>
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
            name="tanggalAkhirSimpanan"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tanggal Akhir Simpanan</FormLabel>
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
            name="statusPendaftaranSimpanan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status Simpanan</FormLabel>
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
                    {STATUS_SIMPANAN_BERJANGKA.map((item, index) => (
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
            {isPending ? "Loading..." : "Update"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

function FormDeleteSettingSimpanan({ values }: FormSettingSimpananProps) {
  const [isPending, startTranssition] = React.useTransition();

  const form = useForm<z.infer<typeof SettingSimpananUpdateOrDeleteSchema>>({
    resolver: zodResolver(SettingSimpananUpdateOrDeleteSchema),
    defaultValues: {
      idSettingPendaftaran: values.idSettingPendaftaran,
      namaPendaftaran: values.namaPendaftaran,
      jenisPendaftaranSimpanan: values.jenisPendaftaranSimpanan,
      tanggalTutupSimpanan: values.tanggalTutupSimpanan,
      tanggalAwalSimpanan: values.tanggalAwalSimpanan,
      tanggalAkhirSimpanan: values.tanggalAkhirSimpanan,
      statusPendaftaranSimpanan: values.statusPendaftaranSimpanan,
    },
    mode: "onChange",
  });

  const onDelete = (
    values: z.infer<typeof SettingSimpananUpdateOrDeleteSchema>
  ) => {
    startTranssition(() => {
      deleteSettingSimpananBerjangka(values).then((data) => {
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
      <form onSubmit={form.handleSubmit(onDelete)} className="space-y-4">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="namaPendaftaran"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Pendaftaran</FormLabel>
                <FormControl>
                  <Input {...field} type="text" readOnly disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="jenisPendaftaranSimpanan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jenis Simpanan</FormLabel>
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
                    {JENIS_SIMPANAN_BERJANGKA.map((item, index) => (
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
            name="tanggalAwalSimpanan"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tanggal Awal Simpanan</FormLabel>
                <FormControl>
                  <Input {...field} type="date" readOnly disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="tanggalAkhirSimpanan"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tanggal Akhir Simpanan</FormLabel>
                <FormControl>
                  <Input {...field} type="date" readOnly disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <Button type="submit" variant="destructive" disabled={isPending}>
            {isPending ? "Loading..." : "Delete"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

interface IFormPembagianSimpanan {
  idSettingPendaftaran: string;
}

function FormPembagianSimpanan({
  idSettingPendaftaran,
}: IFormPembagianSimpanan) {
  const [isPending, startTranssition] = React.useTransition();

  const form = useForm<z.infer<typeof PembagianSimpananSchema>>({
    resolver: zodResolver(PembagianSimpananSchema),
    defaultValues: {
      id: idSettingPendaftaran,
      basil: "",
      tanggalPembagian: "",
    },
    mode: "onChange",
  });

  const handleSimulasi = () => {
    const rawValues = form.getValues();

    const parsed = PembagianSimpananSchema.safeParse(rawValues);

    if (!parsed.success) {
      // Jika gagal validasi, trigger error di form
      parsed.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        form.setError(fieldName as any, { message: issue.message });
      });
      return;
    }

    const { tanggalPembagian, ...filteredData } = parsed.data;
    const query = new URLSearchParams(filteredData).toString();

    const url = ROUTES.AUTH.PETUGAS.SIMPANAN.PEMBAGIAN_SIMPANAN(query);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const onSubmit = (values: z.infer<typeof PembagianSimpananSchema>) => {
    startTranssition(() => {
      pembagianSimpanan(values).then((data) => {
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
            name="basil"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Basil</FormLabel>
                <FormControl>
                  <div className="flex w-full items-center space-x-2">
                    <Input type="number" {...field} />
                    <span>%</span>
                  </div>
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Basil sebagai persentase. Contoh: 0.3 berarti 0.3%
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tanggalPembagian"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tanggal Transfer</FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <Button
            type="button"
            disabled={isPending}
            variant="secondary"
            onClick={handleSimulasi}
          >
            {isPending ? "Loading..." : "Tampilkan Simulasi"}
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Loading..." : "Kirim"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export {
  FormSettingSimpanan,
  FormUpdateSettingSimpanan,
  FormDeleteSettingSimpanan,
  FormPembagianSimpanan,
};
