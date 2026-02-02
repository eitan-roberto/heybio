-- Add order column to links table if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'links' AND column_name = 'order'
    ) THEN
        ALTER TABLE links ADD COLUMN "order" INTEGER DEFAULT 0;
    END IF;
END
$$;

-- Add is_active column if not exists (might also be missing)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'links' AND column_name = 'is_active'
    ) THEN
        ALTER TABLE links ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
END
$$;
