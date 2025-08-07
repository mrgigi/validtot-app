CREATE TABLE tots (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  option_a_text TEXT NOT NULL,
  option_a_image_url TEXT,
  option_b_text TEXT NOT NULL,
  option_b_image_url TEXT,
  option_c_text TEXT,
  option_c_image_url TEXT,
  creator_ip TEXT,
  is_public BOOLEAN NOT NULL DEFAULT true,
  is_trending BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  total_votes INTEGER NOT NULL DEFAULT 0,
  option_a_votes INTEGER NOT NULL DEFAULT 0,
  option_b_votes INTEGER NOT NULL DEFAULT 0,
  option_c_votes INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE votes (
  id BIGSERIAL PRIMARY KEY,
  tot_id TEXT NOT NULL REFERENCES tots(id) ON DELETE CASCADE,
  option_selected TEXT NOT NULL CHECK (option_selected IN ('A', 'B', 'C')),
  voter_ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tots_public ON tots(is_public);
CREATE INDEX idx_tots_trending ON tots(is_trending);
CREATE INDEX idx_tots_created_at ON tots(created_at);
CREATE INDEX idx_votes_tot_id ON votes(tot_id);
CREATE INDEX idx_votes_voter_ip ON votes(voter_ip);
