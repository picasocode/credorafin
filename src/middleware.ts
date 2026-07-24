import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "credora_admin_session";
const PUBLIC_ADMIN_PATHS = ["/admin/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only guard /admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Allow access to login page and API routes
  if (PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(COOKIE_NAME)?.value;

  if (!sessionCookie) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const decoded = JSON.parse(Buffer.from(sessionCookie, "base64").toString("utf-8"));
    if (!decoded.exp || decoded.exp < Date.now()) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("expired", "1");
      return NextResponse.redirect(loginUrl);
    }
    // Inject user info into request headers for server components
    const response = NextResponse.next();
    response.headers.set("x-admin-user-id", decoded.id ?? "");
    response.headers.set("x-admin-user-role", decoded.role ?? "");
    return response;
  } catch {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
