import { supabase } from './supabase';

// Module code mapping: localStorage key -> module code
// Keys are like "cq-m01-unified", "cq-m15-unified", etc.
function keyToModuleCode(key) {
  const match = key.match(/^cq-(m\d+)-/i);
  if (!match) return null;
  return match[1].toUpperCase(); // "M01", "M15", etc.
}

let _studentId = null;
let _syncEnabled = false;

export function initSyncStorage(studentId) {
  _studentId = studentId;
  _syncEnabled = !!studentId;
}

async function getModuleId(moduleCode) {
  if (!moduleCode) return null;
  const { data } = await supabase
    .from('cq_modules')
    .select('id')
    .eq('code', moduleCode)
    .single();
  return data?.id || null;
}

async function syncToSupabase(key, value) {
  if (!_syncEnabled || !_studentId) return;
  
  const moduleCode = keyToModuleCode(key);
  if (!moduleCode) return; // Not a module key, skip

  try {
    const data = JSON.parse(value);
    const moduleId = await getModuleId(moduleCode);
    if (!moduleId) return;

    const completedSteps = data.c || {};
    const stepCount = Object.keys(completedSteps).length;
    
    await supabase
      .from('cq_student_progress')
      .upsert({
        student_id: _studentId,
        module_id: moduleId,
        completed_steps: completedSteps,
        quiz_score: data.s || 0,
        total_questions: data.t || 0,
        credits_earned: data.cr || 0,
        game_score: data.gs || null,
        current_step: data.st || 0,
        completed_at: stepCount >= 5 ? new Date().toISOString() : null,
      }, {
        onConflict: 'student_id,module_id',
      });

    // Also update total_credits on student
    const { data: allProgress } = await supabase
      .from('cq_student_progress')
      .select('credits_earned')
      .eq('student_id', _studentId);
    
    if (allProgress) {
      const totalCredits = allProgress.reduce((a, p) => a + (p.credits_earned || 0), 0);
      await supabase
        .from('cq_students')
        .update({ total_credits: totalCredits, last_active_date: new Date().toISOString().split('T')[0] })
        .eq('id', _studentId);
    }
  } catch (e) {
    console.log('Sync to Supabase failed (will retry next save):', e.message);
  }
}

async function loadFromSupabase(key) {
  if (!_syncEnabled || !_studentId) return null;
  
  const moduleCode = keyToModuleCode(key);
  if (!moduleCode) return null;

  try {
    const moduleId = await getModuleId(moduleCode);
    if (!moduleId) return null;

    const { data } = await supabase
      .from('cq_student_progress')
      .select('*')
      .eq('student_id', _studentId)
      .eq('module_id', moduleId)
      .single();

    if (!data) return null;

    // Convert Supabase format back to localStorage format
    const localData = {
      c: data.completed_steps || {},
      s: data.quiz_score || 0,
      t: data.total_questions || 0,
      cr: data.credits_earned || 0,
      gs: data.game_score,
      st: data.current_step || 0,
    };

    return JSON.stringify(localData);
  } catch (e) {
    console.log('Load from Supabase failed, using localStorage:', e.message);
    return null;
  }
}

export function setupSyncStorage() {
  window.storage = {
    async get(key) {
      // Try Supabase first
      const supaVal = await loadFromSupabase(key);
      if (supaVal) {
        // Also update localStorage as cache
        localStorage.setItem(key, supaVal);
        return { key, value: supaVal };
      }
      // Fallback to localStorage
      const val = localStorage.getItem(key);
      return val ? { key, value: val } : null;
    },

    async set(key, value) {
      // Always save to localStorage (immediate)
      localStorage.setItem(key, value);
      // Sync to Supabase (async, fire-and-forget)
      syncToSupabase(key, value);
      return { key, value };
    },

    async delete(key) {
      localStorage.removeItem(key);
      return { key, deleted: true };
    },
  };
}
