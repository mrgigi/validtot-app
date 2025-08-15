-- Update the tots table to include the new fields for user authentication
ALTER TABLE tots ADD COLUMN IF NOT EXISTS creator_user_id UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE tots ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN NOT NULL DEFAULT false;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tots_creator_user_id ON tots(creator_user_id);