"use client";
import * as z from "zod";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  InputPotongGajiSchema,
  RowValidationSchema,
} from "@/lib/schema/schema-potong-gaji";
import { toast } from "sonner";
import { insertPotongan } from "@/lib/server/action/action-potongan-gaji";
import { TPotongGaji } from "@/lib/types/potong-gaji";
import ExcelJS from "exceljs";
import { formatFieldValidation, parseExcelRow } from "@/lib/helper";

export default function InputExcell() {
  const [isPending, startTranssition] = React.useTransition();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const form = useForm<z.infer<typeof InputPotongGajiSchema>>({
    resolver: zodResolver(InputPotongGajiSchema),
    defaultValues: {
      file: undefined,
    },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof InputPotongGajiSchema>) => {
    startTranssition(async () => {
      const validateValues = InputPotongGajiSchema.safeParse(values);

      if (!validateValues.success) {
        toast.error("Format field tidak valid.");
      }

      if (!values.file) {
        toast.error("File tidak ditemukan. Harap unggah file Excel.");
      }

      const buffer = await values.file.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);

      const worksheet = workbook.worksheets[0];

      if (!worksheet) {
        toast.error("Worksheet tidak ditemukan dalam file.");
      }

      const data: TPotongGaji[] = [];
      const errors: string[] = [];

      worksheet.eachRow((row, rowIndex) => {
        if (rowIndex > 2) {
          const values = row.values as (string | number)[];
          const rawData = parseExcelRow(values);

          try {
            const validated = RowValidationSchema.parse(rawData);
            data.push(validated);
          } catch (error) {
            if (error instanceof z.ZodError) {
              const formattedErrors = error.errors.map((e) => {
                const path = e.path.join(".");
                const label = formatFieldValidation(path);
                return `${label}: ${e.message}`;
              });

              errors.push(
                `Error: Baris ${rowIndex + 1}, ${formattedErrors.join(", ")}`
              );
            }
          }
        }
      });

      if (errors.length === 0) {
        toast.success("Validasi Berhasil");

        const result = await insertPotongan(data).then((data) => {
          if (data.ok) {
            toast.success(data.message);
            form.reset();
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          } else {
            toast.error(data.message);
          }
        });
      } else {
        toast.error(errors);
      }
    });
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Input Potongan Gaji Anggota</CardTitle>
        <CardDescription className="text-balance">
          Harap masukkan data potongan gaji anggota secara lengkap dan akurat,
          dengan format file .xlsx / .xls
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              {/* <FormField
                control={form.control}
                name="file"
                render={({ field: { value, ...fieldValues } }) => (
                  <FormItem>
                    <FormLabel>File Potongan Gaji</FormLabel>
                    <FormControl>
                      <Input
                        {...fieldValues}
                        type="file"
                        accept=".xlsx, .xls,"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          fieldValues.onChange(file);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>.xlsx / .xls & maks 5MB</FormDescription>
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="file"
                render={({ field: { value, ...fieldValues } }) => (
                  <FormItem>
                    <FormLabel>File Potongan Gaji</FormLabel>
                    <FormControl>
                      <Input
                        {...fieldValues}
                        type="file"
                        accept=".xlsx, .xls"
                        ref={(e) => {
                          fieldValues.ref(e); // hubungkan ke RHF
                          fileInputRef.current = e; // simpan manual ref
                        }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          fieldValues.onChange(file); // daftarkan ke RHF
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      .xlsx / .xls & maksimal 5MB
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
            <CardFooter className="pt-4">
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Loading..." : "Input Potongan Gaji"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
