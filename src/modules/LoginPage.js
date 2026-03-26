import { useState } from 'react';
import { useAuth } from '../lib/AuthProvider';

const C = {
  bg: "#0a0f1a", card: "#111827", accent: "#32E0C4", gold: "#F59E0B",
  text: "#e2e8f0", muted: "#94a3b8", border: "#1e293b", danger: "#EF4444",
  primary: "#0D7377", dimmed: "#64748b",
};

export default function LoginPage() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('login'); // login or signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cohort, setCohort] = useState('2025');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);

    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) setError(error.message);
    } else {
      if (!firstName.trim() || !lastName.trim()) {
        setError('Prenom et nom requis'); setLoading(false); return;
      }
      const { error } = await signUp(email, password, firstName.trim(), lastName.trim(), cohort);
      if (error) setError(error.message);
      else setSuccess('Compte cree ! Verifiez votre email pour confirmer.');
    }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 8,
    border: '1px solid ' + C.border, background: C.card,
    color: C.text, fontFamily: 'inherit', fontSize: 13,
    outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{
      minHeight: '100vh', background: C.bg, color: C.text,
      fontFamily: "'Segoe UI',system-ui,sans-serif",
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: 24,
    }}>
      <div style={{ fontSize: 11, letterSpacing: 4, color: C.dimmed, marginBottom: 8 }}>
        ECOLE SCHULZ
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, color: C.accent, marginBottom: 4 }}>
        CODEQUEST
      </div>
      <div style={{ fontSize: 14, color: C.muted, marginBottom: 32 }}>
        Le Labo de l'Inventeur
      </div>

      <div style={{
        width: '100%', maxWidth: 380, background: C.card,
        borderRadius: 16, padding: 28, border: '1px solid ' + C.border,
      }}>
        <div style={{ display: 'flex', marginBottom: 20, borderRadius: 8, overflow: 'hidden', border: '1px solid ' + C.border }}>
          <button onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
            style={{
              flex: 1, padding: '8px', border: 'none',
              background: mode === 'login' ? C.primary : 'transparent',
              color: mode === 'login' ? C.text : C.muted,
              cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
            }}>Connexion</button>
          <button onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}
            style={{
              flex: 1, padding: '8px', border: 'none',
              background: mode === 'signup' ? C.primary : 'transparent',
              color: mode === 'signup' ? C.text : C.muted,
              cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
            }}>Inscription</button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <input type="text" placeholder="Prenom" value={firstName}
                  onChange={e => setFirstName(e.target.value)} style={inputStyle} />
                <input type="text" placeholder="Nom" value={lastName}
                  onChange={e => setLastName(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <select value={cohort} onChange={e => setCohort(e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="2025">Cohorte 2025-2026</option>
                  <option value="2026">Cohorte 2026-2027</option>
                </select>
              </div>
            </>
          )}

          <div style={{ marginBottom: 12 }}>
            <input type="email" placeholder="Email" value={email}
              onChange={e => setEmail(e.target.value)} required style={inputStyle} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <input type="password" placeholder="Mot de passe" value={password}
              onChange={e => setPassword(e.target.value)} required minLength={6} style={inputStyle} />
          </div>

          {error && (
            <div style={{
              padding: '8px 12px', borderRadius: 8, marginBottom: 12,
              background: C.danger + '15', border: '1px solid ' + C.danger + '40',
              fontSize: 11, color: C.danger,
            }}>{error}</div>
          )}

          {success && (
            <div style={{
              padding: '8px 12px', borderRadius: 8, marginBottom: 12,
              background: '#10B98115', border: '1px solid #10B98140',
              fontSize: 11, color: '#10B981',
            }}>{success}</div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '12px', borderRadius: 8, border: 'none',
            background: loading ? C.border : C.accent, color: C.bg,
            cursor: loading ? 'default' : 'pointer',
            fontFamily: 'inherit', fontSize: 14, fontWeight: 700,
          }}>
            {loading ? '...' : mode === 'login' ? 'Se connecter' : "S'inscrire"}
          </button>
        </form>
      </div>

      <div style={{ marginTop: 16, fontSize: 10, color: C.dimmed }}>
        BTEC HND Unit 1 · Programming
      </div>
    </div>
  );
}
