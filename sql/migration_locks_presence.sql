-- ============================================
-- MIGRATION : cq_locks + cq_presence
-- A executer dans Supabase SQL Editor
-- Projet : U1U4U7U19 (jslbfkaujahihvjdxcjg)
-- ============================================

-- 1. Table cq_locks (controle d'acces par section)
CREATE TABLE IF NOT EXISTS cq_locks (
  id SERIAL PRIMARY KEY,
  unit_id INT NOT NULL DEFAULT 1,
  section_key TEXT NOT NULL,
  is_locked BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(unit_id, section_key)
);
ALTER TABLE cq_locks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cq_locks_read ON cq_locks;
DROP POLICY IF EXISTS cq_locks_write ON cq_locks;
CREATE POLICY cq_locks_read ON cq_locks FOR SELECT USING (true);
CREATE POLICY cq_locks_write ON cq_locks FOR ALL USING (is_teacher());

-- 2. Table cq_presence (presence temps reel)
CREATE TABLE IF NOT EXISTS cq_presence (
  id SERIAL PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES cq_students(id) ON DELETE CASCADE,
  current_page TEXT DEFAULT 'home',
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  is_online BOOLEAN DEFAULT true,
  UNIQUE(student_id)
);
ALTER TABLE cq_presence ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cq_presence_read ON cq_presence;
DROP POLICY IF EXISTS cq_presence_write ON cq_presence;
CREATE POLICY cq_presence_read ON cq_presence FOR SELECT USING (true);
CREATE POLICY cq_presence_write ON cq_presence FOR ALL USING (true);

-- Insert default lock states (all unlocked)
INSERT INTO cq_locks (unit_id, section_key, is_locked) VALUES
(1, 'arcade', false),
(1, 'quiz_live', false),
(1, 'documents_corriges', false),
(1, 'classement', false),
(1, 'lo3', false),
(1, 'lo4', false),
(1, 'cours_page', false),
(1, 'onecompiler', false)
ON CONFLICT (unit_id, section_key) DO NOTHING;
