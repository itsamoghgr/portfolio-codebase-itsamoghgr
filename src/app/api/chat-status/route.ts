import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize Groq client with fallback for build time
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'dummy-key-for-build',
});

export async function GET(request: NextRequest) {
  try {
    console.log('=== Chat Status Check ===');

    // Check if Groq API key is configured
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'dummy-key-for-build') {
      console.error('GROQ_API_KEY not configured');
      return NextResponse.json(
        {
          status: 'offline',
          error: 'API key not configured',
          message: 'Chatbot is currently offline due to missing configuration.'
        },
        { status: 200 }
      );
    }

    // Make a simple test request to check if the API is working
    const testCompletion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'user',
          content: 'test'
        }
      ],
      max_tokens: 10,
      temperature: 0.1,
    });

    if (testCompletion.choices[0]?.message?.content) {
      console.log('Chat API is online and responsive');
      return NextResponse.json(
        {
          status: 'online',
          message: 'Chatbot is online and ready to help!',
          model: 'llama-3.1-8b-instant'
        },
        { status: 200 }
      );
    } else {
      throw new Error('No response from Groq API');
    }

  } catch (error: unknown) {
    console.error('Chat status check failed:', error);

    // Handle specific Groq API errors
    const err = error as { status?: number; message?: string };

    let statusMessage = 'Chatbot is temporarily offline. Please try again later.';

    if (err?.status === 401) {
      statusMessage = 'Chatbot is offline due to authentication issues.';
    } else if (err?.status === 429) {
      statusMessage = 'Chatbot is temporarily unavailable due to high demand.';
    } else if (err?.status === 400) {
      statusMessage = 'Chatbot is experiencing technical difficulties.';
    }

    return NextResponse.json(
      {
        status: 'offline',
        error: err.message || 'API request failed',
        message: statusMessage
      },
      { status: 200 }
    );
  }
}