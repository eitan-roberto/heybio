-- Add LemonSqueezy columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS lemonsqueezy_customer_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS lemonsqueezy_subscription_id TEXT;

-- Add plan column if not exists (should already exist but just in case)
ALTER TABLE users ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free';

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_lemonsqueezy_customer_id ON users(lemonsqueezy_customer_id);
CREATE INDEX IF NOT EXISTS idx_users_plan ON users(plan);
