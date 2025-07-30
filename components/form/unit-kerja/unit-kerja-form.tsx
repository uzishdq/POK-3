"use client";
import * as z from "zod";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TUnitKerja } from "@/lib/types/unit-kerja";
import {
  UnitKerjaSchema,
  UnitKerjaUpdateOrDeleteSchema,
} from "@/lib/schema/schema-unit-kerja";
import { toast } from "sonner";
import FormModal from "../form-modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteUnitKerja,
  insertUnitKerja,
  updateUnitKerja,
} from "@/lib/server/action/action-unit-kerja";

interface UnitKerjaFormProps {
  values: TUnitKerja;
}

function UnitKerjaForm() {
  const [isPending, startTranssition] = React.useTransition();

  const form = useForm<z.infer<typeof UnitKerjaSchema>>({
    resolver: zodResolver(UnitKerjaSchema),
    defaultValues: {
      namaUnitKerja: "",
      alamatUnitKerja: "",
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof UnitKerjaSchema>) => {
    startTranssition(() => {
      insertUnitKerja(values).then((data) => {
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
      title="Tambah Data Unit Kerja"
      desc="Menambahkan data baru pada unit kerja / unit garapan yayasan al ghifari"
      className="h-fit"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="namaUnitKerja"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit Kerja</FormLabel>
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
              name="alamatUnitKerja"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Silakan isi alamat unit kerja di sini"
                      className="resize-none"
                      {...field}
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
    </FormModal>
  );
}

function UnitKerjaUpdateForm({ values }: UnitKerjaFormProps) {
  const [isPending, startTranssition] = React.useTransition();

  const form = useForm<z.infer<typeof UnitKerjaUpdateOrDeleteSchema>>({
    resolver: zodResolver(UnitKerjaUpdateOrDeleteSchema),
    defaultValues: {
      noUnitKerja: values.noUnitKerja,
      namaUnitKerja: values.namaUnitKerja,
      alamatUnitKerja: values.alamatUnitKerja,
    },
    mode: "onChange",
  });

  const onUpdate = (values: z.infer<typeof UnitKerjaUpdateOrDeleteSchema>) => {
    startTranssition(() => {
      updateUnitKerja(values).then((data) => {
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
      <form onSubmit={form.handleSubmit(onUpdate)} className="space-y-4">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="namaUnitKerja"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit Kerja</FormLabel>
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
            name="alamatUnitKerja"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alamat</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Silakan isi alamat unit kerja di sini"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
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

function UnitKerjaDeleteForm({ values }: UnitKerjaFormProps) {
  const [isPending, startTranssition] = React.useTransition();

  const form = useForm<z.infer<typeof UnitKerjaUpdateOrDeleteSchema>>({
    resolver: zodResolver(UnitKerjaUpdateOrDeleteSchema),
    defaultValues: {
      noUnitKerja: values.noUnitKerja,
      namaUnitKerja: values.namaUnitKerja,
      alamatUnitKerja: values.alamatUnitKerja,
    },
    mode: "onChange",
  });

  const onDelete = (values: z.infer<typeof UnitKerjaUpdateOrDeleteSchema>) => {
    startTranssition(() => {
      deleteUnitKerja(values).then((data) => {
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
            name="namaUnitKerja"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit Kerja</FormLabel>
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
            name="alamatUnitKerja"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alamat</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Silakan isi alamat unit kerja di sini"
                    className="resize-none"
                    readOnly
                    {...field}
                  />
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

export { UnitKerjaForm, UnitKerjaUpdateForm, UnitKerjaDeleteForm };
