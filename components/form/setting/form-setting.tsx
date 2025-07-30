"use client";
import * as z from "zod";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ResetPasswordAnggotaSchema,
  ResetUsernameAnggotaSchema,
} from "@/lib/schema/schema-auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ResetPasswordAnggota,
  ResetUsernameAnggota,
} from "@/lib/server/action/action-reset-password";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import { Label } from "@/components/ui/label";

function ResetPasswordAnggotaForm() {
  const [showPasswords, setShowPasswords] = React.useState<boolean>(false);
  const [isPending, startTranssition] = React.useTransition();

  const form = useForm<z.infer<typeof ResetPasswordAnggotaSchema>>({
    resolver: zodResolver(ResetPasswordAnggotaSchema),
    defaultValues: {
      prevPassword: "",
      newPassword: "",
      newConfirmPassword: "",
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof ResetPasswordAnggotaSchema>) => {
    startTranssition(() => {
      console.log(values);
      ResetPasswordAnggota(values).then((data) => {
        if (data.ok) {
          form.reset();
          toast.success(data.message);
          setTimeout(() => {
            signOut();
          }, 1500);
        } else {
          toast.error(data.message);
        }
      });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Ganti Password</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="prevPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password Saat Ini</FormLabel>
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
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password Baru</FormLabel>
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
                name="newConfirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Konfirmasi Password Baru</FormLabel>
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
      </CardContent>
    </Card>
  );
}

function ResetUsernameAnggotaForm() {
  const [isPending, startTranssition] = React.useTransition();

  const form = useForm<z.infer<typeof ResetUsernameAnggotaSchema>>({
    resolver: zodResolver(ResetUsernameAnggotaSchema),
    defaultValues: {
      prevUsername: "",
      newUsername: "",
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof ResetUsernameAnggotaSchema>) => {
    startTranssition(() => {
      console.log(values);
      ResetUsernameAnggota(values).then((data) => {
        if (data.ok) {
          form.reset();
          toast.success(data.message);
          setTimeout(() => {
            signOut();
          }, 1500);
        } else {
          toast.error(data.message);
        }
      });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Ganti Username</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="prevUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username Saat Ini</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username Baru</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Loading..." : "Reset Username"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export { ResetPasswordAnggotaForm, ResetUsernameAnggotaForm };
