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
('t-001', 'Pixiora_cc2026', 'Pixiora', 'Salute to Motherhood', 2, ARRAY['Anshera Siddiqui', 'Anshika Pandya'], 'Expressing the feeling of nostalgia in our creation.', 'pending'),
('t-002', 'EcoVision', 'EcoVision EV', 'Electric Vehicle Representation', 2, ARRAY['Abubakar Nagori', 'Uzair Khan'], 'Combining graphics, animations, and interactivity to create a visually engaging EV experience.', 'pending'),
('t-003', 'Team Art Attack', 'Art Attack', 'Electric Vehicle Representation', 2, ARRAY['Ayush Sharma', 'Sanya Raj'], 'Just creative expression of ideas.', 'pending'),
('t-004', 'Team Cosmic Coders', 'Cosmic Coders', 'Space Research (ISRO)', 2, ARRAY['Atharv Jain', 'Pranav Mehta'], 'Excited to innovate, learn, and build something inspiring together.', 'pending'),
('t-005', 'DesiDynamics', 'DesiDynamics', 'Indian Culture and Tradition', 2, ARRAY['VIDHI CHOUHAN', 'PRARTHNA TRIVEDI'], 'CREATIVE CHALLENGES + VISUALIZATION', 'pending'),
('t-006', 'Highway Hackers', 'Fastag Simulation', 'Indian Tollways Simulation', 2, ARRAY['Hemant Parmar', 'Pradeep Kalmodiya'], 'Creative challenge and learning new skills.', 'pending'),
('t-007', 'Bit-Bharat', 'Bit-Bharat UPI', 'Digital Payments (UPI)', 2, ARRAY['Gulshan Jatwa', 'Tushar Nagar'], 'Learning new skills and inspiring the world.', 'pending'),
('t-008', 'Team AstroVikram', 'AstroVikram', 'Space Research (ISRO)', 2, ARRAY['Divyansh Sharma', 'Priyanka Jadhav'], 'Learning creativity and technology.', 'pending'),
('t-009', 'Vyom Tech', 'Vyom Space', 'Space Research (ISRO)', 2, ARRAY['Vardan kumawat', 'Reva Parmar'], 'Learning creative coding and building innovation visual projects using P5.js.', 'pending'),
('t-010', 'ARthNova', 'ARthNova SDG', 'Sustainable Development Goals', 2, ARRAY['Rupal hada', 'Aditi meena'], 'About experiencing making our imagination come alive on the screen.', 'pending'),
('t-011', 'UPI Ninjas', 'UPI Ninjas', 'Digital Payments (UPI)', 2, ARRAY['Sameer Upadhyay', 'Sudhanshu Sachan'], 'Creative Challenges', 'pending'),
('t-012', 'Pixel Predators', 'Pixel Culture', 'Indian Culture and Tradition', 2, ARRAY['Aditya Kumar Singh', 'Prakhar Sachan'], 'Learning New skills with creative challenge.', 'pending'),
('t-013', 'Shades of Weather', 'Weather Moods', 'Weather as Mood', 2, ARRAY['Priyansh Parashar', 'Vidit Tiwari'], 'Learning and Skills Development.', 'pending'),
('t-014', 'Code Yatra', 'MP Tourism Interaction', 'Madhya Pradesh Tourism', 2, ARRAY['Arpit Rathore', 'Paneri Mandavgane'], 'New learnings and gaining experiences.', 'pending'),
('t-015', 'HeartBeat MP', 'HeartBeat MP', 'Madhya Pradesh Tourism', 2, ARRAY['Pratishtha Sen', 'Priya Tomar'], 'Experiencing first time 48 hours hackathon and pressure of doing in a given timeline.', 'pending'),
('t-016', 'Runtime Terror', 'Runtime Terror', 'One-Button Games', 2, ARRAY['Lakshita sharma', 'Mamta Chandrawat'], 'Learning new skills.', 'pending'),
('t-017', 'Aditya-L1', 'Aditya-L1 Space', 'Space Research (ISRO)', 2, ARRAY['Stuti Patel', 'Raj Kumar Mali'], 'Creative challenge.', 'pending'),
('t-018', 'The Slackers', 'Slacker Tourism', 'Madhya Pradesh Tourism', 2, ARRAY['Shravan Goyal', 'Raghav Pathak'], 'Creative Challenge and HIstorical Knowledge.', 'pending'),
('t-019', 'The WhimPhantasia Duo', 'WhimPhantasia Weather', 'Weather as Mood', 2, ARRAY['Aditya kushwah', 'Gouri Jaiswal'], 'The craetive challenges that we will face during hacakthon.', 'pending'),
('t-020', 'Gaming Titans', 'Titan Weather', 'Weather as Mood', 2, ARRAY['Krishna Bakde', 'Sumit Verma'], 'Creative challenge.', 'pending'),
('t-021', 'BharatFlux', 'BharatFlux Fastag', 'Indian Tollways Simulation', 2, ARRAY['Ansh Pandya', 'Shubhdeeep Goyal'], 'I’m excited to explore creative coding, build an interactive project, learn new skills.', 'pending'),
('t-022', 'Ctrl Creators', 'Ctrl Creators', 'One-Button Games', 2, ARRAY['Payal Priya', 'Dhawal Hatiya'], 'Challenge and learning new skills.', 'pending'),
('t-023', 'indic builders', 'Indic Tourism', 'Madhya Pradesh Tourism', 2, ARRAY['Devyani Wagh', 'Shaurya Sharma'], 'creative coding.', 'pending'),
('t-024', 'HexNova', 'HexNova Games', 'One-Button Games', 2, ARRAY['Rudraksh Nagar', 'Rabit Mansuri'], 'Creative Challenge.', 'pending')
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
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (judge_id, team_id)
);

-- Enable Realtime for the evaluations table
-- 1. Create the publication if it doesn't exist
-- 2. Add the table to the publication
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        CREATE PUBLICATION supabase_realtime;
    END IF;
END $$;

ALTER PUBLICATION supabase_realtime ADD TABLE evaluations;

-- Add authorized accounts (1 Admin + 3 Judges)
-- NOTE: In this portal, we use direct authentication with these keys as requested.
INSERT INTO judges (id, email, password, name, role, active)
VALUES 
('admin-001', 'admin@avantika.edu.in', 'Admin@Avantika', 'System Administrator', 'admin', true),
('judge-001', 'judge1@avantika.edu.in', 'Hack@Judge1', 'Judge 1', 'judge', true),
('judge-002', 'judge2@avantika.edu.in', 'AvantikaXHack', 'Judge 2', 'judge', true),
('judge-003', 'judge3@avantika.edu.in', 'Avantika@#2026', 'Judge 3', 'judge', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for Security
-- For this hackathon portal, we are using a custom 'localStorage' auth bridge.
-- To ensure sync works across all judge devices without complex Supabase Auth setup,
-- we will disable RLS for now. 
-- IN PRODUCTION with real users, you should use Supabase Auth and proper policies.

ALTER TABLE judges DISABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations DISABLE ROW LEVEL SECURITY;
ALTER TABLE teams DISABLE ROW LEVEL SECURITY;
