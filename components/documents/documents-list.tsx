import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/format";
import type { DocumentRecord } from "@/types";

export function DocumentsList({
  documents,
}: {
  documents: Array<DocumentRecord & { students?: { id: string; first_name: string; last_name: string; student_code: string } }>;
}) {
  return (
    <Card className="crm-panel overflow-hidden">
      <div className="grid grid-cols-[1.3fr_1fr_1fr_1fr_auto] gap-3 border-b border-border bg-white/[0.03] px-4 py-3 text-xs uppercase tracking-wide text-text-secondary">
        <span>Student</span>
        <span>Category</span>
        <span>Status</span>
        <span>Reviewed</span>
        <span>Reason</span>
      </div>
      <div className="divide-y divide-border">
        {documents.map((document) => (
          <div key={document.id} className="grid grid-cols-[1.3fr_1fr_1fr_1fr_auto] gap-3 px-4 py-4 text-sm">
            <div>
              <p className="font-medium">{document.students?.student_code ?? "Unknown"}</p>
              <p className="mt-1 text-xs text-text-secondary">{document.file_name}</p>
            </div>
            <span className="capitalize">{document.category}</span>
            <Badge className="w-fit border-border-active bg-white/5 text-text-primary">{document.status}</Badge>
            <span className="text-text-secondary">{formatDate(document.reviewed_at)}</span>
            <span className="max-w-52 text-text-secondary">{document.rejection_reason ?? "-"}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
