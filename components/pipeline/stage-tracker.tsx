import { Button } from "@/components/ui/button";
import { stageDefinitions } from "@/lib/utils/constants";
import { cn } from "@/lib/utils/cn";
import type { StudentStageValue } from "@/types";

export function StageTracker({ stage }: { stage: StudentStageValue }) {
  return (
    <section className="crm-panel p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="crm-section-title">Stage Tracker</h3>
          <p className="mt-1 text-sm text-text-secondary">Clear handoff view from intake to visa approval.</p>
        </div>
        <Button size="sm">Advance Stage</Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {stageDefinitions.map((item) => {
          const state = item.stage_index < stage ? "completed" : item.stage_index === stage ? "active" : "pending";
          return (
            <div
              key={item.id}
              className={cn(
                "rounded-xl border px-3 py-3",
                state === "completed" && "border-emerald-500/25 bg-emerald-500/10",
                state === "active" && "border-blue-500/25 bg-blue-500/10 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.15)]",
                state === "pending" && "border-border bg-surface",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Stage {item.stage_index}</p>
                <span
                  className={cn(
                    "size-2 rounded-full",
                    state === "completed" && "bg-emerald-400",
                    state === "active" && "bg-blue-400",
                    state === "pending" && "bg-slate-600",
                  )}
                />
              </div>
              <p className="mt-3 font-medium">{item.label}</p>
              <p className="mt-1 text-xs text-text-secondary">{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
