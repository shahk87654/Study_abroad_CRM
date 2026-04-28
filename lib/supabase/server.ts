import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseEnv } from "@/lib/supabase/env";
import { TEST_AUTH_COOKIE } from "@/lib/supabase/test-auth";

export function createSupabaseServerClient() {
  const cookieStore = cookies();
  const isTestAdmin = cookieStore.get(TEST_AUTH_COOKIE)?.value === "1";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (isTestAdmin && serviceRoleKey) {
    return createClient(supabaseEnv.url(), serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return createServerClient(supabaseEnv.url(), supabaseEnv.anonKey(), {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value;
      },
      set(name, value, options) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {}
      },
      remove(name, options) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {}
      },
    },
  });
}
