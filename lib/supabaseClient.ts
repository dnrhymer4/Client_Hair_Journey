import { createClient } from "@supabase/supabase-js";

// Fallback empty strings prevent build-time crash;
// real values are injected at runtime via Vercel environment variables.
const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL     ?? "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
