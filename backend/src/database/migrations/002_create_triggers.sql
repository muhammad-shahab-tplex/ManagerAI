-- Migration: 002_create_triggers.sql
-- Description: Creates triggers for automatic creation of related records

-- Drop triggers if they exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_create_user_preferences') THEN
    DROP TRIGGER trigger_create_user_preferences ON users;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_create_tone_profile') THEN
    DROP TRIGGER trigger_create_tone_profile ON users;
  END IF;
END $$;

-- Create user preferences trigger function
CREATE OR REPLACE FUNCTION create_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_preferences (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create user preferences trigger
CREATE TRIGGER trigger_create_user_preferences
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION create_user_preferences();

-- Create tone profile trigger function
CREATE OR REPLACE FUNCTION create_tone_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO tone_profiles (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create tone profile trigger
CREATE TRIGGER trigger_create_tone_profile
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION create_tone_profile(); 