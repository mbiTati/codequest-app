// ============================================
// 6 NOUVEAUX JEUX POUR COMBLER LES TROUS
// ============================================
import { useState, useEffect, useRef } from 'react';
import { Layers, MousePointer, Sparkles, GitBranch, Eye, Shield, RotateCcw, Play, Check, X, Clock, Trophy, Zap, ChevronRight } from 'lucide-react';

const C={bg:"#0a0f1a",card:"#111827",accent:"#32E0C4",gold:"#F59E0B",text:"#e2e8f0",muted:"#94a3b8",border:"#1e293b",danger:"#EF4444",success:"#10B981",primary:"#0D7377",dimmed:"#64748b",code:"#1E293B",codeTxt:"#67e8f9"};

// ============================================
// 1. STACK & QUEUE RUNNER
// ============================================
const SQ_LEVELS=[
  {type:"stack",title:"La Pile (Stack)",desc:"LIFO — Last In First Out",ops:[
    {action:"push",val:"A",q:"Apres push(A), que contient la pile ?",opts:["[A]","[]","[A,B]"],correct:0},
    {action:"push",val:"B",q:"Apres push(B), que contient la pile ?",opts:["[A,B]","[B,A]","[B]"],correct:0},
    {action:"push",val:"C",q:"Apres push(C), le sommet est ?",opts:["A","B","C"],correct:2},
    {action:"pop",val:null,q:"Apres pop(), quel element sort ?",opts:["A","B","C"],correct:2},
    {action:"pop",val:null,q:"Apres pop(), le sommet est ?",opts:["A","B","vide"],correct:0},
  ]},
  {type:"queue",title:"La File (Queue)",desc:"FIFO — First In First Out",ops:[
    {action:"enqueue",val:"X",q:"Apres enqueue(X), la file contient ?",opts:["[X]","[]","[X,Y]"],correct:0},
    {action:"enqueue",val:"Y",q:"Apres enqueue(Y), la file contient ?",opts:["[Y,X]","[X,Y]","[Y]"],correct:1},
    {action:"enqueue",val:"Z",q:"Le premier a sortir sera ?",opts:["X","Y","Z"],correct:0},
    {action:"dequeue",val:null,q:"Apres dequeue(), quel element sort ?",opts:["X","Y","Z"],correct:0},
    {action:"dequeue",val:null,q:"Apres dequeue(), le premier est ?",opts:["Y","Z","vide"],correct:1},
  ]},
];

export function Game_StackQueue(){
  const[level,setLevel]=useState(0);const[step,setStep]=useState(0);const[items,setItems]=useState([]);const[score,setScore]=useState(0);const[feedback,setFeedback]=useState(null);const[done,setDone]=useState(false);
  const lv=SQ_LEVELS[level];const op=lv?.ops[step];
  function answer(idx){
    if(!op)return;const correct=idx===op.correct;
    if(correct){
      setScore(s=>s+100);
      if(op.action==="push"||op.action==="enqueue")setItems(i=>[...i,op.val]);
      if(op.action==="pop")setItems(i=>i.slice(0,-1));
      if(op.action==="dequeue")setItems(i=>i.slice(1));
      setFeedback({ok:true});
    }else setFeedback({ok:false});
    setTimeout(()=>{setFeedback(null);if(correct){if(step+1>=lv.ops.length){if(level+1>=SQ_LEVELS.length)setDone(true);else{setLevel(l=>l+1);setStep(0);setItems([]);}}else setStep(s=>s+1);}},1200);
  }
  if(done)return<div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><Trophy size={48} color={C.gold}/><div style={{fontSize:24,fontWeight:800,color:C.gold,marginTop:12}}>Bravo ! {score} pts</div><div style={{fontSize:12,color:C.muted,marginTop:4}}>Stack & Queue maitrisees !</div><button onClick={()=>{setLevel(0);setStep(0);setItems([]);setScore(0);setDone(false);}} style={{marginTop:16,padding:"8px 20px",borderRadius:8,border:"none",background:C.accent,color:C.bg,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700}}><RotateCcw size={12}/> Rejouer</button></div>;
  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',sans-serif",padding:20}}>
      <div style={{maxWidth:600,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:16}}>
          <Layers size={32} color={lv.type==="stack"?C.accent:C.gold}/>
          <div style={{fontSize:20,fontWeight:800,color:lv.type==="stack"?C.accent:C.gold,marginTop:4}}>{lv.title}</div>
          <div style={{fontSize:12,color:C.muted}}>{lv.desc}</div>
        </div>
        {/* Visual stack/queue */}
        <div style={{display:"flex",justifyContent:"center",gap:4,marginBottom:16,minHeight:50}}>
          {items.map((it,i)=>(<div key={i} style={{width:44,height:44,borderRadius:8,background:(lv.type==="stack"?C.accent:C.gold)+"25",border:"2px solid "+(lv.type==="stack"?C.accent:C.gold),display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,color:lv.type==="stack"?C.accent:C.gold}}>{it}</div>))}
          {items.length===0&&<div style={{fontSize:12,color:C.dimmed,padding:12}}>vide</div>}
        </div>
        {/* Operation label */}
        {op&&<div style={{textAlign:"center",marginBottom:8,fontSize:13,fontWeight:700,color:C.text}}>
          {op.action+"("+(op.val||"")+")"} → {op.q}
        </div>}
        {/* Options */}
        {op&&<div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:12}}>
          {op.opts.map((o,i)=>(<button key={i} onClick={()=>answer(i)} style={{padding:"10px 20px",borderRadius:8,border:"1px solid "+C.border,background:C.card,color:C.text,cursor:"pointer",fontFamily:"monospace",fontSize:14,fontWeight:600}}>{o}</button>))}
        </div>}
        {feedback&&<div style={{textAlign:"center",fontSize:14,fontWeight:700,color:feedback.ok?C.success:C.danger}}>{feedback.ok?"Correct !":"Incorrect"}</div>}
        <div style={{textAlign:"center",fontSize:11,color:C.muted}}>Score: {score} | Etape {step+1}/{lv.ops.length}</div>
      </div>
    </div>
  );
}

// ============================================
// 2. EVENT CATCHER
// ============================================
const EVENTS_DATA=[
  {event:"onClick",desc:"Cliquez sur le bouton !",javaCode:"button.addActionListener(e -> { ... });",color:"#3B82F6"},
  {event:"onMouseEnter",desc:"Survolez la zone bleue !",javaCode:"panel.addMouseListener(new MouseAdapter() { mouseEntered... });",color:"#8B5CF6"},
  {event:"onKeyPress",desc:"Tapez une touche !",javaCode:"frame.addKeyListener(new KeyAdapter() { keyPressed... });",color:"#10B981"},
  {event:"onChange",desc:"Changez la valeur du slider !",javaCode:"slider.addChangeListener(e -> { ... });",color:"#F59E0B"},
  {event:"onDoubleClick",desc:"Double-cliquez sur la cible !",javaCode:"button.addMouseListener(new MouseAdapter() { mouseClicked if clicks==2 });",color:"#EF4444"},
];

export function Game_EventCatcher(){
  const[idx,setIdx]=useState(0);const[caught,setCaught]=useState([]);const[score,setScore]=useState(0);const[sliderVal,setSliderVal]=useState(50);const[keyPressed,setKeyPressed]=useState('');
  const ev=EVENTS_DATA[idx];const done=idx>=EVENTS_DATA.length;

  function catchEvent(){setCaught(c=>[...c,idx]);setScore(s=>s+100);setTimeout(()=>setIdx(i=>i+1),1500);}

  useEffect(()=>{
    if(idx===2){const h=e=>{setKeyPressed(e.key);catchEvent();};window.addEventListener('keydown',h,{once:true});return()=>window.removeEventListener('keydown',h);}
  },[idx]);

  if(done)return<div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><Trophy size={48} color={C.gold}/><div style={{fontSize:24,fontWeight:800,color:C.gold,marginTop:12}}>{score} pts — Event Master !</div><div style={{fontSize:12,color:C.muted,marginTop:4}}>5 evenements Java maitrises</div><button onClick={()=>{setIdx(0);setCaught([]);setScore(0);}} style={{marginTop:16,padding:"8px 20px",borderRadius:8,border:"none",background:C.accent,color:C.bg,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700}}><RotateCcw size={12}/> Rejouer</button></div>;

  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',sans-serif",padding:20}}>
      <div style={{maxWidth:500,margin:"0 auto",textAlign:"center"}}>
        <MousePointer size={32} color={ev?.color||C.accent}/>
        <div style={{fontSize:20,fontWeight:800,color:C.accent,marginTop:8}}>EVENT CATCHER</div>
        <div style={{fontSize:12,color:C.muted,marginBottom:16}}>Declenchez l'evenement Java !</div>
        {ev&&<>
          <div style={{fontSize:16,fontWeight:700,color:ev.color,marginBottom:4}}>{ev.event}</div>
          <div style={{fontSize:13,color:C.text,marginBottom:12}}>{ev.desc}</div>
          {/* Interactive area */}
          <div style={{minHeight:100,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12}}>
            {idx===0&&<button onClick={catchEvent} style={{padding:"16px 40px",borderRadius:12,border:"none",background:ev.color,color:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:18,fontWeight:700}}>CLIQUEZ !</button>}
            {idx===1&&<div onMouseEnter={catchEvent} style={{width:150,height:80,borderRadius:12,background:ev.color+"30",border:"2px dashed "+ev.color,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><span style={{color:ev.color,fontSize:13}}>Survolez-moi</span></div>}
            {idx===2&&<div style={{padding:16,borderRadius:12,background:ev.color+"20",border:"1px solid "+ev.color}}><span style={{color:ev.color,fontSize:13}}>{keyPressed?"Touche: "+keyPressed:"Appuyez sur une touche..."}</span></div>}
            {idx===3&&<div><input type="range" min="0" max="100" value={sliderVal} onChange={e=>{setSliderVal(e.target.value);catchEvent();}} style={{width:200}}/><div style={{fontSize:11,color:C.muted}}>Valeur: {sliderVal}</div></div>}
            {idx===4&&<button onDoubleClick={catchEvent} style={{padding:"16px 40px",borderRadius:12,border:"2px solid "+ev.color,background:"transparent",color:ev.color,cursor:"pointer",fontFamily:"inherit",fontSize:14,fontWeight:700}}>DOUBLE-CLIQUEZ !</button>}
          </div>
          <div style={{padding:"8px 12px",borderRadius:8,background:C.code,fontSize:11,color:C.codeTxt,fontFamily:"'Consolas',monospace",textAlign:"left"}}>{ev.javaCode}</div>
        </>}
        {caught.includes(idx-1)&&<div style={{marginTop:8,fontSize:14,fontWeight:700,color:C.success}}>Evenement capture ! +100 pts</div>}
        <div style={{marginTop:12,fontSize:10,color:C.dimmed}}>Score: {score} | Evenement {idx+1}/{EVENTS_DATA.length}</div>
      </div>
    </div>
  );
}

// ============================================
// 3. CODE CLEANER (LO3 standards)
// ============================================
const DIRTY_CODE=[
  {line:"int X = 5;",clean:"int x = 5;",rule:"Variables en camelCase, pas de majuscule"},
  {line:"String MYNAME = \"Alice\";",clean:'String myName = "Alice";',rule:"camelCase, pas de SCREAMING_CASE"},
  {line:"public void DoSomething(){",clean:"public void doSomething(){",rule:"Methodes en camelCase"},
  {line:"if(x==5){return true;}else{return false;}",clean:"return x == 5;",rule:"Simplifier les conditions booleennes"},
  {line:"int a; int b; int c;",clean:"int longueur, largeur, hauteur;",rule:"Noms de variables descriptifs"},
  {line:"// TODO: fix later\nSystem.out.println(\"debug\");",clean:"// Code propre, pas de debug restant",rule:"Supprimer les TODO et debug"},
  {line:"public class my_class {",clean:"public class MyClass {",rule:"Classes en PascalCase"},
  {line:"catch(Exception e) {}",clean:"catch(SpecificException e) { log(e); }",rule:"Pas de catch vide, etre specifique"},
];

export function Game_CodeCleaner(){
  const[idx,setIdx]=useState(0);const[score,setScore]=useState(0);const[timer,setTimer]=useState(60);const[feedback,setFeedback]=useState(null);const[input,setInput]=useState('');const[done,setDone]=useState(false);
  const tRef=useRef(null);
  useEffect(()=>{tRef.current=setInterval(()=>setTimer(t=>{if(t<=1){clearInterval(tRef.current);setDone(true);return 0;}return t-1;}),1000);return()=>clearInterval(tRef.current);},[]);
  const item=DIRTY_CODE[idx];
  function check(){
    if(!item)return;const correct=input.trim().toLowerCase().replace(/\s+/g,' ')===item.clean.toLowerCase().replace(/\s+/g,' ');
    if(correct){setScore(s=>s+100);setFeedback({ok:true,msg:item.rule});}else setFeedback({ok:false,msg:"Indice: "+item.rule});
    setTimeout(()=>{setFeedback(null);setInput('');if(correct){if(idx+1>=DIRTY_CODE.length)setDone(true);else setIdx(i=>i+1);}},1500);
  }
  if(done)return<div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><Sparkles size={48} color={C.gold}/><div style={{fontSize:24,fontWeight:800,color:C.gold,marginTop:12}}>{score} pts</div><div style={{fontSize:12,color:C.muted,marginTop:4}}>{idx}/{DIRTY_CODE.length} lignes nettoyees</div><button onClick={()=>{setIdx(0);setScore(0);setTimer(60);setDone(false);setInput('');tRef.current=setInterval(()=>setTimer(t=>{if(t<=1){clearInterval(tRef.current);setDone(true);return 0;}return t-1;}),1000);}} style={{marginTop:16,padding:"8px 20px",borderRadius:8,border:"none",background:C.accent,color:C.bg,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700}}><RotateCcw size={12}/> Rejouer</button></div>;
  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',sans-serif",padding:20}}>
      <div style={{maxWidth:600,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div><Sparkles size={20} color={C.gold}/><span style={{fontSize:18,fontWeight:800,color:C.gold,marginLeft:6}}>CODE CLEANER</span></div>
          <div style={{fontSize:20,fontWeight:800,color:timer<=10?C.danger:C.gold}}>{timer}s</div>
        </div>
        {item&&<>
          <div style={{padding:"12px 14px",borderRadius:8,background:C.danger+"15",border:"1px solid "+C.danger+"30",marginBottom:8,fontFamily:"'Consolas',monospace",fontSize:13,color:C.danger}}>{item.line}</div>
          <div style={{fontSize:11,color:C.muted,marginBottom:8}}>Reecrivez ce code proprement :</div>
          <div style={{display:"flex",gap:8,marginBottom:8}}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')check();}} placeholder="Code propre ici..." autoFocus style={{flex:1,padding:"10px 14px",borderRadius:8,border:"1px solid "+C.border,background:C.code,color:C.codeTxt,fontFamily:"'Consolas',monospace",fontSize:12}}/>
            <button onClick={check} style={{padding:"10px 16px",borderRadius:8,border:"none",background:C.success,color:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700}}>Nettoyer</button>
          </div>
          <div style={{fontSize:10,color:C.dimmed}}>Reponse attendue : {item.clean}</div>
        </>}
        {feedback&&<div style={{marginTop:8,padding:"8px 12px",borderRadius:8,background:(feedback.ok?C.success:C.danger)+"15",fontSize:11,color:feedback.ok?C.success:C.danger,fontWeight:600}}>{feedback.ok?"Propre ! ":""}  {feedback.msg}</div>}
        <div style={{marginTop:8,fontSize:10,color:C.dimmed}}>Score: {score} | Ligne {idx+1}/{DIRTY_CODE.length}</div>
      </div>
    </div>
  );
}

// ============================================
// 4. ALGORITHME → CODE (LO1)
// ============================================
const ALGO_CHALLENGES=[
  {flowchart:"START → Lire nombre → nombre > 0 ? → OUI: Afficher 'positif' → FIN | NON: Afficher 'negatif' → FIN",
   q:"Ecrivez le if pour verifier si nombre > 0",answer:"if (nombre > 0) {",accepts:["if (nombre > 0) {","if(nombre > 0){","if (nombre>0) {"]},
  {flowchart:"START → i = 0 → i < 10 ? → OUI: Afficher i → i++ → retour | NON: FIN",
   q:"Ecrivez la boucle for correspondante",answer:"for (int i = 0; i < 10; i++) {",accepts:["for (int i = 0; i < 10; i++) {","for(int i=0;i<10;i++){"]},
  {flowchart:"START → Lire jour → SWITCH jour → 'lundi': 'Debut semaine' → 'vendredi': 'Weekend!' → default: 'Normal' → FIN",
   q:"Ecrivez le switch(jour) avec le case lundi",answer:'switch (jour) {',accepts:["switch (jour) {","switch(jour){","switch (jour){"]},
  {flowchart:"START → Creer Voiture('Tesla',250) → voiture.accelerer() → Afficher vitesse → FIN",
   q:"Ecrivez la creation de l'objet Voiture",answer:'Voiture v = new Voiture("Tesla", 250);',accepts:['Voiture v = new Voiture("Tesla", 250);','Voiture v=new Voiture("Tesla",250);']},
];

export function Game_AlgoToCode(){
  const[idx,setIdx]=useState(0);const[input,setInput]=useState('');const[score,setScore]=useState(0);const[feedback,setFeedback]=useState(null);const done=idx>=ALGO_CHALLENGES.length;const ch=ALGO_CHALLENGES[idx];
  function check(){if(!ch)return;const ok=ch.accepts.some(a=>input.trim().replace(/\s+/g,' ').toLowerCase()===a.replace(/\s+/g,' ').toLowerCase());if(ok){setScore(s=>s+150);setFeedback({ok:true});}else setFeedback({ok:false});setTimeout(()=>{setFeedback(null);setInput('');if(ok){setIdx(i=>i+1);}},1200);}
  if(done)return<div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><Trophy size={48} color={C.gold}/><div style={{fontSize:24,fontWeight:800,color:C.gold,marginTop:12}}>{score} pts</div><div style={{fontSize:12,color:C.muted,marginTop:4}}>Algorithmes traduits en Java !</div><button onClick={()=>{setIdx(0);setScore(0);setInput('');}} style={{marginTop:16,padding:"8px 20px",borderRadius:8,border:"none",background:C.accent,color:C.bg,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700}}><RotateCcw size={12}/> Rejouer</button></div>;
  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',sans-serif",padding:20}}>
      <div style={{maxWidth:600,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:12}}><GitBranch size={28} color={C.gold}/><div style={{fontSize:20,fontWeight:800,color:C.gold,marginTop:4}}>ALGORITHME → CODE</div><div style={{fontSize:11,color:C.muted}}>Traduisez le flowchart en Java</div></div>
        {ch&&<>
          <div style={{padding:"12px 14px",borderRadius:10,background:C.gold+"10",border:"1px solid "+C.gold+"30",marginBottom:12,fontSize:12,color:C.gold,fontFamily:"monospace",lineHeight:1.8,whiteSpace:"pre-wrap"}}>{ch.flowchart}</div>
          <div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:8}}>{ch.q}</div>
          <div style={{display:"flex",gap:8,marginBottom:8}}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')check();}} placeholder="Code Java..." autoFocus style={{flex:1,padding:"10px 14px",borderRadius:8,border:"1px solid "+C.border,background:C.code,color:C.codeTxt,fontFamily:"'Consolas',monospace",fontSize:12}}/>
            <button onClick={check} style={{padding:"10px 16px",borderRadius:8,border:"none",background:C.gold,color:C.bg,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700}}>Traduire</button>
          </div>
          <div style={{fontSize:10,color:C.dimmed}}>Reponse : {ch.answer}</div>
        </>}
        {feedback&&<div style={{marginTop:8,fontSize:14,fontWeight:700,color:feedback.ok?C.success:C.danger,textAlign:"center"}}>{feedback.ok?"Correct !":"Reessayez..."}</div>}
      </div>
    </div>
  );
}

// ============================================
// 5. SCOPE ANIMATION
// ============================================
export function Game_ScopeAnimation(){
  const[step,setStep]=useState(0);const[playing,setPlaying]=useState(false);const tRef=useRef(null);const maxSteps=10;
  useEffect(()=>{if(playing){tRef.current=setInterval(()=>setStep(s=>{if(s>=maxSteps){setPlaying(false);return s;}return s+1;}),1200);}return()=>clearInterval(tRef.current);},[playing]);
  const scopes=[
    {name:"classe",vars:step>=1?["nom: String"]:[], depth:0, active:step>=1&&step<=9, color:"#8B5CF6"},
    {name:"main()",vars:step>=2?["age: int = 25"]:[], depth:1, active:step>=2&&step<=8, color:C.accent},
    {name:"if (age > 18)",vars:step>=4?["msg: String = \"Majeur\""]:[], depth:2, active:step>=3&&step<=6, color:C.gold},
    {name:"for (i < 3)",vars:step>=7?["i: int"]:[], depth:2, active:step>=7&&step<=8, color:"#3B82F6"},
  ];
  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',sans-serif",padding:20}}>
      <div style={{maxWidth:600,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:16}}><Eye size={28} color={C.accent}/><div style={{fontSize:20,fontWeight:800,color:C.accent,marginTop:4}}>PORTEE (SCOPE)</div><div style={{fontSize:11,color:C.muted}}>Les variables apparaissent et disparaissent selon les blocs {"{}"}</div></div>
        <div style={{background:C.card,borderRadius:12,padding:16,border:"1px solid "+C.border,minHeight:200}}>
          {scopes.map((s,i)=>(
            <div key={i} style={{marginLeft:s.depth*24,marginBottom:6,padding:"8px 12px",borderRadius:8,border:"2px solid "+(s.active?s.color:C.border+"40"),background:s.active?s.color+"12":"transparent",opacity:s.active?1:0.3,transition:"all .5s"}}>
              <div style={{fontSize:11,fontWeight:700,color:s.active?s.color:C.dimmed}}>{s.active?"{ ":"// "}{s.name}</div>
              {s.vars.map((v,j)=>(<div key={j} style={{marginLeft:12,fontSize:12,color:C.codeTxt,fontFamily:"monospace",marginTop:2}}>{"→ "+v}{s.active?<span style={{color:C.success,fontSize:9,marginLeft:6}}>visible</span>:<span style={{color:C.danger,fontSize:9,marginLeft:6}}>detruit</span>}</div>))}
              {s.active&&<div style={{fontSize:9,color:C.dimmed,marginTop:2}}>{"} // fin "+s.name}</div>}
            </div>
          ))}
          {step===0&&<div style={{textAlign:"center",padding:20,color:C.dimmed}}>Appuyez sur Play pour voir les scopes</div>}
          {step>=9&&<div style={{textAlign:"center",marginTop:12,fontSize:12,fontWeight:700,color:C.success}}>Seule 'nom' (classe) survit — les autres sont detruites !</div>}
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:12}}>
          <button onClick={()=>{setStep(0);setPlaying(false);}} style={{width:36,height:36,borderRadius:8,border:"1px solid "+C.border,background:C.card,color:C.muted,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><RotateCcw size={14}/></button>
          <button onClick={()=>setPlaying(!playing)} style={{width:36,height:36,borderRadius:8,border:"1px solid "+C.border,background:playing?C.danger+"20":C.success+"20",color:playing?C.danger:C.success,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{playing?<span>||</span>:<Play size={14}/>}</button>
          <button onClick={()=>setStep(s=>Math.min(s+1,maxSteps))} style={{width:36,height:36,borderRadius:8,border:"1px solid "+C.border,background:C.card,color:C.muted,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><ChevronRight size={14}/></button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 6. STYLE POLICE (LO4 naming conventions)
// ============================================
const STYLE_LINES=[
  {code:'int MyAge = 25;',violations:["MyAge devrait etre myAge (camelCase)"],fixed:"int myAge = 25;"},
  {code:'class voiture {',violations:["voiture devrait etre Voiture (PascalCase)"],fixed:"class Voiture {"},
  {code:'final int pi = 3;',violations:["pi devrait etre PI (SCREAMING_CASE pour constantes)"],fixed:"final int PI = 3;"},
  {code:'public void CALCULATE_TOTAL() {',violations:["CALCULATE_TOTAL devrait etre calculateTotal (camelCase)"],fixed:"public void calculateTotal() {"},
  {code:'String s = "Alice";',violations:["s n'est pas descriptif → nom ou prenom"],fixed:'String prenom = "Alice";'},
  {code:'boolean x = true;',violations:["x n'est pas descriptif → estActif, estValide"],fixed:"boolean estActif = true;"},
  {code:'int a=5,b=10,c=a+b;',violations:["Variables non descriptives","Tout sur une ligne"],fixed:"int largeur = 5;\nint hauteur = 10;\nint surface = largeur + hauteur;"},
  {code:'public class MY_UTILS_CLASS {',violations:["MY_UTILS_CLASS → MyUtilsClass (PascalCase)"],fixed:"public class MyUtilsClass {"},
];

export function Game_StylePolice(){
  const[idx,setIdx]=useState(0);const[found,setFound]=useState(false);const[score,setScore]=useState(0);const[timer,setTimer]=useState(45);const[done,setDone]=useState(false);
  const tRef=useRef(null);const item=STYLE_LINES[idx];
  useEffect(()=>{tRef.current=setInterval(()=>setTimer(t=>{if(t<=1){clearInterval(tRef.current);setDone(true);return 0;}return t-1;}),1000);return()=>clearInterval(tRef.current);},[]);
  function spot(){setFound(true);setScore(s=>s+80);setTimeout(()=>{setFound(false);if(idx+1>=STYLE_LINES.length)setDone(true);else setIdx(i=>i+1);},2000);}
  if(done)return<div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><Shield size={48} color={C.gold}/><div style={{fontSize:24,fontWeight:800,color:C.gold,marginTop:12}}>Style Police : {score} pts</div><div style={{fontSize:12,color:C.muted,marginTop:4}}>{idx}/{STYLE_LINES.length} violations trouvees</div><button onClick={()=>{setIdx(0);setScore(0);setTimer(45);setDone(false);setFound(false);tRef.current=setInterval(()=>setTimer(t=>{if(t<=1){clearInterval(tRef.current);setDone(true);return 0;}return t-1;}),1000);}} style={{marginTop:16,padding:"8px 20px",borderRadius:8,border:"none",background:C.accent,color:C.bg,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700}}><RotateCcw size={12}/> Rejouer</button></div>;
  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',sans-serif",padding:20}}>
      <div style={{maxWidth:600,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div><Shield size={20} color={C.danger}/><span style={{fontSize:18,fontWeight:800,color:C.danger,marginLeft:6}}>STYLE POLICE</span></div>
          <div style={{fontSize:20,fontWeight:800,color:timer<=10?C.danger:C.gold}}>{timer}s</div>
        </div>
        <div style={{fontSize:12,color:C.muted,marginBottom:12}}>Trouvez la violation de naming convention !</div>
        {item&&<>
          <div onClick={()=>{if(!found)spot();}} style={{padding:"16px",borderRadius:10,background:C.code,border:"2px solid "+(found?C.success:C.danger+"40"),cursor:found?"default":"pointer",marginBottom:8}}>
            <pre style={{margin:0,fontSize:14,color:found?C.success:C.codeTxt,fontFamily:"'Consolas',monospace"}}>{item.code}</pre>
          </div>
          {found&&<div style={{padding:"8px 12px",borderRadius:8,background:C.success+"15",marginBottom:8}}>
            {item.violations.map((v,i)=>(<div key={i} style={{fontSize:11,color:C.success,fontWeight:600}}>{"→ "+v}</div>))}
            <div style={{fontSize:11,color:C.accent,marginTop:4,fontFamily:"monospace"}}>{"Correction : "+item.fixed}</div>
          </div>}
          {!found&&<div style={{fontSize:11,color:C.dimmed}}>Cliquez sur le code pour signaler la violation</div>}
        </>}
        <div style={{marginTop:8,fontSize:10,color:C.dimmed}}>Score: {score} | Violation {idx+1}/{STYLE_LINES.length}</div>
      </div>
    </div>
  );
}
