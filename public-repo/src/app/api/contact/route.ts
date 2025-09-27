import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('=== Contact API Called ===');

    const { fullName, email, phoneNumber, message } = await request.json();

    // Validate required fields
    if (!fullName || !email || !message) {
      return NextResponse.json(
        { error: 'Full name, email, and message are required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const supabase = createServerSupabaseClient();

    // Insert contact data into Supabase
    const { data, error } = await supabase
      .from('contacts')
      .insert([
        {
          full_name: fullName.trim(),
          email: email.toLowerCase().trim(),
          phone_number: phoneNumber?.trim() || null,
          message: message.trim(),
          source: 'chat_bot',
          timestamp: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save contact information. Please try again.' },
        { status: 500 }
      );
    }

    console.log('Contact saved successfully:', data);

    return NextResponse.json(
      {
        success: true,
        message: 'Contact information saved successfully',
        contactId: data[0]?.id
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error('Error in contact API:', error);

    const err = error as { message?: string };

    return NextResponse.json(
      {
        error: 'Internal server error. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      },
      { status: 500 }
    );
  }
}