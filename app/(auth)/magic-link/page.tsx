"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { magicLinkSchema } from "@/lib/utils/schemas";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { z } from "zod";

type FormValues = z.infer<typeof magicLinkSchema>;

export default function MagicLinkPage() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState("");
  const { register, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(magicLinkSchema),
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: values.email,
        options: {
          emailRedirectTo: `${window.location.origin}/crm`,
        },
      });

      setStatus(error ? error.message : "Magic link sent. Check your inbox.");
    });
  });

  return (
    <main className="surface-grid flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md p-8">
        <h1 className="font-display text-3xl font-semibold">Magic link login</h1>
        <p className="mt-2 text-sm text-text-secondary">Manual sign-in for counsellors, admins, and students.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <Input placeholder="Email" type="email" {...register("email")} />
          <Button type="submit" className="w-full" disabled={isPending}>
            Send magic link
          </Button>
        </form>
        <p className="mt-4 text-sm text-text-secondary">{status}</p>
        <Link href="/login" className="mt-4 inline-flex text-sm text-primary">
          Back to password login
        </Link>
      </Card>
    </main>
  );
}
