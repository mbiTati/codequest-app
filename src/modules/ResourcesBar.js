import { useState } from "react";

const GITHUB_BASE = "https://github.com/mbiTati/unit1LO3LO4/tree/main";

const C = {
  bg: "#0a0f1a", card: "#111827", accent: "#32E0C4", gold: "#F59E0B",
  text: "#e2e8f0", muted: "#94a3b8", dimmed: "#64748b", border: "#1e293b",
  primary: "#0D7377", success: "#10B981", danger: "#EF4444",
};

// Map module IDs to their Java file paths
const JAVA_FILES = {
  m01: { starter: "Distributeur.java", correction: "Distributeur_CORRECTION.java", folder: "m01" },
  m02: { starter: "LaboStats.java", correction: "LaboStats_CORRECTION.java", folder: "m02" },
  m03: { starter: "Invention.java", correction: "Invention_CORRECTION.java", folder: "m03" },
  m04: { starter: "GestionInventeurs.java", correction: "GestionInventeurs_CORRECTION.java", folder: "m04" },
  m05: { starter: "TestHeritage.java", correction: "TestHeritage_CORRECTION.java", folder: "m05" },
  m07: { starter: "CatalogueInsecure.java", correction: "CatalogueInsecure_CORRECTION.java", folder: "m07" },
  m09: { starter: "CatalogueBuggy.java", correction: "CatalogueBuggy_CORRECTION.java", folder: "m09" },
  m10: { starter: "GestionInventions_SALE.java", correction: "GestionInventions_PROPRE.java", folder: "m10" },
  m12: { starter: "CatalogueFichiers.java", correction: "CatalogueFichiers_CORRECTION.java", folder: "m12" },
  m13: { starter: "LaboJDBC.java", correction: "LaboJDBC_CORRECTION.java", folder: "m13" },
  m14: { starter: "LaboGUI.java", correction: "LaboGUI_CORRECTION.java", folder: "m14" },
};

const GITHUB_PATHS = {
  m01: "phase1-rattrapage/01-basiques-conditions",
  m02: "phase1-rattrapage/02-boucles",
  m03: "phase1-rattrapage/03-oop-fondamentaux",
  m04: "phase1-rattrapage/04-manipulation-data",
  m05: "phase2-LO3/05-heritage",
  m07: "phase2-LO3/07-securite",
  m09: "phase3-LO4/09-debugging",
  m10: "phase3-LO4/10-standards",
  m12: "phase2-LO3/12-fichiers",
  m13: "phase2-LO3/13-bdd",
  m14: "phase2-LO3/14-swing-events",
};

function Btn({ href, icon, label, color = C.accent }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" download style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "5px 10px", borderRadius: 6,
      border: "1px solid " + color + "40",
      background: color + "10", color,
      textDecoration: "none", fontSize: 10, fontWeight: 600,
      fontFamily: "'Segoe UI',system-ui,sans-serif",
      cursor: "pointer", transition: "all .15s",
    }}>
      <span style={{ fontSize: 12 }}>{icon}</span>{label}
    </a>
  );
}

export function ResourcesBar({ moduleId, isTeacher = false }) {
  const [open, setOpen] = useState(false);
  const java = JAVA_FILES[moduleId];
  const ghPath = GITHUB_PATHS[moduleId];
  const hasJava = !!java;

  return (
    <div style={{
      background: C.card, borderTop: "1px solid " + C.border,
      padding: open ? "10px 16px" : "6px 16px",
      transition: "all .2s",
    }}>
      <button onClick={() => setOpen(!open)} style={{
        background: "none", border: "none", color: C.muted,
        cursor: "pointer", fontFamily: "inherit", fontSize: 11,
        display: "flex", alignItems: "center", gap: 6, padding: 0,
      }}>
        <span style={{ fontSize: 8, transition: "transform .2s", transform: open ? "rotate(90deg)" : "none" }}>{"\u25B6"}</span>
        {"\uD83D\uDCC1 Ressources et fichiers"}
      </button>

      {open && (
        <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
          {/* Memos */}
          <Btn href="/docs/memos/CodeQuest_Memos_Etudiants_M00-M14.pdf" icon={"\uD83D\uDCCB"} label="Memo PDF" color={C.gold} />
          <Btn href="/docs/memos/CodeQuest_Memos_Etudiants_M00-M14.docx" icon={"\uD83D\uDCDD"} label="Memo DOCX" color={C.gold} />

          {/* Java files */}
          {hasJava && (
            <>
              <Btn href={"/docs/java/" + java.folder + "/" + java.starter} icon={"\u2615"} label={"Starter " + java.starter} color={C.accent} />
              {isTeacher && (
                <Btn href={"/docs/java/" + java.folder + "/" + java.correction} icon={"\u2705"} label="Correction" color={C.success} />
              )}
            </>
          )}

          {/* GitHub link */}
          {ghPath && (
            <Btn href={GITHUB_BASE + "/" + ghPath} icon={"\uD83D\uDD17"} label="GitHub" color={C.muted} />
          )}

          {/* PPT for teacher */}
          {isTeacher && (
            <>
              <Btn href="/docs/ppt/CodeQuest_PPT_Enseignant_M01-M08.pptx" icon={"\uD83D\uDCCA"} label="PPT M01-M08" color={C.primary} />
              <Btn href="/docs/ppt/CodeQuest_PPT_Enseignant_M09-M14.pptx" icon={"\uD83D\uDCCA"} label="PPT M09-M14" color={C.primary} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function PortalResources({ isTeacher = false }) {
  return (
    <div style={{
      background: C.card, borderRadius: 12, padding: 16,
      border: "1px solid " + C.border, margin: "12px 0",
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 10 }}>
        {"\uD83D\uDCC1 Documents du cours"}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {/* Memos etudiants */}
        <div style={{ background: C.gold + "10", borderRadius: 8, padding: 10, border: "1px solid " + C.gold + "30" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.gold, marginBottom: 6 }}>
            {"\uD83D\uDCCB Fiches Memo Etudiants"}
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <Btn href="/docs/memos/CodeQuest_Memos_Etudiants_M00-M14.pdf" icon={"\uD83D\uDCC4"} label="15 fiches PDF" color={C.gold} />
            <Btn href="/docs/memos/CodeQuest_Memos_Etudiants_M00-M14.docx" icon={"\uD83D\uDCDD"} label="DOCX modifiable" color={C.gold} />
          </div>
        </div>

        {/* PPT enseignant */}
        {isTeacher && (
          <div style={{ background: C.primary + "10", borderRadius: 8, padding: 10, border: "1px solid " + C.primary + "30" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.accent, marginBottom: 6 }}>
              {"\uD83D\uDCCA PPT Enseignant"}
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <Btn href="/docs/ppt/CodeQuest_PPT_Enseignant_M01-M08.pptx" icon={"\uD83D\uDCCA"} label="M01-M08 (25 slides)" color={C.primary} />
              <Btn href="/docs/ppt/CodeQuest_PPT_Enseignant_M09-M14.pptx" icon={"\uD83D\uDCCA"} label="M09-M14 (15 slides)" color={C.primary} />
            </div>
          </div>
        )}

        {/* Java starters */}
        <div style={{ background: C.accent + "08", borderRadius: 8, padding: 10, border: "1px solid " + C.accent + "20", gridColumn: isTeacher ? "auto" : "1 / -1" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.accent, marginBottom: 6 }}>
            {"\u2615 Fichiers Java Eclipse"}
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {Object.entries(JAVA_FILES).map(([mod, files]) => (
              <a key={mod} href={"/docs/java/" + files.folder + "/" + files.starter} download
                style={{
                  padding: "3px 8px", borderRadius: 5,
                  background: C.accent + "15", color: C.accent,
                  fontSize: 9, fontWeight: 600, textDecoration: "none",
                  border: "1px solid " + C.accent + "25",
                }}>
                {mod.toUpperCase()}
              </a>
            ))}
          </div>
        </div>

        {/* Corrections (teacher only) */}
        {isTeacher && (
          <div style={{ background: C.success + "08", borderRadius: 8, padding: 10, border: "1px solid " + C.success + "20" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.success, marginBottom: 6 }}>
              {"\u2705 Corrections Java"}
            </div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {Object.entries(JAVA_FILES).map(([mod, files]) => (
                <a key={mod} href={"/docs/java/" + files.folder + "/" + files.correction} download
                  style={{
                    padding: "3px 8px", borderRadius: 5,
                    background: C.success + "15", color: C.success,
                    fontSize: 9, fontWeight: 600, textDecoration: "none",
                    border: "1px solid " + C.success + "25",
                  }}>
                  {mod.toUpperCase()}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* GitHub repo link */}
      <div style={{ marginTop: 10, textAlign: "center" }}>
        <a href="https://github.com/mbiTati/unit1LO3LO4" target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 10, color: C.muted, textDecoration: "none" }}>
          {"\uD83D\uDD17 Repo GitHub complet : github.com/mbiTati/unit1LO3LO4"}
        </a>
      </div>
    </div>
  );
}
