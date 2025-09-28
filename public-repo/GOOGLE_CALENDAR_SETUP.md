# Google Calendar API Setup

This guide will help you set up Google Calendar API integration for automatic meeting scheduling with Google Meet links.

## Prerequisites

1. Google Cloud Console account
2. Google Calendar access
3. Portfolio website with contact form

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Calendar API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click "Enable"

## Step 2: Create Service Account Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in service account details:
   - Name: `portfolio-calendar-service`
   - Description: `Service account for portfolio calendar integration`
4. Grant roles:
   - `Calendar Editor` (for creating events)
   - `Calendar Reader` (for checking availability)
5. Click "Done"

## Step 3: Generate Service Account Key

1. Click on the created service account
2. Go to "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose "JSON" format
5. Download the JSON file (keep it secure!)

## Step 4: Setup OAuth2 (Alternative Method)

If you prefer OAuth2 instead of service account:

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
5. Download the client configuration

## Step 5: Get Refresh Token (OAuth2 Method)

1. Use the OAuth2 playground: https://developers.google.com/oauthplayground
2. In settings, use your own OAuth credentials
3. Select Google Calendar API v3 scopes:
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/calendar.events`
4. Authorize and get the refresh token

## Step 6: Environment Variables

Add these to your `.env.local` file:

### For Service Account Method:
```env
# Google Calendar API - Service Account
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=primary
```

### For OAuth2 Method:
```env
# Google Calendar API - OAuth2
GOOGLE_CLIENT_ID=your-client-id.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REFRESH_TOKEN=your-refresh-token
GOOGLE_CALENDAR_ID=primary
```

## Step 7: Share Calendar (Service Account Method)

1. Open Google Calendar
2. Go to calendar settings
3. Share with the service account email
4. Give "Make changes to events" permission

## Step 8: Test the Integration

1. Submit a contact form
2. Schedule a meeting through the chat
3. Check that:
   - Event appears in your Google Calendar
   - Google Meet link is generated
   - Email invitation is sent to attendee

## Troubleshooting

### Common Issues:

1. **403 Forbidden Error**
   - Check if Calendar API is enabled
   - Verify service account has calendar access
   - Ensure correct calendar ID

2. **401 Unauthorized Error**
   - Check environment variables
   - Verify service account key is correct
   - For OAuth2: refresh token might be expired

3. **Google Meet Link Not Generated**
   - Enable Google Meet in your Google Workspace
   - Check `conferenceDataVersion: 1` parameter
   - Verify `createRequest` has unique `requestId`

4. **Calendar Not Found**
   - Check `GOOGLE_CALENDAR_ID` value
   - For service accounts: ensure calendar is shared
   - For OAuth2: ensure user has calendar access

### Testing Commands:

```bash
# Test API endpoint
curl -X POST http://localhost:3000/api/calendar \
  -H "Content-Type: application/json" \
  -d '{
    "attendeeEmail": "test@example.com",
    "attendeeName": "Test User",
    "meetingType": "30min",
    "startTime": "2024-12-25T14:00:00.000Z",
    "endTime": "2024-12-25T14:30:00.000Z",
    "timezone": "America/New_York"
  }'
```

## Security Notes

1. **Never commit credentials to Git**
2. **Use environment variables for all secrets**
3. **Restrict API key permissions**
4. **Monitor API usage in Google Cloud Console**
5. **Rotate keys periodically**

## Features Included

✅ **Automatic Calendar Event Creation**
✅ **Google Meet Link Generation**
✅ **Email Invitations to Attendees**
✅ **Timezone Support**
✅ **Meeting Reminders**
✅ **Availability Checking**
✅ **Error Handling & Fallbacks**

## Next Steps

1. Set up the environment variables
2. Test the integration
3. Configure your calendar preferences
4. Customize meeting templates
5. Monitor usage and errors

Need help? Check the [Google Calendar API documentation](https://developers.google.com/calendar/api/guides/overview) or the error logs in your application.