import { useState, useRef } from 'react';
import { useAuth } from '../lib/AuthProvider';
import { supabase } from '../lib/supabase';
import { ChevronLeft, ChevronRight, Upload, Code } from 'lucide-react';

const C={bg:"#0a0f1a",card:"#111827",accent:"#32E0C4",gold:"#F59E0B",text:"#e2e8f0",muted:"#94a3b8",border:"#1e293b",danger:"#EF4444",primary:"#0D7377",success:"#10B981",dimmed:"#64748b",code:"#1E293B",codeTxt:"#67e8f9"};

const SLIDES = [
  { title:"Clinique Leman Sante 🏥", body:`<p style="font-size:14px;line-height:1.8"><strong>Dr. Catherine Muller</strong> dirige une clinique a Montreux avec <strong>3 medecins</strong>, <strong>2 specialistes</strong> et <strong>200 patients</strong>.<br/><br/>La clinique propose des <strong>consultations generales</strong> et des <strong>consultations specialisees</strong> (cardiologie, dermatologie). Les tarifs different selon le type.</p>` },
  { title:"Le probleme 😰", body:`<div style="background:#EF444415;border:1px solid #EF444440;border-radius:8px;padding:12px"><p style="color:#EF4444;font-weight:700;margin-bottom:8px">Problemes :</p><p style="font-size:13px;line-height:1.8">• Les dossiers patients sont sur papier — impossible de chercher rapidement<br/>• Les rendez-vous se chevauchent (2 patients au meme horaire)<br/>• Pas de distinction entre medecin generaliste et specialiste dans le systeme<br/>• Les factures sont calculees a la main avec des erreurs<br/>• Aucune trace des antecedents medicaux<br/>• Les donnees medicales ne sont pas protegees (RGPD)</p></div>` },
  { title:"Besoins 🎯", body:`<div style="background:#10B98115;border:1px solid #10B98140;border-radius:8px;padding:12px"><p style="color:#10B981;font-weight:700;margin-bottom:8px">Ce que Dr. Muller veut :</p><p style="font-size:13px;line-height:2">1. <strong>Gerer les patients</strong> — nom, prenom, date de naissance, numero AVS, allergies<br/>2. <strong>Gerer les medecins</strong> — generalistes ET specialistes (avec leur specialite)<br/>3. <strong>Planifier les consultations</strong> — date, heure, medecin, patient, type<br/>4. <strong>Facturer automatiquement</strong> — selon le type de consultation<br/>5. <strong>Proteger les donnees</strong> — acces securise, validation stricte<br/>6. <strong>Sauvegarder</strong> — exporter les donnees dans un fichier</p></div>` },
  { title:"Regles de la clinique 📋", body:`<div style="background:#F59E0B15;border:1px solid #F59E0B40;border-radius:8px;padding:12px"><p style="color:#F59E0B;font-weight:700;margin-bottom:8px">Regles metier :</p><p style="font-size:13px;line-height:2">• Un <strong>specialiste EST un medecin</strong> avec une specialite en plus (heritage !)<br/>• Tarifs : generaliste = <strong>80 CHF</strong>, cardiologue = <strong>150 CHF</strong>, dermatologue = <strong>120 CHF</strong><br/>• Un medecin ne peut pas avoir <strong>2 consultations en meme temps</strong><br/>• Le numero AVS doit etre <strong>valide</strong> (13 chiffres)<br/>• Les <strong>allergies</strong> sont une liste (un patient peut en avoir plusieurs)<br/>• Les donnees doivent pouvoir etre <strong>sauvegardees dans un fichier</strong> et rechargees<br/>• Tout acces aux donnees medicales doit etre <strong>securise</strong> (try-catch)</p></div>` },
  { title:"Votre mission 🚀", body:`<p style="font-size:14px;line-height:1.8">Creez un systeme Java <strong>avance</strong> en 6 etapes :</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px"><div style="background:#0D737715;border-radius:6px;padding:8px;font-size:12px"><strong>1. Algorithme</strong><br/>Flowchart complet</div><div style="background:#14A3C715;border-radius:6px;padding:8px;font-size:12px"><strong>2. UML avec heritage</strong><br/>Medecin ← Specialiste</div><div style="background:#32E0C415;border-radius:6px;padding:8px;font-size:12px"><strong>3. Pseudo-code</strong><br/>Logique + validation</div><div style="background:#F59E0B15;border-radius:6px;padding:8px;font-size:12px"><strong>4. Code Java avance</strong><br/>Heritage, ArrayList, try-catch</div><div style="background:#7C3AED15;border-radius:6px;padding:8px;font-size:12px"><strong>5. Execution complete</strong><br/>Tests + fichiers</div><div style="background:#EF444415;border-radius:6px;padding:8px;font-size:12px"><strong>6. Tests + Doc</strong><br/>RGPD + Javadoc</div></div><p style="font-size:11px;color:#94a3b8;margin-top:8px">Difficulte : ⭐⭐⭐ Avance — Heritage, ArrayList, try-catch, fichiers</p>` },
  { title:"A vous de jouer ! 💡", body:`<div style="background:#0a0f1a;border:1px solid #1e293b;border-radius:8px;padding:12px"><p style="font-size:13px;line-height:2;color:#67e8f9">❓ Comment modeliser le fait qu'un specialiste EST un medecin ?<br/>❓ Quelle structure pour stocker plusieurs allergies ?<br/>❓ Comment empecher 2 consultations au meme horaire ?<br/>❓ Comment sauvegarder les donnees dans un fichier ?<br/>❓ Comment proteger les donnees sensibles (AVS) ?</p></div>` },
];

const STEPS = [
  { name:"Algorithme complet", icon:"📋", lo:"LO1", type:"upload", accept:".pdf,.png,.jpg,.docx", xp:15,
    instructions:`<strong>Dessinez le flowchart</strong> complet du systeme clinique.<br/><br/>Incluez : gestion patients + medecins + consultations + facturation + sauvegarde fichier.<br/>Montrez les <strong>decisions</strong> (generaliste vs specialiste, horaire libre vs occupe).<br/><br/><strong>Livrable :</strong> Flowchart en PDF ou PNG.` },
  { name:"UML avec heritage", icon:"🔷", lo:"LO2", type:"upload", accept:".pdf,.png,.jpg,.docx", xp:25,
    instructions:`<strong>Diagramme de classes avec HERITAGE</strong>.<br/><br/>La classe <strong>Specialiste</strong> doit <strong>heriter</strong> de Medecin (extends).<br/><br/>Classes attendues : Patient, Medecin, Specialiste (extends Medecin), Consultation, Clinique.<br/><br/>Montrez : attributs, methodes, relations, <strong>fleche d'heritage</strong> (triangle blanc).<br/>Pensez aux <strong>ArrayList</strong> pour les allergies et les consultations.<br/><br/><strong>Livrable :</strong> Diagramme UML.` },
  { name:"Pseudo-code avance", icon:"📝", lo:"LO1", type:"text", xp:15,
    instructions:`<strong>Pseudo-code</strong> pour "planifierConsultation(medecin, patient, date, heure)".<br/><br/>Doit inclure :<br/>• Verification que l'horaire est <strong>libre</strong> (pas de conflit)<br/>• Verification que le patient a un <strong>AVS valide</strong><br/>• Calcul du <strong>tarif</strong> selon le type de medecin (generaliste vs specialiste)<br/>• Gestion des <strong>erreurs</strong> (try-catch en pseudo-code)<br/><br/><code>FONCTION planifierConsultation(med, pat, date, heure)</code><br/><code>&nbsp;&nbsp;SI med.estOccupe(date, heure) ALORS</code><br/><code>&nbsp;&nbsp;&nbsp;&nbsp;LANCER Erreur("Horaire deja pris")</code><br/><code>&nbsp;&nbsp;...</code>` },
  { name:"Code Java avance", icon:"☕", lo:"LO3", type:"java", xp:40,
    instructions:`<strong>Codez le systeme complet</strong> avec :<br/><br/>✅ <strong>Heritage</strong> : class Specialiste extends Medecin<br/>✅ <strong>ArrayList</strong> : pour les allergies, les consultations<br/>✅ <strong>try-catch</strong> : validation AVS, horaire occupe<br/>✅ <strong>Encapsulation</strong> : attributs private + getters/setters<br/>✅ <strong>Polymorphisme</strong> : getTarif() different pour Medecin vs Specialiste<br/>✅ <strong>toString()</strong> sur chaque classe<br/><br/><strong>Bonus :</strong> Sauvegarde/chargement dans un fichier (java.io)`,
    starterCode:`import java.util.ArrayList;

class Patient {
    private String nom, prenom, numeroAVS;
    private ArrayList<String> allergies;
    // TODO: constructeur + validation AVS (13 chiffres)
    // TODO: ajouterAllergie(String allergie)
}

class Medecin {
    private String nom, prenom;
    // TODO: getTarif() retourne 80.0
    // TODO: toString()
}

class Specialiste extends Medecin {
    private String specialite;
    // TODO: constructeur avec super()
    // TODO: getTarif() override — 150 ou 120 selon specialite
}

class Consultation {
    // TODO: medecin, patient, date, heure, tarif
}

class Clinique {
    private ArrayList<Patient> patients;
    private ArrayList<Medecin> medecins;
    private ArrayList<Consultation> consultations;
    // TODO: planifierConsultation() avec verification horaire
    // TODO: calculerCA()
    // BONUS: sauvegarderDansFichier(String nomFichier)
}

public class Main {
    public static void main(String[] args) {
        System.out.println("=== Clinique Leman Sante ===");
        // TODO: creer medecins (generaliste + cardiologue + dermatologue)
        // TODO: creer patients avec allergies
        // TODO: planifier des consultations
        // TODO: tester les cas d'erreur
    }
}` },
  { name:"Execution complete", icon:"▶️", lo:"LO3", type:"java", xp:30,
    instructions:`<strong>Testez avec ces donnees :</strong><br/><br/>Medecins : Dr. Martin (generaliste), Dr. Rossi (cardiologue), Dr. Blanc (dermatologue)<br/>Patients : Sophie Martin (AVS 7561234567890, allergie penicilline), Jean Dupont (AVS 7569876543210)<br/><br/>Consultations : Sophie chez Dr. Rossi le 15/04 a 10h, Jean chez Dr. Martin le 15/04 a 10h<br/>Test conflit : Sophie chez Dr. Rossi le 15/04 a 10h → DOIT echouer (horaire pris)<br/><br/>Calculez le CA total. Testez AVS invalide (12 chiffres → erreur).`,
    starterCode:`// Code complet + tous les tests\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("=== Tests Clinique Leman ===");\n        // Tout tester ici\n    }\n}` },
  { name:"Tests + Documentation", icon:"📄", lo:"LO4", type:"upload", accept:".pdf,.docx", xp:25,
    instructions:`<strong>Partie 1 — Plan de tests</strong> (8 cas minimum) :<br/>• 2 cas normaux (consultation OK, facturation OK)<br/>• 2 cas de validation (AVS invalide, prix negatif)<br/>• 2 cas limites (2 consultations meme horaire, patient sans allergie)<br/>• 1 cas heritage (specialiste.getTarif() vs medecin.getTarif())<br/>• 1 cas fichier (sauvegarde + rechargement)<br/><br/><strong>Partie 2 — Javadoc</strong> : commentaires /** */ sur toutes les classes et methodes.<br/><strong>Partie 3 — RGPD</strong> : comment protegez-vous les donnees sensibles (AVS, allergies) ?<br/><br/><strong>Livrable :</strong> Document PDF ou DOCX.` },
];

export default function ExerciseClinique() {
  const { student } = useAuth();
  const [showSlides, setShowSlides] = useState(true);
  const [slideIdx, setSlideIdx] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepStatus, setStepStatus] = useState(STEPS.map(() => 'pending'));
  const [textInput, setTextInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showOC, setShowOC] = useState(false);
  const [totalXP, setTotalXP] = useState(0);
  const fileRef = useRef(null);
  const step = STEPS[currentStep];

  async function submitStep() {
    if (step.type === 'text' && !textInput.trim()) { setFeedback({ok:false,msg:"Ecrivez d'abord !"}); return; }
    const ns = [...stepStatus]; ns[currentStep] = 'done'; setStepStatus(ns);
    setTotalXP(x => x + step.xp);
    setFeedback({ok:true,msg:`Etape validee ! +${step.xp} XP`});
    try { await supabase.from('cq_game_scores').insert({student_id:student?.id,game_id:'clinique_step_'+currentStep,score:step.xp,duration_seconds:0}); } catch(e){}
    setTimeout(()=>{setFeedback(null);if(currentStep<STEPS.length-1)setCurrentStep(currentStep+1);},1500);
  }
  async function handleFile(e) {
    const f=e.target.files?.[0]; if(!f)return;
    try{await supabase.storage.from('cours-documents').upload(`clinique/${student?.id||'anon'}/${Date.now()}_${f.name.replace(/\s+/g,'_')}`,f);}catch(err){}
    setFeedback({ok:true,msg:`"${f.name}" televerse !`}); submitStep();
  }

  if(showSlides){const sl=SLIDES[slideIdx];return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{maxWidth:600,width:"100%",background:C.card,borderRadius:16,border:"1px solid "+C.border,overflow:"hidden"}}>
        <div style={{padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid "+C.border}}>
          <span style={{fontSize:10,color:C.dimmed}}>{(slideIdx+1)+"/"+SLIDES.length}</span>
          <span style={{fontSize:12,fontWeight:700,color:"#7C3AED"}}>Clinique Leman ⭐⭐⭐</span>
          <button onClick={()=>setShowSlides(false)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:14}}>✕</button>
        </div>
        <div style={{padding:"20px 24px"}}><h2 style={{fontSize:18,fontWeight:800,color:C.accent,marginBottom:12}}>{sl.title}</h2><div dangerouslySetInnerHTML={{__html:sl.body}} style={{color:C.text,lineHeight:1.6}}/></div>
        <div style={{padding:"12px 16px",display:"flex",justifyContent:"space-between",borderTop:"1px solid "+C.border}}>
          <button onClick={()=>setSlideIdx(Math.max(0,slideIdx-1))} disabled={slideIdx===0} style={{padding:"8px 16px",borderRadius:6,border:"1px solid "+C.border,background:"transparent",color:slideIdx>0?C.text:C.dimmed,cursor:slideIdx>0?"pointer":"default",fontFamily:"inherit",fontSize:12}}><ChevronLeft size={14}/></button>
          {slideIdx<SLIDES.length-1?<button onClick={()=>setSlideIdx(slideIdx+1)} style={{padding:"8px 16px",borderRadius:6,border:"none",background:C.accent,color:C.bg,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700}}>Suivant<ChevronRight size={14}/></button>
          :<button onClick={()=>setShowSlides(false)} style={{padding:"8px 16px",borderRadius:6,border:"none",background:C.gold,color:C.bg,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700}}>Commencer ! 🚀</button>}
        </div>
      </div>
    </div>
  );}

  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',sans-serif",padding:16}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div><div style={{fontSize:18,fontWeight:800,color:"#7C3AED"}}>Clinique Leman Sante 🏥 <span style={{fontSize:12,color:C.gold}}>⭐⭐⭐ Avance</span></div><div style={{fontSize:11,color:C.muted}}>Heritage + ArrayList + try-catch + fichiers · 150 XP · LO1-LO4</div></div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <div style={{padding:"4px 10px",borderRadius:6,background:C.gold+"15",border:"1px solid "+C.gold+"40"}}><span style={{fontSize:16,fontWeight:800,color:C.gold}}>{totalXP}</span><span style={{fontSize:9,color:C.muted,marginLeft:2}}>XP</span></div>
            <button onClick={()=>{setShowSlides(true);setSlideIdx(0);}} style={{padding:"6px 10px",borderRadius:6,border:"1px solid "+C.border,background:"transparent",color:C.muted,cursor:"pointer",fontSize:10}}>📽️</button>
          </div>
        </div>
        <div style={{display:"flex",gap:4,marginBottom:16}}>{STEPS.map((s,i)=>(<button key={i} onClick={()=>(stepStatus[i]==='done'||i<=currentStep)&&setCurrentStep(i)} style={{flex:1,padding:"8px 4px",borderRadius:6,border:"none",background:stepStatus[i]==='done'?C.success+"20":i===currentStep?C.gold+"20":C.card,cursor:(stepStatus[i]==='done'||i<=currentStep)?"pointer":"default",opacity:i<=currentStep||stepStatus[i]==='done'?1:0.4}}><div style={{fontSize:16}}>{stepStatus[i]==='done'?'✅':s.icon}</div><div style={{fontSize:8,color:stepStatus[i]==='done'?C.success:i===currentStep?C.gold:C.dimmed,fontWeight:600,marginTop:2}}>{s.name.split(' ')[0]}</div></button>))}</div>
        <div style={{background:C.card,borderRadius:12,border:"1px solid "+C.border,overflow:"hidden"}}>
          <div style={{padding:"14px 16px",borderBottom:"1px solid "+C.border,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:20}}>{step.icon}</span><div><div style={{fontSize:14,fontWeight:700,color:C.text}}>{"Etape "+(currentStep+1)+" — "+step.name}</div><div style={{fontSize:10,color:C.dimmed}}>{step.lo+" · "+step.xp+" XP"}</div></div></div>{stepStatus[currentStep]==='done'&&<span style={{padding:"3px 10px",borderRadius:4,background:C.success+"20",color:C.success,fontSize:10,fontWeight:600}}>Termine ✅</span>}</div>
          <div style={{padding:"14px 16px"}}><div dangerouslySetInnerHTML={{__html:step.instructions}} style={{fontSize:12,color:C.text,lineHeight:1.8}}/></div>
          <div style={{padding:"0 16px 16px"}}>
            {step.type==='upload'&&<div><input ref={fileRef} type="file" accept={step.accept} onChange={handleFile} style={{display:"none"}}/><button onClick={()=>fileRef.current?.click()} style={{display:"flex",alignItems:"center",gap:6,padding:"10px 20px",borderRadius:8,border:"2px dashed "+C.accent+"40",background:C.accent+"08",color:C.accent,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600}}><Upload size={14}/>Telecharger ({step.accept})</button></div>}
            {step.type==='text'&&<div><textarea value={textInput} onChange={e=>setTextInput(e.target.value)} rows={10} placeholder="Pseudo-code..." style={{width:"100%",padding:"12px",borderRadius:8,border:"1px solid "+C.border,background:C.code,color:C.codeTxt,fontFamily:"'Consolas',monospace",fontSize:12,resize:"vertical",boxSizing:"border-box"}}/><button onClick={submitStep} style={{marginTop:8,padding:"10px 20px",borderRadius:8,border:"none",background:C.accent,color:C.bg,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700}}>Soumettre</button></div>}
            {step.type==='java'&&<div><button onClick={()=>setShowOC(!showOC)} style={{display:"flex",alignItems:"center",gap:6,padding:"10px 16px",borderRadius:8,border:"none",background:C.primary,color:C.text,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700,marginBottom:8}}><Code size={14}/>{showOC?"Masquer":"Ouvrir OneCompiler"}</button>{showOC&&<div style={{borderRadius:8,overflow:"hidden",border:"1px solid "+C.border,marginBottom:8}}><iframe src={"https://onecompiler.com/embed/java?theme=dark&hideTitle=true&hideLanguageSelection=true&code="+encodeURIComponent(step.starterCode||'')} style={{width:"100%",height:450,border:"none"}} title="Java"/></div>}<button onClick={submitStep} style={{padding:"10px 20px",borderRadius:8,border:"none",background:C.success,color:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700}}>J'ai termine ✅</button></div>}
          </div>
          {feedback&&<div style={{padding:"10px 16px",background:(feedback.ok?C.success:C.danger)+"15",borderTop:"1px solid "+(feedback.ok?C.success:C.danger)+"30"}}><div style={{fontSize:12,fontWeight:600,color:feedback.ok?C.success:C.danger}}>{feedback.msg}</div></div>}
        </div>
        {stepStatus.every(s=>s==='done')&&<div style={{marginTop:16,background:C.success+"15",borderRadius:12,padding:20,border:"1px solid "+C.success+"30",textAlign:"center"}}><div style={{fontSize:32}}>🎉</div><div style={{fontSize:18,fontWeight:800,color:C.success,marginTop:8}}>Clinique Leman terminee !</div><div style={{fontSize:28,fontWeight:800,color:C.gold,marginTop:4}}>{totalXP} XP</div><div style={{fontSize:11,color:C.muted,marginTop:4}}>Heritage, ArrayList, try-catch, fichiers — tous les concepts LO3 maitrises !</div></div>}
      </div>
    </div>
  );
}
