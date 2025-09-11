-- Create contacts table for storing chatbot form submissions
CREATE TABLE IF NOT EXISTS contacts (
  id BIGSERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(50),
  message TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source VARCHAR(50) NOT NULL DEFAULT 'chatbot',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);

-- Create an index on source for filtering
CREATE INDEX IF NOT EXISTS idx_contacts_source ON contacts(source);

-- Enable Row Level Security (RLS)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows inserting contacts (for the chatbot)
-- You can adjust this policy based on your security needs
CREATE POLICY "Allow public insert" ON contacts
  FOR INSERT WITH CHECK (true);

-- Create a policy for reading contacts (adjust based on your auth needs)
-- This example allows reading for authenticated users only
-- CREATE POLICY "Allow authenticated read" ON contacts
--   FOR SELECT USING (auth.role() = 'authenticated');

-- For now, allow public read access (you can restrict this later)
CREATE POLICY "Allow public read" ON contacts
  FOR SELECT USING (true);