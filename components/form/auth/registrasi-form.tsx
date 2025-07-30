"use client";

import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RegisterSchema } from "@/lib/schema/schema-auth";
import CardContainer from "@/components/card/card-container";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FormStatus from "../form-status";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constan";
import { createRegister } from "@/lib/server/action/action-register";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";

export default function RegistrasiForm() {
  const [showPasswords, setShowPasswords] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string | undefined>("");
  const [status, setStatus] = React.useState<boolean | undefined>(false);
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      nik: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    startTransition(() => {
      createRegister(values).then((data) => {
        setStatus(data.ok);
        setMessage(data.message);
        if (data.ok) {
          form.reset();
          setTimeout(() => {
            router.push(ROUTES.PUBLIC.LOGIN);
          }, 500);
        }
      });
    });
  };

  return (
    <CardContainer
      buttonLabel="sudah jadi anggota ?"
      buttonHref={ROUTES.PUBLIC.LOGIN}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormStatus status={status} message={message} />
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="nik"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No.KTP / NIP {"(nomor induk pegawai)"}</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="**********"
                      type={showPasswords ? "text" : "password"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="**********"
                      type={showPasswords ? "text" : "password"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-2">
              <Input
                id="show-password"
                type="checkbox"
                className="h-4 w-4"
                onChange={(e) => setShowPasswords(e.target.checked)}
              />
              <Label htmlFor="show-password" className="text-sm">
                Tampilkan password
              </Label>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Loading..." : "Daftar"}
          </Button>
        </form>
      </Form>
    </CardContainer>
  );
}
