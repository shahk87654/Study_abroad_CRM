import { getCurrentUserProfile, requireUser } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { UserProfile } from "@/types";

export async function requireApiUser() {
  const user = await requireUser();
  const profile = await getCurrentUserProfile();

  if (!profile) {
    throw new Error("Profile not found");
  }

  return { user, profile };
}

export async function canAccessStudent(profile: UserProfile, studentId: string) {
  if (profile.role === "admin") {
    return true;
  }

  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("students")
    .select("id, assigned_counsellor_id")
    .eq("id", studentId)
    .single();

  if (!data) {
    return false;
  }

  if (profile.role === "counsellor") {
    return data.assigned_counsellor_id === profile.id;
  }

  return profile.id === studentId;
}
