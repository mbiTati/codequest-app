import { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Trophy, Zap, Star, Flag } from 'lucide-react';

const C = {
  bg:"#0a0f1a",card:"#111827",accent:"#32E0C4",gold:"#F59E0B",
  text:"#e2e8f0",muted:"#94a3b8",border:"#1e293b",danger:"#EF4444",
  success:"#10B981",primary:"#0D7377",dimmed:"#64748b",code:"#1E293B",codeTxt:"#67e8f9",
};

// ============================================
// LEVELS — each is an obstacle on the track
// ============================================
const LEVELS = [
  {
    id: 1, title: "Le Depart", theme: "variable", emoji: "🏁",
    story: "Le coureur a besoin d'energie ! Declare une variable pour stocker sa vitesse.",
    challenge: "Declare une variable 'vitesse' de type int avec la valeur 10",
    answer: "int vitesse = 10;",
    accepts: ["int vitesse = 10;","int vitesse=10;"],
    regex: /int\s+vitesse\s*=\s*10\s*;?/i,
    obstacle: "barrier", hint: "int nomVariable = valeur;",
  },
  {
    id: 2, title: "Le Mur", theme: "condition", emoji: "🧱",
    story: "Un mur bloque le chemin ! Le coureur doit verifier s'il a assez de vitesse pour sauter.",
    challenge: "Ecris la condition : si vitesse >= 10, le coureur saute",
    answer: "if (vitesse >= 10) {",
    accepts: ["if (vitesse >= 10) {","if(vitesse >= 10){","if (vitesse>=10) {","if(vitesse>=10){"],
    regex: /if\s*\(\s*vitesse\s*>=\s*10\s*\)\s*\{?/i,
    obstacle: "wall", hint: "if (condition) {",
  },
  {
    id: 3, title: "Les Pieces", theme: "boucle", emoji: "🪙",
    story: "5 pieces d'or sur le chemin ! Ramasse-les avec une boucle for.",
    challenge: "Ecris une boucle for qui va de 0 a 4 (5 pieces)",
    answer: "for (int i = 0; i < 5; i++) {",
    accepts: ["for (int i = 0; i < 5; i++) {","for(int i=0;i<5;i++){","for (int i = 0; i < 5; i++){"],
    regex: /for\s*\(\s*int\s+\w+\s*=\s*0\s*;\s*\w+\s*<\s*5\s*;\s*\w+\+\+\s*\)\s*\{?/i,
    obstacle: "coins", hint: "for (int i = 0; i < N; i++) {",
  },
  {
    id: 4, title: "Le Pont", theme: "methode", emoji: "🌉",
    story: "Le pont est casse ! Repare-le en creant une methode construirePont().",
    challenge: "Declare la methode publique construirePont() qui retourne void",
    answer: "public void construirePont() {",
    accepts: ["public void construirePont() {","public void construirePont(){","void construirePont() {"],
    regex: /(public\s+)?void\s+construirePont\s*\(\s*\)\s*\{?/i,
    obstacle: "bridge", hint: "public void nomMethode() {",
  },
  {
    id: 5, title: "Le Boss", theme: "constructeur", emoji: "👾",
    story: "Un boss apparait ! Cree un objet Guerrier pour le combattre.",
    challenge: "Ecris : new Guerrier(\"Heros\", 100)",
    answer: 'Guerrier g = new Guerrier("Heros", 100);',
    accepts: ["guerrier"],
    regex: /guerrier\s+\w+\s*=\s*new\s+guerrier\s*\(\s*"heros"\s*,\s*100\s*\)/i,
    obstacle: "boss", hint: 'Type nom = new Type("param", valeur);  — le nom de variable est libre !',
  },
  {
    id: 6, title: "Le Turbo", theme: "heritage", emoji: "⚡",
    story: "Derniere ligne droite ! Active le turbo avec l'heritage.",
    challenge: "Ecris : class Turbo extends Coureur {",
    answer: "class Turbo extends Coureur {",
    accepts: ["class Turbo extends Coureur {","class Turbo extends Coureur{","public class Turbo extends Coureur {","public class Turbo extends Coureur{"],
    regex: /(public\s+)?class\s+turbo\s+extends\s+coureur\s*\{?/i,
    obstacle: "turbo", hint: "class Enfant extends Parent {",
  },
];

// ============================================
// RUNNER SVG
// ============================================
function RunnerSVG({ running, celebrating, x }) {
  return (
    <g transform={`translate(${x}, 0)`}>
      {/* Body */}
      <rect x="8" y="12" width="14" height="18" rx="3" fill={C.accent} stroke={C.accent} strokeWidth="1">
        {celebrating && <animate attributeName="y" values="12;8;12" dur="0.3s" repeatCount="6" />}
      </rect>
      {/* Head */}
      <circle cx="15" cy="8" r="6" fill={C.gold} stroke={C.gold} strokeWidth="1">
        {celebrating && <animate attributeName="cy" values="8;4;8" dur="0.3s" repeatCount="6" />}
      </circle>
      {/* Eyes */}
      <circle cx="13" cy="7" r="1" fill={C.bg} />
      <circle cx="17" cy="7" r="1" fill={C.bg} />
      {/* Smile */}
      {celebrating && <path d="M12,9 Q15,12 18,9" fill="none" stroke={C.bg} strokeWidth="1" />}
      {/* Legs */}
      <line x1="12" y1="30" x2="8" y2="40" stroke={C.accent} strokeWidth="2.5" strokeLinecap="round">
        {running && <animate attributeName="x2" values="8;16;8" dur="0.3s" repeatCount="indefinite" />}
      </line>
      <line x1="18" y1="30" x2="22" y2="40" stroke={C.accent} strokeWidth="2.5" strokeLinecap="round">
        {running && <animate attributeName="x2" values="22;14;22" dur="0.3s" repeatCount="indefinite" />}
      </line>
      {/* Arms */}
      <line x1="10" y1="16" x2="4" y2="24" stroke={C.accent} strokeWidth="2" strokeLinecap="round">
        {running && <animate attributeName="x2" values="4;10;4" dur="0.3s" repeatCount="indefinite" />}
      </line>
      <line x1="20" y1="16" x2="26" y2="24" stroke={C.accent} strokeWidth="2" strokeLinecap="round">
        {running && <animate attributeName="x2" values="26;20;26" dur="0.3s" repeatCount="indefinite" />}
      </line>
    </g>
  );
}

function ObstacleSVG({ type, x, cleared }) {
  if (cleared) {
    return (
      <g transform={`translate(${x}, 0)`} opacity="0.3">
        <text x="15" y="25" textAnchor="middle" fontSize="20">✓</text>
      </g>
    );
  }
  const obs = {
    barrier: () => <><rect x="5" y="20" width="20" height="4" fill={C.danger} rx="1" /><rect x="14" y="10" width="3" height="14" fill={C.danger} rx="1" /></>,
    wall: () => <><rect x="2" y="8" width="26" height="34" rx="2" fill="#8B5CF6" stroke="#A78BFA" strokeWidth="1" /><line x1="2" y1="18" x2="28" y2="18" stroke="#A78BFA" strokeWidth="0.5" /><line x1="2" y1="28" x2="28" y2="28" stroke="#A78BFA" strokeWidth="0.5" /><line x1="15" y1="8" x2="15" y2="42" stroke="#A78BFA" strokeWidth="0.5" /></>,
    coins: () => <>{[0,1,2].map(i => <circle key={i} cx={8+i*7} cy="25" r="5" fill={C.gold} stroke="#D97706" strokeWidth="1"><animate attributeName="cy" values="25;22;25" dur={0.5+i*0.1+"s"} repeatCount="indefinite" /></circle>)}</>,
    bridge: () => <><rect x="0" y="30" width="30" height="6" fill="#92400E" rx="1" /><line x1="5" y1="30" x2="5" y2="20" stroke="#92400E" strokeWidth="2" /><line x1="25" y1="30" x2="25" y2="20" stroke="#92400E" strokeWidth="2" /><line x1="5" y1="20" x2="25" y2="20" stroke="#92400E" strokeWidth="2" /></>,
    boss: () => <><rect x="4" y="10" width="22" height="24" rx="4" fill={C.danger} /><circle cx="11" cy="20" r="3" fill="#fff" /><circle cx="19" cy="20" r="3" fill="#fff" /><circle cx="11" cy="20" r="1.5" fill={C.bg} /><circle cx="19" cy="20" r="1.5" fill={C.bg} /><rect x="8" y="28" width="14" height="3" rx="1" fill="#fff"><animate attributeName="width" values="14;10;14" dur="0.5s" repeatCount="indefinite" /></rect></>,
    turbo: () => <><polygon points="15,5 22,18 18,18 22,35 8,20 13,20 8,5" fill={C.gold} stroke="#D97706" strokeWidth="1"><animate attributeName="opacity" values="0.7;1;0.7" dur="0.4s" repeatCount="indefinite" /></polygon></>,
  };
  const Render = obs[type] || obs.barrier;
  return <g transform={`translate(${x}, 0)`}><Render /></g>;
}

// ============================================
// MAIN GAME
// ============================================
export default function Game_CodeRunner() {
  const [level, setLevel] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [cleared, setCleared] = useState([]);
  const [running, setRunning] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [runnerX, setRunnerX] = useState(20);
  const [score, setScore] = useState(0);
  const [screen, setScreen] = useState('intro'); // intro, play, win
  const runRef = useRef(null);
  const inputRef = useRef(null);

  const current = LEVELS[level];
  const trackWidth = 700;
  const segmentWidth = trackWidth / (LEVELS.length + 1);

  function checkAnswer() {
    if (!current) return;
    const trimmed = input.trim();
    // Try regex first (more flexible), then exact match
    let correct = false;
    if (current.regex) {
      correct = current.regex.test(trimmed);
    }
    if (!correct) {
      correct = current.accepts.some(a => trimmed.replace(/\s+/g, ' ').toLowerCase() === a.replace(/\s+/g, ' ').toLowerCase());
    }

    if (correct) {
      setFeedback({ ok: true });
      setCleared(c => [...c, level]);
      setScore(s => s + 150);
      setCelebrating(true);

      // Animate runner to next position
      const targetX = (level + 2) * segmentWidth;
      setRunning(true);
      let currentX = runnerX;
      runRef.current = setInterval(() => {
        currentX += 3;
        setRunnerX(currentX);
        if (currentX >= targetX) {
          clearInterval(runRef.current);
          setRunning(false);
          setCelebrating(false);
          setInput('');
          setFeedback(null);

          if (level + 1 >= LEVELS.length) {
            setScreen('win');
          } else {
            setLevel(l => l + 1);
          }
        }
      }, 30);
    } else {
      setFeedback({ ok: false, msg: "Pas tout a fait... Indice : " + current.hint });
    }
  }

  function restart() {
    setLevel(0); setInput(''); setFeedback(null); setCleared([]);
    setRunning(false); setCelebrating(false); setRunnerX(20);
    setScore(0); setScreen('play');
    if (runRef.current) clearInterval(runRef.current);
  }

  // ============================================
  // INTRO
  // ============================================
  if (screen === 'intro') {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-15px)}}`}</style>
        <div style={{ fontSize: 48, animation: "bounce 1s infinite" }}>🏃</div>
        <div style={{ fontSize: 32, fontWeight: 800, color: C.accent, marginTop: 12 }}>CODE RUNNER</div>
        <div style={{ fontSize: 14, color: C.gold, fontWeight: 600, marginTop: 4 }}>Ecris du Java pour franchir les obstacles !</div>
        <div style={{ fontSize: 12, color: C.muted, marginTop: 12, maxWidth: 400, textAlign: "center", lineHeight: 1.8 }}>
          Ton coureur doit parcourir 6 obstacles. Chaque obstacle est un concept Java : variables, conditions, boucles, methodes, constructeurs, heritage. Ecris le bon code pour le faire avancer !
        </div>
        <button onClick={() => setScreen('play')} style={{
          marginTop: 20, padding: "14px 40px", borderRadius: 12, border: "none",
          background: "linear-gradient(135deg, " + C.accent + ", " + C.primary + ")",
          color: "#fff", cursor: "pointer", fontFamily: "inherit", fontSize: 18, fontWeight: 800,
          display: "flex", alignItems: "center", gap: 8,
        }}><Play size={20} /> C'EST PARTI !</button>
      </div>
    );
  }

  // ============================================
  // WIN
  // ============================================
  if (screen === 'win') {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <style>{`@keyframes confettiDrop{0%{transform:translateY(-20px) rotate(0);opacity:1}100%{transform:translateY(100px) rotate(720deg);opacity:0}}`}</style>
        <div style={{ position: "relative" }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{
              position: "absolute", width: 8, height: 8, borderRadius: 2,
              background: ["#EF4444","#3B82F6","#F59E0B","#10B981","#8B5CF6","#EC4899","#32E0C4","#F97316"][i],
              left: -40 + i * 20, top: -30,
              animation: `confettiDrop ${1 + i * 0.2}s ease-out ${i * 0.1}s infinite`,
            }} />
          ))}
          <Trophy size={64} color={C.gold} />
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.gold, marginTop: 16 }}>COURSE TERMINEE !</div>
        <div style={{ fontSize: 40, fontWeight: 800, color: C.accent, marginTop: 8 }}>{score + " pts"}</div>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>6 obstacles franchis — tous les concepts maitrises !</div>
        <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap", justifyContent: "center" }}>
          {LEVELS.map(l => (
            <span key={l.id} style={{ padding: "3px 10px", borderRadius: 6, background: C.success + "20", color: C.success, fontSize: 10, fontWeight: 600 }}>{l.emoji + " " + l.theme}</span>
          ))}
        </div>
        <button onClick={restart} style={{
          marginTop: 20, padding: "10px 24px", borderRadius: 8, border: "none",
          background: C.accent, color: C.bg, cursor: "pointer",
          fontFamily: "inherit", fontSize: 14, fontWeight: 700,
          display: "flex", alignItems: "center", gap: 6,
        }}><RotateCcw size={14} /> Rejouer</button>
      </div>
    );
  }

  // ============================================
  // PLAY
  // ============================================
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", padding: 16 }}>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}`}</style>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.accent }}>{"Obstacle " + (level + 1) + "/" + LEVELS.length}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.gold }}>{score + " pts"}</div>
        </div>

        {/* Track */}
        <div style={{ background: C.card, borderRadius: 12, padding: 10, border: "1px solid " + C.border, marginBottom: 12, overflow: "hidden" }}>
          <svg viewBox="0 0 720 50" style={{ width: "100%", height: 50 }}>
            {/* Ground */}
            <rect x="0" y="42" width="720" height="8" fill="#374151" rx="2" />
            <line x1="0" y1="46" x2="720" y2="46" stroke="#4B5563" strokeWidth="1" strokeDasharray="8,6" />
            {/* Obstacles */}
            {LEVELS.map((l, i) => (
              <ObstacleSVG key={l.id} type={l.obstacle} x={(i + 1) * segmentWidth} cleared={cleared.includes(i)} />
            ))}
            {/* Finish flag */}
            <g transform={`translate(${(LEVELS.length + 0.5) * segmentWidth}, 5)`}>
              <rect x="0" y="0" width="3" height="35" fill="#fff" />
              <rect x="3" y="0" width="15" height="10" fill={C.gold}><animate attributeName="fill" values={C.gold + ";#fff;" + C.gold} dur="1s" repeatCount="indefinite" /></rect>
            </g>
            {/* Runner */}
            <RunnerSVG running={running} celebrating={celebrating} x={runnerX} />
          </svg>
        </div>

        {/* Level card */}
        {current && (
          <div style={{ background: C.card, borderRadius: 12, padding: 16, border: "1px solid " + C.border }}>
            {/* Story */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ fontSize: 32 }}>{current.emoji}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{current.title}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{current.story}</div>
              </div>
            </div>

            {/* Challenge */}
            <div style={{ padding: "10px 12px", borderRadius: 8, background: C.primary + "15", border: "1px solid " + C.primary + "30", marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.accent }}>{current.challenge}</div>
            </div>

            {/* Input */}
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') checkAnswer(); }}
                placeholder="Tapez votre code Java..."
                autoFocus
                disabled={running}
                style={{
                  flex: 1, padding: "10px 14px", borderRadius: 8,
                  border: "1px solid " + C.border, background: C.code,
                  color: C.codeTxt, fontFamily: "'Consolas','Courier New',monospace",
                  fontSize: 13, outline: "none",
                }}
              />
              <button onClick={checkAnswer} disabled={running || !input.trim()} style={{
                padding: "10px 20px", borderRadius: 8, border: "none",
                background: running ? C.border : C.accent,
                color: running ? C.dimmed : C.bg, cursor: running ? "default" : "pointer",
                fontFamily: "inherit", fontSize: 12, fontWeight: 700,
              }}>GO !</button>
            </div>

            {/* Feedback */}
            {feedback && !feedback.ok && (
              <div style={{ animation: "shake .3s", padding: "8px 12px", borderRadius: 8, background: C.danger + "15", border: "1px solid " + C.danger + "40", fontSize: 11, color: C.danger }}>
                {feedback.msg}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
