import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Optional persistence layer. HeritageHop must work fully without Supabase
// configured — every caller of getSupabaseClient() must handle `null` by
// falling back to local seed data / in-memory behavior.
let client: SupabaseClient | null | undefined;

export function getSupabaseClient(): SupabaseClient | null {
  if (client !== undefined) return client;

  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    client = null;
    return client;
  }

  try {
    client = createClient(url, anonKey);
  } catch {
    client = null;
  }
  return client;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
}
