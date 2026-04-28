import { EmptyState } from "@/components/ui/empty-state";
import { Topbar } from "@/components/layout/topbar";
import { ProfilePanel } from "@/components/profile/profile-panel";
import { StudentDirectory } from "@/components/students/student-directory";
import { StudentForm } from "@/components/students/student-form";
import { getStudentMessages } from "@/lib/queries/messages";
import { getStudents, getStudentById, getStudentTimeline } from "@/lib/queries/students";
import { getCurrentUserProfile } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: { studentId?: string };
}) {
  const [students, currentUser] = await Promise.all([getStudents(), getCurrentUserProfile()]);
  const supabase = createSupabaseServerClient();
  const { data: counsellors } = await supabase.from("users").select("*").eq("role", "counsellor");

  const selectedId = searchParams.studentId;
  const selectedStudent = selectedId ? await getStudentById(selectedId) : null;
  const timeline = selectedStudent ? await getStudentTimeline(selectedStudent.id) : [];
  const messages = selectedStudent ? await getStudentMessages(selectedStudent.id) : [];

  return (
    <main className="crm-shell min-h-screen">
      <Topbar title="Students" subtitle="Intake, profile management, and counsellor assignment." />
      <div className="space-y-6 px-4 py-6 lg:px-8">
        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <StudentForm counsellors={counsellors ?? []} />
          <aside className="crm-panel p-5">
            <p className="text-[11px] uppercase tracking-[0.24em] text-text-muted">Operating notes</p>
            <h2 className="mt-3 font-display text-2xl font-semibold">Keep intake fast and stage ownership obvious.</h2>
            <div className="mt-5 space-y-3 text-sm text-text-secondary">
              <p>Capture country preference, test score, and counsellor in the first pass so the profile is immediately usable.</p>
              <p>Use the directory below as the working queue, then open the side panel for documents, applications, and message history.</p>
              <p>For the cleanest workflow, push incomplete records into the Documents stage instead of leaving notes scattered around the profile.</p>
            </div>
          </aside>
        </section>
        {students.length > 0 ? (
          <StudentDirectory students={students} />
        ) : (
          <EmptyState title="No students yet" description="Create the first student record to start the pipeline." />
        )}
      </div>
      {selectedStudent && currentUser ? (
        <ProfilePanel student={selectedStudent} timeline={timeline} messages={messages} currentUser={currentUser} />
      ) : null}
    </main>
  );
}
