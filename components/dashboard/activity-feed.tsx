import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { stageDefinitions } from "@/lib/utils/constants";
import { formatRelative } from "@/lib/utils/format";
import type { StageHistoryEntry } from "@/types";

export function ActivityFeed({ items }: { items: StageHistoryEntry[] }) {
  return (
    <Card className="crm-panel p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="crm-section-title">Activity Feed</h2>
          <p className="mt-1 text-sm text-text-secondary">Latest movement across the admissions pipeline.</p>
        </div>
        <div className="rounded-full border border-border px-3 py-1 text-xs text-text-secondary">Live</div>
      </div>

      <div className="mt-6 space-y-4">
        {items.map((item) => {
          const stage = stageDefinitions[item.to_stage];
          return (
            <div key={item.id} className="grid grid-cols-[auto_1fr] gap-4">
              <div className="flex flex-col items-center">
                <div className="mt-1 flex size-9 items-center justify-center rounded-full bg-blue-500/12 text-blue-300">
                  <ArrowUpRight className="size-4" />
                </div>
                <div className="mt-2 h-full w-px bg-border" />
              </div>
              <div className="pb-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-medium">{stage.label}</p>
                  <span className="text-xs text-text-secondary">{formatRelative(item.created_at)}</span>
                </div>
                <p className="mt-1 text-sm text-text-secondary">
                  {item.actor?.full_name ?? "System"} moved a student into {stage.label}.
                </p>
                {item.note ? <p className="mt-2 text-xs text-text-muted">{item.note}</p> : null}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
