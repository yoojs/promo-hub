-- Create waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name text NOT NULL,
    email text NOT NULL UNIQUE,
    role text NOT NULL CHECK (role IN ('promoter', 'user', 'venue')),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anyone
CREATE POLICY "Waitlist entries can be created by anyone"
ON waitlist FOR INSERT
TO anon
WITH CHECK (true);

-- Allow read access to authenticated users
CREATE POLICY "Waitlist entries are viewable by authenticated users"
ON waitlist FOR SELECT
TO authenticated
USING (true);