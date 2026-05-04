"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { stageDefinitions } from "@/lib/utils/constants";
import { formatDate, getStudentName } from "@/lib/utils/format";
import { useToast } from "@/components/ui/toast-provider";
import type { Student } from "@/types";

export function StudentsTable({ students }: { students: Student[] }) {
  const router = useRouter();
  const { push } = useToast();

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/students/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete student");
      }

      push("Student deleted", "success");
      router.refresh();
    } catch (error) {
      push("Delete failed", "error");
    }
  };
  return (
    <Card className="crm-panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="crm-section-title">Student Directory</h2>
          <p className="mt-1 text-sm text-text-secondary">High-signal scan view for admin operations.</p>
        </div>
        <div className="rounded-full border border-border px-3 py-1 text-xs text-text-secondary">{students.length} records</div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/[0.03] text-text-secondary">
            <tr>
              <th className="px-5 py-3 font-medium">Student</th>
              <th className="px-5 py-3 font-medium">Target country</th>
              <th className="px-5 py-3 font-medium">Stage</th>
              <th className="px-5 py-3 font-medium">IELTS</th>
              <th className="px-5 py-3 font-medium">Docs</th>
              <th className="px-5 py-3 font-medium">Progress</th>
              <th className="px-5 py-3 font-medium">Created</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const approvedDocs = student.documents?.filter((doc) => doc.status === "approved").length ?? 0;
              const totalDocs = student.documents?.length ?? 0;
              const progress = ((student.current_stage + 1) / 10) * 100;

              return (
                <tr key={student.id} className="border-t border-border hover:bg-white/[0.02]">
                  <td className="px-5 py-4">
                    <Link href={`/crm/students?studentId=${student.id}`} className="font-medium hover:text-primary">
                      {getStudentName(student.first_name, student.last_name)}
                    </Link>
                    <div className="mt-1 flex items-center gap-2 text-xs text-text-secondary">
                      <span>{student.student_code}</span>
                      <span className="size-1 rounded-full bg-border-active" />
                      <span>{student.program_interest ?? "Program pending"}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-text-secondary">{student.country_preferences.join(", ") || "Not set"}</td>
                  <td className="px-5 py-4">
                    <Badge className="border-blue-500/30 bg-blue-500/10 text-blue-100">
                      {stageDefinitions[student.current_stage].label}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">{student.ielts_score ?? "N/A"}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-emerald-400" />
                      <span className="text-xs text-text-secondary">
                        {approvedDocs}/{totalDocs} approved
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="w-32">
                      <div className="mb-2 flex items-center justify-between text-[11px] text-text-muted">
                        <span>{student.current_stage + 1}/10</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-surface">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-text-secondary">{formatDate(student.created_at)}</td>
                  <td className="px-5 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-text-muted hover:text-danger"
                      onClick={() => handleDelete(student.id, getStudentName(student.first_name, student.last_name))}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
