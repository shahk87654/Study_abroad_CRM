"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { StudentsTable } from "@/components/students/students-table";
import type { Student } from "@/types";

export function StudentDirectory({ students, initialQuery = "" }: { students: Student[]; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) {
      return students;
    }

    return students.filter((student) => {
      const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
      return (
        fullName.includes(search) ||
        (student.student_code ?? "").toLowerCase().includes(search) ||
        (student.email ?? "").toLowerCase().includes(search) ||
        (student.country_preferences ?? []).join(" ").toLowerCase().includes(search)
      );
    });
  }, [query, students]);

  return (
    <section className="space-y-4">
      <div className="crm-panel p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,24rem)_1fr] lg:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="pl-9"
              placeholder="Search by student name, email, or EN-001 ID"
            />
          </div>
          <div className="text-sm text-text-secondary">
            Each student has a unique searchable ID like <span className="font-medium text-foreground">EN-001</span>. Open any row to review profile details and uploaded documents.
          </div>
        </div>
      </div>
      <StudentsTable students={filtered} />
    </section>
  );
}
