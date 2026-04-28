function required(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const supabaseEnv = {
  url: () => required("NEXT_PUBLIC_SUPABASE_URL"),
  anonKey: () => required("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
};
