import { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Zap, Star, ChevronRight } from 'lucide-react';

const C = {
  bg:"#0a0f1a",card:"#111827",accent:"#32E0C4",gold:"#F59E0B",
  text:"#e2e8f0",muted:"#94a3b8",border:"#1e293b",danger:"#EF4444",
  success:"#10B981",primary:"#0D7377",dimmed:"#64748b",code:"#1E293B",codeTxt:"#67e8f9",
};

const GRID = 8; // 8x8 grid
const CELL = 48;

// ============================================
// CHARACTER SVG
// ============================================
function CharSVG({ type, color, dir, talking, upgraded, dancing }) {
  const eyeX = dir === 'right' ? 4 : dir === 'left' ? -4 : 0;
  const eyeY = dir === 'down' ? 3 : dir === 'up' ? -3 : 0;

  // Robot
  if (type === 'robot') return (
    <g>
      <style>{dancing ? `@keyframes dance{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}} .dancer{animation:dance .3s infinite;}` : ''}</style>
      <g className={dancing ? "dancer" : ""}>
        {/* Body */}
        <rect x="-14" y="-10" width="28" height="24" rx="4" fill={color} stroke={color} strokeWidth="1.5" />
        {/* Head */}
        <rect x="-12" y="-26" width="24" height="18" rx="3" fill={color} stroke="#fff" strokeWidth="1" opacity="0.9" />
        {/* Eyes */}
        <circle cx={-4 + eyeX} cy={-18 + eyeY} r="3" fill="#fff" />
        <circle cx={4 + eyeX} cy={-18 + eyeY} r="3" fill="#fff" />
        <circle cx={-4 + eyeX} cy={-18 + eyeY} r="1.5" fill="#1E293B" />
        <circle cx={4 + eyeX} cy={-18 + eyeY} r="1.5" fill="#1E293B" />
        {/* Antenna */}
        <line x1="0" y1="-26" x2="0" y2="-32" stroke={color} strokeWidth="2" />
        <circle cx="0" cy="-33" r="3" fill={C.gold}>
          <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" />
        </circle>
        {/* Arms */}
        <rect x="-20" y="-6" width="6" height="14" rx="2" fill={color} opacity="0.8" />
        <rect x="14" y="-6" width="6" height="14" rx="2" fill={color} opacity="0.8" />
        {/* Legs */}
        <rect x="-10" y="14" width="8" height="10" rx="2" fill={color} opacity="0.7" />
        <rect x="2" y="14" width="8" height="10" rx="2" fill={color} opacity="0.7" />
        {/* Upgrade: cape */}
        {upgraded && <path d="M-14,-10 L-20,14 L20,14 L14,-10" fill={C.gold + "40"} stroke={C.gold} strokeWidth="1" />}
        {/* Upgrade: crown */}
        {upgraded && <polygon points="-8,-28 -4,-34 0,-30 4,-34 8,-28" fill={C.gold} />}
        {/* Mouth */}
        {talking ? (
          <ellipse cx="0" cy="-12" rx="4" ry="3" fill="#1E293B">
            <animate attributeName="ry" values="3;1;3" dur="0.3s" repeatCount="indefinite" />
          </ellipse>
        ) : (
          <line x1="-4" y1="-12" x2="4" y2="-12" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
        )}
      </g>
    </g>
  );

  // Cat
  if (type === 'cat') return (
    <g className={dancing ? "dancer" : ""}>
      {dancing && <style>{`@keyframes dance{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(8deg)}} .dancer{animation:dance .25s infinite;}`}</style>}
      {/* Body */}
      <ellipse cx="0" cy="0" rx="14" ry="12" fill={color} />
      {/* Head */}
      <circle cx="0" cy="-18" r="12" fill={color} />
      {/* Ears */}
      <polygon points="-10,-26 -6,-36 -2,-26" fill={color} stroke="#fff" strokeWidth="0.5" />
      <polygon points="2,-26 6,-36 10,-26" fill={color} stroke="#fff" strokeWidth="0.5" />
      <polygon points="-8,-27 -6,-33 -4,-27" fill="#EC4899" opacity="0.6" />
      <polygon points="4,-27 6,-33 8,-27" fill="#EC4899" opacity="0.6" />
      {/* Eyes */}
      <ellipse cx={-4+eyeX} cy={-19+eyeY} rx="3" ry="3.5" fill="#fff" />
      <ellipse cx={4+eyeX} cy={-19+eyeY} rx="3" ry="3.5" fill="#fff" />
      <circle cx={-4+eyeX} cy={-19+eyeY} r="2" fill="#1E293B" />
      <circle cx={4+eyeX} cy={-19+eyeY} r="2" fill="#1E293B" />
      {/* Nose + mouth */}
      <polygon points="-1,-15 0,-13.5 1,-15" fill="#EC4899" />
      {talking ? <ellipse cx="0" cy="-11" rx="3" ry="2" fill="#1E293B"><animate attributeName="ry" values="2;1;2" dur="0.3s" repeatCount="indefinite" /></ellipse> : <path d="M-2,-13 Q0,-11 2,-13" fill="none" stroke="#1E293B" strokeWidth="0.8" />}
      {/* Whiskers */}
      <line x1="-12" y1="-16" x2="-20" y2="-18" stroke="#fff" strokeWidth="0.5" opacity="0.4" />
      <line x1="-12" y1="-14" x2="-20" y2="-14" stroke="#fff" strokeWidth="0.5" opacity="0.4" />
      <line x1="12" y1="-16" x2="20" y2="-18" stroke="#fff" strokeWidth="0.5" opacity="0.4" />
      <line x1="12" y1="-14" x2="20" y2="-14" stroke="#fff" strokeWidth="0.5" opacity="0.4" />
      {/* Tail */}
      <path d="M12,4 Q24,0 20,-12" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
      {upgraded && <polygon points="-6,-32 0,-40 6,-32" fill={C.gold} />}
    </g>
  );

  // Ninja
  return (
    <g className={dancing ? "dancer" : ""}>
      {dancing && <style>{`@keyframes dance{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}} .dancer{animation:dance .2s infinite;}`}</style>}
      <rect x="-12" y="-8" width="24" height="22" rx="3" fill="#1F2937" />
      <circle cx="0" cy="-18" r="11" fill="#1F2937" />
      {/* Mask */}
      <rect x="-11" y="-22" width="22" height="8" rx="2" fill={color} />
      {/* Eyes */}
      <circle cx={-4+eyeX} cy={-19+eyeY} r="2.5" fill="#fff" />
      <circle cx={4+eyeX} cy={-19+eyeY} r="2.5" fill="#fff" />
      <circle cx={-4+eyeX} cy={-19+eyeY} r="1.2" fill="#1E293B" />
      <circle cx={4+eyeX} cy={-19+eyeY} r="1.2" fill="#1E293B" />
      {/* Headband tails */}
      <line x1="11" y1="-20" x2="20" y2="-24" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="11" y1="-17" x2="18" y2="-20" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* Arms */}
      <line x1="-12" y1="0" x2="-20" y2="-4" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
      <line x1="12" y1="0" x2="20" y2="-4" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
      {/* Sword (if upgraded) */}
      {upgraded && <line x1="20" y1="-4" x2="32" y2="-14" stroke={C.gold} strokeWidth="2" strokeLinecap="round" />}
      {upgraded && <circle cx="32" cy="-14" r="2" fill={C.gold} />}
      {talking && <ellipse cx="0" cy="-10" rx="3" ry="2" fill="#fff" opacity="0.5"><animate attributeName="ry" values="2;1;2" dur="0.3s" repeatCount="indefinite" /></ellipse>}
    </g>
  );
}

// ============================================
// CHALLENGES (progressive Java concepts)
// ============================================
const CHALLENGES = [
  {
    title: "1. Creer un objet",
    goal: "Fais apparaitre ton personnage !",
    code: 'Robot r = new Robot("Bleu");',
    actions: [{ type: "spawn", x: 1, y: 4 }],
    concept: "Constructeur + new",
    hint: 'new Type("param")',
  },
  {
    title: "2. Appeler une methode",
    goal: "Fais avancer ton personnage de 3 cases",
    code: 'r.avancer(3);',
    actions: [{ type: "move", steps: 3 }],
    concept: "Appel de methode",
    hint: 'objet.methode(arg)',
  },
  {
    title: "3. Tourner",
    goal: "Tourne a droite puis avance de 2",
    code: 'r.tourner("droite");\nr.avancer(2);',
    actions: [{ type: "turn", dir: "down" }, { type: "move", steps: 2 }],
    concept: "Sequence d'instructions",
    hint: 'Chaque ligne = une action',
  },
  {
    title: "4. Parler (String)",
    goal: "Fais dire 'Bonjour Java !' a ton personnage",
    code: 'r.parler("Bonjour Java !");',
    actions: [{ type: "talk", msg: "Bonjour Java !" }],
    concept: "String en parametre",
    hint: 'r.parler("texte");',
  },
  {
    title: "5. Boucle for",
    goal: "Fais un carre : avance 2 + tourne, 4 fois",
    code: 'for (int i = 0; i < 4; i++) {\n  r.avancer(2);\n  r.tourner("droite");\n}',
    actions: [
      { type: "move", steps: 2 }, { type: "turn", dir: "down" },
      { type: "move", steps: 2 }, { type: "turn", dir: "left" },
      { type: "move", steps: 2 }, { type: "turn", dir: "up" },
      { type: "move", steps: 2 }, { type: "turn", dir: "right" },
    ],
    concept: "Boucle for + repetition",
    hint: 'for (int i = 0; i < N; i++) { }',
  },
  {
    title: "6. Condition if",
    goal: "Si le robot est en x=3, il parle",
    code: 'if (r.getX() == 3) {\n  r.parler("Position 3 !");\n}',
    actions: [{ type: "check", condition: "x==3" }, { type: "talk", msg: "Position 3 !" }],
    concept: "if + condition + getter",
    hint: 'if (condition) { action; }',
  },
  {
    title: "7. Heritage — Super Robot !",
    goal: "Cree un SuperRobot avec turbo !",
    code: 'class SuperRobot extends Robot {\n  void turbo() { avancer(5); }\n}\nSuperRobot sr = new SuperRobot("Or");',
    actions: [{ type: "upgrade" }, { type: "move", steps: 5 }],
    concept: "Heritage + extends + super",
    hint: 'class Enfant extends Parent { }',
  },
  {
    title: "8. Danse finale !",
    goal: "Fais danser ton personnage pour celebrer",
    code: 'r.danser();\nr.parler("Java Master !");',
    actions: [{ type: "dance" }, { type: "talk", msg: "Java Master !" }],
    concept: "Methodes + celebration",
    hint: 'r.danser();',
  },
];

// ============================================
// MAIN COMPONENT
// ============================================
export default function Game_CodeStudio() {
  const [charType, setCharType] = useState(null); // robot, cat, ninja
  const [charColor, setCharColor] = useState("#32E0C4");
  const [level, setLevel] = useState(0);
  const [pos, setPos] = useState({ x: 1, y: 4 });
  const [dir, setDir] = useState("right");
  const [talking, setTalking] = useState(null);
  const [upgraded, setUpgraded] = useState(false);
  const [dancing, setDancing] = useState(false);
  const [trail, setTrail] = useState([]);
  const [animating, setAnimating] = useState(false);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [screen, setScreen] = useState("pick"); // pick, play, win

  const ch = CHALLENGES[level];

  // Execute actions sequentially
  async function runActions(actions) {
    setAnimating(true);
    for (const action of actions) {
      await new Promise(resolve => {
        switch (action.type) {
          case "spawn":
            setPos({ x: action.x, y: action.y });
            setTimeout(resolve, 500);
            break;
          case "move":
            let remaining = action.steps;
            const moveInterval = setInterval(() => {
              setPos(p => {
                const newP = { ...p };
                if (dir === "right" || (p.dir || dir) === "right") newP.x = Math.min(GRID - 1, p.x + 1);
                if (dir === "left" || (p.dir || dir) === "left") newP.x = Math.max(0, p.x - 1);
                if (dir === "down" || (p.dir || dir) === "down") newP.y = Math.min(GRID - 1, p.y + 1);
                if (dir === "up" || (p.dir || dir) === "up") newP.y = Math.max(0, p.y - 1);
                setTrail(t => [...t, { x: p.x, y: p.y }]);
                return newP;
              });
              remaining--;
              if (remaining <= 0) { clearInterval(moveInterval); setTimeout(resolve, 200); }
            }, 400);
            break;
          case "turn":
            setDir(action.dir);
            setTimeout(resolve, 400);
            break;
          case "talk":
            setTalking(action.msg);
            setTimeout(() => { setTalking(null); resolve(); }, 2000);
            break;
          case "upgrade":
            setUpgraded(true);
            setTimeout(resolve, 800);
            break;
          case "dance":
            setDancing(true);
            setTimeout(() => { setDancing(false); resolve(); }, 3000);
            break;
          case "check":
            setTimeout(resolve, 300);
            break;
          default:
            setTimeout(resolve, 300);
        }
      });
    }
    setAnimating(false);
  }

  function submitCode() {
    if (!ch || animating) return;
    const trimmed = input.trim().replace(/\s+/g, ' ');
    const expected = ch.code.replace(/\s+/g, ' ').replace(/\n/g, ' ');
    // Lenient matching
    const match = trimmed.toLowerCase().includes(expected.split('\n')[0].replace(/\s+/g, ' ').toLowerCase().slice(0, 20));

    if (match || trimmed.length > 10) {
      setFeedback({ ok: true, msg: "Concept : " + ch.concept });
      setScore(s => s + 100);
      runActions(ch.actions).then(() => {
        setTimeout(() => {
          setFeedback(null);
          setInput('');
          if (level + 1 >= CHALLENGES.length) {
            setScreen("win");
          } else {
            setLevel(l => l + 1);
          }
        }, 500);
      });
    } else {
      setFeedback({ ok: false, msg: "Indice : " + ch.hint });
      setTimeout(() => setFeedback(null), 2000);
    }
  }

  // ============================================
  // CHARACTER PICKER
  // ============================================
  if (screen === "pick") {
    const chars = [
      { type: "robot", label: "Robot", color: "#32E0C4" },
      { type: "cat", label: "Chat", color: "#EC4899" },
      { type: "ninja", label: "Ninja", color: "#8B5CF6" },
    ];
    const colors = ["#32E0C4", "#3B82F6", "#EF4444", "#F59E0B", "#EC4899", "#8B5CF6", "#10B981", "#F97316"];

    return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.accent, marginBottom: 4 }}>CODEQUEST STUDIO</div>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 24 }}>Choisis ton personnage et programme-le en Java !</div>

        <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
          {chars.map(ch => (
            <button key={ch.type} onClick={() => { setCharType(ch.type); setCharColor(ch.color); }} style={{
              width: 100, height: 120, borderRadius: 12, border: "2px solid " + (charType === ch.type ? C.gold : C.border),
              background: charType === ch.type ? C.gold + "15" : C.card,
              cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
            }}>
              <svg width="60" height="60" viewBox="-30 -40 60 60" style={{ animation: charType === ch.type ? "float 1.5s infinite" : "none" }}>
                <CharSVG type={ch.type} color={ch.color} dir="right" talking={false} upgraded={false} dancing={false} />
              </svg>
              <span style={{ fontSize: 11, fontWeight: 600, color: charType === ch.type ? C.gold : C.muted }}>{ch.label}</span>
            </button>
          ))}
        </div>

        {charType && (
          <>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>Couleur :</div>
            <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
              {colors.map(col => (
                <button key={col} onClick={() => setCharColor(col)} style={{
                  width: 28, height: 28, borderRadius: "50%", border: "2px solid " + (charColor === col ? "#fff" : "transparent"),
                  background: col, cursor: "pointer",
                }} />
              ))}
            </div>
            <button onClick={() => setScreen("play")} style={{
              padding: "12px 32px", borderRadius: 10, border: "none",
              background: "linear-gradient(135deg," + C.accent + "," + C.primary + ")",
              color: "#fff", cursor: "pointer", fontFamily: "inherit", fontSize: 16, fontWeight: 700,
              display: "flex", alignItems: "center", gap: 8,
            }}><Play size={18} /> PROGRAMMER !</button>
          </>
        )}
      </div>
    );
  }

  // ============================================
  // WIN SCREEN
  // ============================================
  if (screen === "win") {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <svg width="120" height="100" viewBox="-30 -40 60 60">
          <CharSVG type={charType} color={charColor} dir="right" talking={false} upgraded={true} dancing={true} />
        </svg>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.gold, marginTop: 16 }}>STUDIO MASTER !</div>
        <div style={{ fontSize: 40, fontWeight: 800, color: C.accent }}>{score} pts</div>
        <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>8 concepts Java maitrises avec ton {charType} !</div>
        <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap", justifyContent: "center" }}>
          {CHALLENGES.map(c => <span key={c.title} style={{ padding: "3px 8px", borderRadius: 4, background: C.success + "20", color: C.success, fontSize: 9 }}>{c.concept}</span>)}
        </div>
        <button onClick={() => { setScreen("pick"); setLevel(0); setScore(0); setPos({ x: 1, y: 4 }); setDir("right"); setUpgraded(false); setTrail([]); }} style={{
          marginTop: 20, padding: "10px 24px", borderRadius: 8, border: "none", background: C.accent, color: C.bg, cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 700,
        }}><RotateCcw size={12} /> Rejouer</button>
      </div>
    );
  }

  // ============================================
  // PLAY SCREEN
  // ============================================
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',sans-serif", padding: 12 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {/* Left: Grid */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.accent }}>{ch?.title}</div>
            <div style={{ fontSize: 11, color: C.gold }}>{score} pts</div>
          </div>

          <svg viewBox={`0 0 ${GRID * CELL} ${GRID * CELL}`} style={{ width: "100%", background: C.card, borderRadius: 10, border: "1px solid " + C.border }}>
            {/* Grid lines */}
            {Array.from({ length: GRID + 1 }, (_, i) => (
              <g key={i}>
                <line x1={i * CELL} y1="0" x2={i * CELL} y2={GRID * CELL} stroke={C.border} strokeWidth="0.5" />
                <line x1="0" y1={i * CELL} x2={GRID * CELL} y2={i * CELL} stroke={C.border} strokeWidth="0.5" />
              </g>
            ))}

            {/* Trail */}
            {trail.map((t, i) => (
              <rect key={i} x={t.x * CELL + 2} y={t.y * CELL + 2} width={CELL - 4} height={CELL - 4} rx="4" fill={charColor + "15"} stroke={charColor + "25"} strokeWidth="0.5" />
            ))}

            {/* Character */}
            {charType && (
              <g transform={`translate(${pos.x * CELL + CELL / 2}, ${pos.y * CELL + CELL / 2 + 8})`} style={{ transition: "transform 0.3s ease" }}>
                <CharSVG type={charType} color={charColor} dir={dir} talking={!!talking} upgraded={upgraded} dancing={dancing} />
              </g>
            )}

            {/* Speech bubble */}
            {talking && (
              <g transform={`translate(${pos.x * CELL + CELL}, ${pos.y * CELL - 10})`}>
                <rect x="0" y="-20" width={talking.length * 6 + 16} height="22" rx="8" fill="#fff" />
                <polygon points="8,2 16,10 0,2" fill="#fff" />
                <text x="8" y="-5" fontSize="10" fill="#1E293B" fontWeight="600" fontFamily="'Segoe UI',sans-serif">{talking}</text>
              </g>
            )}
          </svg>
        </div>

        {/* Right: Code editor */}
        <div>
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 2 }}>{ch?.goal}</div>
            <div style={{ fontSize: 10, color: C.dimmed }}>Concept : {ch?.concept}</div>
          </div>

          {/* Expected code (as guide) */}
          <div style={{ padding: "8px 10px", borderRadius: 6, background: C.code, border: "1px solid " + C.border, marginBottom: 8, fontSize: 11, fontFamily: "'Consolas',monospace", color: C.codeTxt, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
            {ch?.code}
          </div>

          {/* Input */}
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Tapez votre code Java ici..."
            rows={4}
            disabled={animating}
            style={{
              width: "100%", padding: "10px 12px", borderRadius: 8,
              border: "1px solid " + C.border, background: C.code,
              color: C.codeTxt, fontFamily: "'Consolas','Courier New',monospace",
              fontSize: 12, resize: "vertical", boxSizing: "border-box",
            }}
          />

          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={submitCode} disabled={animating || !input.trim()} style={{
              flex: 1, padding: "10px", borderRadius: 8, border: "none",
              background: animating ? C.border : C.accent,
              color: animating ? C.dimmed : C.bg,
              cursor: animating ? "default" : "pointer",
              fontFamily: "inherit", fontSize: 13, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}><Play size={14} /> Executer</button>
          </div>

          {/* Feedback */}
          {feedback && (
            <div style={{ marginTop: 8, padding: "8px 10px", borderRadius: 6, background: (feedback.ok ? C.success : C.danger) + "15", border: "1px solid " + (feedback.ok ? C.success : C.danger) + "30", fontSize: 11, color: feedback.ok ? C.success : C.danger, fontWeight: 600 }}>
              {feedback.msg}
            </div>
          )}

          {/* Progress */}
          <div style={{ marginTop: 12, display: "flex", gap: 4 }}>
            {CHALLENGES.map((c, i) => (
              <div key={i} style={{
                flex: 1, height: 4, borderRadius: 2,
                background: i < level ? C.success : i === level ? C.gold : C.border,
              }} />
            ))}
          </div>
          <div style={{ fontSize: 9, color: C.dimmed, marginTop: 4 }}>{level + 1}/{CHALLENGES.length} — {ch?.concept}</div>
        </div>
      </div>
    </div>
  );
}
