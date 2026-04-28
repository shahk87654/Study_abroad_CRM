"use client";

import { useEffect, useMemo } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function useSupabaseChannel(channelName: string, onSubscribe: (supabase: ReturnType<typeof createSupabaseBrowserClient>) => () => void) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  useEffect(() => onSubscribe(supabase), [channelName, onSubscribe, supabase]);
}
