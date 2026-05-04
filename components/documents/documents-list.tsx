"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast-provider";
import { formatDate } from "@/lib/utils/format";
import type { DocumentRecord } from "@/types";

type ListedDocument = DocumentRecord & { students?: { id: string; first_name: string; last_name: string; student_code: string } };

function DocumentRow({ document }: { document: ListedDocument }) {
  const router = useRouter();
  const { push } = useToast();
  const [isReviewing, setIsReviewing] = useState(false);

  const handleReview = async (status: "approved" | "rejected") => {
    setIsReviewing(true);
    try {
      const response = await fetch(`/api/documents/${document.id}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          rejection_reason: status === "rejected" ? (prompt("Enter rejection reason (optional):") || undefined) : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      push(`Document ${status}`, "success");
      router.refresh();
    } catch (error) {
      push(error instanceof Error ? error.message : "Failed to review document", "error");
    } finally {
      setIsReviewing(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/documents/${document.id}/download`);
      if (!response.ok) throw new Error("Failed to get download link");
      const { url } = await response.json();
      window.open(url, "_blank");
    } catch (error) {
      push("Download failed", "error");
    }
  };

  const needsReview = ["pending", "uploaded", "under_review"].includes(document.status);

  return (
    <div className="grid grid-cols-[1.3fr_1fr_1fr_1fr_auto] gap-3 px-4 py-4 text-sm items-center">
      <div>
        <p className="font-medium">{document.students?.student_code ?? "Unknown"}</p>
        <p className="mt-1 text-xs text-text-secondary truncate max-w-[200px]" title={document.file_name}>{document.file_name}</p>
      </div>
      <span className="capitalize">{document.category}</span>
      <div className="flex flex-col items-start gap-2">
        <Badge className="w-fit border-border-active bg-white/5 text-text-primary">{document.status}</Badge>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-text-muted hover:text-primary" onClick={handleDownload} title="Download/View">
            <Download className="size-3" />
          </Button>
          {needsReview ? (
            <>
              <Button size="sm" variant="secondary" onClick={() => handleReview("approved")} disabled={isReviewing} className="h-6 text-[10px] px-2 py-0">Approve</Button>
              <Button size="sm" variant="secondary" onClick={() => handleReview("rejected")} disabled={isReviewing} className="h-6 text-[10px] px-2 py-0 text-danger hover:text-danger">Reject</Button>
            </>
          ) : null}
        </div>
      </div>
      <span className="text-text-secondary">{formatDate(document.reviewed_at)}</span>
      <span className="max-w-52 text-text-secondary">{document.rejection_reason ?? "-"}</span>
    </div>
  );
}

export function DocumentsList({ documents }: { documents: ListedDocument[] }) {
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
          <DocumentRow key={document.id} document={document} />
        ))}
      </div>
    </Card>
  );
}
