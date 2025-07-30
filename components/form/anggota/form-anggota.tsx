"use client";
import { TAnggotaUser } from "@/lib/types/anggota";
import React from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AnggotaUpdateOrDeleteSchema } from "@/lib/schema/schema-anggota";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLE, STATUS_ANGGOTA } from "@/lib/constan";
import { Input } from "@/components/ui/input";
import { updateAnggota } from "@/lib/server/action/action-anggota";

interface FormAnggota {
  values: TAnggotaUser;
}

function FormUpdateAnggota({ values }: FormAnggota) {
  const [isPending, startTranssition] = React.useTransition();

  const form = useForm<z.infer<typeof AnggotaUpdateOrDeleteSchema>>({
    resolver: zodResolver(AnggotaUpdateOrDeleteSchema),
    defaultValues: {
      noAnggota: values.noAnggota,
      idUser: values.idUser,
      statusAnggota: values.statusAnggota,
      role: values.role,
    },
    mode: "onChange",
  });

  const onUpdate = (values: z.infer<typeof AnggotaUpdateOrDeleteSchema>) => {
    startTranssition(() => {
      updateAnggota(values).then((data) => {
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
            name="statusAnggota"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status Anggota</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih Status Anggota" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {STATUS_ANGGOTA.map((item, index) => (
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
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role Anggota</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih Role Anggota" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ROLE.map((item, index) => (
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

export { FormUpdateAnggota };
