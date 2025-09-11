import { createClient } from '@supabase/supabase-js';

// Client-side Supabase (for frontend use)
const clientSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const clientSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(clientSupabaseUrl, clientSupabaseAnonKey);

// Server-side Supabase (for API routes)
export const createServerSupabaseClient = () => {
  const serverSupabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const serverSupabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
  
  return createClient(serverSupabaseUrl, serverSupabaseKey);
};

export interface Contact {
  id?: number;
  full_name: string;
  email: string;
  phone_number?: string | null;
  message: string;
  timestamp: string;
  source: string;
  created_at?: string;
}