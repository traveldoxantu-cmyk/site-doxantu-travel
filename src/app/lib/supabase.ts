import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Guard: only initialise if credentials look like real values (http/https URLs)
const isValidUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl)) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('[Doxantu] Supabase non configuré — ajoutez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env.local');
}

export { supabase };
