import type { UserProfile } from "@/types";

export const TEST_AUTH_COOKIE = "gg_test_admin";
export const TEST_ADMIN_EMAIL = "testadmin@globalgrads.local";
export const TEST_ADMIN_PASSWORD = "GlobalGrads123!";
export const TEST_ADMIN_ID = "00000000-0000-0000-0000-000000000001";

export const TEST_ADMIN_PROFILE: UserProfile = {
  id: TEST_ADMIN_ID,
  email: TEST_ADMIN_EMAIL,
  full_name: "Test Admin",
  role: "admin",
  avatar_url: null,
  created_at: new Date(0).toISOString(),
};

export function isTestAdminCredentials(email: string, password: string) {
  return email === TEST_ADMIN_EMAIL && password === TEST_ADMIN_PASSWORD;
}
