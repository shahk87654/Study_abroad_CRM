import { Card } from "@/components/ui/card";
import { stageDefinitions } from "@/lib/utils/constants";
import { formatRelative } from "@/lib/utils/format";
import type { DocumentRecord, MessageRecord, StageHistoryEntry } from "@/types";

export function TimelineTab({
  history,
  documents,
  messages,
}: {
  history: StageHistoryEntry[];
  documents: DocumentRecord[];
  messages: MessageRecord[];
}) {
  const items = [
    ...history.map((item) => ({
      id: item.id,
      created_at: item.created_at,
      title: `Stage changed to ${stageDefinitions[item.to_stage].label}`,
      detail: item.actor?.full_name ?? "Unknown user",
    })),
    ...documents.map((document) => ({
      id: document.id,
      created_at: document.created_at,
      title: `${document.category} uploaded`,
      detail: document.file_name,
    })),
    ...messages.map((message) => ({
      id: message.id,
      created_at: message.created_at,
      title: "Message sent",
      detail: message.body,
    })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Card key={item.id} className="p-4">
          <div className="flex items-center justify-between gap-4">
            <p className="font-medium">{item.title}</p>
            <span className="text-xs text-text-secondary">{formatRelative(item.created_at)}</span>
          </div>
          <p className="mt-2 text-sm text-text-secondary">{item.detail}</p>
        </Card>
      ))}
    </div>
  );
}
