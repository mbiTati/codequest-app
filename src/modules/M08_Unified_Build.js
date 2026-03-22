import { useState, useEffect, useCallback } from "react";

const C={bg:"#0a0f1a",card:"#111827",primary:"#0D7377",secondary:"#14A3C7",accent:"#32E0C4",gold:"#F59E0B",text:"#e2e8f0",muted:"#94a3b8",dimmed:"#64748b",border:"#1e293b",success:"#10B981",danger:"#EF4444",code:"#1E293B",codeBorder:"#2d3a4f",codeText:"#32E0C4",comment:"#6b7f99",keyword:"#c792ea",string:"#c3e88d"};
const KEY="cq-m08-unified";
async function ld(){try{const r=await window.storage.get(KEY);return r?JSON.parse(r.value):null;}catch{return null;}}
async function sv(d){try{await window.storage.set(KEY,JSON.stringify(d));}catch{}}
function Code({code,hl=[]}){const lines=code.split("\n");return(<div style={{background:C.code,border:`1px solid ${C.codeBorder}`,borderRadius:10,overflow:"hidden",fontSize:12,fontFamily:"'JetBrains Mono',monospace",margin:"8px 0"}}><div style={{display:"flex",gap:5,padding:"5px 10px",background:"#0d1117",borderBottom:`1px solid ${C.codeBorder}`}}><span style={{width:7,height:7,borderRadius:"50%",background:"#ff5f57"}}/><span style={{width:7,height:7,borderRadius:"50%",background:"#febc2e"}}/><span style={{width:7,height:7,borderRadius:"50%",background:"#28c840"}}/></div><div style={{padding:"8px 0",overflowX:"auto"}}>{lines.map((l,i)=>(<div key={i} style={{display:"flex",padding:"1px 0",background:hl.includes(i)?C.accent+"12":"transparent",borderLeft:hl.includes(i)?`3px solid ${C.accent}`:"3px solid transparent"}}><span style={{width:32,textAlign:"right",paddingRight:8,color:C.dimmed,userSelect:"none",flexShrink:0,fontSize:10}}>{i+1}</span><span style={{color:C.codeText,whiteSpace:"pre"}}>{l}</span></div>))}</div></div>);}
function Quiz({q,opts,correct,onAns,done}){const[sel,setSel]=useState(null);return(<div style={{margin:"12px 0"}}><div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:6}}>{q}</div>{opts.map((o,i)=>{let bg=C.card,bc=C.border;if(done&&i===correct){bg=C.success+"20";bc=C.success;}else if(done&&sel===i){bg=C.danger+"20";bc=C.danger;}return(<button key={i} onClick={()=>{if(done)return;setSel(i);onAns(i===correct);}} style={{display:"block",width:"100%",textAlign:"left",padding:"7px 11px",marginBottom:3,borderRadius:7,border:`1px solid ${bc}`,background:bg,color:C.text,cursor:done?"default":"pointer",fontFamily:"inherit",fontSize:12}}>{String.fromCharCode(65+i)}. {o}</button>);})}</div>);}
function Task({children}){return(<div style={{background:C.primary+"15",borderRadius:8,padding:12,border:`1px solid ${C.primary}40`,margin:"10px 0"}}><div style={{fontSize:12,fontWeight:600,color:C.accent,marginBottom:4}}>A faire</div><div style={{color:C.text,fontSize:12,lineHeight:1.6}}>{children}</div></div>);}
function Tip({title,children,color=C.gold}){return(<div style={{background:color+"15",borderRadius:7,padding:10,border:`1px solid ${color}40`,margin:"8px 0"}}><div style={{fontSize:11,fontWeight:600,color,marginBottom:3}}>{title}</div><div style={{color:C.text,fontSize:11,lineHeight:1.5}}>{children}</div></div>);}
function P({children}){return <p style={{color:C.muted,fontSize:13,lineHeight:1.7,marginBottom:6}}>{children}</p>;}
function Strong({children,c=C.text}){return <strong style={{color:c}}>{children}</strong>;}
function Ac({children}){return <code style={{color:C.accent,fontSize:12}}>{children}</code>;}

// ═══ GAME: DEPLOY PIPELINE ═══
function DeployGame({onComplete}){
  const PIPELINE=[
    {step:"Écrire le code Java",icon:"💻",desc:"Les fichiers .java dans src/"},
    {step:"Compiler (javac)",icon:"⚙️",desc:"Transforme .java en .class (bytecode)"},
    {step:"Tester (exécuter)",icon:"▶️",desc:"java Main → vérifier que tout marche"},
    {step:"Créer le Manifest",icon:"📄",desc:"MANIFEST.MF avec Main-Class"},
    {step:"Empaqueter (jar)",icon:"📦",desc:"jar cfm app.jar MANIFEST.MF *.class"},
    {step:"Tester le JAR",icon:"🧪",desc:"java -jar app.jar"},
    {step:"Commit + Push Git",icon:"📤",desc:"git add . && git commit && git push"},
    {step:"Créer une Release GitHub",icon:"🏷️",desc:"Tag v1.0 + upload du JAR"},
  ];
  const[order,setOrder]=useState(()=>[...PIPELINE].sort(()=>Math.random()-.5));
  const[checked,setChecked]=useState(false);const[score,setScore]=useState(0);
  const move=(from,dir)=>{const to=from+dir;if(to<0||to>=order.length)return;const n=[...order];[n[from],n[to]]=[n[to],n[from]];setOrder(n);};
  const check=()=>{setChecked(true);let pts=0;order.forEach((item,i)=>{if(item.step===PIPELINE[i].step)pts+=15;});setScore(pts);onComplete(pts);};
  return(<div style={{background:C.card,borderRadius:12,padding:14,border:`1px solid ${C.border}`,margin:"10px 0"}}>
    <div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:8}}>Remettez les étapes du déploiement dans le bon ordre :</div>
    {order.map((item,i)=>{const isCorrect=checked&&item.step===PIPELINE[i].step;const isWrong=checked&&!isCorrect;
    return(<div key={item.step} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:8,marginBottom:4,background:isCorrect?C.success+"15":isWrong?C.danger+"10":C.code,border:`1px solid ${isCorrect?C.success+"40":isWrong?C.danger+"30":C.codeBorder}`,transition:"all .2s"}}>
      <div style={{display:"flex",flexDirection:"column",gap:2}}>
        <button onClick={()=>move(i,-1)} disabled={checked||i===0} style={{background:"none",border:"none",color:C.muted,cursor:checked?"default":"pointer",fontSize:12,padding:0}}>▲</button>
        <button onClick={()=>move(i,1)} disabled={checked||i===order.length-1} style={{background:"none",border:"none",color:C.muted,cursor:checked?"default":"pointer",fontSize:12,padding:0}}>▼</button>
      </div>
      <span style={{fontSize:14}}>{item.icon}</span>
      <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:C.text}}>{item.step}</div><div style={{fontSize:10,color:C.muted}}>{item.desc}</div></div>
      {checked&&<span style={{fontSize:12,fontWeight:700,color:isCorrect?C.success:C.danger}}>{isCorrect?"✓":"✗"}</span>}
    </div>);})}
    {!checked?<button onClick={check} style={{width:"100%",marginTop:8,padding:"10px",borderRadius:8,border:"none",background:C.accent,color:C.bg,cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:700}}>Vérifier l'ordre</button>:
    <div style={{textAlign:"center",marginTop:8,fontSize:14,fontWeight:700,color:C.gold}}>{score}/120 points</div>}
  </div>);
}

function Memo(){return(<div style={{background:C.card,borderRadius:12,padding:20,border:`1px solid ${C.gold}40`}}>
  <div style={{fontSize:16,fontWeight:700,color:C.gold,marginBottom:12}}>Mémo débloqué — Build & Deploy</div>
  <div style={{background:C.code,borderRadius:8,padding:10,marginBottom:8}}>
    <pre style={{margin:0,fontSize:10,color:C.codeText,fontFamily:"monospace"}}>{"# Compiler\njavac -d bin src/*.java\n\n# Créer le manifest\necho 'Main-Class: Main' > MANIFEST.MF\n\n# Empaqueter en JAR\njar cfm MonApp.jar MANIFEST.MF -C bin .\n\n# Exécuter le JAR\njava -jar MonApp.jar\n\n# GitHub Release\ngit tag v1.0\ngit push origin v1.0"}</pre>
  </div>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
    <div style={{background:C.success+"15",borderRadius:6,padding:8}}><div style={{fontSize:10,fontWeight:600,color:C.success}}>Pipeline</div><div style={{fontSize:9,color:C.muted}}>Code → Compile → Test → JAR → Push → Release</div></div>
    <div style={{background:C.danger+"15",borderRadius:6,padding:8}}><div style={{fontSize:10,fontWeight:600,color:C.danger}}>Erreurs fréquentes</div><div style={{fontSize:9,color:C.muted}}>Main-Class manquant · pas de bin/ · oubli de tag · JAR sans manifest</div></div>
  </div>
</div>);}

const STEPS=[
  {section:"Théorie",title:"Du code au programme exécutable",type:"theory",render:(onQ,done)=>(<>
    <P>Votre code Java n'est pas directement exécutable par l'ordinateur. Il faut le <Strong c={C.accent}>compiler</Strong> puis l'<Strong c={C.accent}>empaqueter</Strong>.</P>
    <div style={{display:"flex",gap:4,margin:"10px 0",flexWrap:"wrap"}}>
      {[{t:".java",d:"Code source",c:C.secondary},{t:"javac",d:"Compilateur",c:C.primary},{t:".class",d:"Bytecode",c:C.gold},{t:"jar",d:"Empaqueteur",c:C.accent},{t:".jar",d:"Exécutable",c:C.success}].map((s,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:4}}>
          <div style={{background:s.c+"15",borderRadius:6,padding:"6px 10px",textAlign:"center"}}><div style={{fontFamily:"monospace",fontSize:11,fontWeight:700,color:s.c}}>{s.t}</div><div style={{fontSize:9,color:C.muted}}>{s.d}</div></div>
          {i<4&&<span style={{color:C.dimmed}}>→</span>}
        </div>
      ))}
    </div>
    <Code hl={[0,3,6]} code={`# 1. COMPILER : .java → .class\njavac -d bin src/Main.java src/Invention.java\n\n# 2. EXÉCUTER depuis les .class\njava -cp bin Main\n\n# 3. EMPAQUETER en JAR (un seul fichier)\njar cfm MonProjet.jar MANIFEST.MF -C bin .`}/>
    <Quiz q="Que contient un fichier .class ?" opts={["Du code Java lisible","Du bytecode (instructions pour la JVM)","Du binaire machine","Rien, c'est vide"]} correct={1} onAns={onQ} done={done}/>
  </>)},
  {section:"Théorie",title:"Créer un JAR exécutable",type:"theory",render:(onQ,done)=>(<>
    <P>Un <Strong c={C.accent}>JAR</Strong> (Java ARchive) = un zip qui contient tous les .class + un fichier <Ac>MANIFEST.MF</Ac> qui dit quelle classe contient le main.</P>
    <Code hl={[1]} code={`# Fichier MANIFEST.MF\nMain-Class: Main\n`}/>
    <Tip title="Attention !">Le manifest DOIT finir par une ligne vide ! Sans ça, Java ne le lit pas correctement.</Tip>
    <P>Dans Eclipse, c'est plus simple :</P>
    <Code code={`# Eclipse : Export as Runnable JAR\n# 1. File → Export → Java → Runnable JAR file\n# 2. Launch configuration : choisir votre Main\n# 3. Export destination : MonProjet.jar\n# 4. Finish\n\n# Ensuite dans le terminal :\njava -jar MonProjet.jar`}/>
    <Task>1. Ouvrez votre projet Catalogue dans Eclipse<br/>2. File → Export → Runnable JAR file<br/>3. Choisissez la classe avec le main<br/>4. Exportez sur le bureau<br/>5. Ouvrez un terminal, naviguez au bureau, exécutez <Ac>java -jar MonProjet.jar</Ac></Task>
    <Quiz q="Que spécifie le MANIFEST.MF ?" opts={["La liste des fichiers","La classe qui contient le main()","La version de Java","Les dépendances"]} correct={1} onAns={onQ} done={done}/>
  </>)},
  {section:"Théorie",title:"GitHub Releases",type:"theory",render:(onQ,done)=>(<>
    <P>Une <Strong c={C.accent}>Release GitHub</Strong> = une version officielle de votre projet, téléchargeable par tout le monde.</P>
    <Code hl={[0,1,2,5,6,7]} code={`# 1. Tagger votre version\ngit tag v1.0\ngit push origin v1.0\n\n# 2. Sur GitHub :\n# → Onglet "Releases" → "Create a new release"\n# → Choisir le tag v1.0\n# → Ajouter un titre et description\n# → Glisser-déposer votre fichier .jar\n# → "Publish release"`}/>
    <Tip title="Versioning sémantique"><Ac>v1.0.0</Ac> = majeure.mineure.patch<br/><Strong>1</Strong>.0.0 = changement majeur (incompatible)<br/>1.<Strong>1</Strong>.0 = nouvelle fonctionnalité<br/>1.0.<Strong>1</Strong> = correction de bug</Tip>
    <Task>1. Dans votre projet, faites un commit final propre<br/>2. Créez un tag : <Ac>git tag v1.0</Ac><br/>3. Poussez le tag : <Ac>git push origin v1.0</Ac><br/>4. Sur GitHub, créez une Release avec votre JAR</Task>
    <Quiz q="v1.2.3 — que signifie le 3 ?" opts={["Version majeure","Version mineure","Correction de bug (patch)","Numéro de build"]} correct={2} onAns={onQ} done={done}/>
  </>)},

  {section:"Défi",title:"Le Pipeline de Déploiement",type:"game",render:(_,__,onGC)=>(<>
    <P>Remettez les 8 étapes du déploiement dans le bon ordre — du code source à la release !</P>
    <DeployGame onComplete={onGC}/>
  </>)},

  {section:"Code guidé",title:"Build complet pas à pas",type:"guided",render:(onQ,done)=>(<>
    <P>On va créer un JAR exécutable de A à Z dans le terminal.</P>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:6,marginBottom:3}}>Étape 1 : Structure du projet</div>
    <Code code={`MonProjet/\n├── src/\n│   ├── Main.java\n│   └── Invention.java\n├── bin/         ← fichiers compilés ici\n└── MANIFEST.MF`}/>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:6,marginBottom:3}}>Étape 2 : Compiler</div>
    <Code code={`cd MonProjet\nmkdir -p bin\njavac -d bin src/Main.java src/Invention.java\n# Vérifier : ls bin/ → Main.class Invention.class`}/>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:6,marginBottom:3}}>Étape 3 : Tester les .class</div>
    <Code code={`java -cp bin Main\n# Le programme s'exécute !`}/>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:6,marginBottom:3}}>Étape 4 : Créer le manifest</div>
    <Code code={`echo "Main-Class: Main" > MANIFEST.MF\n# IMPORTANT : le fichier doit finir par une ligne vide`}/>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:6,marginBottom:3}}>Étape 5 : Empaqueter</div>
    <Code hl={[0,3]} code={`jar cfm MonProjet.jar MANIFEST.MF -C bin .\n# c = create, f = file, m = manifest\n\njava -jar MonProjet.jar\n# Ça marche ! Le JAR est autonome.`}/>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:6,marginBottom:3}}>Étape 6 : Release</div>
    <Code code={`git add .\ngit commit -m "release: v1.0 - première version"\ngit tag v1.0\ngit push origin main --tags\n# → Aller sur GitHub → Releases → Create`}/>
    <Task>Faites toutes les étapes avec votre projet Catalogue. À la fin, vous devez pouvoir donner le JAR à quelqu'un qui n'a pas Eclipse et il peut l'exécuter.</Task>
    <Quiz q="jar cfm app.jar MANIFEST.MF -C bin . — que fait -C bin ?" opts={["Compile les fichiers","Change le dossier courant vers bin/ pour inclure les .class","Crée le dossier bin","Compresse les fichiers"]} correct={1} onAns={onQ} done={done}/>
  </>)},

  {section:"Exercice",title:"Déployer votre projet final",type:"exercise",render:(onQ,done)=>(<>
    <div style={{background:C.gold+"15",borderRadius:10,padding:14,border:`1px solid ${C.gold}40`}}>
      <div style={{fontSize:15,fontWeight:700,color:C.gold,marginBottom:4}}>Exercice — 60 Crédits R&D</div>
      <div style={{color:C.text,fontSize:13}}>Créez un JAR exécutable et une Release GitHub de votre projet.</div>
    </div>
    <div style={{color:C.text,fontSize:12,lineHeight:1.8,marginTop:10}}>
      <Strong>Checklist de livraison :</Strong><br/>
      1. Code compilé sans erreur<br/>
      2. JAR exécutable créé (via Eclipse ou terminal)<br/>
      3. Le JAR fonctionne avec <Ac>java -jar</Ac><br/>
      4. README.md mis à jour avec instructions d'utilisation<br/>
      5. Tag Git créé (v1.0)<br/>
      6. Release GitHub avec le JAR uploadé<br/>
      7. <Strong c={C.gold}>Bonus</Strong> : ajouter un script <Ac>run.bat</Ac> / <Ac>run.sh</Ac>
    </div>
    <Quiz q="Un JAR est essentiellement :" opts={["Un compilateur","Un fichier ZIP contenant les .class + le manifest","Un éditeur de code","Un serveur web"]} correct={1} onAns={onQ} done={done}/>
  </>)},

  {section:"Correction",title:"Checklist finale LO3",type:"correction",render:(onQ,done)=>(<>
    <div style={{background:C.success+"12",borderRadius:8,padding:10,border:`1px solid ${C.success}40`,marginBottom:8}}><div style={{fontSize:13,fontWeight:700,color:C.success}}>Checklist d'évaluation LO3</div></div>
    <div style={{fontSize:12,color:C.text,lineHeight:2}}>
      <Strong c={C.accent}>P4 — Write a program using an IDE :</Strong><br/>
      ☐ Programme Java fonctionnel dans Eclipse<br/>
      ☐ Utilise les concepts OOP (classes, héritage, encapsulation)<br/>
      ☐ Compile et s'exécute sans erreur<br/><br/>
      <Strong c={C.accent}>M3 — Enhance using IDE features :</Strong><br/>
      ☐ Historique Git montrant l'évolution du code<br/>
      ☐ Utilisation du debugger (screenshots breakpoints)<br/>
      ☐ Refactoring visible dans les commits<br/><br/>
      <Strong c={C.accent}>D3 — Evaluate IDE vs not using IDE :</Strong><br/>
      ☐ Section dans le rapport comparant Eclipse vs éditeur texte<br/>
      ☐ Arguments pour : auto-complétion, debugger, refactoring<br/>
      ☐ Arguments contre : lourd, courbe d'apprentissage<br/>
    </div>
    <Tip title="Pour le rapport final">Chaque critère doit être démontré avec des captures d'écran ou des liens vers vos commits GitHub. Le D3 nécessite une analyse critique, pas juste une liste.</Tip>
    <Quiz q="Pour obtenir D3, il faut :" opts={["Juste coder","Comparer et évaluer de manière critique l'utilisation d'un IDE","Utiliser 3 IDE différents","Coder sans IDE"]} correct={1} onAns={onQ} done={done}/>
  </>)},
];

export default function M08Unified(){
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
    <div style={{padding:"8px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:C.card,flexWrap:"wrap",gap:4}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:10,letterSpacing:2,color:C.dimmed}}>CODEQUEST</span><span style={{color:C.border}}>|</span><span style={{fontSize:12,fontWeight:600,color:C.accent}}>M08 · Build & Deploy</span></div><div style={{display:"flex",gap:10,fontSize:11}}><span style={{color:C.muted}}>Quiz <strong style={{color:C.success}}>{score}/{totalQ}</strong></span>{gameScore!==null&&<span style={{color:C.muted}}>Jeu <strong style={{color:C.accent}}>{gameScore}</strong></span>}<span style={{color:C.muted}}>CR <strong style={{color:C.gold}}>{credits}</strong></span></div></div>
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
