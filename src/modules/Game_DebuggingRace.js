import { useState, useEffect, useRef } from "react";
import { Bug, Clock, Trophy, ChevronLeft, CheckCircle, XCircle } from "lucide-react";
const C={bg:"#0a0f1a",card:"#111827",accent:"#32E0C4",gold:"#F59E0B",text:"#e2e8f0",muted:"#94a3b8",border:"#1e293b",success:"#10B981",danger:"#EF4444",primary:"#0D7377",dimmed:"#64748b",code:"#1E293B"};
const CHALLENGES=[
{title:"NullPointerException",d:1,code:["public class Main {","    public static void main(String[] args) {","        String nom = null;","        System.out.println(nom.length());","    }","}"],bugs:[{line:3,hint:"nom est null, on ne peut pas appeler .length()",fix:"if (nom != null) System.out.println(nom.length());"}]},
{title:"Boucle infinie",d:1,code:["int i = 0;","while (i < 10) {","    System.out.println(i);","    // oubli de i++","}"],bugs:[{line:3,hint:"i n'est jamais incremente",fix:"i++;"}]},
{title:"Off-by-one",d:2,code:["int[] tab = {1, 2, 3, 4, 5};","for (int i = 0; i <= tab.length; i++) {","    System.out.println(tab[i]);","}"],bugs:[{line:1,hint:"<= devrait etre < (ArrayIndexOutOfBounds)",fix:"i < tab.length"}]},
{title:"== vs .equals()",d:2,code:['String a = "test";','String b = new String("test");',"if (a == b) {",'    System.out.println("Egaux");',"} else {",'    System.out.println("Differents");',"}"],bugs:[{line:2,hint:"== compare les references, pas le contenu",fix:"if (a.equals(b))"}]},
{title:"Division entiere",d:2,code:["int a = 10;","int b = 3;","double resultat = a / b;",'System.out.println("Resultat: " + resultat);'],bugs:[{line:2,hint:"int/int = int, pas de decimales",fix:"double resultat = (double) a / b;"}]},
{title:"Scanner piege",d:3,code:["Scanner sc = new Scanner(System.in);",'System.out.print("Age: ");',"int age = sc.nextInt();",'System.out.print("Nom: ");',"String nom = sc.nextLine();","// nom est vide !"],bugs:[{line:4,hint:"nextInt() laisse \\n dans le buffer",fix:"sc.nextLine(); // vider le buffer\nString nom = sc.nextLine();"}]},
{title:"Constructeur sans super()",d:3,code:["class Animal {","    String nom;","    Animal(String nom) { this.nom = nom; }","}","class Chien extends Animal {","    String race;","    Chien(String nom, String race) {","        this.race = race;","    }","}"],bugs:[{line:7,hint:"super(nom) manque en premiere ligne",fix:"super(nom);"}]},
{title:"Variable locale cache attribut",d:2,code:["class Compteur {","    int valeur = 0;","    void incrementer() {","        int valeur = this.valeur + 1;","    }","}"],bugs:[{line:3,hint:"int valeur cree une locale au lieu de modifier l'attribut",fix:"this.valeur = this.valeur + 1;"}]},
{title:"catch trop large",d:3,code:["try {","    int n = Integer.parseInt(input);","    int r = 100 / n;","    System.out.println(r);","} catch (Exception e) {",'    System.out.println("Erreur");',"}"],bugs:[{line:4,hint:"catch(Exception) attrape tout. Soyez specifique",fix:"catch (NumberFormatException | ArithmeticException e)"}]},
{title:"ArrayList remove dans boucle",d:3,code:['ArrayList<String> l = new ArrayList<>();','l.add("A"); l.add("B"); l.add("C");',"for (int i = 0; i < l.size(); i++) {",'    if (l.get(i).equals("B")) {',"        l.remove(i);","    }","}"],bugs:[{line:4,hint:"Apres remove les index changent",fix:"l.remove(i); i--;"}]},
];
export default function GameDebuggingRace(){
const[screen,setScreen]=useState("menu");
const[challenges,setChallenges]=useState([]);
const[idx,setIdx]=useState(0);
const[sel,setSel]=useState(null);
const[found,setFound]=useState([]);
const[timer,setTimer]=useState(0);
const[score,setScore]=useState(0);
const[results,setResults]=useState([]);
const[diff,setDiff]=useState(1);
const[wrongFeedback,setWrongFeedback]=useState(false);
const tRef=useRef(null);
function start(d){setDiff(d);const f=CHALLENGES.filter(c=>c.d<=d).sort(()=>Math.random()-.5).slice(0,5);setChallenges(f);setIdx(0);setScore(0);setResults([]);setSel(null);setFound([]);setTimer(0);setWrongFeedback(false);setScreen("play");if(tRef.current)clearInterval(tRef.current);tRef.current=setInterval(()=>setTimer(t=>t+1),1000);}
function clickLine(li){if(!challenges[idx]||found.includes(li))return;setSel(li);const bug=challenges[idx].bugs.find(b=>b.line===li);if(bug){setFound(f=>[...f,li]);setWrongFeedback(false);if(found.length+1>=challenges[idx].bugs.length){clearInterval(tRef.current);const pts=100+Math.max(0,30-timer)*3;setScore(s=>s+pts);setResults(r=>[...r,{t:challenges[idx].title,time:timer,pts,ok:true}]);setTimeout(()=>goNext(),2500);}}else{setWrongFeedback(true);setTimeout(()=>setWrongFeedback(false),1500);}}
function skip(){clearInterval(tRef.current);setResults(r=>[...r,{t:challenges[idx].title,time:timer,pts:0,ok:false}]);goNext();}
function goNext(){const ni=idx+1;if(ni>=challenges.length){setScreen("result");return;}setIdx(ni);setSel(null);setFound([]);setTimer(0);setWrongFeedback(false);if(tRef.current)clearInterval(tRef.current);tRef.current=setInterval(()=>setTimer(t=>t+1),1000);}
useEffect(()=>()=>{if(tRef.current)clearInterval(tRef.current);},[]);
const ch=challenges[idx];
if(screen==="menu")return(<div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
<div style={{padding:"6px 16px",background:C.card,borderBottom:"1px solid "+C.border,display:"flex",alignItems:"center",justifyContent:"space-between",position:"fixed",top:0,left:0,right:0,zIndex:10}}><button onClick={()=>window.history.back()} style={{display:"flex",alignItems:"center",gap:4,padding:"5px 12px",borderRadius:7,border:"1px solid "+C.border,background:"transparent",color:C.muted,cursor:"pointer",fontFamily:"inherit",fontSize:11}}><ChevronLeft size={14}/>Retour</button><span style={{fontSize:13,fontWeight:700,color:C.danger}}>Debugging Race</span><div/></div>
<Bug size={48} color={C.danger} style={{marginBottom:16}}/>
<div style={{fontSize:28,fontWeight:800,color:C.danger,marginBottom:8}}>Debugging Race</div>
<div style={{fontSize:13,color:C.muted,maxWidth:400,textAlign:"center",marginBottom:24}}>Trouvez les bugs dans le code Java ! Cliquez sur la ligne bugguee. Plus vite = plus de points.</div>
<div style={{display:"flex",gap:12}}>{[{d:1,l:"Facile"},{d:2,l:"Normal"},{d:3,l:"Expert"}].map(o=><button key={o.d} onClick={()=>start(o.d)} style={{padding:"16px 28px",borderRadius:12,border:"1px solid "+C.danger+"40",background:C.card,color:C.danger,cursor:"pointer",fontFamily:"inherit",fontSize:14,fontWeight:700}}>{o.l}</button>)}</div></div>);
if(screen==="result"){const bugsOk=results.filter(r=>r.ok).length;return(<div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
<Trophy size={48} color={C.gold} style={{marginBottom:12}}/>
<div style={{fontSize:24,fontWeight:700,color:C.gold}}>Termine !</div>
<div style={{fontSize:36,fontWeight:800,color:C.accent,margin:"8px 0"}}>{score+" pts"}</div>
<div style={{fontSize:12,color:C.muted}}>{bugsOk+"/5 bugs trouves"}</div>
<div style={{marginTop:16,width:"100%",maxWidth:400}}>{results.map((r,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",marginBottom:4,borderRadius:6,background:C.card,border:"1px solid "+C.border}}>{r.ok?<CheckCircle size={14} color={C.success}/>:<XCircle size={14} color={C.danger}/>}<span style={{flex:1,fontSize:12,color:C.text}}>{r.t}</span><span style={{fontSize:11,color:r.ok?C.gold:C.dimmed}}>{r.pts+" pts"}</span><span style={{fontSize:10,color:C.dimmed}}>{r.time+"s"}</span></div>)}</div>
<button onClick={()=>setScreen("menu")} style={{marginTop:16,padding:"10px 30px",borderRadius:8,border:"none",background:C.accent,color:C.bg,cursor:"pointer",fontFamily:"inherit",fontSize:14,fontWeight:700}}>Rejouer</button></div>);}
// PLAYING
return(<div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',sans-serif"}}>
<div style={{padding:"6px 16px",background:C.card,borderBottom:"1px solid "+C.border,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
<button onClick={()=>setScreen("menu")} style={{display:"flex",alignItems:"center",gap:4,padding:"5px 12px",borderRadius:7,border:"1px solid "+C.border,background:"transparent",color:C.muted,cursor:"pointer",fontFamily:"inherit",fontSize:11}}><ChevronLeft size={14}/>Menu</button>
<span style={{fontSize:13,fontWeight:700,color:C.danger}}>{"Bug "+(idx+1)+"/"+challenges.length}</span>
<div style={{display:"flex",alignItems:"center",gap:10}}><span style={{display:"flex",alignItems:"center",gap:3,fontSize:12,color:timer>20?C.danger:C.gold}}><Clock size={14}/>{timer+"s"}</span><span style={{fontSize:12,color:C.accent,fontWeight:700}}>{score+" pts"}</span></div>
</div>
<div style={{maxWidth:700,margin:"16px auto",padding:"0 16px"}}>
<div style={{fontSize:16,fontWeight:700,color:C.danger,marginBottom:4,display:"flex",alignItems:"center",gap:6}}><Bug size={16}/>{ch?.title}</div>
<div style={{fontSize:11,color:C.muted,marginBottom:12}}>Cliquez sur la ligne qui contient le bug</div>
<div style={{background:C.code,borderRadius:10,overflow:"hidden",border:"1px solid "+C.border}}>
{ch?.code.map((line,i)=>{const isBug=ch.bugs.some(b=>b.line===i);const isFound=found.includes(i);return(<div key={i} onClick={()=>clickLine(i)} style={{display:"flex",padding:"6px 0",cursor:"pointer",background:isFound?C.success+"15":sel===i&&!isBug?C.danger+"08":"transparent",borderLeft:isFound?"3px solid "+C.success:"3px solid transparent",transition:"all .15s"}}>
<span style={{width:32,textAlign:"right",paddingRight:8,color:C.dimmed,fontSize:11,userSelect:"none"}}>{i+1}</span>
<span style={{fontFamily:"Consolas,monospace",fontSize:13,color:isFound?C.success:C.accent,whiteSpace:"pre"}}>{line}</span>
{isFound&&<CheckCircle size={14} color={C.success} style={{marginLeft:8,flexShrink:0}}/>}
</div>);})}
</div>
{wrongFeedback&&<div style={{marginTop:8,padding:"8px 12px",borderRadius:6,background:C.danger+"15",border:"1px solid "+C.danger+"30",fontSize:11,color:C.danger}}>Pas cette ligne ! Cherchez encore...</div>}
{found.length>0&&ch?.bugs.filter(b=>found.includes(b.line)).map((bug,i)=><div key={i} style={{marginTop:8,padding:"10px 14px",borderRadius:8,background:C.success+"10",border:"1px solid "+C.success+"30"}}><div style={{fontSize:12,fontWeight:700,color:C.success,marginBottom:4}}>Bug trouve !</div><div style={{fontSize:11,color:C.text,marginBottom:4}}>{bug.hint}</div><div style={{fontSize:11,color:C.accent,fontFamily:"Consolas,monospace",padding:"4px 8px",background:C.code,borderRadius:4}}>{"Fix : "+bug.fix}</div></div>)}
<div style={{display:"flex",justifyContent:"flex-end",marginTop:12}}><button onClick={skip} style={{padding:"6px 16px",borderRadius:6,border:"1px solid "+C.border,background:"transparent",color:C.muted,cursor:"pointer",fontFamily:"inherit",fontSize:11}}>Passer (0 pts)</button></div>
</div></div>);}
