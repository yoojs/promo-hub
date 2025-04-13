-- Add social media and description fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS social_media jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS description text;

-- Update the profiles type in the database
COMMENT ON COLUMN profiles.social_media IS 'JSON object containing social media links (e.g., {"instagram": "username", "twitter": "handle", "facebook": "page"})';
COMMENT ON COLUMN profiles.description IS 'Text description of the promoter'; 