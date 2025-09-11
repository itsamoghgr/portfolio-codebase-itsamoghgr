# Supabase Setup for Contact Form

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Wait for your database to be ready

## 2. Run Database Schema

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase-schema.sql`
4. Click **Run** to create the `contacts` table

## 3. Get API Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy your **Project URL** and **anon/public key**

## 4. Set Environment Variables

1. Create a `.env.local` file in your project root:
```bash
cp .env.local.example .env.local
```

2. Add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 5. Deploy Environment Variables

### For Vercel:
1. Go to your Vercel project dashboard
2. Navigate to **Settings** > **Environment Variables**
3. Add both environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Redeploy your project

## 6. Test the Integration

1. Visit your deployed website
2. Open the chatbot and submit a test message
3. Check your Supabase dashboard under **Table Editor** > **contacts**
4. You should see the submitted data

## Database Schema

The `contacts` table structure:
- `id`: Auto-incrementing primary key
- `full_name`: User's full name
- `email`: User's email address  
- `phone_number`: Optional phone number
- `message`: User's message
- `timestamp`: When the form was submitted
- `source`: Source of submission (e.g., 'chatbot')
- `created_at`: Database creation timestamp

## Security

- Row Level Security (RLS) is enabled
- Public insert policy allows chatbot submissions
- Adjust read policies based on your needs in the SQL editor