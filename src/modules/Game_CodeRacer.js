import { useState, useEffect, useRef } from 'react';
import { Car, Wrench, Zap, Trophy, RotateCcw, ChevronRight, Star, Flag, Play } from 'lucide-react';

const C = {
  bg:"#0a0f1a",card:"#111827",accent:"#32E0C4",gold:"#F59E0B",
  text:"#e2e8f0",muted:"#94a3b8",border:"#1e293b",danger:"#EF4444",
  success:"#10B981",primary:"#0D7377",dimmed:"#64748b",
  code:"#1E293B",codeTxt:"#67e8f9",
};

// Car colors for visual
const CAR_COLORS = ["#EF4444","#F59E0B","#10B981","#3B82F6","#8B5CF6","#EC4899","#32E0C4","#F97316"];

// ============================================
// PHASE DEFINITIONS
// ============================================

const PHASES = [
  {
    id: "constructor",
    title: "Phase 1 — Le Garage",
    subtitle: "Ecris le constructeur pour assembler ta voiture",
    description: "Chaque attribut correct = une piece apparait sur ta voiture !",
    icon: Wrench,
    color: C.gold,
    challenges: [
      {
        instruction: "Declare l'attribut 'marque' de type String",
        answer: "private String marque;",
        accepts: ["private String marque;", "private String marque ;", "String marque;"],
        part: "body", // which car part appears
        partLabel: "Carrosserie",
      },
      {
        instruction: "Declare l'attribut 'vitesseMax' de type int",
        answer: "private int vitesseMax;",
        accepts: ["private int vitesseMax;", "private int vitesseMax ;", "int vitesseMax;"],
        part: "engine",
        partLabel: "Moteur",
      },
      {
        instruction: "Declare l'attribut 'couleur' de type String",
        answer: "private String couleur;",
        accepts: ["private String couleur;", "private String couleur ;", "String couleur;"],
        part: "paint",
        partLabel: "Peinture",
      },
      {
        instruction: "Ecris le constructeur Voiture(String marque, int vitesseMax, String couleur)",
        answer: "public Voiture(String marque, int vitesseMax, String couleur) {",
        accepts: [
          "public Voiture(String marque, int vitesseMax, String couleur) {",
          "public Voiture(String marque, int vitesseMax, String couleur){",
          "Voiture(String marque, int vitesseMax, String couleur) {",
        ],
        part: "frame",
        partLabel: "Chassis",
      },
      {
        instruction: "Dans le constructeur : this.marque = marque;",
        answer: "this.marque = marque;",
        accepts: ["this.marque = marque;", "this.marque=marque;"],
        part: "wheels",
        partLabel: "Roues",
      },
      {
        instruction: "Dans le constructeur : this.vitesseMax = vitesseMax;",
        answer: "this.vitesseMax = vitesseMax;",
        accepts: ["this.vitesseMax = vitesseMax;", "this.vitesseMax=vitesseMax;"],
        part: "exhaust",
        partLabel: "Echappement",
      },
    ],
  },
  {
    id: "methods",
    title: "Phase 2 — Le Circuit",
    subtitle: "Ecris les methodes pour piloter ta voiture",
    description: "Chaque methode correcte = une capacite sur la piste !",
    icon: Zap,
    color: C.accent,
    challenges: [
      {
        instruction: "Ecris la methode accelerer() qui affiche 'VROOOM! [marque] accelere!'",
        answer: 'System.out.println("VROOOM! " + marque + " accelere!");',
        accepts: [
          'System.out.println("VROOOM! " + marque + " accelere!");',
          'System.out.println("VROOOM! " + this.marque + " accelere!");',
          "System.out.println(\"VROOOM! \"+marque+\" accelere!\");",
        ],
        ability: "speed",
        abilityLabel: "Vitesse +30",
      },
      {
        instruction: "Ecris la methode freiner() qui affiche '[marque] freine!'",
        answer: 'System.out.println(marque + " freine!");',
        accepts: [
          'System.out.println(marque + " freine!");',
          'System.out.println(this.marque + " freine!");',
          "System.out.println(marque+\" freine!\");",
        ],
        ability: "brake",
        abilityLabel: "Freinage +20",
      },
      {
        instruction: "Ecris le getter getVitesseMax() qui retourne vitesseMax",
        answer: "return vitesseMax;",
        accepts: ["return vitesseMax;", "return this.vitesseMax;"],
        ability: "control",
        abilityLabel: "Controle +25",
      },
      {
        instruction: "Ecris la methode decrire() qui retourne marque + ' (' + couleur + ') - ' + vitesseMax + ' km/h'",
        answer: 'return marque + " (" + couleur + ") - " + vitesseMax + " km/h";',
        accepts: [
          'return marque + " (" + couleur + ") - " + vitesseMax + " km/h";',
          'return this.marque + " (" + this.couleur + ") - " + this.vitesseMax + " km/h";',
        ],
        ability: "style",
        abilityLabel: "Style +15",
      },
    ],
  },
  {
    id: "heritage",
    title: "Phase 3 — Le Turbo",
    subtitle: "Heritage : cree VoitureCourse extends Voiture",
    description: "L'heritage donne des super-pouvoirs a ta voiture !",
    icon: Star,
    color: C.danger,
    challenges: [
      {
        instruction: "Declare la classe VoitureCourse qui herite de Voiture",
        answer: "public class VoitureCourse extends Voiture {",
        accepts: [
          "public class VoitureCourse extends Voiture {",
          "public class VoitureCourse extends Voiture{",
          "class VoitureCourse extends Voiture {",
        ],
        upgrade: "turbo",
        upgradeLabel: "TURBO active !",
      },
      {
        instruction: "Declare l'attribut 'turbo' de type boolean",
        answer: "private boolean turbo;",
        accepts: ["private boolean turbo;", "boolean turbo;"],
        upgrade: "nitro",
        upgradeLabel: "NITRO installe !",
      },
      {
        instruction: "Ecris le constructeur avec super(marque, vitesseMax, couleur) et this.turbo = turbo",
        answer: "super(marque, vitesseMax, couleur);",
        accepts: [
          "super(marque, vitesseMax, couleur);",
          "super(marque,vitesseMax,couleur);",
        ],
        upgrade: "wing",
        upgradeLabel: "AILERON pose !",
      },
      {
        instruction: "@Override accelerer() : si turbo, affiche 'BOOOST!!!' sinon appelle super.accelerer()",
        answer: "if (turbo) { System.out.println(\"BOOOST!!!\"); }",
        accepts: [
          'if (turbo) { System.out.println("BOOOST!!!"); }',
          'if(turbo){System.out.println("BOOOST!!!");}',
          'if (this.turbo) { System.out.println("BOOOST!!!"); }',
          'System.out.println("BOOOST!!!");',
        ],
        upgrade: "flames",
        upgradeLabel: "FLAMMES activees !",
      },
    ],
  },
];

// ============================================
// CAR SVG COMPONENT
// ============================================
function CarVisual({ parts, upgrades, color, racing, position }) {
  const hasParts = (p) => parts.includes(p);
  const hasUpg = (u) => upgrades.includes(u);
  const x = racing ? position : 50;

  return (
    <svg viewBox="0 0 200 100" style={{ width: "100%", maxWidth: 300 }}>
      {/* Road */}
      {racing && <rect x="0" y="75" width="200" height="25" fill="#374151" rx="2" />}
      {racing && <line x1="0" y1="87" x2="200" y2="87" stroke="#4B5563" strokeWidth="1" strokeDasharray="8,6" />}

      <g transform={`translate(${x}, 10)`}>
        {/* Frame / chassis */}
        {hasParts("frame") && (
          <rect x="20" y="35" width="80" height="20" rx="3" fill="#374151" stroke="#4B5563" strokeWidth="1" />
        )}

        {/* Body / carrosserie */}
        {hasParts("body") && (
          <path d="M25,35 L35,15 L85,15 L95,35 Z" fill={hasParts("paint") ? color : "#6B7280"} stroke={hasParts("paint") ? color : "#9CA3AF"} strokeWidth="1.5" opacity="0.9" />
        )}

        {/* Windows */}
        {hasParts("body") && (
          <>
            <path d="M38,33 L44,18 L60,18 L60,33 Z" fill="#1E293B" opacity="0.7" />
            <path d="M62,33 L62,18 L80,18 L88,33 Z" fill="#1E293B" opacity="0.7" />
          </>
        )}

        {/* Engine glow */}
        {hasParts("engine") && (
          <circle cx="80" cy="42" r="6" fill={C.gold} opacity="0.6">
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="1s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Wheels */}
        {hasParts("wheels") && (
          <>
            <circle cx="35" cy="58" r="9" fill="#1F2937" stroke="#6B7280" strokeWidth="2" />
            <circle cx="35" cy="58" r="4" fill="#4B5563" />
            <circle cx="85" cy="58" r="9" fill="#1F2937" stroke="#6B7280" strokeWidth="2" />
            <circle cx="85" cy="58" r="4" fill="#4B5563" />
            {racing && (
              <>
                <animateTransform attributeName="transform" type="rotate" from="0 35 58" to="360 35 58" dur="0.3s" repeatCount="indefinite" />
              </>
            )}
          </>
        )}

        {/* Exhaust */}
        {hasParts("exhaust") && (
          <>
            <rect x="15" y="45" width="8" height="5" rx="1" fill="#6B7280" />
            {racing && (
              <circle cx="12" cy="48" r="3" fill="#9CA3AF" opacity="0.4">
                <animate attributeName="cx" values="12;0;-10" dur="0.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0.1;0" dur="0.5s" repeatCount="indefinite" />
              </circle>
            )}
          </>
        )}

        {/* TURBO upgrades */}
        {hasUpg("wing") && (
          <path d="M20,15 L15,5 L25,5 Z" fill={C.danger} opacity="0.8" />
        )}

        {hasUpg("nitro") && (
          <rect x="92" y="38" width="12" height="8" rx="2" fill={C.primary} stroke={C.accent} strokeWidth="1" />
        )}

        {hasUpg("flames") && racing && (
          <>
            <ellipse cx="5" cy="45" rx="8" ry="4" fill={C.gold} opacity="0.7">
              <animate attributeName="rx" values="8;12;8" dur="0.2s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="0" cy="45" rx="5" ry="3" fill={C.danger} opacity="0.8">
              <animate attributeName="rx" values="5;9;5" dur="0.15s" repeatCount="indefinite" />
            </ellipse>
          </>
        )}

        {hasUpg("turbo") && (
          <text x="55" y="30" textAnchor="middle" fontSize="6" fill={C.gold} fontWeight="bold">TURBO</text>
        )}
      </g>
    </svg>
  );
}

// ============================================
// MAIN GAME
// ============================================
export default function Game_CodeRacer() {
  const [screen, setScreen] = useState("intro"); // intro, build, race, results
  const [phase, setPhase] = useState(0);
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [parts, setParts] = useState([]);
  const [upgrades, setUpgrades] = useState([]);
  const [abilities, setAbilities] = useState([]);
  const [score, setScore] = useState(0);
  const [myColor] = useState(CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)]);
  const [racePos, setRacePos] = useState(0);
  const [opponents, setOpponents] = useState([]);
  const [raceFinished, setRaceFinished] = useState(false);
  const [raceRank, setRaceRank] = useState(0);
  const raceRef = useRef(null);
  const inputRef = useRef(null);

  const currentPhase = PHASES[phase];
  const currentChallenge = currentPhase?.challenges[step];
  const totalChallenges = PHASES.reduce((a, p) => a + p.challenges.length, 0);
  const completedChallenges = PHASES.slice(0, phase).reduce((a, p) => a + p.challenges.length, 0) + step;

  function checkAnswer() {
    if (!currentChallenge) return;
    const trimmed = input.trim();
    const correct = currentChallenge.accepts.some(a => {
      const norm = s => s.replace(/\s+/g, '').toLowerCase().replace(/;$/,'');
      return norm(trimmed) === norm(a) || trimmed.replace(/\s+/g,' ').toLowerCase().includes(a.replace(/\s+/g,' ').toLowerCase().slice(0,15));
    });

    if (correct) {
      setFeedback({ ok: true, msg: currentChallenge.partLabel || currentChallenge.abilityLabel || currentChallenge.upgradeLabel || "Correct !" });
      setScore(s => s + 100);

      // Add visual element
      if (currentChallenge.part) setParts(p => [...p, currentChallenge.part]);
      if (currentChallenge.ability) setAbilities(a => [...a, currentChallenge.ability]);
      if (currentChallenge.upgrade) setUpgrades(u => [...u, currentChallenge.upgrade]);

      // Next step
      setTimeout(() => {
        setFeedback(null);
        setInput("");
        if (step + 1 < currentPhase.challenges.length) {
          setStep(s => s + 1);
        } else if (phase + 1 < PHASES.length) {
          setPhase(p => p + 1);
          setStep(0);
        } else {
          startRace();
        }
      }, 1500);
    } else {
      setFeedback({ ok: false, msg: "Pas tout a fait... Verifiez la syntaxe Java." });
      setTimeout(() => setFeedback(null), 2000);
    }
  }

  function startRace() {
    setScreen("race");
    setRacePos(0);
    setRaceFinished(false);

    // Generate opponents based on how well the player did
    const opps = [
      { name: "Bot Alpha", color: "#6B7280", speed: 0.8 + Math.random() * 0.4 },
      { name: "Bot Beta", color: "#94a3b8", speed: 0.6 + Math.random() * 0.5 },
      { name: "Bot Gamma", color: "#4B5563", speed: 0.5 + Math.random() * 0.6 },
    ];
    setOpponents(opps.map(o => ({ ...o, pos: 0 })));

    // Player speed based on score + parts + upgrades
    const baseSpeed = 0.3 + (parts.length * 0.1) + (abilities.length * 0.08) + (upgrades.length * 0.15);
    const playerSpeed = Math.min(1.5, baseSpeed);

    let frame = 0;
    raceRef.current = setInterval(() => {
      frame++;
      setRacePos(p => {
        const newP = Math.min(160, p + playerSpeed + Math.random() * 0.5);
        return newP;
      });
      setOpponents(prev => prev.map(o => ({
        ...o,
        pos: Math.min(160, o.pos + o.speed + Math.random() * 0.5),
      })));
    }, 50);
  }

  // Check race finish
  useEffect(() => {
    if (screen !== "race" || raceFinished) return;
    const allPositions = [{ pos: racePos, name: "Vous" }, ...opponents];
    if (racePos >= 155 || opponents.some(o => o.pos >= 155)) {
      clearInterval(raceRef.current);
      setRaceFinished(true);
      const sorted = allPositions.sort((a, b) => b.pos - a.pos);
      const rank = sorted.findIndex(p => p.name === "Vous") + 1;
      setRaceRank(rank);
      setScore(s => s + (rank === 1 ? 500 : rank === 2 ? 300 : rank === 3 ? 150 : 50));
    }
  }, [racePos, opponents, screen, raceFinished]);

  function restart() {
    setScreen("intro");
    setPhase(0); setStep(0); setInput(""); setFeedback(null);
    setParts([]); setUpgrades([]); setAbilities([]);
    setScore(0); setRacePos(0); setRaceFinished(false);
    if (raceRef.current) clearInterval(raceRef.current);
  }

  // ============================================
  // INTRO SCREEN
  // ============================================
  if (screen === "intro") {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
        <div style={{ animation: "bounce 2s infinite" }}>
          <Car size={64} color={C.danger} />
        </div>
        <div style={{ fontSize: 32, fontWeight: 800, color: C.danger, marginTop: 16 }}>CODE RACER</div>
        <div style={{ fontSize: 14, color: C.gold, fontWeight: 600, marginTop: 4 }}>Construis ta voiture en Java, fais-la courir !</div>
        <div style={{ fontSize: 12, color: C.muted, marginTop: 12, maxWidth: 450, textAlign: "center", lineHeight: 1.8 }}>
          <span style={{ color: C.gold }}>Phase 1</span> — Ecris le constructeur pour assembler ta voiture piece par piece<br />
          <span style={{ color: C.accent }}>Phase 2</span> — Code les methodes pour lui donner des capacites<br />
          <span style={{ color: C.danger }}>Phase 3</span> — Heritage = Turbo ! Cree VoitureCourse extends Voiture<br />
          <span style={{ color: C.success }}>Course</span> — Ta voiture affronte 3 bots. Plus ton code est complet, plus tu vas vite !
        </div>
        <button onClick={() => setScreen("build")} style={{
          marginTop: 24, padding: "14px 40px", borderRadius: 12, border: "none",
          background: "linear-gradient(135deg, " + C.danger + ", " + C.gold + ")",
          color: "#fff", cursor: "pointer", fontFamily: "inherit", fontSize: 18, fontWeight: 800,
          display: "flex", alignItems: "center", gap: 8,
        }}><Play size={20} /> DEMARRER</button>
      </div>
    );
  }

  // ============================================
  // BUILD SCREEN
  // ============================================
  if (screen === "build") {
    const Icon = currentPhase.icon;
    return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", padding: 16 }}>
        <style>{`
          @keyframes partAppear{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}
          @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
          .part-new{animation:partAppear .5s ease-out}
          .shake{animation:shake .3s ease-out}
        `}</style>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon size={20} color={currentPhase.color} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: currentPhase.color }}>{currentPhase.title}</div>
                <div style={{ fontSize: 10, color: C.muted }}>{currentPhase.subtitle}</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: C.muted }}>
              {"Etape " + (completedChallenges + 1) + "/" + totalChallenges + " | Score: " + score}
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ height: 4, background: C.border, borderRadius: 2, marginBottom: 16, overflow: "hidden" }}>
            <div style={{ height: "100%", width: ((completedChallenges / totalChallenges) * 100) + "%", background: currentPhase.color, borderRadius: 2, transition: "width .5s" }} />
          </div>

          {/* Car visual */}
          <div style={{ background: C.card, borderRadius: 12, padding: 16, border: "1px solid " + C.border, marginBottom: 16, textAlign: "center" }}>
            <CarVisual parts={parts} upgrades={upgrades} color={myColor} racing={false} position={50} />
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
              {parts.map(p => <span key={p} className="part-new" style={{ padding: "2px 8px", borderRadius: 4, background: C.success + "20", color: C.success, fontSize: 9, fontWeight: 600 }}>{p}</span>)}
              {abilities.map(a => <span key={a} className="part-new" style={{ padding: "2px 8px", borderRadius: 4, background: C.accent + "20", color: C.accent, fontSize: 9, fontWeight: 600 }}>{a}</span>)}
              {upgrades.map(u => <span key={u} className="part-new" style={{ padding: "2px 8px", borderRadius: 4, background: C.danger + "20", color: C.danger, fontSize: 9, fontWeight: 600 }}>{u}</span>)}
            </div>
          </div>

          {/* Challenge */}
          {currentChallenge && (
            <div style={{ background: C.card, borderRadius: 12, padding: 16, border: "1px solid " + currentPhase.color + "30" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 8 }}>
                {currentChallenge.instruction}
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") checkAnswer(); }}
                  placeholder="Tapez votre code Java ici..."
                  autoFocus
                  style={{
                    flex: 1, padding: "10px 14px", borderRadius: 8,
                    border: "1px solid " + C.border, background: C.code,
                    color: C.codeTxt, fontFamily: "'Consolas','Courier New',monospace",
                    fontSize: 13, outline: "none",
                  }}
                />
                <button onClick={checkAnswer} style={{
                  padding: "10px 20px", borderRadius: 8, border: "none",
                  background: currentPhase.color, color: "#fff", cursor: "pointer",
                  fontFamily: "inherit", fontSize: 12, fontWeight: 700,
                }}>Valider</button>
              </div>

              {/* Hint */}
              <div style={{ fontSize: 10, color: C.dimmed, fontFamily: "'Consolas',monospace" }}>
                {"Reponse attendue : " + currentChallenge.answer}
              </div>

              {/* Feedback */}
              {feedback && (
                <div className={feedback.ok ? "part-new" : "shake"} style={{
                  marginTop: 8, padding: "8px 12px", borderRadius: 8,
                  background: (feedback.ok ? C.success : C.danger) + "15",
                  border: "1px solid " + (feedback.ok ? C.success : C.danger) + "40",
                  fontSize: 12, fontWeight: 600,
                  color: feedback.ok ? C.success : C.danger,
                }}>
                  {feedback.ok ? "✓ " : "✗ "}{feedback.msg}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================
  // RACE SCREEN
  // ============================================
  if (screen === "race") {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", padding: 16 }}>
        <style>{`@keyframes raceFlag{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}`}</style>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{ display: "inline-block", animation: "raceFlag 1s infinite" }}><Flag size={24} color={C.gold} /></div>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.danger }}>LA COURSE !</div>
            <div style={{ fontSize: 11, color: C.muted }}>Ta voiture affronte 3 bots</div>
          </div>

          {/* Race tracks */}
          <div style={{ display: "grid", gap: 8 }}>
            {/* Player */}
            <div style={{ background: C.card, borderRadius: 10, padding: "8px 12px", border: "2px solid " + C.gold + "60" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.gold, marginBottom: 4 }}>VOUS</div>
              <div style={{ position: "relative", height: 50, background: C.bg, borderRadius: 6, overflow: "hidden" }}>
                <div style={{ position: "absolute", right: 4, top: 4, fontSize: 32, opacity: 0.1 }}>🏁</div>
                <div style={{ position: "absolute", left: (racePos / 160 * 100) + "%", top: 5, transition: "left 0.05s linear" }}>
                  <CarVisual parts={parts} upgrades={upgrades} color={myColor} racing={true} position={0} />
                </div>
              </div>
            </div>

            {/* Opponents */}
            {opponents.map((o, i) => (
              <div key={i} style={{ background: C.card, borderRadius: 10, padding: "8px 12px", border: "1px solid " + C.border }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: C.muted, marginBottom: 4 }}>{o.name}</div>
                <div style={{ position: "relative", height: 30, background: C.bg, borderRadius: 6, overflow: "hidden" }}>
                  <div style={{
                    position: "absolute", left: (o.pos / 160 * 100) + "%", top: 5,
                    width: 30, height: 15, background: o.color, borderRadius: 4,
                    transition: "left 0.05s linear",
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Race result */}
          {raceFinished && (
            <div style={{ marginTop: 20, background: C.card, borderRadius: 16, padding: 24, border: "1px solid " + C.gold + "40", textAlign: "center" }}>
              <div style={{ fontSize: 48, fontWeight: 800, color: raceRank === 1 ? C.gold : raceRank <= 2 ? C.accent : C.muted }}>
                {"#" + raceRank}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: raceRank === 1 ? C.gold : C.text, marginBottom: 8 }}>
                {raceRank === 1 ? "VICTOIRE !" : raceRank === 2 ? "Excellent !" : raceRank === 3 ? "Pas mal !" : "Continue a t'entrainer !"}
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: C.gold, marginBottom: 16 }}>{score + " pts"}</div>

              <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
                <span style={{ padding: "3px 10px", borderRadius: 6, background: C.success + "20", color: C.success, fontSize: 10 }}>{parts.length + " pieces"}</span>
                <span style={{ padding: "3px 10px", borderRadius: 6, background: C.accent + "20", color: C.accent, fontSize: 10 }}>{abilities.length + " methodes"}</span>
                <span style={{ padding: "3px 10px", borderRadius: 6, background: C.danger + "20", color: C.danger, fontSize: 10 }}>{upgrades.length + " upgrades"}</span>
              </div>

              <button onClick={restart} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "10px 24px", borderRadius: 8, border: "none",
                background: C.danger, color: "#fff", cursor: "pointer",
                fontFamily: "inherit", fontSize: 14, fontWeight: 700,
              }}><RotateCcw size={14} /> Rejouer</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
