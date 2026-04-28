import { ToastProvider } from "@/components/ui/toast-provider";
import { Sidebar } from "@/components/layout/sidebar";
import { getCurrentUserProfile, requireUser } from "@/lib/supabase/auth";
import { getUnreadMessagesCount } from "@/lib/queries/dashboard";

export default async function CrmLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const profile = await getCurrentUserProfile();
  const unreadCount = await getUnreadMessagesCount(user.id);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background">
        <Sidebar unreadCount={unreadCount} />
        <div className="lg:pl-[220px]">
          <div className="border-b border-border px-4 py-3 text-xs uppercase tracking-[0.3em] text-text-secondary lg:px-8">
            {profile?.role ?? "user"}
          </div>
          {children}
        </div>
      </div>
    </ToastProvider>
  );
}
