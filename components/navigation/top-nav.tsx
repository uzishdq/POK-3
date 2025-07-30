import { auth } from "@/lib/auth";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { CircleUser, Menu } from "lucide-react";
import MobileNav from "./mobile-nav";
import Image from "next/image";
import {
  DEFAULT_LOGIN_REDIRECT,
  MASTER_ROUTES,
  PICTURES,
  PINJAMAN_PETUGAS_ROUTES,
  PINJAMAN_USER_ROUTES,
  ROUTES,
  SIMPANAN_PETUGAS_ROUTES,
  SIMPANAN_USER_ROUTES,
} from "@/lib/constan";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import ButtonSignOut from "../button/button-signout";
import ButtonRefreshData from "../button/button-refresh-data";

export default async function TopNav() {
  const session = await auth();
  const userRole = session?.user.role;

  return (
    <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 md:px-10">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="top">
          <SheetHeader hidden>
            <SheetTitle>Are you absolutely sure?</SheetTitle>
          </SheetHeader>
          <nav className="grid gap-6 text-lg font-medium">
            <div className="flex items-center justify-center gap-2">
              <span className="text-md sm:text-base md:text-lg lg:text-xl">
                <div className="grid space-x-1 lg:grid-cols-2">
                  <p>Koperasi Karyawan</p>
                  <p>Yayasan Al Ghifari</p>
                </div>
              </span>
            </div>
            <MobileNav userRole={userRole!} />
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-2">
        <Image src={PICTURES.LOGO} width={60} height={60} alt="logo" />
        <div className="grid gap-1 sm:text-base lg:grid-cols-2 lg:text-lg">
          <p>Koperasi Karyawan</p>
          <p>Yayasan Al Ghifari</p>
        </div>
      </div>
      <div className="hidden items-center space-x-4 font-medium md:block">
        <Button asChild variant="ghost">
          <Link href={DEFAULT_LOGIN_REDIRECT} className="font-semibold">
            Dashboard
          </Link>
        </Button>
        {userRole != "USER" ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="font-semibold">
                Petugas
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Menu Petugas</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={ROUTES.AUTH.PETUGAS.DASHBOARD} className="w-full">
                  Dashboard Petugas
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <span>Data Master</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {MASTER_ROUTES.map((item) => (
                        <DropdownMenuItem asChild key={item.href}>
                          <Link href={item.href} className="w-full">
                            {item.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              {userRole != "SEKRETARIS" ? (
                <>
                  <DropdownMenuGroup>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <span>Simpanan Anggota</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          {SIMPANAN_PETUGAS_ROUTES.map((item) => (
                            <DropdownMenuItem asChild key={item.href}>
                              <Link href={item.href} className="w-full">
                                {item.name}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>
                  <DropdownMenuGroup>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <span>Pinjaman Anggota</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          {PINJAMAN_PETUGAS_ROUTES.map((item) => (
                            <DropdownMenuItem asChild key={item.href}>
                              <Link href={item.href} className="w-full">
                                {item.name}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href={ROUTES.AUTH.PETUGAS.POTONG_GAJI}
                      className="w-full"
                    >
                      Potongan Gaji
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={ROUTES.AUTH.PETUGAS.LAPORAN} className="w-full">
                      Laporan
                    </Link>
                  </DropdownMenuItem>
                </>
              ) : null}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={ROUTES.AUTH.PETUGAS.NOTIFIKASI} className="w-full">
                  Kirim Notifikasi
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={ROUTES.AUTH.PETUGAS.UNDUR_DIRI_ANGGOTA}
                  className="w-full"
                >
                  Pengunduran Anggota
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="font-semibold">
              Simpanan
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuLabel>List Simpanan</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {SIMPANAN_USER_ROUTES.map((item) => (
              <DropdownMenuItem asChild key={item.name}>
                <Link href={item.href} className="w-full">
                  {item.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="font-semibold">
              Pinjaman
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuLabel>List Pinjaman</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {PINJAMAN_USER_ROUTES.map((item) => (
              <DropdownMenuItem asChild key={item.name}>
                <Link href={item.href} className="w-full">
                  {item.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center gap-2">
        <p className="hidden md:block">{session?.user?.name}</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <ButtonRefreshData />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={ROUTES.AUTH.USER.SETTING} className="w-full">
                Setting
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={ROUTES.AUTH.USER.PROFILE} className="w-full">
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={ROUTES.AUTH.USER.UNDUR_DIRI} className="w-full">
                Undur Diri
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <ButtonSignOut />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
