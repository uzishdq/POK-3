import { PICTURES } from "@/lib/constan";
import Image from "next/image";
import React from "react";

export default function StrukHeader() {
  return (
    <div className="grid w-full grid-cols-3 gap-1">
      <div className="col-span-1 place-items-center self-center justify-self-center">
        <div className="relative aspect-square h-auto w-36">
          <Image src={PICTURES.LOGO_STRUK} alt="logo" fill />
        </div>
      </div>
      <div className="col-span-2 flex flex-col place-items-center justify-center gap-1 self-center text-center text-green-600">
        <p className="text-2xl font-bold">KKGM</p>
        <p className="text-2xl font-bold">YAYASAN AL GHIFARI</p>
        <p className="text-sm font-bold">
          Badan Hukum No. 518/PAD.47 - Diskop/2003
        </p>
        <p className="text-sm">
          Jl. Cisantren Kulon No. 140 Telp. {"(022) 7806223 Soekarno-Hatta"}
        </p>
        <p className="text-sm">Kota Bandung 40293</p>
      </div>
      <div className="col-span-3 flex w-full flex-col gap-[2px]">
        <div className=" h-1 w-full bg-green-600" />
        <div className=" h-2 w-full bg-green-800" />
      </div>
    </div>
  );
}
