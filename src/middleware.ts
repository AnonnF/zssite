import { NextResponse, type NextRequest } from "next/server";

/**
 * Locale routing:
 * - `/en/...`   -> English (served as-is by app/[locale])
 * - `/zh/...`   -> redirected to the unprefixed canonical URL
 * - everything else -> internally rewritten to `/zh/...` (Chinese is the default locale)
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/zh" || pathname.startsWith("/zh/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/zh${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
