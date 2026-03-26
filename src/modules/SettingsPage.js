import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthProvider';
import { Eye, EyeOff, Save, Shield, Users, Bell } from 'lucide-react';

const C = {
  bg:"#0a0f1a",card:"#111827",accent:"#32E0C4",gold:"#F59E0B",
  text:"#e2e8f0",muted:"#94a3b8",border:"#1e293b",success:"#10B981",
  danger:"#EF4444",primary:"#0D7377",dimmed:"#64748b",
};

export default function SettingsPage() {
  const { user, student } = useAuth();
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwdMsg, setPwdMsg] = useState(null);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [scoresPublic, setScoresPublic] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState(null);
  const [myComments, setMyComments] = useState([]);

  useEffect(() => {
    loadSettings();
    loadComments();
  }, [student]);

  async function loadSettings() {
    if (!student) return;
    try {
      const { data } = await supabase.from('cq_student_settings').select('*').eq('student_id', student.id).single();
      if (data) setScoresPublic(data.scores_public);
    } catch (e) {}
  }

  async function loadComments() {
    if (!student) return;
    try {
      const { data } = await supabase.from('cq_comments')
        .select('*, cq_modules(code, title)')
        .eq('student_id', student.id)
        .order('created_at', { ascending: false })
        .limit(10);
      setMyComments(data || []);
    } catch (e) {}
  }

  async function changePassword() {
    setPwdMsg(null);
    if (newPwd.length < 6) { setPwdMsg({ type: 'error', text: 'Minimum 6 caracteres' }); return; }
    if (newPwd !== confirmPwd) { setPwdMsg({ type: 'error', text: 'Les mots de passe ne correspondent pas' }); return; }

    setPwdLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPwd });
    if (error) {
      setPwdMsg({ type: 'error', text: error.message });
    } else {
      setPwdMsg({ type: 'success', text: 'Mot de passe change !' });
      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
    }
    setPwdLoading(false);
  }

  async function saveVisibility() {
    if (!student) return;
    setSettingsLoading(true);
    try {
      await supabase.from('cq_student_settings').upsert({
        student_id: student.id,
        scores_public: scoresPublic,
      }, { onConflict: 'student_id' });
      setSettingsMsg({ type: 'success', text: 'Preferences sauvegardees !' });
      setTimeout(() => setSettingsMsg(null), 2000);
    } catch (e) {
      setSettingsMsg({ type: 'error', text: 'Erreur de sauvegarde' });
    }
    setSettingsLoading(false);
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 8,
    border: '1px solid ' + C.border, background: C.bg,
    color: C.text, fontFamily: 'inherit', fontSize: 13,
    outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", padding: 20 }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.accent, marginBottom: 20 }}>Parametres</div>

        {/* Profile info */}
        <div style={{ background: C.card, borderRadius: 12, padding: 16, border: '1px solid ' + C.border, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}><Shield size={14} color={C.accent} /> Mon profil</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
            <div><span style={{ color: C.dimmed }}>Email : </span><span style={{ color: C.text }}>{user?.email}</span></div>
            <div><span style={{ color: C.dimmed }}>Nom : </span><span style={{ color: C.text }}>{student ? student.first_name + ' ' + student.last_name : '--'}</span></div>
            <div><span style={{ color: C.dimmed }}>Cohorte : </span><span style={{ color: C.accent }}>{student?.cohort || '--'}</span></div>
          </div>
        </div>

        {/* Change password */}
        <div style={{ background: C.card, borderRadius: 12, padding: 16, border: '1px solid ' + C.border, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><Shield size={14} color={C.gold} /> Changer le mot de passe</div>

          <div style={{ marginBottom: 10, position: 'relative' }}>
            <input type={showNew ? 'text' : 'password'} placeholder="Nouveau mot de passe" value={newPwd}
              onChange={e => setNewPwd(e.target.value)} style={{ ...inputStyle, paddingRight: 40 }} />
            <button onClick={() => setShowNew(!showNew)} style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', color: C.muted, cursor: 'pointer',
            }}>{showNew ? <EyeOff size={16} /> : <Eye size={16} />}</button>
          </div>

          <div style={{ marginBottom: 12, position: 'relative' }}>
            <input type={showNew ? 'text' : 'password'} placeholder="Confirmer le mot de passe" value={confirmPwd}
              onChange={e => setConfirmPwd(e.target.value)} style={inputStyle} />
          </div>

          {pwdMsg && (
            <div style={{
              padding: '8px 12px', borderRadius: 6, marginBottom: 10,
              background: (pwdMsg.type === 'success' ? C.success : C.danger) + '15',
              border: '1px solid ' + (pwdMsg.type === 'success' ? C.success : C.danger) + '40',
              fontSize: 11, color: pwdMsg.type === 'success' ? C.success : C.danger,
            }}>{pwdMsg.text}</div>
          )}

          <button onClick={changePassword} disabled={pwdLoading} style={{
            padding: '10px 20px', borderRadius: 8, border: 'none',
            background: pwdLoading ? C.border : C.gold, color: C.bg,
            cursor: pwdLoading ? 'default' : 'pointer',
            fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
          }}>{pwdLoading ? '...' : 'Changer le mot de passe'}</button>
        </div>

        {/* Visibility toggle */}
        <div style={{ background: C.card, borderRadius: 12, padding: 16, border: '1px solid ' + C.border, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><Users size={14} color={C.primary} /> Visibilite des scores</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <button onClick={() => setScoresPublic(!scoresPublic)} style={{
              width: 48, height: 26, borderRadius: 13, border: 'none',
              background: scoresPublic ? C.success : C.border,
              cursor: 'pointer', position: 'relative', transition: 'background .2s',
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%', background: '#fff',
                position: 'absolute', top: 3,
                left: scoresPublic ? 25 : 3,
                transition: 'left .2s',
              }} />
            </button>
            <div>
              <div style={{ fontSize: 12, color: C.text, fontWeight: 600 }}>
                {scoresPublic ? 'Visible par les autres eleves' : 'Prive (seulement vous et le prof)'}
              </div>
              <div style={{ fontSize: 10, color: C.muted }}>
                {scoresPublic ? 'Votre nom et vos credits apparaissent dans le classement' : 'Seul le professeur peut voir vos scores'}
              </div>
            </div>
          </div>

          {settingsMsg && (
            <div style={{
              padding: '6px 10px', borderRadius: 6, marginBottom: 8,
              background: (settingsMsg.type === 'success' ? C.success : C.danger) + '15',
              fontSize: 11, color: settingsMsg.type === 'success' ? C.success : C.danger,
            }}>{settingsMsg.text}</div>
          )}

          <button onClick={saveVisibility} disabled={settingsLoading} style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '8px 16px', borderRadius: 6, border: 'none',
            background: settingsLoading ? C.border : C.primary, color: '#fff',
            cursor: settingsLoading ? 'default' : 'pointer',
            fontFamily: 'inherit', fontSize: 11, fontWeight: 600,
          }}><Save size={12} /> Sauvegarder</button>
        </div>

        {/* My comments history */}
        <div style={{ background: C.card, borderRadius: 12, padding: 16, border: '1px solid ' + C.border }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><Bell size={14} color={C.gold} /> Mes messages au prof</div>

          {myComments.length === 0 ? (
            <div style={{ fontSize: 11, color: C.dimmed, textAlign: 'center', padding: 12 }}>Aucun message envoye</div>
          ) : (
            myComments.map(c => (
              <div key={c.id} style={{ marginBottom: 8, padding: '8px 10px', borderRadius: 8, background: C.bg, border: '1px solid ' + C.border }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  {c.cq_modules && <span style={{ fontSize: 9, color: C.accent, padding: '1px 6px', borderRadius: 4, background: C.accent + '10' }}>{c.cq_modules.code}</span>}
                  <span style={{ fontSize: 9, color: C.dimmed }}>{new Date(c.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
                <div style={{ fontSize: 11, color: C.text, marginBottom: 4 }}>{c.message}</div>
                {c.teacher_reply && (
                  <div style={{ fontSize: 11, color: C.success, padding: '4px 8px', background: C.success + '10', borderRadius: 4, marginTop: 4 }}>
                    <span style={{ fontWeight: 600 }}>Prof : </span>{c.teacher_reply}
                  </div>
                )}
                {!c.teacher_reply && <div style={{ fontSize: 9, color: C.dimmed, fontStyle: 'italic' }}>En attente de reponse...</div>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
