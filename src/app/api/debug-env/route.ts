import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    // Server-side environment variables (preferred for API routes)
    serverSupabaseUrl: process.env.SUPABASE_URL ? 'SET' : 'NOT SET',
    serverSupabaseKey: process.env.SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
    
    // Client-side environment variables (fallback)
    clientSupabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
    clientSupabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
    
    // Final configuration status
    finalUrl: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT CONFIGURED',
    finalKey: (process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ? 'CONFIGURED' : 'NOT CONFIGURED',
    
    supabaseConfigured: !!((process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) && 
                          (process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)),
    
    isPlaceholder: (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) === 'https://placeholder.supabase.co'
  });
}