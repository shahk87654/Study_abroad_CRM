import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { DashboardStats, StageHistoryEntry, Student } from "@/types";

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createSupabaseServerClient();
  const [{ count: totalStudents }, { count: activeStudents }, { count: visaApproved }, { count: docsPendingOrRejected }] =
    await Promise.all([
      supabase.from("students").select("*", { count: "exact", head: true }),
      supabase.from("students").select("*", { count: "exact", head: true }).lt("current_stage", 9),
      supabase.from("students").select("*", { count: "exact", head: true }).eq("current_stage", 8),
      supabase.from("documents").select("*", { count: "exact", head: true }).in("status", ["pending", "rejected"]),
    ]);

  return {
    totalStudents: totalStudents ?? 0,
    activeStudents: activeStudents ?? 0,
    visaApproved: visaApproved ?? 0,
    docsPendingOrRejected: docsPendingOrRejected ?? 0,
  };
}

export async function getRecentActivity(limit = 12): Promise<StageHistoryEntry[]> {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("stage_history")
    .select("*, actor:users!stage_history_changed_by_fkey(id, full_name, role)")
    .order("created_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}

export async function getPipelineDistribution(): Promise<Array<{ current_stage: number; count: number }>> {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from("students").select("current_stage");
  const bucket = new Map<number, number>();

  for (const row of data ?? []) {
    bucket.set(row.current_stage, (bucket.get(row.current_stage) ?? 0) + 1);
  }

  return Array.from(bucket.entries()).map(([current_stage, count]) => ({ current_stage, count }));
}

export async function getUnreadMessagesCount(userId: string) {
  const supabase = createSupabaseServerClient();
  const { count } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .neq("sender_id", userId)
    .eq("is_read", false);

  return count ?? 0;
}

export async function getStudentsLite(): Promise<Student[]> {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("students")
    .select("*, documents(id, status), assigned_counsellor:users!students_assigned_counsellor_id_fkey(id, full_name, email)")
    .order("last_activity_at", { ascending: false });

  return data ?? [];
}
