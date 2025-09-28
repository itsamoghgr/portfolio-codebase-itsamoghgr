import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

// Google Calendar API setup - Service Account method
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;
const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || 'primary';

// Create Service Account auth
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/meetings.space.created'
  ],
});

const calendar = google.calendar({ version: 'v3', auth });

export async function POST(request: NextRequest) {
  try {
    // Check if Google Calendar credentials are configured
    if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
      console.error('Google Calendar credentials not configured');
      return NextResponse.json(
        { error: 'Google Calendar integration not configured. Please set up service account credentials.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const {
      attendeeEmail,
      attendeeName,
      meetingType,
      startTime,
      endTime,
      timezone = 'America/New_York',
      phoneNumber,
      contactMessage
    } = body;

    // Validate required fields
    if (!attendeeEmail || !attendeeName || !meetingType || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create meeting details
    const meetingTitle = meetingType === '15min'
      ? `Quick Call with ${attendeeName}`
      : `Project Discussion with ${attendeeName}`;

    // Build comprehensive meeting description with contact details
    let meetingDescription = `
Meeting scheduled through portfolio contact form.

ATTENDEE INFORMATION:
• Name: ${attendeeName}
• Email: ${attendeeEmail}`;

    if (phoneNumber) {
      meetingDescription += `\n• Phone: ${phoneNumber}`;
    }

    meetingDescription += `\n\nMEETING DETAILS:
• Type: ${meetingType === '15min' ? '15-minute call' : '30-minute project discussion'}
• Scheduled via: Portfolio chatbot`;

    if (contactMessage) {
      meetingDescription += `\n\nCONTACT MESSAGE:
"${contactMessage}"`;
    }

    meetingDescription += `\n\nDISCUSSION TOPICS:
- Project requirements and scope
- Collaboration opportunities
- Technical expertise and solutions

📞 Video call details will be shared before the meeting.
🔗 Meeting link: TBD`;

    meetingDescription = meetingDescription.trim();

    // Create calendar event with Google Meet
    const event = {
      summary: meetingTitle,
      description: meetingDescription + `\n\nAttendee: ${attendeeName} (${attendeeEmail})`,
      start: {
        dateTime: startTime,
        timeZone: timezone,
      },
      end: {
        dateTime: endTime,
        timeZone: timezone,
      },
      location: 'Video call (details will be shared by Amogh)',
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 24 hours before
          { method: 'popup', minutes: 30 }, // 30 minutes before
        ],
      },
      guestsCanModify: false,
      guestsCanInviteOthers: false,
      guestsCanSeeOtherGuests: false,
    };

    // Insert the event into calendar
    const response = await calendar.events.insert({
      calendarId: GOOGLE_CALENDAR_ID,
      requestBody: event,
      sendUpdates: 'none', // Don't send email since it's a service account
    });

    const createdEvent = response.data;

    return NextResponse.json({
      success: true,
      eventId: createdEvent.id,
      eventLink: createdEvent.htmlLink,
      startTime: createdEvent.start?.dateTime,
      endTime: createdEvent.end?.dateTime,
      summary: createdEvent.summary,
      attendeeEmail: attendeeEmail,
      attendeeName: attendeeName,
      message: 'Meeting scheduled successfully! Amogh will reach out with video call details.'
    });

  } catch (error: unknown) {
    console.error('Calendar API Error:', error);

    // Handle specific Google API errors
    const err = error as { code?: number; message?: string };

    if (err?.code === 401) {
      return NextResponse.json(
        { error: 'Authentication failed. Please check Google Calendar credentials.' },
        { status: 401 }
      );
    }

    if (err?.code === 403) {
      return NextResponse.json(
        { error: 'Permission denied. Please check Google Calendar API permissions.' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to create calendar event. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check available time slots
export async function GET(request: NextRequest) {
  try {
    // Check if Google Calendar credentials are configured
    if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
      console.error('Google Calendar credentials not configured');
      return NextResponse.json(
        { error: 'Google Calendar integration not configured. Please set up service account credentials.' },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      );
    }

    // Get events for the specified date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const response = await calendar.events.list({
      calendarId: GOOGLE_CALENDAR_ID,
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];

    // Define available time slots (9 AM to 5 PM)
    const availableSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
    ];

    // Filter out busy slots
    const busySlots = events.map(event => {
      if (event.start?.dateTime) {
        const startTime = new Date(event.start.dateTime);
        return startTime.toTimeString().substring(0, 5);
      }
      return null;
    }).filter(Boolean);

    const freeSlots = availableSlots.filter(slot => !busySlots.includes(slot));

    return NextResponse.json({
      date,
      freeSlots,
      busySlots: busySlots.filter(Boolean),
      totalEvents: events.length
    });

  } catch (error: unknown) {
    console.error('Calendar availability check error:', error);
    const err = error as { message?: string };
    return NextResponse.json(
      {
        error: 'Failed to check availability',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      },
      { status: 500 }
    );
  }
}