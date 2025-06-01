-- Add login_history table to track user login events
CREATE TABLE IF NOT EXISTS login_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  ip_address VARCHAR(50),
  user_agent TEXT,
  login_status VARCHAR(20) NOT NULL, -- 'success', 'failed', etc.
  login_time TIMESTAMP NOT NULL DEFAULT NOW(),
  location VARCHAR(100),
  device_info VARCHAR(255)
);

-- Add index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_login_history_user_id ON login_history(user_id);

-- Add index on login_time for faster date-based queries
CREATE INDEX IF NOT EXISTS idx_login_history_login_time ON login_history(login_time);

COMMENT ON TABLE login_history IS 'Tracks user login attempts and successful logins'; 