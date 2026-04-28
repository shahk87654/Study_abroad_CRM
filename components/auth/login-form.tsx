"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { loginSchema } from "@/lib/utils/schemas";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD, isTestAdminCredentials } from "@/lib/supabase/test-auth";
import type { z } from "zod";

type FormValues = z.infer<typeof loginSchema>;

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      if (isTestAdminCredentials(values.email, values.password)) {
        const demoResponse = await fetch("/api/auth/test-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!demoResponse.ok) {
          setError("root", { message: "Test admin login failed." });
          return;
        }

        router.push(redirectTo.startsWith("/crm") ? redirectTo : "/crm");
        router.refresh();
        return;
      }

      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword(values);

      if (error) {
        setError("root", { message: error.message });
        return;
      }

      router.push(redirectTo.startsWith("/crm") ? redirectTo : "/crm");
      router.refresh();
    });
  });

  return (
    <main className="surface-grid flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-text-secondary">Global Grads Consulting</p>
        <h1 className="mt-4 font-display text-3xl font-semibold">Sign in to the CRM</h1>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <Input placeholder="Email" type="email" {...register("email")} />
          <Input placeholder="Password" type="password" {...register("password")} />
          <p className="text-sm text-danger">{errors.root?.message ?? ""}</p>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <Spinner /> : null}
            Continue
          </Button>
        </form>
        <div className="mt-6 rounded-xl border border-border bg-surface p-4 text-sm">
          <p className="font-medium text-foreground">Test admin</p>
          <p className="mt-2 text-text-secondary">Email: {TEST_ADMIN_EMAIL}</p>
          <p className="text-text-secondary">Password: {TEST_ADMIN_PASSWORD}</p>
        </div>
        <p className="mt-6 text-sm text-text-secondary">
          Prefer a passwordless flow?{" "}
          <Link href="/magic-link" className="text-primary">
            Use a magic link
          </Link>
        </p>
      </Card>
    </main>
  );
}
