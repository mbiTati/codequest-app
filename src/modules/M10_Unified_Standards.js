import { useState, useEffect, useCallback } from "react";

const C={bg:"#0a0f1a",card:"#111827",primary:"#0D7377",secondary:"#14A3C7",accent:"#32E0C4",gold:"#F59E0B",text:"#e2e8f0",muted:"#94a3b8",dimmed:"#64748b",border:"#1e293b",success:"#10B981",danger:"#EF4444",code:"#1E293B",codeBorder:"#2d3a4f",codeText:"#32E0C4",comment:"#6b7f99",keyword:"#c792ea",string:"#c3e88d"};
const KEY="cq-m10-unified";
async function ld(){try{const r=await window.storage.get(KEY);return r?JSON.parse(r.value):null;}catch{return null;}}
async function sv(d){try{await window.storage.set(KEY,JSON.stringify(d));}catch{}}
function Code({code,hl=[]}){const lines=code.split("\n");return(<div style={{background:C.code,border:`1px solid ${C.codeBorder}`,borderRadius:10,overflow:"hidden",fontSize:12,fontFamily:"'JetBrains Mono',monospace",margin:"8px 0"}}><div style={{display:"flex",gap:5,padding:"5px 10px",background:"#0d1117",borderBottom:`1px solid ${C.codeBorder}`}}><span style={{width:7,height:7,borderRadius:"50%",background:"#ff5f57"}}/><span style={{width:7,height:7,borderRadius:"50%",background:"#febc2e"}}/><span style={{width:7,height:7,borderRadius:"50%",background:"#28c840"}}/></div><div style={{padding:"8px 0",overflowX:"auto"}}>{lines.map((l,i)=>(<div key={i} style={{display:"flex",padding:"1px 0",background:hl.includes(i)?C.accent+"12":"transparent",borderLeft:hl.includes(i)?`3px solid ${C.accent}`:"3px solid transparent"}}><span style={{width:32,textAlign:"right",paddingRight:8,color:C.dimmed,userSelect:"none",flexShrink:0,fontSize:10}}>{i+1}</span><span style={{color:C.codeText,whiteSpace:"pre"}}>{l}</span></div>))}</div></div>);}
function Quiz({q,opts,correct,onAns,done}){const[sel,setSel]=useState(null);return(<div style={{margin:"12px 0"}}><div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:6}}>{q}</div>{opts.map((o,i)=>{let bg=C.card,bc=C.border;if(done&&i===correct){bg=C.success+"20";bc=C.success;}else if(done&&sel===i){bg=C.danger+"20";bc=C.danger;}return(<button key={i} onClick={()=>{if(done)return;setSel(i);onAns(i===correct);}} style={{display:"block",width:"100%",textAlign:"left",padding:"7px 11px",marginBottom:3,borderRadius:7,border:`1px solid ${bc}`,background:bg,color:C.text,cursor:done?"default":"pointer",fontFamily:"inherit",fontSize:12}}>{String.fromCharCode(65+i)}. {o}</button>);})}{done&&<div style={{marginTop:6,padding:"6px 10px",borderRadius:6,fontSize:11,fontWeight:600,background:sel===correct?"#10B98120":"#EF444420",color:sel===correct?"#10B981":"#EF4444"}}>{sel===correct?"Correct !":"Incorrect"}</div>}</div>);}
function Tip({title,children,color=C.gold}){return(<div style={{background:color+"15",borderRadius:7,padding:10,border:`1px solid ${color}40`,margin:"8px 0"}}><div style={{fontSize:11,fontWeight:600,color,marginBottom:3}}>{title}</div><div style={{color:C.text,fontSize:11,lineHeight:1.5}}>{children}</div></div>);}
function P({children}){return <p style={{color:C.muted,fontSize:13,lineHeight:1.7,marginBottom:6}}>{children}</p>;}
function Strong({children,c=C.text}){return <strong style={{color:c}}>{children}</strong>;}

// ═══ GAME: CODE PROPRE CHALLENGE ═══
function CleanCodeGame({onComplete}){
  const PAIRS=[
    {dirty:`int x = 5;\nString s = "hello";\ndouble d = 3.14;`,clean:`int age = 5;\nString prenom = "hello";\ndouble prix = 3.14;`,rule:"Noms descriptifs",violation:"Variables à 1 lettre (x, s, d)"},
    {dirty:`public class inventionManager {\n    public String NOM;\n    public void Calculer_prix() {}\n}`,clean:`public class InventionManager {\n    private String nom;\n    public void calculerPrix() {}\n}`,rule:"Conventions de nommage",violation:"Classe en minuscule, attribut public en MAJUSCULE, méthode avec underscore"},
    {dirty:`if(x>5){y=x*2;z=y+1;System.out.println(z);}`,clean:`if (x > 5) {\n    y = x * 2;\n    z = y + 1;\n    System.out.println(z);\n}`,rule:"Indentation et espaces",violation:"Tout sur une ligne, pas d'espaces, pas d'indentation"},
    {dirty:`// cette méthode calcule\n// elle prend un int\n// elle retourne un int\npublic int calc(int n) {\n    return n * 2; // multiplie par 2\n}`,clean:`/**\n * Double la valeur donnée.\n * @param valeur le nombre à doubler\n * @return le double de valeur\n */\npublic int doubler(int valeur) {\n    return valeur * 2;\n}`,rule:"Javadoc vs commentaires inutiles",violation:"Commentaires décrivant l'évident, pas de Javadoc, nom de méthode vague"},
    {dirty:`public void traiter(String n, int a, String v, double p, boolean d) {\n    // 50 lignes de code...\n}`,clean:`public void traiter(Invention invention) {\n    validerInvention(invention);\n    enregistrer(invention);\n    notifier(invention);\n}`,rule:"Méthodes courtes + objets",violation:"Trop de paramètres, méthode géante, noms cryptiques"},
  ];
  const[idx,setIdx]=useState(0);const[answered,setAnswered]=useState(false);const[score,setScore]=useState(0);
  const p=PAIRS[idx];
  const answer=()=>{if(answered)return;setAnswered(true);setScore(s=>s+20);};
  const next=()=>{if(idx+1>=PAIRS.length){onComplete(score+20);return;}setIdx(i=>i+1);setAnswered(false);};
  return(<div style={{background:C.card,borderRadius:12,padding:14,border:`1px solid ${C.border}`,margin:"10px 0"}}>
    <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:8}}><span style={{color:C.dimmed}}>Paire {idx+1}/{PAIRS.length}</span><span style={{color:C.gold,fontWeight:700}}>Score: {score}</span></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
      <div><div style={{fontSize:10,fontWeight:600,color:C.danger,marginBottom:4}}>CODE SALE</div><div style={{background:C.code,borderRadius:8,padding:10,fontFamily:"monospace",fontSize:10,color:C.danger+"cc",whiteSpace:"pre-wrap",border:`1px solid ${C.danger}30`}}>{p.dirty}</div></div>
      <div><div style={{fontSize:10,fontWeight:600,color:C.success,marginBottom:4}}>CODE PROPRE</div><div style={{background:C.code,borderRadius:8,padding:10,fontFamily:"monospace",fontSize:10,color:C.success+"cc",whiteSpace:"pre-wrap",border:`1px solid ${C.success}30`}}>{p.clean}</div></div>
    </div>
    {!answered?(<button onClick={answer} style={{width:"100%",marginTop:8,padding:"10px",borderRadius:8,border:"none",background:C.accent,color:C.bg,cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:700}}>J'ai identifié les violations !</button>):(
      <div style={{marginTop:8,animation:"fadeIn .3s"}}>
        <div style={{display:"flex",gap:6,marginBottom:6}}>
          <span style={{padding:"3px 10px",borderRadius:6,background:C.accent+"20",color:C.accent,fontSize:10,fontWeight:700}}>{p.rule}</span>
        </div>
        <div style={{fontSize:12,color:C.text,marginBottom:4}}><Strong c={C.danger}>Violations :</Strong> {p.violation}</div>
        <button onClick={next} style={{width:"100%",marginTop:6,padding:"8px",borderRadius:7,border:"none",background:C.accent,color:C.bg,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600}}>{idx+1>=PAIRS.length?"Terminer":"Suivant →"}</button>
      </div>
    )}
  </div>);
}

function Memo(){return(<div style={{background:C.card,borderRadius:12,padding:20,border:`1px solid ${C.gold}40`}}>
  <div style={{fontSize:16,fontWeight:700,color:C.gold,marginBottom:12}}>Mémo débloqué — Standards Java</div>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
    <div style={{background:C.code,borderRadius:8,padding:10}}><div style={{fontSize:11,fontWeight:600,color:C.accent,marginBottom:4}}>Conventions de nommage</div><div style={{fontSize:9,color:C.muted,lineHeight:1.6}}>Classe : PascalCase (InventionManager)<br/>Méthode/variable : camelCase (calculerPrix)<br/>Constante : UPPER_SNAKE (MAX_SIZE)<br/>Package : tout.en.minuscules<br/>Boolean : isActif, hasPermis, canDelete</div></div>
    <div style={{background:C.code,borderRadius:8,padding:10}}><div style={{fontSize:11,fontWeight:600,color:C.accent,marginBottom:4}}>Javadoc</div><pre style={{fontSize:8,color:C.codeText,fontFamily:"monospace",margin:0}}>{"/**\n * Description courte.\n * @param nom le paramètre\n * @return la valeur retournée\n * @throws Exception si erreur\n */"}</pre></div>
  </div>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:8}}>
    <div style={{background:C.success+"15",borderRadius:6,padding:8}}><div style={{fontSize:10,fontWeight:600,color:C.success}}>Bonnes pratiques</div><div style={{fontSize:9,color:C.muted}}>Méthodes courtes ({"<"} 20 lignes) · Noms descriptifs · Un fichier = une classe · Ctrl+Shift+F pour formater</div></div>
    <div style={{background:C.danger+"15",borderRadius:6,padding:8}}><div style={{fontSize:10,fontWeight:600,color:C.danger}}>À éviter</div><div style={{fontSize:9,color:C.muted}}>Variables à 1 lettre · Code dupliqué · Commentaires évidents · Méthodes géantes · Nombres magiques</div></div>
  </div>
</div>);}

const STEPS=[
  {section:"Théorie",title:"Pourquoi des standards ?",type:"theory",render:(onQ,done)=>(<>
    <P>Un code qui <Strong c={C.accent}>fonctionne</Strong> n'est pas forcément un <Strong c={C.accent}>bon</Strong> code. Un bon code est lisible, maintenable, et compréhensible par d'autres.</P>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,margin:"8px 0"}}>
      <div style={{background:C.danger+"12",borderRadius:8,padding:10}}><div style={{fontWeight:600,color:C.danger,fontSize:12}}>Sans standards</div><div style={{fontSize:11,color:C.muted,marginTop:4}}>Chacun nomme différemment. Code illisible après 2 semaines. Bugs cachés. Impossible de travailler en équipe.</div></div>
      <div style={{background:C.success+"12",borderRadius:8,padding:10}}><div style={{fontWeight:600,color:C.success,fontSize:12}}>Avec standards</div><div style={{fontSize:11,color:C.muted,marginTop:4}}>Code homogène. Facile à lire et modifier. Moins de bugs. Travail d'équipe efficace.</div></div>
    </div>
    <Tip title="Dans l'industrie">Google, Amazon, Oracle ont tous leurs propres guides de style. Les Java Naming Conventions sont un standard universel.</Tip>
    <Quiz q="Pourquoi les standards sont importants en ÉQUIPE ?" opts={["Pour impressionner le prof","Pour que tout le monde écrive de la même façon → code lisible par tous","Pour écrire moins de code","Pour que le code soit plus rapide"]} correct={1} onAns={onQ} done={done}/>
  </>)},
  {section:"Théorie",title:"Conventions de nommage Java",type:"theory",render:(onQ,done)=>(<>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,margin:"8px 0"}}>
      {[{n:"Classe",ex:"InventionManager",rule:"PascalCase",c:C.primary},{n:"Méthode / Variable",ex:"calculerPrix, nomComplet",rule:"camelCase",c:C.secondary},{n:"Constante",ex:"MAX_SIZE, TVA_RATE",rule:"UPPER_SNAKE_CASE + final",c:C.gold},{n:"Package",ex:"com.labo.inventions",rule:"tout en minuscules",c:C.accent}].map((item,i)=>(
        <div key={i} style={{background:C.code,borderRadius:8,padding:10,borderLeft:`3px solid ${item.c}`}}>
          <div style={{fontWeight:600,color:item.c,fontSize:12}}>{item.n}</div>
          <div style={{fontSize:11,color:C.codeText,fontFamily:"monospace",marginTop:4}}>{item.ex}</div>
          <div style={{fontSize:10,color:C.muted,marginTop:2}}>{item.rule}</div>
        </div>
      ))}
    </div>
    <Code code={`// BON\npublic class InventionManager {\n    private static final int MAX_INVENTIONS = 100;\n    private String nomInventeur;\n    \n    public void ajouterInvention(Invention invention) { ... }\n}\n\n// MAUVAIS\npublic class inventionmanager {\n    private static final int max = 100;\n    private String N;\n    \n    public void Add_invention(Invention i) { ... }\n}`}/>
    <Quiz q="Comment nommer une constante en Java ?" opts={["camelCase : maxSize","PascalCase : MaxSize","UPPER_SNAKE_CASE : MAX_SIZE","Tout en minuscules : maxsize"]} correct={2} onAns={onQ} done={done}/>
  </>)},
  {section:"Théorie",title:"Javadoc et commentaires",type:"theory",render:(onQ,done)=>(<>
    <P><Strong c={C.accent}>Javadoc</Strong> = documentation officielle des classes et méthodes publiques. Différent des commentaires normaux.</P>
    <Code hl={[0,1,2,3,4,5]} code={`/**\n * Recherche une invention par son nom.\n * @param nom le nom à rechercher (non null)\n * @return l'invention trouvée, ou null si absente\n * @throws IllegalArgumentException si nom est vide\n */\npublic Invention rechercher(String nom) {\n    if (nom == null || nom.isEmpty()) {\n        throw new IllegalArgumentException("nom vide");\n    }\n    // parcours de la liste\n    for (Invention inv : inventions) {\n        if (inv.getNom().equals(nom)) {\n            return inv;\n        }\n    }\n    return null;\n}`}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,margin:"8px 0"}}>
      <div style={{background:C.success+"12",borderRadius:8,padding:8}}><div style={{fontWeight:600,color:C.success,fontSize:11}}>Bons commentaires</div><div style={{fontSize:10,color:C.muted}}>Expliquent POURQUOI<br/>Javadoc sur les méthodes publiques<br/>Contexte que le code ne dit pas</div></div>
      <div style={{background:C.danger+"12",borderRadius:8,padding:8}}><div style={{fontWeight:600,color:C.danger,fontSize:11}}>Mauvais commentaires</div><div style={{fontSize:10,color:C.muted}}>Expliquent QUOI (évident)<br/>// incrémente i de 1<br/>Code commenté laissé en place</div></div>
    </div>
    <Tip title="Eclipse : Ctrl+Shift+F">Formate automatiquement tout le code (indentation, espaces, accolades). À utiliser avant chaque commit !</Tip>
    <Quiz q="Quand mettre du Javadoc ?" opts={["Sur chaque ligne de code","Sur les méthodes et classes publiques","Jamais, le code doit se suffire","Seulement sur les variables"]} correct={1} onAns={onQ} done={done}/>
  </>)},

  {section:"Défi",title:"Code Propre Challenge",type:"game",render:(_,__,onGC)=>(<>
    <P>5 paires de code : sale vs propre. Identifiez les violations de standards dans chaque version sale !</P>
    <CleanCodeGame onComplete={onGC}/>
  </>)},

  {section:"Code guidé",title:"Réécrire du code sale",type:"guided",render:(onQ,done)=>(<>
    <P>Prenons un programme réel et nettoyons-le.</P>
    <div style={{fontSize:12,fontWeight:600,color:C.danger,marginTop:6,marginBottom:3}}>Version SALE</div>
    <Code code={`public class inv {\n    public String n;\n    public int a;\n    public double p;\n    public inv(String n, int a, double p) {\n        this.n=n;this.a=a;this.p=p;\n    }\n    public void aff() {\n        System.out.println(n+" "+a+" "+p);\n    }\n}`}/>
    <div style={{fontSize:12,fontWeight:600,color:C.success,marginTop:6,marginBottom:3}}>Version PROPRE</div>
    <Code hl={[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]} code={`/**\n * Représente une invention du laboratoire.\n * @author Votre Nom\n */\npublic class Invention {\n    private String nom;\n    private int annee;\n    private double prix;\n\n    /**\n     * Crée une nouvelle invention.\n     * @param nom le nom de l'invention\n     * @param annee l'année de création\n     * @param prix le prix estimé\n     */\n    public Invention(String nom, int annee, double prix) {\n        this.nom = nom;\n        this.annee = annee;\n        this.prix = prix;\n    }\n\n    /**\n     * Affiche les détails de l'invention.\n     */\n    public void afficherDetails() {\n        System.out.println(nom + " (" + annee + ") - " + prix + " CHF");\n    }\n\n    // Getters\n    public String getNom() { return nom; }\n    public int getAnnee() { return annee; }\n    public double getPrix() { return prix; }\n}`}/>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:6,marginBottom:3}}>Corrections appliquées :</div>
    <div style={{fontSize:11,color:C.text,lineHeight:1.8}}>
      1. Classe renommée : <code style={{color:C.danger}}>inv</code> → <code style={{color:C.success}}>Invention</code> (PascalCase)<br/>
      2. Attributs <code style={{color:C.danger}}>public</code> → <code style={{color:C.success}}>private</code> + getters<br/>
      3. Noms descriptifs : <code style={{color:C.danger}}>n, a, p</code> → <code style={{color:C.success}}>nom, annee, prix</code><br/>
      4. Méthode renommée : <code style={{color:C.danger}}>aff()</code> → <code style={{color:C.success}}>afficherDetails()</code><br/>
      5. Espaces et indentation propres<br/>
      6. Javadoc ajoutée sur la classe et les méthodes
    </div>
    <Quiz q="Le changement le PLUS important ici ?" opts={["Ajouter des espaces","Renommer la classe en PascalCase","Passer les attributs en private (encapsulation)","Ajouter la Javadoc"]} correct={2} onAns={onQ} done={done}/>
  </>)},

  {section:"Exercice",title:"Créer un guide de style d'équipe",type:"exercise",render:(onQ,done)=>(<>
    <div style={{background:C.gold+"15",borderRadius:10,padding:14,border:`1px solid ${C.gold}40`}}>
      <div style={{fontSize:15,fontWeight:700,color:C.gold,marginBottom:4}}>Exercice — 60 Crédits R&D</div>
      <div style={{color:C.text,fontSize:13}}>Rédigez un STYLE_GUIDE.md pour votre projet et nettoyez votre code.</div>
    </div>
    <div style={{color:C.text,fontSize:12,lineHeight:1.8,marginTop:10}}>
      <Strong>Partie 1 — STYLE_GUIDE.md :</Strong><br/>
      1. Conventions de nommage de votre équipe<br/>
      2. Règles d'indentation et formatage<br/>
      3. Quand mettre du Javadoc<br/>
      4. Structure des fichiers et packages<br/><br/>
      <Strong>Partie 2 — Nettoyage du code :</Strong><br/>
      1. Appliquer Ctrl+Shift+F sur tous vos fichiers<br/>
      2. Renommer les variables/méthodes mal nommées<br/>
      3. Ajouter Javadoc sur toutes les classes et méthodes publiques<br/>
      4. Commit : <code style={{color:C.accent}}>refactor: apply coding standards</code>
    </div>
    <Quiz q="Pour D4, il faut évaluer les standards :" opts={["Juste les lister","Expliquer pourquoi ils sont nécessaires en équipe ET en individuel, avec des exemples de problèmes sans standards","Dire qu'ils ne sont pas importants","Copier le guide de Google"]} correct={1} onAns={onQ} done={done}/>
  </>)},

  {section:"Correction",title:"Checklist LO4 Standards",type:"correction",render:(onQ,done)=>(<>
    <div style={{background:C.success+"12",borderRadius:8,padding:10,border:`1px solid ${C.success}40`,marginBottom:8}}><div style={{fontSize:13,fontWeight:700,color:C.success}}>Checklist LO4 — Standards (P6, D4)</div></div>
    <div style={{fontSize:12,color:C.text,lineHeight:2}}>
      <Strong c={C.accent}>P6 — Expliquer les standards utilisés :</Strong><br/>
      ☐ Présenter le STYLE_GUIDE.md de l'équipe<br/>
      ☐ Montrer des exemples avant/après dans le code<br/>
      ☐ Nommer les conventions Java appliquées<br/><br/>
      <Strong c={C.accent}>D4 — Évaluer le rôle des standards :</Strong><br/>
      ☐ Pourquoi en équipe ? (lisibilité, cohérence, onboarding)<br/>
      ☐ Pourquoi en individuel ? (maintenance, relecture, professionnalisme)<br/>
      ☐ Exemples concrets de problèmes rencontrés sans standards<br/>
      ☐ Réflexion critique : avantages ET limites des standards<br/>
    </div>
    <Quiz q="LO4 est complet quand :" opts={["Le code compile","P5 (debugging) + P6 (standards) + M4 + D4 sont tous couverts","On a juste fait l'escape room","Le prof est content"]} correct={1} onAns={onQ} done={done}/>
  </>)},
];

export default function M10Unified(){
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
    <div style={{padding:"8px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:C.card,flexWrap:"wrap",gap:4}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:10,letterSpacing:2,color:C.dimmed}}>CODEQUEST</span><span style={{color:C.border}}>|</span><span style={{fontSize:12,fontWeight:600,color:C.accent}}>M10 · Standards</span></div><div style={{display:"flex",gap:10,fontSize:11}}><span style={{color:C.muted}}>Quiz <strong style={{color:C.success}}>{score}/{totalQ}</strong></span>{gameScore!==null&&<span style={{color:C.muted}}>Jeu <strong style={{color:C.accent}}>{gameScore}</strong></span>}<span style={{color:C.muted}}>CR <strong style={{color:C.gold}}>{credits}</strong></span></div></div>
    <div style={{display:"flex",maxWidth:1100,margin:"0 auto",minHeight:"calc(100vh - 42px)"}}>
      <div style={{width:200,borderRight:`1px solid ${C.border}`,padding:"10px 0",flexShrink:0,overflowY:"auto",display:"flex",flexDirection:"column"}}>
        {sections.map(sec=>{const sts=STEPS.map((s,i)=>({...s,idx:i})).filter(s=>s.section===sec);return(<div key={sec}><div style={{padding:"5px 12px",fontSize:9,letterSpacing:1,color:secC[sec]||C.dimmed,fontWeight:700,textTransform:"uppercase"}}>{sec}</div>{sts.map(s=>{const c2=s.idx===step,dn=!!completed[s.idx];return(<button key={s.idx} onClick={()=>{setStep(s.idx);persist(completed,score,totalQ,credits,gameScore,s.idx);}} style={{display:"flex",alignItems:"center",gap:5,width:"100%",padding:"4px 12px 4px 20px",border:"none",background:c2?C.accent+"12":"transparent",borderLeft:c2?`2px solid ${C.accent}`:"2px solid transparent",cursor:"pointer",fontFamily:"inherit",fontSize:11,color:c2?C.accent:dn?C.success:C.muted,textAlign:"left"}}><span style={{fontSize:8}}>{dn?"✓":"○"}</span>{s.title}</button>);})}</div>);})}
        <div style={{padding:10,marginTop:"auto"}}><div style={{height:3,background:C.border,borderRadius:2,overflow:"hidden",marginBottom:6}}><div style={{width:`${(Object.keys(completed).length/STEPS.length)*100}%`,height:"100%",background:`linear-gradient(90deg,${C.primary},${C.accent})`,borderRadius:2,transition:"width .5s"}}/></div>
        <button onClick={()=>allDone&&setShowMemo(!showMemo)} style={{width:"100%",padding:"8px",borderRadius:8,border:`1px solid ${allDone?C.gold:C.border}`,background:allDone?C.gold+"15":"transparent",color:allDone?C.gold:C.dimmed,cursor:allDone?"pointer":"default",fontFamily:"inherit",fontSize:11,fontWeight:600,opacity:allDone?1:0.5}}>{allDone?"25C9 Memo":"25CB Memo"}</button></div>
      </div>
      <div style={{flex:1,padding:"16px 24px",overflowY:"auto",maxHeight:"calc(100vh - 42px)"}}>{showMemo&&allDone?<Memo/>:(<div key={step} style={{animation:"fadeIn .25s"}}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}><span style={{fontSize:9,padding:"2px 8px",borderRadius:10,background:(secC[cur.section]||C.dimmed)+"20",color:secC[cur.section]||C.dimmed,fontWeight:600,letterSpacing:1}}>{cur.section.toUpperCase()}</span></div><h2 style={{fontSize:18,fontWeight:700,marginBottom:12}}>{cur.title}</h2>{cur.type==="game"?cur.render(handleQuiz,!!completed[step],handleGC):cur.render(handleQuiz,!!completed[step])}<div style={{display:"flex",justifyContent:"space-between",marginTop:24,paddingTop:10,borderTop:`1px solid ${C.border}`}}><button onClick={()=>go(-1)} disabled={step===0} style={{padding:"7px 16px",borderRadius:7,border:`1px solid ${C.border}`,background:"transparent",color:step===0?C.border:C.muted,cursor:step===0?"default":"pointer",fontFamily:"inherit",fontSize:12}}>←</button><button onClick={()=>go(1)} disabled={step===STEPS.length-1} style={{padding:"7px 16px",borderRadius:7,border:"none",background:step===STEPS.length-1?C.border:C.accent,color:step===STEPS.length-1?C.muted:C.bg,cursor:step===STEPS.length-1?"default":"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600}}>{step===STEPS.length-1?"Fin":"→"}</button></div></div>)}</div>
    </div>
  </div>);
}
