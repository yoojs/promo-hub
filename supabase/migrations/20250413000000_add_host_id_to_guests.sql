-- Add host_id column to guests table
DO $$
BEGIN
    -- Check if the guests table exists
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'guests'
    ) THEN
        -- Add host_id column if it doesn't exist
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'guests' 
            AND column_name = 'host_id'
        ) THEN
            ALTER TABLE guests
            ADD COLUMN host_id uuid REFERENCES guests(id) ON DELETE SET NULL;
            
            -- Set default value for host_id to be the same as id for all existing rows
            UPDATE guests
            SET host_id = id
            WHERE host_id IS NULL;
            
            -- Create function if it doesn't exist
            CREATE OR REPLACE FUNCTION set_default_host_id()
            RETURNS TRIGGER AS $$
            BEGIN
                IF NEW.host_id IS NULL THEN
                    NEW.host_id := NEW.id;
                END IF;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
            
            -- Drop trigger if it exists to avoid errors
            DROP TRIGGER IF EXISTS set_guests_host_id ON guests;
            
            -- Create trigger
            CREATE TRIGGER set_guests_host_id
            BEFORE INSERT ON guests
            FOR EACH ROW
            EXECUTE FUNCTION set_default_host_id();
        END IF;
    END IF;
END $$;
