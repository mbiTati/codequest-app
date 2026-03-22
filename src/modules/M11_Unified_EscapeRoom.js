import { useState, useEffect, useCallback } from "react";

const C={bg:"#0a0f1a",card:"#111827",primary:"#0D7377",secondary:"#14A3C7",accent:"#32E0C4",gold:"#F59E0B",text:"#e2e8f0",muted:"#94a3b8",dimmed:"#64748b",border:"#1e293b",success:"#10B981",danger:"#EF4444",code:"#1E293B",codeBorder:"#2d3a4f",codeText:"#32E0C4",keyword:"#c792ea",string:"#c3e88d"};
const KEY="cq-m11-unified";
async function ld(){try{const r=await window.storage.get(KEY);return r?JSON.parse(r.value):null;}catch{return null;}}
async function sv(d){try{await window.storage.set(KEY,JSON.stringify(d));}catch{}}
function Code({code,hl=[]}){const lines=code.split("\n");return(<div style={{background:C.code,border:`1px solid ${C.codeBorder}`,borderRadius:10,overflow:"hidden",fontSize:12,fontFamily:"'JetBrains Mono',monospace",margin:"8px 0"}}><div style={{display:"flex",gap:5,padding:"5px 10px",background:"#0d1117",borderBottom:`1px solid ${C.codeBorder}`}}><span style={{width:7,height:7,borderRadius:"50%",background:"#ff5f57"}}/><span style={{width:7,height:7,borderRadius:"50%",background:"#febc2e"}}/><span style={{width:7,height:7,borderRadius:"50%",background:"#28c840"}}/></div><div style={{padding:"8px 0",overflowX:"auto"}}>{lines.map((l,i)=>(<div key={i} style={{display:"flex",padding:"1px 0",background:hl.includes(i)?C.accent+"12":"transparent",borderLeft:hl.includes(i)?`3px solid ${C.accent}`:"3px solid transparent"}}><span style={{width:32,textAlign:"right",paddingRight:8,color:C.dimmed,userSelect:"none",flexShrink:0,fontSize:10}}>{i+1}</span><span style={{color:C.codeText,whiteSpace:"pre"}}>{l}</span></div>))}</div></div>);}
function Quiz({q,opts,correct,onAns,done}){const[sel,setSel]=useState(null);return(<div style={{margin:"12px 0"}}><div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:6}}>{q}</div>{opts.map((o,i)=>{let bg=C.card,bc=C.border;if(done&&i===correct){bg=C.success+"20";bc=C.success;}else if(done&&sel===i){bg=C.danger+"20";bc=C.danger;}return(<button key={i} onClick={()=>{if(done)return;setSel(i);onAns(i===correct);}} style={{display:"block",width:"100%",textAlign:"left",padding:"7px 11px",marginBottom:3,borderRadius:7,border:`1px solid ${bc}`,background:bg,color:C.text,cursor:done?"default":"pointer",fontFamily:"inherit",fontSize:12}}>{String.fromCharCode(65+i)}. {o}</button>);})}</div>);}
function Tip({title,children,color=C.gold}){return(<div style={{background:color+"15",borderRadius:7,padding:10,border:`1px solid ${color}40`,margin:"8px 0"}}><div style={{fontSize:11,fontWeight:600,color,marginBottom:3}}>{title}</div><div style={{color:C.text,fontSize:11,lineHeight:1.5}}>{children}</div></div>);}
function P({children}){return <p style={{color:C.muted,fontSize:13,lineHeight:1.7,marginBottom:6}}>{children}</p>;}
function Strong({children,c=C.text}){return <strong style={{color:c}}>{children}</strong>;}

// ═══ GAME: FULL ESCAPE ROOM ═══
function FullEscape({onComplete}){
  const ROOMS=[
    {name:"Salle 1 — Compilation",desc:"3 erreurs qui empêchent le programme de compiler",challenges:[
      {code:'public class gestionInventions {\n    private ArrayList<String> noms\n    \n    public void ajouter(String nom) {\n        noms.add(nom)\n    }\n}',bugs:["Classe en minuscule (gestionInventions → GestionInventions)","Point-virgule manquant ligne 2","Point-virgule manquant ligne 5"],category:"compilation"},
    ]},
    {name:"Salle 2 — Runtime",desc:"Le programme compile mais plante à l'exécution",challenges:[
      {code:'ArrayList<String> inventions = new ArrayList<>();\ninventions.add("Roue");\ninventions.add("Feu");\n\nString premiere = inventions.get(0);\nString derniere = inventions.get(inventions.size());\n\nSystem.out.println(premiere.toUpperCase());\n\nString test = null;\nSystem.out.println(test.length());',bugs:["IndexOutOfBounds : get(size()) → get(size()-1)","NullPointerException : test.length() sur null"],category:"runtime"},
    ]},
    {name:"Salle 3 — Logique",desc:"Le programme tourne mais les résultats sont faux",challenges:[
      {code:'// Calculer la moyenne des notes\nint[] notes = {85, 92, 78, 95, 88};\nint somme = 0;\nfor (int i = 1; i <= notes.length; i++) {\n    somme += notes[i];\n}\nint moyenne = somme / notes.length;\nSystem.out.println("Moyenne: " + moyenne);',bugs:["Boucle commence à 1 au lieu de 0 (perd la première note)","<= provoque ArrayIndexOutOfBounds sur le dernier","Division entière : int/int perd les décimales"],category:"logique"},
    ]},
    {name:"Salle 4 — Sécurité",desc:"Le programme fonctionne mais a des failles",challenges:[
      {code:'Scanner sc = new Scanner(System.in);\nSystem.out.print("Âge : ");\nint age = sc.nextInt();\n\nSystem.out.print("Nom : ");\nString nom = sc.nextLine();\n\nif (nom == "admin") {\n    System.out.println("Accès admin");\n}\n\nString mdp = "secret123";',bugs:["Pas de try-catch sur nextInt() → crash si texte","nextInt() laisse \\n → nextLine() lit une chaîne vide","== au lieu de .equals() pour comparer les Strings","Mot de passe en dur dans le code source"],category:"securite"},
    ]},
    {name:"Salle 5 — Standards",desc:"Le code fonctionne mais viole les conventions",challenges:[
      {code:'public class inv {\n    public String N;\n    public int A;\n    public double P;\n    \n    public void c(int x) {\n        if(x>0){P=P-(P*x/100);}\n    }\n    \n    // calcule le prix ttc\n    public double ttc() {\n        return P * 1.077;\n    }\n}',bugs:["Classe 'inv' → nom non descriptif, pas PascalCase","Attributs publics avec noms à 1 lettre → private + noms descriptifs","Méthode 'c' incompréhensible → appliquerReduction(int pourcentage)","Nombre magique 1.077 → constante final double TVA = 0.077","Pas de Javadoc, commentaire trivial"],category:"standards"},
    ]},
  ];

  const[room,setRoom]=useState(0);const[found,setFound]=useState(ROOMS.map(r=>r.challenges.map(c=>c.bugs.map(()=>false))));
  const[score,setScore]=useState(0);const[timer,setTimer]=useState(600);const[done,setDone]=useState(false);

  useEffect(()=>{if(done||timer<=0)return;const t=setInterval(()=>setTimer(v=>{if(v<=1){setDone(true);onComplete(score);return 0;}return v-1;}),1000);return()=>clearInterval(t);},[done,timer]);

  const toggleBug=(ci,bi)=>{const nf=JSON.parse(JSON.stringify(found));if(nf[room][ci][bi])return;nf[room][ci][bi]=true;setFound(nf);setScore(s=>s+15);
    const allFound=nf.every(r=>r.every(c=>c.every(Boolean)));if(allFound){setDone(true);onComplete(score+15+Math.floor(timer/10));}};
  const totalBugs=ROOMS.reduce((a,r)=>a+r.challenges.reduce((b,c)=>b+c.bugs.length,0),0);
  const foundCount=found.reduce((a,r)=>a+r.reduce((b,c)=>b+c.filter(Boolean).length,0),0);
  const mm=Math.floor(timer/60);const ss=timer%60;
  const roomColors=["#EF4444","#F97316",C.gold,"#8B5CF6",C.secondary];

  return(<div style={{background:C.card,borderRadius:12,padding:14,border:`1px solid ${C.border}`,margin:"10px 0"}}>
    <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:6}}>
      <span style={{color:C.dimmed}}>Bugs : {foundCount}/{totalBugs}</span>
      <span style={{color:C.gold,fontWeight:700}}>Score: {score}</span>
      <span style={{color:timer<120?C.danger:C.muted,fontWeight:600}}>{mm}:{ss.toString().padStart(2,"0")}</span>
    </div>
    <div style={{display:"flex",gap:3,marginBottom:10}}>{ROOMS.map((r,i)=>(<button key={i} onClick={()=>setRoom(i)} style={{flex:1,padding:"6px 4px",borderRadius:6,border:`1px solid ${i===room?roomColors[i]:C.border}`,background:i===room?roomColors[i]+"15":"transparent",color:i===room?roomColors[i]:C.dimmed,cursor:"pointer",fontFamily:"inherit",fontSize:9,fontWeight:600,textAlign:"center"}}>
      {found[i].every(c=>c.every(Boolean))?"✓ ":""}{r.name.split(" — ")[1]}
    </button>))}</div>
    <div style={{fontSize:13,fontWeight:600,color:roomColors[room],marginBottom:2}}>{ROOMS[room].name}</div>
    <div style={{fontSize:11,color:C.muted,marginBottom:8}}>{ROOMS[room].desc}</div>
    {ROOMS[room].challenges.map((ch,ci)=>(<div key={ci}>
      <div style={{background:C.code,borderRadius:8,padding:10,fontFamily:"monospace",fontSize:11,color:C.codeText,whiteSpace:"pre-wrap",marginBottom:8,border:`1px solid ${C.codeBorder}`}}>{ch.code}</div>
      <div style={{fontSize:10,fontWeight:600,color:C.muted,marginBottom:4}}>Bugs à trouver ({found[room][ci].filter(Boolean).length}/{ch.bugs.length}) :</div>
      {ch.bugs.map((bug,bi)=>(<button key={bi} onClick={()=>toggleBug(ci,bi)} style={{display:"block",width:"100%",textAlign:"left",padding:"6px 10px",marginBottom:3,borderRadius:6,border:`1px solid ${found[room][ci][bi]?C.success+"40":C.border}`,background:found[room][ci][bi]?C.success+"10":C.code,color:found[room][ci][bi]?C.success:C.muted,cursor:found[room][ci][bi]?"default":"pointer",fontFamily:"inherit",fontSize:10}}>
        {found[room][ci][bi]?"✓ ":"○ "}{found[room][ci][bi]?bug:"Cliquez quand vous avez trouvé un bug"}
      </button>))}
    </div>))}
    {done&&<div style={{textAlign:"center",marginTop:12,padding:10,background:C.gold+"15",borderRadius:8}}><div style={{fontSize:16,fontWeight:700,color:C.gold}}>{foundCount===totalBugs?"Escape Room terminée !":"Temps écoulé !"}</div><div style={{fontSize:12,color:C.muted}}>{score} points · {foundCount}/{totalBugs} bugs trouvés</div></div>}
  </div>);
}

function Memo(){return(<div style={{background:C.card,borderRadius:12,padding:20,border:`1px solid ${C.gold}40`}}>
  <div style={{fontSize:16,fontWeight:700,color:C.gold,marginBottom:12}}>Mémo débloqué — Checklist Qualité Complète</div>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
    <div style={{background:C.code,borderRadius:8,padding:10}}><div style={{fontSize:11,fontWeight:600,color:C.accent,marginBottom:4}}>Avant chaque commit</div><div style={{fontSize:9,color:C.muted,lineHeight:1.6}}>☐ Le code compile sans erreur<br/>☐ Pas de NullPointerException possible<br/>☐ try-catch sur les entrées utilisateur<br/>☐ Noms descriptifs (pas de x, n, tmp)<br/>☐ Ctrl+Shift+F appliqué<br/>☐ Javadoc sur les méthodes publiques</div></div>
    <div style={{background:C.code,borderRadius:8,padding:10}}><div style={{fontSize:11,fontWeight:600,color:C.accent,marginBottom:4}}>Les 5 types de bugs</div><div style={{fontSize:9,color:C.muted,lineHeight:1.6}}>1. Compilation : syntaxe, types<br/>2. Runtime : null, index, cast<br/>3. Logique : off-by-one, == vs =<br/>4. Sécurité : injection, validation<br/>5. Standards : nommage, structure</div></div>
  </div>
</div>);}

const STEPS=[
  {section:"Théorie",title:"Récap LO4 — Tout rassembler",type:"theory",render:(onQ,done)=>(<>
    <P>L'Escape Room combine <Strong c={C.accent}>tout ce que vous avez appris</Strong> en M09 et M10 : debugging, sécurité, et standards.</P>
    <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6,margin:"8px 0"}}>
      {[{t:"Compilation",d:"Syntaxe, types, points-virgules",c:"#EF4444"},{t:"Runtime",d:"Null, index, cast",c:"#F97316"},{t:"Logique",d:"Off-by-one, == vs =",c:C.gold},{t:"Sécurité",d:"Validation, try-catch",c:"#8B5CF6"},{t:"Standards",d:"Nommage, Javadoc",c:C.secondary}].map((s,i)=>(
        <div key={i} style={{background:s.c+"12",borderRadius:8,padding:8,textAlign:"center"}}><div style={{fontWeight:600,color:s.c,fontSize:11}}>{s.t}</div><div style={{fontSize:9,color:C.muted,marginTop:3}}>{s.d}</div></div>
      ))}
    </div>
    <P>L'Escape Room a <Strong>5 salles</Strong>, une par catégorie. Chaque salle contient du code avec des bugs à trouver. 10 minutes chrono.</P>
    <Tip title="Stratégie">Commencez par les bugs de compilation (les plus faciles à voir), puis runtime, puis logique. Gardez sécurité et standards pour la fin — ils demandent plus de réflexion.</Tip>
    <Quiz q="Quel type de bug est le plus rapide à identifier ?" opts={["Logique (le résultat est faux)","Compilation (Eclipse le signale directement)","Sécurité (pas de message d'erreur)","Standards (aucun impact sur l'exécution)"]} correct={1} onAns={onQ} done={done}/>
  </>)},

  {section:"Défi",title:"Escape Room du Code — Boss Fight",type:"game",render:(_,__,onGC)=>(<>
    <P>5 salles, ~15 bugs, 10 minutes. Traversez toutes les salles ! Chaque bug trouvé = 15 points. Bonus temps restant.</P>
    <FullEscape onComplete={onGC}/>
  </>)},

  {section:"Code guidé",title:"Audit de code complet",type:"guided",render:(onQ,done)=>(<>
    <P>Voici un code complet avec des problèmes dans chaque catégorie. Auditons-le ensemble.</P>
    <Code hl={[0,3,4,7,10,14]} code={`public class inv {                           // Standard : nom de classe\n    public String n;                          // Standard : public + nom court\n    \n    public inv(String x) {                    // Standard : nom paramètre\n        n = x;                                // Pas de this\n    }\n    \n    public void afficher() {\n        System.out.println(n.toUpperCase());  // Runtime : si n est null ?\n    }\n    \n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        System.out.print("Nom : ");\n        inv i = new inv(sc.nextLine());       // Sécurité : pas de validation\n        i.afficher();\n    }\n}`}/>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:6,marginBottom:3}}>Audit ligne par ligne :</div>
    <div style={{fontSize:11,color:C.text,lineHeight:1.8}}>
      <Strong c={C.danger}>L1 :</Strong> Classe "inv" → renommer "Invention" (PascalCase)<br/>
      <Strong c={C.danger}>L2 :</Strong> public String n → private String nom<br/>
      <Strong c={C.danger}>L4 :</Strong> Paramètre "x" → "nom"<br/>
      <Strong c={C.danger}>L5 :</Strong> Manque this.nom = nom<br/>
      <Strong c={C.danger}>L9 :</Strong> Si nom est null → NullPointerException<br/>
      <Strong c={C.danger}>L15 :</Strong> Pas de validation de l'entrée (vide ? null ?)<br/>
      <Strong c={C.gold}>Global :</Strong> Pas de Javadoc, pas de try-catch
    </div>
    <Code hl={[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]} code={`/**\n * Représente une invention du laboratoire.\n */\npublic class Invention {\n    private String nom;\n\n    public Invention(String nom) {\n        if (nom == null || nom.trim().isEmpty()) {\n            throw new IllegalArgumentException("Nom invalide");\n        }\n        this.nom = nom.trim();\n    }\n\n    public void afficher() {\n        System.out.println(nom.toUpperCase());\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        try {\n            System.out.print("Nom : ");\n            String input = sc.nextLine().trim();\n            if (!input.isEmpty()) {\n                Invention inv = new Invention(input);\n                inv.afficher();\n            }\n        } catch (Exception e) {\n            System.out.println("Erreur: " + e.getMessage());\n        }\n    }\n}`}/>
    <Quiz q="Combien de catégories de problèmes dans le code original ?" opts={["1 (juste les noms)","2 (noms + null)","4 (standards, runtime, sécurité, encapsulation)","Aucun, il fonctionne"]} correct={2} onAns={onQ} done={done}/>
  </>)},

  {section:"Exercice",title:"Boss Fight Final — Audit complet",type:"exercise",render:(onQ,done)=>(<>
    <div style={{background:C.gold+"15",borderRadius:10,padding:14,border:`1px solid ${C.gold}40`}}>
      <div style={{fontSize:15,fontWeight:700,color:C.gold,marginBottom:4}}>Boss Fight LO4 — 100 Crédits R&D</div>
      <div style={{color:C.text,fontSize:13}}>Audit complet de votre projet. Combinez debugging + sécurité + standards.</div>
    </div>
    <div style={{color:C.text,fontSize:12,lineHeight:1.8,marginTop:10}}>
      <Strong>Livrable 1 — DEBUG_REPORT.md :</Strong><br/>
      Pour 3 bugs trouvés et corrigés dans votre projet :<br/>
      → Capture d'écran breakpoint + watch list<br/>
      → Explication du bug et de la correction<br/><br/>
      <Strong>Livrable 2 — STYLE_GUIDE.md :</Strong><br/>
      Guide de style de votre équipe avec exemples<br/><br/>
      <Strong>Livrable 3 — Code nettoyé :</Strong><br/>
      → Javadoc sur toutes les classes/méthodes publiques<br/>
      → Noms conformes aux conventions<br/>
      → try-catch sur toutes les entrées utilisateur<br/>
      → Commit : <code style={{color:C.accent}}>refactor: LO4 audit complet</code><br/><br/>
      <Strong>Livrable 4 — Réflexion (D4) :</Strong><br/>
      1 page expliquant pourquoi les standards sont nécessaires en équipe ET en individuel
    </div>
    <Quiz q="Pour un Distinction (D3+D4), il faut :" opts={["Juste que le code fonctionne","Une analyse CRITIQUE avec des arguments pour et contre, des exemples concrets","Recopier les conventions Java","Avoir le meilleur score à l'Escape Room"]} correct={1} onAns={onQ} done={done}/>
  </>)},

  {section:"Correction",title:"Checklist finale LO4 complet",type:"correction",render:(onQ,done)=>(<>
    <div style={{background:C.success+"12",borderRadius:8,padding:10,border:`1px solid ${C.success}40`,marginBottom:8}}><div style={{fontSize:13,fontWeight:700,color:C.success}}>Checklist complète LO4</div></div>
    <div style={{fontSize:12,color:C.text,lineHeight:2}}>
      <Strong c={C.accent}>P5 — Debugging process :</Strong><br/>
      ☐ Explication des outils (breakpoint, watch, step over/into)<br/>
      ☐ Captures d'écran du debugger Eclipse<br/>
      ☐ Processus documenté pas à pas<br/><br/>
      <Strong c={C.accent}>P6 — Coding standard :</Strong><br/>
      ☐ STYLE_GUIDE.md avec conventions choisies<br/>
      ☐ Exemples avant/après dans le code<br/><br/>
      <Strong c={C.accent}>M4 — Debugging pour la sécurité :</Strong><br/>
      ☐ Le debugging a trouvé/corrigé une vulnérabilité<br/>
      ☐ Le code est plus robuste après<br/><br/>
      <Strong c={C.accent}>D4 — Évaluer les standards :</Strong><br/>
      ☐ Analyse critique (pas juste une liste)<br/>
      ☐ Arguments en équipe ET en individuel<br/>
      ☐ Exemples concrets de problèmes sans standards<br/>
    </div>
    <Tip title="Mapping LO complet" color={C.success}>LO1 (M01-M04 rattrapage) → LO2 (M03-M05 paradigmes) → LO3 (M06-M08 implémentation) → LO4 (M09-M11 qualité). Tous les critères P1-P6, M1-M4, D1-D4 sont couverts.</Tip>
    <Quiz q="Le cours CodeQuest couvre :" opts={["Seulement LO3","LO3 et LO4","Les 4 LO de l'Unit 1 (LO1-LO4)","Seulement le debugging"]} correct={2} onAns={onQ} done={done}/>
  </>)},
];

export default function M11Unified(){
  const[step,setStep]=useState(0);const[completed,setCompleted]=useState({});const[score,setScore]=useState(0);const[totalQ,setTotalQ]=useState(0);const[credits,setCredits]=useState(0);const[gameScore,setGameScore]=useState(null);const[ready,setReady]=useState(false);const[showMemo,setShowMemo]=useState(false);
  const allDone=Object.keys(completed).length>=STEPS.length;
  useEffect(()=>{ld().then(d=>{if(d){setCompleted(d.c||{});setScore(d.s||0);setTotalQ(d.t||0);setCredits(d.cr||0);setGameScore(d.gs);if(d.st!==undefined)setStep(d.st);}setReady(true);});},[]);
  const persist=useCallback((c,s,t,cr,gs,st)=>{sv({c,s,t,cr,gs,st});},[]);
  const handleQuiz=(ok)=>{const nT=totalQ+1,nS=score+(ok?1:0),nCr=credits+(ok?5:0),nC={...completed,[step]:true};setTotalQ(nT);setScore(nS);setCredits(nCr);setCompleted(nC);persist(nC,nS,nT,nCr,gameScore,step);};
  const handleGC=(gs)=>{setGameScore(gs);const nCr=credits+Math.floor(gs/2);setCredits(nCr);const nC={...completed,[step]:true};setCompleted(nC);persist(nC,score,totalQ,nCr,gs,step);};
  const go=(dir)=>{const ns=step+dir;if(ns>=0&&ns<STEPS.length){setStep(ns);persist(completed,score,totalQ,credits,gameScore,ns);}};
  if(!ready)return<div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",color:C.muted}}>Chargement...</div>;
  const cur=STEPS[step];const sections=[...new Set(STEPS.map(s=>s.section))];
  const secC={Théorie:C.secondary,Défi:C.gold,"Code guidé":C.primary,Exercice:C.accent,Correction:C.success};
  return(<div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',system-ui,sans-serif"}}><style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
    <div style={{padding:"8px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:C.card,flexWrap:"wrap",gap:4}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:10,letterSpacing:2,color:C.dimmed}}>CODEQUEST</span><span style={{color:C.border}}>|</span><span style={{fontSize:12,fontWeight:600,color:C.danger}}>M11 · Escape Room</span></div><div style={{display:"flex",gap:10,fontSize:11}}><span style={{color:C.muted}}>Quiz <strong style={{color:C.success}}>{score}/{totalQ}</strong></span>{gameScore!==null&&<span style={{color:C.muted}}>Escape <strong style={{color:C.accent}}>{gameScore}</strong></span>}<span style={{color:C.muted}}>CR <strong style={{color:C.gold}}>{credits}</strong></span></div></div>
    <div style={{display:"flex",maxWidth:1100,margin:"0 auto",minHeight:"calc(100vh - 42px)"}}>
      <div style={{width:200,borderRight:`1px solid ${C.border}`,padding:"10px 0",flexShrink:0,overflowY:"auto",display:"flex",flexDirection:"column"}}>
        {sections.map(sec=>{const sts=STEPS.map((s,i)=>({...s,idx:i})).filter(s=>s.section===sec);return(<div key={sec}><div style={{padding:"5px 12px",fontSize:9,letterSpacing:1,color:secC[sec]||C.dimmed,fontWeight:700,textTransform:"uppercase"}}>{sec}</div>{sts.map(s=>{const c2=s.idx===step,dn=!!completed[s.idx];return(<button key={s.idx} onClick={()=>{setStep(s.idx);persist(completed,score,totalQ,credits,gameScore,s.idx);}} style={{display:"flex",alignItems:"center",gap:5,width:"100%",padding:"4px 12px 4px 20px",border:"none",background:c2?C.accent+"12":"transparent",borderLeft:c2?`2px solid ${C.accent}`:"2px solid transparent",cursor:"pointer",fontFamily:"inherit",fontSize:11,color:c2?C.accent:dn?C.success:C.muted,textAlign:"left"}}><span style={{fontSize:8}}>{dn?"✓":"○"}</span>{s.title}</button>);})}</div>);})}
        <div style={{padding:10,marginTop:"auto"}}><div style={{height:3,background:C.border,borderRadius:2,overflow:"hidden",marginBottom:6}}><div style={{width:`${(Object.keys(completed).length/STEPS.length)*100}%`,height:"100%",background:`linear-gradient(90deg,${C.primary},${C.accent})`,borderRadius:2,transition:"width .5s"}}/></div>
        <button onClick={()=>allDone&&setShowMemo(!showMemo)} style={{width:"100%",padding:"8px",borderRadius:8,border:`1px solid ${allDone?C.gold:C.border}`,background:allDone?C.gold+"15":"transparent",color:allDone?C.gold:C.dimmed,cursor:allDone?"pointer":"default",fontFamily:"inherit",fontSize:11,fontWeight:600,opacity:allDone?1:0.5}}>{allDone?"📋 Mémo":"🔒 Mémo"}</button></div>
      </div>
      <div style={{flex:1,padding:"16px 24px",overflowY:"auto",maxHeight:"calc(100vh - 42px)"}}>{showMemo&&allDone?<Memo/>:(<div key={step} style={{animation:"fadeIn .25s"}}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}><span style={{fontSize:9,padding:"2px 8px",borderRadius:10,background:(secC[cur.section]||C.dimmed)+"20",color:secC[cur.section]||C.dimmed,fontWeight:600,letterSpacing:1}}>{cur.section.toUpperCase()}</span></div><h2 style={{fontSize:18,fontWeight:700,marginBottom:12}}>{cur.title}</h2>{cur.type==="game"?cur.render(handleQuiz,!!completed[step],handleGC):cur.render(handleQuiz,!!completed[step])}<div style={{display:"flex",justifyContent:"space-between",marginTop:24,paddingTop:10,borderTop:`1px solid ${C.border}`}}><button onClick={()=>go(-1)} disabled={step===0} style={{padding:"7px 16px",borderRadius:7,border:`1px solid ${C.border}`,background:"transparent",color:step===0?C.border:C.muted,cursor:step===0?"default":"pointer",fontFamily:"inherit",fontSize:12}}>←</button><button onClick={()=>go(1)} disabled={step===STEPS.length-1} style={{padding:"7px 16px",borderRadius:7,border:"none",background:step===STEPS.length-1?C.border:C.accent,color:step===STEPS.length-1?C.muted:C.bg,cursor:step===STEPS.length-1?"default":"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600}}>{step===STEPS.length-1?"Fin":"→"}</button></div></div>)}</div>
    </div>
  </div>);
}
