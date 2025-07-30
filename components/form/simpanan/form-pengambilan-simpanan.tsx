"use client";

import { PengambilanSimpananSchema } from "@/lib/schema/schema-pengambilan-simpanan";
import { StatusPelunasanAngsuranType } from "@/lib/types/helper";
import { TMaxPengambilan } from "@/lib/types/simpanan";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
import { JENIS_PENGAMBILAN_SIMPANAN } from "@/lib/constan";
import InputCurrency from "@/components/ui/input-currency";
import FormStatus from "../form-status";
import { insertPengambilanSimpanan } from "@/lib/server/action/action-simpanan";
import { toast } from "sonner";

interface IFormPengambilanSimpanan {
  maxSimpanan: TMaxPengambilan;
  status: StatusPelunasanAngsuranType;
  id: string;
}

export default function FormPengambilanSimpanan({
  maxSimpanan,
  status,
  id,
}: IFormPengambilanSimpanan) {
  const [isPending, startTranssition] = React.useTransition();
  const [maxLimit, setMaxLimit] = React.useState(0);
  const [message, setMessage] = React.useState("");
  const [type, setType] = React.useState("");

  const PengambilanSimpananSchemaForm = PengambilanSimpananSchema(
    maxLimit,
    type
  );

  const form = useForm<z.infer<typeof PengambilanSimpananSchemaForm>>({
    resolver: zodResolver(PengambilanSimpananSchemaForm),
    defaultValues: {
      noAnggota: id,
      jenisPengambilanSimpanan: undefined,
      jumlahPengambilanSimpanan: 0,
    },
    mode: "onChange",
  });

  const pilihanSimpanan = form.watch("jenisPengambilanSimpanan");

  React.useEffect(() => {
    let newMaxLimit = 0;
    let typeSimpanan = "";
    let newMessage = "";

    switch (pilihanSimpanan) {
      case "SUKAMANA":
        typeSimpanan = "sukamana";

        if (status === "PENDING") {
          newMaxLimit = 0;
          newMessage =
            "Pengajuan pinjaman sedang diproses. Tidak dapat mengambil simpanan SUKAMANA.";
          break;
        }

        if (status === "BELUM_LUNAS") {
          newMaxLimit = Math.floor((maxSimpanan.sukamana || 0) * 0.15);
          newMessage =
            "Anda memiliki pinjaman aktif. Hanya 15% simpanan SUKAMANA yang bisa diambil.";
          break;
        }

        if (status === "SUDAH_LUNAS_SEBAGIAN") {
          newMaxLimit = Math.floor((maxSimpanan.sukamana || 0) * 0.75);
          newMessage =
            "Sebagian pinjaman telah dilunasi. 75% simpanan SUKAMANA dapat diambil.";
          break;
        }

        if (maxSimpanan.sukamana === 0) {
          newMaxLimit = 0;
          newMessage = "Simpanan SUKAMANA tidak dapat diambil karena saldo 0.";
        } else {
          newMaxLimit = maxSimpanan.sukamana;
          newMessage = "Simpanan SUKAMANA dapat diambil sepenuhnya.";
        }
        break;

      case "LEBARAN":
        typeSimpanan = "lebaran";
        if (maxSimpanan.lebaran === 0) {
          newMaxLimit = 0;
          newMessage = "Simpanan LEBARAN tidak dapat diambil karena saldo 0.";
        } else {
          newMaxLimit = maxSimpanan.lebaran;
        }
        break;

      case "QURBAN":
        typeSimpanan = "qurban";
        if (maxSimpanan.qurban === 0) {
          newMaxLimit = 0;
          newMessage = "Simpanan QURBAN tidak dapat diambil karena saldo 0.";
        } else {
          newMaxLimit = maxSimpanan.qurban;
        }
        break;

      case "UBAR":
        typeSimpanan = "ubar";
        if (maxSimpanan.ubar === 0) {
          newMaxLimit = 0;
          newMessage = "Simpanan UBAR tidak dapat diambil karena saldo 0.";
        } else {
          newMaxLimit = maxSimpanan.ubar;
        }
        break;

      default:
        newMaxLimit = 0;
    }

    setMaxLimit(newMaxLimit);
    setType(typeSimpanan);
    setMessage(newMessage);
  }, [pilihanSimpanan, status, maxSimpanan]);

  const onSubmit = (values: z.infer<typeof PengambilanSimpananSchemaForm>) => {
    startTranssition(() => {
      insertPengambilanSimpanan(maxLimit, type, values).then((data) => {
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
        <Button size="sm" className="ml-auto gap-1">
          <span className="hidden sm:inline md:inline">
            Ajuan Pengambilan Simpanan
          </span>
          <Plus className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            PERSYARATAN PENGAMBILAN SIMPANAN KOPERASI KARYAWAN YAYASAN AL
            GHIFARI
          </DialogTitle>
          <ul className="mt-3 list-decimal pl-4 pt-4 text-sm text-muted-foreground">
            <li className="mb-4 text-justify">
              Sesuai dengan kesepakatan yang telah disetujui, simpanan wajib
              tidak bisa diambil.
            </li>
            <li className="mb-4 text-justify">
              Jika Anda memiliki pinjaman atau dalam proses pengajuan pinjaman,
              simpanan sukamana hanya dapat diambil <b>15%</b> dari total
              keseluruhan.
            </li>
            <li className="mb-4 text-justify">
              Simpanan Lebaran & Qurban hanya dapat diambil <b>sekali</b> dalam
              satu periode.
            </li>
          </ul>
        </DialogHeader>
        {message && <FormStatus message={message} />}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="jenisPengambilanSimpanan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis Simpanan</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih Jenis Simpanan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {JENIS_PENGAMBILAN_SIMPANAN.map((item, index) => (
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
                name="jumlahPengambilanSimpanan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jumlah Pengambilan Simpanan</FormLabel>
                    <FormControl>
                      <InputCurrency
                        name="jumlahPengambilanSimpanan"
                        control={form.control}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending && "Sedang Proses..."}
                {!isPending && "Ajukan Pengambilan Simpanan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
