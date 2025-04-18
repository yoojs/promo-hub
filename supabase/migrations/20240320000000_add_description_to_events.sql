-- Add description column to events table
DO $$
BEGIN
    -- Check if the events table exists
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'events'
    ) THEN
        -- Add description column if it doesn't exist
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'events' 
            AND column_name = 'description'
        ) THEN
            ALTER TABLE events ADD COLUMN description TEXT;
            
            -- Update existing events to have a default description
            UPDATE events
            SET description = 'No description available'
            WHERE description IS NULL;
        END IF;
    END IF;
END $$;
