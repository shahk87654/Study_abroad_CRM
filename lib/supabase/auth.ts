import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ADMIN_PROFILE, ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/auth/admin";
import type { UserProfile, UserRole } from "@/types";

export interface AppAuthUser {
  id: string;
  email: string;
}

export async function getCurrentSession() {
  const cookieStore = cookies();
  if (await verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)) {
    return {
      user: {
        id: ADMIN_PROFILE.id,
        email: ADMIN_PROFILE.email,
      } satisfies AppAuthUser,
    };
  }

  return null;
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
  if (await verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)) {
    return ADMIN_PROFILE;
  }

  return null;
}

export async function requireApiAuth() {
  const session = await getCurrentSession();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return session.user;
}
