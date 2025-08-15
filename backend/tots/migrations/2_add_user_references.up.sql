-- Add user_id column to tots table
ALTER TABLE tots ADD COLUMN creator_user_id UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE tots ADD COLUMN is_anonymous BOOLEAN NOT NULL DEFAULT false;

-- Add user_id column to votes table
ALTER TABLE votes ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tots_creator_user_id ON tots(creator_user_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);

-- Update existing tots to have anonymous flag set to true (for backward compatibility)
UPDATE tots SET is_anonymous = true WHERE is_anonymous = false;

-- Update existing votes to maintain IP-based tracking for backward compatibility
-- We'll keep the voter_ip column for now and migrate data in a separate step