import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { DocumentRecord } from "@/types";

export async function getDocuments() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("documents")
    .select("*, students(id, first_name, last_name, student_code)")
    .order("created_at", { ascending: false });

  return (data ?? []) as Array<DocumentRecord & { students?: { id: string; first_name: string; last_name: string; student_code: string } }>;
}
