
"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, X, User, FileText, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";

export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { push } = useToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // This is just a placeholder, the parent handles it
      }
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const search = query.trim().toUpperCase();
    if (!search) return;

    startTransition(async () => {
      if (search.startsWith("EN-")) {
        const response = await fetch(`/api/students/search?code=${search}`);
        if (response.ok) {
          const student = await response.json();
          if (student?.id) {
            router.push(`/crm/students?studentId=${student.id}`);
            setQuery("");
            onClose();
            return;
          }
        }
      }
      router.push(`/crm/students?q=${encodeURIComponent(query)}`);
      setQuery("");
      onClose();
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-[15vh] backdrop-blur-sm transition-all animate-in fade-in duration-200">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117] shadow-2xl animate-in zoom-in-95 duration-200">
        <form onSubmit={handleSearch} className="flex items-center border-b border-white/5 p-4">
          <Search className="size-5 text-text-muted" />
          <input
            autoFocus
            className="ml-3 flex-1 bg-transparent text-lg text-foreground outline-none placeholder:text-text-muted"
            placeholder="Search student code (EN-001), name, or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isPending}
          />
          <button
            type="button"
            onClick={onClose}
            className="ml-3 rounded-md p-1 hover:bg-white/5"
          >
            <X className="size-5 text-text-muted" />
          </button>
        </form>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.length > 0 ? (
            <div className="space-y-1">
              <button
                type="submit"
                onClick={handleSearch}
                className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-white/5"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {query.toUpperCase().startsWith("EN-") ? <User className="size-5" /> : <Search className="size-5" />}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="font-medium text-foreground">
                    {query.toUpperCase().startsWith("EN-") ? `Lookup ID: ${query.toUpperCase()}` : `Search for "${query}"`}
                  </p>
                  <p className="truncate text-xs text-text-secondary">
                    {query.toUpperCase().startsWith("EN-") ? "View full profile and documents" : "Filter student directory"}
                  </p>
                </div>
                <ArrowRight className="size-4 text-text-muted" />
              </button>
            </div>
          ) : (
            <div className="p-6 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-white/5 text-text-muted">
                <Search className="size-6" />
              </div>
              <h3 className="mt-4 font-medium text-foreground">Search Enrollio</h3>
              <p className="mt-1 text-sm text-text-secondary">
                Find students by their unique EN-000 ID, name, or email address.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <span className="rounded-md bg-white/5 px-2 py-1 text-[11px] text-text-secondary">
                  <kbd className="font-sans">ESC</kbd> to close
                </span>
                <span className="rounded-md bg-white/5 px-2 py-1 text-[11px] text-text-secondary">
                  <kbd className="font-sans">Enter</kbd> to jump
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-white/5 bg-white/[0.02] px-4 py-3 text-[11px] text-text-muted">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <User className="size-3" />
              <span>Students</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileText className="size-3" />
              <span>Documents</span>
            </div>
          </div>
          <p>Enrollio Global Search</p>
        </div>
      </div>
      <div className="fixed inset-0 -z-10" onClick={onClose} />
    </div>
  );
}
