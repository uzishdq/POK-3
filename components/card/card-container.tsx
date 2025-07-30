import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { LABEL, PICTURES } from "@/lib/constan";

type CardContainerProps = {
  children: React.ReactNode;
  buttonLabel: string;
  buttonHref: string;
};

export default function CardContainer({
  children,
  buttonLabel,
  buttonHref,
}: CardContainerProps) {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader className="items-center justify-center text-center">
        <Image
          className="mx-auto"
          src={PICTURES.LOGO}
          height={100}
          width={100}
          alt="logo koperasi"
          loading="lazy"
        />
        <CardTitle className="text-2xl font-bold">
          {LABEL.CARD.HEADER}
        </CardTitle>
        <CardDescription>{LABEL.CARD.DESCRIPTION}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <Button className="w-full text-sm" variant="link" size="sm">
          <Link href={buttonHref}>{buttonLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
