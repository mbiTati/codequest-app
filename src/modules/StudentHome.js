import { useAuth } from '../lib/AuthProvider';
import { Trophy, Zap, Star, TrendingUp, Play, BookOpen, FolderOpen } from 'lucide-react';

const C = {
  bg:"#0a0f1a",card:"#111827",accent:"#32E0C4",gold:"#F59E0B",
  text:"#e2e8f0",muted:"#94a3b8",border:"#1e293b",danger:"#EF4444",
  primary:"#0D7377",success:"#10B981",dimmed:"#64748b",
};

const LEVELS = [
  {name:"Noob Master",min:0,color:"#64748b"},
  {name:"Noob Coder",min:50,color:"#94a3b8"},
  {name:"Little Coder",min:150,color:"#14A3C7"},
  {name:"Vibe Coder",min:300,color:"#7C3AED"},
  {name:"Code Rookie",min:500,color:"#0D7377"},
  {name:"J Coder",min:750,color:"#F59E0B"},
  {name:"Code Master",min:1000,color:"#10B981"},
  {name:"Code Legend",min:1500,color:"#EF4444"},
  {name:"Lord Coder",min:2000,color:"#32E0C4"},
];

function getLevel(cr){let l=LEVELS[0];for(const lv of LEVELS)if(cr>=lv.min)l=lv;return l;}
function getNextLevel(cr){for(const l of LEVELS)if(cr<l.min)return l;return null;}
function getLevelIndex(cr){let idx=0;for(let i=0;i<LEVELS.length;i++)if(cr>=LEVELS[i].min)idx=i;return idx;}

const MODULES_ORDER=["M00","M15","M01","M02","M03","M04","M05","M14","M06","M07","M08","M09","M10","M11","M12","M13"];
const MODULE_NAMES={M00:"Fondamentaux",M15:"Variables",M01:"Conditions",M02:"Boucles",M03:"POO",M04:"Data",M05:"Heritage",M14:"Swing",M06:"Git",M07:"Securite",M08:"Build",M09:"Debugging",M10:"Standards",M11:"Escape Room",M12:"Fichiers",M13:"BDD"};

export default function StudentHome({ onOpenModule, onOpenCours }) {
  const { student } = useAuth();

  const moduleProgress = MODULES_ORDER.map(code => {
    const key = "cq-" + code.toLowerCase() + "-unified";
    try {
      const d = JSON.parse(localStorage.getItem(key));
      if (!d) return { code, started: false, done: false, credits: 0 };
      const steps = Object.keys(d.c || {}).length;
      return { code, started: true, done: steps >= 5, credits: d.cr || 0 };
    } catch { return { code, started: false, done: false, credits: 0 }; }
  });

  const totalCredits = moduleProgress.reduce((a, m) => a + m.credits, 0);
  const modulesCompleted = moduleProgress.filter(m => m.done).length;
  const modulesStarted = moduleProgress.filter(m => m.started).length;
  const currentLevel = getLevel(totalCredits);
  const nextLevel = getNextLevel(totalCredits);
  const levelIdx = getLevelIndex(totalCredits);
  const xpPct = nextLevel ? Math.min(100, Math.round(((totalCredits - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100)) : 100;
  const nextModule = moduleProgress.find(m => m.started && !m.done) || moduleProgress.find(m => !m.started);
  const isTeacher = student?.role === 'teacher';

  return (
    <div style={{ padding: "16px 20px", maxWidth: 900, margin: "0 auto" }}>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes glow{0%,100%{box-shadow:0 0 15px ${currentLevel.color}30}50%{box-shadow:0 0 30px ${currentLevel.color}60}}
        @keyframes shimmer{0%{background-position:-200px 0}100%{background-position:200px 0}}
        @keyframes run{0%{transform:translateX(0)}50%{transform:translateX(3px)}100%{transform:translateX(0)}}
        .home-card{animation:fadeIn .4s ease-out both}
        .level-ring{animation:glow 2s infinite}
        .xp-fill{background:linear-gradient(90deg,${currentLevel.color},${currentLevel.color}cc);background-size:200px 100%;animation:shimmer 2s infinite linear}
      `}</style>

      {/* Welcome + Level Card */}
      <div className="home-card" style={{
        background: `linear-gradient(135deg, ${C.card}, ${currentLevel.color}15)`,
        borderRadius: 16, padding: 20, border: "1px solid " + currentLevel.color + "30",
        marginBottom: 16, display: "flex", alignItems: "center", gap: 20,
      }}>
        <div className="level-ring" style={{
          width: 80, height: 80, borderRadius: "50%", flexShrink: 0,
          background: currentLevel.color + "20", border: "3px solid " + currentLevel.color,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: currentLevel.color }}>
            {isTeacher ? "PROF" : ("Nv" + (levelIdx + 1))}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>
            {"Bonjour " + (student?.first_name || "Codeur") + " !"}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: currentLevel.color, marginTop: 2 }}>
            {isTeacher ? "Professeur" : currentLevel.name}
          </div>
          {!isTeacher && (
            <div style={{ marginTop: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.muted, marginBottom: 3 }}>
                <span>{totalCredits + " CR"}</span>
                <span>{nextLevel ? nextLevel.min + " CR" : "MAX !"}</span>
              </div>
              <div style={{ height: 6, background: C.border, borderRadius: 3, overflow: "hidden" }}>
                <div className="xp-fill" style={{ height: "100%", width: xpPct + "%", borderRadius: 3 }} />
              </div>
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: C.gold }}>{totalCredits}</div>
          <div style={{ fontSize: 9, color: C.muted }}>Credits R&D</div>
        </div>
      </div>

      {/* Stats + Continue */}
      <div className="home-card" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 2fr", gap: 10, marginBottom: 16, animationDelay: ".1s" }}>
        {[
          { icon: <Star size={16} />, label: "Modules OK", value: modulesCompleted + "/16", color: C.accent },
          { icon: <TrendingUp size={16} />, label: "En cours", value: modulesStarted - modulesCompleted, color: C.gold },
          { icon: <Zap size={16} />, label: "Credits", value: totalCredits, color: C.primary },
        ].map((s, i) => (
          <div key={i} style={{ background: C.card, borderRadius: 10, padding: 12, border: "1px solid " + C.border, textAlign: "center" }}>
            <div style={{ color: s.color, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 9, color: C.muted }}>{s.label}</div>
          </div>
        ))}
        {/* Continue button */}
        {nextModule ? (
          <button onClick={() => onOpenModule(nextModule.code.toLowerCase())} style={{
            background: "linear-gradient(135deg, " + C.accent + "15, " + C.primary + "15)",
            borderRadius: 10, padding: 12, border: "1px solid " + C.accent + "40",
            color: C.accent, cursor: "pointer", fontFamily: "inherit", textAlign: "left",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <div style={{ fontSize: 9, color: C.muted }}>{nextModule.started ? "Continuer" : "Prochain"}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.accent }}>{nextModule.code + " " + (MODULE_NAMES[nextModule.code] || "")}</div>
            </div>
            <Play size={20} />
          </button>
        ) : (
          <div style={{ background: C.card, borderRadius: 10, padding: 12, border: "1px solid " + C.success + "40", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.success }}>Tout complete !</div>
          </div>
        )}
      </div>

      {/* Module Progress Grid */}
      <div className="home-card" style={{ background: C.card, borderRadius: 12, padding: 14, border: "1px solid " + C.border, marginBottom: 16, animationDelay: ".2s" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Progression</div>
          <button onClick={onOpenCours} style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "4px 10px", borderRadius: 6, border: "1px solid " + C.gold + "40",
            background: C.gold + "10", color: C.gold, cursor: "pointer",
            fontFamily: "inherit", fontSize: 10, fontWeight: 600,
          }}><FolderOpen size={12} /> Cours & Documents</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 4 }}>
          {moduleProgress.map(m => (
            <button key={m.code} onClick={() => onOpenModule(m.code.toLowerCase())} title={m.code + " — " + (MODULE_NAMES[m.code] || "")} style={{
              height: 36, borderRadius: 6, border: "1px solid " + (m.done ? C.success : m.started ? C.gold : C.border) + "30",
              background: m.done ? C.success + "20" : m.started ? C.gold + "15" : C.border + "20",
              color: m.done ? C.success : m.started ? C.gold : C.dimmed,
              fontSize: 9, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{m.code.replace("M", "")}</button>
          ))}
        </div>
      </div>

      {/* Level dots (compact) */}
      {!isTeacher && (
        <div className="home-card" style={{ display: "flex", gap: 4, justifyContent: "center", animationDelay: ".3s" }}>
          {LEVELS.map((l, i) => (
            <div key={i} title={l.name + " (" + l.min + " CR)"} style={{
              width: i <= levelIdx ? 28 : 20, height: i <= levelIdx ? 28 : 20, borderRadius: "50%",
              background: i <= levelIdx ? l.color : C.border,
              border: i === levelIdx ? "2px solid " + l.color : "2px solid transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 6, fontWeight: 700, color: i <= levelIdx ? "#fff" : C.dimmed,
              transition: "all .3s",
            }}>{l.name.split(" ").map(w => w[0]).join("")}</div>
          ))}
        </div>
      )}
    </div>
  );
}
