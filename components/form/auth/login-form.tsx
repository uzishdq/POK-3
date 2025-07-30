"use client";

import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginSchema } from "@/lib/schema/schema-auth";
import CardContainer from "@/components/card/card-container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import FormStatus from "../form-status";
import { ROUTES } from "@/lib/constan";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
  const [showPasswords, setShowPasswords] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string | undefined>("");
  const [status, setStatus] = React.useState<boolean | undefined>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    return await signIn("credentials", {
      redirect: false,
      username: values.username,
      password: values.password,
    })
      .then((data) => {
        if (!data?.error) {
          setStatus(true);
          setMessage("login berhasil");
          form.reset();
          setTimeout(() => {
            router.push(ROUTES.AUTH.DATA_DIRI);
          }, 500);
        } else {
          setStatus(false);
          setMessage("username / password tidak sesuai");
        }
      })
      .catch((err) => {
        setStatus(false);
        setMessage(
          "Telah terjadi kesalahan ketika melakukan proses login, silahkan coba lagi nanti."
        );
        console.error(err);
      });
  };
  return (
    <CardContainer
      buttonLabel="belum jadi anggota ?"
      buttonHref={ROUTES.PUBLIC.REGISTRASI}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  <FormLabel className="flex justify-between">
                    <span>Password</span>
                    <Link
                      href={ROUTES.PUBLIC.RESET_PASSWORD}
                      className="text-sm text-muted-foreground hover:underline"
                    >
                      Lupa password?
                    </Link>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type={showPasswords ? "text" : "password"}
                      placeholder="********"
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
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Loading..." : "Login"}
          </Button>
        </form>
      </Form>
    </CardContainer>
  );
}
