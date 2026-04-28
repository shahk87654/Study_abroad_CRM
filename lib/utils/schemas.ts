import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const magicLinkSchema = z.object({
  email: z.string().email(),
});

export const studentSchema = z.object({
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8).optional().or(z.literal("")),
  assigned_counsellor_id: z.string().uuid().nullable().optional(),
  ielts_score: z.coerce.number().min(0).max(9).nullable().optional(),
  gpa: z.coerce.number().min(0).max(4).nullable().optional(),
  passport_number: z.string().optional().or(z.literal("")),
  program_interest: z.string().optional().or(z.literal("")),
  country_preferences: z.array(z.string()).min(1),
  intake_term: z.string().optional().or(z.literal("")),
  private_notes: z.string().optional().or(z.literal("")),
});

export const stageUpdateSchema = z.object({
  studentId: z.string().uuid(),
  toStage: z.number().int().min(0).max(9),
  note: z.string().max(240).optional(),
});

export const documentUploadSchema = z.object({
  studentId: z.string().uuid(),
  category: z.string().min(2),
  fileName: z.string().min(1),
  contentType: z.string().min(3),
});

export const documentReviewSchema = z.object({
  status: z.enum(["approved", "rejected", "under_review"]),
  rejection_reason: z.string().max(300).optional(),
});

export const messageSchema = z.object({
  student_id: z.string().uuid(),
  body: z.string().min(1).max(2000),
  document_id: z.string().uuid().nullable().optional(),
});

export const applicationSchema = z.object({
  student_id: z.string().uuid(),
  university_name: z.string().min(2),
  program_name: z.string().min(2),
  country: z.string().min(2),
  deadline: z.string().optional().or(z.literal("")),
  decision_status: z.enum([
    "draft",
    "submitted",
    "under_review",
    "offer_received",
    "rejected",
    "visa_process",
    "closed",
  ]),
  notes: z.string().optional().or(z.literal("")),
  sync_stage: z.boolean().optional(),
});
