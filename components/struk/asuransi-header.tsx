import { PICTURES } from "@/lib/constan";
import Image from "next/image";
import React from "react";

export default function AsuransiHeader() {
  return (
    <div className="grid w-full grid-cols-3 gap-1">
      <div className="col-span-1 place-items-center self-center justify-self-center">
        <div className="relative aspect-square h-32 w-40">
          <Image src={PICTURES.LOGO_ASURANSI} alt="logo" fill />
        </div>
      </div>

      <div className="col-span-2 flex flex-col place-items-center justify-center gap-1 self-center text-center">
        <p className="text-lg font-bold">SURAT PERNYATAAN KESEHATAN</p>
        <p className="text-lg font-bold">
          CALON PESERTA ASURANSI JIWA KUMPULAN
        </p>
      </div>
    </div>
  );
}
