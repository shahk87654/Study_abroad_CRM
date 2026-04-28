import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { canAccessStudent, requireApiUser } from "@/lib/supabase/permissions";
import { stageUpdateSchema } from "@/lib/utils/schemas";
import { apiError } from "@/lib/utils/api";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { profile } = await requireApiUser();
    if (!(await canAccessStudent(profile, params.id))) {
      return apiError("Forbidden", "FORBIDDEN", 403);
    }

    const payload = stageUpdateSchema.safeParse(await request.json());
    if (!payload.success) {
      return apiError("Invalid stage payload", "INVALID_INPUT", 422);
    }

    const supabase = createSupabaseServerClient();
    const { data: current } = await supabase.from("students").select("current_stage").eq("id", params.id).single();

    const { data, error } = await supabase
      .from("students")
      .update({ current_stage: payload.data.toStage })
      .eq("id", params.id)
      .select("*")
      .single();

    if (error) {
      return apiError(error.message, "STAGE_UPDATE_FAILED", 400);
    }

    await supabase.from("stage_history").insert({
      student_id: params.id,
      from_stage: current?.current_stage ?? null,
      to_stage: payload.data.toStage,
      changed_by: profile.id,
      note: payload.data.note ?? null,
    });

    return NextResponse.json(data);
  } catch (error) {
    return apiError(error instanceof Error ? error.message : "Unexpected error", "SERVER_ERROR", 500);
  }
}
