import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/constan";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-xl font-semibold text-red-500">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-6 text-base leading-7 text-foreground">
          Maaf, kami tidak dapat menemukan halaman yang anda cari.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button>
            <Link href={DEFAULT_LOGIN_REDIRECT} className="w-full">
              Kembali
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
