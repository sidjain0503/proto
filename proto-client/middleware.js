import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/pricing", "/login", "/signup"];
const AUTH_PATHS = ["/login", "/signup"];

export const middleware = (request) => {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const isPublic = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
  const isAuthPage = AUTH_PATHS.some((path) => pathname.startsWith(path));
  const isAppRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/chat") ||
    pathname.startsWith("/documents") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/usage") ||
    pathname.startsWith("/chains") ||
    pathname.startsWith("/models") ||
    pathname.startsWith("/prompts");

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isAppRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!isPublic && !isAppRoute && !isAuthPage) {
    return NextResponse.next();
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
