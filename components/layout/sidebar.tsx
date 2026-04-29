"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ChevronRight,
  Files,
  GraduationCap,
  LayoutDashboard,
  PanelsTopLeft,
  Sparkles,
  Users,
} from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { cn } from "@/lib/utils/cn";

const navigation = [
  { href: "/crm", label: "Dashboard", icon: LayoutDashboard, helper: "Today" },
  { href: "/crm/students", label: "Students", icon: Users, helper: "Profiles" },
  { href: "/crm/pipeline", label: "Pipeline", icon: PanelsTopLeft, helper: "Stages" },
  { href: "/crm/documents", label: "Documents", icon: Files, helper: "Reviews" },
  { href: "/crm/scholarships", label: "Scholarships", icon: GraduationCap, helper: "Matches" },
];

export function Sidebar({ unreadCount }: { unreadCount: number }) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[220px] border-r border-border bg-[#0c1220]/95 backdrop-blur lg:block">
      <div className="flex h-full flex-col">
        <div className="border-b border-border px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-white shadow-[0_0_40px_rgba(59,130,246,0.25)]">
              <Sparkles className="size-4" />
            </div>
            <div>
              <p className="font-display text-base font-semibold">Enrollio</p>
              <p className="text-xs text-text-secondary">Internal CRM</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-4">
          <div className="rounded-xl border border-border bg-white/[0.02] px-3 py-3">
            <p className="text-[11px] uppercase tracking-[0.24em] text-text-muted">Workspace</p>
            <p className="mt-2 text-sm font-medium">Lahore Operations</p>
            <p className="mt-1 text-xs text-text-secondary">Admin operations and document review in one place.</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-text-secondary hover:bg-white/[0.04] hover:text-white",
                  isActive && "bg-primary-dim text-white shadow-[inset_0_0_0_1px_rgba(59,130,246,0.2)]",
                )}
              >
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-lg border border-transparent bg-white/[0.03]",
                    isActive && "border-blue-500/20 bg-blue-500/12",
                  )}
                >
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{item.label}</p>
                  <p className="truncate text-[11px] text-text-muted">{item.helper}</p>
                </div>
                {item.href === "/crm" && unreadCount > 0 ? (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] text-white">{unreadCount}</span>
                ) : (
                  <ChevronRight className="size-4 opacity-0 transition group-hover:opacity-100" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border px-4 py-4">
          <div className="space-y-3 rounded-xl border border-border bg-card px-3 py-3">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/12 text-emerald-300">
                <Bell className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Realtime active</p>
                <p className="text-xs text-text-secondary">{unreadCount} unread updates in queue</p>
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>
    </aside>
  );
}
