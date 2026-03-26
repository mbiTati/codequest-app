import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthProvider';
import { Play, Users, Clock, Trophy, ChevronRight, Zap, BarChart, Copy, Check } from 'lucide-react';

const C = {
  bg:"#0a0f1a",card:"#111827",accent:"#32E0C4",gold:"#F59E0B",
  text:"#e2e8f0",muted:"#94a3b8",border:"#1e293b",danger:"#EF4444",
  success:"#10B981",primary:"#0D7377",dimmed:"#64748b",
};

const OPT_COLORS = ["#EF4444","#3B82F6","#F59E0B","#10B981"];
const OPT_SHAPES = ["▲","◆","●","■"];

// Pre-built question banks
const QUESTION_BANKS = {
  "Java Basics": [
    {q:"Quel mot-cle declare une constante en Java ?",opts:["static","final","const","immutable"],correct:1,time:15},
    {q:"Que vaut 10 / 3 en Java (int / int) ?",opts:["3.33","3","3.0","Erreur"],correct:1,time:15},
    {q:"Quel type pour stocker 3.14 ?",opts:["int","float","double","String"],correct:2,time:12},
    {q:"Comment afficher du texte en Java ?",opts:["print()","console.log()","System.out.println()","echo()"],correct:2,time:12},
    {q:"Que signifie 'private' ?",opts:["Accessible partout","Accessible dans le package","Accessible dans la classe seulement","Accessible aux sous-classes"],correct:2,time:15},
  ],
  "OOP / POO": [
    {q:"Quel mot-cle pour l'heritage en Java ?",opts:["implements","inherits","extends","super"],correct:2,time:12},
    {q:"A quoi sert un constructeur ?",opts:["Detruire un objet","Initialiser un objet","Copier un objet","Comparer des objets"],correct:1,time:15},
    {q:"Que fait 'this' dans un constructeur ?",opts:["Appelle le parent","Reference l'objet courant","Cree un nouvel objet","Detruit l'objet"],correct:1,time:15},
    {q:"Qu'est-ce que l'encapsulation ?",opts:["Heritage multiple","Cacher les details internes","Polymorphisme","Surcharge"],correct:1,time:15},
    {q:"super() dans un constructeur appelle...",opts:["La methode courante","Le constructeur de la classe parente","Un autre constructeur","Une methode statique"],correct:1,time:15},
    {q:"@Override signifie...",opts:["Creer une nouvelle methode","Redefinir une methode heritee","Supprimer une methode","Rendre une methode privee"],correct:1,time:15},
  ],
  "Debugging": [
    {q:"ArrayIndexOutOfBoundsException signifie...",opts:["Tableau vide","Index hors limites","Tableau null","Type incorrect"],correct:1,time:12},
    {q:"NullPointerException se produit quand...",opts:["Variable = 0","Variable = null et on appelle une methode","Variable non declaree","Division par zero"],correct:1,time:15},
    {q:"Quel outil pour executer le code ligne par ligne ?",opts:["Compiler","Debugger","Profiler","Linter"],correct:1,time:12},
    {q:"Que fait un breakpoint ?",opts:["Arrete le programme definitivement","Pause l'execution a cette ligne","Supprime la ligne","Commente la ligne"],correct:1,time:12},
    {q:"try-catch sert a...",opts:["Accelerer le code","Gerer les erreurs","Optimiser la memoire","Commenter le code"],correct:1,time:12},
  ],
  "Conditions & Boucles": [
    {q:"Combien de fois s'execute : for(int i=0; i<5; i++) ?",opts:["4","5","6","Infini"],correct:1,time:15},
    {q:"Difference entre while et do-while ?",opts:["Aucune","do-while s'execute au moins 1 fois","while est plus rapide","do-while n'a pas de condition"],correct:1,time:15},
    {q:"'break' dans une boucle...",opts:["Passe a l'iteration suivante","Sort de la boucle","Relance la boucle","Pause la boucle"],correct:1,time:12},
    {q:"switch en Java necessite quel mot-cle apres chaque cas ?",opts:["stop","break","end","return"],correct:1,time:12},
    {q:"Que vaut (true && false) ?",opts:["true","false","null","Erreur"],correct:1,time:10},
  ],
};

export default function QuizLiveHost() {
  const { student } = useAuth();
  const [sessionId, setSessionId] = useState(null);
  const [pin, setPin] = useState('');
  const [status, setStatus] = useState('setup'); // setup, lobby, question, leaderboard, finished
  const [selectedBank, setSelectedBank] = useState('Java Basics');
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [players, setPlayers] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [timer, setTimer] = useState(0);
  const [showCorrect, setShowCorrect] = useState(false);
  const [copied, setCopied] = useState(false);
  const [customTitle, setCustomTitle] = useState('Quiz Live');
  const timerRef = useRef(null);

  // Realtime subscriptions
  useEffect(() => {
    if (!sessionId) return;

    const channel = supabase.channel('quiz-' + sessionId)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cq_quiz_players', filter: 'session_id=eq.' + sessionId }, (payload) => {
        loadPlayers();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cq_quiz_answers', filter: 'session_id=eq.' + sessionId }, (payload) => {
        loadAnswers();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [sessionId]);

  async function loadPlayers() {
    if (!sessionId) return;
    const { data } = await supabase.from('cq_quiz_players').select('*, cq_students(first_name, last_name)').eq('session_id', sessionId).order('score', { ascending: false });
    setPlayers(data || []);
  }

  async function loadAnswers() {
    if (!sessionId) return;
    const { data } = await supabase.from('cq_quiz_answers').select('*').eq('session_id', sessionId).eq('question_index', currentQ);
    setAnswers(data || []);
  }

  async function createSession() {
    const genPin = String(Math.floor(1000 + Math.random() * 9000));
    const qs = QUESTION_BANKS[selectedBank] || [];

    const { data: session, error } = await supabase.from('cq_quiz_sessions').insert({
      teacher_id: student.id,
      pin: genPin,
      title: customTitle,
      status: 'lobby',
      total_questions: qs.length,
    }).select().single();

    if (error) { console.log('Create session error:', error); return; }

    // Insert questions
    const qRows = qs.map((q, i) => ({
      session_id: session.id,
      question_index: i,
      question: q.q,
      options: q.opts,
      correct_index: q.correct,
      time_limit: q.time || 20,
    }));
    await supabase.from('cq_quiz_questions').insert(qRows);

    setSessionId(session.id);
    setPin(genPin);
    setQuestions(qs);
    setStatus('lobby');
    loadPlayers();
  }

  async function startQuestion() {
    setShowCorrect(false);
    setAnswers([]);
    setStatus('question');
    const q = questions[currentQ];
    const timeLimit = q.time || 20;
    setTimer(timeLimit);

    await supabase.from('cq_quiz_sessions').update({ status: 'question', current_question: currentQ }).eq('id', sessionId);

    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          revealAnswer();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  async function revealAnswer() {
    clearInterval(timerRef.current);
    setShowCorrect(true);
    setStatus('leaderboard');
    await supabase.from('cq_quiz_sessions').update({ status: 'results' }).eq('id', sessionId);
    loadAnswers();
    loadPlayers();
  }

  async function nextQuestion() {
    if (currentQ + 1 >= questions.length) {
      setStatus('finished');
      await supabase.from('cq_quiz_sessions').update({ status: 'finished' }).eq('id', sessionId);
    } else {
      setCurrentQ(c => c + 1);
      startQuestion();
    }
  }

  function copyPin() {
    navigator.clipboard?.writeText(pin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ============================================
  // SETUP SCREEN
  // ============================================
  if (status === 'setup') {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <Zap size={48} color={C.gold} />
        <div style={{ fontSize: 32, fontWeight: 800, color: C.gold, marginTop: 12 }}>QUIZ LIVE</div>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 24 }}>Creez un quiz, les eleves rejoignent avec un code PIN</div>

        <div style={{ width: "100%", maxWidth: 400 }}>
          <input value={customTitle} onChange={e => setCustomTitle(e.target.value)} placeholder="Titre du quiz"
            style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid " + C.border, background: C.card, color: C.text, fontFamily: "inherit", fontSize: 13, marginBottom: 12, boxSizing: "border-box" }} />

          <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 8 }}>Banque de questions :</div>
          <div style={{ display: "grid", gap: 6, marginBottom: 20 }}>
            {Object.keys(QUESTION_BANKS).map(bank => (
              <button key={bank} onClick={() => setSelectedBank(bank)} style={{
                padding: "10px 14px", borderRadius: 8, border: "1px solid " + (selectedBank === bank ? C.gold : C.border),
                background: selectedBank === bank ? C.gold + "15" : C.card,
                color: selectedBank === bank ? C.gold : C.muted,
                cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600, textAlign: "left",
              }}>
                {bank + " (" + QUESTION_BANKS[bank].length + " questions)"}
              </button>
            ))}
          </div>

          <button onClick={createSession} style={{
            width: "100%", padding: "14px", borderRadius: 10, border: "none",
            background: C.gold, color: C.bg, cursor: "pointer",
            fontFamily: "inherit", fontSize: 16, fontWeight: 700,
          }}>Creer le Quiz</button>
        </div>
      </div>
    );
  }

  // ============================================
  // LOBBY SCREEN (waiting for players)
  // ============================================
  if (status === 'lobby') {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ fontSize: 14, color: C.muted, marginBottom: 8 }}>Rejoignez sur votre telephone !</div>
        <div style={{ fontSize: 12, color: C.dimmed, marginBottom: 16 }}>codequest-app-sepia.vercel.app → Quiz Live → Code PIN</div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ fontSize: 64, fontWeight: 800, color: C.gold, letterSpacing: 12, fontFamily: "monospace" }}>{pin}</div>
          <button onClick={copyPin} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid " + C.border, background: "transparent", color: C.muted, cursor: "pointer" }}>
            {copied ? <Check size={16} color={C.success} /> : <Copy size={16} />}
          </button>
        </div>

        <div style={{ fontSize: 13, color: C.text, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <Users size={16} color={C.accent} /> {players.length + " joueurs connectes"}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 24, maxWidth: 600 }}>
          {players.map(p => (
            <div key={p.id} style={{
              padding: "6px 14px", borderRadius: 20, background: C.accent + "20",
              border: "1px solid " + C.accent + "40", fontSize: 13, fontWeight: 600, color: C.accent,
            }}>{p.nickname}</div>
          ))}
          {players.length === 0 && <div style={{ color: C.dimmed, fontSize: 12 }}>En attente de joueurs...</div>}
        </div>

        <button onClick={() => { setCurrentQ(0); startQuestion(); }} disabled={players.length === 0} style={{
          padding: "14px 40px", borderRadius: 12, border: "none",
          background: players.length > 0 ? C.success : C.border,
          color: "#fff", cursor: players.length > 0 ? "pointer" : "default",
          fontFamily: "inherit", fontSize: 18, fontWeight: 700,
          display: "flex", alignItems: "center", gap: 8,
        }}><Play size={20} /> LANCER ({questions.length} questions)</button>
      </div>
    );
  }

  // ============================================
  // QUESTION SCREEN
  // ============================================
  if (status === 'question' || status === 'leaderboard') {
    const q = questions[currentQ];
    if (!q) return null;
    const answerCount = answers.length;
    const timerPct = q.time > 0 ? Math.round((timer / q.time) * 100) : 0;

    return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", padding: 20 }}>
        <style>{`@keyframes countPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}`}</style>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: C.muted }}>{"Question " + (currentQ + 1) + "/" + questions.length}</div>
            <div style={{ fontSize: 12, color: C.muted }}>{answerCount + "/" + players.length + " reponses"}</div>
            {!showCorrect && (
              <div style={{ fontSize: 36, fontWeight: 800, color: timer <= 5 ? C.danger : C.gold, animation: timer <= 5 ? "countPulse .5s infinite" : "none" }}>
                {timer}
              </div>
            )}
          </div>

          {/* Timer bar */}
          {!showCorrect && (
            <div style={{ height: 6, background: C.border, borderRadius: 3, marginBottom: 16, overflow: "hidden" }}>
              <div style={{ height: "100%", width: timerPct + "%", background: timer <= 5 ? C.danger : C.gold, borderRadius: 3, transition: "width 1s linear" }} />
            </div>
          )}

          {/* Question */}
          <div style={{ background: C.card, borderRadius: 16, padding: 24, border: "1px solid " + C.border, marginBottom: 16, textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: C.text, lineHeight: 1.4 }}>{q.q}</div>
          </div>

          {/* Options */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            {q.opts.map((opt, i) => {
              const isCorrect = i === q.correct;
              const answeredCount = answers.filter(a => a.answer_index === i).length;
              let bg = OPT_COLORS[i] + "30";
              let borderC = OPT_COLORS[i] + "60";
              if (showCorrect) {
                bg = isCorrect ? C.success + "30" : OPT_COLORS[i] + "10";
                borderC = isCorrect ? C.success : C.border;
              }
              return (
                <div key={i} style={{
                  padding: "20px 16px", borderRadius: 12,
                  background: bg, border: "2px solid " + borderC,
                  display: "flex", alignItems: "center", gap: 12,
                  position: "relative",
                }}>
                  <div style={{ fontSize: 28, color: OPT_COLORS[i], opacity: 0.6 }}>{OPT_SHAPES[i]}</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: C.text, flex: 1 }}>{opt}</div>
                  {showCorrect && <div style={{ fontSize: 14, fontWeight: 700, color: C.muted }}>{answeredCount}</div>}
                  {showCorrect && isCorrect && <Check size={20} color={C.success} />}
                </div>
              );
            })}
          </div>

          {/* Leaderboard after reveal */}
          {showCorrect && (
            <div style={{ background: C.card, borderRadius: 12, padding: 16, border: "1px solid " + C.border, marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.gold, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <Trophy size={16} /> Classement
              </div>
              {players.slice(0, 8).map((p, i) => (
                <div key={p.id} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "6px 8px",
                  borderRadius: 6, background: i === 0 ? C.gold + "10" : "transparent",
                }}>
                  <div style={{ width: 24, textAlign: "center", fontSize: 14, fontWeight: 700, color: i < 3 ? C.gold : C.dimmed }}>{"#" + (i + 1)}</div>
                  <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: C.text }}>{p.nickname}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.gold }}>{p.score + " pts"}</div>
                </div>
              ))}
            </div>
          )}

          {/* Next button */}
          {showCorrect && (
            <div style={{ textAlign: "center" }}>
              <button onClick={nextQuestion} style={{
                padding: "14px 32px", borderRadius: 10, border: "none",
                background: C.gold, color: C.bg, cursor: "pointer",
                fontFamily: "inherit", fontSize: 16, fontWeight: 700,
                display: "inline-flex", alignItems: "center", gap: 8,
              }}>
                {currentQ + 1 >= questions.length ? <><Trophy size={18} /> Resultats finaux</> : <><ChevronRight size={18} /> Question suivante</>}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================
  // FINISHED SCREEN
  // ============================================
  if (status === 'finished') {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <style>{`@keyframes confetti{0%{transform:translateY(0) rotate(0)}100%{transform:translateY(100vh) rotate(720deg)}}`}</style>
        <Trophy size={64} color={C.gold} />
        <div style={{ fontSize: 32, fontWeight: 800, color: C.gold, marginTop: 12, marginBottom: 24 }}>Resultats Finaux</div>

        <div style={{ width: "100%", maxWidth: 500 }}>
          {/* Podium */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 12, marginBottom: 24, height: 150 }}>
            {players.slice(0, 3).map((p, i) => {
              const heights = [120, 100, 80];
              const colors = [C.gold, "#C0C0C0", "#CD7F32"];
              return (
                <div key={p.id} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 4 }}>{p.nickname}</div>
                  <div style={{
                    width: 80, height: heights[i], borderRadius: "8px 8px 0 0",
                    background: colors[i] + "30", border: "2px solid " + colors[i],
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: colors[i] }}>{"#" + (i + 1)}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{p.score + " pts"}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full leaderboard */}
          {players.slice(3).map((p, i) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderBottom: "1px solid " + C.border }}>
              <div style={{ fontSize: 12, color: C.dimmed }}>{"#" + (i + 4)}</div>
              <div style={{ flex: 1, fontSize: 12, color: C.text }}>{p.nickname}</div>
              <div style={{ fontSize: 12, color: C.gold }}>{p.score + " pts"}</div>
            </div>
          ))}
        </div>

        <button onClick={() => { setStatus('setup'); setSessionId(null); }} style={{
          marginTop: 24, padding: "10px 24px", borderRadius: 8, border: "1px solid " + C.border,
          background: "transparent", color: C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 12,
        }}>Nouveau Quiz</button>
      </div>
    );
  }

  return null;
}
