-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  current_phase TEXT DEFAULT 'genesis',
  agent_ids TEXT[] DEFAULT '{}',
  files JSONB DEFAULT '[]',
  messages JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agents Table (for persistent stats)
CREATE TABLE IF NOT EXISTS agents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  tasks_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Memories Table (Agent Long-term Memory)
CREATE TABLE IF NOT EXISTS memories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id TEXT REFERENCES agents(id),
  project_id UUID REFERENCES projects(id),
  context TEXT NOT NULL,
  type TEXT DEFAULT 'interaction', -- 'interaction', 'learning', 'achievement'
  importance INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Spiritual Logs (HNK Protocol Audit)
CREATE TABLE IF NOT EXISTS spiritual_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  agent_id TEXT,
  status TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies (Basic - Public for Dev, restrict in Prod)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE spiritual_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access for dev" ON projects FOR ALL USING (true);
CREATE POLICY "Allow public access for dev" ON agents FOR ALL USING (true);
CREATE POLICY "Allow public access for dev" ON memories FOR ALL USING (true);
CREATE POLICY "Allow public access for dev" ON spiritual_logs FOR ALL USING (true);

-- Seed Data: Initial Agents
INSERT INTO agents (id, name, role, xp, level, tasks_completed) VALUES
('agent-001', 'Shimokodan Dev', 'Full Stack Architect', 1000, 5, 50),
('agent-002', 'Sales Agent', 'Business Strategist', 500, 3, 20),
('agent-003', 'Support Agent', 'Customer Success', 300, 2, 15)
ON CONFLICT (id) DO NOTHING;
