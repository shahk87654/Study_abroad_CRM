"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { studentSchema } from "@/lib/utils/schemas";
import { useToast } from "@/components/ui/toast-provider";
import { Spinner } from "@/components/ui/spinner";
import type { z } from "zod";

type FormValues = z.input<typeof studentSchema>;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-text-muted">{label}</span>
      {children}
    </label>
  );
}

export function StudentForm() {
  const [isPending, startTransition] = useTransition();
  const { push } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues, undefined, z.output<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      country_preferences: [""],
    },
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const payload = { ...values, country_preferences: values.country_preferences.filter(Boolean) };
      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        push("Unable to create student", "error");
        return;
      }

      push("Student created", "success");
      reset();
    });
  });

  return (
    <form onSubmit={onSubmit} className="crm-panel p-5 lg:p-6">
      <div className="flex flex-col gap-2 border-b border-border pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="crm-section-title">New Student Intake</h2>
          <p className="mt-1 text-sm text-text-secondary">Capture profile, destination, and test score in one pass.</p>
        </div>
        <p className="text-sm text-danger">{Object.values(errors)[0]?.message?.toString() ?? ""}</p>
      </div>

      <div className="mt-5 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="First name">
            <Input placeholder="Aiman" {...register("first_name")} />
          </Field>
          <Field label="Last name">
            <Input placeholder="Raza" {...register("last_name")} />
          </Field>
          <Field label="Email">
            <Input placeholder="student@email.com" type="email" {...register("email")} />
          </Field>
          <Field label="Phone">
            <Input placeholder="+92 300 0000000" {...register("phone")} />
          </Field>
          <Field label="IELTS">
            <Input placeholder="7.0" type="number" step="0.5" {...register("ielts_score")} />
          </Field>
          <Field label="GPA">
            <Input placeholder="3.4" type="number" step="0.1" {...register("gpa")} />
          </Field>
          <Field label="Passport number">
            <Input placeholder="AB1234567" {...register("passport_number")} />
          </Field>
          <Field label="Intake term">
            <Input placeholder="Fall 2026" {...register("intake_term")} />
          </Field>
        </div>

        <div className="grid gap-4">
          <Field label="Program">
            <Input placeholder="Masters in Data Science" {...register("program_interest")} />
          </Field>
          <Field label="Country preference">
            <Input placeholder="United Kingdom, Germany" {...register("country_preferences.0")} />
          </Field>
          <Field label="Private notes">
            <Textarea placeholder="Scholarship preference, budget notes, profile concerns..." {...register("private_notes")} />
          </Field>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end">
        <Button type="submit" disabled={isPending} className="min-w-36">
          {isPending ? <Spinner /> : null}
          Save student
        </Button>
      </div>
    </form>
  );
}
