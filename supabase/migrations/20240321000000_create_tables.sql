-- Add roles column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'promoter';

-- Create venues table
CREATE TABLE IF NOT EXISTS venues (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    description text,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id uuid REFERENCES venues(id) ON DELETE CASCADE,
    name text NOT NULL,
    date date NOT NULL,
    start_time time NOT NULL,
    end_time time NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create guests table
CREATE TABLE IF NOT EXISTS guests (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    email text UNIQUE,
    birthday date,
    instagram text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create guest_events relation table
CREATE TABLE IF NOT EXISTS guest_events (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    guest_id uuid REFERENCES guests(id) ON DELETE CASCADE,
    event_id uuid REFERENCES events(id) ON DELETE CASCADE,
    added_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
    checked_in boolean DEFAULT false,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(guest_id, event_id)
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    phone text NOT NULL,
    message text NOT NULL,
    status text NOT NULL DEFAULT 'new',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Venues policies
CREATE POLICY "Venues are accessible by authenticated users"
ON venues FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Events policies
CREATE POLICY "Events are accessible by authenticated users"
ON events FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Guests policies
CREATE POLICY "Guests are accessible by authenticated users"
ON guests FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Guest_events policies
CREATE POLICY "Guest_events are accessible by authenticated users"
ON guest_events FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Contact messages policies
CREATE POLICY "Contact messages are insertable by anyone"
ON contact_messages FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Contact messages are viewable by authenticated users"
ON contact_messages FOR SELECT
TO authenticated
USING (true); 