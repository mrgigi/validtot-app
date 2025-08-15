-- Migrate existing data to the new structure
-- This migration will associate existing votes and tots with anonymous users

-- First, let's create a default anonymous user for existing data
INSERT INTO users (username, email, password_hash, is_anonymous, created_at, updated_at)
VALUES ('anonymous', 'anonymous@validtot.app', 'anonymous_hash', true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Update existing tots to have the anonymous flag set appropriately
-- For existing tots, we'll set is_anonymous to true since they were created anonymously
UPDATE tots 
SET is_anonymous = true 
WHERE is_anonymous = false OR is_anonymous IS NULL;

-- Update existing votes to associate with the anonymous user where user_id is NULL
-- We'll use the voter_ip to group votes and assign them to anonymous users
-- For simplicity in this migration, we'll associate all existing votes with the anonymous user
UPDATE votes 
SET user_id = (SELECT id FROM users WHERE email = 'anonymous@validtot.app' LIMIT 1)
WHERE user_id IS NULL AND voter_ip IS NOT NULL;

-- For any remaining votes without user_id or voter_ip, we'll still associate with anonymous user
UPDATE votes 
SET user_id = (SELECT id FROM users WHERE email = 'anonymous@validtot.app' LIMIT 1),
    voter_ip = 'unknown'
WHERE user_id IS NULL;