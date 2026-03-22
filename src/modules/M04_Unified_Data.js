import { useState, useEffect, useCallback } from "react";

const C={bg:"#0a0f1a",card:"#111827",primary:"#0D7377",secondary:"#14A3C7",accent:"#32E0C4",gold:"#F59E0B",text:"#e2e8f0",muted:"#94a3b8",dimmed:"#64748b",border:"#1e293b",success:"#10B981",danger:"#EF4444",code:"#1E293B",codeBorder:"#2d3a4f",codeText:"#32E0C4",comment:"#6b7f99",keyword:"#c792ea",string:"#c3e88d",number:"#f78c6c",type:"#ffcb6b"};
const KEY="cq-m04-unified";
async function ld(){try{const r=await window.storage.get(KEY);return r?JSON.parse(r.value):null;}catch{return null;}}
async function sv(d){try{await window.storage.set(KEY,JSON.stringify(d));}catch{}}
function Code({code,hl=[]}){const lines=code.split("\n");return(<div style={{background:C.code,border:`1px solid ${C.codeBorder}`,borderRadius:10,overflow:"hidden",fontSize:12,fontFamily:"'JetBrains Mono',monospace",margin:"8px 0"}}><div style={{display:"flex",gap:5,padding:"5px 10px",background:"#0d1117",borderBottom:`1px solid ${C.codeBorder}`}}><span style={{width:7,height:7,borderRadius:"50%",background:"#ff5f57"}}/><span style={{width:7,height:7,borderRadius:"50%",background:"#febc2e"}}/><span style={{width:7,height:7,borderRadius:"50%",background:"#28c840"}}/></div><div style={{padding:"8px 0",overflowX:"auto"}}>{lines.map((l,i)=>(<div key={i} style={{display:"flex",padding:"1px 0",background:hl.includes(i)?C.accent+"12":"transparent",borderLeft:hl.includes(i)?`3px solid ${C.accent}`:"3px solid transparent"}}><span style={{width:32,textAlign:"right",paddingRight:8,color:C.dimmed,userSelect:"none",flexShrink:0,fontSize:10}}>{i+1}</span><span style={{color:C.codeText,whiteSpace:"pre"}}>{col(l)}</span></div>))}</div></div>);}
function col(l){return l.replace(/(\/\/.*)/, `\x01C$1\x02`).replace(/\b(public|static|void|class|int|String|double|boolean|if|else|return|new|final|for|while|do|break|continue|true|false|private|import|switch|case|default)\b/g,`\x01K$&\x02`).replace(/("(?:[^"\\]|\\.)*")/g,`\x01S$1\x02`).replace(/\b(\d+\.?\d*)\b/g,`\x01N$1\x02`).replace(/\b(System|Scanner|ArrayList|Collections)\b/g,`\x01T$1\x02`).split(/(\x01\w.*?\x02)/).map((p,i)=>{if(p.startsWith("\x01C"))return <span key={i} style={{color:C.comment,fontStyle:"italic"}}>{p.slice(2,-1)}</span>;if(p.startsWith("\x01K"))return <span key={i} style={{color:C.keyword}}>{p.slice(2,-1)}</span>;if(p.startsWith("\x01S"))return <span key={i} style={{color:C.string}}>{p.slice(2,-1)}</span>;if(p.startsWith("\x01N"))return <span key={i} style={{color:C.number}}>{p.slice(2,-1)}</span>;if(p.startsWith("\x01T"))return <span key={i} style={{color:C.type}}>{p.slice(2,-1)}</span>;return <span key={i}>{p}</span>;});}
function Quiz({q,opts,correct,onAns,done}){const[sel,setSel]=useState(null);return(<div style={{margin:"12px 0"}}><div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:6}}>{q}</div>{opts.map((o,i)=>{let bg=C.card,bc=C.border;if(done&&i===correct){bg=C.success+"20";bc=C.success;}else if(done&&sel===i){bg=C.danger+"20";bc=C.danger;}return(<button key={i} onClick={()=>{if(done)return;setSel(i);onAns(i===correct);}} style={{display:"block",width:"100%",textAlign:"left",padding:"7px 11px",marginBottom:3,borderRadius:7,border:`1px solid ${bc}`,background:bg,color:C.text,cursor:done?"default":"pointer",fontFamily:"inherit",fontSize:12}}>{String.fromCharCode(65+i)}. {o}</button>);})}</div>);}
function Task({children}){return(<div style={{background:C.primary+"15",borderRadius:8,padding:12,border:`1px solid ${C.primary}40`,margin:"10px 0"}}><div style={{fontSize:12,fontWeight:600,color:C.accent,marginBottom:4}}>A faire dans Eclipse</div><div style={{color:C.text,fontSize:12,lineHeight:1.6}}>{children}</div></div>);}
function Tip({title,children,color=C.gold}){return(<div style={{background:color+"15",borderRadius:7,padding:10,border:`1px solid ${color}40`,margin:"8px 0"}}><div style={{fontSize:11,fontWeight:600,color,marginBottom:3}}>{title}</div><div style={{color:C.text,fontSize:11,lineHeight:1.5}}>{children}</div></div>);}
function P({children}){return <p style={{color:C.muted,fontSize:13,lineHeight:1.7,marginBottom:6}}>{children}</p>;}
function Strong({children,c=C.text}){return <strong style={{color:c}}>{children}</strong>;}
function Ac({children}){return <code style={{color:C.accent,fontSize:12}}>{children}</code>;}

// ═══ GAME: CRUD TERMINAL ═══
function CRUDGame({onComplete}){
  const MISSIONS=[
    {inst:"Ajoutez \"Tesla\"",expect:(l)=>l.includes("Tesla")},
    {inst:"Ajoutez \"Edison\"",expect:(l)=>l.includes("Edison")},
    {inst:"Ajoutez \"Bell\"",expect:(l)=>l.includes("Bell")},
    {inst:"Lisez l'index 0 (GET)",expect:(_,o)=>o.includes("get")},
    {inst:"Remplacez index 1 par \"Curie\" (SET)",expect:(l)=>l.includes("Curie")},
    {inst:"Supprimez \"Bell\" (REMOVE)",expect:(l)=>!l.includes("Bell")},
    {inst:"Vérifiez si \"Tesla\" existe (CONTAINS)",expect:(_,o)=>o.includes("contains")},
    {inst:"Affichez la taille (SIZE)",expect:(_,o)=>o.includes("size")},
  ];
  const[list,setList]=useState([]);const[mi,setMi]=useState(0);const[op,setOp]=useState("add");const[input,setInput]=useState("");const[output,setOutput]=useState([]);const[score,setScore]=useState(0);const[done,setDone]=useState(false);
  const exec=()=>{let nl=[...list],out="",ok=false;
    switch(op){case"add":if(input.trim()){nl.push(input.trim());out=`add("${input.trim()}")`;ok=true;}break;case"get":{const i=parseInt(input);if(i>=0&&i<list.length){out=`get(${i}) → "${list[i]}"`;ok=true;}else out="Index invalide";}break;case"set":{const p=input.split(",").map(s=>s.trim());const i=parseInt(p[0]);if(p.length===2&&i>=0&&i<list.length){nl[i]=p[1];out=`set(${i},"${p[1]}")`;ok=true;}else out="Format: index,valeur";}break;case"remove":{const i=nl.indexOf(input.trim());if(i>=0){nl.splice(i,1);out=`remove("${input.trim()}")`;ok=true;}else out="Non trouvé";}break;case"contains":out=`contains("${input.trim()}") → ${nl.includes(input.trim())}`;ok=true;break;case"size":out=`size() → ${nl.length}`;ok=true;break;default:break;}
    setList(nl);setOutput(o=>[...o,{t:out,ok}]);setInput("");
    if(ok&&mi<MISSIONS.length&&MISSIONS[mi].expect(nl,out)){setScore(s=>s+15);if(mi+1>=MISSIONS.length){setDone(true);onComplete(score+15);}else setMi(m=>m+1);}
  };
  return(<div style={{background:C.card,borderRadius:12,padding:14,border:`1px solid ${C.border}`,margin:"10px 0"}}>
    <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:6}}><span style={{color:C.dimmed}}>Mission {mi+1}/{MISSIONS.length}</span><span style={{color:C.gold,fontWeight:700}}>Score: {score}</span></div>
    <div style={{background:done?C.success+"15":C.gold+"15",borderRadius:7,padding:"8px 12px",marginBottom:8,border:`1px solid ${done?C.success:C.gold}40`}}><div style={{fontSize:13,fontWeight:600,color:done?C.success:C.gold}}>{done?"Toutes les missions terminées !":MISSIONS[mi].inst}</div></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
      <div><div style={{fontSize:10,color:C.dimmed,marginBottom:4}}>ARRAYLIST</div><div style={{background:C.code,borderRadius:8,padding:8,minHeight:120}}>
        {list.length===0?<div style={{color:C.dimmed,fontSize:11,textAlign:"center",padding:12}}>[ vide ]</div>:
        list.map((item,i)=>(<div key={i} style={{display:"flex",gap:6,padding:"3px 6px",borderRadius:4,marginBottom:2,background:C.bg}}><span style={{color:C.dimmed,fontSize:10,fontFamily:"monospace"}}>[{i}]</span><span style={{color:C.accent,fontSize:12}}>"{item}"</span></div>))}
      </div></div>
      <div><div style={{fontSize:10,color:C.dimmed,marginBottom:4}}>TERMINAL</div><div style={{background:C.code,borderRadius:8,padding:8,minHeight:120,maxHeight:120,overflow:"auto"}}>
        {output.slice(-6).map((o,i)=>(<div key={i} style={{fontSize:10,fontFamily:"monospace",color:o.ok?C.codeText:C.danger}}>{">"} {o.t}</div>))}
      </div></div>
    </div>
    {!done&&<div style={{marginTop:8}}>
      <div style={{display:"flex",gap:3,marginBottom:4,flexWrap:"wrap"}}>{["add","get","set","remove","contains","size"].map(b=>(<button key={b} onClick={()=>setOp(b)} style={{padding:"3px 8px",borderRadius:5,fontSize:9,fontWeight:700,border:`1px solid ${op===b?C.accent:C.border}`,background:op===b?C.accent+"20":"transparent",color:op===b?C.accent:C.muted,cursor:"pointer",fontFamily:"monospace"}}>{b.toUpperCase()}</button>))}</div>
      <div style={{display:"flex",gap:4}}><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&exec()} placeholder={op==="size"?"(pas de param)":op==="set"?"index,valeur":"valeur"} style={{flex:1,padding:"6px 10px",borderRadius:6,border:`1px solid ${C.border}`,background:C.code,color:C.text,fontFamily:"monospace",fontSize:12,outline:"none"}}/><button onClick={exec} style={{padding:"6px 14px",borderRadius:6,border:"none",background:C.accent,color:C.bg,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600}}>OK</button></div>
    </div>}
  </div>);
}

function Memo(){return(<div style={{background:C.card,borderRadius:12,padding:20,border:`1px solid ${C.gold}40`}}>
  <div style={{fontSize:16,fontWeight:700,color:C.gold,marginBottom:12}}>Mémo débloqué — Data Java</div>
  <div style={{background:C.code,borderRadius:8,padding:10,marginBottom:8}}>
    <div style={{fontSize:11,fontWeight:600,color:C.accent,marginBottom:4}}>String essentiels</div>
    <pre style={{margin:0,fontSize:10,color:C.codeText,fontFamily:"monospace"}}>{".length() .toUpperCase() .toLowerCase()\n.substring(d,f) .contains(s) .indexOf(s)\n.equals(s) .split(sep) .charAt(i)\n.startsWith(s) .replace(a,b) .trim()"}</pre>
  </div>
  <div style={{background:C.code,borderRadius:8,padding:10,marginBottom:8}}>
    <div style={{fontSize:11,fontWeight:600,color:C.accent,marginBottom:4}}>ArrayList CRUD</div>
    <pre style={{margin:0,fontSize:10,color:C.codeText,fontFamily:"monospace"}}>{"add(elem)  get(i)  set(i,elem)  remove(i)\nsize()  isEmpty()  contains(e)  indexOf(e)"}</pre>
  </div>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
    <div style={{background:C.danger+"15",borderRadius:6,padding:8}}><div style={{fontSize:10,fontWeight:600,color:C.danger}}>== vs .equals()</div><div style={{fontSize:10,color:C.muted}}>TOUJOURS .equals() pour String</div></div>
    <div style={{background:C.gold+"15",borderRadius:6,padding:8}}><div style={{fontSize:10,fontWeight:600,color:C.gold}}>nextInt() + nextLine()</div><div style={{fontSize:10,color:C.muted}}>sc.nextLine() après nextInt() !</div></div>
  </div>
</div>);}

const STEPS=[
  {section:"Théorie",title:"Méthodes String",type:"theory",render:(onQ,done)=>(<>
    <P>Les <Strong c={C.accent}>String</Strong> ont plein de méthodes utiles :</P>
    <Code hl={[2,3,5,6,8,9,11]} code={`String t = "Labo CodeQuest";\n// Longueur\nSystem.out.println(t.length());        // 14\n// Maj/min\nSystem.out.println(t.toUpperCase());   // "LABO CODEQUEST"\nSystem.out.println(t.toLowerCase());   // "labo codequest"\n// Extraire\nSystem.out.println(t.substring(0,4));  // "Labo"\nSystem.out.println(t.substring(5));    // "CodeQuest"\n// Chercher\nSystem.out.println(t.contains("Code")); // true\nSystem.out.println(t.indexOf("Quest")); // 9`}/>
    <Tip title="String immuables !"><Ac>t.toUpperCase()</Ac> retourne un NOUVEAU String, ne modifie PAS t. Pour garder : <Ac>t = t.toUpperCase();</Ac></Tip>
    <Task>1. Déclarez une phrase<br/>2. Affichez sa longueur, en majuscules<br/>3. Extrayez un mot avec substring<br/>4. Découpez avec <Ac>.split(" ")</Ac> et affichez chaque mot</Task>
    <Quiz q='"Hello".substring(1,4) retourne ?' opts={['"Hell"','"ell"','"ello"','"Hel"']} correct={1} onAns={onQ} done={done}/>
  </>)},
  {section:"Théorie",title:"Comparer les String",type:"theory",render:(onQ,done)=>(<>
    <P><Strong c={C.danger}>JAMAIS ==</Strong> pour comparer des String. Toujours <Ac>.equals()</Ac> !</P>
    <Code hl={[3,4,6,7]} code={`String a = "test";\nString b = new String("test");\n// ❌ FAUX\nSystem.out.println(a == b);       // false !\n// ✅ CORRECT\nSystem.out.println(a.equals(b));  // true\n// Ignorer la casse :\nSystem.out.println("ABC".equalsIgnoreCase("abc")); // true`}/>
    <P>Accéder à un caractère par position :</P>
    <Code code={`char c = "Hello".charAt(0);  // 'H'\nchar d = "Hello".charAt(4);  // 'o'\n// Compter les voyelles :\nint v = 0;\nfor (int i = 0; i < mot.length(); i++) {\n    char ch = mot.charAt(i);\n    if (ch=='a'||ch=='e'||ch=='i'||ch=='o'||ch=='u') v++;\n}`}/>
    <Task>1. Demandez un mot à l'utilisateur<br/>2. Affichez en majuscules et minuscules<br/>3. Comptez les voyelles<br/>4. Affichez le mot à l'envers (boucle de length()-1 à 0)</Task>
    <Quiz q='Pourquoi "test" == new String("test") retourne false ?' opts={["Bug","== compare les références, .equals() le contenu","C'est pas false","Les String ne supportent pas =="]} correct={1} onAns={onQ} done={done}/>
  </>)},
  {section:"Théorie",title:"ArrayList CRUD",type:"theory",render:(onQ,done)=>(<>
    <P><Strong>CRUD</Strong> = Create, Read, Update, Delete. Les 4 opérations de base.</P>
    <Code hl={[2,3,5,6,8,10,11]} code={`import java.util.ArrayList;\nArrayList<String> list = new ArrayList<>();\n// CREATE\nlist.add("Tesla"); list.add("Edison"); list.add("Bell");\n// READ\nSystem.out.println(list.get(0));   // "Tesla"\nSystem.out.println(list.size());   // 3\n// UPDATE\nlist.set(1, "Curie");              // remplace Edison\n// DELETE\nlist.remove("Bell");               // supprime Bell\nlist.remove(0);                    // supprime par index`}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,margin:"8px 0"}}>
      <div style={{background:C.card,borderRadius:7,padding:8,border:`1px solid ${C.border}`}}><div style={{fontWeight:700,color:C.accent,fontSize:11}}>Array classique</div><div style={{color:C.muted,fontSize:10}}>Taille FIXE · int[] tab = new int[5]</div></div>
      <div style={{background:C.card,borderRadius:7,padding:8,border:`1px solid ${C.border}`}}><div style={{fontWeight:700,color:C.gold,fontSize:11}}>ArrayList</div><div style={{color:C.muted,fontSize:10}}>Taille DYNAMIQUE · add/remove</div></div>
    </div>
    <Task>1. Créez un ArrayList de String<br/>2. Ajoutez 5 noms avec add()<br/>3. Modifiez le 1er avec set(0, ...)<br/>4. Supprimez le dernier avec remove(size()-1)<br/>5. Affichez tout avec for-each</Task>
    <Quiz q="list.set(1, 'GPS') fait quoi ?" opts={["Ajoute GPS à la fin","Remplace l'élément index 1 par GPS","Insère à l'index 1","Supprime l'index 1"]} correct={1} onAns={onQ} done={done}/>
  </>)},
  {section:"Théorie",title:"Recherche et filtrage",type:"theory",render:(onQ,done)=>(<>
    <P>Opérations courantes : chercher, filtrer, compter.</P>
    <Code hl={[1,2,3,6,7,8,9]} code={`// Chercher\nboolean existe = list.contains("Tesla");  // true\nint idx = list.indexOf("Tesla");           // 0 ou -1\nboolean vide = list.isEmpty();             // false\n\n// Filtrer : créer une sous-liste\nArrayList<String> res = new ArrayList<>();\nfor (String s : list) {\n    if (s.toLowerCase().contains("el")) res.add(s);\n}\n// Recherche insensible à la casse !`}/>
    <Tip title="Recherche insensible à la casse"><Ac>nom.toLowerCase().contains(recherche.toLowerCase())</Ac><br/>Convertit les deux en minuscules avant de comparer</Tip>
    <Task>1. Créez un ArrayList{"<Integer>"} avec 10 nombres<br/>2. Trouvez le max et le min<br/>3. Comptez les pairs<br/>4. Créez un ArrayList avec seulement les nombres {">"} 50</Task>
    <Quiz q="indexOf() retourne quoi si l'élément n'existe pas ?" opts={["0","null","-1","Exception"]} correct={2} onAns={onQ} done={done}/>
  </>)},

  // ── JEU ──
  {section:"Défi",title:"Le Terminal CRUD",type:"game",render:(_,__,onGC)=>(<>
    <P>8 missions : manipulez un ArrayList en temps réel ! Ajoutez, lisez, modifiez, supprimez.</P>
    <CRUDGame onComplete={onGC}/>
  </>)},

  // ── CODE GUIDÉ ──
  {section:"Code guidé",title:"Menu CRUD pas à pas",type:"guided",render:(onQ,done)=>(<>
    <P>Construisons un menu interactif avec do-while + switch + ArrayList.</P>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:6,marginBottom:3}}>Étape 1 : Structure du menu</div>
    <Code code={`Scanner sc = new Scanner(System.in);\nArrayList<String> noms = new ArrayList<>();\nint choix;\ndo {\n    System.out.println("1.Ajouter 2.Afficher 0.Quitter");\n    choix = sc.nextInt(); sc.nextLine();\n    switch (choix) {\n        case 1: /* ... */ break;\n        case 2: /* ... */ break;\n    }\n} while (choix != 0);`}/>
    <P>Tapez ça. Testez — le menu tourne en boucle.</P>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:6,marginBottom:3}}>Étape 2 : Ajouter</div>
    <Code code={`case 1:\n    System.out.print("Nom : ");\n    String nom = sc.nextLine();\n    noms.add(nom);\n    System.out.println("Ajouté !");\n    break;`}/>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:6,marginBottom:3}}>Étape 3 : Afficher</div>
    <Code code={`case 2:\n    if (noms.isEmpty()) System.out.println("Vide.");\n    else for (int i=0; i<noms.size(); i++)\n        System.out.println((i+1)+". "+noms.get(i));\n    break;`}/>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:6,marginBottom:3}}>Étape 4 : Rechercher</div>
    <Code code={`case 3:\n    System.out.print("Recherche : ");\n    String rech = sc.nextLine().toLowerCase();\n    for (String n : noms)\n        if (n.toLowerCase().contains(rech))\n            System.out.println("→ " + n);\n    break;`}/>
    <Tip title="sc.nextLine() après sc.nextInt()">Après <Ac>nextInt()</Ac>, le retour à la ligne reste dans le buffer. <Ac>sc.nextLine()</Ac> le consomme. Sans ça, la prochaine lecture sera vide !</Tip>
    <Task>Tapez le programme complet avec les 3 cases. Testez : ajoutez 3 noms, affichez, recherchez.<br/>Ensuite ajoutez vous-même : case 4 (modifier avec <Ac>set()</Ac>) et case 5 (supprimer avec <Ac>remove()</Ac>)</Task>
    <Quiz q="Pourquoi sc.nextLine() après sc.nextInt() ?" opts={["Pour lire le mot suivant","Pour consommer le \\n resté dans le buffer","C'est optionnel","Pour fermer le Scanner"]} correct={1} onAns={onQ} done={done}/>
  </>)},

  // ── EXERCICE ──
  {section:"Exercice",title:"Gestionnaire d'Inventeurs (autonome)",type:"exercise",render:(onQ,done)=>(<>
    <div style={{background:C.gold+"15",borderRadius:10,padding:14,border:`1px solid ${C.gold}40`}}>
      <div style={{fontSize:15,fontWeight:700,color:C.gold,marginBottom:4}}>Exercice — 60 Crédits R&D</div>
      <div style={{color:C.text,fontSize:13}}>Menu CRUD complet avec 2 ArrayList (noms + spécialités). <Strong>Faites-le SEUL !</Strong></div>
    </div>
    <div style={{color:C.text,fontSize:12,lineHeight:1.8,marginTop:10}}>
      1. Ajouter (nom + spécialité)<br/>2. Afficher tous (numérotés)<br/>3. Rechercher par nom (partiel, insensible casse)<br/>4. Modifier (par index)<br/>5. Supprimer (par nom)<br/>6. Statistiques (total + nom le plus long)<br/><Strong c={C.gold}>Bonus</Strong> : compter noms par initiale
    </div>
    <Quiz q="Recherche insensible à la casse ?" opts={[".equals()",".contains() sur les deux en toLowerCase()",".compareTo()",".matches()"]} correct={1} onAns={onQ} done={done}/>
  </>)},

  // ── CORRECTION ──
  {section:"Correction",title:"Correction Gestionnaire",type:"correction",render:(onQ,done)=>(<>
    <div style={{background:C.success+"12",borderRadius:8,padding:10,border:`1px solid ${C.success}40`,marginBottom:8}}><div style={{fontSize:13,fontWeight:700,color:C.success}}>Correction complète</div></div>
    <Code hl={[6,7,8,9,12,13,14,17,18,19,20,23,24,25,26,29,30,31]} code={`import java.util.*;\npublic class GestionInventeurs {\n  public static void main(String[] args) {\n    Scanner sc=new Scanner(System.in);\n    ArrayList<String> noms=new ArrayList<>(),specs=new ArrayList<>();\n    int ch; do {\n      System.out.println("1.Add 2.Show 3.Search 4.Edit 5.Del 6.Stats 0.Quit");\n      ch=sc.nextInt(); sc.nextLine();\n      switch(ch){\n        case 1: System.out.print("Nom: "); String n=sc.nextLine();\n          System.out.print("Spéc: "); noms.add(n); specs.add(sc.nextLine());\n          System.out.println("Ajouté!"); break;\n        case 2: if(noms.isEmpty()) System.out.println("Vide.");\n          else for(int i=0;i<noms.size();i++)\n            System.out.println((i+1)+". "+noms.get(i)+" ("+specs.get(i)+")"); break;\n        case 3: System.out.print("Recherche: ");\n          String r=sc.nextLine().toLowerCase(); boolean f=false;\n          for(int i=0;i<noms.size();i++)\n            if(noms.get(i).toLowerCase().contains(r))\n              {System.out.println("→ "+noms.get(i));f=true;}\n          if(!f) System.out.println("Aucun."); break;\n        case 4: System.out.print("Index(1-"+noms.size()+"): ");\n          int idx=sc.nextInt()-1; sc.nextLine();\n          if(idx>=0&&idx<noms.size()){\n            System.out.print("Nom: "); noms.set(idx,sc.nextLine());\n            System.out.print("Spéc: "); specs.set(idx,sc.nextLine());\n          } else System.out.println("Invalide!"); break;\n        case 5: System.out.print("Nom: "); String s=sc.nextLine();\n          int si=noms.indexOf(s);\n          if(si>=0){noms.remove(si);specs.remove(si);\n            System.out.println("Supprimé!");}\n          else System.out.println("Non trouvé!"); break;\n        case 6: System.out.println("Total: "+noms.size());\n          if(!noms.isEmpty()){String pl=noms.get(0);\n            for(String nm:noms) if(nm.length()>pl.length()) pl=nm;\n            System.out.println("Plus long: "+pl);} break;\n      }\n    } while(ch!=0); sc.close();\n  }\n}`}/>
    <Tip title="Points clés"><Strong>2 ArrayList parallèles</Strong> : même index = même personne<br/><Strong>indexOf()</Strong> retourne -1 si pas trouvé<br/><Strong>toLowerCase().contains()</Strong> pour recherche insensible</Tip>
    <Quiz q="Pourquoi 2 ArrayList au lieu d'une classe Inventeur ?" opts={["C'est mieux","C'est plus simple pour débuter — plus tard on fera une classe !","Java ne permet pas de mélanger String et int","ArrayList ne supporte qu'un type"]} correct={1} onAns={onQ} done={done}/>
  </>)},
];

// ═══ MAIN ═══
export default function M04Unified(){
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
    <div style={{padding:"8px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:C.card,flexWrap:"wrap",gap:4}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:10,letterSpacing:2,color:C.dimmed}}>CODEQUEST</span><span style={{color:C.border}}>|</span><span style={{fontSize:12,fontWeight:600,color:C.accent}}>M04 · Data</span></div><div style={{display:"flex",gap:10,fontSize:11}}><span style={{color:C.muted}}>Quiz <strong style={{color:C.success}}>{score}/{totalQ}</strong></span>{gameScore!==null&&<span style={{color:C.muted}}>Jeu <strong style={{color:C.accent}}>{gameScore}</strong></span>}<span style={{color:C.muted}}>CR <strong style={{color:C.gold}}>{credits}</strong></span></div></div>
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
