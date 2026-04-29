import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/auth/admin";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const hasAdminSession = await verifyAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);

  if (request.nextUrl.pathname.startsWith("/crm") && hasAdminSession) {
    return response;
  }

  if (request.nextUrl.pathname === "/login" && hasAdminSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/crm";
    return NextResponse.redirect(url);
  }

  if (request.nextUrl.pathname.startsWith("/crm")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectedFrom", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/crm/:path*", "/login"],
};
