import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ScholarshipRule } from "@/types";

export async function getScholarships(): Promise<ScholarshipRule[]> {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from("scholarships").select("*").order("created_at", { ascending: false });

  return data ?? [];
}
