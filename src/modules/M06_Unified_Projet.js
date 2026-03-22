import { useState, useEffect, useCallback } from "react";

const C={bg:"#0a0f1a",card:"#111827",primary:"#0D7377",secondary:"#14A3C7",accent:"#32E0C4",gold:"#F59E0B",text:"#e2e8f0",muted:"#94a3b8",dimmed:"#64748b",border:"#1e293b",success:"#10B981",danger:"#EF4444",code:"#1E293B",codeBorder:"#2d3a4f",codeText:"#32E0C4",comment:"#6b7f99",keyword:"#c792ea",string:"#c3e88d"};
const KEY="cq-m06-unified";
async function ld(){try{const r=await window.storage.get(KEY);return r?JSON.parse(r.value):null;}catch{return null;}}
async function sv(d){try{await window.storage.set(KEY,JSON.stringify(d));}catch{}}
function Code({code,hl=[]}){const lines=code.split("\n");return(<div style={{background:C.code,border:`1px solid ${C.codeBorder}`,borderRadius:10,overflow:"hidden",fontSize:12,fontFamily:"'JetBrains Mono',monospace",margin:"8px 0"}}><div style={{display:"flex",gap:5,padding:"5px 10px",background:"#0d1117",borderBottom:`1px solid ${C.codeBorder}`}}><span style={{width:7,height:7,borderRadius:"50%",background:"#ff5f57"}}/><span style={{width:7,height:7,borderRadius:"50%",background:"#febc2e"}}/><span style={{width:7,height:7,borderRadius:"50%",background:"#28c840"}}/></div><div style={{padding:"8px 0",overflowX:"auto"}}>{lines.map((l,i)=>(<div key={i} style={{display:"flex",padding:"1px 0",background:hl.includes(i)?C.accent+"12":"transparent",borderLeft:hl.includes(i)?`3px solid ${C.accent}`:"3px solid transparent"}}><span style={{width:32,textAlign:"right",paddingRight:8,color:C.dimmed,userSelect:"none",flexShrink:0,fontSize:10}}>{i+1}</span><span style={{color:C.codeText,whiteSpace:"pre"}}>{l}</span></div>))}</div></div>);}
function Quiz({q,opts,correct,onAns,done}){const[sel,setSel]=useState(null);return(<div style={{margin:"12px 0"}}><div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:6}}>{q}</div>{opts.map((o,i)=>{let bg=C.card,bc=C.border;if(done&&i===correct){bg=C.success+"20";bc=C.success;}else if(done&&sel===i){bg=C.danger+"20";bc=C.danger;}return(<button key={i} onClick={()=>{if(done)return;setSel(i);onAns(i===correct);}} style={{display:"block",width:"100%",textAlign:"left",padding:"7px 11px",marginBottom:3,borderRadius:7,border:`1px solid ${bc}`,background:bg,color:C.text,cursor:done?"default":"pointer",fontFamily:"inherit",fontSize:12}}>{String.fromCharCode(65+i)}. {o}</button>);})}</div>);}
function Task({children}){return(<div style={{background:C.primary+"15",borderRadius:8,padding:12,border:`1px solid ${C.primary}40`,margin:"10px 0"}}><div style={{fontSize:12,fontWeight:600,color:C.accent,marginBottom:4}}>A faire</div><div style={{color:C.text,fontSize:12,lineHeight:1.6}}>{children}</div></div>);}
function Tip({title,children,color=C.gold}){return(<div style={{background:color+"15",borderRadius:7,padding:10,border:`1px solid ${color}40`,margin:"8px 0"}}><div style={{fontSize:11,fontWeight:600,color,marginBottom:3}}>{title}</div><div style={{color:C.text,fontSize:11,lineHeight:1.5}}>{children}</div></div>);}
function P({children}){return <p style={{color:C.muted,fontSize:13,lineHeight:1.7,marginBottom:6}}>{children}</p>;}
function Strong({children,c=C.text}){return <strong style={{color:c}}>{children}</strong>;}
function Ac({children}){return <code style={{color:C.accent,fontSize:12}}>{children}</code>;}

// ═══ GAME: GIT SIMULATOR ═══
function GitGame({onComplete}){
  const CMDS=[
    {prompt:"Initialisez un dépôt Git",answer:"git init",hint:"La commande pour initialiser"},
    {prompt:"Ajoutez tous les fichiers au staging",answer:"git add .",hint:"Ajouter . = tout"},
    {prompt:"Créez un commit avec le message 'Premier commit'",answer:"git commit -m \"Premier commit\"",hint:"commit -m \"message\""},
    {prompt:"Vérifiez l'état du dépôt",answer:"git status",hint:"Quelle commande montre l'état ?"},
    {prompt:"Connectez le dépôt distant origin",answer:"git remote add origin URL",hint:"remote add origin ..."},
    {prompt:"Poussez sur la branche main",answer:"git push -u origin main",hint:"push vers origin main"},
    {prompt:"Tirez les dernières modifications",answer:"git pull",hint:"L'inverse de push"},
    {prompt:"Créez une branche 'feature-login'",answer:"git branch feature-login",hint:"branch nom"},
    {prompt:"Basculez sur cette branche",answer:"git checkout feature-login",hint:"checkout nom-branche"},
    {prompt:"Voyez l'historique des commits",answer:"git log",hint:"La commande pour voir l'historique"},
  ];
  const[idx,setIdx]=useState(0);const[input,setInput]=useState("");const[score,setScore]=useState(0);const[feedback,setFeedback]=useState("");const[done,setDone]=useState(false);const[showHint,setShowHint]=useState(false);
  const check=()=>{
    const ans=CMDS[idx].answer.toLowerCase().replace(/\s+/g," ").trim();
    const usr=input.toLowerCase().replace(/\s+/g," ").trim();
    const ok=usr.includes(ans.split(" ").slice(0,2).join(" "))||ans.includes(usr);
    if(ok){setScore(s=>s+15);setFeedback("Correct !");if(idx+1>=CMDS.length){setDone(true);onComplete(score+15);}else{setTimeout(()=>{setIdx(i=>i+1);setInput("");setFeedback("");setShowHint(false);},800);}}
    else setFeedback("Pas tout à fait... Réessayez ou demandez un indice.");
  };
  if(done)return null;
  return(<div style={{background:C.card,borderRadius:12,padding:14,border:`1px solid ${C.border}`,margin:"10px 0"}}>
    <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:6}}><span style={{color:C.dimmed}}>Commande {idx+1}/{CMDS.length}</span><span style={{color:C.gold,fontWeight:700}}>Score: {score}</span></div>
    <div style={{background:C.code,borderRadius:8,padding:12,marginBottom:8}}>
      <div style={{fontSize:11,color:C.dimmed,marginBottom:4}}>Mission :</div>
      <div style={{fontSize:14,fontWeight:600,color:C.text}}>{CMDS[idx].prompt}</div>
    </div>
    <div style={{display:"flex",gap:6}}>
      <div style={{flex:1,display:"flex",alignItems:"center",gap:4,background:C.code,borderRadius:7,padding:"4px 10px",border:`1px solid ${C.codeBorder}`}}>
        <span style={{color:C.accent,fontSize:12,fontFamily:"monospace"}}>$</span>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&check()} placeholder="tapez la commande git..." style={{flex:1,background:"transparent",border:"none",color:C.codeText,fontFamily:"'JetBrains Mono',monospace",fontSize:13,outline:"none"}}/>
      </div>
      <button onClick={check} style={{padding:"6px 14px",borderRadius:7,border:"none",background:C.accent,color:C.bg,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600}}>Exécuter</button>
    </div>
    {feedback&&<div style={{marginTop:6,fontSize:12,color:feedback.includes("Correct")?C.success:C.danger,fontWeight:600}}>{feedback}</div>}
    <button onClick={()=>setShowHint(true)} style={{marginTop:6,padding:"4px 10px",borderRadius:5,border:`1px solid ${C.border}`,background:"transparent",color:C.dimmed,cursor:"pointer",fontFamily:"inherit",fontSize:10}}>Indice</button>
    {showHint&&<div style={{marginTop:4,fontSize:11,color:C.gold}}>💡 {CMDS[idx].hint}</div>}
  </div>);
}

function Memo(){return(<div style={{background:C.card,borderRadius:12,padding:20,border:`1px solid ${C.gold}40`}}>
  <div style={{fontSize:16,fontWeight:700,color:C.gold,marginBottom:12}}>Mémo débloqué — Git</div>
  <div style={{background:C.code,borderRadius:8,padding:10,marginBottom:8}}>
    <pre style={{margin:0,fontSize:10,color:C.codeText,fontFamily:"monospace"}}>{"git init              # initialiser\ngit add .             # ajouter tout\ngit commit -m \"msg\"   # sauvegarder\ngit status            # voir l'état\ngit log               # historique\ngit push              # envoyer\ngit pull              # recevoir\ngit branch nom        # créer branche\ngit checkout nom      # changer branche\ngit merge nom         # fusionner"}</pre>
  </div>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
    <div style={{background:C.success+"15",borderRadius:6,padding:8}}><div style={{fontSize:10,fontWeight:600,color:C.success}}>Workflow quotidien</div><div style={{fontSize:9,color:C.muted}}>pull → code → add → commit → push</div></div>
    <div style={{background:C.danger+"15",borderRadius:6,padding:8}}><div style={{fontSize:10,fontWeight:600,color:C.danger}}>Erreurs courantes</div><div style={{fontSize:9,color:C.muted}}>Oublier add avant commit · Push sans pull · Commit sans message</div></div>
  </div>
</div>);}

const STEPS=[
  {section:"Théorie",title:"Pourquoi Git ?",type:"theory",render:(onQ,done)=>(<>
    <P><Strong c={C.accent}>Git</Strong> est un système de versioning. Il sauvegarde <Strong>chaque version</Strong> de votre code. Vous pouvez revenir en arrière, travailler en parallèle, et collaborer sans écraser le travail des autres.</P>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,margin:"10px 0"}}>
      <div style={{background:C.danger+"12",borderRadius:8,padding:10,border:`1px solid ${C.danger}30`}}><div style={{fontWeight:700,color:C.danger,fontSize:12}}>Sans Git</div><div style={{color:C.muted,fontSize:11,marginTop:4}}>projet_v1.zip, projet_v2_final.zip, projet_v2_VRAI_final.zip, projet_v3_merged_corrigé.zip...</div></div>
      <div style={{background:C.success+"12",borderRadius:8,padding:10,border:`1px solid ${C.success}30`}}><div style={{fontWeight:700,color:C.success,fontSize:12}}>Avec Git</div><div style={{color:C.muted,fontSize:11,marginTop:4}}>Un seul dossier. Chaque commit = un point de sauvegarde. Historique complet. Retour en arrière possible.</div></div>
    </div>
    <P><Strong c={C.accent}>GitHub</Strong> = Git + hébergement en ligne. Votre code est sauvegardé sur le cloud et partageable.</P>
    <Quiz q="Git sert à quoi ?" opts={["Compiler du code","Versionner et sauvegarder chaque modification du code","Créer des interfaces graphiques","Tester des programmes"]} correct={1} onAns={onQ} done={done}/>
  </>)},
  {section:"Théorie",title:"Les commandes essentielles",type:"theory",render:(onQ,done)=>(<>
    <P>Le workflow Git en 5 commandes :</P>
    <Code hl={[0,3,6,9,12]} code={`# 1. INITIALISER un dépôt (une seule fois)\ngit init\n\n# 2. AJOUTER les fichiers modifiés au staging\ngit add .                    # . = tout le dossier\n\n# 3. SAUVEGARDER avec un message\ngit commit -m "Description de ce qui a changé"\n\n# 4. ENVOYER sur GitHub\ngit push origin main\n\n# 5. RECEVOIR les modifications des autres\ngit pull origin main`}/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:4,margin:"10px 0"}}>
      {[{t:"init",d:"Créer",c:C.primary},{t:"add",d:"Préparer",c:C.secondary},{t:"commit",d:"Sauver",c:C.accent},{t:"push",d:"Envoyer",c:C.gold},{t:"pull",d:"Recevoir",c:C.success}].map(s=>(
        <div key={s.t} style={{background:s.c+"15",borderRadius:6,padding:6,textAlign:"center"}}><div style={{fontFamily:"monospace",fontSize:10,fontWeight:700,color:s.c}}>{s.t}</div><div style={{fontSize:9,color:C.muted}}>{s.d}</div></div>
      ))}
    </div>
    <Tip title="Workflow quotidien">Chaque fois que vous avez fait un progrès : <Ac>git add .</Ac> → <Ac>git commit -m "..."</Ac> → <Ac>git push</Ac><br/>Avant de commencer à coder : <Ac>git pull</Ac> (récupérer le travail des autres)</Tip>
    <Task>1. Ouvrez un terminal (dans Eclipse : Window → Show View → Terminal)<br/>2. Naviguez vers votre projet : <Ac>cd chemin/vers/projet</Ac><br/>3. <Ac>git init</Ac><br/>4. <Ac>git add .</Ac><br/>5. <Ac>git commit -m "Premier commit"</Ac><br/>6. Vérifiez avec <Ac>git log</Ac></Task>
    <Quiz q="Dans quel ordre exécuter les commandes ?" opts={["commit → add → push","push → add → commit","add → commit → push","init → push → add"]} correct={2} onAns={onQ} done={done}/>
  </>)},
  {section:"Théorie",title:"GitHub et le travail en équipe",type:"theory",render:(onQ,done)=>(<>
    <P>Pour travailler en équipe sur GitHub :</P>
    <Code hl={[0,3,6,9]} code={`# CLONER un dépôt existant (première fois)\ngit clone https://github.com/user/repo.git\n\n# CONNECTER votre dépôt local à GitHub\ngit remote add origin https://github.com/user/repo.git\n\n# CRÉER une branche pour votre fonctionnalité\ngit branch ma-fonctionnalite\ngit checkout ma-fonctionnalite\n\n# FUSIONNER votre branche dans main\ngit checkout main\ngit merge ma-fonctionnalite`}/>
    <P>Le principe des <Strong c={C.accent}>branches</Strong> :</P>
    <div style={{background:C.code,borderRadius:8,padding:12,margin:"8px 0",fontFamily:"monospace",fontSize:11,color:C.codeText}}>
      <div>main ●────●────●────●────●</div>
      <div style={{color:C.gold}}>{"              \\         /"}</div>
      <div style={{color:C.gold}}>{"               ●───●───●  feature-login"}</div>
    </div>
    <P>Chaque membre de l'équipe travaille sur sa branche. Quand c'est prêt, on fusionne dans main.</P>
    <Tip title="Code review">Avant de fusionner, un coéquipier <Strong c={C.text}>relit votre code</Strong> sur GitHub (Pull Request). Il peut commenter, suggérer des améliorations, approuver.</Tip>
    <Task>1. Créez un repo sur GitHub (bouton + → New repository)<br/>2. Connectez-le : <Ac>git remote add origin URL</Ac><br/>3. Poussez : <Ac>git push -u origin main</Ac><br/>4. Vérifiez sur github.com que votre code est là<br/>5. Invitez un coéquipier (Settings → Collaborators)</Task>
    <Quiz q="Une branche sert à quoi ?" opts={["Supprimer du code","Travailler sur une fonctionnalité sans toucher au code principal","Compiler le projet","Tester en production"]} correct={1} onAns={onQ} done={done}/>
  </>)},
  {section:"Théorie",title:"Les bons messages de commit",type:"theory",render:(onQ,done)=>(<>
    <P>Un bon message de commit = on comprend <Strong>ce qui a changé</Strong> sans lire le code.</P>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,margin:"10px 0"}}>
      <div style={{background:C.danger+"12",borderRadius:8,padding:10}}><div style={{fontWeight:600,color:C.danger,fontSize:11,marginBottom:4}}>Mauvais messages</div><div style={{fontSize:10,color:C.muted,fontFamily:"monospace",lineHeight:1.8}}>"fix"<br/>"update"<br/>"changes"<br/>"asdfjkl"<br/>"ça marche"</div></div>
      <div style={{background:C.success+"12",borderRadius:8,padding:10}}><div style={{fontWeight:600,color:C.success,fontSize:11,marginBottom:4}}>Bons messages</div><div style={{fontSize:10,color:C.muted,fontFamily:"monospace",lineHeight:1.8}}>"feat: ajout classe Invention"<br/>"fix: correction calcul prime"<br/>"refactor: simplifier getters"<br/>"docs: mise à jour README"<br/>"test: ajout tests Catalogue"</div></div>
    </div>
    <Tip title="Convention de nommage"><Ac>feat:</Ac> nouvelle fonctionnalité · <Ac>fix:</Ac> correction de bug · <Ac>refactor:</Ac> restructuration · <Ac>docs:</Ac> documentation · <Ac>test:</Ac> tests</Tip>
    <Quiz q="Quel est le meilleur message de commit ?" opts={["\"update\"","\"fix\"","\"feat: ajout méthode calculerPrime dans Ingenieur\"","\"changes and stuff\""]} correct={2} onAns={onQ} done={done}/>
  </>)},

  {section:"Défi",title:"Le Terminal Git",type:"game",render:(_,__,onGC)=>(<>
    <P>10 commandes Git à retrouver. Tapez la bonne commande pour chaque mission !</P>
    <GitGame onComplete={onGC}/>
  </>)},

  {section:"Code guidé",title:"Setup projet d'équipe pas à pas",type:"guided",render:(onQ,done)=>(<>
    <P>Suivez ces étapes pour configurer votre projet d'équipe.</P>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:6,marginBottom:3}}>Étape 1 : Créer le repo sur GitHub</div>
    <P>Un membre crée le repo sur github.com → "New repository" → Nom du projet → Public → Create.</P>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:6,marginBottom:3}}>Étape 2 : Tous clonent le repo</div>
    <Code code={`# Chaque membre de l'équipe :\ngit clone https://github.com/votre-equipe/projet-salon.git\ncd projet-salon`}/>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:6,marginBottom:3}}>Étape 3 : Créer la structure du projet</div>
    <Code code={`# Dans Eclipse : File → New → Java Project\n# Nom : ProjetSalon\n# Créer les packages :\n#   src/modele/      → classes métier\n#   src/vue/         → interface (si Swing)\n#   src/controleur/  → logique\n#   src/test/        → tests`}/>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:6,marginBottom:3}}>Étape 4 : Premier commit d'équipe</div>
    <Code hl={[0,1,2]} code={`git add .\ngit commit -m "feat: structure initiale du projet"\ngit push origin main`}/>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:6,marginBottom:3}}>Étape 5 : Workflow de sprint</div>
    <Code code={`# Chaque semaine (sprint) :\n# 1. Stand-up : chacun dit ce qu'il fait\n# 2. Chacun code sur sa branche\ngit checkout -b feature-inventeur  # créer + basculer\n# ... coder ...\ngit add . && git commit -m "feat: classe Inventeur"\ngit push origin feature-inventeur\n# 3. Pull Request sur GitHub → review → merge\n# 4. Tout le monde pull le main mis à jour\ngit checkout main && git pull`}/>
    <Task>Avec votre équipe :<br/>1. Créez le repo, clonez-le<br/>2. Mettez en place la structure<br/>3. Chaque membre crée une branche et ajoute un fichier<br/>4. Faites une Pull Request et fusionnez</Task>
    <Quiz q="Avant de commencer à coder le matin, quelle commande ?" opts={["git push","git commit","git pull (récupérer le travail des autres)","git init"]} correct={2} onAns={onQ} done={done}/>
  </>)},

  {section:"Exercice",title:"Mise en place de votre projet Salon",type:"exercise",render:(onQ,done)=>(<>
    <div style={{background:C.gold+"15",borderRadius:10,padding:14,border:`1px solid ${C.gold}40`}}>
      <div style={{fontSize:15,fontWeight:700,color:C.gold,marginBottom:4}}>Exercice d'équipe — 60 Crédits R&D</div>
      <div style={{color:C.text,fontSize:13}}>Mettez en place le repo GitHub de votre projet Salon.</div>
    </div>
    <div style={{color:C.text,fontSize:12,lineHeight:1.8,marginTop:10}}>
      <Strong>Checklist :</Strong><br/>
      — Repo créé sur GitHub avec un nom descriptif<br/>
      — README.md avec : nom du projet, équipe, description, technologies<br/>
      — Structure de packages créée dans Eclipse<br/>
      — Chaque membre a cloné et fait au moins 1 commit<br/>
      — Au moins 1 Pull Request faite et fusionnée<br/>
      — .gitignore configuré (ignorer bin/, .settings/, .classpath)<br/>
      — <Strong c={C.gold}>Bonus</Strong> : diagramme UML des classes dans le README
    </div>
    <Quiz q="Que met-on dans un .gitignore ?" opts={["Le code source","Les fichiers qu'on NE veut PAS versionner (bin, config IDE...)","Les messages de commit","Les noms des collaborateurs"]} correct={1} onAns={onQ} done={done}/>
  </>)},

  {section:"Correction",title:"Correction et checklist",type:"correction",render:(onQ,done)=>(<>
    <div style={{background:C.success+"12",borderRadius:8,padding:10,border:`1px solid ${C.success}40`,marginBottom:8}}><div style={{fontSize:13,fontWeight:700,color:C.success}}>Checklist de vérification</div></div>
    <Code code={`# .gitignore recommandé pour un projet Java/Eclipse\nbin/\n.settings/\n.classpath\n.project\n*.class\n*.jar\n*.log`}/>
    <Code code={`# README.md exemple\n# Projet : [Nom]\n## Équipe\n- Alice (Architecte)\n- Bob (Développeur)\n- Charlie (Testeur)\n## Description\n[Ce que fait le projet]\n## Technologies\n- Java 17, Eclipse, Git\n## Comment lancer\n1. Cloner le repo\n2. Ouvrir dans Eclipse\n3. Exécuter Main.java`}/>
    <Tip title="Critères d'évaluation LO3">
      <Strong c={C.accent}>P4</Strong> : le code compile et s'exécute → repo GitHub fonctionnel<br/>
      <Strong c={C.accent}>M3</Strong> : utilisation des features IDE → historique Git montrant refactoring<br/>
      <Strong c={C.accent}>D3</Strong> : évaluer l'IDE → section dans le rapport final
    </Tip>
    <Quiz q="Quel fichier explique comment utiliser un projet ?" opts={[".gitignore","package.json","README.md","LICENCE"]} correct={2} onAns={onQ} done={done}/>
  </>)},
];

export default function M06Unified(){
  const[step,setStep]=useState(0);const[completed,setCompleted]=useState({});const[score,setScore]=useState(0);const[totalQ,setTotalQ]=useState(0);const[credits,setCredits]=useState(0);const[gameScore,setGameScore]=useState(null);const[ready,setReady]=useState(false);const[showMemo,setShowMemo]=useState(false);
  const allDone=Object.keys(completed).length>=STEPS.length;
  useEffect(()=>{ld().then(d=>{if(d){setCompleted(d.c||{});setScore(d.s||0);setTotalQ(d.t||0);setCredits(d.cr||0);setGameScore(d.gs);if(d.st!==undefined)setStep(d.st);}setReady(true);});},[]);
  const persist=useCallback((c,s,t,cr,gs,st)=>{sv({c,s,t,cr,gs,st});},[]);
  const handleQuiz=(ok)=>{const nT=totalQ+1,nS=score+(ok?1:0),nCr=credits+(ok?5:0),nC={...completed,[step]:true};setTotalQ(nT);setScore(nS);setCredits(nCr);setCompleted(nC);persist(nC,nS,nT,nCr,gameScore,step);};
  const handleGC=(gs)=>{setGameScore(gs);const nCr=credits+Math.floor(gs/2);setCredits(nCr);const nC={...completed,[step]:true};setCompleted(nC);persist(nC,score,totalQ,nCr,gs,step);};
  const go=(dir)=>{const ns=step+dir;if(ns>=0&&ns<STEPS.length){setStep(ns);persist(completed,score,totalQ,credits,gameScore,ns);}};
  if(!ready)return<div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",color:C.muted}}>Chargement...</div>;
  const cur=STEPS[step];const isDone=!!completed[step];const sections=[...new Set(STEPS.map(s=>s.section))];
  const secC={Théorie:C.secondary,Défi:C.gold,"Code guidé":C.primary,Exercice:C.accent,Correction:C.success};
  return(<div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',system-ui,sans-serif"}}><style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
    <div style={{padding:"8px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:C.card,flexWrap:"wrap",gap:4}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:10,letterSpacing:2,color:C.dimmed}}>CODEQUEST</span><span style={{color:C.border}}>|</span><span style={{fontSize:12,fontWeight:600,color:C.accent}}>M06 · Projet Git</span></div><div style={{display:"flex",gap:10,fontSize:11}}><span style={{color:C.muted}}>Quiz <strong style={{color:C.success}}>{score}/{totalQ}</strong></span>{gameScore!==null&&<span style={{color:C.muted}}>Jeu <strong style={{color:C.accent}}>{gameScore}</strong></span>}<span style={{color:C.muted}}>CR <strong style={{color:C.gold}}>{credits}</strong></span></div></div>
    <div style={{display:"flex",maxWidth:1100,margin:"0 auto",minHeight:"calc(100vh - 42px)"}}>
      <div style={{width:200,borderRight:`1px solid ${C.border}`,padding:"10px 0",flexShrink:0,overflowY:"auto",display:"flex",flexDirection:"column"}}>
        {sections.map(sec=>{const sts=STEPS.map((s,i)=>({...s,idx:i})).filter(s=>s.section===sec);return(<div key={sec}><div style={{padding:"5px 12px",fontSize:9,letterSpacing:1,color:secC[sec]||C.dimmed,fontWeight:700,textTransform:"uppercase"}}>{sec}</div>{sts.map(s=>{const c2=s.idx===step,dn=!!completed[s.idx];return(<button key={s.idx} onClick={()=>{setStep(s.idx);persist(completed,score,totalQ,credits,gameScore,s.idx);}} style={{display:"flex",alignItems:"center",gap:5,width:"100%",padding:"4px 12px 4px 20px",border:"none",background:c2?C.accent+"12":"transparent",borderLeft:c2?`2px solid ${C.accent}`:"2px solid transparent",cursor:"pointer",fontFamily:"inherit",fontSize:11,color:c2?C.accent:dn?C.success:C.muted,textAlign:"left"}}><span style={{fontSize:8}}>{dn?"✓":"○"}</span>{s.title}</button>);})}</div>);})}
        <div style={{padding:10,marginTop:"auto"}}><div style={{height:3,background:C.border,borderRadius:2,overflow:"hidden",marginBottom:6}}><div style={{width:`${(Object.keys(completed).length/STEPS.length)*100}%`,height:"100%",background:`linear-gradient(90deg,${C.primary},${C.accent})`,borderRadius:2,transition:"width .5s"}}/></div>
        <button onClick={()=>allDone&&setShowMemo(!showMemo)} style={{width:"100%",padding:"8px",borderRadius:8,border:`1px solid ${allDone?C.gold:C.border}`,background:allDone?C.gold+"15":"transparent",color:allDone?C.gold:C.dimmed,cursor:allDone?"pointer":"default",fontFamily:"inherit",fontSize:11,fontWeight:600,opacity:allDone?1:0.5}}>{allDone?"📋 Mémo":"🔒 Mémo"}</button></div>
      </div>
      <div style={{flex:1,padding:"16px 24px",overflowY:"auto",maxHeight:"calc(100vh - 42px)"}}>{showMemo&&allDone?<Memo/>:(<div key={step} style={{animation:"fadeIn .25s"}}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}><span style={{fontSize:9,padding:"2px 8px",borderRadius:10,background:(secC[cur.section]||C.dimmed)+"20",color:secC[cur.section]||C.dimmed,fontWeight:600,letterSpacing:1}}>{cur.section.toUpperCase()}</span></div><h2 style={{fontSize:18,fontWeight:700,marginBottom:12}}>{cur.title}</h2>{cur.type==="game"?cur.render(handleQuiz,isDone,handleGC):cur.render(handleQuiz,isDone)}<div style={{display:"flex",justifyContent:"space-between",marginTop:24,paddingTop:10,borderTop:`1px solid ${C.border}`}}><button onClick={()=>go(-1)} disabled={step===0} style={{padding:"7px 16px",borderRadius:7,border:`1px solid ${C.border}`,background:"transparent",color:step===0?C.border:C.muted,cursor:step===0?"default":"pointer",fontFamily:"inherit",fontSize:12}}>←</button><button onClick={()=>go(1)} disabled={step===STEPS.length-1} style={{padding:"7px 16px",borderRadius:7,border:"none",background:step===STEPS.length-1?C.border:C.accent,color:step===STEPS.length-1?C.muted:C.bg,cursor:step===STEPS.length-1?"default":"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600}}>{step===STEPS.length-1?"Fin":"→"}</button></div></div>)}</div>
    </div>
  </div>);
}
