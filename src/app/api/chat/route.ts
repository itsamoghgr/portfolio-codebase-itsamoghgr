import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { buildResumeContext } from '@/lib/resumeContext';

// Initialize Groq client with fallback for build time
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'dummy-key-for-build',
});

export async function POST(request: NextRequest) {
  try {
    console.log('=== Chat API Called ===');

    // Check if Groq API key is configured
    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY not configured');
      return NextResponse.json(
        { error: 'Groq API not configured. Please set GROQ_API_KEY environment variable.' },
        { status: 503 }
      );
    }

    const { message, conversationHistory = [] } = await request.json();

    // Validate message
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Build resume context
    const resumeContext = buildResumeContext();

    // System prompt for the AI assistant
    const systemPrompt = `You are Amogh's professional AI assistant. Your role is to help visitors learn about Amogh G. Ramagiri's professional background, experience, projects, and career.

INSTRUCTIONS:
- Always respond as "Amogh's assistant"
- Be professional, friendly, conversational, and engaging
- RESPOND APPROPRIATELY to the user's input - don't be overly proactive
- For greetings (hi, hello, hey): Give a brief, friendly greeting and ask how you can help
- For specific questions: Provide detailed, relevant answers
- For vague questions: Ask clarifying questions to understand what they want to know
- Keep responses concise and well-formatted (2-4 sentences typically)
- Use bullet points, emojis, and clear formatting when listing multiple items
- Make responses interactive by asking follow-up questions
- Use specific details from the resume data when available
- If asked for contact info or how to get in touch, let them know you can help them contact Amogh directly through the chat
- Always maintain a professional but approachable tone

PROJECT LINKS PRIORITY:
- ALWAYS provide GitHub links, live demo links, or publication links when discussing projects
- When mentioning projects, include the relevant links from the resume data
- Format links clearly as clickable URLs
- Prioritize showing actual project links over just descriptions
- If a user asks about projects, lead with the links to let them explore directly

CONVERSATION GUIDELINES:
- For greetings (hi, hello, hey): "Hi! I'm Amogh's assistant. What would you like to know about him?" or "Hello! How can I help you learn about Amogh today?"
- For specific questions: Provide detailed answers with relevant information and links
- For project questions: Always include relevant GitHub/demo/publication links
- For contact questions (how to reach him, get in touch, hire him, collaborate): Let them know you can help them contact Amogh directly, and the system will provide a contact form
- For general/vague questions (like "tell me about Amogh"): Give a brief overview (2-3 sentences) and ask what specific aspect they're interested in (experience, projects, skills, education, etc.)
- For ending conversations (goodbye, thanks, that's all): Respond with appreciation like "Thank you for your interest in Amogh's profile! Feel free to reach out anytime if you have more questions or would like to connect with him directly."
- Don't provide comprehensive detailed information unless the user asks specific questions
- Always end with a clarifying question to guide the conversation (except for goodbye messages)

FORMATTING GUIDELINES:
- Use bullet points (•) for lists with proper spacing
- Keep responses professional and clean without emojis
- Break up long responses with clear sections using **headers** (sparingly)
- Add blank lines between sections for better readability
- Keep responses concise and well-spaced (avoid dense blocks of text)
- MINIMIZE use of **bold formatting** - only use for main section headers, not for every project name or detail
- Use clean, readable text instead of excessive markdown
- End responses with engaging follow-up questions
- Keep technical details accessible to non-technical visitors
- When appropriate, mention the resume: "For more details, you can view his full resume at /documents/amogh_ramagiri_resume_gen.pdf"
- Offer resume viewing when users ask for comprehensive information, contact details, or full background

RESPONSE STRUCTURE EXAMPLE FOR PROJECTS:
**Projects**

Here are some of Amogh's key projects with links:

• Student Performance ML Pipeline - https://github.com/itsamoghgr/mlproject_cloud_deployment
• Credit Card Fraud Detection - https://github.com/itsamoghgr/credit_card_fraud_detection
• Portfolio Website - https://github.com/itsamoghgr/portfolio (Live: https://itsamoghgr.com)

These showcase his ML and web development expertise.

Which project interests you most?

CONTACT RESPONSES:
- When users ask about contacting Amogh, respond with something like: "I'd be happy to help you get in touch with Amogh! Let me set up a contact form for you."
- Keep contact responses brief and let the system handle showing the form
- Don't provide detailed instructions about forms or buttons that may not be visible

IMPORTANT: Do NOT use **bold formatting** inside bullet points or project descriptions. Keep them clean and readable.

RESUME DATA:
${resumeContext}

Remember: You represent Amogh professionally, so maintain high quality responses that showcase his expertise while being approachable and conversational. Always prioritize showing links when discussing projects.`;

    // Prepare messages for Groq API
    const messages = [
      {
        role: 'system' as const,
        content: systemPrompt
      },
      // Include conversation history
      ...conversationHistory.map((msg: { role: string; content: string }) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      // Add current user message
      {
        role: 'user' as const,
        content: message
      }
    ];

    console.log('Sending request to Groq with model: llama-3.1-8b-instant');

    // Call Groq API
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
      top_p: 0.9,
      stream: false
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error('No response generated from Groq API');
    }

    console.log('Groq API response generated successfully');

    return NextResponse.json(
      {
        success: true,
        response: response.trim(),
        model: 'llama-3.1-8b-instant'
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error('Error in chat API:', error);

    // Handle specific Groq API errors
    const err = error as { status?: number; message?: string };

    if (err?.status === 401) {
      return NextResponse.json(
        { error: 'Groq API authentication failed. Please check API key.' },
        { status: 401 }
      );
    }

    if (err?.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a moment.' },
        { status: 429 }
      );
    }

    if (err?.status === 400) {
      return NextResponse.json(
        { error: 'Invalid request to Groq API. Please try again.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Internal server error. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      },
      { status: 500 }
    );
  }
}