import { Topbar } from "@/components/layout/topbar";
import { KanbanBoard } from "@/components/pipeline/kanban-board";
import { getStudents } from "@/lib/queries/students";

export default async function PipelinePage() {
  const students = await getStudents();

  return (
    <main className="crm-shell min-h-screen">
      <Topbar title="Pipeline" subtitle="Drag students between stages and keep the journey current." />
      <div className="space-y-6 px-4 py-6 lg:px-8">
        <section className="crm-panel grid gap-4 p-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-text-muted">Pipeline control</p>
            <h2 className="mt-3 font-display text-3xl font-semibold">Move students deliberately, with enough context to trust every stage update.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-xl border border-border bg-white/[0.03] px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Stage 0-2</p>
              <p className="mt-2 text-sm font-medium">Intake, counselling, and document collection</p>
            </div>
            <div className="rounded-xl border border-border bg-white/[0.03] px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Stage 3-5</p>
              <p className="mt-2 text-sm font-medium">Applications, offers, and scholarship review</p>
            </div>
            <div className="rounded-xl border border-border bg-white/[0.03] px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Stage 6-9</p>
              <p className="mt-2 text-sm font-medium">Visa process through final enrollment</p>
            </div>
          </div>
        </section>
        <KanbanBoard initialStudents={students} />
      </div>
    </main>
  );
}
