"use client";
import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import { SheetClose } from "../ui/sheet";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  BENDAHARA_LAINNYA,
  DEFAULT_LOGIN_REDIRECT,
  MASTER_ROUTES,
  PINJAMAN_PETUGAS_ROUTES,
  PINJAMAN_USER_ROUTES,
  ROUTES,
  SEKRETARIS_LAINNYA,
  SIMPANAN_PETUGAS_ROUTES,
  SIMPANAN_USER_ROUTES,
} from "@/lib/constan";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { ChevronDown, ChevronsUpDown } from "lucide-react";

interface IMobileNav {
  userRole: string;
}
export default function MobileNav({ userRole }: IMobileNav) {
  const [openSimpanan, setOpenSimpanan] = React.useState(false);
  const [openPinjaman, setOpenPinjaman] = React.useState(false);
  const [openPetugas, setOpenPetugas] = React.useState(false);
  const [openMaster, setOpenMaster] = React.useState(false);
  const [openSimpananPetugas, setOpenSimpananPetugas] = React.useState(false);
  const [openPinjamanPetugas, setOpenPinjamanPetugas] = React.useState(false);
  const [openLainyaBendahara, setOpenLainyaBendahara] = React.useState(false);
  const [openLainyaSekretaris, setOpenLainyaSekretaris] = React.useState(false);

  return (
    <ScrollArea className="max-h-96 whitespace-nowrap">
      <div className="space-y-2">
        <SheetClose
          asChild
          className="flex items-center justify-center rounded-sm border shadow-sm"
        >
          <Button
            asChild
            variant="ghost"
            className="w-full text-sm font-semibold"
          >
            <Link href={DEFAULT_LOGIN_REDIRECT}>Dashboard</Link>
          </Button>
        </SheetClose>

        {userRole && userRole != "USER" ? (
          <Collapsible
            open={openPetugas}
            onOpenChange={setOpenPetugas}
            className="space-y-2"
          >
            <div className="flex items-center justify-between rounded-sm border shadow-sm">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full gap-4 ">
                  <h4 className="text-sm font-semibold">Petugas</h4>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-2">
              <SheetClose asChild>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full rounded-sm border shadow-sm"
                >
                  <Link href={ROUTES.AUTH.PETUGAS.DASHBOARD}>
                    Dashboard Petugas
                  </Link>
                </Button>
              </SheetClose>
              <Collapsible
                open={openMaster}
                onOpenChange={setOpenMaster}
                className="space-y-2"
              >
                <div className="flex items-center justify-between rounded-sm border shadow-sm ">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full gap-4">
                      <h4 className="text-sm font-semibold">Data Master</h4>
                      <ChevronsUpDown className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="space-y-2">
                  {MASTER_ROUTES.map((item) => (
                    <div
                      key={item.href}
                      className="mb-2 rounded-sm border shadow-sm"
                    >
                      <SheetClose asChild>
                        <Button
                          asChild
                          variant="ghost"
                          className="w-full bg-black text-white"
                        >
                          <Link href={item.href}>{item.name}</Link>
                        </Button>
                      </SheetClose>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
              {userRole && userRole != "SEKRETARIS" ? (
                <>
                  <Collapsible
                    open={openSimpananPetugas}
                    onOpenChange={setOpenSimpananPetugas}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between rounded-sm border shadow-sm">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="w-full gap-4">
                          <h4 className="text-sm font-semibold">
                            Simpanan Anggota
                          </h4>
                          <ChevronsUpDown className="h-4 w-4" />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent className="space-y-2">
                      {SIMPANAN_PETUGAS_ROUTES.map((item) => (
                        <div
                          key={item.href}
                          className="mb-2 rounded-sm border shadow-sm"
                        >
                          <SheetClose asChild>
                            <Button
                              asChild
                              variant="ghost"
                              className="w-full bg-black text-white"
                            >
                              <Link href={item.href}>{item.name}</Link>
                            </Button>
                          </SheetClose>
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                  <Collapsible
                    open={openPinjamanPetugas}
                    onOpenChange={setOpenPinjamanPetugas}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between rounded-sm border shadow-sm">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="w-full gap-4">
                          <h4 className="text-sm font-semibold">
                            Pinjaman Anggota
                          </h4>
                          <ChevronsUpDown className="h-4 w-4" />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent className="space-y-2">
                      {PINJAMAN_PETUGAS_ROUTES.map((item) => (
                        <div
                          key={item.href}
                          className="mb-2 rounded-sm border shadow-sm"
                        >
                          <SheetClose asChild>
                            <Button
                              asChild
                              variant="ghost"
                              className="w-full bg-black text-white"
                            >
                              <Link href={item.href}>{item.name}</Link>
                            </Button>
                          </SheetClose>
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                  <Collapsible
                    open={openLainyaBendahara}
                    onOpenChange={setOpenLainyaBendahara}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between rounded-sm border shadow-sm">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="w-full gap-4">
                          <h4 className="text-sm font-semibold">
                            Lainya Bendahara
                          </h4>
                          <ChevronsUpDown className="h-4 w-4" />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent className="space-y-2">
                      {BENDAHARA_LAINNYA.map((item) => (
                        <div
                          key={item.href}
                          className="mb-2 rounded-sm border shadow-sm"
                        >
                          <SheetClose asChild>
                            <Button
                              asChild
                              variant="ghost"
                              className="w-full bg-black text-white"
                            >
                              <Link href={item.href}>{item.name}</Link>
                            </Button>
                          </SheetClose>
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                </>
              ) : (
                <Collapsible
                  open={openLainyaSekretaris}
                  onOpenChange={setOpenLainyaSekretaris}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between rounded-sm border shadow-sm">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full gap-4">
                        <h4 className="text-sm font-semibold">
                          Lainya Sekretaris
                        </h4>
                        <ChevronsUpDown className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent className="space-y-2">
                    {SEKRETARIS_LAINNYA.map((item) => (
                      <div
                        key={item.href}
                        className="mb-2 rounded-sm border shadow-sm"
                      >
                        <SheetClose asChild>
                          <Button
                            asChild
                            variant="ghost"
                            className="w-full bg-black text-white"
                          >
                            <Link href={item.href}>{item.name}</Link>
                          </Button>
                        </SheetClose>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )}
            </CollapsibleContent>
          </Collapsible>
        ) : null}

        <Collapsible
          open={openSimpanan}
          onOpenChange={setOpenSimpanan}
          className="space-y-2"
        >
          <div className="flex items-center justify-between rounded-sm border shadow-sm">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full gap-4">
                <h4 className="text-sm font-semibold">Simpanan</h4>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="space-y-2">
            {SIMPANAN_USER_ROUTES.map((item) => (
              <div key={item.href} className="mb-2 rounded-sm border shadow-sm">
                <SheetClose asChild>
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full bg-black text-white"
                  >
                    <Link href={item.href}>{item.name}</Link>
                  </Button>
                </SheetClose>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
        <Collapsible
          open={openPinjaman}
          onOpenChange={setOpenPinjaman}
          className="space-y-2"
        >
          <div className="flex items-center justify-between rounded-sm border shadow-sm">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full gap-4">
                <h4 className="text-sm font-semibold">Pinjaman</h4>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="space-y-2">
            {PINJAMAN_USER_ROUTES.map((item) => (
              <div key={item.href} className="mb-2 rounded-sm border shadow-sm">
                <SheetClose asChild>
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full bg-black text-white"
                  >
                    <Link href={item.href}>{item.name}</Link>
                  </Button>
                </SheetClose>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </ScrollArea>
  );
}
