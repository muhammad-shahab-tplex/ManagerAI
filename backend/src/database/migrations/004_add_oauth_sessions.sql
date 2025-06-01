-- Create table for tracking OAuth sessions
CREATE TABLE IF NOT EXISTS oauth_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(20) NOT NULL,
  state_token VARCHAR(100) NOT NULL,
  redirect_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  UNIQUE(state_token)
);

-- Create table for login history
CREATE TABLE IF NOT EXISTS login_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  login_time TIMESTAMP NOT NULL DEFAULT NOW(),
  login_type VARCHAR(20) NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  successful BOOLEAN NOT NULL DEFAULT true
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_oauth_sessions_user_id ON oauth_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_oauth_sessions_state_token ON oauth_sessions(state_token);
CREATE INDEX IF NOT EXISTS idx_login_history_user_id ON login_history(user_id);
CREATE INDEX IF NOT EXISTS idx_login_history_login_time ON login_history(login_time); 