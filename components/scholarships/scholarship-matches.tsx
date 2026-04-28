import { Card } from "@/components/ui/card";
import { scholarshipCatalog } from "@/lib/utils/constants";
import { getStudentName } from "@/lib/utils/format";
import type { Student } from "@/types";

export function ScholarshipMatches({ students }: { students: Student[] }) {
  const matches = students.flatMap((student) =>
    scholarshipCatalog
      .filter(
        (scholarship) =>
          student.country_preferences.some((country) => country.toLowerCase().includes(scholarship.country.toLowerCase().split(" ")[0].toLowerCase())) &&
          (student.ielts_score ?? 0) >= scholarship.minIelts &&
          (student.program_interest ?? "").toLowerCase().includes(scholarship.degreeLevel.toLowerCase()),
      )
      .map((scholarship) => ({ student, scholarship })),
  );

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {matches.map(({ student, scholarship }) => (
        <Card key={`${student.id}-${scholarship.id}`} className="p-5">
          <p className="font-display text-lg font-semibold">{scholarship.name}</p>
          <p className="mt-1 text-sm text-text-secondary">{scholarship.summary}</p>
          <div className="mt-4 rounded-xl border border-border bg-surface p-4">
            <p className="font-medium">{getStudentName(student.first_name, student.last_name)}</p>
            <p className="mt-1 text-sm text-text-secondary">
              {student.program_interest ?? "Degree not set"} | IELTS {student.ielts_score ?? "N/A"}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
