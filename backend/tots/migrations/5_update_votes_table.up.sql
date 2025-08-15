-- Update the votes table to include the new fields for user authentication
ALTER TABLE votes ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);

-- Add a constraint to ensure each user can only vote once per tot
-- We'll drop the old IP-based constraint first
ALTER TABLE votes DROP CONSTRAINT IF EXISTS votes_tot_id_voter_ip_key;

-- Add the new constraint based on user_id
ALTER TABLE votes ADD CONSTRAINT votes_tot_id_user_id_key UNIQUE (tot_id, user_id);