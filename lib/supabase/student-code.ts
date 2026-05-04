import { createSupabaseServiceClient } from "@/lib/supabase/service";

// Simple local counter for testing - replace with proper sequence when migration is applied
let localCounter = 1;

export async function getNextStudentCode() {
  // For now, use local counter until database function is available
  const code = `EN-${localCounter.toString().padStart(3, '0')}`;
  localCounter++;
  return code;
}
