import { NextResponse } from "next/server";

export function apiError(error: string, code: string, status = 400) {
  return NextResponse.json({ error, code }, { status });
}
