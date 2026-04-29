import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, createAdminSessionToken, verifyAdminCredentials } from "@/lib/auth/admin";
import { apiError } from "@/lib/utils/api";

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as { email?: string; password?: string };

  if (!payload.email || !payload.password) {
    return apiError("Email and password are required", "INVALID_INPUT", 422);
  }

  if (!(await verifyAdminCredentials(payload.email, payload.password))) {
    return apiError("Invalid credentials", "INVALID_CREDENTIALS", 401);
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: await createAdminSessionToken(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return response;
}
