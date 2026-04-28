"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { formatRelative } from "@/lib/utils/format";
import { useToast } from "@/components/ui/toast-provider";
import type { MessageRecord, UserProfile } from "@/types";

export function MessagesThread({
  initialMessages,
  studentId,
  currentUser,
}: {
  initialMessages: MessageRecord[];
  studentId: string;
  currentUser: UserProfile;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [body, setBody] = useState("");
  const [isPending, startTransition] = useTransition();
  const { push } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const channel = supabase
      .channel(`messages:${studentId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `student_id=eq.${studentId}` },
        (payload) => {
          setMessages((current) => [...current, payload.new as MessageRecord]);
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [studentId]);

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card">
      <div ref={scrollRef} className="scrollbar-thin flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((message) => {
          const own = message.sender_id === currentUser.id;
          return (
            <div key={message.id} className={own ? "ml-auto max-w-[80%]" : "max-w-[80%]"}>
              <div className={own ? "rounded-2xl rounded-br-md bg-primary p-3" : "rounded-2xl rounded-bl-md bg-surface p-3"}>
                <p className="text-sm">{message.body}</p>
              </div>
              <p className="mt-1 text-xs text-text-secondary">{formatRelative(message.created_at)}</p>
            </div>
          );
        })}
      </div>
      <div className="border-t border-border p-4">
        <div className="flex items-end gap-3">
          <Textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="Write a message..." />
          <Button
            size="icon"
            onClick={() => {
              startTransition(async () => {
                const response = await fetch("/api/messages", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ student_id: studentId, body, document_id: null }),
                });

                if (!response.ok) {
                  push("Message send failed", "error");
                  return;
                }

                setBody("");
                push("Message sent", "success");
              });
            }}
            disabled={!body.trim() || isPending}
            aria-label="Send message"
          >
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
