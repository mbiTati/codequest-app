import { supabase } from './supabase';

let presenceInterval = null;
let currentStudentId = null;

export function startPresence(studentId) {
  if (presenceInterval) clearInterval(presenceInterval);
  currentStudentId = studentId;
  
  // Send heartbeat immediately
  sendHeartbeat('home');
  
  // Then every 30 seconds
  presenceInterval = setInterval(() => {
    sendHeartbeat();
  }, 30000);
}

export function stopPresence() {
  if (presenceInterval) clearInterval(presenceInterval);
  presenceInterval = null;
  if (currentStudentId) {
    supabase.from('cq_presence').upsert({
      student_id: currentStudentId,
      is_online: false,
      last_seen: new Date().toISOString(),
    }, { onConflict: 'student_id' }).then(() => {});
  }
}

export function updatePresencePage(page) {
  sendHeartbeat(page);
}

async function sendHeartbeat(page) {
  if (!currentStudentId) return;
  try {
    await supabase.from('cq_presence').upsert({
      student_id: currentStudentId,
      current_page: page || 'app',
      last_seen: new Date().toISOString(),
      is_online: true,
    }, { onConflict: 'student_id' });
  } catch (e) {
    // Silently fail — presence is non-critical
  }
}

// Stop presence on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', stopPresence);
}
