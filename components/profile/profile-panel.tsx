"use client";

import { useState } from "react";
import { Download, Mail, MapPinned, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UploadZone } from "@/components/documents/upload-zone";
import { MessagesThread } from "@/components/profile/messages-thread";
import { TimelineTab } from "@/components/profile/timeline-tab";
import { AddApplicationForm } from "@/components/profile/add-application-form";
import { StageTracker } from "@/components/pipeline/stage-tracker";
import { stageDefinitions } from "@/lib/utils/constants";
import { formatDate, getStudentName } from "@/lib/utils/format";
import { useToast } from "@/components/ui/toast-provider";
import type { MessageRecord, StageHistoryEntry, Student, UserProfile } from "@/types";

const tabs = ["Overview", "Documents", "Applications", "Timeline", "Messages"] as const;

export function ProfilePanel({
  student,
  timeline,
  messages,
  currentUser,
}: {
  student: Student;
  timeline: StageHistoryEntry[];
  messages: MessageRecord[];
  currentUser: UserProfile;
}) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Overview");
  const [isAddingApp, setIsAddingApp] = useState(false);
  const { push } = useToast();

  const handleDownload = async (documentId: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}/download`);
      if (!response.ok) throw new Error("Failed to get download link");
      const { url } = await response.json();
      window.open(url, "_blank");
    } catch (error) {
      push("Download failed", "error");
    }
  };

  return (
    <aside className="fixed inset-y-0 right-0 z-40 w-full border-l border-border bg-[#0a0f1c] lg:w-[440px]">
      <div className="flex h-full flex-col">
        <div className="border-b border-border px-5 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate font-display text-2xl font-semibold">{getStudentName(student.first_name, student.last_name)}</p>
              <p className="mt-1 text-sm text-text-secondary">{student.student_code}</p>
            </div>
            <Button variant="secondary" size="icon" onClick={() => (window.location.href = "/crm/students")}>
              <X className="size-4" />
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge className="border-blue-500/30 bg-blue-500/10 text-blue-100">{stageDefinitions[student.current_stage].label}</Badge>
            <Badge className="border-border bg-surface text-text-secondary">{student.program_interest ?? "Program pending"}</Badge>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card px-3 py-3">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Mail className="size-4" />
                <span className="truncate">{student.email}</span>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card px-3 py-3">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Phone className="size-4" />
                <span>{student.phone ?? "Phone pending"}</span>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card px-3 py-3 sm:col-span-2">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <MapPinned className="size-4" />
                <span>{student.country_preferences.join(", ") || "Country preference pending"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-border px-4 py-3">
          <div className="grid grid-cols-5 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={
                  activeTab === tab
                    ? "rounded-lg bg-primary px-2 py-2 text-[11px] font-medium text-white"
                    : "rounded-lg px-2 py-2 text-[11px] text-text-secondary hover:bg-white/5"
                }
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="scrollbar-thin flex-1 overflow-y-auto p-5">
          {activeTab === "Overview" ? (
            <div className="space-y-4">
              <StageTracker stage={student.current_stage} />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="crm-panel p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Profile</p>
                  <div className="mt-3 space-y-2 text-sm">
                    <p>IELTS: {student.ielts_score ?? "N/A"}</p>
                    <p>GPA: {student.gpa ?? "N/A"}</p>
                    <p>Passport: {student.passport_number ?? "Not set"}</p>
                    <p>Joined: {formatDate(student.created_at)}</p>
                  </div>
                </div>
                <div className="crm-panel p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Planning</p>
                  <div className="mt-3 space-y-2 text-sm">
                    <p>Intake: {student.intake_term ?? "Not set"}</p>
                    <p>Owner: Admin</p>
                    <p className="text-text-secondary">{student.private_notes ?? "No internal notes yet."}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === "Documents" ? (
            <div className="space-y-4">
              <UploadZone studentId={student.id} category="passport" />
              {["passport", "transcript", "ielts", "financials"].map((category) => {
                const grouped = student.documents?.filter((document) => document.category === category) ?? [];
                return (
                  <div key={category} className="crm-panel p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-medium capitalize">{category}</h3>
                      <span className="text-xs text-text-secondary">{grouped.length} files</span>
                    </div>
                    <div className="space-y-3">
                      {grouped.map((document) => (
                        <div key={document.id} className="rounded-lg border border-border bg-[#0f1729] p-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="truncate text-sm" title={document.file_name}>{document.file_name}</p>
                            <div className="flex shrink-0 items-center gap-2">
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-text-muted hover:text-primary" onClick={() => handleDownload(document.id)}>
                                <Download className="size-3.5" />
                              </Button>
                              <Badge className="border-border-active bg-white/5 text-[10px] text-text-primary">{document.status}</Badge>
                            </div>
                          </div>
                          {document.rejection_reason ? <p className="mt-2 text-xs text-danger">{document.rejection_reason}</p> : null}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}

          {activeTab === "Applications" ? (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button onClick={() => setIsAddingApp(true)} disabled={isAddingApp} size="sm">
                  Add Application
                </Button>
              </div>
              
              {isAddingApp && (
                <AddApplicationForm studentId={student.id} onComplete={() => setIsAddingApp(false)} />
              )}
              
              <div className="space-y-3">
                {student.applications?.map((application) => (
                  <div key={application.id} className="crm-panel p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium">{application.university_name}</p>
                        <p className="mt-1 text-sm text-text-secondary">{application.program_name}</p>
                      </div>
                      <Badge className="border-border-active bg-white/5 text-text-primary">{application.decision_status}</Badge>
                    </div>
                    <p className="mt-3 text-sm text-text-secondary">Deadline: {formatDate(application.deadline)}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {activeTab === "Timeline" ? <TimelineTab history={timeline} documents={student.documents ?? []} messages={messages} /> : null}
          {activeTab === "Messages" ? <MessagesThread initialMessages={messages} studentId={student.id} currentUser={currentUser} /> : null}
        </div>
      </div>
    </aside>
  );
}
