
"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { CommandPalette } from "./command-palette";

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-11 w-full items-center gap-3 rounded-lg border border-border-active bg-white/[0.03] px-3 text-text-muted transition-colors hover:bg-white/[0.05] md:w-80"
      >
        <Search className="size-4" />
        <span className="flex-1 text-left text-sm">Quick ID lookup...</span>
        <kbd className="hidden rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-sans md:block">
          ⌘K
        </kbd>
      </button>

      <CommandPalette isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
