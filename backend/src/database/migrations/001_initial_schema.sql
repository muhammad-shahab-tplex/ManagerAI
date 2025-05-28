-- Migration: 001_initial_schema.sql
-- Description: Initial database schema with users, preferences, integrations, and tone profiles

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  subscription_tier VARCHAR(20) NOT NULL DEFAULT 'free',
  google_id VARCHAR(100),
  microsoft_id VARCHAR(100),
  reset_password_token VARCHAR(200),
  reset_password_expire TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create user preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email_frequency VARCHAR(20) NOT NULL DEFAULT 'daily',
  auto_reply_enabled BOOLEAN DEFAULT false,
  auto_reply_confidence_threshold FLOAT DEFAULT 0.85,
  working_hours_start VARCHAR(10) DEFAULT '09:00',
  working_hours_end VARCHAR(10) DEFAULT '17:00',
  timezone VARCHAR(50) DEFAULT 'UTC',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create integration tokens table
CREATE TABLE IF NOT EXISTS integration_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  connected BOOLEAN DEFAULT false,
  access_token TEXT,
  refresh_token TEXT,
  expiry_date TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- Create tone profiles table
CREATE TABLE IF NOT EXISTS tone_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  profile_data JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
); 