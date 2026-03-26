import { supabase } from './supabase';

// Loads progress for a specific module from Supabase
export async function loadProgress(studentId, moduleCode) {
  if (!studentId) return null;

  const { data } = await supabase
    .from('cq_student_progress')
    .select('*, cq_modules!inner(code)')
    .eq('student_id', studentId)
    .eq('cq_modules.code', moduleCode)
    .single();

  if (!data) return null;

  return {
    c: data.completed_steps || {},
    s: data.quiz_score,
    t: data.total_questions,
    cr: data.credits_earned,
    gs: data.game_score,
    st: data.current_step,
  };
}

// Saves progress for a specific module to Supabase
export async function saveProgress(studentId, moduleCode, progress) {
  if (!studentId) return;

  // Get module id
  const { data: mod } = await supabase
    .from('cq_modules')
    .select('id')
    .eq('code', moduleCode)
    .single();

  if (!mod) return;

  const allDone = Object.keys(progress.c || {}).length >= 8; // approximate

  await supabase
    .from('cq_student_progress')
    .upsert({
      student_id: studentId,
      module_id: mod.id,
      completed_steps: progress.c || {},
      quiz_score: progress.s || 0,
      total_questions: progress.t || 0,
      credits_earned: progress.cr || 0,
      game_score: progress.gs,
      current_step: progress.st || 0,
      completed_at: allDone ? new Date().toISOString() : null,
    }, {
      onConflict: 'student_id,module_id',
    });
}

// Save a game score
export async function saveGameScore(studentId, gameId, score, durationSeconds) {
  if (!studentId) return;

  await supabase
    .from('cq_game_scores')
    .insert({
      student_id: studentId,
      game_id: gameId,
      score,
      duration_seconds: durationSeconds,
    });
}

// Load all progress for a student (for dashboard)
export async function loadAllProgress(studentId) {
  if (!studentId) return [];

  const { data } = await supabase
    .from('cq_student_progress')
    .select('*, cq_modules(code, title, phase, order_index)')
    .eq('student_id', studentId)
    .order('cq_modules(order_index)');

  return data || [];
}
