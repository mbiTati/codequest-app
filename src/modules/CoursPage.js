import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthProvider';
import { supabase } from '../lib/supabase';
import { BookOpen, FileText, Coffee, Download, ExternalLink, Code, Upload, Trash2, FolderOpen, Presentation } from 'lucide-react';

const C={bg:"#0a0f1a",card:"#111827",accent:"#32E0C4",gold:"#F59E0B",text:"#e2e8f0",muted:"#94a3b8",border:"#1e293b",danger:"#EF4444",primary:"#0D7377",success:"#10B981",dimmed:"#64748b"};
const BUCKET='cours-documents';

// ============================================
// DOCUMENTS STRUCTURE (like U4 DataQuest)
// ============================================
const PPTX_COURS = [
  { code:"C01", label:"Cours 1 — Algorithmes & Processus", lo:"LO1", file:"/docs/pptx/Cours1_Algorithmes_LO1.pptx" },
  { code:"C02", label:"Cours 2 — Variables, Types & Conditions", lo:"LO2", file:"/docs/pptx/Cours2_Variables_Conditions_LO2.pptx" },
  { code:"C03", label:"Cours 3 — Boucles & Structures", lo:"LO2", file:"/docs/pptx/Cours3_Boucles_Structures_LO2.pptx" },
  { code:"C04", label:"Cours 4 — POO, Heritage & Events", lo:"LO2", file:"/docs/pptx/Cours4_POO_Heritage_Events_LO2.pptx" },
  { code:"C05", label:"Cours 5 — IDE, Securite & Deploy", lo:"LO3", file:"/docs/pptx/Cours5_IDE_Securite_Deploy_LO3.pptx" },
  { code:"C06", label:"Cours 6 — Debugging & Standards", lo:"LO4", file:"/docs/pptx/Cours6_Debugging_Standards_LO4.pptx" },
];

const EXERCICES = [
  { label:"Exercices POO/UML (Enonces)", file:"/docs/poo-uml/POO_UML_Exercices_Enonces.docx" },
  { label:"Exercices Heritage (Enonces)", file:"/docs/poo-uml/POO_Heritage_Exercices_Enonces.docx" },
];

const MEMOS = [
  { label:"Fiches Memo M00-M14 (15 fiches)", file:"/docs/memos/CodeQuest_Memos_Etudiants_M00-M14.pdf" },
];

const CAS_PRO = [
  { label:"Resto Bistro ⭐", desc:"3 classes — debutant", module:"ex-resto" },
  { label:"TechShop Geneve ⭐⭐", desc:"4+ classes — intermediaire", module:"ex-techshop" },
  { label:"Clinique Leman ⭐⭐⭐", desc:"Heritage, ArrayList, try-catch", module:"ex-clinique" },
];

const EXAMEN = [
  { label:"Sujet Examen GameZone", file:"/docs/examen/Examen_Unit1_GameZone_Sujet.docx" },
];

const JAVA_FILES = [
  {mod:"M01",file:"Distributeur.java",desc:"Conditions"},
  {mod:"M02",file:"LaboStats.java",desc:"Boucles"},
  {mod:"M03",file:"Invention.java",desc:"Classes"},
  {mod:"M04",file:"GestionInventeurs.java",desc:"Strings & ArrayList"},
  {mod:"M05",file:"TestHeritage.java",desc:"Heritage"},
  {mod:"M07",file:"CatalogueInsecure.java",desc:"Securite"},
  {mod:"M09",file:"CatalogueBuggy.java",desc:"Debugging"},
  {mod:"M10",file:"GestionInventions_SALE.java",desc:"Standards"},
  {mod:"M12",file:"CatalogueFichiers.java",desc:"Fichiers"},
  {mod:"M13",file:"LaboJDBC.java",desc:"BDD"},
  {mod:"M14",file:"LaboGUI.java",desc:"Swing"},
];

export default function CoursPage({ onOpenExercise }) {
  const { student } = useAuth();
  const isTeacher = student?.role === 'teacher';
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { loadFiles(); }, []);

  async function loadFiles() {
    try { const { data } = await supabase.storage.from(BUCKET).list('unit1', { limit: 50, sortBy: { column: 'created_at', order: 'desc' } }); setUploadedFiles(data || []); } catch (e) { setUploadedFiles([]); }
  }
  async function handleUpload(e) {
    const files = e.target.files; if (!files || !files.length) return; setUploading(true);
    for (const f of files) { await supabase.storage.from(BUCKET).upload('unit1/' + Date.now() + '_' + f.name.replace(/\s+/g, '_'), f); }
    setUploading(false); loadFiles();
  }
  async function deleteFile(name) { if (!window.confirm('Supprimer ?')) return; await supabase.storage.from(BUCKET).remove(['unit1/' + name]); loadFiles(); }
  function fileUrl(name) { return supabase.storage.from(BUCKET).getPublicUrl('unit1/' + name).data?.publicUrl || '#'; }
  function fIcon(n) { if(n.endsWith('.pdf'))return'📄';if(n.endsWith('.docx')||n.endsWith('.doc'))return'📝';if(n.endsWith('.pptx'))return'📊';if(n.endsWith('.java'))return'☕';return'📎'; }

  const Section = ({ title, tag, tagColor, children }) => (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        {tag && <span style={{ padding: "2px 8px", borderRadius: 4, background: tagColor || C.accent, color: "#fff", fontSize: 9, fontWeight: 700, letterSpacing: 1 }}>{tag}</span>}
        <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{title}</span>
      </div>
      {children}
    </div>
  );

  const DocLink = ({ label, href, color, desc }) => (
    <a href={href} download style={{ display: "block", padding: "6px 10px", borderRadius: 6, textDecoration: "none", marginBottom: 3, background: C.card, border: "1px solid " + C.border }}>
      <div style={{ fontSize: 12, color: color || C.accentLight, fontWeight: 600 }}>{"↓ " + label}</div>
      {desc && <div style={{ fontSize: 9, color: C.muted }}>{desc}</div>}
    </a>
  );

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", padding: 20 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.gold, marginBottom: 4 }}>Mes Documents</div>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 16 }}>Cours, exercices, fiches memo, cas professionnels</div>

        {/* Upload section (teacher only) */}
        {isTeacher && (
          <div style={{ background: C.card, borderRadius: 10, padding: 12, border: '1px solid ' + C.gold + '30', marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 14px", borderRadius: 6, background: C.gold + "15", border: "1px solid " + C.gold + "40", color: C.gold, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>
              <Upload size={12} />{uploading ? "Envoi..." : "Televerser"}
              <input type="file" multiple onChange={handleUpload} style={{ display: "none" }} accept=".pdf,.docx,.pptx,.java,.zip,.xlsx" />
            </label>
            <span style={{ fontSize: 9, color: C.dimmed }}>Les fichiers seront visibles par tous les eleves</span>
          </div>
        )}

        {/* GRID like U4 DataQuest */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, alignItems: "start" }}>

          {/* COL 1: Presentations PPTX (PROF ONLY) */}
          {isTeacher && (
          <Section title="Presentations" tag="PPTX" tagColor={C.primary}>
            {PPTX_COURS.map((c, i) => (
              <a key={i} href={c.file} download style={{ display: "block", padding: "6px 10px", borderRadius: 6, textDecoration: "none", marginBottom: 3, background: C.card, border: "1px solid " + C.border }}>
                <div style={{ fontSize: 12, color: C.primary, fontWeight: 600 }}>{"↓ " + c.label}</div>
              </a>
            ))}
          </Section>
          )}

          {/* COL 2: Exercices (visible par tous) */}
          <Section title="Exercices eleves" tag="EXOS" tagColor={C.gold}>
            {EXERCICES.map((ex, i) => <DocLink key={i} label={ex.label} href={ex.file} color={C.gold} />)}
            {isTeacher && EXAMEN.map((ex, i) => <DocLink key={"ex"+i} label={ex.label} href={ex.file} color={C.danger} desc="Examen 3h — prof uniquement" />)}
          </Section>

          {/* COL 3: Memos */}
          <Section title="Fiches PDF" tag="MEMO" tagColor={C.success}>
            {MEMOS.map((m, i) => <DocLink key={i} label={m.label} href={m.file} color={C.success} />)}
          </Section>

          {/* COL 4: Cas pro */}
          <Section title="Cas professionnels" tag="PRO" tagColor={C.danger}>
            {CAS_PRO.map((cp, i) => (
              <div key={i} style={{ padding: "6px 10px", borderRadius: 6, marginBottom: 3, background: C.card, border: "1px solid " + C.border }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{cp.label}</div>
                <div style={{ fontSize: 9, color: C.muted }}>{cp.desc}</div>
                {onOpenExercise && <button onClick={() => onOpenExercise(cp.module)} style={{ marginTop: 3, padding: "2px 8px", borderRadius: 3, border: "none", background: C.danger, color: "#fff", cursor: "pointer", fontSize: 9, fontWeight: 600 }}>Interactif ▶</button>}
              </div>
            ))}
          </Section>

          {/* COL 5: Documents enseignant (teacher only) */}
          {isTeacher && (
            <Section title="Documents enseignant" tag="DOCS" tagColor={C.accent}>
              {uploadedFiles.map((f, i) => {
                const dn = f.name.replace(/^\d+_/, '');
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 4, marginBottom: 2, background: C.card, border: "1px solid " + C.border }}>
                    <span style={{ fontSize: 12 }}>{fIcon(dn)}</span>
                    <span style={{ flex: 1, fontSize: 10, color: C.text }}>{dn}</span>
                    <a href={fileUrl(f.name)} download style={{ color: C.accent, fontSize: 9 }}>↓</a>
                    <button onClick={() => deleteFile(f.name)} style={{ background: "none", border: "none", color: C.danger, cursor: "pointer", fontSize: 10 }}>✕</button>
                  </div>
                );
              })}
              {uploadedFiles.length === 0 && <div style={{ fontSize: 10, color: C.dimmed, padding: 8 }}>Aucun document televerge</div>}
            </Section>
          )}
        </div>

        {/* Java files section (PROF ONLY) */}
        {isTeacher && <div style={{ marginTop: 16 }}>
          <Section title="Fichiers Java Eclipse" tag="JAVA" tagColor="#F97316">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 4 }}>
              {JAVA_FILES.map((j, i) => (
                <a key={i} href={'/docs/java/' + j.mod.toLowerCase() + '/' + j.file} download style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 8px", borderRadius: 6, textDecoration: "none", background: C.card, border: "1px solid " + C.border }}>
                  <span style={{ fontSize: 14 }}>☕</span>
                  <div><div style={{ fontSize: 10, fontWeight: 600, color: "#F97316" }}>{j.mod + " — " + j.file}</div><div style={{ fontSize: 8, color: C.muted }}>{j.desc}</div></div>
                </a>
              ))}
            </div>
          </Section>
        </div>}

        {/* OneCompiler link */}
        <div style={{ marginTop: 8, background: C.card, borderRadius: 8, padding: 10, border: "1px solid " + C.primary + "30", display: "flex", alignItems: "center", gap: 10 }}>
          <Code size={16} color={C.primary} />
          <div style={{ flex: 1 }}><div style={{ fontSize: 11, fontWeight: 600, color: C.primary }}>Editeur Java en ligne</div></div>
          <a href="https://onecompiler.com/java" target="_blank" rel="noopener noreferrer" style={{ padding: "4px 10px", borderRadius: 5, border: "1px solid " + C.primary + "40", background: C.primary + "10", color: C.primary, textDecoration: "none", fontSize: 10, fontWeight: 600 }}><ExternalLink size={10} /> Ouvrir</a>
        </div>
      </div>
    </div>
  );
}
