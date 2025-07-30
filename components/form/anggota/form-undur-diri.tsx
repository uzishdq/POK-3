"use client";
import * as z from "zod";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ValidasiUndurDiriSchema } from "@/lib/schema/schema-anggota";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  insertUndurDiri,
  validasiUndurDiri,
} from "@/lib/server/action/action-undur-diri";
import { toast } from "sonner";
import CardDetailPengunduranDiri from "@/components/card/card-detail-pengunduran-diri";
import { TCalculateUndurDiri } from "@/lib/types/undur-diri";
import FormStatus from "../form-status";

interface IUndurDiriForm {
  noPengajuan: string | null;
}

function UndurDiriForm({ noPengajuan }: IUndurDiriForm) {
  const [isValid, setIsValid] = React.useState(false);
  const [undurDiri, setUndurDiri] = React.useState<TCalculateUndurDiri | null>(
    null
  );

  const [isPending, startTranssition] = React.useTransition();
  const form = useForm<z.infer<typeof ValidasiUndurDiriSchema>>({
    resolver: zodResolver(ValidasiUndurDiriSchema),
    defaultValues: {
      keterangan: "",
    },
    mode: "onChange",
  });

  const onValidate = (values: z.infer<typeof ValidasiUndurDiriSchema>) => {
    startTranssition(() => {
      validasiUndurDiri(values).then((data) => {
        setIsValid(data.ok);
        if (data.ok) {
          setUndurDiri(data.data);
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      });
    });
  };

  const onSubmit = (values: z.infer<typeof ValidasiUndurDiriSchema>) => {
    startTranssition(() => {
      insertUndurDiri(values).then((data) => {
        if (data.ok) {
          form.reset();
          setUndurDiri(null);
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
          FORMULIR PERMOHONAN UNDUR DIRI KOPERASI KARYAWAN YAYASAN AL GHIFARI
        </CardTitle>
        <ul className="mt-3 list-decimal pl-4 pt-4 text-sm text-muted-foreground">
          <li className="mb-4 text-justify">
            Semua kewajiban yang berkaitan dengan koperasi, termasuk pinjaman,
            angsuran, dan kewajiban lainnya, harus diselesaikan terlebih dahulu
            sebelum permohonan disetujui.
          </li>
          <li className="mb-4 text-justify">
            Saldo simpanan anggota akan dihitung sesuai aturan koperasi dan
            dikembalikan setelah dikurangi kewajiban yang belum dilunasi (jika
            ada).
          </li>
          <li className="mb-4 text-justify">
            Permohonan undur diri akan diproses sesuai kebijakan koperasi dan
            membutuhkan waktu tertentu untuk disetujui oleh pengurus.
          </li>
          <li className="mb-2 text-justify">
            Biaya yang dikenakan pada saat undur diri :
          </li>
          <ul className="list-disc pl-4">
            <li className="mb-2 text-justify">
              Biaya penalti sebesar <b>1%</b> dari jumlah pinjaman.
            </li>
            <li className="mb-2 text-justify">
              Biaya administrasi sebesar Rp 25.000 .
            </li>
          </ul>
        </ul>
      </CardHeader>
      <CardContent>
        {noPengajuan ? (
          <FormStatus
            message={`Permohonan pengunduran diri Anda No: ${noPengajuan} saat ini sedang ditinjau oleh petugas`}
          />
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(isValid ? onSubmit : onValidate)}
              className="space-y-4"
            >
              {undurDiri && <CardDetailPengunduranDiri data={undurDiri} />}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="keterangan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alasan Mengundurkan Diri</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Silakan isi alasan pengunduran diri"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                disabled={isPending}
                className="w-full"
                variant={isValid ? "default" : "destructive"}
              >
                {isPending
                  ? "Loading..."
                  : isValid
                  ? "Ajukan Pengunduran Diri"
                  : "Validasi Pengunduran Diri"}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}

export { UndurDiriForm };
