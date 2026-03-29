import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthProvider';
import { supabase } from '../lib/supabase';
import { BookOpen, FileText, Coffee, Download, ExternalLink, Code, Upload, Trash2, File, FolderOpen } from 'lucide-react';

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

const BUCKET = 'cours-documents';

export default function CoursPage() {
  const { student } = useAuth();
  const isTeacher = student?.role === 'teacher';
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState(null);

  useEffect(() => { loadUploadedFiles(); }, []);

  async function loadUploadedFiles() {
    try {
      const { data } = await supabase.storage.from(BUCKET).list('unit1', { limit: 50, sortBy: { column: 'created_at', order: 'desc' } });
      setUploadedFiles(data || []);
    } catch (e) {
      // Bucket might not exist yet
      setUploadedFiles([]);
    }
  }

  async function handleUpload(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true); setUploadMsg(null);

    for (const file of files) {
      const path = 'unit1/' + Date.now() + '_' + file.name.replace(/\s+/g, '_');
      const { error } = await supabase.storage.from(BUCKET).upload(path, file);
      if (error) {
        setUploadMsg({ type: 'error', text: 'Erreur : ' + error.message });
      }
    }
    setUploadMsg({ type: 'success', text: files.length + ' fichier(s) televerses !' });
    setUploading(false);
    loadUploadedFiles();
  }

  async function deleteFile(name) {
    if (!window.confirm('Supprimer ' + name + ' ?')) return;
    await supabase.storage.from(BUCKET).remove(['unit1/' + name]);
    loadUploadedFiles();
  }

  function getFileUrl(name) {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl('unit1/' + name);
    return data?.publicUrl || '#';
  }

  function fileIcon(name) {
    if (name.endsWith('.pdf')) return '📄';
    if (name.endsWith('.docx') || name.endsWith('.doc')) return '📝';
    if (name.endsWith('.pptx') || name.endsWith('.ppt')) return '📊';
    if (name.endsWith('.java')) return '☕';
    if (name.endsWith('.zip')) return '📦';
    return '📎';
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", padding: 20 }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.gold, marginBottom: 4 }}>Cours & Documents</div>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 20 }}>Supports de cours, exercices, fichiers Java et documents telechargeables</div>

        {/* TEACHER: Upload section */}
        {isTeacher && (
          <div style={{ background: C.card, borderRadius: 12, padding: 16, border: '1px solid ' + C.gold + '30', marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.gold, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Upload size={16} /> Televerser des documents (prof)
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <label style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8,
                background: C.gold + '15', border: '1px solid ' + C.gold + '40', color: C.gold,
                cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
              }}>
                <Upload size={14} /> {uploading ? 'Envoi...' : 'Choisir des fichiers'}
                <input type="file" multiple onChange={handleUpload} style={{ display: 'none' }} accept=".pdf,.docx,.doc,.pptx,.ppt,.java,.zip,.txt,.md" />
              </label>
              <span style={{ fontSize: 10, color: C.dimmed }}>PDF, DOCX, PPTX, Java, ZIP</span>
            </div>
            {uploadMsg && (
              <div style={{ fontSize: 11, color: uploadMsg.type === 'success' ? C.success : C.danger, marginBottom: 6 }}>{uploadMsg.text}</div>
            )}
            <div style={{ fontSize: 10, color: C.dimmed }}>Les fichiers telecharges seront visibles par tous les eleves.</div>
          </div>
        )}

        {/* Uploaded files (visible to all) */}
        {uploadedFiles.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <FolderOpen size={16} color={C.accent} /> Documents telecharges par le prof
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              {uploadedFiles.map((f, i) => {
                const displayName = f.name.replace(/^\d+_/, '');
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
                    borderRadius: 8, background: C.card, border: '1px solid ' + C.border,
                  }}>
                    <span style={{ fontSize: 18 }}>{fileIcon(displayName)}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{displayName}</div>
                      <div style={{ fontSize: 9, color: C.dimmed }}>{(f.metadata?.size ? Math.round(f.metadata.size / 1024) + ' KB' : '')}</div>
                    </div>
                    <a href={getFileUrl(f.name)} download style={{
                      padding: '4px 10px', borderRadius: 5, border: '1px solid ' + C.accent + '30',
                      background: C.accent + '10', color: C.accent, textDecoration: 'none',
                      fontSize: 10, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3,
                    }}><Download size={10} /> Telecharger</a>
                    {isTeacher && (
                      <button onClick={() => deleteFile(f.name)} style={{
                        padding: '4px 8px', borderRadius: 5, border: '1px solid ' + C.danger + '30',
                        background: 'transparent', color: C.danger, cursor: 'pointer', fontSize: 10,
                      }}><Trash2 size={10} /></button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Static document sections */}
        {DOCS.map((section, si) => (
          <div key={si} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <BookOpen size={16} color={C.gold} /> {section.section}
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              {section.items.map((d, i) => (
                <a key={i} href={d.href} download style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                  borderRadius: 10, textDecoration: 'none',
                  background: C.card, border: '1px solid ' + d.color + '25',
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: d.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Coffee size={16} color={C.accent} /> Fichiers Java Eclipse
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 6 }}>
            {JAVA_FILES.map((j, i) => (
              <a key={i} href={'/docs/java/' + j.mod.toLowerCase() + '/' + j.file} download style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
                borderRadius: 8, textDecoration: 'none',
                background: C.card, border: '1px solid ' + C.accent + '20',
              }}>
                <div style={{ width: 30, height: 30, borderRadius: 6, background: C.accent + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Code size={14} color={C.accent} />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.accent }}>{j.mod + ' — ' + j.file}</div>
                  <div style={{ fontSize: 9, color: C.dimmed }}>{j.desc}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* OneCompiler link */}
        <div style={{ background: C.card, borderRadius: 10, padding: 14, border: '1px solid ' + C.primary + '30', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Code size={20} color={C.primary} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.primary }}>Editeur Java en ligne</div>
            <div style={{ fontSize: 10, color: C.muted }}>OneCompiler est integre dans chaque module — ou utilisez-le directement</div>
          </div>
          <a href="https://onecompiler.com/java" target="_blank" rel="noopener noreferrer" style={{
            padding: '6px 12px', borderRadius: 6, border: '1px solid ' + C.primary + '40',
            background: C.primary + '15', color: C.primary, textDecoration: 'none',
            fontSize: 10, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4,
          }}><ExternalLink size={10} /> Ouvrir</a>
        </div>
      </div>
    </div>
  );
}
