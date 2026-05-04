import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { canAccessStudent, requireApiUser } from "@/lib/supabase/permissions";
import { studentSchema } from "@/lib/utils/schemas";
import { apiError } from "@/lib/utils/api";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { profile } = await requireApiUser();
    if (!(await canAccessStudent(profile, params.id))) {
      return apiError("Forbidden", "FORBIDDEN", 403);
    }

    const payload = studentSchema.partial().safeParse(await request.json());
    if (!payload.success) {
      return apiError("Invalid student payload", "INVALID_INPUT", 422);
    }

    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("students")
      .update(payload.data)
      .eq("id", params.id)
      .select("*")
      .single();

    if (error) {
      return apiError(error.message, "UPDATE_FAILED", 400);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in PATCH /api/students/[id]:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", "UNAUTHORIZED", 401);
    }
    if (error instanceof Error && error.message === "Profile not found") {
      return apiError("Profile not found", "PROFILE_NOT_FOUND", 401);
    }
    return apiError(error instanceof Error ? error.message : "Unexpected error", "SERVER_ERROR", 500);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { profile } = await requireApiUser();
    if (profile.role !== "admin") {
      return apiError("Forbidden", "FORBIDDEN", 403);
    }

    const supabase = createSupabaseServerClient();
    const { error } = await supabase
      .from("students")
      .delete()
      .eq("id", params.id);

    if (error) {
      return apiError(error.message, "DELETE_FAILED", 400);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/students/[id]:", error);
    return apiError(error instanceof Error ? error.message : "Unexpected error", "SERVER_ERROR", 500);
  }
}
