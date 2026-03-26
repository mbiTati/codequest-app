import { BookOpen, FileText, Coffee, Download, ExternalLink, Code } from 'lucide-react';

const C = {
  bg:"#0a0f1a",card:"#111827",accent:"#32E0C4",gold:"#F59E0B",
  text:"#e2e8f0",muted:"#94a3b8",border:"#1e293b",danger:"#EF4444",
  primary:"#0D7377",success:"#10B981",dimmed:"#64748b",
};

const DOCS = [
  {section:"Fiches Memo",items:[
    {label:"Fiches Memo Etudiants (M00-M14)",href:"/docs/memos/CodeQuest_Memos_Etudiants_M00-M14.pdf",icon:BookOpen,color:C.gold,desc:"15 fiches de revision, 1 par module"},
  ]},
  {section:"Cours POO / UML",items:[
    {label:"Exercices POO/UML (Enonces)",href:"/docs/poo-uml/POO_UML_Exercices_Enonces.docx",icon:FileText,color:C.accent,desc:"6 exercices progressifs"},
    {label:"Exercices Heritage (Enonces)",href:"/docs/poo-uml/POO_Heritage_Exercices_Enonces.docx",icon:FileText,color:C.primary,desc:"3 exercices heritage + UML"},
  ]},
  {section:"Examen",items:[
    {label:"Sujet Examen GameZone",href:"/docs/examen/Examen_Unit1_GameZone_Sujet.docx",icon:FileText,color:C.danger,desc:"Examen 3h — scenario vocational P4-D4"},
  ]},
];

const JAVA_FILES = [
  {mod:"M01",file:"Distributeur.java",desc:"Conditions — if/else/switch"},
  {mod:"M02",file:"LaboStats.java",desc:"Boucles — for/while/do-while"},
  {mod:"M03",file:"Invention.java",desc:"Classes & objets"},
  {mod:"M04",file:"GestionInventeurs.java",desc:"Strings & ArrayList"},
  {mod:"M05",file:"TestHeritage.java",desc:"Heritage & super()"},
  {mod:"M07",file:"CatalogueInsecure.java",desc:"Securite & try-catch"},
  {mod:"M09",file:"CatalogueBuggy.java",desc:"Debugging — bugs a trouver"},
  {mod:"M10",file:"GestionInventions_SALE.java",desc:"Standards — code a nettoyer"},
  {mod:"M12",file:"CatalogueFichiers.java",desc:"Lecture/ecriture fichiers"},
  {mod:"M13",file:"LaboJDBC.java",desc:"Connexion base de donnees"},
  {mod:"M14",file:"LaboGUI.java",desc:"Interface Swing"},
];

export default function CoursPage() {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", padding: 20 }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.gold, marginBottom: 4 }}>Cours & Documents</div>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 20 }}>Tous les supports de cours, exercices et fichiers Java</div>

        {/* Document sections */}
        {DOCS.map((section, si) => (
          <div key={si} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <BookOpen size={16} color={C.gold} /> {section.section}
            </div>
            <div style={{ display: "grid", gap: 6 }}>
              {section.items.map((d, i) => (
                <a key={i} href={d.href} download style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                  borderRadius: 10, textDecoration: "none",
                  background: C.card, border: "1px solid " + d.color + "25",
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: d.color + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <d.icon size={18} color={d.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: d.color }}>{d.label}</div>
                    <div style={{ fontSize: 10, color: C.muted }}>{d.desc}</div>
                  </div>
                  <Download size={14} color={C.dimmed} />
                </a>
              ))}
            </div>
          </div>
        ))}

        {/* Java Files */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
            <Coffee size={16} color={C.accent} /> Fichiers Java Eclipse
          </div>
          <div style={{ fontSize: 10, color: C.muted, marginBottom: 8 }}>Starters pour Eclipse — cliquez pour telecharger</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 6 }}>
            {JAVA_FILES.map((j, i) => (
              <a key={i} href={"/docs/java/" + j.mod.toLowerCase() + "/" + j.file} download style={{
                display: "flex", alignItems: "center", gap: 8, padding: "8px 10px",
                borderRadius: 8, textDecoration: "none",
                background: C.card, border: "1px solid " + C.accent + "20",
              }}>
                <div style={{ width: 30, height: 30, borderRadius: 6, background: C.accent + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Code size={14} color={C.accent} />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.accent }}>{j.mod + " — " + j.file}</div>
                  <div style={{ fontSize: 9, color: C.dimmed }}>{j.desc}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* OneCompiler link */}
        <div style={{ background: C.card, borderRadius: 10, padding: 14, border: "1px solid " + C.primary + "30", display: "flex", alignItems: "center", gap: 12 }}>
          <Code size={20} color={C.primary} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.primary }}>Editeur Java en ligne</div>
            <div style={{ fontSize: 10, color: C.muted }}>OneCompiler est integre dans chaque module — ou utilisez-le directement</div>
          </div>
          <a href="https://onecompiler.com/java" target="_blank" rel="noopener noreferrer" style={{
            padding: "6px 12px", borderRadius: 6, border: "1px solid " + C.primary + "40",
            background: C.primary + "15", color: C.primary, textDecoration: "none",
            fontSize: 10, fontWeight: 600, display: "flex", alignItems: "center", gap: 4,
          }}><ExternalLink size={10} /> Ouvrir</a>
        </div>
      </div>
    </div>
  );
}
