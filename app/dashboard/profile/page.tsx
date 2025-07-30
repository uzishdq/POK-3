import ProfileForm from "@/components/form/profile/profile-form";
import { auth } from "@/lib/auth";
import { getProfile } from "@/lib/server/data/data-anggota";
import { getJabatan } from "@/lib/server/data/data-jabatan";
import { getUnitKerja } from "@/lib/server/data/data-unit-kerja";
import React, { Suspense } from "react";
import Loading from "../loading";
import { RenderError } from "@/components/ui/render-error";
import { LABEL } from "@/lib/constan";

export default async function Profile() {
  const session = await auth();
  const noAnggota = session?.user?.noAnggota;

  if (!noAnggota) {
    return RenderError("Profile", LABEL.ERROR.NOT_LOGIN);
  }

  const [profile, jabatan, unitKerja] = await Promise.all([
    getProfile(noAnggota),
    getJabatan(),
    getUnitKerja(),
  ]);

  const isDataInvalid =
    !profile.ok || !jabatan.ok || !unitKerja.ok || !profile.data;

  if (isDataInvalid) {
    return RenderError("Profile", LABEL.ERROR.DESCRIPTION);
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-2xl font-medium">Profile</div>
      <Suspense fallback={<Loading />}>
        <ProfileForm
          data={profile.data}
          jabatan={jabatan.data}
          unitKerja={unitKerja.data}
        />
      </Suspense>
    </div>
  );
}
