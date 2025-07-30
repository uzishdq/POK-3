import { UndurDiriForm } from "@/components/form/anggota/form-undur-diri";
import { RenderError } from "@/components/ui/render-error";
import { auth } from "@/lib/auth";
import { LABEL } from "@/lib/constan";
import { getCekPengunduranDiriById } from "@/lib/server/data/data-undur-diri";
import React from "react";

export default async function UndurDiri() {
  const session = await auth();

  if (!session?.user.noAnggota || !session.user.id) {
    return RenderError("Pengunduran Diri", LABEL.ERROR.NOT_LOGIN);
  }

  const isSubmit = await getCekPengunduranDiriById(session.user.noAnggota);

  if (!isSubmit.ok) {
    return RenderError("Pengunduran Diri", LABEL.ERROR.DESCRIPTION);
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-2xl font-medium">Pengunduran Diri</div>
      <UndurDiriForm
        noPengajuan={isSubmit.data ? isSubmit.data.noPengunduranDiri : null}
      />
    </div>
  );
}
