"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { getStudentName } from "@/lib/utils/format";
import type { ScholarshipRule, Student } from "@/types";

function matchScholarships(student: Student, scholarships: ScholarshipRule[]) {
  return scholarships.filter((scholarship) => {
    const countryMatch =
      scholarship.country === "Europe" ||
      student.country_preferences.some((country) =>
        country.toLowerCase().includes(scholarship.country.toLowerCase().split(" ")[0].toLowerCase()),
      );
    const ieltsMatch = (student.ielts_score ?? 0) >= scholarship.min_ielts;
    const degreeMatch = (student.program_interest ?? "").toLowerCase().includes(scholarship.degree_level.toLowerCase());
    return countryMatch && ieltsMatch && degreeMatch;
  });
}

export function LiveScholarships({ students, scholarships }: { students: Student[], scholarships: ScholarshipRule[] }) {
  const [query, setQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");

  const rows = useMemo(() => {
    const search = query.trim().toLowerCase();

    return students
      .map((student) => ({
        student,
        matches: matchScholarships(student, scholarships),
      }))
      .filter(({ student, matches }) => {
        const searchOk =
          !search ||
          student.student_code.toLowerCase().includes(search) ||
          getStudentName(student.first_name, student.last_name).toLowerCase().includes(search) ||
          (student.program_interest ?? "").toLowerCase().includes(search);

        const countryOk =
          countryFilter === "all" ||
          student.country_preferences.some((country) => country.toLowerCase().includes(countryFilter.toLowerCase()));

        return searchOk && countryOk && matches.length > 0;
      });
  }, [countryFilter, query, students, scholarships]);

  return (
    <div className="space-y-6">
      <section className="crm-panel grid gap-4 p-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-text-muted">Live matching</p>
          <h2 className="mt-3 font-display text-2xl font-semibold">Scholarship fit updates instantly as you search students and filter destination plans.</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Use it as a working shortlist, not a brochure. Every row below reflects the current student profile in the CRM.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="pl-9"
              placeholder="Search by EN-001, student name, or program"
            />
          </div>
          <select
            value={countryFilter}
            onChange={(event) => setCountryFilter(event.target.value)}
            className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-foreground"
          >
            <option value="all">All countries</option>
            <option value="united kingdom">United Kingdom</option>
            <option value="germany">Germany</option>
            <option value="europe">Europe</option>
            <option value="netherlands">Netherlands</option>
          </select>
          <div className="rounded-xl border border-border bg-white/[0.03] px-4 py-4">
            <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Matched students</p>
            <p className="mt-2 font-display text-3xl font-semibold">{rows.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-white/[0.03] px-4 py-4">
            <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Scholarship options</p>
            <p className="mt-2 font-display text-3xl font-semibold">
              {rows.reduce((sum, row) => sum + row.matches.length, 0)}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        {rows.map(({ student, matches }) => (
          <Card key={student.id} className="crm-panel p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-text-muted">{student.student_code}</p>
                <h3 className="mt-2 font-display text-xl font-semibold">{getStudentName(student.first_name, student.last_name)}</h3>
                <p className="mt-1 text-sm text-text-secondary">
                  {student.program_interest ?? "Program not set"} | IELTS {student.ielts_score ?? "N/A"}
                </p>
              </div>
              <div className="rounded-full border border-border px-3 py-1 text-xs text-text-secondary">
                {matches.length} matches
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {matches.map((scholarship) => (
                <div key={`${student.id}-${scholarship.id}`} className="rounded-xl border border-border bg-[#0f1729] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-medium">{scholarship.name}</p>
                    <span className="text-xs text-text-secondary">{scholarship.country}</span>
                  </div>
                  <p className="mt-2 text-sm text-text-secondary">{scholarship.summary}</p>
                  <p className="mt-3 text-xs text-text-muted">Minimum IELTS {scholarship.min_ielts} | {scholarship.degree_level}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
