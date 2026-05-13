-- SQL Schema for Hackathon Judging Portal 2026
-- Run this in your Supabase SQL Editor

-- Clean up existing tables to ensure a fresh start
DROP TABLE IF EXISTS evaluations CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS judges CASCADE;

-- 1. Teams Table
CREATE TABLE IF NOT EXISTS teams (
  id TEXT PRIMARY KEY,
  team_name TEXT NOT NULL,
  project_name TEXT NOT NULL,
  category TEXT NOT NULL,
  members INTEGER DEFAULT 0,
  member_names TEXT[] DEFAULT '{}',
  description TEXT,
  github_url TEXT,
  demo_url TEXT,
  status TEXT DEFAULT 'pending',
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pre-populate teams from mock data
INSERT INTO teams (id, team_name, project_name, category, members, member_names, description, status)
VALUES 
('t-001', 'Pixiora_cc2026', 'Childhood, Reimagined', 'Salute to Motherhood', 2, ARRAY['Aarav Sharma', 'Ishita Patel'], 'Expressing the feeling of nostalgia in our creation.', 'pending'),
('t-002', 'EcoVision', 'EcoVision', 'Electric Vehicle Representation', 2, ARRAY['Rohan Gupta', 'Ananya Singh'], 'Combining graphics, animations, and interactivity to create a visually engaging EV experience.', 'pending'),
('t-003', 'Team Art Attack', 'Art Attack EV', 'Electric Vehicle Representation', 2, ARRAY['Vihaan Malhotra', 'Sara Khan'], 'Just creative expression of ideas.', 'pending'),
('t-004', 'Team Cosmic Coders', 'Cosmic ISRO', 'Space Research (ISRO)', 2, ARRAY['Arjun Reddy', 'Kiara Advani'], 'Excited to innovate, learn, and build something inspiring together.', 'pending'),
('t-005', 'DesiDynamics', 'Desi Culture', 'Indian Culture and Tradition', 2, ARRAY['Kabir Verma', 'Myra Joshi'], 'CREATIVE CHALLENGES + VISUALIZATION', 'pending'),
('t-006', 'Highway Hackers', 'Fastag Simulation', 'Indian Tollways Simulation', 2, ARRAY['Devansh Mehta', 'Zoya Williams'], 'Learning and building.', 'pending'),
('t-007', 'Cyber Savvy', 'Cyber Safety', 'Cyber Security Awareness', 2, ARRAY['Aarav Sen', 'Priya Das'], 'Innovative projects.', 'pending'),
('t-008', 'The Innovators', 'Innovate EV', 'Electric Vehicle Representation', 2, ARRAY['Rohan Das', 'Ananya Sen'], 'Creative expression.', 'pending'),
('t-009', 'Byte Benders', 'Byte ISRO', 'Space Research (ISRO)', 2, ARRAY['Arjun Sen', 'Kiara Das'], 'Space innovation.', 'pending'),
('t-010', 'Code Wizards', 'Wizard Space', 'Space Research (ISRO)', 2, ARRAY['Rishi Saxena', 'Sanya Mirza'], 'Creative coding.', 'pending'),
('t-011', 'ARthNova', 'ARthNova SDG', 'Sustainable Development Goals', 2, ARRAY['Aaryan Sen', 'Priya Das'], 'Imagination alive.', 'pending'),
('t-012', 'Pixel Predators', 'Pixel Culture', 'Indian Culture and Tradition', 2, ARRAY['Reyansh Bajaj', 'Anvi Kapoor'], 'New skills.', 'pending'),
('t-013', 'Shades of Weather', 'Weather Moods', 'Weather as Mood', 2, ARRAY['Viaan Chauhan', 'Ishani Goyal'], 'Learning.', 'pending'),
('t-014', 'Code Yatra', 'MP Tourism Interaction', 'Madhya Pradesh Tourism', 2, ARRAY['Shaurya Thakur', 'Aadhya Varma'], 'New learnings.', 'pending'),
('t-015', 'HeartBeat MP', 'HeartBeat MP', 'Madhya Pradesh Tourism', 2, ARRAY['Atharv Khare', 'Sana Sheikh'], 'Hackathon experience.', 'pending'),
('t-016', 'Runtime Terror', 'One-Button India', 'One-Button Games', 2, ARRAY['Aarush Gupta', 'Sanya Malhotra'], 'New skills.', 'pending'),
('t-017', 'The Slackers', 'Slacker Tourism', 'Madhya Pradesh Tourism', 2, ARRAY['Arnav Singh', 'Mehak Gupta'], 'Creative challenge.', 'pending'),
('t-018', 'The WhimPhantasia Duo', 'WhimPhantasia Weather', 'Weather as Mood', 2, ARRAY['Vivaan Reddy', 'Kyra Advani'], 'Creative challenges.', 'pending'),
('t-019', 'Gaming Titans', 'Titan Weather', 'Weather as Mood', 2, ARRAY['Aayan Kumar', 'Shanaya Singh'], 'Creative challenge.', 'pending'),
('t-020', 'BharatFlux', 'BharatFlux Fastag', 'Indian Tollways Simulation', 2, ARRAY['Hriday Joshi', 'Amara Shah'], 'Creative coding.', 'pending'),
('t-021', 'Ctrl Creators', 'Ctrl-Alt-Create', 'One-Button Games', 2, ARRAY['Kian Mehta', 'Vanya Varma'], 'Learning skills.', 'pending'),
('t-022', 'indic builders', 'Indic Tourism', 'Madhya Pradesh Tourism', 2, ARRAY['Ranbir Kapoor', 'Alia Bhatt'], 'Creative coding.', 'pending'),
('t-023', 'HexNova', 'HexNova Games', 'One-Button Games', 2, ARRAY['Ishan Kishan', 'Sara Tendulkar'], 'Creative challenge.', 'pending')
ON CONFLICT (id) DO NOTHING;

-- 2. Judges Table
CREATE TABLE IF NOT EXISTS judges (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'judge', -- 'admin' or 'judge'
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Evaluations Table
CREATE TABLE IF NOT EXISTS evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id TEXT REFERENCES teams(id) ON DELETE CASCADE,
  judge_id TEXT REFERENCES judges(id),
  creativity_score INTEGER DEFAULT 0,
  technical_score INTEGER DEFAULT 0,
  design_score INTEGER DEFAULT 0,
  theme_score INTEGER DEFAULT 0,
  engagement_score INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  feedback TEXT,
  edit_count INTEGER DEFAULT 0,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add sample admin user
-- NOTE: In production, passwords should be hashed. 
-- For this hackathon portal, we'll use the plain text keys as requested.
INSERT INTO judges (id, email, password, name, role, active)
VALUES ('admin-001', 'admin@avantika.edu.in', 'Admin@Avantika', 'System Administrator', 'admin', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for Security
ALTER TABLE judges ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- Allow all judges to read teams
CREATE POLICY "Judges can view teams" ON teams FOR SELECT USING (true);

-- Only admins can manage judges
CREATE POLICY "Admins can manage judges" ON judges FOR ALL 
  USING (EXISTS (SELECT 1 FROM judges WHERE id = auth.uid()::text AND role = 'admin'));

-- Judges can manage their own evaluations
-- (This requires Supabase Auth to be fully set up. 
-- For the current 'localStorage' auth bridge, you might prefer keeping RLS disabled or using an API Key.)
