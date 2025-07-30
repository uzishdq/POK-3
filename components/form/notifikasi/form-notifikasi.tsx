"use client";
import * as z from "zod";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormModal from "../form-modal";
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
import { BulkNotifFormSchema } from "@/lib/schema/schema-notifikasi";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { notifAnggotaAll } from "@/lib/server/action/action-notifikasi";
import { toast } from "sonner";

function BulkNotifForm() {
  const [isPending, startTranssition] = React.useTransition();

  const form = useForm<z.infer<typeof BulkNotifFormSchema>>({
    resolver: zodResolver(BulkNotifFormSchema),
    defaultValues: {
      title: "",
      text: "",
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof BulkNotifFormSchema>) => {
    startTranssition(() => {
      notifAnggotaAll(values).then((data) => {
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
      buttonLabel="Kirim Pesan"
      title="Kirim Notifikasi"
      desc="Notifikasi dikirim ke seluruh Anggota Koperasi"
      className="h-fit"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
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
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pesan</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Tuliskan pesan yang ingin dikirim"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Loading..." : "Kirim"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </FormModal>
  );
}

export { BulkNotifForm };
