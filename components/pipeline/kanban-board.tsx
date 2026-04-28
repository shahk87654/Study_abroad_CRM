"use client";

import type { DragEvent } from "react";
import { useMemo, useState, useTransition } from "react";
import { GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { stageDefinitions } from "@/lib/utils/constants";
import { getStudentName } from "@/lib/utils/format";
import { useToast } from "@/components/ui/toast-provider";
import type { Student } from "@/types";

export function KanbanBoard({ initialStudents }: { initialStudents: Student[] }) {
  const [students, setStudents] = useState(initialStudents);
  const [isPending, startTransition] = useTransition();
  const { push } = useToast();

  const groups = useMemo(
    () =>
      stageDefinitions.map((stage) => ({
        ...stage,
        students: students.filter((student) => student.current_stage === stage.stage_index),
      })),
    [students],
  );

  return (
    <div className="grid gap-4 xl:grid-cols-5">
      {groups.map((group) => (
        <Card
          key={group.id}
          className="crm-panel min-h-[360px] p-4"
          onDragOver={(event: DragEvent<HTMLDivElement>) => event.preventDefault()}
          onDrop={(event: DragEvent<HTMLDivElement>) => {
            const studentId = event.dataTransfer.getData("studentId");
            const student = students.find((item) => item.id === studentId);
            if (!student || student.current_stage === group.stage_index) {
              return;
            }

            if (!window.confirm(`Move ${getStudentName(student.first_name, student.last_name)} to ${group.label}?`)) {
              return;
            }

            startTransition(async () => {
              const response = await fetch(`/api/students/${studentId}/stage`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ studentId, toStage: group.stage_index }),
              });

              if (!response.ok) {
                push("Stage update failed", "error");
                return;
              }

              setStudents((current) =>
                current.map((item) => (item.id === studentId ? { ...item, current_stage: group.stage_index } : item)),
              );
              push("Stage updated", "success");
            });
          }}
        >
          <div className="mb-4 border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display text-base font-semibold">{group.label}</p>
                <p className="mt-1 text-xs text-text-secondary">{group.description}</p>
              </div>
              <Button size="sm" variant="ghost" disabled={isPending}>
                {group.students.length}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {group.students.map((student) => (
              <div
                key={student.id}
                draggable
                onDragStart={(event) => event.dataTransfer.setData("studentId", student.id)}
                className="rounded-xl border border-border bg-[#0f1729] p-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.015)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{getStudentName(student.first_name, student.last_name)}</p>
                    <p className="mt-1 text-xs text-text-secondary">{student.student_code}</p>
                  </div>
                  <GripVertical className="mt-0.5 size-4 text-text-muted" />
                </div>
                <div className="mt-4 space-y-1 text-xs text-text-secondary">
                  <p>{student.country_preferences.join(", ") || "No country preference"}</p>
                  <p>{student.program_interest ?? "Program pending"}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
