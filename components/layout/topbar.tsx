import { Bell, Menu, Plus, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Topbar({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-[#0a0f1c]/88 backdrop-blur-xl">
      <div className="px-4 py-4 lg:px-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.24em] text-text-muted">Enrollio Operations</p>
            <div className="mt-2 flex items-end justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl font-semibold lg:text-[2rem]">{title}</h1>
                <p className="mt-1 max-w-2xl text-sm text-text-secondary">{subtitle}</p>
              </div>
              <Button variant="secondary" size="icon" className="xl:hidden" aria-label="Open navigation">
                <Menu className="size-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-[minmax(0,22rem)_auto_auto_auto] md:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
              <Input
                className="h-11 border-border-active bg-white/[0.03] pl-9"
                placeholder="Search students, programs, universities..."
              />
            </div>
            <Button variant="secondary" size="icon" aria-label="Filters" className="h-11 w-11">
              <SlidersHorizontal className="size-4" />
            </Button>
            <Button variant="secondary" size="icon" aria-label="Notifications" className="h-11 w-11">
              <Bell className="size-4" />
            </Button>
            <Button className="h-11 px-4">
              <Plus className="size-4" />
              Add Student
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
