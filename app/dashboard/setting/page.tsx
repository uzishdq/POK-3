import {
  ResetPasswordAnggotaForm,
  ResetUsernameAnggotaForm,
} from "@/components/form/setting/form-setting";
import { RenderError } from "@/components/ui/render-error";
import { auth } from "@/lib/auth";
import { LABEL } from "@/lib/constan";
import React from "react";

export default async function SettingAnggota() {
  const session = await auth();

  if (!session?.user.noAnggota || !session.user.id) {
    return RenderError("Setting Akun", LABEL.ERROR.NOT_LOGIN);
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-2xl font-medium">Setting Akun</div>
      <ResetUsernameAnggotaForm />
      <ResetPasswordAnggotaForm />
    </div>
  );
}
