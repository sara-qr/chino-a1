import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

// Lazy: never access browser storage during server rendering.
export function getSupabaseClient(): SupabaseClient | null {
  if (typeof window === "undefined") return null;
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key?.startsWith("sb_publishable_")) return null;
  try {
    if (new URL(url).protocol !== "https:") return null;
    client = createClient(url, key, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
      global: {
        fetch: (input, init) => fetch(input, {
          ...init,
          signal: init?.signal ? AbortSignal.any([init.signal, AbortSignal.timeout(12000)]) : AbortSignal.timeout(12000),
        }),
      },
    });
    return client;
  } catch { return null; }
}
