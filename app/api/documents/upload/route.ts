import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { canAccessStudent, requireApiUser } from "@/lib/supabase/permissions";
import { documentUploadSchema } from "@/lib/utils/schemas";
import { apiError } from "@/lib/utils/api";

export async function POST(request: NextRequest) {
  try {
    const { profile } = await requireApiUser();
    const payload = documentUploadSchema.safeParse(await request.json());

    if (!payload.success) {
      return apiError("Invalid upload payload", "INVALID_INPUT", 422);
    }

    if (!(await canAccessStudent(profile, payload.data.studentId))) {
      return apiError("Forbidden", "FORBIDDEN", 403);
    }

    const supabase = createSupabaseServerClient();
    const fileId = randomUUID();
    const path = `students/${payload.data.studentId}/${payload.data.category}/${fileId}-${payload.data.fileName}`;

    const { data: signedUpload, error: uploadError } = await supabase.storage
      .from("student-documents")
      .createSignedUploadUrl(path);

    if (uploadError || !signedUpload) {
      return apiError(uploadError?.message ?? "Upload URL failed", "SIGNED_URL_FAILED", 400);
    }

    const { data: document, error: insertError } = await supabase
      .from("documents")
      .insert({
        student_id: payload.data.studentId,
        category: payload.data.category,
        file_name: payload.data.fileName,
        storage_path: path,
        mime_type: payload.data.contentType,
        status: "uploaded",
      })
      .select("id")
      .single();

    if (insertError || !document) {
      return apiError(insertError?.message ?? "Document insert failed", "DOCUMENT_CREATE_FAILED", 400);
    }

    return NextResponse.json({
      documentId: document.id,
      path,
      signedUrl: signedUpload.signedUrl,
      token: signedUpload.token,
    });
  } catch (error) {
    return apiError(error instanceof Error ? error.message : "Unexpected error", "SERVER_ERROR", 500);
  }
}
