import { useState, useEffect, useCallback, useRef } from "react";

const C = {
  bg: "#0a0f1a", card: "#111827", primary: "#0D7377", secondary: "#14A3C7",
  accent: "#32E0C4", gold: "#F59E0B", text: "#e2e8f0", muted: "#94a3b8",
  dimmed: "#64748b", border: "#1e293b", success: "#10B981", danger: "#EF4444",
  code: "#1E293B", codeBorder: "#2d3a4f", codeText: "#32E0C4", comment: "#6b7f99",
  keyword: "#c792ea", string: "#c3e88d", number: "#f78c6c", type: "#ffcb6b",
};
const KEY = "cq-m01-unified";
async function ld(){try{const r=await window.storage.get(KEY);return r?JSON.parse(r.value):null;}catch{return null;}}
async function sv(d){try{await window.storage.set(KEY,JSON.stringify(d));}catch{}}

// ═══ UI COMPONENTS ═══
function Code({code,hl=[]}){const lines=code.split("\n");return(<div style={{background:C.code,border:`1px solid ${C.codeBorder}`,borderRadius:10,overflow:"hidden",fontSize:12,fontFamily:"'JetBrains Mono',monospace",margin:"8px 0"}}><div style={{display:"flex",gap:5,padding:"5px 10px",background:"#0d1117",borderBottom:`1px solid ${C.codeBorder}`}}><span style={{width:7,height:7,borderRadius:"50%",background:"#ff5f57"}}/><span style={{width:7,height:7,borderRadius:"50%",background:"#febc2e"}}/><span style={{width:7,height:7,borderRadius:"50%",background:"#28c840"}}/></div><div style={{padding:"8px 0",overflowX:"auto"}}>{lines.map((l,i)=>(<div key={i} style={{display:"flex",padding:"1px 0",background:hl.includes(i)?C.accent+"12":"transparent",borderLeft:hl.includes(i)?`3px solid ${C.accent}`:"3px solid transparent"}}><span style={{width:32,textAlign:"right",paddingRight:8,color:C.dimmed,userSelect:"none",flexShrink:0,fontSize:10}}>{i+1}</span><span style={{color:C.codeText,whiteSpace:"pre"}}>{colorize(l)}</span></div>))}</div></div>);}
function colorize(l){return l.replace(/(\/\/.*)/, `\x01C$1\x02`).replace(/\b(public|static|void|class|int|String|double|boolean|if|else|switch|case|break|default|return|new|final|for|while|true|false|private|import)\b/g,`\x01K$&\x02`).replace(/("(?:[^"\\]|\\.)*")/g,`\x01S$1\x02`).replace(/\b(\d+\.?\d*)\b/g,`\x01N$1\x02`).replace(/\b(System|Scanner|Math)\b/g,`\x01T$1\x02`).split(/(\x01\w.*?\x02)/).map((p,i)=>{if(p.startsWith("\x01C"))return <span key={i} style={{color:C.comment,fontStyle:"italic"}}>{p.slice(2,-1)}</span>;if(p.startsWith("\x01K"))return <span key={i} style={{color:C.keyword}}>{p.slice(2,-1)}</span>;if(p.startsWith("\x01S"))return <span key={i} style={{color:C.string}}>{p.slice(2,-1)}</span>;if(p.startsWith("\x01N"))return <span key={i} style={{color:C.number}}>{p.slice(2,-1)}</span>;if(p.startsWith("\x01T"))return <span key={i} style={{color:C.type}}>{p.slice(2,-1)}</span>;return <span key={i}>{p}</span>;});}

function Quiz({q,opts,correct,onAns,done}){const[sel,setSel]=useState(null);return(<div style={{margin:"12px 0"}}><div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:6}}>{q}</div>{opts.map((o,i)=>{let bg=C.card,bc=C.border;if(done&&i===correct){bg=C.success+"20";bc=C.success;}else if(done&&sel===i){bg=C.danger+"20";bc=C.danger;}return(<button key={i} onClick={()=>{if(done)return;setSel(i);onAns(i===correct);}} style={{display:"block",width:"100%",textAlign:"left",padding:"7px 11px",marginBottom:3,borderRadius:7,border:`1px solid ${bc}`,background:bg,color:C.text,cursor:done?"default":"pointer",fontFamily:"inherit",fontSize:12,transition:"all .15s"}}>{String.fromCharCode(65+i)}. {o}</button>);})}</div>);}

function Task({children}){return(<div style={{background:C.primary+"15",borderRadius:8,padding:12,border:`1px solid ${C.primary}40`,margin:"10px 0"}}><div style={{fontSize:12,fontWeight:600,color:C.accent,marginBottom:4}}>A faire dans Eclipse</div><div style={{color:C.text,fontSize:12,lineHeight:1.6}}>{children}</div></div>);}
function Tip({title,children,color=C.gold}){return(<div style={{background:color+"15",borderRadius:7,padding:10,border:`1px solid ${color}40`,margin:"8px 0"}}><div style={{fontSize:11,fontWeight:600,color,marginBottom:3}}>{title}</div><div style={{color:C.text,fontSize:11,lineHeight:1.5}}>{children}</div></div>);}
function P({children}){return <p style={{color:C.muted,fontSize:13,lineHeight:1.7,marginBottom:6}}>{children}</p>;}
function Strong({children,c=C.text}){return <strong style={{color:c}}>{children}</strong>;}
function Kw({children}){return <code style={{color:C.keyword,fontSize:12}}>{children}</code>;}
function Ac({children}){return <code style={{color:C.accent,fontSize:12}}>{children}</code>;}

// ═══ GAME: TRUE/FALSE EVALUATOR (integrated) ═══
function TrueFalseGame({onComplete}){
  const r=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const gen=(diff)=>{
    if(diff<5){const a=r(1,20),b=r(1,20),op=pick([">","<",">=","<=","==","!="]);const ans=eval(`${a}${op==="=="?"===":op==="!="?"!==":op}${b}`);return{expr:`${a} ${op} ${b}`,answer:ans};}
    if(diff<10){const a=r(1,20),b=r(1,20);const type=pick(["and","or"]);if(type==="and"){const ans=a>10&&b<15;return{expr:`${a} > 10 && ${b} < 15`,answer:ans};}const ans=a<5||b>18;return{expr:`${a} < 5 || ${b} > 18`,answer:ans};}
    const a=r(1,20),b=r(1,20),c=r(1,20);const ans=(a>b||c<10)&&a!==c;return{expr:`(${a} > ${b} || ${c} < 10) && ${a} != ${c}`,answer:ans};
  };
  const[qNum,setQNum]=useState(0);const[q,setQ]=useState(()=>gen(0));const[score,setScore]=useState(0);const[streak,setStreak]=useState(0);const[answered,setAnswered]=useState(false);const[lastOk,setLastOk]=useState(null);const[timeLeft,setTimeLeft]=useState(12);const TOTAL=12;
  useEffect(()=>{if(answered||qNum>=TOTAL)return;const t=setTimeout(()=>{if(timeLeft<=1){setAnswered(true);setLastOk(false);setStreak(0);}else setTimeLeft(tl=>tl-1);},1000);return()=>clearTimeout(t);},[timeLeft,answered,qNum]);
  const answer=(val)=>{if(answered)return;setAnswered(true);const ok=val===q.answer;setLastOk(ok);if(ok){setScore(s=>s+10+streak*3);setStreak(s=>s+1);}else setStreak(0);};
  const next=()=>{if(qNum+1>=TOTAL){onComplete(score+(lastOk?10+streak*3:0));return;}setQNum(n=>n+1);setQ(gen(qNum+1));setTimeLeft(12);setAnswered(false);setLastOk(null);};

  if(qNum>=TOTAL)return null;
  const pct=(timeLeft/12)*100;
  return(<div style={{background:C.card,borderRadius:12,padding:16,border:`1px solid ${C.border}`,margin:"12px 0"}}>
    <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:8}}><span style={{color:C.dimmed}}>Défi {qNum+1}/{TOTAL}</span><span style={{color:C.gold,fontWeight:700}}>Score: {score}</span><span style={{color:streak>=3?C.accent:C.dimmed}}>Combo x{streak}</span></div>
    <div style={{height:4,background:C.border,borderRadius:2,marginBottom:12,overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",background:pct>30?C.accent:pct>15?C.gold:C.danger,borderRadius:2,transition:"width 1s linear"}}/></div>
    <div style={{background:C.code,borderRadius:10,padding:"16px 12px",textAlign:"center",marginBottom:12,border:`1px solid ${answered?(lastOk?C.success:C.danger)+"50":C.codeBorder}`}}>
      <div style={{fontSize:10,color:C.dimmed,letterSpacing:2,marginBottom:6}}>TRUE OU FALSE ?</div>
      <div style={{fontSize:18,fontWeight:700,color:C.accent,fontFamily:"'JetBrains Mono',monospace"}}>{q.expr}</div>
      {answered&&<div style={{marginTop:8,fontSize:13,fontWeight:600,color:lastOk?C.success:C.danger}}>{lastOk?"Correct !":"Réponse : "+String(q.answer)}</div>}
    </div>
    {!answered?(<div style={{display:"flex",gap:10}}><button onClick={()=>answer(true)} style={{flex:1,padding:"12px",borderRadius:10,border:"none",background:`linear-gradient(135deg,${C.success},#059669)`,color:"#fff",fontSize:16,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>TRUE</button><button onClick={()=>answer(false)} style={{flex:1,padding:"12px",borderRadius:10,border:"none",background:`linear-gradient(135deg,${C.danger},#dc2626)`,color:"#fff",fontSize:16,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>FALSE</button></div>):(<button onClick={next} style={{width:"100%",padding:"10px",borderRadius:8,border:"none",background:C.accent,color:C.bg,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{qNum+1>=TOTAL?"Terminer le défi":"Suivant →"}</button>)}
    <div style={{display:"flex",gap:3,justifyContent:"center",marginTop:10}}>{Array.from({length:TOTAL},(_,i)=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:i<qNum?(i<qNum?C.success:C.danger):i===qNum?C.accent:C.border}}/>)}</div>
  </div>);
}

// ═══ MEMO (unlockable) ═══
function Memo(){return(<div style={{background:C.card,borderRadius:12,padding:20,border:`1px solid ${C.gold}40`}}>
  <div style={{fontSize:16,fontWeight:700,color:C.gold,marginBottom:12}}>Mémo débloqué — Conditions en Java</div>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
    <div style={{background:C.code,borderRadius:8,padding:10}}>
      <div style={{fontSize:11,fontWeight:600,color:C.accent,marginBottom:6}}>Comparaison</div>
      <div style={{fontSize:11,color:C.codeText,fontFamily:"monospace",lineHeight:1.8}}>{"== != > < >= <="}</div>
    </div>
    <div style={{background:C.code,borderRadius:8,padding:10}}>
      <div style={{fontSize:11,fontWeight:600,color:C.accent,marginBottom:6}}>Logique</div>
      <div style={{fontSize:11,color:C.codeText,fontFamily:"monospace",lineHeight:1.8}}>{"&& (ET)  || (OU)  ! (NON)"}</div>
    </div>
  </div>
  <div style={{marginTop:10,background:C.code,borderRadius:8,padding:10}}>
    <div style={{fontSize:11,fontWeight:600,color:C.accent,marginBottom:4}}>Structure if/else</div>
    <pre style={{margin:0,fontSize:11,color:C.codeText,fontFamily:"monospace"}}>{"if (condition) {\n    // si vrai\n} else if (autre) {\n    // sinon si\n} else {\n    // sinon\n}"}</pre>
  </div>
  <div style={{marginTop:10,background:C.code,borderRadius:8,padding:10}}>
    <div style={{fontSize:11,fontWeight:600,color:C.accent,marginBottom:4}}>switch/case</div>
    <pre style={{margin:0,fontSize:11,color:C.codeText,fontFamily:"monospace"}}>{"switch (var) {\n    case val: ...; break;\n    default: ...;\n}"}</pre>
  </div>
  <div style={{marginTop:10,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
    <div style={{background:C.danger+"15",borderRadius:6,padding:8}}><div style={{fontSize:10,fontWeight:600,color:C.danger}}>Pièges</div><div style={{fontSize:10,color:C.muted,marginTop:2}}>== vs .equals() pour String{"\n"}= (affectation) vs == (comparaison){"\n"}Oublier break dans switch</div></div>
    <div style={{background:C.success+"15",borderRadius:6,padding:8}}><div style={{fontSize:10,fontWeight:600,color:C.success}}>Scanner</div><div style={{fontSize:10,color:C.muted,marginTop:2}}>sc.nextInt() → entier{"\n"}sc.next() → un mot{"\n"}sc.nextLine() → une ligne</div></div>
  </div>
</div>);}

// ═══ STEPS ═══
const STEPS = [
  // ── THÉORIE: Comprendre les conditions ──
  { section: "Théorie", title: "C'est quoi une condition ?", type: "theory",
    render: (onQ, done) => (<>
      <P>Une <Strong c={C.accent}>condition</Strong> est une expression qui vaut <Kw>true</Kw> ou <Kw>false</Kw>. C'est un <Strong>boolean</Strong>.</P>
      <Code hl={[1,2,4,5]} code={`int age = 20;
boolean estMajeur = (age >= 18);  // true
System.out.println(estMajeur);    // true
boolean estMineur = (age < 18);   // false
System.out.println(estMineur);    // false`} />
      <Tip title="Opérateurs de comparaison"><Ac>==</Ac> égal · <Ac>!=</Ac> différent · <Ac>{">"}</Ac> plus grand · <Ac>{"<"}</Ac> plus petit · <Ac>{">="}</Ac> supérieur ou égal · <Ac>{"<="}</Ac> inférieur ou égal</Tip>
      <Quiz q="Que vaut (10 > 5) ?" opts={["10","5","true","false"]} correct={2} onAns={onQ} done={done}/>
    </>),
  },
  { section: "Théorie", title: "if / else / else if", type: "theory",
    render: (onQ, done) => (<>
      <P><Kw>if</Kw> exécute un bloc <Strong>uniquement si</Strong> la condition est vraie. <Kw>else</Kw> s'exécute si elle est fausse.</P>
      <Code hl={[2,3,4,5,6,7,8,9]} code={`int note = 75;
if (note >= 90) {
    System.out.println("Excellent !");
} else if (note >= 70) {
    System.out.println("Bien !");       // ← celui-ci
} else if (note >= 50) {
    System.out.println("Passable.");
} else {
    System.out.println("Echec.");
}`} />
      <Task>1. Créez <Ac>TestConditions.java</Ac> avec un main<br/>2. Déclarez <Ac>int note = 85;</Ac><br/>3. Tapez le if/else ci-dessus<br/>4. <Strong>Changez la note</Strong> (40, 55, 72, 95) et observez</Task>
      <Quiz q='Si note = 50, quel message ?' opts={["Excellent !","Bien !","Passable.","Echec."]} correct={2} onAns={onQ} done={done}/>
    </>),
  },
  { section: "Théorie", title: "Opérateurs logiques && || !", type: "theory",
    render: (onQ, done) => (<>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,margin:"8px 0"}}>
        <div style={{background:C.card,borderRadius:7,padding:8,border:`1px solid ${C.border}`}}><div style={{fontWeight:700,color:C.accent,fontSize:13}}>{"&&"} (ET)</div><div style={{color:C.muted,fontSize:11,marginTop:3}}>Les DEUX vraies</div></div>
        <div style={{background:C.card,borderRadius:7,padding:8,border:`1px solid ${C.border}`}}><div style={{fontWeight:700,color:C.gold,fontSize:13}}>{"||"} (OU)</div><div style={{color:C.muted,fontSize:11,marginTop:3}}>Au moins UNE vraie</div></div>
        <div style={{background:C.card,borderRadius:7,padding:8,border:`1px solid ${C.border}`}}><div style={{fontWeight:700,color:C.danger,fontSize:13}}>! (NON)</div><div style={{color:C.muted,fontSize:11,marginTop:3}}>Inverse</div></div>
      </div>
      <Code hl={[3,7]} code={`int age = 20;
boolean aPermis = true;
// ET : les deux doivent être vrais
if (age >= 18 && aPermis) {
    System.out.println("Peut conduire !");
}
// OU : au moins un vrai
if (age < 12 || age > 65) {
    System.out.println("Tarif réduit");
}
// NON : inverse
if (!aPermis) {
    System.out.println("Pas de permis");
}`} />
      <Task>1. Déclarez <Ac>int age = 25;</Ac> et <Ac>boolean estEtudiant = true;</Ac><br/>2. Écrivez un if : "Réduction" si age {"<"} 26 ET estEtudiant<br/>3. Testez avec age=30, puis estEtudiant=false</Task>
      <Quiz q="Que vaut (true && false) ?" opts={["true","false","null","erreur"]} correct={1} onAns={onQ} done={done}/>
    </>),
  },
  { section: "Théorie", title: "switch / case", type: "theory",
    render: (onQ, done) => (<>
      <P><Kw>switch</Kw> compare une variable à plusieurs <Strong>valeurs fixes</Strong>. Plus propre que plein de else if.</P>
      <Code hl={[1,2,3,4,5,9,10]} code={`switch (jour) {
    case 1:
        System.out.println("Lundi");
        break;    // IMPORTANT !
    case 2:
        System.out.println("Mardi");
        break;
    // ...
    default:
        System.out.println("Invalide");
}`} />
      <Tip title="Piège : le break oublié !" color={C.danger}>Sans <Ac>break</Ac>, le programme continue dans le case suivant ! Essayez d'en enlever un pour voir.</Tip>
      <P>Switch marche aussi avec des <Kw>String</Kw> :</P>
      <Code code={`String cmd = "café";
switch (cmd) {
    case "café": System.out.println("2.50 CHF"); break;
    case "thé":  System.out.println("2.00 CHF"); break;
    default:     System.out.println("Inconnu");
}`} />
      <Task>1. Écrivez un switch avec les 12 mois de l'année<br/>2. Enlevez un break → observez le bug<br/>3. Remettez-le + ajoutez un default</Task>
      <Quiz q="Sans break, que se passe-t-il ?" opts={["Erreur","Le programme s'arrête","Il exécute aussi le case suivant","Rien"]} correct={2} onAns={onQ} done={done}/>
    </>),
  },

  // ── MINI-JEU INTÉGRÉ ──
  { section: "Défi", title: "Le Détecteur de Vérité", type: "game",
    render: (_, __, onGameComplete) => (<>
      <P>Testez vos connaissances ! 12 expressions Java — dites si c'est <Strong c={C.success}>true</Strong> ou <Strong c={C.danger}>false</Strong>. Timer + combos !</P>
      <TrueFalseGame onComplete={onGameComplete} />
    </>),
  },

  // ── CODE GUIDÉ ──
  { section: "Code guidé", title: "Construire un programme pas à pas", type: "guided",
    render: (onQ, done) => (<>
      <P>On va construire ensemble un programme qui analyse un âge. <Strong>Tapez chaque étape dans Eclipse.</Strong></P>
      <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:8,marginBottom:4}}>Étape 1 : Déclarer et lire</div>
      <Code hl={[0,4,5]} code={`import java.util.Scanner;
public class AnalyseAge {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Entrez votre âge : ");
        int age = sc.nextInt();`} />
      <P>Tapez ça. Exécutez. Entrez un nombre → rien ne se passe encore (normal).</P>
      <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:8,marginBottom:4}}>Étape 2 : Premier if/else</div>
      <Code hl={[0,1,2,3,4]} code={`        if (age >= 18) {
            System.out.println("Vous êtes majeur.");
        } else {
            System.out.println("Vous êtes mineur.");
        }`} />
      <P>Ajoutez ces lignes. Exécutez avec age=20 puis age=15.</P>
      <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:8,marginBottom:4}}>Étape 3 : Ajouter && et ||</div>
      <Code hl={[0,1,2,4,5,6]} code={`        // Réduction si jeune OU senior
        if (age < 12 || age >= 65) {
            System.out.println("Tarif réduit !");
        }
        // Peut voter ET conduire
        if (age >= 18 && age < 120) {
            System.out.println("Droits civiques complets.");
        }`} />
      <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:8,marginBottom:4}}>Étape 4 : Switch sur une catégorie</div>
      <Code hl={[0,1,2,3,4,5,6,7,8,9,10,11]} code={`        String categorie;
        if (age < 12) categorie = "enfant";
        else if (age < 18) categorie = "ado";
        else if (age < 65) categorie = "adulte";
        else categorie = "senior";
        
        switch (categorie) {
            case "enfant": System.out.println("Menu enfant"); break;
            case "ado":    System.out.println("Menu jeune"); break;
            case "adulte": System.out.println("Menu standard"); break;
            case "senior": System.out.println("Menu senior"); break;
        }
        sc.close();
    }
}`} />
      <Task>Tapez le programme complet. Testez avec les âges : 8, 15, 25, 70, 120.<br/><Strong>Question :</Strong> que se passe-t-il si on entre -5 ? Ajoutez une validation !</Task>
      <Quiz q="Pour valider que l'âge est entre 0 et 150, quelle condition ?" opts={["age > 0 || age < 150","age >= 0 && age <= 150","age == 0 && age == 150","age != 0"]} correct={1} onAns={onQ} done={done}/>
    </>),
  },

  // ── EXERCICE AUTONOME ──
  { section: "Exercice", title: "Le Distributeur de Boissons", type: "exercise",
    render: (onQ, done) => (<>
      <div style={{background:C.gold+"15",borderRadius:10,padding:14,border:`1px solid ${C.gold}40`}}>
        <div style={{fontSize:15,fontWeight:700,color:C.gold,marginBottom:4}}>Exercice autonome — 50 Crédits R&D</div>
        <div style={{color:C.text,fontSize:13}}>Créez un programme qui simule un distributeur. <Strong>Faites-le SEUL</Strong> avant de voir la correction !</div>
      </div>
      <div style={{color:C.text,fontSize:12,lineHeight:1.8,marginTop:10}}>
        <Strong>Cahier des charges :</Strong><br/>
        1. Menu : 1=Café 2.50, 2=Thé 2.00, 3=Chocolat 3.00, 4=Jus 3.50<br/>
        2. L'utilisateur entre son choix → <Strong c={C.accent}>switch</Strong><br/>
        3. L'utilisateur entre son âge<br/>
        4. Réduction -20% si âge {"<"} 18 <Strong c={C.gold}>||</Strong> âge {">="} 65<br/>
        5. Supplément +0.50 si chocolat <Strong c={C.gold}>&&</Strong> âge {">"} 12<br/>
        6. Afficher le ticket avec le prix final<br/>
        7. Choix invalide → "Boisson inconnue"
      </div>
      <Tip title="Cas de test à vérifier">
        Choix 1, âge 25 → 2.50 CHF (pas de réduction)<br/>
        Choix 1, âge 15 → 2.00 CHF (réduction 0.50)<br/>
        Choix 3, âge 25 → 3.50 CHF (supplément chantilly)<br/>
        Choix 3, âge 10 → 2.40 CHF (réduction, pas de chantilly)
      </Tip>
      <Quiz q="Quel opérateur pour 'si âge < 18 OU âge >= 65' ?" opts={["&&","||","==","!="]} correct={1} onAns={onQ} done={done}/>
    </>),
  },

  // ── CORRECTION ──
  { section: "Correction", title: "Correction du Distributeur", type: "correction",
    render: (onQ, done) => (<>
      <div style={{background:C.success+"12",borderRadius:8,padding:10,border:`1px solid ${C.success}40`,marginBottom:10}}>
        <div style={{fontSize:13,fontWeight:700,color:C.success}}>Correction complète</div>
      </div>
      <Code hl={[13,14,15,16,17,18,19,20,21,22,23,24,28,29,30,33,34,35]} code={`import java.util.Scanner;
public class Distributeur {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("1.Café(2.50) 2.Thé(2.00) 3.Choco(3.00) 4.Jus(3.50)");
        System.out.print("Choix : ");
        int choix = sc.nextInt();
        String nom = ""; double prix = 0;
        double reduction = 0, supplement = 0;
        
        switch (choix) {
            case 1: nom="Café"; prix=2.50; break;
            case 2: nom="Thé"; prix=2.00; break;
            case 3: nom="Chocolat"; prix=3.00; break;
            case 4: nom="Jus"; prix=3.50; break;
            default:
                System.out.println("Boisson inconnue !");
                sc.close(); return;
        }
        
        System.out.print("Âge : ");
        int age = sc.nextInt();
        
        // || : réduction si jeune OU senior
        if (age < 18 || age >= 65) {
            reduction = prix * 0.20;
        }
        // && : supplément si chocolat ET pas enfant
        if (choix == 3 && age > 12) {
            supplement = 0.50;
        }
        
        double total = prix - reduction + supplement;
        System.out.println(nom + " : " + total + " CHF");
        if (reduction > 0) System.out.println("(réduction: -" + reduction + ")");
        if (supplement > 0) System.out.println("(supplément: +" + supplement + ")");
        sc.close();
    }
}`} />
      <Tip title="Points clés"><Strong>switch</Strong> avec break pour chaque boisson<br/><Strong>||</Strong> pour la réduction (jeune OU senior)<br/><Strong>&&</Strong> pour le supplément (chocolat ET pas enfant)<br/><Strong>return</Strong> dans default pour quitter si invalide</Tip>
      <Quiz q="Pourquoi 'return;' dans le default ?" opts={["C'est obligatoire","Pour quitter si le choix est invalide","Pour retourner une valeur","Ça ne sert à rien"]} correct={1} onAns={onQ} done={done}/>
    </>),
  },
];

// ═══ MAIN APP ═══
export default function M01Unified() {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [score, setScore] = useState(0);
  const [totalQ, setTotalQ] = useState(0);
  const [credits, setCredits] = useState(0);
  const [gameScore, setGameScore] = useState(null);
  const [ready, setReady] = useState(false);
  const [showMemo, setShowMemo] = useState(false);

  const allDone = Object.keys(completed).length >= STEPS.length;

  useEffect(()=>{ld().then(d=>{if(d){setCompleted(d.c||{});setScore(d.s||0);setTotalQ(d.t||0);setCredits(d.cr||0);setGameScore(d.gs);if(d.st!==undefined)setStep(d.st);}setReady(true);});},[]);
  const persist=useCallback((c,s,t,cr,gs,st)=>{sv({c,s,t,cr,gs,st});},[]);

  const handleQuiz=(ok)=>{const nT=totalQ+1,nS=score+(ok?1:0),nCr=credits+(ok?5:0),nC={...completed,[step]:true};setTotalQ(nT);setScore(nS);setCredits(nCr);setCompleted(nC);persist(nC,nS,nT,nCr,gameScore,step);};
  const handleGameComplete=(gs)=>{setGameScore(gs);const nCr=credits+Math.floor(gs/2);setCredits(nCr);const nC={...completed,[step]:true};setCompleted(nC);persist(nC,score,totalQ,nCr,gs,step);};
  const go=(dir)=>{const ns=step+dir;if(ns>=0&&ns<STEPS.length){setStep(ns);persist(completed,score,totalQ,credits,gameScore,ns);}};

  if(!ready)return<div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",color:C.muted}}>Chargement...</div>;

  const cur=STEPS[step];
  const isDone=!!completed[step];
  const sections=[...new Set(STEPS.map(s=>s.section))];

  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
      
      {/* HEADER */}
      <div style={{padding:"8px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:C.card,flexWrap:"wrap",gap:4}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:10,letterSpacing:2,color:C.dimmed}}>CODEQUEST</span>
          <span style={{color:C.border}}>|</span>
          <span style={{fontSize:12,fontWeight:600,color:C.accent}}>M01 · Conditions</span>
        </div>
        <div style={{display:"flex",gap:10,fontSize:11}}>
          <span style={{color:C.muted}}>Quiz <strong style={{color:C.success}}>{score}/{totalQ}</strong></span>
          {gameScore!==null&&<span style={{color:C.muted}}>Jeu <strong style={{color:C.accent}}>{gameScore}</strong></span>}
          <span style={{color:C.muted}}>CR <strong style={{color:C.gold}}>{credits}</strong></span>
        </div>
      </div>

      <div style={{display:"flex",maxWidth:1100,margin:"0 auto",minHeight:"calc(100vh - 42px)"}}>
        {/* SIDEBAR */}
        <div style={{width:200,borderRight:`1px solid ${C.border}`,padding:"10px 0",flexShrink:0,overflowY:"auto",display:"flex",flexDirection:"column"}}>
          {sections.map(sec=>{
            const stepsInSec=STEPS.map((s,i)=>({...s,idx:i})).filter(s=>s.section===sec);
            const secColors={Théorie:C.secondary,Défi:C.gold,"Code guidé":C.primary,Exercice:C.accent,Correction:C.success};
            return(<div key={sec}>
              <div style={{padding:"5px 12px",fontSize:9,letterSpacing:1,color:secColors[sec]||C.dimmed,fontWeight:700,textTransform:"uppercase"}}>{sec}</div>
              {stepsInSec.map(s=>{const cur2=s.idx===step,dn=!!completed[s.idx];return(<button key={s.idx} onClick={()=>{setStep(s.idx);persist(completed,score,totalQ,credits,gameScore,s.idx);}} style={{display:"flex",alignItems:"center",gap:5,width:"100%",padding:"4px 12px 4px 20px",border:"none",background:cur2?C.accent+"12":"transparent",borderLeft:cur2?`2px solid ${C.accent}`:"2px solid transparent",cursor:"pointer",fontFamily:"inherit",fontSize:11,color:cur2?C.accent:dn?C.success:C.muted,textAlign:"left"}}><span style={{fontSize:8}}>{dn?"✓":"○"}</span>{s.title}</button>);})}
            </div>);
          })}
          
          {/* MEMO BUTTON */}
          <div style={{padding:10,marginTop:"auto"}}>
            <div style={{height:3,background:C.border,borderRadius:2,overflow:"hidden",marginBottom:6}}>
              <div style={{width:`${(Object.keys(completed).length/STEPS.length)*100}%`,height:"100%",background:`linear-gradient(90deg,${C.primary},${C.accent})`,borderRadius:2,transition:"width .5s"}}/>
            </div>
            <button onClick={()=>allDone&&setShowMemo(!showMemo)} style={{width:"100%",padding:"8px",borderRadius:8,border:`1px solid ${allDone?C.gold:C.border}`,background:allDone?C.gold+"15":"transparent",color:allDone?C.gold:C.dimmed,cursor:allDone?"pointer":"default",fontFamily:"inherit",fontSize:11,fontWeight:600,opacity:allDone?1:0.5}}>
              {allDone?"📋 Voir le Mémo":"🔒 Mémo (terminez tout)"}
            </button>
          </div>
        </div>

        {/* MAIN */}
        <div style={{flex:1,padding:"16px 24px",overflowY:"auto",maxHeight:"calc(100vh - 42px)"}}>
          {showMemo && allDone ? <Memo/> : (
            <div key={step} style={{animation:"fadeIn .25s ease-out"}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                <span style={{fontSize:9,padding:"2px 8px",borderRadius:10,background:{Théorie:C.secondary,Défi:C.gold,"Code guidé":C.primary,Exercice:C.accent,Correction:C.success}[cur.section]+"20",color:{Théorie:C.secondary,Défi:C.gold,"Code guidé":C.primary,Exercice:C.accent,Correction:C.success}[cur.section],fontWeight:600,letterSpacing:1}}>{cur.section.toUpperCase()}</span>
              </div>
              <h2 style={{fontSize:18,fontWeight:700,marginBottom:12}}>{cur.title}</h2>
              {cur.type==="game" ? cur.render(handleQuiz,isDone,handleGameComplete) : cur.render(handleQuiz,isDone)}
              <div style={{display:"flex",justifyContent:"space-between",marginTop:24,paddingTop:10,borderTop:`1px solid ${C.border}`}}>
                <button onClick={()=>go(-1)} disabled={step===0} style={{padding:"7px 16px",borderRadius:7,border:`1px solid ${C.border}`,background:"transparent",color:step===0?C.border:C.muted,cursor:step===0?"default":"pointer",fontFamily:"inherit",fontSize:12}}>← Précédent</button>
                <button onClick={()=>go(1)} disabled={step===STEPS.length-1} style={{padding:"7px 16px",borderRadius:7,border:"none",background:step===STEPS.length-1?C.border:C.accent,color:step===STEPS.length-1?C.muted:C.bg,cursor:step===STEPS.length-1?"default":"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600}}>{step===STEPS.length-1?"Fin":"Suivant →"}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
