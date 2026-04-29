import { getCurrentUserProfile, requireUser } from "@/lib/supabase/auth";
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
  void studentId;
  return profile.role === "admin";
}
