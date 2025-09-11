import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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