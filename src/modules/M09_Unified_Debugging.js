import { useState, useEffect, useCallback } from "react";

const C={bg:"#0a0f1a",card:"#111827",primary:"#0D7377",secondary:"#14A3C7",accent:"#32E0C4",gold:"#F59E0B",text:"#e2e8f0",muted:"#94a3b8",dimmed:"#64748b",border:"#1e293b",success:"#10B981",danger:"#EF4444",code:"#1E293B",codeBorder:"#2d3a4f",codeText:"#32E0C4",comment:"#6b7f99",keyword:"#c792ea",string:"#c3e88d",number:"#f78c6c",type:"#ffcb6b"};
const KEY="cq-m09-unified";
async function ld(){try{const r=await window.storage.get(KEY);return r?JSON.parse(r.value):null;}catch{return null;}}
async function sv(d){try{await window.storage.set(KEY,JSON.stringify(d));}catch{}}
function Code({code,hl=[]}){const lines=code.split("\n");return(<div style={{background:C.code,border:`1px solid ${C.codeBorder}`,borderRadius:10,overflow:"hidden",fontSize:12,fontFamily:"'JetBrains Mono',monospace",margin:"8px 0"}}><div style={{display:"flex",gap:5,padding:"5px 10px",background:"#0d1117",borderBottom:`1px solid ${C.codeBorder}`}}><span style={{width:7,height:7,borderRadius:"50%",background:"#ff5f57"}}/><span style={{width:7,height:7,borderRadius:"50%",background:"#febc2e"}}/><span style={{width:7,height:7,borderRadius:"50%",background:"#28c840"}}/></div><div style={{padding:"8px 0",overflowX:"auto"}}>{lines.map((l,i)=>(<div key={i} style={{display:"flex",padding:"1px 0",background:hl.includes(i)?C.accent+"12":"transparent",borderLeft:hl.includes(i)?`3px solid ${C.accent}`:"3px solid transparent"}}><span style={{width:32,textAlign:"right",paddingRight:8,color:C.dimmed,userSelect:"none",flexShrink:0,fontSize:10}}>{i+1}</span><span style={{color:C.codeText,whiteSpace:"pre"}}>{l}</span></div>))}</div></div>);}
function Quiz({q,opts,correct,onAns,done}){const[sel,setSel]=useState(null);return(<div style={{margin:"12px 0"}}><div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:6}}>{q}</div>{opts.map((o,i)=>{let bg=C.card,bc=C.border;if(done&&i===correct){bg=C.success+"20";bc=C.success;}else if(done&&sel===i){bg=C.danger+"20";bc=C.danger;}return(<button key={i} onClick={()=>{if(done)return;setSel(i);onAns(i===correct);}} style={{display:"block",width:"100%",textAlign:"left",padding:"7px 11px",marginBottom:3,borderRadius:7,border:`1px solid ${bc}`,background:bg,color:C.text,cursor:done?"default":"pointer",fontFamily:"inherit",fontSize:12}}>{String.fromCharCode(65+i)}. {o}</button>);})}</div>);}
function Task({children}){return(<div style={{background:C.primary+"15",borderRadius:8,padding:12,border:`1px solid ${C.primary}40`,margin:"10px 0"}}><div style={{fontSize:12,fontWeight:600,color:C.accent,marginBottom:4}}>A faire dans Eclipse</div><div style={{color:C.text,fontSize:12,lineHeight:1.6}}>{children}</div></div>);}
function Tip({title,children,color=C.gold}){return(<div style={{background:color+"15",borderRadius:7,padding:10,border:`1px solid ${color}40`,margin:"8px 0"}}><div style={{fontSize:11,fontWeight:600,color,marginBottom:3}}>{title}</div><div style={{color:C.text,fontSize:11,lineHeight:1.5}}>{children}</div></div>);}
function P({children}){return <p style={{color:C.muted,fontSize:13,lineHeight:1.7,marginBottom:6}}>{children}</p>;}
function Strong({children,c=C.text}){return <strong style={{color:c}}>{children}</strong>;}
function Ac({children}){return <code style={{color:C.accent,fontSize:12}}>{children}</code>;}

// ═══ GAME: DEBUG ESCAPE ROOM ═══
function EscapeGame({onComplete}){
  const BUGS=[
    {code:`for (int i = 1; i <= 10; i++) {\n    if (i = 5) {  // ligne 2\n        System.out.println("Trouvé !");\n    }\n}`,bug:"Affectation au lieu de comparaison",line:2,hint:"= vs ==",fix:"if (i == 5)",type:"compilation"},
    {code:`String[] noms = {"Ada", "Bob", "Eve"};\nfor (int i = 0; i <= noms.length; i++) {\n    System.out.println(noms[i]);\n}`,bug:"ArrayIndexOutOfBoundsException (off-by-one)",line:2,hint:"<= devrait être <",fix:"i < noms.length",type:"runtime"},
    {code:`public int calculerMoyenne(int[] notes) {\n    int somme = 0;\n    for (int n : notes) {\n        somme += n;\n    }\n    return somme / notes.length;\n}`,bug:"Division entière perd les décimales",line:6,hint:"int / int = int en Java",fix:"return (double) somme / notes.length; et retourner double",type:"logique"},
    {code:`String nom = null;\nif (nom.length() > 0) {\n    System.out.println(nom);\n}`,bug:"NullPointerException",line:2,hint:"Appeler une méthode sur null",fix:"if (nom != null && nom.length() > 0)",type:"runtime"},
    {code:`int compteur = 10;\nwhile (compteur > 0) {\n    System.out.println(compteur);\n    // compteur-- manquant !\n}`,bug:"Boucle infinie (compteur ne change jamais)",line:4,hint:"La variable de contrôle ne change pas",fix:"Ajouter compteur-- dans la boucle",type:"logique"},
    {code:`ArrayList<String> liste = new ArrayList<>();\nliste.add("A"); liste.add("B"); liste.add("C");\nfor (int i = 0; i < liste.size(); i++) {\n    if (liste.get(i).equals("B")) {\n        liste.remove(i);\n    }\n}`,bug:"ConcurrentModification — l'index décale après remove",line:5,hint:"Supprimer en itérant décale les index",fix:"Itérer à l'envers ou utiliser Iterator",type:"logique"},
  ];
  const[found,setFound]=useState(Array(BUGS.length).fill(false));
  const[current,setCurrent]=useState(0);
  const[showHint,setShowHint]=useState(false);
  const[showFix,setShowFix]=useState(false);
  const[score,setScore]=useState(0);
  const[timer,setTimer]=useState(300);
  const[done,setDone]=useState(false);

  useEffect(()=>{if(done||timer<=0)return;const t=setInterval(()=>setTimer(v=>{if(v<=1){clearInterval(t);setDone(true);onComplete(score);return 0;}return v-1;}),1000);return()=>clearInterval(t);},[done,timer]);

  const findBug=()=>{if(found[current])return;const nf=[...found];nf[current]=true;setFound(nf);const pts=showHint?10:20;setScore(s=>s+pts);const allDone=nf.every(Boolean);if(allDone){setDone(true);onComplete(score+pts+Math.floor(timer/6));}};
  const b=BUGS[current];const mm=Math.floor(timer/60);const ss=timer%60;
  const typeColors={compilation:C.danger,runtime:"#F97316",logique:C.gold};

  return(<div style={{background:C.card,borderRadius:12,padding:14,border:`1px solid ${C.border}`,margin:"10px 0"}}>
    <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:8}}>
      <span style={{color:C.dimmed}}>Bug {current+1}/{BUGS.length}</span>
      <span style={{color:C.gold,fontWeight:700}}>Score: {score}</span>
      <span style={{color:timer<60?C.danger:C.muted,fontWeight:600}}>{mm}:{ss.toString().padStart(2,"0")}</span>
    </div>
    <div style={{display:"flex",gap:4,marginBottom:8}}>{BUGS.map((_,i)=>(<div key={i} style={{flex:1,height:4,borderRadius:2,background:found[i]?C.success:i===current?C.accent:C.border}}/>))}</div>
    <div style={{background:C.code,borderRadius:8,padding:12,fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:C.codeText,whiteSpace:"pre-wrap",marginBottom:8,border:`1px solid ${found[current]?C.success+"50":C.codeBorder}`}}>{b.code}</div>
    <div style={{display:"flex",gap:4,marginBottom:6,flexWrap:"wrap"}}>
      <span style={{padding:"2px 8px",borderRadius:5,background:typeColors[b.type]+"20",color:typeColors[b.type],fontSize:10,fontWeight:600}}>{b.type.toUpperCase()}</span>
      {found[current]&&<span style={{padding:"2px 8px",borderRadius:5,background:C.success+"20",color:C.success,fontSize:10,fontWeight:600}}>TROUVÉ — Ligne {b.line}</span>}
    </div>
    {!found[current]?(<div style={{display:"flex",gap:6}}>
      <button onClick={()=>setShowHint(true)} style={{padding:"6px 12px",borderRadius:6,border:`1px solid ${C.border}`,background:"transparent",color:C.gold,cursor:"pointer",fontFamily:"inherit",fontSize:11}}>Indice (-10pts)</button>
      <button onClick={findBug} style={{flex:1,padding:"8px",borderRadius:6,border:"none",background:C.danger,color:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600}}>J'ai trouvé le bug !</button>
    </div>):(<div>
      <div style={{fontSize:12,fontWeight:600,color:C.text,marginBottom:4}}>{b.bug}</div>
      <button onClick={()=>setShowFix(!showFix)} style={{padding:"4px 10px",borderRadius:5,border:`1px solid ${C.border}`,background:"transparent",color:C.accent,cursor:"pointer",fontFamily:"inherit",fontSize:11,marginBottom:4}}>{showFix?"Masquer":"Voir"} la correction</button>
      {showFix&&<div style={{background:C.success+"10",borderRadius:6,padding:8,fontSize:11,color:C.success,border:`1px solid ${C.success}30`}}>{b.fix}</div>}
    </div>)}
    {showHint&&!found[current]&&<div style={{background:C.gold+"15",borderRadius:6,padding:8,fontSize:11,color:C.gold,marginTop:6}}>Indice : {b.hint}</div>}
    <div style={{display:"flex",gap:6,marginTop:8}}>
      <button onClick={()=>{setCurrent(c=>Math.max(0,c-1));setShowHint(false);setShowFix(false);}} disabled={current===0} style={{padding:"6px 14px",borderRadius:6,border:`1px solid ${C.border}`,background:"transparent",color:current===0?C.border:C.muted,cursor:current===0?"default":"pointer",fontFamily:"inherit",fontSize:11}}>←</button>
      <button onClick={()=>{setCurrent(c=>Math.min(BUGS.length-1,c+1));setShowHint(false);setShowFix(false);}} disabled={current===BUGS.length-1} style={{flex:1,padding:"6px",borderRadius:6,border:"none",background:current===BUGS.length-1?C.border:C.accent,color:current===BUGS.length-1?C.muted:C.bg,cursor:current===BUGS.length-1?"default":"pointer",fontFamily:"inherit",fontSize:11,fontWeight:600}}>Bug suivant →</button>
    </div>
  </div>);
}

function Memo(){return(<div style={{background:C.card,borderRadius:12,padding:20,border:`1px solid ${C.gold}40`}}>
  <div style={{fontSize:16,fontWeight:700,color:C.gold,marginBottom:12}}>Mémo débloqué — Debugging Eclipse</div>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
    <div style={{background:C.code,borderRadius:8,padding:10}}><div style={{fontSize:11,fontWeight:600,color:C.accent,marginBottom:4}}>Outils du debugger</div><div style={{fontSize:9,color:C.muted,lineHeight:1.6}}>Breakpoint : double-clic marge gauche<br/>Step Over (F6) : ligne suivante<br/>Step Into (F5) : entrer dans la méthode<br/>Step Return (F7) : sortir de la méthode<br/>Resume (F8) : continuer jusqu'au prochain breakpoint<br/>Watch : clic-droit variable → Watch</div></div>
    <div style={{background:C.code,borderRadius:8,padding:10}}><div style={{fontSize:11,fontWeight:600,color:C.accent,marginBottom:4}}>Méthodologie</div><div style={{fontSize:9,color:C.muted,lineHeight:1.6}}>1. Lire le message d'erreur<br/>2. Reproduire systématiquement<br/>3. Isoler (diviser et conquérir)<br/>4. Poser un breakpoint AVANT le crash<br/>5. Step Over et observer les variables<br/>6. Corriger et vérifier</div></div>
  </div>
  <div style={{background:C.danger+"15",borderRadius:6,padding:8,marginTop:8}}><div style={{fontSize:10,fontWeight:600,color:C.danger}}>Bugs fréquents</div><div style={{fontSize:9,color:C.muted}}>= vs == · off-by-one ({"<="} vs {"<"}) · NullPointerException · Boucle infinie · Division entière · ConcurrentModification</div></div>
</div>);}

const STEPS=[
  {section:"Théorie",title:"Le Debugging : pourquoi et comment",type:"theory",render:(onQ,done)=>(<>
    <P>Un programme qui compile n'est pas forcément correct. Le <Strong c={C.accent}>debugging</Strong> = trouver et corriger les erreurs dans un programme qui s'exécute mais fait la mauvaise chose.</P>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,margin:"8px 0"}}>
      <div style={{background:C.danger+"12",borderRadius:8,padding:10}}><div style={{fontWeight:600,color:C.danger,fontSize:12}}>Erreur de compilation</div><div style={{fontSize:11,color:C.muted,marginTop:4}}>Le code ne compile pas. Eclipse souligne en rouge. Ex : oublier un ;</div></div>
      <div style={{background:"#F97316"+"12",borderRadius:8,padding:10}}><div style={{fontWeight:600,color:"#F97316",fontSize:12}}>Erreur d'exécution</div><div style={{fontSize:11,color:C.muted,marginTop:4}}>Le programme plante en cours de route. Ex : NullPointerException</div></div>
      <div style={{background:C.gold+"12",borderRadius:8,padding:10}}><div style={{fontWeight:600,color:C.gold,fontSize:12}}>Erreur logique</div><div style={{fontSize:11,color:C.muted,marginTop:4}}>Le programme tourne mais le résultat est faux. La plus vicieuse.</div></div>
    </div>
    <P>Le debugger Eclipse permet de <Strong>stopper le programme à un endroit précis</Strong> et d'observer l'état de toutes les variables.</P>
    <Quiz q="Quelle erreur est la plus difficile à trouver ?" opts={["Compilation (Eclipse la signale)","Exécution (le programme plante avec un message)","Logique (le programme tourne mais le résultat est faux)","Aucune, le compilateur trouve tout"]} correct={2} onAns={onQ} done={done}/>
  </>)},
  {section:"Théorie",title:"Les outils du debugger Eclipse",type:"theory",render:(onQ,done)=>(<>
    <P>Eclipse a un <Strong c={C.accent}>mode Debug</Strong> avec des outils puissants :</P>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,margin:"8px 0"}}>
      <div style={{background:C.code,borderRadius:8,padding:10}}><div style={{fontWeight:600,color:C.accent,fontSize:12}}>Breakpoint</div><div style={{fontSize:11,color:C.muted,marginTop:4}}>Double-clic dans la marge gauche → point bleu. Le programme s'arrête à cette ligne.</div></div>
      <div style={{background:C.code,borderRadius:8,padding:10}}><div style={{fontWeight:600,color:C.accent,fontSize:12}}>Step Over (F6)</div><div style={{fontSize:11,color:C.muted,marginTop:4}}>Exécute la ligne actuelle et passe à la suivante. Ne rentre pas dans les méthodes.</div></div>
      <div style={{background:C.code,borderRadius:8,padding:10}}><div style={{fontWeight:600,color:C.accent,fontSize:12}}>Step Into (F5)</div><div style={{fontSize:11,color:C.muted,marginTop:4}}>Rentre DANS la méthode appelée. Pour voir ce qui se passe à l'intérieur.</div></div>
      <div style={{background:C.code,borderRadius:8,padding:10}}><div style={{fontWeight:600,color:C.accent,fontSize:12}}>Watch List</div><div style={{fontSize:11,color:C.muted,marginTop:4}}>Clic-droit sur une variable → Watch. Sa valeur s'affiche en temps réel dans le panneau.</div></div>
    </div>
    <Tip title="Tracing">Le tracing = suivre le flux d'exécution ligne par ligne. Avec Step Over, on voit exactement QUEL chemin le programme prend dans les if/else et les boucles.</Tip>
    <Task>1. Ouvrez un programme avec une boucle for<br/>2. Posez un breakpoint sur la première ligne de la boucle<br/>3. Lancez en mode Debug (icône insecte)<br/>4. Appuyez sur F6 pour avancer pas à pas<br/>5. Observez la variable i changer dans la Watch List</Task>
    <Quiz q="Step Over (F6) fait quoi exactement ?" opts={["Saute la ligne sans l'exécuter","Exécute la ligne et passe à la suivante","Rentre dans la méthode appelée","Arrête le debugger"]} correct={1} onAns={onQ} done={done}/>
  </>)},
  {section:"Théorie",title:"Techniques de résolution structurée",type:"theory",render:(onQ,done)=>(<>
    <P>Le debugging n'est pas du hasard. Voici une <Strong c={C.accent}>méthode systématique</Strong> :</P>
    <div style={{margin:"8px 0"}}>
      {["1. Lire le message d'erreur — la stack trace dit EXACTEMENT où le crash s'est produit","2. Reproduire — trouver les étapes EXACTES pour reproduire le bug à chaque fois","3. Isoler — diviser et conquérir : le bug est-il dans la partie A ou B du code ?","4. Breakpoint AVANT — poser le breakpoint juste AVANT la ligne suspecte","5. Observer — Step Over et regarder les variables. Laquelle a une valeur inattendue ?","6. Corriger — changer UNE chose à la fois, puis retester"].map((s,i)=>(
        <div key={i} style={{display:"flex",gap:8,marginBottom:4,padding:"6px 10px",borderRadius:6,background:i%2===0?C.code:C.card}}>
          <span style={{color:C.accent,fontWeight:700,fontSize:14,flexShrink:0}}>{i+1}</span>
          <span style={{color:C.text,fontSize:11}}>{s.split(" — ")[0].slice(2)}</span>
          {s.includes(" — ")&&<span style={{color:C.muted,fontSize:10}}>— {s.split(" — ")[1]}</span>}
        </div>
      ))}
    </div>
    <Tip title="Rubber Duck Debugging">Expliquer le code à un canard en plastique (ou un collègue). Le simple fait de VERBALISER le comportement attendu révèle souvent le bug.</Tip>
    <Quiz q="Première chose à faire face à un crash ?" opts={["Changer du code au hasard","Lire le message d'erreur et la stack trace","Tout recommencer","Demander au prof"]} correct={1} onAns={onQ} done={done}/>
  </>)},

  {section:"Défi",title:"Escape Room du Code",type:"game",render:(_,__,onGC)=>(<>
    <P>6 bugs cachés. 5 minutes chrono. Trouvez-les tous ! Chaque bug trouvé sans indice = 20 points, avec indice = 10 points. Bonus temps restant.</P>
    <EscapeGame onComplete={onGC}/>
  </>)},

  {section:"Code guidé",title:"Debugger pas à pas dans Eclipse",type:"guided",render:(onQ,done)=>(<>
    <P>On va traquer un bug logique avec le debugger.</P>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:6,marginBottom:3}}>Le programme bugué</div>
    <Code hl={[5,6]} code={`public static int trouverMax(int[] tab) {\n    int max = 0;  // BUG : et si tous les nombres sont négatifs ?\n    for (int i = 0; i < tab.length; i++) {\n        if (tab[i] > max) {\n            max = tab[i];\n        }\n    }\n    return max;\n}\n\n// Test : trouverMax({-3, -1, -7}) retourne 0 au lieu de -1 !`}/>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:6,marginBottom:3}}>Étape 1 : Poser un breakpoint</div>
    <P>Double-cliquez dans la marge à la ligne 2 (<Ac>int max = 0</Ac>). Un point bleu apparaît.</P>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:6,marginBottom:3}}>Étape 2 : Lancer en mode Debug</div>
    <P>Cliquez l'icône insecte (pas le triangle vert). Le programme s'arrête à la ligne 2.</P>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:6,marginBottom:3}}>Étape 3 : Observer avec Step Over</div>
    <P>F6 pour avancer. Regardez la variable <Ac>max</Ac> dans la Watch List. Elle reste à 0 même quand on compare -3 {">"} 0 → false ! Le bug est là : max devrait commencer à <Ac>tab[0]</Ac> ou <Ac>Integer.MIN_VALUE</Ac>.</P>
    <Code hl={[1]} code={`public static int trouverMax(int[] tab) {\n    int max = tab[0];  // CORRECTION !\n    for (int i = 1; i < tab.length; i++) {\n        if (tab[i] > max) {\n            max = tab[i];\n        }\n    }\n    return max;\n}`}/>
    <Task>1. Tapez le code bugué dans Eclipse<br/>2. Testez avec {"{-3, -1, -7}"} → résultat 0 (faux !)<br/>3. Posez un breakpoint et debuggez pas à pas<br/>4. Corrigez et retestez → résultat -1 (correct !)</Task>
    <Quiz q="Pourquoi int max = 0 est un bug ?" opts={["0 n'est pas un int valide","Si tous les nombres sont négatifs, aucun n'est > 0","La boucle ne s'exécute pas","max devrait être final"]} correct={1} onAns={onQ} done={done}/>
  </>)},

  {section:"Exercice",title:"Traquer les bugs du Catalogue",type:"exercise",render:(onQ,done)=>(<>
    <div style={{background:C.gold+"15",borderRadius:10,padding:14,border:`1px solid ${C.gold}40`}}>
      <div style={{fontSize:15,fontWeight:700,color:C.gold,marginBottom:4}}>Exercice — 80 Crédits R&D</div>
      <div style={{color:C.text,fontSize:13}}>Un Catalogue d'Inventions avec 5 bugs cachés. Trouvez-les tous avec le debugger Eclipse.</div>
    </div>
    <div style={{color:C.text,fontSize:12,lineHeight:1.8,marginTop:10}}>
      <Strong>Pour chaque bug :</Strong><br/>
      1. Identifier le type (compilation / runtime / logique)<br/>
      2. Localiser la ligne exacte avec le debugger<br/>
      3. Expliquer POURQUOI c'est un bug<br/>
      4. Corriger<br/>
      5. Faire une capture d'écran du breakpoint + Watch List<br/><br/>
      <Strong c={C.gold}>Bonus :</Strong> Documenter votre processus de debugging dans un fichier DEBUG_REPORT.md
    </div>
    <Quiz q="Pour documenter le debugging (P5), il faut montrer :" opts={["Juste le code corrigé","Des captures d'écran des breakpoints, watch lists, et le processus étape par étape","Un seul paragraphe d'explication","Rien, le code suffit"]} correct={1} onAns={onQ} done={done}/>
  </>)},

  {section:"Correction",title:"Correction debugging",type:"correction",render:(onQ,done)=>(<>
    <div style={{background:C.success+"12",borderRadius:8,padding:10,border:`1px solid ${C.success}40`,marginBottom:8}}><div style={{fontSize:13,fontWeight:700,color:C.success}}>Checklist LO4 — Debugging (P5, M4)</div></div>
    <div style={{fontSize:12,color:C.text,lineHeight:2}}>
      <Strong c={C.accent}>P5 — Expliquer le debugging :</Strong><br/>
      ☐ Nommer les outils : breakpoint, step over, step into, watch list<br/>
      ☐ Captures d'écran du debugger Eclipse en action<br/>
      ☐ Expliquer le processus pas à pas<br/><br/>
      <Strong c={C.accent}>M4 — Debugging pour la sécurité :</Strong><br/>
      ☐ Montrer comment le debugging trouve des vulnérabilités<br/>
      ☐ Exemple concret : NullPointerException trouvée et corrigée<br/>
      ☐ Montrer que le code est plus robuste APRÈS debugging<br/>
    </div>
    <Tip title="Pour le rapport">Chaque bug documenté = une section avec : description, capture debugger, explication, correction. Format : DEBUG_REPORT.md dans le repo Git.</Tip>
    <Quiz q="M4 demande de montrer que le debugging :" opts={["Rend le code plus rapide","Aide à développer des applications plus sécurisées et robustes","Remplace les tests","Est optionnel en production"]} correct={1} onAns={onQ} done={done}/>
  </>)},
];

export default function M09Unified(){
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
    <div style={{padding:"8px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:C.card,flexWrap:"wrap",gap:4}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:10,letterSpacing:2,color:C.dimmed}}>CODEQUEST</span><span style={{color:C.border}}>|</span><span style={{fontSize:12,fontWeight:600,color:C.accent}}>M09 · Debugging</span></div><div style={{display:"flex",gap:10,fontSize:11}}><span style={{color:C.muted}}>Quiz <strong style={{color:C.success}}>{score}/{totalQ}</strong></span>{gameScore!==null&&<span style={{color:C.muted}}>Escape <strong style={{color:C.accent}}>{gameScore}</strong></span>}<span style={{color:C.muted}}>CR <strong style={{color:C.gold}}>{credits}</strong></span></div></div>
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
