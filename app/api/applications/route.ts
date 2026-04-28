import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { canAccessStudent, requireApiUser } from "@/lib/supabase/permissions";
import { applicationSchema } from "@/lib/utils/schemas";
import { apiError } from "@/lib/utils/api";

export async function POST(request: NextRequest) {
  try {
    const { profile } = await requireApiUser();
    const payload = applicationSchema.safeParse(await request.json());

    if (!payload.success) {
      return apiError("Invalid application payload", "INVALID_INPUT", 422);
    }

    if (!(await canAccessStudent(profile, payload.data.student_id))) {
      return apiError("Forbidden", "FORBIDDEN", 403);
    }

    const supabase = createSupabaseServerClient();
    const { sync_stage, ...application } = payload.data;
    const { data, error } = await supabase.from("applications").insert({
      ...application,
      deadline: application.deadline || null,
      notes: application.notes || null,
    }).select("*").single();

    if (error) {
      return apiError(error.message, "APPLICATION_FAILED", 400);
    }

    if (sync_stage) {
      const stage = payload.data.decision_status === "submitted" ? 3 : payload.data.decision_status === "offer_received" ? 4 : null;
      if (stage !== null) {
        await supabase.from("students").update({ current_stage: stage }).eq("id", payload.data.student_id);
        await supabase.from("stage_history").insert({
          student_id: payload.data.student_id,
          from_stage: null,
          to_stage: stage,
          changed_by: profile.id,
          note: `Synced from application status: ${payload.data.decision_status}`,
        });
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    return apiError(error instanceof Error ? error.message : "Unexpected error", "SERVER_ERROR", 500);
  }
}
