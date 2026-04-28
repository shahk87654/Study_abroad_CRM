import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Student, StageHistoryEntry } from "@/types";

export async function getStudents() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("students")
    .select("*, documents(id, status), applications(*), assigned_counsellor:users!students_assigned_counsellor_id_fkey(id, full_name, email)")
    .order("created_at", { ascending: false });

  return (data ?? []) as Student[];
}

export async function getStudentById(id: string) {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("students")
    .select(
      "*, documents(*), applications(*), assigned_counsellor:users!students_assigned_counsellor_id_fkey(id, full_name, email)",
    )
    .eq("id", id)
    .single();

  return data as Student | null;
}

export async function getStudentTimeline(studentId: string): Promise<StageHistoryEntry[]> {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("stage_history")
    .select("*, actor:users!stage_history_changed_by_fkey(id, full_name, role)")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });

  return data ?? [];
}
