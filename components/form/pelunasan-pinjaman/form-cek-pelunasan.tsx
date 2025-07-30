"use client";

import * as z from "zod";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TPelunasan,
  TValidasiPelunasan,
  TValidasiPelunasanData,
} from "@/lib/types/pelunasan-pinjaman";
import FormStatus from "../form-status";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cekPelunasanSchema } from "@/lib/schema/schema-pelunasan";
import {
  Form,
  FormControl,
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
import { Button } from "@/components/ui/button";
import { validasiPelunasan } from "@/lib/server/action/action-pelunasan";
import { toast } from "sonner";
import CardDetailPelunasanPinjaman from "@/components/card/card-detail-pelunasan-pinjaman";
import FormPengajuanPelunasan from "./form-pengajuan-pelunasan";

interface IFormCekPelunasan {
  pinjaman: TPelunasan[];
}

export default function FormCekPelunasan({ pinjaman }: IFormCekPelunasan) {
  const [isPending, startTranssition] = React.useTransition();
  const [pelunasan, setPelunasan] =
    React.useState<TValidasiPelunasanData>(null);

  const form = useForm<z.infer<typeof cekPelunasanSchema>>({
    resolver: zodResolver(cekPelunasanSchema),
    defaultValues: {
      pinjamanId: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof cekPelunasanSchema>) => {
    startTranssition(() => {
      validasiPelunasan(values).then((data) => {
        if (data.ok) {
          toast.success(data.message);
          setPelunasan(data.data);
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
          PELUNASAN PINJAMAN KOPERASI KARYAWAN YAYASAN AL GHIFARI
        </CardTitle>
        <ul className="mt-3 list-decimal pl-4 pt-4 text-sm text-muted-foreground">
          <li className="mb-4 text-justify">
            Melampirkan bukti pelunasan / transfer.
          </li>
          <li className="mb-2 text-justify">
            Biaya yang dikenakan pada saat pelunasan :
          </li>
          <ul className="list-disc pl-4">
            <li className="mb-2 text-justify">
              Biaya penalti sebesar <b>1%</b> dari jumlah pinjaman.
            </li>
          </ul>
        </ul>
      </CardHeader>
      <CardContent>
        {!pinjaman || pinjaman.length === 0 ? (
          <FormStatus
            status={false}
            message="Maaf, untuk sekarang anda tidak mempunyai pinjaman"
          />
        ) : (
          <>
            {pelunasan ? (
              <FormPengajuanPelunasan data={pelunasan} />
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="pinjamanId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>No Pinjaman</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih No Pinjaman" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {pinjaman.map((item) => (
                                <SelectItem
                                  key={item.noPinjaman}
                                  value={item.noPinjaman}
                                >
                                  {item.noPinjaman}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full"
                    variant="destructive"
                  >
                    {isPending ? "Loading..." : "Cek Pelunasan Pinjaman"}
                  </Button>
                </form>
              </Form>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
