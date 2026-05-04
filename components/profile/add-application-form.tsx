"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast-provider";

const formSchema = z.object({
  university_name: z.string().min(2, "University name is required"),
  program_name: z.string().min(2, "Program name is required"),
  country: z.string().min(2, "Country is required"),
  decision_status: z.enum([
    "draft",
    "submitted",
    "under_review",
    "offer_received",
    "rejected",
    "visa_process",
    "closed",
  ]),
  deadline: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  sync_stage: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export function AddApplicationForm({ studentId, onComplete }: { studentId: string; onComplete: () => void }) {
  const router = useRouter();
  const { push } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      university_name: "",
      program_name: "",
      country: "",
      decision_status: "draft",
      deadline: "",
      notes: "",
      sync_stage: true,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          student_id: studentId,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      push("Application added successfully", "success");
      onComplete();
      router.refresh();
    } catch (error) {
      push(error instanceof Error ? error.message : "Failed to add application", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="crm-panel p-4 mt-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-medium">New Application</h3>
        <button onClick={onComplete} className="text-xs text-text-secondary hover:text-white">
          Cancel
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-[0.18em] text-text-muted">University</label>
            <Input {...register("university_name")} placeholder="e.g. Oxford" />
            {errors.university_name ? <p className="mt-1 text-xs text-danger">{errors.university_name.message}</p> : null}
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-[0.18em] text-text-muted">Program</label>
            <Input {...register("program_name")} placeholder="e.g. MSc Computer Science" />
            {errors.program_name ? <p className="mt-1 text-xs text-danger">{errors.program_name.message}</p> : null}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-[0.18em] text-text-muted">Country</label>
            <Input {...register("country")} placeholder="e.g. United Kingdom" />
            {errors.country ? <p className="mt-1 text-xs text-danger">{errors.country.message}</p> : null}
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-[0.18em] text-text-muted">Status</label>
            <select
              {...register("decision_status")}
              className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="offer_received">Offer Received</option>
              <option value="rejected">Rejected</option>
              <option value="visa_process">Visa Process</option>
              <option value="closed">Closed</option>
            </select>
            {errors.decision_status ? <p className="mt-1 text-xs text-danger">{errors.decision_status.message}</p> : null}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs uppercase tracking-[0.18em] text-text-muted">Deadline</label>
          <Input type="date" {...register("deadline")} />
        </div>

        <div>
          <label className="mb-1 block text-xs uppercase tracking-[0.18em] text-text-muted">Notes</label>
          <Textarea {...register("notes")} placeholder="Any details..." className="min-h-[80px]" />
        </div>

        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("sync_stage")} />
          <span className="text-sm text-text-secondary">Sync student stage automatically</span>
        </label>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Add Application"}
          </Button>
        </div>
      </form>
    </div>
  );
}
