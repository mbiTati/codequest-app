import React, { useState, useEffect } from 'react';

// Import all unified modules
import M01 from './modules/M01_Unified_Conditions';
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

// Import standalone visual games
import GameBubbleSort from './modules/Game_BubbleSort';
import GameSnakeLoops from './modules/Game_SnakeLoops';
import GameOOPFactory from './modules/Game_OOPFactory';
import GameBottleFill from './modules/Game_BottleFill';
import GameMaze from './modules/Game_MazeConditions';

const C = {
  bg: "#0a0f1a", card: "#111827", primary: "#0D7377", secondary: "#14A3C7",
  accent: "#32E0C4", gold: "#F59E0B", text: "#e2e8f0", muted: "#94a3b8",
  dimmed: "#64748b", border: "#1e293b", success: "#10B981", danger: "#EF4444",
};

const MODULES = [
  { id: "m01", title: "M01 — Conditions", desc: "if/else, switch, &&, ||", phase: 1, component: M01, ready: true },
  { id: "m02", title: "M02 — Boucles", desc: "for, while, break, continue", phase: 1, component: M02, ready: true },
  { id: "m03", title: "M03 — POO", desc: "Classes, constructeur, getter/setter", phase: 1, component: M03, ready: true },
  { id: "m04", title: "M04 — Data", desc: "String, ArrayList, CRUD", phase: 1, component: M04, ready: true },
  { id: "m05", title: "M05 — Héritage", desc: "extends, super, protected, polymorphisme", phase: 2, component: M05, ready: true },
  { id: "m06", title: "M06 — Projet Git", desc: "Git, sprints, code reviews", phase: 2, component: M06, ready: true },
  { id: "m07", title: "M07 — Sécurité", desc: "Validation, exceptions, null", phase: 2, component: M07, ready: true },
  { id: "m08", title: "M08 — Build & Deploy", desc: "JAR, GitHub release", phase: 2, component: M08, ready: true },
  { id: "m09", title: "M09 — Debugging", desc: "Breakpoints, watch, tracing", phase: 3, component: M09, ready: true },
  { id: "m10", title: "M10 — Standards", desc: "Conventions, Javadoc", phase: 3, component: M10, ready: true },
  { id: "m11", title: "M11 — Escape Room", desc: "Chasse aux bugs", phase: 3, component: M11, ready: true },
  { id: "m12", title: "M12 — Fichiers & Crypto", desc: "SHA, lecture/écriture", phase: 3, component: M12, ready: true },
  { id: "m13", title: "M13 — Base de données", desc: "JDBC, MySQL, CSV", phase: 3, component: M13, ready: true },
];

const PHASES = [
  { id: 1, title: "Phase 1 — Rattrapage", subtitle: "Les fondamentaux Java", color: C.accent },
  { id: 2, title: "Phase 2 — LO3 Implémentation", subtitle: "Construire un vrai projet", color: "#7C3AED" },
  { id: 3, title: "Phase 3 — LO4 Debugging", subtitle: "Qualité et standards", color: C.danger },
];

const GAMES = [
  { id: "g-bottle", title: "La Potion de Vérité", desc: "Remplissez la bouteille en évaluant les conditions — erreurs = elle se vide !", icon: "🧪", component: GameBottleFill, module: "M01" },
  { id: "g-maze", title: "Le Labyrinthe des Conditions", desc: "Traversez le labyrinthe en choisissant le bon chemin (true/false)", icon: "🏰", component: GameMaze, module: "M01" },
  { id: "g-bubble", title: "Bubble Sort", desc: "Triez les nombres en les échangeant — visualisez l'algorithme", icon: "🫧", component: GameBubbleSort, module: "M02" },
  { id: "g-snake", title: "Le Serpent des Boucles", desc: "Réglez les paramètres de la boucle, prédisez la longueur du serpent", icon: "🐍", component: GameSnakeLoops, module: "M02" },
  { id: "g-factory", title: "L'Usine à Objets", desc: "Assemblez une classe Java pièce par pièce dans l'usine", icon: "🏭", component: GameOOPFactory, module: "M03" },
];

// Simple localStorage wrapper (replaces window.storage for web deployment)
if (!window.storage) {
  window.storage = {
    async get(key) {
      const val = localStorage.getItem(key);
      return val ? { key, value: val } : null;
    },
    async set(key, value) {
      localStorage.setItem(key, value);
      return { key, value };
    },
    async delete(key) {
      localStorage.removeItem(key);
      return { key, deleted: true };
    },
  };
}

// Make sendPrompt a no-op on web (it's a Claude artifact feature)
if (!window.sendPrompt) {
  window.sendPrompt = () => {};
}

function Portal({ onSelectModule }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}>
      <div style={{ padding: "24px 20px 16px", textAlign: "center", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: C.dimmed, marginBottom: 4 }}>BTEC HND UNIT 1 · PROGRAMMING</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.accent }}>CODEQUEST</div>
        <div style={{ fontSize: 14, color: C.muted, marginTop: 4 }}>Le Labo de l'Inventeur — LO3 & LO4</div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px 16px" }}>
        {/* How to */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.gold, letterSpacing: 1, marginBottom: 10 }}>COMMENT ÇA MARCHE ?</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8 }}>
            {[
              { t: "1. Choisissez un module", d: "Cliquez sur un module ci-dessous pour commencer." },
              { t: "2. Suivez les étapes", d: "Théorie → Quiz → Jeu → Code guidé → Exercice → Correction." },
              { t: "3. Codez dans Eclipse", d: "Quand indiqué, ouvrez Eclipse et tapez le code (pas de copier-coller !)." },
              { t: "4. Exercice seul", d: "Faites l'exercice AVANT la correction. Testez avec les cas fournis." },
              { t: "5. Débloquez le mémo", d: "Terminez tout pour débloquer la fiche récapitulative." },
              { t: "6. Soumettez", d: "Envoyez votre code à l'enseignant ou poussez sur GitHub." },
            ].map((h, i) => (
              <div key={i} style={{ background: C.card, borderRadius: 10, padding: "10px 12px", border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 4 }}>{h.t}</div>
                <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{h.d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Prérequis */}
        <div style={{ background: C.primary + "15", borderRadius: 10, padding: "10px 14px", border: `1px solid ${C.primary}40`, marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, marginBottom: 4 }}>PRÉREQUIS</div>
          <div style={{ fontSize: 12, color: C.text }}>
            <strong>JDK 17+</strong> (adoptium.net) · <strong>Eclipse IDE</strong> for Java Developers (eclipse.org)
          </div>
        </div>

        {/* Modules by phase */}
        {PHASES.map(phase => (
          <div key={phase.id} style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 4, height: 24, borderRadius: 2, background: phase.color }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: phase.color }}>{phase.title}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{phase.subtitle}</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingLeft: 14 }}>
              {MODULES.filter(m => m.phase === phase.id).map(mod => (
                <div key={mod.id}
                  onClick={() => mod.ready && onSelectModule(mod.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 14px", borderRadius: 10,
                    background: C.card, border: `1px solid ${mod.ready ? phase.color + "30" : C.border}`,
                    cursor: mod.ready ? "pointer" : "default",
                    opacity: mod.ready ? 1 : 0.4,
                    transition: "all .2s",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: mod.ready ? C.text : C.dimmed }}>{mod.title}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{mod.desc}</div>
                  </div>
                  {mod.ready ? (
                    <span style={{
                      padding: "5px 14px", borderRadius: 7, background: phase.color,
                      color: C.bg, fontSize: 11, fontWeight: 700,
                    }}>Lancer</span>
                  ) : (
                    <span style={{ fontSize: 10, color: C.dimmed, padding: "4px 10px", borderRadius: 10, background: C.border }}>Bientôt</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* ARCADE */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 4, height: 24, borderRadius: 2, background: C.gold }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.gold }}>Arcade — Mini-Jeux</div>
              <div style={{ fontSize: 11, color: C.muted }}>Apprendre en jouant — accessible à tout moment</div>
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
                <div style={{ fontSize: 24, marginBottom: 6 }}>{game.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{game.title}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{game.desc}</div>
                <div style={{ marginTop: 8, fontSize: 10, color: C.gold, fontWeight: 600 }}>Lié au {game.module}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: "center", padding: "20px 0", borderTop: `1px solid ${C.border}`, marginTop: 16 }}>
          <div style={{ fontSize: 11, color: C.dimmed }}>CodeQuest — Le Labo de l'Inventeur · BTEC HND Unit 1</div>
        </div>
      </div>
    </div>
  );
}

function CohortSelector({ onSelect }) {
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

export default function App() {
  const [currentModule, setCurrentModule] = useState(null);
  const [cohort, setCohort] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("cq-cohort");
    if (saved) setCohort(saved);
  }, []);

  const selectCohort = (c) => {
    setCohort(c);
    localStorage.setItem("cq-cohort", c);
  };

  // Show cohort selector first
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
          padding: "6px 16px", background: C.card, borderBottom: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <button
            onClick={() => setCurrentModule(null)}
            style={{
              padding: "5px 14px", borderRadius: 7, border: `1px solid ${C.border}`,
              background: "transparent", color: C.muted, cursor: "pointer",
              fontFamily: "inherit", fontSize: 12,
            }}
          >
            ← Retour au portail
          </button>
          <span style={{ fontSize: 12, color: game ? C.gold : C.accent, fontWeight: 600 }}>
            {game ? `${activeTitle}` : activeTitle}
          </span>
        </div>
        <ActiveComponent />
      </div>
    );
  }

  return (
    <div>
      <Portal onSelectModule={setCurrentModule} />
      <div style={{ textAlign: "center", padding: "10px 0", background: C.bg, borderTop: `1px solid ${C.border}` }}>
        <button onClick={() => { setCohort(null); localStorage.removeItem("cq-cohort"); }} style={{
          padding: "4px 12px", borderRadius: 5, border: `1px solid ${C.border}`,
          background: "transparent", color: C.dimmed, cursor: "pointer",
          fontFamily: "'Segoe UI',sans-serif", fontSize: 10,
        }}>Changer de cohorte ({cohort === "2025" ? "2025-2026" : "2026-2027"})</button>
      </div>
    </div>
  );
}
