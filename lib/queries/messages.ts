import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { MessageRecord } from "@/types";

export async function getStudentMessages(studentId: string): Promise<MessageRecord[]> {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("messages")
    .select("*, sender:users!messages_sender_id_fkey(id, full_name, role)")
    .eq("student_id", studentId)
    .order("created_at", { ascending: true });

  return data ?? [];
}
