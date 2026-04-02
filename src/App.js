import React, { useState, useEffect } from 'react';
import { BookOpen, Code, Repeat, Box, Database, GitBranch, Shield, Package, Bug, CheckSquare, Puzzle, FileText, HardDrive, Layout, Zap, Beaker, Map, BarChart3, Gamepad2, Play, ChevronRight, Download, ExternalLink, Coffee, FlaskConical, Settings, Variable, LogOut, BarChart, Trophy, MessageSquare, Star } from 'lucide-react';
import { ThemeProvider, useTheme, ThemeToggle } from './modules/ThemeProvider';
import { AuthProvider, useAuth } from './lib/AuthProvider';
import { initSyncStorage, setupSyncStorage } from './lib/SyncStorage';
import { supabase } from './lib/supabase';
import LoginPage from './modules/LoginPage';
import TeacherDashboard, { TEACHER_EMAILS } from './modules/TeacherDashboard';
import StudentScorePage from './modules/StudentScorePage';
import SettingsPage from './modules/SettingsPage';
import { CommentButton } from './modules/CommentWidget';
import JavaEditor from './modules/JavaEditor';
import StudentHome from './modules/StudentHome';
import { startPresence, updatePresencePage } from './lib/presence';
import QuizLiveHost from './modules/QuizLiveHost';
import QuizLivePlayer from './modules/QuizLivePlayer';

// Import all unified modules
import M01 from './modules/M01_Unified_Conditions';
import M00 from './modules/M00_Unified_Fondamentaux';
import M02 from './modules/M02_Unified_Boucles';
import M03 from './modules/M03_Unified_OOP';
import M04 from './modules/M04_Unified_Data';
import M05 from './modules/M05_Unified_Heritage';
import M06 from './modules/M06_Unified_Projet';
import M07 from './modules/M07_Unified_Securite';
import M08 from './modules/M08_Unified_Build';
import M09 from './modules/M09_Unified_Debugging';
import M10 from './modules/M10_Unified_Standards';
import M11 from './modules/M11_Unified_EscapeRoom';
import M12 from './modules/M12_Unified_Fichiers';
import M13 from './modules/M13_Unified_BDD';
import M14 from './modules/M14_Unified_Swing';
import M15 from './modules/M15_Unified_Variables';

// Import standalone visual games
import GameBubbleSort from './modules/Game_BubbleSort';
import GameSnakeLoops from './modules/Game_SnakeLoops';
import GameOOPFactory from './modules/Game_OOPFactory';
import GameBottleFill from './modules/Game_BottleFill';
import GameMaze from './modules/Game_MazeConditions';
import GameSnakeJava from './modules/Game_SnakeJava';
import GameTetrisOOP from './modules/Game_TetrisOOP';
import GameMemoryCards from './modules/Game_MemoryCards';
import GameTowerDefense from './modules/Game_TowerDefense';
import GameDebuggingRace from './modules/Game_DebuggingRace';
import GameCodeReading from './modules/Game_CodeReading';
import GameUMLBuilder from './modules/Game_UMLBuilder';
import GameCodeRacer from './modules/Game_CodeRacer';
import BlockAnimations from './modules/BlockAnimations';
import CoursPage from './modules/CoursPage';
import GameCodeRunner from './modules/Game_CodeRunner';
import { Game_StackQueue, Game_EventCatcher, Game_CodeCleaner, Game_AlgoToCode, Game_ScopeAnimation, Game_StylePolice } from './modules/Game_NewGames';
import GameCodeStudio from './modules/Game_CodeStudio';
import ExerciseTechShop from './modules/Exercise_TechShop';
import ExerciseRestoBistro from './modules/Exercise_RestoBistro';
import ExerciseClinique from './modules/Exercise_Clinique';
import { ResourcesBar, PortalResources } from './modules/ResourcesBar';

const C = {
  bg: "#0a0f1a", card: "#111827", primary: "#0D7377", secondary: "#14A3C7",
  accent: "#32E0C4", gold: "#F59E0B", text: "#e2e8f0", muted: "#94a3b8",
  dimmed: "#64748b", border: "#1e293b", success: "#10B981", danger: "#EF4444",
};

const MODULES = [
  // LO1 — Algorithmes & Processus
  { id: "m00", title: "M00 — Fondamentaux", desc: "Algorithmes, pipeline, compilation", phase: 0, component: M00, ready: true, Icon: Settings },
  { id: "m08", title: "M08 — Build & Deploy", desc: "JAR, compilation, deploiement", phase: 0, component: M08, ready: true, Icon: Package },
  // LO2 — Paradigmes & Concepts
  { id: "m15", title: "M15 — Variables & Types", desc: "int, double, String, boolean, final, Scanner", phase: 1, component: M15, ready: true, Icon: Variable },
  { id: "m01", title: "M01 — Conditions", desc: "if/else, switch, &&, ||", phase: 1, component: M01, ready: true, Icon: Zap },
  { id: "m02", title: "M02 — Boucles", desc: "for, while, break, continue", phase: 1, component: M02, ready: true, Icon: Repeat },
  { id: "m03", title: "M03 — POO", desc: "Classes, constructeur, getter/setter", phase: 1, component: M03, ready: true, Icon: Box },
  { id: "m04", title: "M04 — Data", desc: "String, ArrayList, structures de donnees", phase: 1, component: M04, ready: true, Icon: Database },
  { id: "m05", title: "M05 — Heritage", desc: "extends, super, protected, polymorphisme", phase: 1, component: M05, ready: true, Icon: GitBranch },
  { id: "m14", title: "M14 — Swing & Events", desc: "Interfaces graphiques, ActionListener", phase: 1, component: M14, ready: true, Icon: Layout },
  // LO3 — Implementation
  { id: "m06", title: "M06 — Projet Git", desc: "Git, sprints, code reviews", phase: 2, component: M06, ready: true, Icon: Code },
  { id: "m07", title: "M07 — Securite", desc: "Validation, exceptions, null", phase: 2, component: M07, ready: true, Icon: Shield },
  { id: "m12", title: "M12 — Fichiers & Crypto", desc: "SHA, lecture/ecriture", phase: 2, component: M12, ready: true, Icon: FileText },
  { id: "m13", title: "M13 — Base de donnees", desc: "JDBC, MySQL, CSV", phase: 2, component: M13, ready: true, Icon: HardDrive },
  // LO4 — Debugging & Standards
  { id: "m09", title: "M09 — Debugging", desc: "Breakpoints, watch, tracing", phase: 3, component: M09, ready: true, Icon: Bug },
  { id: "m10", title: "M10 — Standards", desc: "Conventions, Javadoc", phase: 3, component: M10, ready: true, Icon: CheckSquare },
  { id: "m11", title: "M11 — Escape Room", desc: "Chasse aux bugs", phase: 3, component: M11, ready: true, Icon: Puzzle },
];

const PHASES = [
  { id: 0, title: "LO1 — Algorithmes & Processus", subtitle: "Definir des algorithmes, comprendre le pipeline", color: C.gold, lo: "LO1" },
  { id: 1, title: "LO2 — Paradigmes & Concepts", subtitle: "Procedural, OOP, event-driven, structures de donnees", color: C.accent, lo: "LO2" },
  { id: 2, title: "LO3 — Implementation", subtitle: "Coder avec un IDE, securite, deploiement", color: "#7C3AED", lo: "LO3" },
  { id: 3, title: "LO4 — Debugging & Standards", subtitle: "Debugger, standards de codage, qualite", color: C.danger, lo: "LO4" },
];

const GAMES = [
  { id: "g-studio", title: "CodeQuest Studio", desc: "Programme ton Robot/Chat/Ninja en Java — il prend vie !", Icon: Star, component: GameCodeStudio, module: "Tous" },
  { id: "g-bottle", title: "La Potion de Vérité", desc: "Évaluez les conditions — erreurs = elle se vide !", Icon: FlaskConical, component: GameBottleFill, module: "M01" },
  { id: "g-maze", title: "Le Labyrinthe des Conditions", desc: "Choisissez le bon chemin (true/false)", Icon: Map, component: GameMaze, module: "M01" },
  { id: "g-bubble", title: "Bubble Sort", desc: "Triez les nombres — visualisez l'algorithme", Icon: BarChart3, component: GameBubbleSort, module: "M02" },
  { id: "g-snake", title: "Le Serpent des Boucles", desc: "Prédisez la longueur du serpent", Icon: Repeat, component: GameSnakeLoops, module: "M02" },
  { id: "g-factory", title: "L'Usine à Objets", desc: "Assemblez une classe Java pièce par pièce", Icon: Box, component: GameOOPFactory, module: "M03" },
  { id: "g-snakejava", title: "Snake Java", desc: "Dirigez le serpent, répondez aux questions boucles", Icon: Gamepad2, component: GameSnakeJava, module: "M02" },
  { id: "g-tetris", title: "Tetris OOP", desc: "Chaque pièce = un concept OOP. Quiz toutes les 3 pièces", Icon: Box, component: GameTetrisOOP, module: "M03" },
  { id: "g-memory", title: "Memory Java", desc: "Associez concept et définition en retournant les cartes", Icon: BookOpen, component: GameMemoryCards, module: "Tous" },
  { id: "g-tower", title: "Tower Defense", desc: "Placez des tours (try-catch, validation) contre les bugs", Icon: Shield, component: GameTowerDefense, module: "M07" },
  { id: "g-debug", title: "Debugging Race", desc: "Trouvez les bugs le plus vite possible !", Icon: Bug, component: GameDebuggingRace, module: "M09" },
  { id: "g-reader", title: "Lecture de Code", desc: "Lisez le code, predisez la sortie", Icon: BookOpen, component: GameCodeReading, module: "LO1" },
  { id: "g-uml", title: "UML Builder", desc: "Construisez des diagrammes de classes en glissant", Icon: GitBranch, component: GameUMLBuilder, module: "LO2" },
  { id: "g-racer", title: "Code Racer", desc: "Construis ta voiture en Java, fais-la courir !", Icon: Zap, component: GameCodeRacer, module: "M03/M05" },
  { id: "g-blocks", title: "Block Animations", desc: "Visualisez boucles, conditions, constructeurs en blocs", Icon: Box, component: BlockAnimations, module: "Tous" },
  { id: "g-runner", title: "Code Runner", desc: "Fais courir ton personnage en ecrivant du Java !", Icon: Play, component: GameCodeRunner, module: "Tous" },
  { id: "g-stack", title: "Stack & Queue", desc: "Empiler, depiler — LIFO vs FIFO", Icon: Database, component: Game_StackQueue, module: "LO2" },
  { id: "g-events", title: "Event Catcher", desc: "Cliquez, survolez, tapez — declenchez les evenements Java", Icon: Zap, component: Game_EventCatcher, module: "LO2" },
  { id: "g-cleaner", title: "Code Cleaner", desc: "Nettoyez du code sale en temps limite", Icon: CheckSquare, component: Game_CodeCleaner, module: "LO3" },
  { id: "g-algo", title: "Algo → Code", desc: "Traduisez un flowchart en Java", Icon: GitBranch, component: Game_AlgoToCode, module: "LO1" },
  { id: "g-scope", title: "Scope Animation", desc: "Voyez les variables apparaitre et disparaitre", Icon: Code, component: Game_ScopeAnimation, module: "LO2" },
  { id: "g-style", title: "Style Police", desc: "Trouvez les violations de naming conventions", Icon: Shield, component: Game_StylePolice, module: "LO4" },
  { id: "ex-techshop", title: "TechShop Geneve", desc: "Cas entreprise — Creez un systeme Java complet en 6 etapes", Icon: FileText, component: ExerciseTechShop, module: "LO3" },
  { id: "ex-resto", title: "Resto Bistro ⭐", desc: "Cas debutant — 3 classes pour un bistro lausannois", Icon: FileText, component: ExerciseRestoBistro, module: "LO3" },
  { id: "ex-clinique", title: "Clinique Leman ⭐⭐⭐", desc: "Cas avance — Heritage, ArrayList, try-catch, fichiers", Icon: FileText, component: ExerciseClinique, module: "LO3" },
];

// Setup SyncStorage (localStorage + Supabase sync)
setupSyncStorage();

// Make sendPrompt a no-op on web (it's a Claude artifact feature)
if (!window.sendPrompt) {
  window.sendPrompt = () => {};
}

function Portal({ onSelectModule, isTeacher }) {
  const [portalTab, setPortalTab] = useState("cours"); // cours or activites
  const [locks, setLocks] = useState({});
  const { C } = useTheme();

  // Load locks from Supabase
  useEffect(() => {
    async function loadLocks() {
      try {
        const { data } = await supabase.from('cq_locks').select('*').eq('unit_id', 1);
        const obj = {};
        (data || []).forEach(l => { obj[l.section_key] = l.is_locked; });
        setLocks(obj);
      } catch (e) { /* locks table might not exist yet */ }
    }
    loadLocks();
  }, []);

  function isLocked(key) {
    return !isTeacher && locks[key] === true;
  }

  // Check module completion from localStorage
  function isModuleCompleted(moduleId) {
    try {
      const d = JSON.parse(localStorage.getItem("cq-" + moduleId + "-unified"));
      if (!d) return false;
      const steps = Object.keys(d.c || {}).length;
      return steps >= 3; // 3+ quiz answered = completed
    } catch { return false; }
  }

  // Progressive unlock: module N is unlocked if module N-1 is completed (or first in phase)
  // Teacher always sees everything unlocked
  function isModuleUnlocked(mod, idx) {
    if (isTeacher) return true; // Prof voit tout
    if (locks['progressive_off']) return true; // Prof a desactive le deblocage progressif
    if (idx === 0) return true; // First module always unlocked
    const allMods = MODULES.filter(m => m.ready);
    const globalIdx = allMods.findIndex(m => m.id === mod.id);
    if (globalIdx <= 0) return true;
    return isModuleCompleted(allMods[globalIdx - 1].id);
  }

  function getModuleProgress(moduleId) {
    try {
      const d = JSON.parse(localStorage.getItem("cq-" + moduleId + "-unified"));
      if (!d) return { steps: 0, cr: 0 };
      return { steps: Object.keys(d.c || {}).length, cr: d.cr || 0 };
    } catch { return { steps: 0, cr: 0 }; }
  }

  const allReadyMods = MODULES.filter(m => m.ready);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}>
      <div style={{ padding: "24px 20px 16px", textAlign: "center", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: C.dimmed, marginBottom: 4 }}>BTEC HND UNIT 1 · PROGRAMMING</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.accent }}>CODEQUEST</div>
      </div>

      {/* 2 TABS: Cours / Activites (like U4) */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "12px 16px 0" }}>
        <div style={{ display: "flex", gap: 0, marginBottom: 16, borderRadius: 8, overflow: "hidden", border: "1px solid " + C.border }}>
          <button onClick={() => setPortalTab("cours")} style={{
            flex: 1, padding: "10px", border: "none",
            background: portalTab === "cours" ? C.primary : "transparent",
            color: portalTab === "cours" ? C.text : C.muted,
            cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700,
          }}>📚 Cours</button>
          <button onClick={() => setPortalTab("activites")} style={{
            flex: 1, padding: "10px", border: "none",
            background: portalTab === "activites" ? C.gold : "transparent",
            color: portalTab === "activites" ? C.bg : C.muted,
            cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700,
          }}>🎮 Activites</button>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 16px 20px" }}>

        {/* ==================== TAB: COURS ==================== */}
        {portalTab === "cours" && <>
          {/* Prerequis */}
          <div style={{ background: C.primary + "15", borderRadius: 10, padding: "10px 14px", border: `1px solid ${C.primary}40`, marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, marginBottom: 4 }}>PREREQUIS</div>
            <div style={{ fontSize: 12, color: C.text }}>
              <strong>JDK 17+</strong> (adoptium.net) · <strong>Eclipse IDE</strong> for Java Developers (eclipse.org)
            </div>
          </div>

          {/* Modules by LO with progressive unlock */}
          {PHASES.map(phase => {
            const phaseLockKey = phase.lo ? phase.lo.toLowerCase() : null;
            const phaseLocked = phaseLockKey && isLocked(phaseLockKey);
            return (
            <div key={phase.id} style={{ marginBottom: 20, position: "relative" }}>
              {phaseLocked && (
                <div style={{ position: "absolute", inset: 0, borderRadius: 12, background: "rgba(10,15,26,0.8)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
                  <span style={{ fontSize: 28 }}>🔒</span>
                  <span style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Section bloquee par le prof</span>
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 4, height: 24, borderRadius: 2, background: phaseLocked ? C.dimmed : phase.color }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: phase.color }}>{phase.title}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{phase.subtitle}</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingLeft: 14 }}>
                {MODULES.filter(m => m.phase === phase.id).map((mod, idx) => {
                  const unlocked = isModuleUnlocked(mod, idx);
                  const prog = getModuleProgress(mod.id);
                  const completed = prog.steps >= 5;
                  return (
                    <div key={mod.id}
                      onClick={() => mod.ready && unlocked && onSelectModule(mod.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "12px 14px", borderRadius: 10,
                        background: C.card, border: `1px solid ${completed ? C.success + "40" : unlocked ? phase.color + "30" : C.border}`,
                        cursor: mod.ready && unlocked ? "pointer" : "default",
                        opacity: unlocked ? 1 : 0.4,
                        transition: "all .2s",
                        position: "relative",
                      }}
                    >
                      {/* Lock overlay */}
                      {!unlocked && (
                        <div style={{ position: "absolute", inset: 0, borderRadius: 10, background: "rgba(10,15,26,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
                          <span style={{ fontSize: 16 }}>🔒</span>
                          <span style={{ fontSize: 10, color: C.muted, marginLeft: 4 }}>Completez le module precedent</span>
                        </div>
                      )}
                      {/* Completed check */}
                      {completed && <div style={{ width: 20, height: 20, borderRadius: "50%", background: C.success, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>✓</span>
                      </div>}
                      {!completed && mod.Icon && <mod.Icon size={18} color={unlocked ? phase.color : C.dimmed} strokeWidth={1.5} />}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: unlocked ? C.text : C.dimmed }}>{mod.title}</div>
                        <div style={{ fontSize: 11, color: C.muted }}>{mod.desc}</div>
                        {prog.steps > 0 && unlocked && <div style={{ fontSize: 9, color: C.accent, marginTop: 2 }}>{prog.steps + " etapes · " + prog.cr + " CR"}</div>}
                      </div>
                      {unlocked && !completed ? (
                        <span style={{ padding: "5px 14px", borderRadius: 7, background: phase.color, color: C.bg, fontSize: 11, fontWeight: 700 }}>{prog.steps > 0 ? "Continuer" : "Lancer"}</span>
                      ) : completed ? (
                        <span style={{ padding: "5px 10px", borderRadius: 7, background: C.success + "20", color: C.success, fontSize: 10, fontWeight: 600 }}>Termine ✓</span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          );})}
        </>}

        {/* ==================== TAB: ACTIVITES ==================== */}
        {portalTab === "activites" && <>
          {/* How to */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.gold, letterSpacing: 1, marginBottom: 8 }}>COMMENT CA MARCHE ?</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8 }}>
              {[
                { t: "1. Choisissez un jeu", d: "Cliquez sur un jeu ci-dessous pour commencer." },
                { t: "2. Gagnez des credits", d: "Chaque jeu rapporte des credits R&D pour monter de niveau." },
                { t: "3. Montez de niveau", d: "9 niveaux : Noob Master → Lord Coder !" },
              ].map((h, i) => (
                <div key={i} style={{ background: C.card, borderRadius: 10, padding: "10px 12px", border: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 4 }}>{h.t}</div>
                  <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{h.d}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ARCADE */}
          <div style={{ marginBottom: 20, position: "relative" }}>
            {isLocked('arcade') && (
              <div style={{ position: "absolute", inset: 0, borderRadius: 12, background: "rgba(10,15,26,0.85)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
                <span style={{ fontSize: 32 }}>🔒</span>
                <span style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Arcade bloquee par le prof</span>
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 4, height: 24, borderRadius: 2, background: C.gold }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.gold }}>Arcade — Mini-Jeux</div>
                <div style={{ fontSize: 11, color: C.muted }}>Apprendre en jouant — {GAMES.length} jeux disponibles</div>
              </div>
            </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8, paddingLeft: 14 }}>
            {GAMES.map(game => (
              <div key={game.id}
                onClick={() => onSelectModule(game.id)}
                style={{
                  padding: "14px", borderRadius: 10, background: C.card,
                  border: `1px solid ${C.gold}30`, cursor: "pointer",
                  transition: "all .2s",
                }}
              >
                <div style={{ marginBottom: 6 }}>{game.Icon && <game.Icon size={24} color={C.gold} strokeWidth={1.5} />}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{game.title}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{game.desc}</div>
                <div style={{ marginTop: 8, fontSize: 10, color: C.gold, fontWeight: 600 }}>{"Li\u00e9 au " + game.module}</div>
              </div>
            ))}
          </div>
        </div>
        </>}

        <div style={{ textAlign: "center", padding: "20px 0", borderTop: `1px solid ${C.border}`, marginTop: 16 }}>
          <div style={{ fontSize: 11, color: C.dimmed }}>CodeQuest — Le Labo de l'Inventeur · BTEC HND Unit 1</div>
        </div>
      </div>
    </div>
  );
}

function CohortSelector({ onSelect }) {
  const { C } = useTheme();
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ fontSize: 11, letterSpacing: 4, color: C.dimmed, marginBottom: 8 }}>BTEC HND UNIT 1 · PROGRAMMING</div>
      <div style={{ fontSize: 32, fontWeight: 800, color: C.accent, marginBottom: 4 }}>CODEQUEST</div>
      <div style={{ fontSize: 14, color: C.muted, marginBottom: 32 }}>Le Labo de l'Inventeur</div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", maxWidth: 700 }}>
        <button onClick={() => onSelect("2025")} style={{
          flex: 1, minWidth: 280, padding: "28px 24px", borderRadius: 16,
          border: `2px solid ${C.primary}`, background: C.primary + "12",
          cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "all .2s",
        }}>
          <div style={{ fontSize: 12, letterSpacing: 2, color: C.accent, fontWeight: 600, marginBottom: 4 }}>COHORTE 2025-2026</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>Rattrapage LO3-LO4</div>
          <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.6 }}>
            Vous avez deja vu les bases en cours. Ce parcours couvre les concepts OOP, heritage, securite, debugging et standards pour completer LO3 et LO4.
          </div>
          <div style={{ marginTop: 12, fontSize: 11, color: C.accent }}>13 modules · M01 a M13</div>
        </button>
        <button onClick={() => onSelect("2026")} style={{
          flex: 1, minWidth: 280, padding: "28px 24px", borderRadius: 16,
          border: `2px solid ${C.gold}`, background: C.gold + "08",
          cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "all .2s",
        }}>
          <div style={{ fontSize: 12, letterSpacing: 2, color: C.gold, fontWeight: 600, marginBottom: 4 }}>COHORTE 2026-2027</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>Parcours complet depuis zero</div>
          <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.6 }}>
            Premiere annee HND. Le parcours commence par l'installation d'Eclipse, Hello World, les variables et les types avant d'avancer vers OOP et les projets.
          </div>
          <div style={{ marginTop: 12, fontSize: 11, color: C.gold }}>Parcours LO1 → LO4 complet · Bientot disponible</div>
        </button>
      </div>
      <div style={{ marginTop: 24, fontSize: 10, color: C.dimmed }}>Le choix est sauvegarde. Vous pouvez changer a tout moment depuis le portail.</div>
    </div>
  );
}

function AppInner() {
  const [currentModule, setCurrentModule] = useState(null);
  const [cohort, setCohort] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showScores, setShowScores] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showQuizLive, setShowQuizLive] = useState(null); // null, 'host', 'player'
  const [showCours, setShowCours] = useState(false);
  const { C } = useTheme();
  const { user, student, loading, signOut } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem("cq-cohort");
    if (saved) setCohort(saved);
  }, []);

  // Init Supabase sync + presence when student is loaded
  useEffect(() => {
    if (student?.id) {
      initSyncStorage(student.id);
      startPresence(student.id);
    }
  }, [student]);

  const selectCohort = (c) => {
    setCohort(c);
    localStorage.setItem("cq-cohort", c);
  };

  // Loading
  if (loading) {
    return <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, fontFamily: "'Segoe UI',sans-serif" }}>Chargement...</div>;
  }

  // Not logged in
  if (!user) {
    return <LoginPage />;
  }

  // Teacher dashboard
  const isTeacher = student?.role === 'teacher' || (user && TEACHER_EMAILS.includes(user.email?.toLowerCase()));
  if (showDashboard && isTeacher) {
    return (
      <div>
        <div style={{ padding: "6px 16px", background: C.card, borderBottom: "1px solid " + C.border, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => setShowDashboard(false)} style={{ padding: "5px 14px", borderRadius: 7, border: "1px solid " + C.border, background: "transparent", color: C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 12 }}>{"\u2190 Retour au portail"}</button>
          <span style={{ fontSize: 12, color: C.gold, fontWeight: 600 }}>Dashboard Enseignant</span>
        </div>
        <TeacherDashboard />
      </div>
    );
  }

  // Student Scores page
  if (showScores) {
    return (
      <div>
        <div style={{ padding: "6px 16px", background: C.card, borderBottom: "1px solid " + C.border, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => setShowScores(false)} style={{ padding: "5px 14px", borderRadius: 7, border: "1px solid " + C.border, background: "transparent", color: C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 12 }}>{"\u2190 Retour au portail"}</button>
          <span style={{ fontSize: 12, color: C.gold, fontWeight: 600 }}>Mon Profil</span>
        </div>
        <StudentScorePage />
      </div>
    );
  }

  // Settings page
  if (showSettings) {
    return (
      <div>
        <div style={{ padding: "6px 16px", background: C.card, borderBottom: "1px solid " + C.border, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => setShowSettings(false)} style={{ padding: "5px 14px", borderRadius: 7, border: "1px solid " + C.border, background: "transparent", color: C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 12 }}>{"\u2190 Retour au portail"}</button>
          <span style={{ fontSize: 12, color: C.accent, fontWeight: 600 }}>Parametres</span>
        </div>
        <SettingsPage />
      </div>
    );
  }

  // Comments page
  if (showComments) {
    return (
      <div>
        <div style={{ padding: "6px 16px", background: C.card, borderBottom: "1px solid " + C.border, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => setShowComments(false)} style={{ padding: "5px 14px", borderRadius: 7, border: "1px solid " + C.border, background: "transparent", color: C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 12 }}>{"\u2190 Retour au portail"}</button>
          <span style={{ fontSize: 12, color: C.accent, fontWeight: 600 }}>Commentaires</span>
        </div>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: 20 }}>
          <CommentButton />
        </div>
      </div>
    );
  }

  // Quiz Live
  if (showQuizLive) {
    return (
      <div>
        <div style={{ padding: "6px 16px", background: C.card, borderBottom: "1px solid " + C.border, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => setShowQuizLive(null)} style={{ padding: "5px 14px", borderRadius: 7, border: "1px solid " + C.border, background: "transparent", color: C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 12 }}>{"\u2190 Retour au portail"}</button>
          <span style={{ fontSize: 12, color: C.gold, fontWeight: 600 }}>Quiz Live</span>
        </div>
        {showQuizLive === 'host' ? <QuizLiveHost /> : <QuizLivePlayer />}
      </div>
    );
  }

  // Cours page
  if (showCours) {
    return (
      <div>
        <div style={{ padding: "6px 16px", background: C.card, borderBottom: "1px solid " + C.border, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => setShowCours(false)} style={{ padding: "5px 14px", borderRadius: 7, border: "1px solid " + C.border, background: "transparent", color: C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 12 }}>{"\u2190 Retour au portail"}</button>
          <span style={{ fontSize: 12, color: C.gold, fontWeight: 600 }}>Cours & Documents</span>
        </div>
        <CoursPage />
      </div>
    );
  }

  // Cohort selector
  if (!cohort) {
    return <CohortSelector onSelect={selectCohort} />;
  }

  const mod = MODULES.find(m => m.id === currentModule);
  const game = GAMES.find(g => g.id === currentModule);
  const ActiveComponent = mod?.component || game?.component;
  const activeTitle = mod?.title || game?.title;

  if (ActiveComponent) {
    return (
      <div>
        <div style={{
          padding: "6px 16px", background: C.card, borderBottom: "1px solid " + C.border,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <button onClick={() => setCurrentModule(null)} style={{
            padding: "5px 14px", borderRadius: 7, border: "1px solid " + C.border,
            background: "transparent", color: C.muted, cursor: "pointer",
            fontFamily: "inherit", fontSize: 12,
          }}>{"\u2190 Retour au portail"}</button>
          <span style={{ fontSize: 12, color: game ? C.gold : C.accent, fontWeight: 600 }}>{activeTitle}</span>
          {mod && <CommentButton moduleCode={mod.id} />}
        </div>
        <ActiveComponent />
        {mod && <JavaEditor moduleId={mod.id} />}
        {mod && <ResourcesBar moduleId={mod.id} />}
      </div>
    );
  }

  return (
    <div>
      {/* User bar */}
      <div style={{ padding: "6px 16px", background: C.card, borderBottom: "1px solid " + C.border, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, color: C.muted }}>
          {student ? student.first_name + " " + student.last_name : user.email}
          {student && <span style={{ marginLeft: 6, padding: "1px 6px", borderRadius: 4, background: C.primary + "20", color: C.accent, fontSize: 9 }}>{student.cohort}</span>}
        </span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => setShowScores(true)} style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "4px 10px", borderRadius: 5, border: "1px solid " + C.accent + "40",
            background: C.accent + "10", color: C.accent, cursor: "pointer",
            fontFamily: "inherit", fontSize: 10, fontWeight: 600,
          }}><Trophy size={12} /> Mon Profil</button>
          <button onClick={() => setShowComments(true)} style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "4px 10px", borderRadius: 5, border: "1px solid " + C.gold + "40",
            background: C.gold + "10", color: C.gold, cursor: "pointer",
            fontFamily: "inherit", fontSize: 10, fontWeight: 600,
          }}><MessageSquare size={12} /> Aide</button>
          <button onClick={() => setShowCours(true)} style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "4px 10px", borderRadius: 5, border: "1px solid " + C.primary + "40",
            background: C.primary + "10", color: C.primary, cursor: "pointer",
            fontFamily: "inherit", fontSize: 10, fontWeight: 600,
          }}><BookOpen size={12} /> Cours</button>
          <button onClick={() => setShowQuizLive(isTeacher ? 'host' : 'player')} style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "4px 10px", borderRadius: 5, border: "1px solid " + C.danger + "40",
            background: C.danger + "10", color: C.danger, cursor: "pointer",
            fontFamily: "inherit", fontSize: 10, fontWeight: 600,
          }}><Zap size={12} /> {isTeacher ? "Quiz Live" : "Rejoindre"}</button>
          <button onClick={() => setShowSettings(true)} style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "4px 10px", borderRadius: 5, border: "1px solid " + C.border,
            background: "transparent", color: C.muted, cursor: "pointer",
            fontFamily: "inherit", fontSize: 10,
          }}><Settings size={12} /></button>
          {isTeacher && (
            <button onClick={() => setShowDashboard(true)} style={{
              display: "flex", alignItems: "center", gap: 4,
              padding: "4px 10px", borderRadius: 5, border: "1px solid " + C.gold + "40",
              background: C.gold + "10", color: C.gold, cursor: "pointer",
              fontFamily: "inherit", fontSize: 10, fontWeight: 600,
            }}><BarChart size={12} /> Dashboard</button>
          )}
          <button onClick={signOut} style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "4px 10px", borderRadius: 5, border: "1px solid " + C.border,
            background: "transparent", color: C.dimmed, cursor: "pointer",
            fontFamily: "inherit", fontSize: 10,
          }}><LogOut size={12} /> Deconnexion</button>
        </div>
      </div>

      <StudentHome onOpenModule={(id) => setCurrentModule(id)} onOpenCours={() => setShowCours(true)} />
      <Portal onSelectModule={setCurrentModule} isTeacher={isTeacher} />
      <div style={{ textAlign: "center", padding: "10px 0", background: C.bg, borderTop: "1px solid " + C.border, display: "flex", justifyContent: "center", gap: 12 }}>
        <button onClick={() => { setCohort(null); localStorage.removeItem("cq-cohort"); }} style={{
          padding: "4px 12px", borderRadius: 5, border: "1px solid " + C.border,
          background: "transparent", color: C.dimmed, cursor: "pointer",
          fontFamily: "'Segoe UI',sans-serif", fontSize: 10,
        }}>{"Changer de cohorte (" + (cohort === "2025" ? "2025-2026" : "2026-2027") + ")"}</button>
        <ThemeToggle />
      </div>
    </div>
  );
}

export default function App() {
  return <ThemeProvider><AuthProvider><AppInner /></AuthProvider></ThemeProvider>;
}
