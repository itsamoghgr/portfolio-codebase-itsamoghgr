import { NextRequest, NextResponse } from 'next/server';
import { supabase, type Contact } from '@/lib/supabase';

interface ContactData {
  fullName: string;
  email: string;
  phoneNumber: string;
  message: string;
  timestamp: string;
  source: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== Contact API Called ===');
    console.log('Supabase URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    console.log('Supabase URL preview:', process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 30) + '...');
    
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
        process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
      console.warn('Supabase not configured. Contact form submission skipped.');
      return NextResponse.json(
        { error: 'Database not configured. Please set up Supabase environment variables.' },
        { status: 503 }
      );
    }

    const contactData: ContactData = await request.json();
    
    // Validate required fields
    if (!contactData.fullName || !contactData.email || !contactData.message) {
      return NextResponse.json(
        { error: 'Missing required fields: fullName, email, and message are required' },
        { status: 400 }
      );
    }

    // Prepare data for Supabase (convert camelCase to snake_case)
    const supabaseContact: Omit<Contact, 'id' | 'created_at'> = {
      full_name: contactData.fullName,
      email: contactData.email,
      phone_number: contactData.phoneNumber || null,
      message: contactData.message,
      timestamp: contactData.timestamp || new Date().toISOString(),
      source: contactData.source || 'chatbot'
    };

    // Insert into Supabase
    const { data, error } = await supabase
      .from('contacts')
      .insert([supabaseContact])
      .select()
      .single();

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return NextResponse.json(
        { 
          error: 'Failed to save contact data', 
          details: error.message,
          code: error.code,
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 30) + '...'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Contact saved successfully',
        id: data.id
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error saving contact:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}