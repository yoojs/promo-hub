-- Rename metadata column to guests and add promoters column
-- First check if the table and column exist
DO $$
BEGIN
    -- Check if the events table exists
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'events'
    ) THEN
        -- Check if the metadata column exists
        IF EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'events' 
            AND column_name = 'metadata'
        ) THEN
            -- Rename the column if it exists
            ALTER TABLE events RENAME COLUMN metadata TO guests;
            
            -- Add promoters column
            ALTER TABLE events ADD COLUMN IF NOT EXISTS promoters JSONB DEFAULT '[]'::jsonb;
            
            -- Update existing records to move promoter data to the new column
            UPDATE events 
            SET promoters = COALESCE(guests->'promoters', '[]'::jsonb),
                guests = guests - 'promoters';
        ELSE
            -- If metadata column doesn't exist but guests column does, just add promoters
            IF EXISTS (
                SELECT FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = 'events' 
                AND column_name = 'guests'
            ) THEN
                -- Add promoters column if it doesn't exist
                ALTER TABLE events ADD COLUMN IF NOT EXISTS promoters JSONB DEFAULT '[]'::jsonb;
            END IF;
        END IF;
    END IF;
END $$;
