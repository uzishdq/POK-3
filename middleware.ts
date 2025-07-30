import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";
import {
  BENDAHARA_ROUTES,
  DEFAULT_API_URL,
  DEFAULT_AUTH,
  DEFAULT_LOGIN_REDIRECT,
  LOGIN_REQUIRED,
  PROTECTED_ROUTE,
  PUBLIC_API_URL,
  PUBLIC_ROUTES,
  ROUTES,
} from "./lib/constan";

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;

  const session = await auth();

  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);
  const isLoginRequired = nextUrl.pathname.startsWith(LOGIN_REQUIRED);
  const isAuthRoute = nextUrl.pathname.startsWith(DEFAULT_LOGIN_REDIRECT);
  const isApiAuth = nextUrl.pathname.startsWith(DEFAULT_AUTH);
  const isApiRoute = nextUrl.pathname.startsWith(DEFAULT_API_URL);
  const isPublicApi = nextUrl.pathname.startsWith(PUBLIC_API_URL);
  const isProtectedRoute = nextUrl.pathname.startsWith(PROTECTED_ROUTE);
  const isBendaharaRoute = BENDAHARA_ROUTES.includes(nextUrl.pathname);

  if (isPublicRoute) {
    if (session) {
      if (session?.user.statusUser === "APPROVED") {
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      } else if (session?.user.statusUser === "REJECTED") {
        return NextResponse.redirect(new URL(ROUTES.PUBLIC.LOGIN, nextUrl));
      }
    }
    return NextResponse.next();
  }

  if (isApiAuth || isPublicApi) {
    return NextResponse.next();
  } else if (!session && isApiRoute) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  if (isProtectedRoute && session?.user.role === "USER") {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  if (isBendaharaRoute && session?.user.role === "SEKRETARIS") {
    return NextResponse.redirect(
      new URL(ROUTES.AUTH.PETUGAS.DASHBOARD, nextUrl)
    );
  }

  if (isLoginRequired && session?.user.statusUser === "APPROVED") {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  if (isAuthRoute && session?.user.statusUser === "PENDING") {
    return NextResponse.redirect(new URL(LOGIN_REQUIRED, nextUrl));
  }

  if (!session || !session.user) {
    return NextResponse.redirect(new URL(ROUTES.PUBLIC.LOGIN, nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
