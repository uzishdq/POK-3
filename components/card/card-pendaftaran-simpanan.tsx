import { PICTURES } from "@/lib/constan";
import { TSettingSimpanan } from "@/lib/types/setting-simpanan";
import React from "react";
import { Button } from "../ui/button";
import { formatDatebyMonth } from "@/lib/helper";
import Image from "next/image";
import { FormPendaftranSimpanan } from "../form/simpanan/form-pendaftran-simpanan";

interface CardPendaftaranSimpananProps {
  data: TSettingSimpanan;
  descriptions: string;
}

export default function CardPendaftaranSimpanan({
  data,
  descriptions,
}: CardPendaftaranSimpananProps) {
  const today = new Date();
  const isPass = today > new Date(data.tanggalTutupSimpanan);

  let picture;

  switch (data.jenisPendaftaranSimpanan) {
    case "LEBARAN":
      picture = PICTURES.PENDAFTARAN_LEBARAN;
      break;
    case "QURBAN":
      picture = PICTURES.PENDAFTARAN_QURBAN;
      break;
    case "UBAR":
      picture = PICTURES.PENDAFTARAN_UBAR;
      break;
    default:
      break;
  }
  return (
    <div className="relative w-full overflow-hidden rounded-lg p-4 shadow-lg">
      <div className="md:flex">
        <div className="md:w-[500px]">
          <Image
            src={picture!}
            alt="picture"
            className="w-full rounded-lg shadow-md"
            height={500}
            width={500}
            loading="lazy"
          />
        </div>
        <div className="space-y-4 py-4 md:w-1/2 md:px-6">
          <div className="text-2xl font-bold uppercase">
            Pendaftaran {data.namaPendaftaran}
          </div>
          <p className="mt-2 text-lg text-muted-foreground">{descriptions}</p>
          <ul className="ml-4 list-disc text-lg">
            <li>
              Batas Pendaftaran s/d{" "}
              <span className="font-semibold text-red-600">
                {formatDatebyMonth(data.tanggalTutupSimpanan)}
              </span>
            </li>
            <li>
              Jangka Waktu : {formatDatebyMonth(data.tanggalAwalSimpanan)} -{" "}
              {formatDatebyMonth(data.tanggalAkhirSimpanan)}
            </li>
          </ul>
        </div>
        {!isPass ? (
          <FormPendaftranSimpanan data={data} />
        ) : (
          <Button
            className="bottom-0 right-0 mb-4 mr-4 w-full md:absolute md:w-auto xl:w-auto"
            variant="destructive"
          >
            Pendaftaran Ditutup
          </Button>
        )}
      </div>
    </div>
  );
}
