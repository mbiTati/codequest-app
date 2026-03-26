import { useState } from "react";
import { BookOpen, ChevronLeft, CheckCircle, XCircle, Trophy, ChevronRight } from "lucide-react";
const C={bg:"#0a0f1a",card:"#111827",accent:"#32E0C4",gold:"#F59E0B",text:"#e2e8f0",muted:"#94a3b8",border:"#1e293b",success:"#10B981",danger:"#EF4444",primary:"#0D7377",dimmed:"#64748b",code:"#1E293B"};

const QUESTIONS=[
{code:"int x = 5;\nint y = 3;\nSystem.out.println(x + y);",q:"Que s'affiche ?",opts:["53","8","xy","Erreur"],correct:1,explain:"5 + 3 = 8 (addition d'entiers)"},
{code:"String s = \"Hello\";\nSystem.out.println(s.length());",q:"Que s'affiche ?",opts:["4","5","6","Hello"],correct:1,explain:"\"Hello\" a 5 caracteres"},
{code:"int[] tab = {10, 20, 30};\nSystem.out.println(tab[1]);",q:"Que s'affiche ?",opts:["10","20","30","Erreur"],correct:1,explain:"Les index commencent a 0. tab[1] = 20"},
{code:"for (int i = 0; i < 3; i++) {\n    System.out.print(i + \" \");\n}",q:"Que s'affiche ?",opts:["1 2 3","0 1 2","0 1 2 3","Rien"],correct:1,explain:"i va de 0 a 2 (< 3, pas <=)"},
{code:"int x = 10;\nif (x > 5) {\n    x = x * 2;\n}\nSystem.out.println(x);",q:"Que s'affiche ?",opts:["10","15","20","5"],correct:2,explain:"10 > 5 est true, donc x = 10 * 2 = 20"},
{code:"String a = \"Java\";\nString b = \"Java\";\nSystem.out.println(a == b);",q:"Que s'affiche ?",opts:["true","false","Java","Erreur"],correct:0,explain:"Ici == retourne true car Java reutilise les litteraux String (String pool)"},
{code:"int sum = 0;\nfor (int i = 1; i <= 5; i++) {\n    sum += i;\n}\nSystem.out.println(sum);",q:"Que s'affiche ?",opts:["5","10","15","20"],correct:2,explain:"1+2+3+4+5 = 15"},
{code:"boolean a = true;\nboolean b = false;\nSystem.out.println(a && b);\nSystem.out.println(a || b);",q:"Que s'affiche (2 lignes) ?",opts:["true\\ntrue","false\\nfalse","false\\ntrue","true\\nfalse"],correct:2,explain:"true AND false = false. true OR false = true"},
{code:"int x = 7;\nswitch (x % 3) {\n    case 0: System.out.println(\"A\"); break;\n    case 1: System.out.println(\"B\"); break;\n    default: System.out.println(\"C\");\n}",q:"Que s'affiche ?",opts:["A","B","C","Erreur"],correct:1,explain:"7 % 3 = 1, donc case 1 → B"},
{code:"String s = \"ABCDE\";\nSystem.out.println(s.substring(1, 3));",q:"Que s'affiche ?",opts:["AB","BC","BCD","ABC"],correct:1,explain:"substring(1,3) = index 1 a 2 (exclu 3) = BC"},
{code:"int[] t = {5, 3, 8, 1};\nint max = t[0];\nfor (int i = 1; i < t.length; i++) {\n    if (t[i] > max) max = t[i];\n}\nSystem.out.println(max);",q:"Que s'affiche ?",opts:["5","3","8","1"],correct:2,explain:"Parcourt le tableau, garde le plus grand = 8"},
{code:"int n = 4;\nint f = 1;\nfor (int i = 1; i <= n; i++) {\n    f = f * i;\n}\nSystem.out.println(f);",q:"Que s'affiche ?",opts:["4","10","24","16"],correct:2,explain:"Factorielle: 1*1*2*3*4 = 24"},
{code:"String s = \"\";\nfor (int i = 3; i >= 1; i--) {\n    s += i;\n}\nSystem.out.println(s);",q:"Que s'affiche ?",opts:["123","321","3","6"],correct:1,explain:"Boucle decroissante: 3, 2, 1 → concatene → \"321\""},
{code:"int a = 10, b = 20;\nint temp = a;\na = b;\nb = temp;\nSystem.out.println(a + \" \" + b);",q:"Que s'affiche ?",opts:["10 20","20 10","20 20","10 10"],correct:1,explain:"Echange classique: temp=10, a=20, b=10 → 20 10"},
{code:"ArrayList<String> l = new ArrayList<>();\nl.add(\"X\");\nl.add(\"Y\");\nl.add(\"Z\");\nl.remove(1);\nSystem.out.println(l.size() + \" \" + l.get(1));",q:"Que s'affiche ?",opts:["2 Y","2 Z","3 Y","Erreur"],correct:1,explain:"remove(1) enleve Y. Reste [X,Z]. size=2, get(1)=Z"},
];

export default function GameCodeReading(){
const[screen,setScreen]=useState("menu");
const[qList,setQList]=useState([]);
const[idx,setIdx]=useState(0);
const[sel,setSel]=useState(null);
const[answered,setAnswered]=useState(false);
const[score,setScore]=useState(0);
const[total,setTotal]=useState(0);
const[diff,setDiff]=useState(5);

function start(n){const shuffled=[...QUESTIONS].sort(()=>Math.random()-.5).slice(0,n);setQList(shuffled);setIdx(0);setSel(null);setAnswered(false);setScore(0);setTotal(n);setDiff(n);setScreen("play");}
function answer(i){if(answered)return;setSel(i);setAnswered(true);if(i===qList[idx].correct)setScore(s=>s+1);}
function next(){if(idx+1>=qList.length){setScreen("result");return;}setIdx(i=>i+1);setSel(null);setAnswered(false);}
const q=qList[idx];

if(screen==="menu")return(<div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
<div style={{padding:"6px 16px",background:C.card,borderBottom:"1px solid "+C.border,display:"flex",alignItems:"center",justifyContent:"space-between",position:"fixed",top:0,left:0,right:0,zIndex:10}}><button onClick={()=>window.history.back()} style={{display:"flex",alignItems:"center",gap:4,padding:"5px 12px",borderRadius:7,border:"1px solid "+C.border,background:"transparent",color:C.muted,cursor:"pointer",fontFamily:"inherit",fontSize:11}}><ChevronLeft size={14}/>Retour</button><span style={{fontSize:13,fontWeight:700,color:C.primary}}>Code Reading</span><div/></div>
<BookOpen size={48} color={C.primary} style={{marginBottom:16}}/>
<div style={{fontSize:28,fontWeight:800,color:C.primary,marginBottom:8}}>Code Reading</div>
<div style={{fontSize:13,color:C.muted,maxWidth:400,textAlign:"center",marginBottom:24}}>Lisez le code Java et predisez ce qui s'affiche. Testez votre comprehension du LO1 !</div>
<div style={{display:"flex",gap:12}}>{[{n:5,l:"Court (5)"},{n:10,l:"Normal (10)"},{n:15,l:"Marathon (15)"}].map(o=><button key={o.n} onClick={()=>start(o.n)} style={{padding:"16px 28px",borderRadius:12,border:"1px solid "+C.primary+"40",background:C.card,color:C.primary,cursor:"pointer",fontFamily:"inherit",fontSize:14,fontWeight:700}}>{o.l}</button>)}</div></div>);

if(screen==="result"){const pct=Math.round((score/total)*100);return(<div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
<Trophy size={48} color={pct>=80?C.gold:pct>=50?C.accent:C.danger} style={{marginBottom:12}}/>
<div style={{fontSize:24,fontWeight:700,color:C.gold}}>Resultat</div>
<div style={{fontSize:42,fontWeight:800,color:pct>=80?C.success:pct>=50?C.gold:C.danger,margin:"8px 0"}}>{score+"/"+total}</div>
<div style={{fontSize:14,color:C.muted}}>{pct+"%"+(pct>=80?" — Excellent !":pct>=50?" — Pas mal !":"  — Continuez a pratiquer !")}</div>
<button onClick={()=>setScreen("menu")} style={{marginTop:20,padding:"10px 30px",borderRadius:8,border:"none",background:C.accent,color:C.bg,cursor:"pointer",fontFamily:"inherit",fontSize:14,fontWeight:700}}>Rejouer</button></div>);}

return(<div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',sans-serif"}}>
<div style={{padding:"6px 16px",background:C.card,borderBottom:"1px solid "+C.border,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
<button onClick={()=>setScreen("menu")} style={{display:"flex",alignItems:"center",gap:4,padding:"5px 12px",borderRadius:7,border:"1px solid "+C.border,background:"transparent",color:C.muted,cursor:"pointer",fontFamily:"inherit",fontSize:11}}><ChevronLeft size={14}/>Menu</button>
<span style={{fontSize:13,fontWeight:700,color:C.primary}}>{"Q "+(idx+1)+"/"+qList.length}</span>
<span style={{fontSize:12,color:C.accent,fontWeight:700}}>{score+" / "+(idx+(answered?1:0))}</span>
</div>
<div style={{maxWidth:600,margin:"20px auto",padding:"0 16px"}}>
<div style={{background:C.code,borderRadius:10,padding:14,border:"1px solid "+C.border,marginBottom:16}}>
{q?.code.split("\n").map((line,i)=><div key={i} style={{display:"flex",padding:"2px 0"}}><span style={{width:28,textAlign:"right",paddingRight:8,color:C.dimmed,fontSize:11,userSelect:"none"}}>{i+1}</span><span style={{fontFamily:"Consolas,monospace",fontSize:13,color:C.accent,whiteSpace:"pre"}}>{line}</span></div>)}
</div>
<div style={{fontSize:14,fontWeight:600,color:C.text,marginBottom:10}}>{q?.q}</div>
{q?.opts.map((o,i)=>{let bg=C.card,bc=C.border;if(answered&&i===q.correct){bg=C.success+"20";bc=C.success;}else if(answered&&sel===i&&i!==q.correct){bg=C.danger+"20";bc=C.danger;}
return(<button key={i} onClick={()=>answer(i)} style={{display:"block",width:"100%",textAlign:"left",padding:"10px 14px",marginBottom:4,borderRadius:8,border:"1px solid "+bc,background:bg,color:C.text,cursor:answered?"default":"pointer",fontFamily:"inherit",fontSize:13}}>{String.fromCharCode(65+i)+". "+o.replace("\\n"," | ")}</button>);})}
{answered&&<div style={{marginTop:10,padding:"10px 14px",borderRadius:8,background:sel===q?.correct?C.success+"10":C.danger+"10",border:"1px solid "+(sel===q?.correct?C.success:C.danger)+"30"}}>
<div style={{fontSize:12,fontWeight:700,color:sel===q?.correct?C.success:C.danger,marginBottom:4}}>{sel===q?.correct?"Correct !":"Incorrect"}</div>
<div style={{fontSize:11,color:C.text}}>{q?.explain}</div>
</div>}
{answered&&<div style={{display:"flex",justifyContent:"flex-end",marginTop:12}}><button onClick={next} style={{display:"flex",alignItems:"center",gap:4,padding:"8px 20px",borderRadius:7,border:"none",background:C.accent,color:C.bg,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600}}>{idx+1>=qList.length?"Voir le resultat":"Suivant"} <ChevronRight size={14}/></button></div>}
</div></div>);}
