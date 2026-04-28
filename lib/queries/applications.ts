import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ApplicationRecord } from "@/types";

export async function getApplicationsByStudent(studentId: string): Promise<ApplicationRecord[]> {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("applications")
    .select("*")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });

  return data ?? [];
}
