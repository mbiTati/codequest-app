import { useState, useEffect, useCallback } from "react";

const C={bg:"#0a0f1a",card:"#111827",primary:"#0D7377",secondary:"#14A3C7",accent:"#32E0C4",gold:"#F59E0B",text:"#e2e8f0",muted:"#94a3b8",dimmed:"#64748b",border:"#1e293b",success:"#10B981",danger:"#EF4444",code:"#1E293B",codeBorder:"#2d3a4f",codeText:"#32E0C4"};
const KEY="cq-m00-unified";
async function ld(){try{const r=await window.storage.get(KEY);return r?JSON.parse(r.value):null;}catch{return null;}}
async function sv(d){try{await window.storage.set(KEY,JSON.stringify(d));}catch{}}

function CodeBox({code,hl=[]}){const lines=code.split("\n");return(<div style={{background:C.code,border:"1px solid "+C.codeBorder,borderRadius:10,overflow:"hidden",fontSize:12,fontFamily:"monospace",margin:"8px 0"}}><div style={{padding:"8px 0",overflowX:"auto"}}>{lines.map((l,i)=>(<div key={i} style={{display:"flex",padding:"1px 0",background:hl.includes(i)?C.accent+"12":"transparent"}}><span style={{width:28,textAlign:"right",paddingRight:6,color:C.dimmed,userSelect:"none",fontSize:10}}>{i+1}</span><span style={{color:C.codeText,whiteSpace:"pre"}}>{l}</span></div>))}</div></div>);}
function Quiz({q,opts,correct,onAns,done}){const[sel,setSel]=useState(null);return(<div style={{margin:"12px 0"}}><div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:6}}>{q}</div>{opts.map((o,i)=>{let bg=C.card,bc=C.border;if(done&&i===correct){bg=C.success+"20";bc=C.success;}else if(done&&sel===i){bg=C.danger+"20";bc=C.danger;}return(<button key={i} onClick={()=>{if(done)return;setSel(i);onAns(i===correct);}} style={{display:"block",width:"100%",textAlign:"left",padding:"7px 11px",marginBottom:3,borderRadius:7,border:"1px solid "+bc,background:bg,color:C.text,cursor:done?"default":"pointer",fontFamily:"inherit",fontSize:12}}>{String.fromCharCode(65+i)+". "+o}</button>);})}{done&&<div style={{marginTop:6,padding:"6px 10px",borderRadius:6,fontSize:11,fontWeight:600,background:sel===correct?"#10B98120":"#EF444420",color:sel===correct?"#10B981":"#EF4444"}}>{sel===correct?"Correct !":"Incorrect"}</div>}</div>);}

function P({children}){return <p style={{color:C.muted,fontSize:13,lineHeight:1.7,marginBottom:6}}>{children}</p>;}
function Strong({children,c=C.text}){return <strong style={{color:c}}>{children}</strong>;}
function Tip({title,children,color=C.gold}){return(<div style={{background:color+"15",borderRadius:7,padding:10,border:"1px solid "+color+"40",margin:"8px 0"}}><div style={{fontSize:11,fontWeight:600,color,marginBottom:3}}>{title}</div><div style={{color:C.text,fontSize:11,lineHeight:1.5}}>{children}</div></div>);}

const CD = [];
CD[0] = "// Le pipeline de code Java\n// 1. CODE SOURCE (.java) - ecrit par le developpeur\n// 2. PREPROCESSEUR - absent en Java, present en C/C++\n//    (remplace les #include, #define avant compilation)\n// 3. COMPILATEUR (javac) - transforme .java en .class\n//    javac Main.java -> Main.class (bytecode)\n// 4. LINKER - lie les classes et bibliotheques\n//    En Java, le ClassLoader fait ce role\n// 5. INTERPRETEUR (JVM) - execute le bytecode\n//    java Main -> la JVM lit le .class";
CD[1] = "// Compiler et executer en ligne de commande\njavac Main.java          // compile -> Main.class\njava Main                // execute le bytecode\n\n// Erreur de compilation (syntaxe)\njavac Broken.java\n// error: ; expected\n\n// Erreur d execution (runtime)\njava Main\n// Exception: NullPointerException";
CD[2] = "import java.util.Stack;\n\n// STACK = Pile (LIFO : Last In, First Out)\nStack<String> pile = new Stack<>();\npile.push(\"A\");   // empiler\npile.push(\"B\");\npile.push(\"C\");\npile.pop();       // depiler -> \"C\" (le dernier)\npile.peek();      // regarder -> \"B\" (sans enlever)\npile.size();      // 2";
CD[3] = "import java.util.LinkedList;\nimport java.util.Queue;\n\n// QUEUE = File (FIFO : First In, First Out)\nQueue<String> file = new LinkedList<>();\nfile.add(\"Client1\");   // enfiler\nfile.add(\"Client2\");\nfile.add(\"Client3\");\nfile.poll();           // defiler -> \"Client1\" (le premier)\nfile.peek();           // regarder -> \"Client2\"";
CD[4] = "import javax.swing.*;\nimport java.awt.event.*;\n\npublic class PanneauLabo extends JFrame {\n    private JTextField champNom;\n    private JButton btnLancer;\n    private JLabel lblResultat;\n    private int compteur = 0;\n\n    public PanneauLabo() {\n        setTitle(\"Panneau de Controle du Labo\");\n        setSize(400, 200);\n        setDefaultCloseOperation(EXIT_ON_CLOSE);\n        setLayout(new java.awt.FlowLayout());\n\n        champNom = new JTextField(20);\n        btnLancer = new JButton(\"Lancer\");\n        lblResultat = new JLabel(\"En attente...\");\n\n        // EVENT LISTENER : reagit au clic\n        btnLancer.addActionListener(new ActionListener() {\n            public void actionPerformed(ActionEvent e) {\n                compteur++;\n                String nom = champNom.getText();\n                lblResultat.setText(\"Experience #\" + compteur + \": \" + nom);\n            }\n        });\n\n        add(champNom);\n        add(btnLancer);\n        add(lblResultat);\n        setVisible(true);\n    }\n}";
CD[5] = "// Composants cles d Eclipse\n// 1. Package Explorer - arborescence du projet\n// 2. Editeur de code - coloration syntaxique, autocomplete\n// 3. Console - sortie System.out.println\n// 4. Outline - structure de la classe (attributs, methodes)\n// 5. Problems - erreurs et warnings\n// 6. Debug Perspective - breakpoints, variables, step";
CD[6] = "// Comparaison IDE vs Editeur de texte\n//\n// IDE (Eclipse, IntelliJ) :\n//   + Compilation integree\n//   + Autocomplete intelligent\n//   + Debugger avec breakpoints\n//   + Refactoring automatique\n//   + Gestion de projet\n//   - Lourd, lent au demarrage\n//   - Courbe d apprentissage\n//\n// Editeur (Notepad++, VS Code, Sublime) :\n//   + Leger, rapide\n//   + Flexible, multi-langage\n//   - Pas de compilation integree\n//   - Pas de debugger natif\n//   - Moins d aide au codage";

function PipelineGame({onComplete}){
  const CORRECT=["Code source (.java)","Preprocesseur","Compilateur (javac)","Bytecode (.class)","Linker (ClassLoader)","Interpreteur (JVM)","Programme en execution"];
  const[order,setOrder]=useState(()=>[...CORRECT].sort(()=>Math.random()-.5));
  const[checked,setChecked]=useState(false);const[score,setScore]=useState(0);
  const move=(from,dir)=>{const to=from+dir;if(to<0||to>=order.length)return;const n=[...order];[n[from],n[to]]=[n[to],n[from]];setOrder(n);};
  const check=()=>{setChecked(true);let pts=0;order.forEach((item,i)=>{if(item===CORRECT[i])pts+=15;});setScore(pts);onComplete(pts);};
  return(<div style={{background:C.card,borderRadius:12,padding:14,border:"1px solid "+C.border,margin:"10px 0"}}>
    <div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:8}}>Remettez le pipeline dans le bon ordre :</div>
    {order.map((item,i)=>{const ok=checked&&item===CORRECT[i];const wrong=checked&&!ok;
    return(<div key={item} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:8,marginBottom:4,background:ok?C.success+"15":wrong?C.danger+"10":C.code,border:"1px solid "+(ok?C.success+"40":wrong?C.danger+"30":C.codeBorder)}}>
      <div style={{display:"flex",flexDirection:"column",gap:2}}>
        <button onClick={()=>move(i,-1)} disabled={checked||i===0} style={{background:"none",border:"none",color:C.muted,cursor:checked?"default":"pointer",fontSize:12,padding:0}}>{"\u25B2"}</button>
        <button onClick={()=>move(i,1)} disabled={checked||i===order.length-1} style={{background:"none",border:"none",color:C.muted,cursor:checked?"default":"pointer",fontSize:12,padding:0}}>{"\u25BC"}</button>
      </div>
      <span style={{fontSize:12,fontWeight:600,color:C.text}}>{item}</span>
      {checked&&<span style={{marginLeft:"auto",fontSize:12,fontWeight:700,color:ok?C.success:C.danger}}>{ok?"\u2713":"\u2717"}</span>}
    </div>);})}
    {!checked?<button onClick={check} style={{width:"100%",marginTop:8,padding:"10px",borderRadius:8,border:"none",background:C.accent,color:C.bg,cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:700}}>Verifier</button>:
    <div style={{textAlign:"center",marginTop:8,fontSize:14,fontWeight:700,color:C.gold}}>{score+"/105 points"}</div>}
  </div>);
}

function Memo(){return(<div style={{background:C.card,borderRadius:12,padding:20,border:"1px solid "+C.gold+"40"}}>
  <div style={{fontSize:16,fontWeight:700,color:C.gold,marginBottom:12}}>{"Memo \u2014 Fondamentaux Essential Content"}</div>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
    <div style={{background:C.code,borderRadius:8,padding:10}}><div style={{fontSize:11,fontWeight:600,color:C.accent,marginBottom:4}}>Pipeline</div><div style={{fontSize:9,color:C.muted,lineHeight:1.6}}>{"Source \u2192 Preprocesseur \u2192 Compilateur \u2192 Linker \u2192 Interpreteur"}<br/>{"Java : .java \u2192 javac \u2192 .class \u2192 JVM"}<br/>{"Write Once, Run Anywhere"}</div></div>
    <div style={{background:C.code,borderRadius:8,padding:10}}><div style={{fontSize:11,fontWeight:600,color:C.accent,marginBottom:4}}>Structures de donnees</div><div style={{fontSize:9,color:C.muted,lineHeight:1.6}}>{"Array : taille fixe, acces par index"}<br/>{"ArrayList : taille dynamique"}<br/>{"Stack : LIFO (push/pop)"}<br/>{"Queue : FIFO (add/poll)"}</div></div>
    <div style={{background:C.code,borderRadius:8,padding:10}}><div style={{fontSize:11,fontWeight:600,color:C.accent,marginBottom:4}}>3 paradigmes</div><div style={{fontSize:9,color:C.muted,lineHeight:1.6}}>{"Procedural : sequence de fonctions"}<br/>{"OOP : classes et objets"}<br/>{"Event-driven : listeners, evenements"}</div></div>
    <div style={{background:C.code,borderRadius:8,padding:10}}><div style={{fontSize:11,fontWeight:600,color:C.accent,marginBottom:4}}>IDE vs Editeur</div><div style={{fontSize:9,color:C.muted,lineHeight:1.6}}>{"IDE : compilation, debug, refactoring"}<br/>{"Editeur : leger, flexible"}<br/>{"Eclipse : 6 composants cles"}</div></div>
  </div>
</div>);}

const STEPS=[
  {section:"Theorie",title:"Du code a l execution (LO1)",type:"theory",render:(onQ,done)=>(<>
    <P>Le <Strong c={C.accent}>Essential Content LO1</Strong> exige de connaitre le role du preprocesseur, compilateur, linker et interpreteur.</P>
    <div style={{display:"flex",gap:4,margin:"10px 0",flexWrap:"wrap"}}>
      {[{t:".java",d:"Code source",c:C.secondary},{t:"Preprocesseur",d:"Absent en Java",c:C.dimmed},{t:"javac",d:"Compilateur",c:C.primary},{t:".class",d:"Bytecode",c:C.gold},{t:"ClassLoader",d:"Linker",c:C.accent},{t:"JVM",d:"Interpreteur",c:C.success}].map((s,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:4}}>
          <div style={{background:s.c+"15",borderRadius:6,padding:"6px 10px",textAlign:"center",minWidth:80}}><div style={{fontFamily:"monospace",fontSize:11,fontWeight:700,color:s.c}}>{s.t}</div><div style={{fontSize:9,color:C.muted}}>{s.d}</div></div>
          {i<5&&<span style={{color:C.dimmed}}>{"\u2192"}</span>}
        </div>
      ))}
    </div>
    <CodeBox code={CD[0]}/>
    <Tip title="Java = compile + interprete">javac compile en bytecode (.class), puis la JVM interprete ce bytecode. Avantage : le meme .class fonctionne sur Windows, Mac, Linux.</Tip>
    <CodeBox code={CD[1]}/>
    <Quiz q="En Java, qui transforme .java en .class ?" opts={["Le preprocesseur","Le compilateur (javac)","Le linker","La JVM"]} correct={1} onAns={onQ} done={done}/>
  </>)},

  {section:"Theorie",title:"Stack et Queue (LO2)",type:"theory",render:(onQ,done)=>(<>
    <P>Le <Strong c={C.accent}>Essential Content LO2</Strong> exige de connaitre arrays, stacks et queues.</P>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,margin:"8px 0"}}>
      <div style={{background:C.primary+"12",borderRadius:8,padding:10}}><div style={{fontWeight:600,color:C.primary,fontSize:12}}>{"Stack (Pile) \u2014 LIFO"}</div><div style={{fontSize:11,color:C.muted,marginTop:4}}>Last In, First Out. Comme une pile d assiettes : on enleve celle du dessus.</div></div>
      <div style={{background:C.secondary+"12",borderRadius:8,padding:10}}><div style={{fontWeight:600,color:C.secondary,fontSize:12}}>{"Queue (File) \u2014 FIFO"}</div><div style={{fontSize:11,color:C.muted,marginTop:4}}>First In, First Out. Comme une file d attente : le premier arrive est servi en premier.</div></div>
    </div>
    <CodeBox code={CD[2]} hl={[3,4,5,6,7,8]}/>
    <CodeBox code={CD[3]} hl={[4,5,6,7,8,9]}/>
    <Quiz q="Stack = LIFO signifie :" opts={["Le premier entre sort en premier","Le dernier entre sort en premier","Acces aleatoire","Tri automatique"]} correct={1} onAns={onQ} done={done}/>
  </>)},

  {section:"Theorie",title:"Event-driven programming (LO2)",type:"theory",render:(onQ,done)=>(<>
    <P>Le <Strong c={C.accent}>Essential Content LO2</Strong> exige de couvrir les 3 paradigmes : procedural, OOP, et <Strong c={C.danger}>event-driven</Strong>.</P>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,margin:"8px 0"}}>
      <div style={{background:C.primary+"12",borderRadius:8,padding:8}}><div style={{fontWeight:600,color:C.primary,fontSize:11}}>Procedural</div><div style={{fontSize:10,color:C.muted,marginTop:3}}>Le programme dicte l ordre. Sequence de fonctions.</div></div>
      <div style={{background:C.secondary+"12",borderRadius:8,padding:8}}><div style={{fontWeight:600,color:C.secondary,fontSize:11}}>OOP</div><div style={{fontSize:10,color:C.muted,marginTop:3}}>Objets avec attributs et methodes. Encapsulation, heritage.</div></div>
      <div style={{background:C.danger+"12",borderRadius:8,padding:8}}><div style={{fontWeight:600,color:C.danger,fontSize:11}}>Event-driven</div><div style={{fontSize:10,color:C.muted,marginTop:3}}>Le programme ATTEND. L utilisateur declenche des actions.</div></div>
    </div>
    <P>En Java, le paradigme event-driven utilise <Strong c={C.accent}>Swing</Strong> avec des ActionListeners :</P>
    <CodeBox code={CD[4]} hl={[20,21,22,23,24,25,26]}/>
    <Tip title="Le pattern Observer">Un bouton (observable) notifie son listener quand il est clique. Le listener execute actionPerformed(). C est le coeur de l event-driven.</Tip>
    <Quiz q="En event-driven, qui decide l ordre d execution ?" opts={["Le compilateur","Le programme (sequentiel)","L utilisateur (via ses actions)","Le systeme d exploitation"]} correct={2} onAns={onQ} done={done}/>
  </>)},

  {section:"Theorie",title:"IDE et editeurs de texte (LO2)",type:"theory",render:(onQ,done)=>(<>
    <P>Le <Strong c={C.accent}>Essential Content LO2</Strong> exige de connaitre les composants de l IDE et les editeurs avances.</P>
    <CodeBox code={CD[5]}/>
    <P>Les <Strong c={C.accent}>editeurs de texte avances</Strong> (Notepad++, VS Code, Sublime Text, Atom) peuvent aussi etre utilises pour ecrire du Java, mais sans les fonctionnalites de l IDE :</P>
    <CodeBox code={CD[6]}/>
    <Tip title="Pour le D3 (Distinction)">Le D3 demande d evaluer l utilisation d un IDE COMPARE a ne pas utiliser d IDE. Ce slide est la base de cette analyse critique.</Tip>
    <Quiz q="Avantage principal d un IDE sur un editeur ?" opts={["Plus joli","Compilation, debugging et refactoring integres","Plus rapide","Gratuit"]} correct={1} onAns={onQ} done={done}/>
  </>)},

  {section:"Defi",title:"Pipeline du Code",type:"game",render:(_,__,onGC)=>(<>
    <P>Remettez les 7 etapes du pipeline dans le bon ordre !</P>
    <PipelineGame onComplete={onGC}/>
  </>)},

  {section:"Exercice",title:"Les 3 paradigmes en action",type:"exercise",render:(onQ,done)=>(<>
    <div style={{background:C.gold+"15",borderRadius:10,padding:14,border:"1px solid "+C.gold+"40"}}>
      <div style={{fontSize:15,fontWeight:700,color:C.gold,marginBottom:4}}>{"Exercice \u2014 80 Credits R&D"}</div>
      <div style={{color:C.text,fontSize:13}}>Implementez le MEME programme en 3 paradigmes.</div>
    </div>
    <div style={{color:C.text,fontSize:12,lineHeight:1.8,marginTop:10}}>
      {"Programme : un compteur qui affiche un nombre et permet de l incrementer."}<br/><br/>
      <Strong c={C.primary}>{"Version 1 \u2014 Procedurale :"}</Strong><br/>
      {"Tout dans le main, une methode incrementer(int n), boucle do-while avec Scanner."}<br/><br/>
      <Strong c={C.secondary}>{"Version 2 \u2014 OOP :"}</Strong><br/>
      {"Classe Compteur avec attribut private int valeur, methodes incrementer() et getValeur()."}<br/><br/>
      <Strong c={C.danger}>{"Version 3 \u2014 Event-driven :"}</Strong><br/>
      {"JFrame avec JLabel (affiche le nombre) et JButton (incrementer au clic)."}<br/><br/>
      <Strong c={C.gold}>{"Bonus : "}</Strong>{"Tableau comparatif des 3 approches (avantages, inconvenients, quand utiliser)."}
    </div>
    <Quiz q="Pour P3, il faut :" opts={["Juste coder","Discuter les 3 paradigmes, leurs caracteristiques et relations","Choisir le meilleur","Ignorer event-driven"]} correct={1} onAns={onQ} done={done}/>
  </>)},

  {section:"Correction",title:"Mapping Essential Content",type:"correction",render:(onQ,done)=>(<>
    <div style={{background:C.success+"12",borderRadius:8,padding:10,border:"1px solid "+C.success+"40",marginBottom:8}}><div style={{fontSize:13,fontWeight:700,color:C.success}}>Ce module couvre les gaps Essential Content</div></div>
    <div style={{fontSize:12,color:C.text,lineHeight:2}}>
      <Strong c={C.accent}>{"LO1 \u2014 Pre-processor, compiler, linker, interpreter :"}</Strong><br/>
      {"\u2713 Pipeline complet avec role de chaque etape"}<br/>
      {"\u2713 Specifique Java : javac + JVM"}<br/>
      {"\u2713 Comparaison compile vs interprete"}<br/><br/>
      <Strong c={C.accent}>{"LO2 \u2014 Data structures (stacks, queues) :"}</Strong><br/>
      {"\u2713 Stack LIFO avec push/pop/peek"}<br/>
      {"\u2713 Queue FIFO avec add/poll/peek"}<br/><br/>
      <Strong c={C.accent}>{"LO2 \u2014 Events :"}</Strong><br/>
      {"\u2713 Swing : JFrame, JButton, JTextField, JLabel"}<br/>
      {"\u2713 ActionListener et actionPerformed"}<br/><br/>
      <Strong c={C.accent}>{"LO2 \u2014 IDE components + text editors :"}</Strong><br/>
      {"\u2713 6 composants Eclipse nommes et expliques"}<br/>
      {"\u2713 Comparaison IDE vs Notepad++/VS Code/Sublime"}<br/>
    </div>
    <Quiz q="Avec M00 + M01-M13, le cours couvre :" opts={["Seulement LO3","LO1 a LO4 avec 100% du Essential Content","Seulement OOP","Seulement le debugging"]} correct={1} onAns={onQ} done={done}/>
  </>)},
];

export default function M00Unified(){const[step,setStep]=useState(0);const[completed,setCompleted]=useState({});const[score,setScore]=useState(0);const[totalQ,setTotalQ]=useState(0);const[credits,setCredits]=useState(0);const[gameScore,setGameScore]=useState(null);const[ready,setReady]=useState(false);const[showMemo,setShowMemo]=useState(false);const allDone=Object.keys(completed).length>=STEPS.length;useEffect(()=>{ld().then(d=>{if(d){setCompleted(d.c||{});setScore(d.s||0);setTotalQ(d.t||0);setCredits(d.cr||0);setGameScore(d.gs);if(d.st!==undefined)setStep(d.st);}setReady(true);});},[]);const persist=useCallback((c,s,t,cr,gs,st)=>{sv({c,s,t,cr,gs,st});},[]);const hQ=(ok)=>{const nT=totalQ+1,nS=score+(ok?1:0),nCr=credits+(ok?5:0),nC={...completed,[step]:true};setTotalQ(nT);setScore(nS);setCredits(nCr);setCompleted(nC);persist(nC,nS,nT,nCr,gameScore,step);};const hGC=(gs)=>{setGameScore(gs);const nCr=credits+Math.floor(gs/2);setCredits(nCr);const nC={...completed,[step]:true};setCompleted(nC);persist(nC,score,totalQ,nCr,gs,step);};const go=(dir)=>{const ns=step+dir;if(ns>=0&&ns<STEPS.length){setStep(ns);persist(completed,score,totalQ,credits,gameScore,ns);}};if(!ready)return<div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",color:C.muted}}>Chargement...</div>;const cur=STEPS[step];const sections=[...new Set(STEPS.map(s=>s.section))];const secC={Theorie:C.secondary,Defi:C.gold,Exercice:C.accent,Correction:C.success};return(<div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',system-ui,sans-serif"}}><style>{"@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}"}</style><div style={{padding:"8px 16px",borderBottom:"1px solid "+C.border,display:"flex",alignItems:"center",justifyContent:"space-between",background:C.card}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:10,letterSpacing:2,color:C.dimmed}}>CODEQUEST</span><span style={{color:C.border}}>|</span><span style={{fontSize:12,fontWeight:600,color:C.gold}}>{"M00 \u2014 Fondamentaux"}</span></div><div style={{display:"flex",gap:10,fontSize:11}}><span style={{color:C.muted}}>{"CR "+credits}</span></div></div><div style={{display:"flex",maxWidth:1100,margin:"0 auto",minHeight:"calc(100vh - 42px)"}}><div style={{width:200,borderRight:"1px solid "+C.border,padding:"10px 0",flexShrink:0,overflowY:"auto",display:"flex",flexDirection:"column"}}>{sections.map(sec=>{const sts=STEPS.map((s,i)=>({...s,idx:i})).filter(s=>s.section===sec);return(<div key={sec}><div style={{padding:"5px 12px",fontSize:9,letterSpacing:1,color:secC[sec]||C.dimmed,fontWeight:700,textTransform:"uppercase"}}>{sec}</div>{sts.map(s=>{const c2=s.idx===step,dn=!!completed[s.idx];return(<button key={s.idx} onClick={()=>{setStep(s.idx);persist(completed,score,totalQ,credits,gameScore,s.idx);}} style={{display:"flex",alignItems:"center",gap:5,width:"100%",padding:"4px 12px 4px 20px",border:"none",background:c2?C.accent+"12":"transparent",borderLeft:c2?"2px solid "+C.accent:"2px solid transparent",cursor:"pointer",fontFamily:"inherit",fontSize:11,color:c2?C.accent:dn?C.success:C.muted,textAlign:"left"}}><span style={{fontSize:8}}>{dn?"\u2713":"\u25CB"}</span>{s.title}</button>);})}</div>);})}
<div style={{padding:10,marginTop:"auto"}}><button onClick={()=>allDone&&setShowMemo(!showMemo)} style={{width:"100%",padding:"8px",borderRadius:8,border:"1px solid "+(allDone?C.gold:C.border),background:allDone?C.gold+"15":"transparent",color:allDone?C.gold:C.dimmed,cursor:allDone?"pointer":"default",fontFamily:"inherit",fontSize:11,fontWeight:600}}>{allDone?"25C9 Memo":"25CB Memo"}</button></div></div><div style={{flex:1,padding:"16px 24px",overflowY:"auto",maxHeight:"calc(100vh - 42px)"}}>{showMemo&&allDone?<Memo/>:(<div key={step} style={{animation:"fadeIn .25s"}}><h2 style={{fontSize:18,fontWeight:700,marginBottom:12}}>{cur.title}</h2>{cur.type==="game"?cur.render(hQ,!!completed[step],hGC):cur.render(hQ,!!completed[step])}<div style={{display:"flex",justifyContent:"space-between",marginTop:24,paddingTop:10,borderTop:"1px solid "+C.border}}><button onClick={()=>go(-1)} disabled={step===0} style={{padding:"7px 16px",borderRadius:7,border:"1px solid "+C.border,background:"transparent",color:step===0?C.border:C.muted,cursor:step===0?"default":"pointer",fontFamily:"inherit",fontSize:12}}>{"\u2190"}</button><button onClick={()=>go(1)} disabled={step===STEPS.length-1} style={{padding:"7px 16px",borderRadius:7,border:"none",background:step===STEPS.length-1?C.border:C.accent,color:step===STEPS.length-1?C.muted:C.bg,cursor:step===STEPS.length-1?"default":"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600}}>{"\u2192"}</button></div></div>)}</div></div></div>);}
