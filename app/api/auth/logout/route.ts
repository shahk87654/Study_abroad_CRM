import { NextResponse } from "next/server";
import { TEST_AUTH_COOKIE } from "@/lib/supabase/test-auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: TEST_AUTH_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
