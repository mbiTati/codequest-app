import { useState } from "react";
import { FileText, Download, Coffee, ChevronRight, FolderOpen, BookOpen } from "lucide-react";

const C = {
  bg: "#0a0f1a", card: "#111827", accent: "#32E0C4", gold: "#F59E0B",
  text: "#e2e8f0", muted: "#94a3b8", dimmed: "#64748b", border: "#1e293b",
  primary: "#0D7377", success: "#10B981",
};

const JAVA_FILES = {
  m01: { starter: "Distributeur.java", folder: "m01" },
  m02: { starter: "LaboStats.java", folder: "m02" },
  m03: { starter: "Invention.java", folder: "m03" },
  m04: { starter: "GestionInventeurs.java", folder: "m04" },
  m05: { starter: "TestHeritage.java", folder: "m05" },
  m07: { starter: "CatalogueInsecure.java", folder: "m07" },
  m09: { starter: "CatalogueBuggy.java", folder: "m09" },
  m10: { starter: "GestionInventions_SALE.java", folder: "m10" },
  m12: { starter: "CatalogueFichiers.java", folder: "m12" },
  m13: { starter: "LaboJDBC.java", folder: "m13" },
  m14: { starter: "LaboGUI.java", folder: "m14" },
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
      cursor: "pointer",
    }}>
      <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>{label}
    </a>
  );
}

export function ResourcesBar({ moduleId }) {
  const [open, setOpen] = useState(false);
  const java = JAVA_FILES[moduleId];

  return (
    <div style={{
      background: C.card, borderTop: "1px solid " + C.border,
      padding: open ? "10px 16px" : "6px 16px",
    }}>
      <button onClick={() => setOpen(!open)} style={{
        background: "none", border: "none", color: C.muted,
        cursor: "pointer", fontFamily: "inherit", fontSize: 11,
        display: "flex", alignItems: "center", gap: 6, padding: 0,
      }}>
        <ChevronRight size={10} style={{ transition: "transform .2s", transform: open ? "rotate(90deg)" : "none" }} />
        <FolderOpen size={12} /> Ressources
      </button>

      {open && (
        <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
          <Btn href="/docs/memos/CodeQuest_Memos_Etudiants_M00-M14.pdf" icon={<BookOpen size={12}/>} label="Fiches Memo (PDF)" color={C.gold} />
          {java && (
            <Btn href={"/docs/java/" + java.folder + "/" + java.starter} icon={<Coffee size={12}/>} label={java.starter} color={C.accent} />
          )}
        </div>
      )}
    </div>
  );
}

export function PortalResources() {
  return (
    <div style={{
      background: C.card, borderRadius: 12, padding: 16,
      border: "1px solid " + C.border, margin: "12px 0",
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
        <FolderOpen size={16} /> Documents
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div style={{ background: C.gold + "10", borderRadius: 8, padding: 10, border: "1px solid " + C.gold + "30" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.gold, marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
            <BookOpen size={12} /> Fiches Memo
          </div>
          <Btn href="/docs/memos/CodeQuest_Memos_Etudiants_M00-M14.pdf" icon={<FileText size={12}/>} label="15 fiches PDF" color={C.gold} />
        </div>

        <div style={{ background: C.accent + "08", borderRadius: 8, padding: 10, border: "1px solid " + C.accent + "20" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.accent, marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
            <Coffee size={12} /> Fichiers Java Eclipse
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
      </div>
    </div>
  );
}
