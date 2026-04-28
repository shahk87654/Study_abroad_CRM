import { Topbar } from "@/components/layout/topbar";
import { LiveScholarships } from "@/components/scholarships/live-scholarships";
import { getStudents } from "@/lib/queries/students";

export default async function ScholarshipsPage() {
  const students = await getStudents();

  return (
    <main className="crm-shell min-h-screen">
      <Topbar title="Scholarships" subtitle="Live matching based on current student profile, IELTS score, and destination plan." />
      <div className="px-4 py-6 lg:px-8">
        <LiveScholarships students={students} />
      </div>
    </main>
  );
}
