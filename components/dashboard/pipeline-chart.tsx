import { Card } from "@/components/ui/card";
import { stageDefinitions } from "@/lib/utils/constants";

export function PipelineChart({ items }: { items: Array<{ current_stage: number; count: number }> }) {
  const max = Math.max(...items.map((item) => item.count), 1);
  const total = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="crm-panel p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="crm-section-title">Pipeline Distribution</h2>
          <p className="mt-1 text-sm text-text-secondary">Student volume by stage, from intake to enrollment.</p>
        </div>
        <div className="text-right">
          <p className="font-display text-2xl font-semibold">{total}</p>
          <p className="text-xs text-text-secondary">students</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {stageDefinitions.map((stage) => {
          const count = items.find((item) => item.current_stage === stage.stage_index)?.count ?? 0;

          return (
            <div key={stage.id}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-text-secondary">{stage.label}</span>
                <span className="font-medium">{count}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-surface">
                <div className="h-full rounded-full bg-primary" style={{ width: `${(count / max) * 100}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
