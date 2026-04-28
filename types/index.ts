export type UserRole = "admin" | "counsellor" | "student";

export type StudentStageKey =
  | "new_lead"
  | "counselling"
  | "documents"
  | "applications"
  | "offer_received"
  | "scholarship"
  | "visa_filing"
  | "visa_interview"
  | "visa_approved"
  | "enrolled";

export type StudentStageValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type DocumentStatus = "pending" | "uploaded" | "under_review" | "approved" | "rejected";
export type ApplicationDecision =
  | "draft"
  | "submitted"
  | "under_review"
  | "offer_received"
  | "rejected"
  | "visa_process"
  | "closed";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
}

export interface Student {
  id: string;
  student_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  assigned_counsellor_id: string | null;
  current_stage: StudentStageValue;
  ielts_score: number | null;
  gpa: number | null;
  passport_number: string | null;
  program_interest: string | null;
  country_preferences: string[];
  intake_term: string | null;
  private_notes: string | null;
  created_at: string;
  updated_at: string;
  last_activity_at: string;
  assigned_counsellor?: Pick<UserProfile, "id" | "full_name" | "email"> | null;
  documents?: DocumentRecord[];
  applications?: ApplicationRecord[];
}

export interface Stage {
  id: string;
  stage_index: StudentStageValue;
  key: StudentStageKey;
  label: string;
  description: string;
  color_token: "primary" | "warning" | "success";
}

export interface StageHistoryEntry {
  id: string;
  student_id: string;
  from_stage: StudentStageValue | null;
  to_stage: StudentStageValue;
  changed_by: string;
  note: string | null;
  created_at: string;
  actor?: Pick<UserProfile, "id" | "full_name" | "role"> | null;
}

export interface ApplicationRecord {
  id: string;
  student_id: string;
  university_name: string;
  program_name: string;
  country: string;
  deadline: string | null;
  decision_status: ApplicationDecision;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentRecord {
  id: string;
  student_id: string;
  category: string;
  file_name: string;
  storage_path: string;
  mime_type: string;
  status: DocumentStatus;
  rejection_reason: string | null;
  reviewer_id: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface MessageRecord {
  id: string;
  student_id: string;
  sender_id: string;
  body: string;
  document_id: string | null;
  is_read: boolean;
  created_at: string;
  sender?: Pick<UserProfile, "id" | "full_name" | "role"> | null;
}

export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  visaApproved: number;
  docsPendingOrRejected: number;
}

export interface ScholarshipRule {
  id: string;
  name: string;
  country: string;
  minIelts: number;
  degreeLevel: string;
  summary: string;
}
