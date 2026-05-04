"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { DocumentsList } from "@/components/documents/documents-list";
import { UploadZone } from "@/components/documents/upload-zone";
import { Input } from "@/components/ui/input";
import type { DocumentRecord, Student } from "@/types";

type ListedDocument = DocumentRecord & {
  students?: { id: string; first_name: string; last_name: string; student_code: string };
};

const categories = ["passport", "transcript", "ielts", "financials"];

export function DocumentsWorkspace({
  documents,
  students,
}: {
  documents: ListedDocument[];
  students: Student[];
}) {
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id ?? "");
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) {
      return documents;
    }

    return documents.filter((document) => {
      const code = document.students?.student_code.toLowerCase() ?? "";
      return (
        code.includes(search) ||
        document.category.toLowerCase().includes(search) ||
        document.file_name.toLowerCase().includes(search) ||
        (document.rejection_reason ?? "").toLowerCase().includes(search)
      );
    });
  }, [documents, query]);

  return (
    <div className="space-y-6">
      <section className="crm-panel grid gap-4 p-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-text-muted">Review workspace</p>
          <h2 className="mt-3 font-display text-2xl font-semibold">Upload directly from document review and keep every file tied to a student ID.</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Select a student, choose a category, and upload into the private storage bucket without leaving the review screen.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-text-muted">Quick Jump (ID)</span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="EN-001..."
                className="h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm text-foreground outline-none focus:border-primary"
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    const search = (e.target as HTMLInputElement).value.trim().toUpperCase();
                    const student = students.find((s) => s.student_code.toUpperCase() === search);
                    if (student) {
                      setSelectedStudentId(student.id);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }
                }}
              />
            </div>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-text-muted">Student selector</span>
            <select
              value={selectedStudentId}
              onChange={(event) => setSelectedStudentId(event.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground"
            >
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.student_code} - {student.first_name} {student.last_name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-text-muted">Category</span>
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <div className="md:col-span-2">
            {selectedStudentId ? (
              <UploadZone
                studentId={selectedStudentId}
                category={selectedCategory}
                title={`Upload ${selectedCategory} for ${students.find((student) => student.id === selectedStudentId)?.student_code ?? "student"}`}
              />
            ) : null}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="crm-panel p-4">
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="pl-9"
              placeholder="Search by EN-001, file name, category, or rejection reason"
            />
          </div>
        </div>
        <DocumentsList documents={filtered} />
      </section>
    </div>
  );
}
