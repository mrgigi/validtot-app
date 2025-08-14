-- Create anonymous users for existing votes that don't have a user_id
-- This is a one-time migration to maintain backward compatibility

-- First, let's create a default anonymous user
INSERT INTO users (username, email, password_hash, is_anonymous, created_at, updated_at)
VALUES ('anonymous', 'anonymous@validtot.app', 'anonymous_hash', true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Update existing votes to associate with the anonymous user where user_id is NULL
-- We'll use the voter_ip to group votes and assign them to anonymous users
-- For simplicity in this migration, we'll just associate all existing votes with the anonymous user
UPDATE votes 
SET user_id = (SELECT id FROM users WHERE email = 'anonymous@validtot.app' LIMIT 1)
WHERE user_id IS NULL AND voter_ip IS NOT NULL;

-- For any remaining votes without user_id or voter_ip, we'll still associate with anonymous user
UPDATE votes 
SET user_id = (SELECT id FROM users WHERE email = 'anonymous@validtot.app' LIMIT 1),
    voter_ip = 'unknown'
WHERE user_id IS NULL;

-- Add a constraint to ensure each user can only vote once per tot
-- We'll drop the old IP-based constraint first
ALTER TABLE votes DROP CONSTRAINT IF EXISTS votes_tot_id_voter_ip_key;

-- Add the new constraint based on user_id
ALTER TABLE votes ADD CONSTRAINT votes_tot_id_user_id_key UNIQUE (tot_id, user_id);