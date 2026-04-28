import { NextRequest, NextResponse } from "next/server";
import { isTestAdminCredentials, TEST_AUTH_COOKIE } from "@/lib/supabase/test-auth";
import { apiError } from "@/lib/utils/api";

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as { email?: string; password?: string };

  if (!payload.email || !payload.password) {
    return apiError("Email and password are required", "INVALID_INPUT", 422);
  }

  if (!isTestAdminCredentials(payload.email, payload.password)) {
    return apiError("Invalid credentials", "INVALID_CREDENTIALS", 401);
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: TEST_AUTH_COOKIE,
    value: "1",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return response;
}
