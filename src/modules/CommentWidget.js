import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthProvider';
import { MessageSquare, Send, ChevronRight } from 'lucide-react';

const C = {
  bg:"#0a0f1a",card:"#111827",accent:"#32E0C4",gold:"#F59E0B",
  text:"#e2e8f0",muted:"#94a3b8",border:"#1e293b",success:"#10B981",
  danger:"#EF4444",primary:"#0D7377",dimmed:"#64748b",
};

export function CommentButton({ moduleCode }) {
  const { student } = useAuth();
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function send() {
    if (!msg.trim() || !student) return;
    setSending(true);
    try {
      // Get module id
      let moduleId = null;
      if (moduleCode) {
        const { data: mod } = await supabase.from('cq_modules').select('id').eq('code', moduleCode).single();
        moduleId = mod?.id;
      }
      await supabase.from('cq_comments').insert({
        student_id: student.id,
        module_id: moduleId,
        message: msg.trim(),
      });
      setMsg(''); setSent(true);
      setTimeout(() => { setSent(false); setOpen(false); }, 2000);
    } catch (e) {
      console.log('Comment error:', e);
    }
    setSending(false);
  }

  if (!student) return null;

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '5px 10px', borderRadius: 6,
        border: '1px solid ' + C.gold + '40',
        background: C.gold + '10', color: C.gold,
        cursor: 'pointer', fontFamily: 'inherit', fontSize: 10, fontWeight: 600,
      }}>
        <MessageSquare size={12} /> Question
      </button>

      {open && (
        <div style={{
          position: 'absolute', bottom: '100%', right: 0, marginBottom: 8,
          width: 300, background: C.card, borderRadius: 12, padding: 14,
          border: '1px solid ' + C.border, boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          zIndex: 100,
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 8 }}>
            Envoyer un message au prof
          </div>
          {moduleCode && (
            <div style={{ fontSize: 10, color: C.accent, marginBottom: 8, padding: '2px 6px', background: C.accent + '10', borderRadius: 4, display: 'inline-block' }}>
              {moduleCode}
            </div>
          )}

          {sent ? (
            <div style={{ padding: 12, textAlign: 'center', color: C.success, fontSize: 12, fontWeight: 600 }}>
              Message envoye !
            </div>
          ) : (
            <>
              <textarea
                value={msg} onChange={e => setMsg(e.target.value)}
                placeholder="Votre question, commentaire ou difficulte..."
                rows={3}
                style={{
                  width: '100%', padding: '8px 10px', borderRadius: 6,
                  border: '1px solid ' + C.border, background: C.bg,
                  color: C.text, fontFamily: 'inherit', fontSize: 11,
                  resize: 'vertical', boxSizing: 'border-box',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
                <button onClick={() => setOpen(false)} style={{
                  padding: '5px 12px', borderRadius: 5, border: '1px solid ' + C.border,
                  background: 'transparent', color: C.muted, cursor: 'pointer',
                  fontFamily: 'inherit', fontSize: 10, marginRight: 6,
                }}>Annuler</button>
                <button onClick={send} disabled={sending || !msg.trim()} style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '5px 14px', borderRadius: 5, border: 'none',
                  background: sending ? C.border : C.gold,
                  color: C.bg, cursor: sending ? 'default' : 'pointer',
                  fontFamily: 'inherit', fontSize: 10, fontWeight: 600,
                }}><Send size={10} /> {sending ? '...' : 'Envoyer'}</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
