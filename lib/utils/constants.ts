import type { ScholarshipRule, Stage } from "@/types";

export const stageDefinitions: Stage[] = [
  { id: "stage-0", stage_index: 0, key: "new_lead", label: "New Lead", description: "Initial inquiry and registration.", color_token: "primary" },
  { id: "stage-1", stage_index: 1, key: "counselling", label: "Counselling", description: "Profile evaluation and shortlist.", color_token: "primary" },
  { id: "stage-2", stage_index: 2, key: "documents", label: "Documents", description: "Document collection and validation.", color_token: "warning" },
  { id: "stage-3", stage_index: 3, key: "applications", label: "Applications", description: "University applications in progress.", color_token: "warning" },
  { id: "stage-4", stage_index: 4, key: "offer_received", label: "Offer Received", description: "Offer letters received.", color_token: "success" },
  { id: "stage-5", stage_index: 5, key: "scholarship", label: "Scholarship", description: "Scholarship opportunities under review.", color_token: "primary" },
  { id: "stage-6", stage_index: 6, key: "visa_filing", label: "Visa Filing", description: "Visa documents being filed.", color_token: "warning" },
  { id: "stage-7", stage_index: 7, key: "visa_interview", label: "Visa Interview", description: "Interview scheduling and prep.", color_token: "warning" },
  { id: "stage-8", stage_index: 8, key: "visa_approved", label: "Visa Approved", description: "Visa decision approved.", color_token: "success" },
  { id: "stage-9", stage_index: 9, key: "enrolled", label: "Enrolled", description: "Student enrolled and journey closed.", color_token: "success" },
];

