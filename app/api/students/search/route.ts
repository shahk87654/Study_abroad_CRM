
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireApiUser } from "@/lib/supabase/permissions";
import { apiError } from "@/lib/utils/api";

export async function GET(request: NextRequest) {
  try {
    await requireApiUser();
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return apiError("Student code is required", "INVALID_INPUT", 400);
    }

    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("students")
      .select("id")
      .eq("student_code", code.toUpperCase())
      .single();

    if (error || !data) {
      return apiError("Student not found", "NOT_FOUND", 404);
    }

    return NextResponse.json(data);
  } catch (error) {
    return apiError(error instanceof Error ? error.message : "Unexpected error", "SERVER_ERROR", 500);
  }
}
