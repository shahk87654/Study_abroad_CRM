"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/utils/schemas";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ADMIN_EMAIL } from "@/lib/auth/admin";
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
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        setError("root", { message: "Invalid admin credentials." });
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
          <p className="font-medium text-foreground">Admin access only</p>
          <p className="mt-2 text-text-secondary">Email: {ADMIN_EMAIL}</p>
        </div>
      </Card>
    </main>
  );
}
