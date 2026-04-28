import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { canAccessStudent, requireApiUser } from "@/lib/supabase/permissions";
import { messageSchema } from "@/lib/utils/schemas";
import { apiError } from "@/lib/utils/api";

export async function POST(request: NextRequest) {
  try {
    const { profile } = await requireApiUser();
    const payload = messageSchema.safeParse(await request.json());
    if (!payload.success) {
      return apiError("Invalid message payload", "INVALID_INPUT", 422);
    }

    if (!(await canAccessStudent(profile, payload.data.student_id))) {
      return apiError("Forbidden", "FORBIDDEN", 403);
    }

    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("messages")
      .insert({
        ...payload.data,
        sender_id: profile.id,
        is_read: false,
      })
      .select("*")
      .single();

    if (error) {
      return apiError(error.message, "MESSAGE_FAILED", 400);
    }

    return NextResponse.json(data);
  } catch (error) {
    return apiError(error instanceof Error ? error.message : "Unexpected error", "SERVER_ERROR", 500);
  }
}
