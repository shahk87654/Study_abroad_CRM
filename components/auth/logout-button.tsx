"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="secondary"
      className="w-full justify-start"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          try {
            await fetch("/api/auth/logout", {
              method: "POST",
            });
          } catch {}

          try {
            const supabase = createSupabaseBrowserClient();
            await supabase.auth.signOut();
          } catch {}

          router.push("/login");
          router.refresh();
        });
      }}
    >
      {isPending ? <Spinner /> : <LogOut className="size-4" />}
      Logout
    </Button>
  );
}
