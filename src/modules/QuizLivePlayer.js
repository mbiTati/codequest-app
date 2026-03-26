import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthProvider';
import { Zap, Clock, Check, X, Trophy, Loader } from 'lucide-react';

const C = {
  bg:"#0a0f1a",card:"#111827",accent:"#32E0C4",gold:"#F59E0B",
  text:"#e2e8f0",muted:"#94a3b8",border:"#1e293b",danger:"#EF4444",
  success:"#10B981",primary:"#0D7377",dimmed:"#64748b",
};

const OPT_COLORS = ["#EF4444","#3B82F6","#F59E0B","#10B981"];
const OPT_SHAPES = ["▲","◆","●","■"];

export default function QuizLivePlayer() {
  const { student } = useAuth();
  const [pin, setPin] = useState('');
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(-1);
  const [status, setStatus] = useState('join'); // join, lobby, question, answered, results, finished
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [points, setPoints] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timer, setTimer] = useState(0);
  const [rank, setRank] = useState(0);
  const [error, setError] = useState('');
  const questionStartRef = useRef(null);
  const timerRef = useRef(null);

  // Listen for session changes (question advancing, status)
  useEffect(() => {
    if (!session) return;

    const channel = supabase.channel('player-' + session.id)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'cq_quiz_sessions', filter: 'id=eq.' + session.id }, (payload) => {
        const updated = payload.new;
        setSession(updated);

        if (updated.status === 'question') {
          setCurrentQ(updated.current_question);
          setSelected(null);
          setIsCorrect(null);
          setPoints(0);
          setStatus('question');
          questionStartRef.current = Date.now();
          // Start local timer
          const q = questions[updated.current_question];
          if (q) {
            setTimer(q.time_limit);
            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = setInterval(() => {
              setTimer(t => {
                if (t <= 1) { clearInterval(timerRef.current); return 0; }
                return t - 1;
              });
            }, 1000);
          }
        } else if (updated.status === 'results') {
          clearInterval(timerRef.current);
          setStatus('results');
          loadMyRank();
        } else if (updated.status === 'finished') {
          setStatus('finished');
          loadMyRank();
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [session?.id, questions]);

  async function loadMyRank() {
    if (!session || !student) return;
    const { data } = await supabase.from('cq_quiz_players').select('score').eq('session_id', session.id).order('score', { ascending: false });
    if (data) {
      const myIdx = data.findIndex((_, i) => {
        // find my score
        return true;
      });
      // Just reload my score
      const { data: me } = await supabase.from('cq_quiz_players').select('score, streak').eq('session_id', session.id).eq('student_id', student.id).single();
      if (me) {
        setTotalScore(me.score);
        setStreak(me.streak);
      }
      // Get rank
      const { data: all } = await supabase.from('cq_quiz_players').select('student_id, score').eq('session_id', session.id).order('score', { ascending: false });
      if (all) {
        const r = all.findIndex(p => p.student_id === student.id) + 1;
        setRank(r);
      }
    }
  }

  async function joinSession() {
    setError('');
    if (pin.length !== 4) { setError('Code PIN a 4 chiffres'); return; }

    const { data: sess } = await supabase.from('cq_quiz_sessions').select('*').eq('pin', pin).single();
    if (!sess) { setError('Code PIN invalide'); return; }
    if (sess.status === 'finished') { setError('Ce quiz est termine'); return; }

    // Load questions
    const { data: qs } = await supabase.from('cq_quiz_questions').select('*').eq('session_id', sess.id).order('question_index');
    setQuestions(qs || []);

    // Join as player
    const nickname = student ? student.first_name : 'Joueur';
    await supabase.from('cq_quiz_players').upsert({
      session_id: sess.id,
      student_id: student.id,
      nickname,
    }, { onConflict: 'session_id,student_id' });

    setSession(sess);
    setStatus(sess.status === 'lobby' ? 'lobby' : 'question');
  }

  async function submitAnswer(ansIdx) {
    if (selected !== null || !session || !student) return;
    setSelected(ansIdx);
    clearInterval(timerRef.current);

    const q = questions[currentQ];
    if (!q) return;

    const correct = ansIdx === q.correct_index;
    setIsCorrect(correct);

    const responseTime = Date.now() - (questionStartRef.current || Date.now());
    const timeBonus = Math.max(0, Math.round((1 - responseTime / (q.time_limit * 1000)) * 500));
    const pts = correct ? 100 + timeBonus : 0;
    setPoints(pts);

    // Save answer
    await supabase.from('cq_quiz_answers').upsert({
      session_id: session.id,
      question_index: currentQ,
      student_id: student.id,
      answer_index: ansIdx,
      is_correct: correct,
      response_time_ms: responseTime,
      points_earned: pts,
    }, { onConflict: 'session_id,question_index,student_id' });

    // Update player score
    const newStreak = correct ? streak + 1 : 0;
    setStreak(newStreak);
    const streakBonus = correct && newStreak >= 3 ? 50 : 0;
    const totalPts = pts + streakBonus;

    await supabase.from('cq_quiz_players')
      .update({ score: totalScore + totalPts, streak: newStreak })
      .eq('session_id', session.id)
      .eq('student_id', student.id);

    setTotalScore(s => s + totalPts);
    setStatus('answered');
  }

  // ============================================
  // JOIN SCREEN
  // ============================================
  if (status === 'join') {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <Zap size={40} color={C.gold} />
        <div style={{ fontSize: 24, fontWeight: 800, color: C.gold, marginTop: 8, marginBottom: 20 }}>Rejoindre un Quiz</div>

        <input value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
          placeholder="Code PIN" maxLength={4}
          style={{
            width: 200, padding: "16px", borderRadius: 12, border: "2px solid " + C.gold + "40",
            background: C.card, color: C.gold, fontFamily: "monospace",
            fontSize: 36, fontWeight: 800, textAlign: "center", letterSpacing: 8,
          }} />

        {error && <div style={{ marginTop: 8, fontSize: 12, color: C.danger }}>{error}</div>}

        <button onClick={joinSession} disabled={pin.length !== 4} style={{
          marginTop: 16, padding: "12px 32px", borderRadius: 10, border: "none",
          background: pin.length === 4 ? C.gold : C.border,
          color: pin.length === 4 ? C.bg : C.dimmed,
          cursor: pin.length === 4 ? "pointer" : "default",
          fontFamily: "inherit", fontSize: 16, fontWeight: 700,
        }}>Rejoindre</button>
      </div>
    );
  }

  // ============================================
  // LOBBY
  // ============================================
  if (status === 'lobby') {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
        <div style={{ animation: "spin 2s linear infinite" }}><Loader size={32} color={C.accent} /></div>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.accent, marginTop: 12 }}>Vous etes connecte !</div>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{student?.first_name || 'Joueur'}</div>
        <div style={{ fontSize: 12, color: C.dimmed, marginTop: 12 }}>En attente du professeur...</div>
      </div>
    );
  }

  // ============================================
  // QUESTION (answer buttons)
  // ============================================
  if (status === 'question') {
    const q = questions[currentQ];
    if (!q) return null;

    return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", padding: 12 }}>
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: timer <= 5 ? C.danger : C.gold }}>{timer}</div>
          <div style={{ fontSize: 10, color: C.muted }}>{"Question " + (currentQ + 1)}</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, height: "calc(100vh - 100px)" }}>
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => submitAnswer(i)} style={{
              borderRadius: 12, border: "none",
              background: OPT_COLORS[i],
              color: "#fff", cursor: "pointer",
              fontFamily: "inherit", fontSize: 18, fontWeight: 700,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: 8, opacity: 0.9,
            }}>
              <div style={{ fontSize: 36 }}>{OPT_SHAPES[i]}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ============================================
  // ANSWERED (waiting for reveal)
  // ============================================
  if (status === 'answered') {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
        {isCorrect ? (
          <>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: C.success + "20", border: "3px solid " + C.success, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check size={40} color={C.success} />
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.success, marginTop: 12 }}>Correct !</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.gold, marginTop: 4 }}>{"+" + points + " pts"}</div>
            {streak >= 3 && <div style={{ fontSize: 13, color: C.accent, marginTop: 4 }}>{"Serie de " + streak + " ! +50 bonus"}</div>}
          </>
        ) : (
          <>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: C.danger + "20", border: "3px solid " + C.danger, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={40} color={C.danger} />
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.danger, marginTop: 12 }}>Incorrect</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Serie perdue</div>
          </>
        )}
        <div style={{ fontSize: 12, color: C.dimmed, marginTop: 16 }}>En attente de la suite...</div>
      </div>
    );
  }

  // ============================================
  // RESULTS (between questions)
  // ============================================
  if (status === 'results') {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <Trophy size={40} color={C.gold} />
        <div style={{ fontSize: 14, color: C.muted, marginTop: 8 }}>Votre position</div>
        <div style={{ fontSize: 48, fontWeight: 800, color: rank <= 3 ? C.gold : C.text }}>{"#" + rank}</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.gold }}>{totalScore + " pts"}</div>
        {streak >= 2 && <div style={{ fontSize: 12, color: C.accent, marginTop: 4 }}>{"Serie : " + streak}</div>}
        <div style={{ fontSize: 12, color: C.dimmed, marginTop: 12 }}>Prochaine question bientot...</div>
      </div>
    );
  }

  // ============================================
  // FINISHED
  // ============================================
  if (status === 'finished') {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <Trophy size={64} color={C.gold} />
        <div style={{ fontSize: 28, fontWeight: 800, color: C.gold, marginTop: 12 }}>Quiz Termine !</div>
        <div style={{ fontSize: 48, fontWeight: 800, color: rank <= 3 ? C.gold : C.text, marginTop: 8 }}>{"#" + rank}</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.gold, marginTop: 4 }}>{totalScore + " pts"}</div>
        <button onClick={() => { setStatus('join'); setSession(null); setPin(''); }} style={{
          marginTop: 24, padding: "10px 24px", borderRadius: 8, border: "1px solid " + C.border,
          background: "transparent", color: C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 12,
        }}>Retour</button>
      </div>
    );
  }

  return null;
}
