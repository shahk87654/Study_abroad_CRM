import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireApiUser } from "@/lib/supabase/permissions";
import { documentReviewSchema } from "@/lib/utils/schemas";
import { apiError } from "@/lib/utils/api";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { profile } = await requireApiUser();
    if (!["admin", "counsellor"].includes(profile.role)) {
      return apiError("Forbidden", "FORBIDDEN", 403);
    }

    const payload = documentReviewSchema.safeParse(await request.json());
    if (!payload.success) {
      return apiError("Invalid review payload", "INVALID_INPUT", 422);
    }

    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("documents")
      .update({
        status: payload.data.status,
        rejection_reason: payload.data.status === "rejected" ? payload.data.rejection_reason ?? null : null,
        reviewer_id: profile.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select("*")
      .single();

    if (error) {
      return apiError(error.message, "REVIEW_FAILED", 400);
    }

    return NextResponse.json(data);
  } catch (error) {
    return apiError(error instanceof Error ? error.message : "Unexpected error", "SERVER_ERROR", 500);
  }
}
