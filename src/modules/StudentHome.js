import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthProvider';
import { BookOpen, FileText, Coffee, Trophy, Zap, Star, TrendingUp, Play, ChevronRight } from 'lucide-react';

const C = {
  bg:"#0a0f1a",card:"#111827",accent:"#32E0C4",gold:"#F59E0B",
  text:"#e2e8f0",muted:"#94a3b8",border:"#1e293b",danger:"#EF4444",
  primary:"#0D7377",success:"#10B981",dimmed:"#64748b",secondary:"#14A3C7",
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

const DOCS = [
  {label:"Fiches Memo (PDF)",href:"/docs/memos/CodeQuest_Memos_Etudiants_M00-M14.pdf",icon:BookOpen,color:C.gold},
  {label:"Exercices POO/UML",href:"/docs/poo-uml/POO_UML_Exercices_Enonces.docx",icon:FileText,color:C.accent},
  {label:"Exercices Heritage",href:"/docs/poo-uml/POO_Heritage_Exercices_Enonces.docx",icon:FileText,color:C.primary},
  {label:"Sujet Examen GameZone",href:"/docs/examen/Examen_Unit1_GameZone_Sujet.docx",icon:FileText,color:C.danger},
];

const JAVA_FILES = [
  {mod:"M01",file:"Distributeur.java"},{mod:"M02",file:"LaboStats.java"},
  {mod:"M03",file:"Invention.java"},{mod:"M04",file:"GestionInventeurs.java"},
  {mod:"M05",file:"TestHeritage.java"},{mod:"M07",file:"CatalogueInsecure.java"},
  {mod:"M09",file:"CatalogueBuggy.java"},{mod:"M10",file:"GestionInventions_SALE.java"},
  {mod:"M12",file:"CatalogueFichiers.java"},{mod:"M13",file:"LaboJDBC.java"},
  {mod:"M14",file:"LaboGUI.java"},
];

export default function StudentHome({ onOpenModule }) {
  const { student } = useAuth();

  // Read progress from localStorage
  const moduleProgress = MODULES_ORDER.map(code => {
    const key = "cq-" + code.toLowerCase() + "-unified";
    try {
      const d = JSON.parse(localStorage.getItem(key));
      if (!d) return { code, started: false, done: false, credits: 0, steps: 0 };
      const steps = Object.keys(d.c || {}).length;
      return { code, started: true, done: steps >= 5, credits: d.cr || 0, steps };
    } catch { return { code, started: false, done: false, credits: 0, steps: 0 }; }
  });

  const totalCredits = moduleProgress.reduce((a, m) => a + m.credits, 0);
  const modulesCompleted = moduleProgress.filter(m => m.done).length;
  const modulesStarted = moduleProgress.filter(m => m.started).length;
  const currentLevel = getLevel(totalCredits);
  const nextLevel = getNextLevel(totalCredits);
  const levelIdx = getLevelIndex(totalCredits);
  const xpPct = nextLevel ? Math.min(100, Math.round(((totalCredits - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100)) : 100;

  // Find next module to continue
  const nextModule = moduleProgress.find(m => m.started && !m.done) || moduleProgress.find(m => !m.started);

  return (
    <div style={{ padding: "16px 20px", maxWidth: 900, margin: "0 auto" }}>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}
        @keyframes glow{0%,100%{box-shadow:0 0 15px ${currentLevel.color}30}50%{box-shadow:0 0 30px ${currentLevel.color}60}}
        @keyframes shimmer{0%{background-position:-200px 0}100%{background-position:200px 0}}
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
            {student?.role === 'teacher' ? "PROF" : ("Nv" + (levelIdx + 1))}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>
            {"Bonjour " + (student?.first_name || "Codeur") + " !"}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: currentLevel.color, marginTop: 2 }}>
            {student?.role === 'teacher' ? "Professeur" : currentLevel.name}
          </div>

          {student?.role !== 'teacher' && (
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

      {/* Quick Stats */}
      <div className="home-card" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16, animationDelay: ".1s" }}>
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
      </div>

      {/* Continue button */}
      {nextModule && (
        <div className="home-card" style={{ animationDelay: ".2s" }}>
          <button onClick={() => onOpenModule(nextModule.code.toLowerCase())} style={{
            width: "100%", padding: "14px 20px", borderRadius: 12,
            border: "1px solid " + C.accent + "40",
            background: "linear-gradient(135deg, " + C.accent + "15, " + C.primary + "15)",
            color: C.accent, cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 16,
          }}>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 10, color: C.muted }}>
                {nextModule.started ? "Continuer" : "Prochain module"}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.accent }}>
                {nextModule.code + " — " + (MODULE_NAMES[nextModule.code] || "")}
              </div>
            </div>
            <Play size={20} color={C.accent} />
          </button>
        </div>
      )}

      {/* Module Progress Grid */}
      <div className="home-card" style={{ background: C.card, borderRadius: 12, padding: 14, border: "1px solid " + C.border, marginBottom: 16, animationDelay: ".3s" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 10 }}>Progression</div>
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

      {/* Documents Section */}
      <div className="home-card" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16, animationDelay: ".4s" }}>
        {/* Cours & Memos */}
        <div style={{ background: C.card, borderRadius: 12, padding: 14, border: "1px solid " + C.border }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.gold, marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
            <BookOpen size={14} /> Cours & Memos
          </div>
          {DOCS.map((d, i) => (
            <a key={i} href={d.href} download style={{
              display: "flex", alignItems: "center", gap: 6, padding: "6px 8px",
              borderRadius: 6, marginBottom: 3, textDecoration: "none",
              background: d.color + "08", border: "1px solid " + d.color + "20",
            }}>
              <d.icon size={12} color={d.color} />
              <span style={{ fontSize: 10, color: d.color, fontWeight: 600 }}>{d.label}</span>
            </a>
          ))}
        </div>

        {/* Java Files */}
        <div style={{ background: C.card, borderRadius: 12, padding: 14, border: "1px solid " + C.border }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
            <Coffee size={14} /> Fichiers Java Eclipse
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {JAVA_FILES.map((j, i) => (
              <a key={i} href={"/docs/java/" + j.mod.toLowerCase() + "/" + j.file} download
                title={j.file}
                style={{
                  padding: "4px 8px", borderRadius: 5, textDecoration: "none",
                  background: C.accent + "12", border: "1px solid " + C.accent + "20",
                  fontSize: 9, fontWeight: 600, color: C.accent,
                }}>{j.mod}</a>
            ))}
          </div>
          <div style={{ marginTop: 8, fontSize: 9, color: C.dimmed }}>
            Cliquez pour telecharger le starter Java du module
          </div>
        </div>
      </div>

      {/* Level Progress */}
      {student?.role !== 'teacher' && (
        <div className="home-card" style={{ background: C.card, borderRadius: 12, padding: 14, border: "1px solid " + C.border, animationDelay: ".5s" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 10, display: "flex", alignItems: "center", gap: 5 }}>
            <Trophy size={14} color={C.gold} /> Niveaux
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {LEVELS.map((l, i) => (
              <div key={i} style={{
                padding: "4px 10px", borderRadius: 8,
                background: i <= levelIdx ? l.color + "20" : C.border + "30",
                border: "1px solid " + (i <= levelIdx ? l.color : C.border) + "40",
                fontSize: 9, fontWeight: 600,
                color: i <= levelIdx ? l.color : C.dimmed,
                opacity: i <= levelIdx ? 1 : 0.5,
              }}>
                {l.name + " (" + l.min + ")"}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
