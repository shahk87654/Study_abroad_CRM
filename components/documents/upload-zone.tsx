"use client";

import { useId, useTransition } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast-provider";

export function UploadZone({
  studentId,
  category,
  title,
  compact = false,
  onUploaded,
}: {
  studentId: string;
  category: string;
  title?: string;
  compact?: boolean;
  onUploaded?: () => void;
}) {
  const inputId = useId();
  const { push } = useToast();
  const [isPending, startTransition] = useTransition();

  return (
    <div className={`rounded-xl border border-dashed border-border-active bg-surface ${compact ? "p-3" : "p-4"}`}>
      <label htmlFor={inputId} className="flex cursor-pointer items-center gap-3">
        <UploadCloud className="size-4 text-primary" />
        <div>
          <p className="text-sm font-medium">{title ?? `Upload ${category}`}</p>
          <p className="text-xs text-text-secondary">Private bucket via signed upload URL</p>
        </div>
      </label>
      <input
        id={inputId}
        type="file"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) {
            return;
          }

          startTransition(async () => {
            const response = await fetch("/api/documents/upload", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                studentId,
                category,
                fileName: file.name,
                contentType: file.type,
              }),
            });

            if (!response.ok) {
              push("Upload session failed", "error");
              return;
            }

            const data = (await response.json()) as {
              signedUrl: string;
              path: string;
              token: string;
              documentId: string;
            };

            const uploadResponse = await fetch(data.signedUrl, {
              method: "PUT",
              headers: {
                "Content-Type": file.type,
                "x-upsert": "false",
              },
              body: file,
            });

            if (!uploadResponse.ok) {
              push("File upload failed", "error");
              return;
            }

            push("Document uploaded", "success");
            onUploaded?.();
          });
        }}
      />
      <Button variant="ghost" size="sm" className="mt-4" disabled={isPending}>
        {isPending ? "Uploading..." : "Select file"}
      </Button>
    </div>
  );
}
