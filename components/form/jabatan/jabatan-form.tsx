"use client";
import * as z from "zod";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  JabatanSchema,
  JabatanUpdateOrDeleteSchema,
} from "@/lib/schema/schema-jabatan";
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
import FormModal from "../form-modal";
import { TJabatan } from "@/lib/types/jabatan";
import { toast } from "sonner";
import {
  deleteJabatan,
  insertJabatan,
  updateJabatan,
} from "@/lib/server/action/action-jabatan";

interface JabatanFormProps {
  values: TJabatan;
}

function JabatanForm() {
  const [isPending, startTranssition] = React.useTransition();

  const form = useForm<z.infer<typeof JabatanSchema>>({
    resolver: zodResolver(JabatanSchema),
    defaultValues: {
      namaJabatan: "",
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof JabatanSchema>) => {
    startTranssition(() => {
      insertJabatan(values).then((data) => {
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
      title="Tambah Data Jabatan"
      desc="Menambahkan data baru pada jabatan yayasan al ghifari"
      className="h-fit"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="namaJabatan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jabatan</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
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

function JabatanUpdateForm({ values }: JabatanFormProps) {
  const [isPending, startTranssition] = React.useTransition();

  const form = useForm<z.infer<typeof JabatanUpdateOrDeleteSchema>>({
    resolver: zodResolver(JabatanUpdateOrDeleteSchema),
    defaultValues: {
      noJabatan: values.noJabatan,
      namaJabatan: values.namaJabatan,
    },
    mode: "onChange",
  });

  const onUpdate = (values: z.infer<typeof JabatanUpdateOrDeleteSchema>) => {
    startTranssition(() => {
      updateJabatan(values).then((data) => {
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
            name="namaJabatan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jabatan</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
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

function JabatanDeleteForm({ values }: JabatanFormProps) {
  const [isPending, startTranssition] = React.useTransition();

  const form = useForm<z.infer<typeof JabatanUpdateOrDeleteSchema>>({
    resolver: zodResolver(JabatanUpdateOrDeleteSchema),
    defaultValues: {
      noJabatan: values.noJabatan,
      namaJabatan: values.namaJabatan,
    },
    mode: "onChange",
  });

  const onDelete = (values: z.infer<typeof JabatanUpdateOrDeleteSchema>) => {
    startTranssition(() => {
      deleteJabatan(values).then((data) => {
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
            name="namaJabatan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jabatan</FormLabel>
                <FormControl>
                  <Input {...field} type="text" readOnly />
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

export { JabatanForm, JabatanUpdateForm, JabatanDeleteForm };
