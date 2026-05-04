import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getNextStudentCode } from "@/lib/supabase/student-code";
import { requireApiUser } from "@/lib/supabase/permissions";
import { studentSchema } from "@/lib/utils/schemas";
import { apiError } from "@/lib/utils/api";

export async function POST(request: NextRequest) {
  try {
    const { profile } = await requireApiUser();
    if (profile.role !== "admin") {
      return apiError("Forbidden", "FORBIDDEN", 403);
    }

    const payload = studentSchema.safeParse(await request.json());
    if (!payload.success) {
      return apiError("Invalid student payload", "INVALID_INPUT", 422);
    }

    const supabase = createSupabaseServerClient();
    const studentCode = await getNextStudentCode();
    const { data, error } = await supabase
      .from("students")
      .insert({
        ...payload.data,
        phone: payload.data.phone || null,
        passport_number: payload.data.passport_number || null,
        program_interest: payload.data.program_interest || null,
        intake_term: payload.data.intake_term || null,
        private_notes: payload.data.private_notes || null,
        student_code: studentCode,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Database insert error:", error);
      return apiError(error.message, "CREATE_FAILED", 400);
    }

    await supabase.from("stage_history").insert({
      student_id: data.id,
      from_stage: null,
      to_stage: data.current_stage,
      changed_by: profile.id,
      note: "Student created",
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in POST /api/students:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", "UNAUTHORIZED", 401);
    }
    if (error instanceof Error && error.message === "Profile not found") {
      return apiError("Profile not found", "PROFILE_NOT_FOUND", 401);
    }
    return apiError(error instanceof Error ? error.message : "Unexpected error", "SERVER_ERROR", 500);
  }
}
