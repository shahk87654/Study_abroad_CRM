import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { TEST_AUTH_COOKIE, TEST_ADMIN_PROFILE } from "@/lib/supabase/test-auth";
import type { UserProfile, UserRole } from "@/types";

export interface AppAuthUser {
  id: string;
  email: string;
}

export async function getCurrentSession() {
  const cookieStore = cookies();
  if (cookieStore.get(TEST_AUTH_COOKIE)?.value === "1") {
    return {
      user: {
        id: TEST_ADMIN_PROFILE.id,
        email: TEST_ADMIN_PROFILE.email,
      } satisfies AppAuthUser,
    };
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}

export async function requireUser() {
  const session = await getCurrentSession();

  if (!session?.user) {
    redirect("/login");
  }

  return session.user;
}

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const cookieStore = cookies();
  if (cookieStore.get(TEST_AUTH_COOKIE)?.value === "1") {
    return TEST_ADMIN_PROFILE;
  }

  const user = await requireUser();
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from("users").select("*").eq("id", user.id).single();
  return data;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const profile = await getCurrentUserProfile();

  if (!profile || !allowedRoles.includes(profile.role)) {
    redirect("/crm");
  }

  return profile;
}
