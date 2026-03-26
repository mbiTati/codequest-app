import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const C = {
  bg: "#0a0f1a", card: "#111827", accent: "#32E0C4", gold: "#F59E0B",
  text: "#e2e8f0", muted: "#94a3b8", border: "#1e293b", danger: "#EF4444",
  primary: "#0D7377", success: "#10B981", dimmed: "#64748b",
};

const TEACHER_EMAILS = ['tati.b@hotmail.fr']; // ajuster

export default function TeacherDashboard() {
  const [students, setStudents] = useState([]);
  const [progress, setProgress] = useState([]);
  const [modules, setModules] = useState([]);
  const [gameScores, setGameScores] = useState([]);
  const [filterModule, setFilterModule] = useState('all');
  const [filterCohort, setFilterCohort] = useState('all');
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview'); // overview, students, grades, games

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const [sRes, pRes, mRes, gRes] = await Promise.all([
      supabase.from('cq_students').select('*').order('last_name'),
      supabase.from('cq_student_progress').select('*, cq_modules(code, title, phase, order_index)'),
      supabase.from('cq_modules').select('*').eq('unit_id', 1).order('order_index'),
      supabase.from('cq_game_scores').select('*').order('played_at', { ascending: false }).limit(100),
    ]);
    setStudents(sRes.data || []);
    setProgress(pRes.data || []);
    setModules(mRes.data || []);
    setGameScores(gRes.data || []);
    setLoading(false);
  }

  const filtered = filterCohort === 'all' ? students : students.filter(s => s.cohort === filterCohort);
  const filteredIds = new Set(filtered.map(s => s.id));
  const filteredProgress = progress.filter(p => filteredIds.has(p.student_id));

  // Stats
  const totalStudents = filtered.length;
  const activeStudents = new Set(filteredProgress.map(p => p.student_id)).size;
  const completedModules = filteredProgress.filter(p => p.completed_at).length;
  const avgQuizScore = filteredProgress.length > 0
    ? Math.round(filteredProgress.reduce((a, p) => a + (p.total_questions > 0 ? (p.quiz_score / p.total_questions) * 100 : 0), 0) / filteredProgress.length)
    : 0;

  // Students at risk (less than 30% quiz accuracy or no progress)
  const studentStats = filtered.map(s => {
    const sp = filteredProgress.filter(p => p.student_id === s.id);
    const totalQ = sp.reduce((a, p) => a + p.total_questions, 0);
    const totalS = sp.reduce((a, p) => a + p.quiz_score, 0);
    const accuracy = totalQ > 0 ? Math.round((totalS / totalQ) * 100) : 0;
    const modulesCompleted = sp.filter(p => p.completed_at).length;
    const totalCredits = sp.reduce((a, p) => a + p.credits_earned, 0);
    const lastActive = sp.length > 0 ? new Date(Math.max(...sp.map(p => new Date(p.updated_at)))).toLocaleDateString('fr-FR') : 'Jamais';
    return { ...s, accuracy, modulesCompleted, totalCredits, totalQ, lastActive, progressData: sp };
  }).sort((a, b) => b.totalCredits - a.totalCredits);

  const atRisk = studentStats.filter(s => s.accuracy < 40 || s.modulesCompleted === 0);

  // Module stats
  const moduleStats = modules.map(m => {
    const mp = filteredProgress.filter(p => p.module_id === m.id);
    return {
      ...m,
      started: mp.length,
      completed: mp.filter(p => p.completed_at).length,
      avgScore: mp.length > 0 ? Math.round(mp.reduce((a, p) => a + (p.total_questions > 0 ? (p.quiz_score / p.total_questions) * 100 : 0), 0) / mp.length) : 0,
      avgCredits: mp.length > 0 ? Math.round(mp.reduce((a, p) => a + p.credits_earned, 0) / mp.length) : 0,
    };
  });

  if (loading) return <div style={{ minHeight: '100vh', background: C.bg, color: C.muted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Chargement du dashboard...</div>;

  const tabStyle = (t) => ({
    padding: '8px 16px', borderRadius: 8, border: 'none',
    background: tab === t ? C.primary : 'transparent',
    color: tab === t ? C.text : C.muted,
    cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
  });

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", padding: 20 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 3, color: C.dimmed }}>ECOLE SCHULZ</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.accent }}>Dashboard Enseignant</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <select value={filterCohort} onChange={e => setFilterCohort(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid ' + C.border, background: C.card, color: C.text, fontSize: 11 }}>
              <option value="all">Toutes les cohortes</option>
              <option value="2025">2025-2026</option>
              <option value="2026">2026-2027</option>
            </select>
            <button onClick={loadData} style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid ' + C.border, background: C.card, color: C.muted, cursor: 'pointer', fontSize: 11 }}>Rafraichir</button>
          </div>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Eleves inscrits', value: totalStudents, color: C.accent },
            { label: 'Eleves actifs', value: activeStudents, color: C.primary },
            { label: 'Modules completes', value: completedModules, color: C.gold },
            { label: 'Taux quiz moyen', value: avgQuizScore + '%', color: avgQuizScore >= 60 ? C.success : C.danger },
          ].map((kpi, i) => (
            <div key={i} style={{ background: C.card, borderRadius: 12, padding: 16, border: '1px solid ' + C.border }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: kpi.color }}>{kpi.value}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Alert: students at risk */}
        {atRisk.length > 0 && (
          <div style={{ background: C.danger + '10', borderRadius: 10, padding: 14, border: '1px solid ' + C.danger + '30', marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.danger, marginBottom: 6 }}>
              {"Eleves en difficulte (" + atRisk.length + ")"}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {atRisk.map(s => (
                <span key={s.id} style={{
                  padding: '4px 10px', borderRadius: 6, background: C.danger + '20',
                  fontSize: 11, color: C.danger, fontWeight: 600,
                }}>{s.first_name + " " + s.last_name + " (" + s.accuracy + "%)"}</span>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
          <button onClick={() => setTab('overview')} style={tabStyle('overview')}>Vue modules</button>
          <button onClick={() => setTab('students')} style={tabStyle('students')}>Eleves</button>
          <button onClick={() => setTab('games')} style={tabStyle('games')}>Jeux arcade</button>
        </div>

        {/* Tab: Overview */}
        {tab === 'overview' && (
          <div style={{ display: 'grid', gap: 8 }}>
            {moduleStats.map(m => {
              const pct = totalStudents > 0 ? Math.round((m.completed / totalStudents) * 100) : 0;
              return (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: C.card, borderRadius: 10, border: '1px solid ' + C.border }}>
                  <div style={{ width: 50, fontSize: 11, fontWeight: 700, color: C.accent }}>{m.code}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{m.title}</div>
                    <div style={{ height: 6, background: C.border, borderRadius: 3, marginTop: 4 }}>
                      <div style={{ height: '100%', width: pct + '%', background: pct >= 60 ? C.success : pct >= 30 ? C.gold : C.danger, borderRadius: 3, transition: 'width .3s' }} />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: 100 }}>
                    <div style={{ fontSize: 12, color: C.text }}>{m.completed + "/" + totalStudents + " completes"}</div>
                    <div style={{ fontSize: 10, color: C.muted }}>{"Quiz: " + m.avgScore + "% | CR: " + m.avgCredits}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab: Students */}
        {tab === 'students' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid ' + C.border }}>
                  {['Eleve', 'Cohorte', 'Modules', 'Quiz %', 'Credits', 'Dernier actif'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: C.muted, fontWeight: 600, fontSize: 10 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {studentStats.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid ' + C.border }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: C.text }}>{s.first_name + " " + s.last_name}</td>
                    <td style={{ padding: '10px 12px', color: C.muted }}>{s.cohort}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ color: C.accent, fontWeight: 700 }}>{s.modulesCompleted}</span>
                      <span style={{ color: C.dimmed }}>/16</span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{
                        padding: '2px 8px', borderRadius: 10,
                        background: (s.accuracy >= 60 ? C.success : s.accuracy >= 40 ? C.gold : C.danger) + '20',
                        color: s.accuracy >= 60 ? C.success : s.accuracy >= 40 ? C.gold : C.danger,
                        fontSize: 11, fontWeight: 600,
                      }}>{s.accuracy + "%"}</span>
                    </td>
                    <td style={{ padding: '10px 12px', color: C.gold, fontWeight: 600 }}>{s.totalCredits}</td>
                    <td style={{ padding: '10px 12px', color: C.dimmed, fontSize: 11 }}>{s.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab: Games */}
        {tab === 'games' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 16 }}>
              {['g-snakejava', 'g-tetris', 'g-memory', 'g-tower', 'g-bottle', 'g-maze', 'g-bubble', 'g-snake', 'g-factory'].map(gid => {
                const gs = gameScores.filter(g => g.game_id === gid);
                const avgScore = gs.length > 0 ? Math.round(gs.reduce((a, g) => a + g.score, 0) / gs.length) : 0;
                const bestScore = gs.length > 0 ? Math.max(...gs.map(g => g.score)) : 0;
                return (
                  <div key={gid} style={{ background: C.card, borderRadius: 10, padding: 12, border: '1px solid ' + C.border }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.gold }}>{gid.replace('g-', '').toUpperCase()}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{gs.length + " parties jouees"}</div>
                    <div style={{ fontSize: 11, color: C.text, marginTop: 2 }}>{"Moy: " + avgScore + " | Best: " + bestScore}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { TEACHER_EMAILS };
