"use client";

import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  ResetPasswordSchema,
  ValidasiResetPasswordSchema,
} from "@/lib/schema/schema-auth";
import CardContainer from "@/components/card/card-container";
import { ROUTES } from "@/lib/constan";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormStatus from "../form-status";
import {
  ResetForgetPassword,
  validasiResetPassword,
} from "@/lib/server/action/action-reset-password";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";

function ValidasiResetForm() {
  const [isPending, startTranssition] = React.useTransition();
  const [message, setMessage] = React.useState<string | undefined>("");
  const [status, setStatus] = React.useState<boolean | undefined>(false);
  const [isVerif, setIsVerif] = React.useState<boolean | undefined>(false);

  const form = useForm<z.infer<typeof ValidasiResetPasswordSchema>>({
    resolver: zodResolver(ValidasiResetPasswordSchema),
    defaultValues: {
      nik: "",
      username: "",
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof ValidasiResetPasswordSchema>) => {
    startTranssition(() => {
      validasiResetPassword(values).then((data) => {
        setStatus(data.ok);
        setMessage(data.message);
        if (data.ok) {
          form.reset();
          setIsVerif(data.ok);
        }
      });
    });
  };

  return (
    <CardContainer buttonLabel="login ?" buttonHref={ROUTES.PUBLIC.LOGIN}>
      {!isVerif ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormStatus status={status} message={message} />
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="nik"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      No.KTP / NIP {"(nomor induk pegawai)"}
                    </FormLabel>
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
            </div>
            <Button
              type="submit"
              className="w-full"
              variant="destructive"
              disabled={isPending}
            >
              {isPending ? "Loading..." : "Verifikasi"}
            </Button>
          </form>
        </Form>
      ) : (
        <ResetPasswordForm />
      )}
    </CardContainer>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const [showPasswords, setShowPasswords] = React.useState<boolean>(false);
  const [isPending, startTranssition] = React.useTransition();
  const [message, setMessage] = React.useState<string | undefined>("");
  const [status, setStatus] = React.useState<boolean | undefined>(false);

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
    startTranssition(() => {
      ResetForgetPassword(values).then((data) => {
        setStatus(data.ok);
        setMessage(data.message);
        if (data.ok) {
          form.reset();
          setTimeout(() => {
            router.push(ROUTES.PUBLIC.LOGIN);
          }, 2000);
        }
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormStatus status={status} message={message} />
        <div className="space-y-4">
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
          {isPending ? "Loading..." : "Reset Password"}
        </Button>
      </form>
    </Form>
  );
}

export { ValidasiResetForm };
