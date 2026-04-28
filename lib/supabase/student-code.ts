import { createSupabaseServiceClient } from "@/lib/supabase/service";

export async function getNextStudentCode() {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase.rpc("generate_student_code");

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to generate student code");
  }

  return data as string;
}
