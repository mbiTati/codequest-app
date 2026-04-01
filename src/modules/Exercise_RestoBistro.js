import { useState, useRef } from 'react';
import { useAuth } from '../lib/AuthProvider';
import { supabase } from '../lib/supabase';
import { ChevronLeft, ChevronRight, Upload, Code, FileText } from 'lucide-react';

const C={bg:"#0a0f1a",card:"#111827",accent:"#32E0C4",gold:"#F59E0B",text:"#e2e8f0",muted:"#94a3b8",border:"#1e293b",danger:"#EF4444",primary:"#0D7377",success:"#10B981",dimmed:"#64748b",code:"#1E293B",codeTxt:"#67e8f9"};

const SLIDES = [
  { title:"Bienvenue au Resto Bistro 🍽️", body:`<p style="font-size:14px;line-height:1.8"><strong>Alain Favre</strong> tient un petit bistro a Lausanne depuis 3 ans. Il propose 25 plats, accueille environ 40 clients par jour.<br/><br/>Alain est passionne de cuisine, mais la gestion... c'est pas son truc. Il note tout sur un carnet et perd regulierement des commandes.</p>` },
  { title:"Le probleme d'Alain 😰", body:`<div style="background:#EF444415;border:1px solid #EF444440;border-radius:8px;padding:12px"><p style="color:#EF4444;font-weight:700;margin-bottom:8px">Ce qui ne va pas :</p><p style="font-size:13px;line-height:1.8">• Il ne sait plus quels plats sont les plus vendus<br/>• Il confond les commandes des tables<br/>• Il ne peut pas calculer les recettes de la journee<br/>• Les prix changent mais il oublie de mettre a jour le menu</p></div>` },
  { title:"Ce qu'Alain veut 🎯", body:`<div style="background:#10B98115;border:1px solid #10B98140;border-radius:8px;padding:12px"><p style="color:#10B981;font-weight:700;margin-bottom:8px">Besoins :</p><p style="font-size:13px;line-height:2">1. <strong>Gerer ses plats</strong> — nom, categorie (entree/plat/dessert/boisson), prix<br/>2. <strong>Enregistrer les commandes</strong> — numero de table, quels plats, combien<br/>3. <strong>Calculer l'addition</strong> — total automatique par table<br/>4. <strong>Voir les statistiques</strong> — plat le plus vendu, recette du jour</p></div>` },
  { title:"Les regles du bistro 📋", body:`<div style="background:#F59E0B15;border:1px solid #F59E0B40;border-radius:8px;padding:12px"><p style="color:#F59E0B;font-weight:700;margin-bottom:8px">Regles :</p><p style="font-size:13px;line-height:2">• 4 categories de plats : Entree, Plat, Dessert, Boisson<br/>• Le prix minimum est de <strong>2 CHF</strong> (un cafe)<br/>• Une commande est liee a un <strong>numero de table</strong> (1 a 12)<br/>• Une commande peut contenir <strong>plusieurs plats</strong> avec des quantites differentes<br/>• Le service est de <strong>15%</strong> ajoute automatiquement</p></div>` },
  { title:"Votre mission 🚀", body:`<p style="font-size:14px;line-height:1.8">Creez un programme Java simple en <strong>6 etapes</strong> pour Alain.</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px"><div style="background:#0D737715;border-radius:6px;padding:8px;font-size:12px"><strong>1. Algorithme</strong></div><div style="background:#14A3C715;border-radius:6px;padding:8px;font-size:12px"><strong>2. Classes UML</strong></div><div style="background:#32E0C415;border-radius:6px;padding:8px;font-size:12px"><strong>3. Pseudo-code</strong></div><div style="background:#F59E0B15;border-radius:6px;padding:8px;font-size:12px"><strong>4. Code Java</strong></div><div style="background:#7C3AED15;border-radius:6px;padding:8px;font-size:12px"><strong>5. Execution</strong></div><div style="background:#EF444415;border-radius:6px;padding:8px;font-size:12px"><strong>6. Tests + Doc</strong></div></div><p style="font-size:11px;color:#94a3b8;margin-top:8px">Difficulte : ⭐ Debutant — 3 classes seulement</p>` },
  { title:"A vous de jouer ! 💡", body:`<div style="background:#0a0f1a;border:1px solid #1e293b;border-radius:8px;padding:12px"><p style="font-size:13px;line-height:2;color:#67e8f9">❓ Combien de classes pour ce bistro ?<br/>❓ Quel lien entre un plat et une commande ?<br/>❓ Comment calculer le total avec le service de 15% ?<br/>❓ Comment empecher un prix negatif ?</p></div>` },
];

const STEPS = [
  { name:"Algorithme", icon:"📋", lo:"LO1", type:"upload", accept:".pdf,.png,.jpg,.docx", xp:10,
    instructions:`<strong>Dessinez le flowchart</strong> du scenario : "Un client commande des plats a la table 5".<br/><br/>Incluez : prise de commande → ajout plats → calcul total → ajout service 15%.<br/><br/><strong>Livrable :</strong> Flowchart en PDF ou PNG.` },
  { name:"Classes UML", icon:"🔷", lo:"LO1/LO2", type:"upload", accept:".pdf,.png,.jpg,.docx", xp:15,
    instructions:`<strong>Identifiez les classes</strong> pour le bistro (3 classes suffisent).<br/><br/>Pour chaque classe : attributs (types) + methodes.<br/>Montrez les relations.<br/><br/><strong>Indice :</strong> Pensez a ce qui est sur le menu, a ce que le serveur note, et au lien entre les deux.<br/><br/><strong>Livrable :</strong> Diagramme UML en PDF ou PNG.` },
  { name:"Pseudo-code", icon:"📝", lo:"LO1", type:"text", xp:10,
    instructions:`<strong>Ecrivez en pseudo-code</strong> la fonction "calculerAddition(commande)".<br/><br/><strong>Exemple :</strong><br/><code>FONCTION calculerAddition(commande)</code><br/><code>&nbsp;&nbsp;total = 0</code><br/><code>&nbsp;&nbsp;POUR CHAQUE ligne DANS commande</code><br/><code>&nbsp;&nbsp;&nbsp;&nbsp;total = total + (ligne.plat.prix × ligne.quantite)</code><br/><code>&nbsp;&nbsp;FIN POUR</code><br/><code>&nbsp;&nbsp;totalAvecService = total × 1.15</code><br/><code>&nbsp;&nbsp;RETOURNER totalAvecService</code><br/><code>FIN FONCTION</code>` },
  { name:"Code Java", icon:"☕", lo:"LO3", type:"java", xp:25,
    instructions:`<strong>Codez les 3 classes</strong> dans OneCompiler.<br/><br/>✅ Attributs prives + getters/setters<br/>✅ Constructeur avec validation (prix >= 2 CHF)<br/>✅ Methode calculerTotal() avec service 15%<br/>✅ toString() sur chaque classe<br/>✅ Le code compile sans erreur`,
    starterCode:`// Resto Bistro — 3 classes

class Plat {
    // TODO: nom, categorie, prix
    // Validation : prix >= 2.0
}

class LigneCommande {
    // TODO: plat, quantite
    // Methode : getSousTotal()
}

class Commande {
    // TODO: numeroTable, liste de LigneCommande
    // Methode : ajouterPlat(plat, qte)
    // Methode : calculerTotal() — avec 15% service
}

public class Main {
    public static void main(String[] args) {
        System.out.println("=== Resto Bistro Lausanne ===");
        // Creer des plats
        // Plat p1 = new Plat("Fondue", "Plat", 28.50);
        // Creer une commande table 5
        // Commande c = new Commande(5);
        // c.ajouterPlat(p1, 2);
        // System.out.println("Total : " + c.calculerTotal() + " CHF");
    }
}` },
  { name:"Execution", icon:"▶️", lo:"LO3", type:"java", xp:20,
    instructions:`<strong>Testez avec ces donnees suisses :</strong><br/><br/>Plats : Fondue moitie-moitie 28.50, Rosti bernois 22.00, Salade verte 12.50, Tarte aux noix 9.50, Cafe creme 4.50<br/>Table 5 : 2 fondues + 1 salade + 2 cafes<br/><br/>Resultat attendu : (2×28.50 + 12.50 + 2×4.50) × 1.15 = <strong>90.85 CHF</strong><br/><br/>Testez aussi : prix negatif (doit echouer), table 0 (invalide).`,
    starterCode:`// Collez votre code complet + ajoutez les tests\npublic class Main {\n    public static void main(String[] args) {\n        // Test complet avec donnees suisses\n    }\n}` },
  { name:"Tests + Doc", icon:"📄", lo:"LO4", type:"upload", accept:".pdf,.docx", xp:15,
    instructions:`<strong>Partie 1 :</strong> Plan de tests (5 cas minimum) — normal, limite, erreur.<br/><strong>Partie 2 :</strong> Ajoutez des commentaires Javadoc sur chaque classe.<br/><strong>Partie 3 :</strong> Verifiez les conventions (camelCase, PascalCase).<br/><br/><strong>Livrable :</strong> Document PDF ou DOCX.` },
];

// Reuse the same component structure as TechShop
export default function ExerciseRestoBistro() {
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
    try { await supabase.from('cq_game_scores').insert({student_id:student?.id,game_id:'restobistro_step_'+currentStep,score:step.xp,duration_seconds:0}); } catch(e){}
    setTimeout(()=>{setFeedback(null);if(currentStep<STEPS.length-1)setCurrentStep(currentStep+1);},1500);
  }
  async function handleFile(e) {
    const f=e.target.files?.[0]; if(!f)return;
    try{await supabase.storage.from('cours-documents').upload(`restobistro/${student?.id||'anon'}/${Date.now()}_${f.name.replace(/\s+/g,'_')}`,f);}catch(err){}
    setFeedback({ok:true,msg:`"${f.name}" televerse !`}); submitStep();
  }

  if(showSlides){const sl=SLIDES[slideIdx];return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{maxWidth:600,width:"100%",background:C.card,borderRadius:16,border:"1px solid "+C.border,overflow:"hidden"}}>
        <div style={{padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid "+C.border}}>
          <span style={{fontSize:10,color:C.dimmed}}>{(slideIdx+1)+" / "+SLIDES.length}</span>
          <span style={{fontSize:12,fontWeight:700,color:"#EF4444"}}>Resto Bistro ⭐</span>
          <button onClick={()=>setShowSlides(false)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:14}}>✕</button>
        </div>
        <div style={{padding:"20px 24px"}}><h2 style={{fontSize:18,fontWeight:800,color:C.accent,marginBottom:12}}>{sl.title}</h2><div dangerouslySetInnerHTML={{__html:sl.body}} style={{color:C.text,lineHeight:1.6}}/></div>
        <div style={{padding:"12px 16px",display:"flex",justifyContent:"space-between",borderTop:"1px solid "+C.border}}>
          <button onClick={()=>setSlideIdx(Math.max(0,slideIdx-1))} disabled={slideIdx===0} style={{padding:"8px 16px",borderRadius:6,border:"1px solid "+C.border,background:"transparent",color:slideIdx>0?C.text:C.dimmed,cursor:slideIdx>0?"pointer":"default",fontFamily:"inherit",fontSize:12,display:"flex",alignItems:"center",gap:4}}><ChevronLeft size={14}/>Prec.</button>
          {slideIdx<SLIDES.length-1?<button onClick={()=>setSlideIdx(slideIdx+1)} style={{padding:"8px 16px",borderRadius:6,border:"none",background:C.accent,color:C.bg,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",gap:4}}>Suivant<ChevronRight size={14}/></button>
          :<button onClick={()=>setShowSlides(false)} style={{padding:"8px 16px",borderRadius:6,border:"none",background:C.gold,color:C.bg,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700}}>Commencer ! 🚀</button>}
        </div>
      </div>
    </div>
  );}

  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',sans-serif",padding:16}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div><div style={{fontSize:18,fontWeight:800,color:"#EF4444"}}>Resto Bistro Lausanne 🍽️ <span style={{fontSize:12,color:C.gold}}>⭐ Debutant</span></div><div style={{fontSize:11,color:C.muted}}>3 classes · 95 XP · LO1 + LO3 + LO4</div></div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <div style={{padding:"4px 10px",borderRadius:6,background:C.gold+"15",border:"1px solid "+C.gold+"40"}}><span style={{fontSize:16,fontWeight:800,color:C.gold}}>{totalXP}</span><span style={{fontSize:9,color:C.muted,marginLeft:2}}>XP</span></div>
            <button onClick={()=>{setShowSlides(true);setSlideIdx(0);}} style={{padding:"6px 10px",borderRadius:6,border:"1px solid "+C.border,background:"transparent",color:C.muted,cursor:"pointer",fontSize:10}}>📽️ Slides</button>
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
        {stepStatus.every(s=>s==='done')&&<div style={{marginTop:16,background:C.success+"15",borderRadius:12,padding:20,border:"1px solid "+C.success+"30",textAlign:"center"}}><div style={{fontSize:32}}>🎉</div><div style={{fontSize:18,fontWeight:800,color:C.success,marginTop:8}}>Resto Bistro termine !</div><div style={{fontSize:28,fontWeight:800,color:C.gold,marginTop:4}}>{totalXP} XP</div></div>}
      </div>
    </div>
  );
}
