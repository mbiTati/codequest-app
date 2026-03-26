import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Repeat, GitBranch, Box, Zap, ArrowRight } from 'lucide-react';

const C = {
  bg:"#0a0f1a",card:"#111827",accent:"#32E0C4",gold:"#F59E0B",
  text:"#e2e8f0",muted:"#94a3b8",border:"#1e293b",danger:"#EF4444",
  success:"#10B981",primary:"#0D7377",dimmed:"#64748b",
};

// ============================================
// BLOCK COLORS (Roblox-style)
// ============================================
const BLOCK = {
  red: "#EF4444",    // danger / error
  blue: "#3B82F6",   // loop / repeat
  green: "#10B981",  // success / true
  yellow: "#F59E0B", // condition / check
  purple: "#8B5CF6", // class / object
  pink: "#EC4899",   // method / function
  cyan: "#32E0C4",   // constructor
  orange: "#F97316", // inheritance
  gray: "#6B7280",   // inactive
};

// ============================================
// ANIMATED BLOCK COMPONENT
// ============================================
function Block({ color, label, x, y, width = 100, height = 40, active = false, highlight = false, delay = 0, children }) {
  return (
    <g transform={`translate(${x},${y})`} style={{ transition: "all 0.5s ease " + delay + "s" }}>
      {/* 3D shadow */}
      <rect x="4" y="4" width={width} height={height} rx="6" fill="#00000040" />
      {/* Main block */}
      <rect width={width} height={height} rx="6" fill={active ? color : color + "60"} stroke={highlight ? "#fff" : color} strokeWidth={highlight ? 2.5 : 1.5}>
        {active && <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite" />}
      </rect>
      {/* Studs (Roblox-style) */}
      <circle cx={width * 0.25} cy="7" r="4" fill={color} stroke="#ffffff30" strokeWidth="1" opacity={active ? 0.8 : 0.3} />
      <circle cx={width * 0.75} cy="7" r="4" fill={color} stroke="#ffffff30" strokeWidth="1" opacity={active ? 0.8 : 0.3} />
      {/* Label */}
      <text x={width / 2} y={height / 2 + 5} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff" fontFamily="'Consolas',monospace">
        {label}
      </text>
      {children}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, color = "#fff", active = false }) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={active ? color : color + "40"} strokeWidth={active ? 2 : 1} markerEnd="url(#arrowhead)">
      {active && <animate attributeName="strokeDashoffset" values="20;0" dur="0.5s" repeatCount="1" />}
    </line>
  );
}

// ============================================
// ANIMATION: FOR LOOP
// ============================================
function ForLoopAnimation() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [i, setI] = useState(0);
  const maxSteps = 18; // init + 5 iterations × 3 steps + end
  const timerRef = useRef(null);

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setStep(s => {
          if (s >= maxSteps) { setPlaying(false); return s; }
          return s + 1;
        });
      }, 800);
    }
    return () => clearInterval(timerRef.current);
  }, [playing]);

  useEffect(() => {
    if (step === 0) setI(0);
    else if (step >= 1) {
      const iteration = Math.floor((step - 1) / 3);
      const phase = (step - 1) % 3;
      if (iteration < 5) setI(iteration);
    }
  }, [step]);

  const iteration = step >= 1 ? Math.floor((step - 1) / 3) : -1;
  const phase = step >= 1 ? (step - 1) % 3 : -1; // 0=check, 1=body, 2=increment
  const finished = iteration >= 5;

  return (
    <div>
      <svg viewBox="0 0 500 320" style={{ width: "100%", background: C.bg, borderRadius: 10 }}>
        <defs><marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#fff" opacity="0.6" /></marker></defs>

        {/* Title */}
        <text x="250" y="25" textAnchor="middle" fontSize="14" fontWeight="800" fill={BLOCK.blue}>FOR LOOP — for (int i = 0; i &lt; 5; i++)</text>

        {/* Init block */}
        <Block x="180" y="40" color={BLOCK.cyan} label="int i = 0" width={140} active={step === 0} highlight={step === 0} />

        {/* Arrow down */}
        <Arrow x1="250" y1="80" x2="250" y2="100" color={BLOCK.cyan} active={step >= 0} />

        {/* Condition block */}
        <Block x="175" y="100" color={BLOCK.yellow} label={`i < 5 ? (i=${i})`} width={150} active={!finished && phase === 0} highlight={!finished && phase === 0} />

        {/* True arrow → body */}
        <Arrow x1="175" y1="130" x2="80" y2="170" color={BLOCK.green} active={!finished && phase >= 0} />
        <text x="110" y="155" fontSize="10" fill={BLOCK.green} fontWeight="600">true</text>

        {/* Body block */}
        <Block x="20" y="170" color={BLOCK.blue} label={`print(${i})`} width={120} active={!finished && phase === 1} highlight={!finished && phase === 1} />

        {/* Arrow body → increment */}
        <Arrow x1="80" y1="210" x2="80" y2="240" color={BLOCK.blue} active={!finished && phase >= 1} />

        {/* Increment block */}
        <Block x="30" y="240" color={BLOCK.pink} label={`i++ → i=${Math.min(i + 1, 5)}`} width={110} active={!finished && phase === 2} highlight={!finished && phase === 2} />

        {/* Loop back arrow */}
        <path d="M140,260 Q200,290 250,140" fill="none" stroke={BLOCK.blue + "60"} strokeWidth="1.5" strokeDasharray="4,4" markerEnd="url(#arrowhead)" />
        <text x="200" y="285" fontSize="9" fill={BLOCK.blue} fontWeight="600">retour</text>

        {/* False arrow → end */}
        <Arrow x1="325" y1="130" x2="400" y2="170" color={BLOCK.red} active={finished} />
        <text x="370" y="155" fontSize="10" fill={BLOCK.red} fontWeight="600">false</text>

        {/* End block */}
        <Block x="370" y="170" color={finished ? BLOCK.green : BLOCK.gray} label="FIN" width={80} active={finished} highlight={finished} />

        {/* Output display */}
        <rect x="350" y="220" width="130" height="80" rx="6" fill="#1E293B" stroke={C.border} />
        <text x="360" y="238" fontSize="9" fill={C.dimmed}>Console :</text>
        {Array.from({ length: Math.min(iteration + (phase >= 1 ? 1 : 0), 5) }, (_, idx) => (
          <text key={idx} x="365" y={252 + idx * 12} fontSize="11" fill={BLOCK.cyan} fontFamily="'Consolas',monospace">{"→ " + idx}</text>
        ))}
      </svg>

      {/* Controls */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8 }}>
        <button onClick={() => { setStep(0); setPlaying(false); setI(0); }} style={ctrlBtn}><RotateCcw size={14} /></button>
        <button onClick={() => setPlaying(!playing)} style={{ ...ctrlBtn, background: playing ? BLOCK.red + "20" : BLOCK.green + "20", color: playing ? BLOCK.red : BLOCK.green }}>
          {playing ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <button onClick={() => setStep(s => Math.min(s + 1, maxSteps))} disabled={playing} style={ctrlBtn}><ChevronRight size={14} /></button>
      </div>
    </div>
  );
}

// ============================================
// ANIMATION: WHILE LOOP
// ============================================
function WhileLoopAnimation() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const maxSteps = 12;
  const timerRef = useRef(null);

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setStep(s => { if (s >= maxSteps) { setPlaying(false); return s; } return s + 1; });
      }, 900);
    }
    return () => clearInterval(timerRef.current);
  }, [playing]);

  const count = Math.floor(step / 3);
  const phase = step % 3;
  const finished = count >= 4;

  return (
    <div>
      <svg viewBox="0 0 500 250" style={{ width: "100%", background: C.bg, borderRadius: 10 }}>
        <defs><marker id="arrowhead2" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#fff" opacity="0.6" /></marker></defs>
        <text x="250" y="25" textAnchor="middle" fontSize="14" fontWeight="800" fill={BLOCK.blue}>WHILE LOOP — while (count &lt; 4)</text>

        <Block x="30" y="50" color={BLOCK.yellow} label={`count < 4 ? (${count})`} width={150} active={!finished && phase === 0} highlight={!finished && phase === 0} />
        <Block x="30" y="120" color={BLOCK.blue} label={`traitement(${count})`} width={130} active={!finished && phase === 1} highlight={!finished && phase === 1} />
        <Block x="30" y="190" color={BLOCK.pink} label={`count++ → ${Math.min(count + 1, 4)}`} width={130} active={!finished && phase === 2} highlight={!finished && phase === 2} />

        <path d="M160,210 Q220,230 220,70 L180,70" fill="none" stroke={BLOCK.blue + "60"} strokeWidth="1.5" strokeDasharray="4,4" markerEnd="url(#arrowhead2)" />

        <Block x="320" y="100" color={finished ? BLOCK.green : BLOCK.gray} label="FIN" width={80} active={finished} highlight={finished} />
        <Arrow x1="180" y1="70" x2="320" y2="120" color={BLOCK.red} active={finished} />
        <text x="250" y="85" fontSize="9" fill={finished ? BLOCK.red : BLOCK.gray}>false →</text>

        {/* Counter visual */}
        <rect x="320" y="170" width="140" height="60" rx="6" fill="#1E293B" stroke={C.border} />
        <text x="330" y="188" fontSize="9" fill={C.dimmed}>Iterations :</text>
        <text x="390" y="215" textAnchor="middle" fontSize="24" fontWeight="800" fill={BLOCK.blue}>{Math.min(count + (phase >= 1 ? 1 : 0), 4)}</text>
      </svg>

      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8 }}>
        <button onClick={() => { setStep(0); setPlaying(false); }} style={ctrlBtn}><RotateCcw size={14} /></button>
        <button onClick={() => setPlaying(!playing)} style={{ ...ctrlBtn, background: playing ? BLOCK.red + "20" : BLOCK.green + "20", color: playing ? BLOCK.red : BLOCK.green }}>
          {playing ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <button onClick={() => setStep(s => Math.min(s + 1, maxSteps))} disabled={playing} style={ctrlBtn}><ChevronRight size={14} /></button>
      </div>
    </div>
  );
}

// ============================================
// ANIMATION: IF / ELSE
// ============================================
function IfElseAnimation() {
  const [age, setAge] = useState(20);
  const [animating, setAnimating] = useState(false);
  const [step, setStep] = useState(0);
  const isMajeur = age >= 18;

  function run() {
    setStep(0); setAnimating(true);
    setTimeout(() => setStep(1), 500);
    setTimeout(() => setStep(2), 1200);
    setTimeout(() => setStep(3), 2000);
    setTimeout(() => setAnimating(false), 2500);
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: C.muted }}>age =</span>
        <input type="number" value={age} onChange={e => setAge(parseInt(e.target.value) || 0)}
          style={{ width: 60, padding: "4px 8px", borderRadius: 6, border: "1px solid " + C.border, background: C.card, color: C.gold, fontFamily: "monospace", fontSize: 14, fontWeight: 700, textAlign: "center" }} />
        <button onClick={run} disabled={animating} style={{ ...ctrlBtn, background: BLOCK.green + "20", color: BLOCK.green }}><Play size={14} /> Executer</button>
      </div>

      <svg viewBox="0 0 500 220" style={{ width: "100%", background: C.bg, borderRadius: 10 }}>
        <text x="250" y="25" textAnchor="middle" fontSize="14" fontWeight="800" fill={BLOCK.yellow}>IF / ELSE — if (age &gt;= 18)</text>

        {/* Variable block */}
        <Block x="180" y="40" color={BLOCK.cyan} label={`int age = ${age}`} width={140} active={step >= 1} highlight={step === 1} />

        {/* Condition diamond */}
        <polygon points="250,95 310,125 250,155 190,125" fill={step >= 2 ? BLOCK.yellow + "40" : BLOCK.yellow + "15"} stroke={step >= 2 ? BLOCK.yellow : BLOCK.yellow + "40"} strokeWidth="2" />
        <text x="250" y="130" textAnchor="middle" fontSize="10" fontWeight="700" fill={C.text}>age &gt;= 18 ?</text>

        {/* True branch */}
        <Arrow x1="190" y1="135" x2="80" y2="180" color={BLOCK.green} active={step >= 3 && isMajeur} />
        <text x="120" y="165" fontSize="9" fill={BLOCK.green}>true</text>
        <Block x="20" y="170" color={step >= 3 && isMajeur ? BLOCK.green : BLOCK.gray} label='"Majeur"' width={120} active={step >= 3 && isMajeur} highlight={step >= 3 && isMajeur} />

        {/* False branch */}
        <Arrow x1="310" y1="135" x2="380" y2="180" color={BLOCK.red} active={step >= 3 && !isMajeur} />
        <text x="350" y="165" fontSize="9" fill={BLOCK.red}>false</text>
        <Block x="360" y="170" color={step >= 3 && !isMajeur ? BLOCK.red : BLOCK.gray} label='"Mineur"' width={120} active={step >= 3 && !isMajeur} highlight={step >= 3 && !isMajeur} />
      </svg>
    </div>
  );
}

// ============================================
// ANIMATION: SWITCH
// ============================================
function SwitchAnimation() {
  const [jour, setJour] = useState("lundi");
  const [step, setStep] = useState(0);
  const jours = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
  const results = { lundi: "Debut de semaine", mardi: "Mardi gras ?", mercredi: "Milieu !", jeudi: "Bientot...", vendredi: "WEEKEND !", samedi: "Repos", dimanche: "default: Jour normal" };

  function run() {
    setStep(0);
    setTimeout(() => setStep(1), 300);
    setTimeout(() => setStep(2), 800);
    setTimeout(() => setStep(3), 1500);
  }

  const jourIdx = jours.indexOf(jour);

  return (
    <div>
      <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center", marginBottom: 8, flexWrap: "wrap" }}>
        {jours.map(j => (
          <button key={j} onClick={() => { setJour(j); setStep(0); }} style={{
            padding: "4px 10px", borderRadius: 6, border: "1px solid " + (jour === j ? BLOCK.yellow : C.border),
            background: jour === j ? BLOCK.yellow + "20" : "transparent",
            color: jour === j ? BLOCK.yellow : C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 10, fontWeight: 600,
          }}>{j}</button>
        ))}
        <button onClick={run} style={{ ...ctrlBtn, background: BLOCK.green + "20", color: BLOCK.green }}><Play size={14} /></button>
      </div>

      <svg viewBox="0 0 500 280" style={{ width: "100%", background: C.bg, borderRadius: 10 }}>
        <text x="250" y="20" textAnchor="middle" fontSize="14" fontWeight="800" fill={BLOCK.yellow}>SWITCH — switch(jour)</text>

        {/* Switch variable */}
        <Block x="180" y="30" color={BLOCK.cyan} label={`jour = "${jour}"`} width={140} active={step >= 1} highlight={step === 1} />

        {/* Switch diamond */}
        <polygon points="250,85 300,105 250,125 200,105" fill={step >= 2 ? BLOCK.yellow + "40" : BLOCK.yellow + "15"} stroke={step >= 2 ? BLOCK.yellow : BLOCK.yellow + "40"} strokeWidth="2" />
        <text x="250" y="110" textAnchor="middle" fontSize="9" fontWeight="700" fill={C.text}>switch</text>

        {/* Cases */}
        {jours.slice(0, 5).map((j, idx) => {
          const isMatch = j === jour && step >= 3;
          const cx = 30 + idx * 90;
          return (
            <g key={j}>
              <Arrow x1="250" y1="125" x2={cx + 40} y2="155" color={isMatch ? BLOCK.green : C.dimmed} active={step >= 2} />
              <Block x={cx} y="155" color={isMatch ? BLOCK.green : BLOCK.gray} label={`"${j}"`} width={80} height={30} active={isMatch} highlight={isMatch} />
              {isMatch && (
                <Block x={cx - 10} y="195" color={BLOCK.green} label={results[j]?.slice(0, 14) || ""} width={100} height={28} active={true} highlight={true} />
              )}
            </g>
          );
        })}

        {/* Default case */}
        {jourIdx >= 5 && step >= 3 && (
          <Block x="200" y="240" color={BLOCK.orange} label={"default: " + (results[jour]?.slice(0, 18) || "Jour")} width={160} height={30} active={true} highlight={true} />
        )}

        {/* Break label */}
        {step >= 3 && <text x="250" y="275" textAnchor="middle" fontSize="9" fill={BLOCK.red} fontWeight="600">break; → sort du switch</text>}
      </svg>
    </div>
  );
}

// ============================================
// ANIMATION: CONSTRUCTOR
// ============================================
function ConstructorAnimation() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setStep(s => { if (s >= 6) { setPlaying(false); return s; } return s + 1; });
      }, 1200);
    }
    return () => clearInterval(timerRef.current);
  }, [playing]);

  return (
    <div>
      <svg viewBox="0 0 500 280" style={{ width: "100%", background: C.bg, borderRadius: 10 }}>
        <text x="250" y="25" textAnchor="middle" fontSize="14" fontWeight="800" fill={BLOCK.purple}>CONSTRUCTEUR — new Voiture("Tesla", 250, "rouge")</text>

        {/* Class template (left) */}
        <rect x="20" y="45" width="180" height="140" rx="8" fill={BLOCK.purple + "15"} stroke={BLOCK.purple + "60"} />
        <text x="110" y="65" textAnchor="middle" fontSize="11" fontWeight="700" fill={BLOCK.purple}>class Voiture</text>
        <line x1="20" y1="72" x2="200" y2="72" stroke={BLOCK.purple + "40"} />
        <text x="30" y="88" fontSize="9" fill={step >= 1 ? C.text : C.dimmed}>- marque: String</text>
        <text x="30" y="103" fontSize="9" fill={step >= 2 ? C.text : C.dimmed}>- vitesseMax: int</text>
        <text x="30" y="118" fontSize="9" fill={step >= 3 ? C.text : C.dimmed}>- couleur: String</text>
        <line x1="20" y1="125" x2="200" y2="125" stroke={BLOCK.purple + "40"} />
        <text x="30" y="142" fontSize="9" fill={step >= 4 ? BLOCK.cyan : C.dimmed}>+ Voiture(m, v, c)</text>
        <text x="30" y="157" fontSize="9" fill={C.dimmed}>+ accelerer()</text>
        <text x="30" y="172" fontSize="9" fill={C.dimmed}>+ decrire(): String</text>

        {/* Arrow: new */}
        <Arrow x1="200" y1="100" x2="270" y2="100" color={BLOCK.cyan} active={step >= 4} />
        <text x="235" y="92" fontSize="10" fontWeight="700" fill={step >= 4 ? BLOCK.cyan : C.dimmed}>new</text>

        {/* Object being built (right) */}
        <rect x="280" y="45" width="200" height="140" rx="8" fill={step >= 4 ? BLOCK.cyan + "15" : C.border + "20"} stroke={step >= 4 ? BLOCK.cyan : C.border}>
          {step >= 6 && <animate attributeName="stroke" values={BLOCK.cyan + ";#fff;" + BLOCK.cyan} dur="1s" repeatCount="3" />}
        </rect>
        <text x="380" y="65" textAnchor="middle" fontSize="11" fontWeight="700" fill={step >= 4 ? BLOCK.cyan : C.dimmed}>objet Voiture</text>
        <line x1="280" y1="72" x2="480" y2="72" stroke={C.border} />

        {/* Values filling in */}
        <text x="290" y="90" fontSize="10" fill={step >= 4 ? BLOCK.green : C.dimmed} fontFamily="'Consolas',monospace">
          {step >= 4 ? 'marque = "Tesla"' : 'marque = ?'}
        </text>
        <text x="290" y="108" fontSize="10" fill={step >= 5 ? BLOCK.green : C.dimmed} fontFamily="'Consolas',monospace">
          {step >= 5 ? 'vitesseMax = 250' : 'vitesseMax = ?'}
        </text>
        <text x="290" y="126" fontSize="10" fill={step >= 6 ? BLOCK.green : C.dimmed} fontFamily="'Consolas',monospace">
          {step >= 6 ? 'couleur = "rouge"' : 'couleur = ?'}
        </text>

        {/* This.xxx assignments */}
        {step >= 4 && <Block x="280" y="195" color={BLOCK.cyan} label='this.marque = "Tesla"' width={190} height={25} active={step === 4} highlight={step === 4} />}
        {step >= 5 && <Block x="280" y="225" color={BLOCK.cyan} label='this.vitesseMax = 250' width={190} height={25} active={step === 5} highlight={step === 5} />}
        {step >= 6 && <Block x="280" y="255" color={BLOCK.cyan} label='this.couleur = "rouge"' width={190} height={25} active={step === 6} highlight={step === 6} />}

        {/* Step labels */}
        {step >= 1 && step <= 3 && (
          <text x="110" y="200" textAnchor="middle" fontSize="10" fill={BLOCK.purple}>{"Etape " + step + " : declare l'attribut"}</text>
        )}
        {step >= 4 && (
          <text x="250" y="200" textAnchor="middle" fontSize="10" fill={BLOCK.cyan}>{"Etape " + step + " : this assigne la valeur"}</text>
        )}
      </svg>

      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8 }}>
        <button onClick={() => { setStep(0); setPlaying(false); }} style={ctrlBtn}><RotateCcw size={14} /></button>
        <button onClick={() => setPlaying(!playing)} style={{ ...ctrlBtn, background: playing ? BLOCK.red + "20" : BLOCK.green + "20", color: playing ? BLOCK.red : BLOCK.green }}>
          {playing ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <button onClick={() => setStep(s => Math.min(s + 1, 6))} disabled={playing} style={ctrlBtn}><ChevronRight size={14} /></button>
      </div>
    </div>
  );
}

// ============================================
// ANIMATION: INHERITANCE
// ============================================
function InheritanceAnimation() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setStep(s => { if (s >= 5) { setPlaying(false); return s; } return s + 1; });
      }, 1500);
    }
    return () => clearInterval(timerRef.current);
  }, [playing]);

  return (
    <div>
      <svg viewBox="0 0 500 300" style={{ width: "100%", background: C.bg, borderRadius: 10 }}>
        <text x="250" y="20" textAnchor="middle" fontSize="13" fontWeight="800" fill={BLOCK.orange}>HERITAGE — extends + super()</text>

        {/* Parent class */}
        <rect x="30" y="35" width="180" height={step >= 1 ? 120 : 100} rx="8" fill={BLOCK.purple + "20"} stroke={BLOCK.purple} strokeWidth="1.5" />
        <text x="120" y="55" textAnchor="middle" fontSize="12" fontWeight="700" fill={BLOCK.purple}>Animal</text>
        <line x1="30" y1="62" x2="210" y2="62" stroke={BLOCK.purple + "40"} />
        <text x="40" y="80" fontSize="9" fill={C.text} fontFamily="monospace"># nom: String</text>
        <line x1="30" y1="90" x2="210" y2="90" stroke={BLOCK.purple + "40"} />
        <text x="40" y="106" fontSize="9" fill={C.text} fontFamily="monospace">+ Animal(nom)</text>
        <text x="40" y="120" fontSize="9" fill={C.text} fontFamily="monospace">+ decrire(): String</text>
        {step >= 1 && <text x="40" y="144" fontSize="9" fill={BLOCK.green} fontFamily="monospace">protected = herite !</text>}

        {/* Arrow extends */}
        <line x1="210" y1="90" x2="290" y2="90" stroke={step >= 2 ? BLOCK.orange : C.dimmed} strokeWidth="2" strokeDasharray={step >= 2 ? "none" : "4,4"} markerEnd="url(#arrowhead)" />
        <text x="250" y="82" textAnchor="middle" fontSize="10" fontWeight="700" fill={step >= 2 ? BLOCK.orange : C.dimmed}>extends</text>

        {/* Child class */}
        <rect x="290" y="35" width="190" height={step >= 3 ? 160 : 100} rx="8" fill={step >= 2 ? BLOCK.orange + "20" : C.border + "20"} stroke={step >= 2 ? BLOCK.orange : C.border} strokeWidth="1.5">
          {step >= 2 && <animate attributeName="opacity" values="0.5;1" dur="0.5s" fill="freeze" />}
        </rect>
        <text x="385" y="55" textAnchor="middle" fontSize="12" fontWeight="700" fill={step >= 2 ? BLOCK.orange : C.dimmed}>Chat</text>
        <line x1="290" y1="62" x2="480" y2="62" stroke={step >= 2 ? BLOCK.orange + "40" : C.border} />
        <text x="300" y="80" fontSize="9" fill={step >= 2 ? C.text : C.dimmed} fontFamily="monospace">- race: String</text>
        <line x1="290" y1="90" x2="480" y2="90" stroke={step >= 2 ? BLOCK.orange + "40" : C.border} />
        {step >= 3 && <text x="300" y="108" fontSize="9" fill={BLOCK.cyan} fontFamily="monospace">+ Chat(nom, race) {"{"}</text>}
        {step >= 3 && <text x="310" y="122" fontSize="9" fill={BLOCK.cyan} fontFamily="monospace">  super(nom); ←</text>}
        {step >= 3 && <text x="310" y="136" fontSize="9" fill={BLOCK.cyan} fontFamily="monospace">  this.race = race;</text>}
        {step >= 3 && <text x="300" y="150" fontSize="9" fill={BLOCK.cyan} fontFamily="monospace">{"}"}</text>}
        {step >= 4 && <text x="300" y="168" fontSize="9" fill={BLOCK.pink} fontFamily="monospace">@Override decrire()</text>}
        {step >= 4 && <text x="300" y="182" fontSize="9" fill={BLOCK.pink} fontFamily="monospace">→ "Chat: nom (race)"</text>}

        {/* Object instance */}
        {step >= 5 && (
          <g>
            <rect x="140" y="210" width="220" height="80" rx="8" fill={BLOCK.green + "15"} stroke={BLOCK.green} strokeWidth="1.5">
              <animate attributeName="opacity" values="0;1" dur="0.5s" fill="freeze" />
            </rect>
            <text x="250" y="230" textAnchor="middle" fontSize="11" fontWeight="700" fill={BLOCK.green}>new Chat("Minou", "Siamois")</text>
            <text x="150" y="250" fontSize="9" fill={C.text} fontFamily="monospace">nom = "Minou" (via super)</text>
            <text x="150" y="265" fontSize="9" fill={C.text} fontFamily="monospace">race = "Siamois" (via this)</text>
            <text x="150" y="280" fontSize="9" fill={BLOCK.pink} fontFamily="monospace">decrire() → "Chat: Minou (Siamois)"</text>
          </g>
        )}
      </svg>

      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8 }}>
        <button onClick={() => { setStep(0); setPlaying(false); }} style={ctrlBtn}><RotateCcw size={14} /></button>
        <button onClick={() => setPlaying(!playing)} style={{ ...ctrlBtn, background: playing ? BLOCK.red + "20" : BLOCK.green + "20", color: playing ? BLOCK.red : BLOCK.green }}>
          {playing ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <button onClick={() => setStep(s => Math.min(s + 1, 5))} disabled={playing} style={ctrlBtn}><ChevronRight size={14} /></button>
      </div>
    </div>
  );
}

// ============================================
// CONTROL BUTTON STYLE
// ============================================
const ctrlBtn = {
  display: "flex", alignItems: "center", justifyContent: "center",
  width: 36, height: 36, borderRadius: 8, border: "1px solid " + C.border,
  background: C.card, color: C.muted, cursor: "pointer",
};

// ============================================
// MAIN EXPORT: Block Animations Gallery
// ============================================
const ANIMATIONS = [
  { id: "forloop", title: "Boucle FOR", icon: Repeat, color: BLOCK.blue, component: ForLoopAnimation },
  { id: "whileloop", title: "Boucle WHILE", icon: Repeat, color: BLOCK.blue, component: WhileLoopAnimation },
  { id: "ifelse", title: "IF / ELSE", icon: GitBranch, color: BLOCK.yellow, component: IfElseAnimation },
  { id: "switch", title: "SWITCH", icon: GitBranch, color: BLOCK.yellow, component: SwitchAnimation },
  { id: "constructor", title: "CONSTRUCTEUR", icon: Box, color: BLOCK.cyan, component: ConstructorAnimation },
  { id: "heritage", title: "HERITAGE", icon: Zap, color: BLOCK.orange, component: InheritanceAnimation },
];

export default function BlockAnimations() {
  const [selected, setSelected] = useState("forloop");
  const anim = ANIMATIONS.find(a => a.id === selected);
  const Comp = anim?.component;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", padding: 16 }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.accent }}>Block Animations</div>
          <div style={{ fontSize: 12, color: C.muted }}>Visualisez les concepts Java avec des blocs animes</div>
        </div>

        {/* Tab selector */}
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center", marginBottom: 16 }}>
          {ANIMATIONS.map(a => {
            const Icon = a.icon;
            return (
              <button key={a.id} onClick={() => setSelected(a.id)} style={{
                display: "flex", alignItems: "center", gap: 4,
                padding: "6px 12px", borderRadius: 8,
                border: "1px solid " + (selected === a.id ? a.color : C.border),
                background: selected === a.id ? a.color + "15" : "transparent",
                color: selected === a.id ? a.color : C.muted,
                cursor: "pointer", fontFamily: "inherit", fontSize: 11, fontWeight: 600,
              }}><Icon size={12} /> {a.title}</button>
            );
          })}
        </div>

        {/* Animation area */}
        <div style={{ background: C.card, borderRadius: 12, padding: 16, border: "1px solid " + C.border }}>
          {Comp && <Comp />}
        </div>
      </div>
    </div>
  );
}

export { ForLoopAnimation, WhileLoopAnimation, IfElseAnimation, SwitchAnimation, ConstructorAnimation, InheritanceAnimation };
