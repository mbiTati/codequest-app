import { useState, useEffect, useCallback } from "react";

const C={bg:"#0a0f1a",card:"#111827",primary:"#0D7377",secondary:"#14A3C7",accent:"#32E0C4",gold:"#F59E0B",text:"#e2e8f0",muted:"#94a3b8",dimmed:"#64748b",border:"#1e293b",success:"#10B981",danger:"#EF4444",code:"#1E293B",codeBorder:"#2d3a4f",codeText:"#32E0C4",comment:"#6b7f99",keyword:"#c792ea",string:"#c3e88d",number:"#f78c6c",type:"#ffcb6b"};
const KEY="cq-m02-unified";
async function ld(){try{const r=await window.storage.get(KEY);return r?JSON.parse(r.value):null;}catch{return null;}}
async function sv(d){try{await window.storage.set(KEY,JSON.stringify(d));}catch{}}

function Code({code,hl=[]}){const lines=code.split("\n");return(<div style={{background:C.code,border:`1px solid ${C.codeBorder}`,borderRadius:10,overflow:"hidden",fontSize:12,fontFamily:"'JetBrains Mono',monospace",margin:"8px 0"}}><div style={{display:"flex",gap:5,padding:"5px 10px",background:"#0d1117",borderBottom:`1px solid ${C.codeBorder}`}}><span style={{width:7,height:7,borderRadius:"50%",background:"#ff5f57"}}/><span style={{width:7,height:7,borderRadius:"50%",background:"#febc2e"}}/><span style={{width:7,height:7,borderRadius:"50%",background:"#28c840"}}/></div><div style={{padding:"8px 0",overflowX:"auto"}}>{lines.map((l,i)=>(<div key={i} style={{display:"flex",padding:"1px 0",background:hl.includes(i)?C.accent+"12":"transparent",borderLeft:hl.includes(i)?`3px solid ${C.accent}`:"3px solid transparent"}}><span style={{width:32,textAlign:"right",paddingRight:8,color:C.dimmed,userSelect:"none",flexShrink:0,fontSize:10}}>{i+1}</span><span style={{color:C.codeText,whiteSpace:"pre"}}>{col(l)}</span></div>))}</div></div>);}
function col(l){return l.replace(/(\/\/.*)/, `\x01C$1\x02`).replace(/\b(public|static|void|class|int|String|double|boolean|if|else|return|new|final|for|while|do|break|continue|true|false|private|import)\b/g,`\x01K$&\x02`).replace(/("(?:[^"\\]|\\.)*")/g,`\x01S$1\x02`).replace(/\b(\d+\.?\d*)\b/g,`\x01N$1\x02`).replace(/\b(System|Scanner|Math)\b/g,`\x01T$1\x02`).split(/(\x01\w.*?\x02)/).map((p,i)=>{if(p.startsWith("\x01C"))return <span key={i} style={{color:C.comment,fontStyle:"italic"}}>{p.slice(2,-1)}</span>;if(p.startsWith("\x01K"))return <span key={i} style={{color:C.keyword}}>{p.slice(2,-1)}</span>;if(p.startsWith("\x01S"))return <span key={i} style={{color:C.string}}>{p.slice(2,-1)}</span>;if(p.startsWith("\x01N"))return <span key={i} style={{color:C.number}}>{p.slice(2,-1)}</span>;if(p.startsWith("\x01T"))return <span key={i} style={{color:C.type}}>{p.slice(2,-1)}</span>;return <span key={i}>{p}</span>;});}
function Quiz({q,opts,correct,onAns,done}){const[sel,setSel]=useState(null);return(<div style={{margin:"12px 0"}}><div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:6}}>{q}</div>{opts.map((o,i)=>{let bg=C.card,bc=C.border;if(done&&i===correct){bg=C.success+"20";bc=C.success;}else if(done&&sel===i){bg=C.danger+"20";bc=C.danger;}return(<button key={i} onClick={()=>{if(done)return;setSel(i);onAns(i===correct);}} style={{display:"block",width:"100%",textAlign:"left",padding:"7px 11px",marginBottom:3,borderRadius:7,border:`1px solid ${bc}`,background:bg,color:C.text,cursor:done?"default":"pointer",fontFamily:"inherit",fontSize:12}}>{String.fromCharCode(65+i)}. {o}</button>);})}</div>);}
function Task({children}){return(<div style={{background:C.primary+"15",borderRadius:8,padding:12,border:`1px solid ${C.primary}40`,margin:"10px 0"}}><div style={{fontSize:12,fontWeight:600,color:C.accent,marginBottom:4}}>A faire dans Eclipse</div><div style={{color:C.text,fontSize:12,lineHeight:1.6}}>{children}</div></div>);}
function Tip({title,children,color=C.gold}){return(<div style={{background:color+"15",borderRadius:7,padding:10,border:`1px solid ${color}40`,margin:"8px 0"}}><div style={{fontSize:11,fontWeight:600,color,marginBottom:3}}>{title}</div><div style={{color:C.text,fontSize:11,lineHeight:1.5}}>{children}</div></div>);}
function P({children}){return <p style={{color:C.muted,fontSize:13,lineHeight:1.7,marginBottom:6}}>{children}</p>;}
function Strong({children,c=C.text}){return <strong style={{color:c}}>{children}</strong>;}
function Kw({children}){return <code style={{color:C.keyword,fontSize:12}}>{children}</code>;}
function Ac({children}){return <code style={{color:C.accent,fontSize:12}}>{children}</code>;}

// ═══ GAME: LOOP SIMULATOR ═══
function LoopGame({onComplete}){
  const CHALLENGES=[
    {code:`int t=0;\nfor(int i=1;i<=4;i++) t+=i;\n// t=?`,q:"Valeur de t ?",opts:["4","10","6","15"],correct:1,trace:["i=1→t=1","i=2→t=3","i=3→t=6","i=4→t=10"]},
    {code:`int c=0;\nfor(int i=0;i<10;i++)\n  if(i%2==0) c++;\n// c=?`,q:"Valeur de c ?",opts:["4","5","10","6"],correct:1,trace:["0✓,2✓,4✓,6✓,8✓ → 5 pairs"]},
    {code:`int n=64; int s=0;\nwhile(n>1) {\n  n/=2; s++;\n}\n// s=?`,q:"Valeur de s ?",opts:["5","6","7","32"],correct:1,trace:["64→32→16→8→4→2→1 = 6 divisions"]},
    {code:`int sum=0;\nfor(int i=0;i<8;i++){\n  if(i==3) continue;\n  if(i==6) break;\n  sum+=i;\n}\n// sum=?`,q:"Valeur de sum ?",opts:["15","12","10","21"],correct:2,trace:["0+1+2+(skip3)+4+5+(break6) = 12"]},
    {code:`int c=0;\nfor(int i=0;i<3;i++)\n  for(int j=0;j<4;j++)\n    c++;\n// c=?`,q:"Valeur de c ?",opts:["7","12","9","16"],correct:1,trace:["3 tours × 4 tours = 12"]},
    {code:`String s="";\nfor(int i=3;i>=1;i--)\n  s+=i;\n// s=?`,q:'Valeur de s ?',opts:['"123"','"321"','"3"','"6"'],correct:1,trace:["i=3→'3', i=2→'32', i=1→'321'"]},
  ];
  const[idx,setIdx]=useState(0);const[score,setScore]=useState(0);const[sel,setSel]=useState(null);const[answered,setAnswered]=useState(false);const[showTrace,setShowTrace]=useState(false);
  const ch=CHALLENGES[idx];
  const answer=(i)=>{if(answered)return;setSel(i);setAnswered(true);if(i===ch.correct)setScore(s=>s+20);};
  const next=()=>{if(idx+1>=CHALLENGES.length){onComplete(score+(sel===ch.correct?20:0));return;}setIdx(n=>n+1);setSel(null);setAnswered(false);setShowTrace(false);};
  return(<div style={{background:C.card,borderRadius:12,padding:14,border:`1px solid ${C.border}`,margin:"10px 0"}}>
    <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:6}}><span style={{color:C.dimmed}}>Défi {idx+1}/{CHALLENGES.length}</span><span style={{color:C.gold,fontWeight:700}}>Score: {score}</span></div>
    <div style={{background:C.code,borderRadius:8,padding:10,fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:C.codeText,whiteSpace:"pre-wrap",marginBottom:8}}>{ch.code}</div>
    <div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:6}}>{ch.q}</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
      {ch.opts.map((o,i)=>{let bg=C.code,bc=C.codeBorder;if(answered&&i===ch.correct){bg=C.success+"20";bc=C.success;}else if(answered&&sel===i){bg=C.danger+"20";bc=C.danger;}
      return(<button key={i} onClick={()=>answer(i)} style={{padding:"10px",borderRadius:8,border:`1px solid ${bc}`,background:bg,color:C.codeText,cursor:answered?"default":"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:15,fontWeight:700}}>{o}</button>);})}
    </div>
    {answered&&(<div style={{marginTop:8}}>
      <button onClick={()=>setShowTrace(!showTrace)} style={{padding:"5px 12px",borderRadius:6,border:`1px solid ${C.border}`,background:"transparent",color:C.accent,cursor:"pointer",fontFamily:"inherit",fontSize:11,marginBottom:4}}>{showTrace?"Masquer":"Voir"} la trace</button>
      {showTrace&&<div style={{background:C.code,borderRadius:6,padding:8,fontSize:11,color:C.muted}}>{ch.trace.map((t,i)=><div key={i}>→ {t}</div>)}</div>}
      <button onClick={next} style={{width:"100%",marginTop:6,padding:"8px",borderRadius:7,border:"none",background:C.accent,color:C.bg,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600}}>{idx+1>=CHALLENGES.length?"Terminer":"Suivant →"}</button>
    </div>)}
  </div>);
}

// ═══ MEMO ═══
function Memo(){return(<div style={{background:C.card,borderRadius:12,padding:20,border:`1px solid ${C.gold}40`}}>
  <div style={{fontSize:16,fontWeight:700,color:C.gold,marginBottom:12}}>Mémo débloqué — Boucles Java</div>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
    {[{t:"for",c:`for(int i=0; i<n; i++){\n  // n tours\n}`,d:"Tours connus"},{t:"while",c:`while(condition){\n  // tant que vrai\n}`,d:"Tours inconnus"},{t:"do-while",c:`do {\n  // au moins 1 fois\n} while(cond);`,d:"Au moins 1 fois"}].map(b=>(
      <div key={b.t} style={{background:C.code,borderRadius:8,padding:10}}>
        <div style={{fontSize:12,fontWeight:600,color:C.accent,marginBottom:4}}>{b.t}</div>
        <pre style={{margin:0,fontSize:10,color:C.codeText,fontFamily:"monospace"}}>{b.c}</pre>
        <div style={{fontSize:10,color:C.dimmed,marginTop:4}}>{b.d}</div>
      </div>
    ))}
  </div>
  <div style={{marginTop:10,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
    <div style={{background:C.success+"15",borderRadius:6,padding:8}}><div style={{fontSize:10,fontWeight:600,color:C.success}}>break</div><div style={{fontSize:10,color:C.muted}}>Sort immédiatement de la boucle</div></div>
    <div style={{background:C.gold+"15",borderRadius:6,padding:8}}><div style={{fontSize:10,fontWeight:600,color:C.gold}}>continue</div><div style={{fontSize:10,color:C.muted}}>Saute au tour suivant</div></div>
  </div>
  <div style={{marginTop:10,background:C.danger+"15",borderRadius:6,padding:8}}><div style={{fontSize:10,fontWeight:600,color:C.danger}}>Pièges</div><div style={{fontSize:10,color:C.muted}}>Boucle infinie (rien ne change dans while) · .length (array) vs .length() (String) vs .size() (ArrayList)</div></div>
</div>);}

// ═══ STEPS ═══
const STEPS=[
  {section:"Théorie",title:"La boucle for",type:"theory",render:(onQ,done)=>(<>
    <P>La boucle <Kw>for</Kw> répète un bloc quand on <Strong c={C.accent}>sait combien de fois</Strong>.</P>
    <Code hl={[0,1,2]} code={`for (int i = 0; i < 5; i++) {
    System.out.println("Tour " + i);
}
// Affiche : Tour 0, 1, 2, 3, 4`}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,margin:"8px 0"}}>
      <div style={{background:C.card,borderRadius:7,padding:7,border:`1px solid ${C.border}`}}><div style={{fontWeight:700,color:C.accent,fontSize:11}}>int i = 0</div><div style={{color:C.muted,fontSize:10}}>Début</div></div>
      <div style={{background:C.card,borderRadius:7,padding:7,border:`1px solid ${C.border}`}}><div style={{fontWeight:700,color:C.gold,fontSize:11}}>i {"<"} 5</div><div style={{color:C.muted,fontSize:10}}>Condition</div></div>
      <div style={{background:C.card,borderRadius:7,padding:7,border:`1px solid ${C.border}`}}><div style={{fontWeight:700,color:C.secondary,fontSize:11}}>i++</div><div style={{color:C.muted,fontSize:10}}>+1 chaque tour</div></div>
    </div>
    <Task>1. Créez <Ac>TestBoucles.java</Ac><br/>2. Boucle for de 1 à 10<br/>3. Modifiez : de 10 à 1 (<Ac>i--</Ac>)<br/>4. Seulement les pairs (<Ac>i+=2</Ac>)</Task>
    <Quiz q="Combien de tours : for(int i=0; i<3; i++) ?" opts={["2","3","4","Infini"]} correct={1} onAns={onQ} done={done}/>
  </>)},
  {section:"Théorie",title:"for et les tableaux",type:"theory",render:(onQ,done)=>(<>
    <P>La boucle <Kw>for</Kw> parcourt un tableau :</P>
    <Code hl={[2,3,6,7]} code={`String[] inv = {"Téléphone", "Ampoule", "Radio"};
// for classique (avec index)
for (int i = 0; i < inv.length; i++) {
    System.out.println((i+1) + ". " + inv[i]);
}
// for-each (sans index, plus simple)
for (String item : inv) {
    System.out.println("- " + item);
}`}/>
    <Tip title="for classique vs for-each"><Strong>Classique</Strong> : quand vous avez besoin de l'index (i)<br/><Strong>for-each</Strong> : juste parcourir, plus lisible</Tip>
    <Code code={`// Calcul de somme
int[] notes = {85, 72, 90, 68};
int somme = 0;
for (int n : notes) somme += n;
double moy = (double) somme / notes.length;`}/>
    <Task>1. Créez un tableau de 5 prénoms<br/>2. Affichez-les numérotés (for classique)<br/>3. Comptez ceux qui ont plus de 5 lettres (<Ac>.length()</Ac>)</Task>
    <Quiz q=".length ou .length() pour un tableau ?" opts={[".length()","Les deux marchent",".length (sans parenthèses)",".size()"]} correct={2} onAns={onQ} done={done}/>
  </>)},
  {section:"Théorie",title:"while et do-while",type:"theory",render:(onQ,done)=>(<>
    <P><Kw>while</Kw> répète <Strong>tant que</Strong> la condition est vraie. Quand on <Strong c={C.accent}>ne sait pas combien de tours</Strong>.</P>
    <Code hl={[1,2,3]} code={`int n = 64;
while (n > 1) {
    n = n / 2;
}
// n passe par : 64, 32, 16, 8, 4, 2, 1`}/>
    <Tip title="Boucle infinie !" color={C.danger}>Si rien ne change dans le while, la condition reste true pour toujours ! Toujours vérifier qu'une variable évolue.</Tip>
    <P><Kw>do-while</Kw> s'exécute <Strong c={C.accent}>au moins 1 fois</Strong> (condition vérifiée APRÈS) :</P>
    <Code hl={[1,2,3,4]} code={`int choix;
do {
    System.out.println("1.Jouer 2.Scores 0.Quitter");
    choix = sc.nextInt();
} while (choix != 0);`}/>
    <Task>1. Programme qui demande un nombre entre 1 et 100<br/>2. while : redemande tant que invalide<br/>3. Comptez les tentatives</Task>
    <Quiz q="Différence while vs do-while ?" opts={["Aucune","do-while s'exécute au moins 1 fois","while est plus rapide","do-while n'a pas de condition"]} correct={1} onAns={onQ} done={done}/>
  </>)},
  {section:"Théorie",title:"break et continue",type:"theory",render:(onQ,done)=>(<>
    <P><Kw>break</Kw> sort immédiatement. <Kw>continue</Kw> saute au tour suivant.</P>
    <Code hl={[2,4]} code={`for (int i = 0; i < 10; i++) {
    if (i == 5) continue;  // saute 5
    if (i == 8) break;     // sort à 8
    System.out.println(i);
}
// Affiche : 0, 1, 2, 3, 4, 6, 7`}/>
    <Task>1. Boucle de 1 à 20<br/>2. <Ac>continue</Ac> si le nombre est divisible par 3<br/>3. <Ac>break</Ac> si le nombre dépasse 15<br/>4. Prédisez ce qui s'affiche AVANT d'exécuter !</Task>
    <Quiz q="Que fait continue ?" opts={["Sort de la boucle","Saute au tour suivant","Arrête le programme","Recommence à 0"]} correct={1} onAns={onQ} done={done}/>
  </>)},

  // ── JEU ──
  {section:"Défi",title:"Le Simulateur de Boucles",type:"game",render:(_,__,onGC)=>(<>
    <P>6 codes avec des boucles — <Strong>prédisez le résultat sans exécuter !</Strong> Après chaque réponse, voyez la trace pas à pas.</P>
    <LoopGame onComplete={onGC}/>
  </>)},

  // ── CODE GUIDÉ ──
  {section:"Code guidé",title:"Statistiques de notes pas à pas",type:"guided",render:(onQ,done)=>(<>
    <P>Construisons un programme de stats étape par étape. <Strong>Tapez chaque partie dans Eclipse.</Strong></P>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:8,marginBottom:4}}>Étape 1 : Variables et boucle while</div>
    <Code hl={[4,5,6,7,8]} code={`Scanner sc = new Scanner(System.in);
int compteur = 0, somme = 0;
int max = 0, min = 100;
System.out.println("Entrez des notes, -1 pour finir");
int note = 0;
while (note != -1) {
    System.out.print("Note : ");
    note = sc.nextInt();
    if (note == -1) break;`}/>
    <P>Tapez ça. Testez — ça lit des notes en boucle et s'arrête à -1.</P>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:8,marginBottom:4}}>Étape 2 : Validation + stats</div>
    <Code hl={[0,1,2,4,5,6,7]} code={`    if (note < 0 || note > 100) {
        System.out.println("Invalide !");
        continue;    // retour au début de la boucle
    }
    compteur++;
    somme += note;
    if (note > max) max = note;
    if (note < min) min = note;
}`}/>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:8,marginBottom:4}}>Étape 3 : Afficher les résultats</div>
    <Code hl={[1,2,3,4,5]} code={`if (compteur == 0) {
    System.out.println("Aucune note.");
} else {
    double moy = (double) somme / compteur;
    System.out.println("Nb: " + compteur + " Moy: " + moy);
    System.out.println("Max: " + max + " Min: " + min);
}`}/>
    <Tip title="Points clés"><Strong>(double)</Strong> avant somme/compteur force la division décimale<br/><Strong>continue</Strong> saute les notes invalides sans planter<br/><Strong>compteur==0</Strong> évite la division par zéro</Tip>
    <Task>Tapez le programme complet. Testez avec : 85, 92, 150, 45, -5, 78, -1<br/><Strong>Résultat attendu :</Strong> 4 notes, moy 75.0, max 92, min 45 (150 et -5 refusés)</Task>
    <Quiz q="Pourquoi (double) devant somme/compteur ?" opts={["Pour arrondir","Pour forcer une division décimale au lieu d'entière","C'est optionnel","Pour convertir en String"]} correct={1} onAns={onQ} done={done}/>
  </>)},

  // ── EXERCICE ──
  {section:"Exercice",title:"Le Labo de Statistiques (autonome)",type:"exercise",render:(onQ,done)=>(<>
    <div style={{background:C.gold+"15",borderRadius:10,padding:14,border:`1px solid ${C.gold}40`}}>
      <div style={{fontSize:15,fontWeight:700,color:C.gold,marginBottom:4}}>Exercice — 50 Crédits R&D</div>
      <div style={{color:C.text,fontSize:13}}>Reprenez le programme de stats et ajoutez les fonctionnalités manquantes. <Strong>Faites-le SEUL !</Strong></div>
    </div>
    <div style={{color:C.text,fontSize:12,lineHeight:1.8,marginTop:10}}>
      <Strong>À ajouter au code guidé :</Strong><br/>
      1. Compter les grades : Distinction (≥90), Merit (≥70), Pass (≥50), Refer ({"<"}50) → <Strong c={C.accent}>if/else if</Strong><br/>
      2. Afficher la répartition à la fin avec un <Strong c={C.accent}>for</Strong> sur un tableau de compteurs<br/>
      3. Stocker les notes dans un <Strong c={C.accent}>ArrayList{"<Integer>"}</Strong><br/>
      4. Afficher les notes triées à la fin (<Ac>Collections.sort(liste)</Ac>)<br/>
      5. <Strong c={C.gold}>Bonus</Strong> : afficher un histogramme en étoiles (ex: Merit: ★★★)
    </div>
    <Quiz q="Pour trier un ArrayList, quelle méthode ?" opts={["list.sort()","Collections.sort(list)","Arrays.sort(list)","list.order()"]} correct={1} onAns={onQ} done={done}/>
  </>)},

  // ── CORRECTION ──
  {section:"Correction",title:"Correction LaboStats",type:"correction",render:(onQ,done)=>(<>
    <div style={{background:C.success+"12",borderRadius:8,padding:10,border:`1px solid ${C.success}40`,marginBottom:8}}><div style={{fontSize:13,fontWeight:700,color:C.success}}>Correction complète</div></div>
    <Code hl={[0,12,13,14,15,16,17,25,26,27,28,29,30,31,32]} code={`import java.util.*; // ArrayList, Collections, Scanner
public class LaboStats {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    ArrayList<Integer> notes = new ArrayList<>();
    int[] grades = {0, 0, 0, 0}; // D, M, P, R
    String[] noms = {"Distinction","Merit","Pass","Refer"};
    int max=0, min=100;
    System.out.println("Notes (0-100), -1 pour finir:");
    int note = 0;
    while (note != -1) {
      System.out.print("Note: "); note = sc.nextInt();
      if (note == -1) break;
      if (note<0||note>100){System.out.println("Invalide!");continue;}
      notes.add(note);
      if(note>max) max=note;
      if(note<min) min=note;
      if(note>=90) grades[0]++;
      else if(note>=70) grades[1]++;
      else if(note>=50) grades[2]++;
      else grades[3]++;
    }
    if (notes.isEmpty()) { System.out.println("Aucune note."); }
    else {
      int somme=0; for(int n:notes) somme+=n;
      System.out.println("Nb: "+notes.size()+" Moy: "+(double)somme/notes.size());
      System.out.println("Max: "+max+" Min: "+min);
      for(int i=0;i<4;i++){
        String stars = "";
        for(int j=0;j<grades[i];j++) stars+="★";
        System.out.println(noms[i]+": "+grades[i]+" "+stars);
      }
      Collections.sort(notes);
      System.out.println("Triées: "+notes);
    }
    sc.close();
  }
}`}/>
    <Tip title="Points clés"><Strong>ArrayList{"<Integer>"}</Strong> : pas int, mais Integer (type objet)<br/><Strong>Collections.sort()</Strong> : trie en place<br/>Boucle imbriquée pour les étoiles</Tip>
    <Quiz q="Pourquoi ArrayList<Integer> et pas ArrayList<int> ?" opts={["C'est pareil","ArrayList ne marche qu'avec des types objets, pas des primitifs","int n'existe pas en Java","Integer est plus rapide"]} correct={1} onAns={onQ} done={done}/>
  </>)},
];

// ═══ MAIN ═══
export default function M02Unified(){
  const[step,setStep]=useState(0);const[completed,setCompleted]=useState({});const[score,setScore]=useState(0);const[totalQ,setTotalQ]=useState(0);const[credits,setCredits]=useState(0);const[gameScore,setGameScore]=useState(null);const[ready,setReady]=useState(false);const[showMemo,setShowMemo]=useState(false);
  const allDone=Object.keys(completed).length>=STEPS.length;
  useEffect(()=>{ld().then(d=>{if(d){setCompleted(d.c||{});setScore(d.s||0);setTotalQ(d.t||0);setCredits(d.cr||0);setGameScore(d.gs);if(d.st!==undefined)setStep(d.st);}setReady(true);});},[]);
  const persist=useCallback((c,s,t,cr,gs,st)=>{sv({c,s,t,cr,gs,st});},[]);
  const handleQuiz=(ok)=>{const nT=totalQ+1,nS=score+(ok?1:0),nCr=credits+(ok?5:0),nC={...completed,[step]:true};setTotalQ(nT);setScore(nS);setCredits(nCr);setCompleted(nC);persist(nC,nS,nT,nCr,gameScore,step);};
  const handleGC=(gs)=>{setGameScore(gs);const nCr=credits+Math.floor(gs/2);setCredits(nCr);const nC={...completed,[step]:true};setCompleted(nC);persist(nC,score,totalQ,nCr,gs,step);};
  const go=(dir)=>{const ns=step+dir;if(ns>=0&&ns<STEPS.length){setStep(ns);persist(completed,score,totalQ,credits,gameScore,ns);}};
  if(!ready)return<div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",color:C.muted}}>Chargement...</div>;
  const cur=STEPS[step];const isDone=!!completed[step];const sections=[...new Set(STEPS.map(s=>s.section))];
  const secColors={Théorie:C.secondary,Défi:C.gold,"Code guidé":C.primary,Exercice:C.accent,Correction:C.success};
  return(<div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',system-ui,sans-serif"}}><style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
    <div style={{padding:"8px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:C.card,flexWrap:"wrap",gap:4}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:10,letterSpacing:2,color:C.dimmed}}>CODEQUEST</span><span style={{color:C.border}}>|</span><span style={{fontSize:12,fontWeight:600,color:C.accent}}>M02 · Boucles</span></div><div style={{display:"flex",gap:10,fontSize:11}}><span style={{color:C.muted}}>Quiz <strong style={{color:C.success}}>{score}/{totalQ}</strong></span>{gameScore!==null&&<span style={{color:C.muted}}>Jeu <strong style={{color:C.accent}}>{gameScore}</strong></span>}<span style={{color:C.muted}}>CR <strong style={{color:C.gold}}>{credits}</strong></span></div></div>
    <div style={{display:"flex",maxWidth:1100,margin:"0 auto",minHeight:"calc(100vh - 42px)"}}>
      <div style={{width:200,borderRight:`1px solid ${C.border}`,padding:"10px 0",flexShrink:0,overflowY:"auto",display:"flex",flexDirection:"column"}}>
        {sections.map(sec=>{const sts=STEPS.map((s,i)=>({...s,idx:i})).filter(s=>s.section===sec);return(<div key={sec}><div style={{padding:"5px 12px",fontSize:9,letterSpacing:1,color:secColors[sec]||C.dimmed,fontWeight:700,textTransform:"uppercase"}}>{sec}</div>{sts.map(s=>{const c2=s.idx===step,dn=!!completed[s.idx];return(<button key={s.idx} onClick={()=>{setStep(s.idx);persist(completed,score,totalQ,credits,gameScore,s.idx);}} style={{display:"flex",alignItems:"center",gap:5,width:"100%",padding:"4px 12px 4px 20px",border:"none",background:c2?C.accent+"12":"transparent",borderLeft:c2?`2px solid ${C.accent}`:"2px solid transparent",cursor:"pointer",fontFamily:"inherit",fontSize:11,color:c2?C.accent:dn?C.success:C.muted,textAlign:"left"}}><span style={{fontSize:8}}>{dn?"✓":"○"}</span>{s.title}</button>);})}</div>);})}
        <div style={{padding:10,marginTop:"auto"}}><div style={{height:3,background:C.border,borderRadius:2,overflow:"hidden",marginBottom:6}}><div style={{width:`${(Object.keys(completed).length/STEPS.length)*100}%`,height:"100%",background:`linear-gradient(90deg,${C.primary},${C.accent})`,borderRadius:2,transition:"width .5s"}}/></div>
        <button onClick={()=>allDone&&setShowMemo(!showMemo)} style={{width:"100%",padding:"8px",borderRadius:8,border:`1px solid ${allDone?C.gold:C.border}`,background:allDone?C.gold+"15":"transparent",color:allDone?C.gold:C.dimmed,cursor:allDone?"pointer":"default",fontFamily:"inherit",fontSize:11,fontWeight:600,opacity:allDone?1:0.5}}>{allDone?"📋 Voir le Mémo":"🔒 Mémo"}</button></div>
      </div>
      <div style={{flex:1,padding:"16px 24px",overflowY:"auto",maxHeight:"calc(100vh - 42px)"}}>{showMemo&&allDone?<Memo/>:(<div key={step} style={{animation:"fadeIn .25s"}}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}><span style={{fontSize:9,padding:"2px 8px",borderRadius:10,background:(secColors[cur.section]||C.dimmed)+"20",color:secColors[cur.section]||C.dimmed,fontWeight:600,letterSpacing:1}}>{cur.section.toUpperCase()}</span></div><h2 style={{fontSize:18,fontWeight:700,marginBottom:12}}>{cur.title}</h2>{cur.type==="game"?cur.render(handleQuiz,isDone,handleGC):cur.render(handleQuiz,isDone)}<div style={{display:"flex",justifyContent:"space-between",marginTop:24,paddingTop:10,borderTop:`1px solid ${C.border}`}}><button onClick={()=>go(-1)} disabled={step===0} style={{padding:"7px 16px",borderRadius:7,border:`1px solid ${C.border}`,background:"transparent",color:step===0?C.border:C.muted,cursor:step===0?"default":"pointer",fontFamily:"inherit",fontSize:12}}>←</button><button onClick={()=>go(1)} disabled={step===STEPS.length-1} style={{padding:"7px 16px",borderRadius:7,border:"none",background:step===STEPS.length-1?C.border:C.accent,color:step===STEPS.length-1?C.muted:C.bg,cursor:step===STEPS.length-1?"default":"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600}}>{step===STEPS.length-1?"Fin":"→"}</button></div></div>)}</div>
    </div>
  </div>);
}
