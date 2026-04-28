import { CheckCircle2, CircleAlert, FolderClock, Users2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { DashboardStats } from "@/types";

export function StatsGrid({ stats }: { stats: DashboardStats }) {
  const cards = [
    {
      label: "Total students",
      value: stats.totalStudents,
      helper: "All active and archived records",
      icon: Users2,
      tone: "text-blue-300 bg-blue-500/12",
    },
    {
      label: "Active students",
      value: stats.activeStudents,
      helper: "Currently in the pipeline",
      icon: FolderClock,
      tone: "text-amber-300 bg-amber-500/12",
    },
    {
      label: "Visa approved",
      value: stats.visaApproved,
      helper: "Reached approval stage",
      icon: CheckCircle2,
      tone: "text-emerald-300 bg-emerald-500/12",
    },
    {
      label: "Docs pending or rejected",
      value: stats.docsPendingOrRejected,
      helper: "Need manual review follow-up",
      icon: CircleAlert,
      tone: "text-rose-300 bg-rose-500/12",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.label} className="crm-panel p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-text-secondary">{card.label}</p>
                <p className="mt-3 font-display text-3xl font-semibold">{card.value}</p>
              </div>
              <div className={`flex size-11 items-center justify-center rounded-xl ${card.tone}`}>
                <Icon className="size-5" />
              </div>
            </div>
            <p className="mt-4 text-xs text-text-muted">{card.helper}</p>
          </Card>
        );
      })}
    </div>
  );
}
