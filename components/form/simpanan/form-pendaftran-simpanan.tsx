/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { TSettingSimpanan } from "@/lib/types/setting-simpanan";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  PendaftaranSimpananPetugasSchema,
  PendaftaranSimpananSchema,
  UpdatePendaftaranSimpananSchema,
} from "@/lib/schema/schema-simpanan";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import InputCurrency from "@/components/ui/input-currency";
import {
  insertPendaftaranSimpanan,
  insertPendaftaranSimpananPetugas,
  updatePendaftaranSimpanan,
} from "@/lib/server/action/action-simpanan";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { TAnggotaTrx } from "@/lib/types/anggota";
import CustomSelect from "@/components/ui/custom-select";

interface FormPendaftaranSimpananProps {
  data: TSettingSimpanan;
}

function FormPendaftranSimpanan({ data }: FormPendaftaranSimpananProps) {
  const [isPending, startTranssition] = React.useTransition();

  const form = useForm<z.infer<typeof PendaftaranSimpananSchema>>({
    resolver: zodResolver(PendaftaranSimpananSchema),
    defaultValues: {
      settingPendaftaranId: data.idSettingPendaftaran,
      jenisSimpanan: data.jenisPendaftaranSimpanan,
      jumlahPilihan: 0,
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof PendaftaranSimpananSchema>) => {
    startTranssition(() => {
      insertPendaftaranSimpanan(values).then((data) => {
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
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bottom-0 right-0 mb-4 mr-4 w-full md:absolute md:w-auto xl:w-auto"
        >
          Daftar Simpanan {data.jenisPendaftaranSimpanan}
        </Button>
      </DialogTrigger>
      <DialogContent className="h-auto overflow-auto sm:max-w-[425px]">
        <DialogHeader className="mb-5">
          <DialogTitle>{data.namaPendaftaran}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="jumlahPilihan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Jumlah Simpanan {data.jenisPendaftaranSimpanan}
                    </FormLabel>
                    <FormControl>
                      <InputCurrency
                        name="jumlahPilihan"
                        control={form.control}
                      />
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
      </DialogContent>
    </Dialog>
  );
}

interface FormPendaftaranSimpananPetugasProps {
  data: TSettingSimpanan;
  anggota: TAnggotaTrx[];
}

function FormPendaftranSimpananPetugas({
  data,
  anggota,
}: FormPendaftaranSimpananPetugasProps) {
  const [isPending, startTranssition] = React.useTransition();

  const form = useForm<z.infer<typeof PendaftaranSimpananPetugasSchema>>({
    resolver: zodResolver(PendaftaranSimpananPetugasSchema),
    defaultValues: {
      settingPendaftaranId: data.idSettingPendaftaran,
      jenisSimpanan: data.jenisPendaftaranSimpanan,
      jumlahPilihan: 0,
    },
    mode: "onChange",
  });

  const onSubmit = (
    values: z.infer<typeof PendaftaranSimpananPetugasSchema>,
  ) => {
    startTranssition(() => {
      insertPendaftaranSimpananPetugas(values).then((data) => {
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
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">
          <UserPlus className="h-4 w-4" />
          <span className="hidden sm:inline">Tambah Pendaftar</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="h-auto overflow-auto sm:max-w-[425px]">
        <DialogHeader className="mb-5">
          <DialogTitle>{data.namaPendaftaran}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                name="jumlahPilihan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Jumlah Simpanan {data.jenisPendaftaranSimpanan}
                    </FormLabel>
                    <FormControl>
                      <InputCurrency
                        name="jumlahPilihan"
                        control={form.control}
                      />
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
      </DialogContent>
    </Dialog>
  );
}

interface FormUpdatePendaftranSimpananProps {
  idPendaftar: string;
  jumlah: number;
}

function FormUpdatePendaftranSimpanan({
  idPendaftar,
  jumlah,
}: FormUpdatePendaftranSimpananProps) {
  const [isPending, startTranssition] = React.useTransition();

  const form = useForm<z.infer<typeof UpdatePendaftaranSimpananSchema>>({
    resolver: zodResolver(UpdatePendaftaranSimpananSchema),
    defaultValues: {
      idPendaftar: idPendaftar,
      jumlahPilihan: jumlah,
    },
    mode: "onChange",
  });

  const onSubmit = (
    values: z.infer<typeof UpdatePendaftaranSimpananSchema>,
  ) => {
    startTranssition(() => {
      updatePendaftaranSimpanan(values).then((data) => {
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
            name="jumlahPilihan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jumlah Simpanan</FormLabel>
                <FormControl>
                  <InputCurrency name="jumlahPilihan" control={form.control} />
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
  );
}

export {
  FormPendaftranSimpanan,
  FormPendaftranSimpananPetugas,
  FormUpdatePendaftranSimpanan,
};
