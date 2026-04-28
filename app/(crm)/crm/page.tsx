import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { PipelineChart } from "@/components/dashboard/pipeline-chart";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { Topbar } from "@/components/layout/topbar";
import { getDashboardStats, getPipelineDistribution, getRecentActivity } from "@/lib/queries/dashboard";

export default async function DashboardPage() {
  const [stats, activity, distribution] = await Promise.all([
    getDashboardStats(),
    getRecentActivity(),
    getPipelineDistribution(),
  ]);

  return (
    <main className="crm-shell min-h-screen">
      <Topbar title="Dashboard" subtitle="Daily operating view for counsellors and admins." />
      <div className="space-y-6 px-4 py-6 lg:px-8">
        <section className="crm-panel grid gap-4 p-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-text-muted">Today at a glance</p>
            <h2 className="mt-3 font-display text-3xl font-semibold">Admissions work, document review, and stage movement in one control room.</h2>
            <p className="mt-3 max-w-2xl text-sm text-text-secondary">
              This view is meant for repeated daily use: what moved, what is blocked, and where counsellors should focus next.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-xl border border-border bg-white/[0.03] px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Priority</p>
              <p className="mt-2 text-sm font-medium">Rejected or pending documents</p>
            </div>
            <div className="rounded-xl border border-border bg-white/[0.03] px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Watchlist</p>
              <p className="mt-2 text-sm font-medium">Students ready for application submission</p>
            </div>
            <div className="rounded-xl border border-border bg-white/[0.03] px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Focus</p>
              <p className="mt-2 text-sm font-medium">Offer conversion and visa-file prep</p>
            </div>
          </div>
        </section>
        <StatsGrid stats={stats} />
        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
          <ActivityFeed items={activity} />
          <PipelineChart items={distribution} />
        </div>
      </div>
    </main>
  );
}
