import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireApiUser } from "@/lib/supabase/permissions";
import { apiError } from "@/lib/utils/api";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    await requireApiUser();
    const supabase = createSupabaseServerClient();
    const { data: document, error } = await supabase.from("documents").select("storage_path").eq("id", params.id).single();

    if (error || !document) {
      return apiError(error?.message ?? "Document not found", "NOT_FOUND", 404);
    }

    const { data, error: signedUrlError } = await supabase.storage
      .from("student-documents")
      .createSignedUrl(document.storage_path, 60);

    if (signedUrlError || !data) {
      return apiError(signedUrlError?.message ?? "Signed URL failed", "SIGNED_URL_FAILED", 400);
    }

    return NextResponse.json({ url: data.signedUrl });
  } catch (error) {
    return apiError(error instanceof Error ? error.message : "Unexpected error", "SERVER_ERROR", 500);
  }
}
