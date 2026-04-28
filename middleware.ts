import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { TEST_AUTH_COOKIE } from "@/lib/supabase/test-auth";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
  const hasTestAdmin = request.cookies.get(TEST_AUTH_COOKIE)?.value === "1";

  if (request.nextUrl.pathname.startsWith("/crm") && hasTestAdmin) {
    return response;
  }

  if ((request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/magic-link") && hasTestAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/crm";
    return NextResponse.redirect(url);
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    if (request.nextUrl.pathname.startsWith("/crm")) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirectedFrom", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name) {
        return request.cookies.get(name)?.value;
      },
      set(name, value, options) {
        response.cookies.set({ name, value, ...options });
      },
      remove(name, options) {
        response.cookies.set({ name, value: "", ...options });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (request.nextUrl.pathname.startsWith("/crm") && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectedFrom", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if ((request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/magic-link") && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/crm";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/crm/:path*", "/login", "/magic-link"],
};
