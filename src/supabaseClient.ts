// src/supabaseClient.ts
// import { createClient, SupabaseClient } from "@supabase/supabase-js";

// const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL as string;
// const supabaseKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    // don’t remember sessions across reloads
    persistSession: true,
    // don’t try silent-refresh in the background
    autoRefreshToken: true,
    // don’t parse the URL for OAuth return on load
    detectSessionInUrl: true,
  },
});