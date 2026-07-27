import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getServerEnv } from "@/lib/env";

let client: SupabaseClient | null = null;

export function getSupabaseServerClient(): SupabaseClient | null {
  const env = getServerEnv();
  if (!env) return null;

  if (!client) {
    client = createClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.SUPABASE_SECRET_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );
  }

  return client;
}
