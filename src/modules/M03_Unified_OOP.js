import { useState, useEffect, useCallback } from "react";

const C={bg:"#0a0f1a",card:"#111827",primary:"#0D7377",secondary:"#14A3C7",accent:"#32E0C4",gold:"#F59E0B",text:"#e2e8f0",muted:"#94a3b8",dimmed:"#64748b",border:"#1e293b",success:"#10B981",danger:"#EF4444",code:"#1E293B",codeBorder:"#2d3a4f",codeText:"#32E0C4",comment:"#6b7f99",keyword:"#c792ea",string:"#c3e88d",number:"#f78c6c",type:"#ffcb6b"};
const KEY="cq-m03-unified";
async function ld(){try{const r=await window.storage.get(KEY);return r?JSON.parse(r.value):null;}catch{return null;}}
async function sv(d){try{await window.storage.set(KEY,JSON.stringify(d));}catch{}}
function Code({code,hl=[]}){const lines=code.split("\n");return(<div style={{background:C.code,border:`1px solid ${C.codeBorder}`,borderRadius:10,overflow:"hidden",fontSize:12,fontFamily:"'JetBrains Mono',monospace",margin:"8px 0"}}><div style={{display:"flex",gap:5,padding:"5px 10px",background:"#0d1117",borderBottom:`1px solid ${C.codeBorder}`}}><span style={{width:7,height:7,borderRadius:"50%",background:"#ff5f57"}}/><span style={{width:7,height:7,borderRadius:"50%",background:"#febc2e"}}/><span style={{width:7,height:7,borderRadius:"50%",background:"#28c840"}}/></div><div style={{padding:"8px 0",overflowX:"auto"}}>{lines.map((l,i)=>(<div key={i} style={{display:"flex",padding:"1px 0",background:hl.includes(i)?C.accent+"12":"transparent",borderLeft:hl.includes(i)?`3px solid ${C.accent}`:"3px solid transparent"}}><span style={{width:32,textAlign:"right",paddingRight:8,color:C.dimmed,userSelect:"none",flexShrink:0,fontSize:10}}>{i+1}</span><span style={{color:C.codeText,whiteSpace:"pre"}}>{col(l)}</span></div>))}</div></div>);}
function col(l){return l.replace(/(\/\/.*)/, `\x01C$1\x02`).replace(/\b(public|static|void|class|int|String|double|boolean|if|else|return|new|final|for|while|private|protected|this|null|import)\b/g,`\x01K$&\x02`).replace(/("(?:[^"\\]|\\.)*")/g,`\x01S$1\x02`).replace(/\b(\d+\.?\d*)\b/g,`\x01N$1\x02`).replace(/\b(System|Scanner|ArrayList|Collections)\b/g,`\x01T$1\x02`).split(/(\x01\w.*?\x02)/).map((p,i)=>{if(p.startsWith("\x01C"))return <span key={i} style={{color:C.comment,fontStyle:"italic"}}>{p.slice(2,-1)}</span>;if(p.startsWith("\x01K"))return <span key={i} style={{color:C.keyword}}>{p.slice(2,-1)}</span>;if(p.startsWith("\x01S"))return <span key={i} style={{color:C.string}}>{p.slice(2,-1)}</span>;if(p.startsWith("\x01N"))return <span key={i} style={{color:C.number}}>{p.slice(2,-1)}</span>;if(p.startsWith("\x01T"))return <span key={i} style={{color:C.type}}>{p.slice(2,-1)}</span>;return <span key={i}>{p}</span>;});}
function Quiz({q,opts,correct,onAns,done}){const[sel,setSel]=useState(null);return(<div style={{margin:"12px 0"}}><div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:6}}>{q}</div>{opts.map((o,i)=>{let bg=C.card,bc=C.border;if(done&&i===correct){bg=C.success+"20";bc=C.success;}else if(done&&sel===i){bg=C.danger+"20";bc=C.danger;}return(<button key={i} onClick={()=>{if(done)return;setSel(i);onAns(i===correct);}} style={{display:"block",width:"100%",textAlign:"left",padding:"7px 11px",marginBottom:3,borderRadius:7,border:`1px solid ${bc}`,background:bg,color:C.text,cursor:done?"default":"pointer",fontFamily:"inherit",fontSize:12}}>{String.fromCharCode(65+i)}. {o}</button>);})}</div>);}
function Task({children}){return(<div style={{background:C.primary+"15",borderRadius:8,padding:12,border:`1px solid ${C.primary}40`,margin:"10px 0"}}><div style={{fontSize:12,fontWeight:600,color:C.accent,marginBottom:4}}>A faire dans Eclipse</div><div style={{color:C.text,fontSize:12,lineHeight:1.6}}>{children}</div></div>);}
function Tip({title,children,color=C.gold}){return(<div style={{background:color+"15",borderRadius:7,padding:10,border:`1px solid ${color}40`,margin:"8px 0"}}><div style={{fontSize:11,fontWeight:600,color,marginBottom:3}}>{title}</div><div style={{color:C.text,fontSize:11,lineHeight:1.5}}>{children}</div></div>);}
function P({children}){return <p style={{color:C.muted,fontSize:13,lineHeight:1.7,marginBottom:6}}>{children}</p>;}
function Strong({children,c=C.text}){return <strong style={{color:c}}>{children}</strong>;}
function Kw({children}){return <code style={{color:C.keyword,fontSize:12}}>{children}</code>;}
function Ac({children}){return <code style={{color:C.accent,fontSize:12}}>{children}</code>;}
function An({children}){return(<div style={{background:C.secondary+"12",borderRadius:8,padding:12,border:`1px solid ${C.secondary}30`,margin:"8px 0",borderLeft:`4px solid ${C.secondary}`}}><div style={{fontSize:11,fontWeight:600,color:C.secondary,marginBottom:3}}>Analogie</div><div style={{color:C.text,fontSize:12,lineHeight:1.5}}>{children}</div></div>);}

// ═══ GAME: CLASS BUILDER ═══
function ClassBuilderGame({onComplete}){
  const QS=[
    {q:"Quels attributs pour une classe Invention ?",type:"multi",opts:[{t:"private String nom;",ok:true},{t:"public String nom;",ok:false,w:"Attributs toujours private !"},{t:"private int annee;",ok:true},{t:"String inventeur;",ok:false,w:"Manque private"}],pts:20},
    {q:"Quel constructeur est correct ?",type:"single",opts:[{t:"public Invention(String n, int a) {\n  this.nom = n;\n  this.annee = a;\n}",ok:true},{t:"public void Invention(String n) {\n  nom = n;\n}",ok:false,w:"Pas de void + manque this"},{t:"Invention(String n) {\n  n = nom;\n}",ok:false,w:"Inversé ! Et manque public"}],pts:25},
    {q:"this.nom = nom; signifie quoi ?",type:"single",opts:[{t:"this.nom (attribut objet) reçoit nom (paramètre)",ok:true},{t:"C'est la même chose que nom = nom",ok:false,w:"Non ! Sans this, le paramètre s'assigne à lui-même"},{t:"Ça crée une nouvelle variable",ok:false,w:"Non, ça assigne une valeur existante"}],pts:20},
    {q:"Ce code a un bug :\npublic void setAnnee(int annee) {\n  annee = annee;\n}\nLequel ?",type:"single",opts:[{t:"Il manque this.annee = annee",ok:true},{t:"void devrait être int",ok:false,w:"Non, un setter est void"},{t:"Il n'y a pas de bug",ok:false,w:"Si ! L'attribut ne change jamais"}],pts:25},
    {q:"Quel getter est correct pour private String nom ?",type:"single",opts:[{t:"public String getNom() { return this.nom; }",ok:true},{t:"public void getNom() { return nom; }",ok:false,w:"void ne peut pas retourner !"},{t:"private String getNom() { return nom; }",ok:false,w:"Un getter doit être public"}],pts:20},
  ];
  const[idx,setIdx]=useState(0);const[score,setScore]=useState(0);const[sel,setSel]=useState([]);const[answered,setAnswered]=useState(false);
  const q=QS[idx];
  const check=()=>{setAnswered(true);if(q.type==="multi"){const ok=q.opts.every((o,i)=>o.ok===sel.includes(i));if(ok)setScore(s=>s+q.pts);else setScore(s=>s+Math.floor(q.pts*0.3));}else{const ok=sel[0]!==undefined&&q.opts[sel[0]].ok;if(ok)setScore(s=>s+q.pts);}};
  const next=()=>{if(idx+1>=QS.length){onComplete(score);return;}setIdx(n=>n+1);setSel([]);setAnswered(false);};
  const toggle=(i)=>{if(answered)return;if(q.type==="single")setSel([i]);else setSel(s=>s.includes(i)?s.filter(x=>x!==i):[...s,i]);};
  return(<div style={{background:C.card,borderRadius:12,padding:14,border:`1px solid ${C.border}`,margin:"10px 0"}}>
    <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:6}}><span style={{color:C.dimmed}}>Niveau {idx+1}/{QS.length}</span><span style={{color:C.gold,fontWeight:700}}>Score: {score}</span></div>
    <div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:8,whiteSpace:"pre-wrap"}}>{q.q}</div>
    <div style={{display:"flex",flexDirection:"column",gap:5}}>
      {q.opts.map((o,i)=>{let bg=C.code,bc=C.codeBorder;if(answered&&o.ok){bg=C.success+"20";bc=C.success;}else if(answered&&sel.includes(i)&&!o.ok){bg=C.danger+"20";bc=C.danger;}else if(sel.includes(i)){bg=C.accent+"15";bc=C.accent;}
      return(<button key={i} onClick={()=>toggle(i)} style={{padding:"8px 10px",borderRadius:7,border:`1px solid ${bc}`,background:bg,color:C.codeText,cursor:answered?"default":"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:11,textAlign:"left",whiteSpace:"pre-wrap"}}>
        {o.t}{answered&&o.w&&!o.ok&&<div style={{fontSize:10,color:C.danger,fontFamily:"'Segoe UI',sans-serif",marginTop:4}}>{o.w}</div>}
      </button>);})}
    </div>
    {!answered?<button onClick={check} style={{marginTop:8,width:"100%",padding:"8px",borderRadius:7,border:"none",background:C.accent,color:C.bg,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600}}>Valider</button>:
    <button onClick={next} style={{marginTop:8,width:"100%",padding:"8px",borderRadius:7,border:"none",background:C.accent,color:C.bg,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600}}>{idx+1>=QS.length?"Terminer":"Suivant →"}</button>}
  </div>);
}

function Memo(){return(<div style={{background:C.card,borderRadius:12,padding:20,border:`1px solid ${C.gold}40`}}>
  <div style={{fontSize:16,fontWeight:700,color:C.gold,marginBottom:12}}>Mémo débloqué — POO Java</div>
  <div style={{background:C.code,borderRadius:8,padding:10,marginBottom:8}}>
    <div style={{fontSize:11,fontWeight:600,color:C.accent,marginBottom:4}}>Structure d'une classe</div>
    <pre style={{margin:0,fontSize:10,color:C.codeText,fontFamily:"monospace"}}>{"public class NomClasse {\n  // 1. Attributs (private)\n  private String nom;\n  // 2. Constructeur\n  public NomClasse(String nom) {\n    this.nom = nom;\n  }\n  // 3. Getters\n  public String getNom() { return nom; }\n  // 4. Setters (avec validation)\n  public void setNom(String n) {\n    if(n!=null && !n.isEmpty()) nom=n;\n  }\n  // 5. Méthodes métier\n  public void afficher() { ... }\n}"}</pre>
  </div>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
    <div style={{background:C.danger+"15",borderRadius:6,padding:8}}><div style={{fontSize:10,fontWeight:600,color:C.danger}}>private = attributs</div><div style={{fontSize:10,color:C.muted}}>Données cachées, accès contrôlé</div></div>
    <div style={{background:C.success+"15",borderRadius:6,padding:8}}><div style={{fontSize:10,fontWeight:600,color:C.success}}>public = méthodes</div><div style={{fontSize:10,color:C.muted}}>Getters, setters, constructeur</div></div>
  </div>
  <div style={{marginTop:8,background:C.danger+"15",borderRadius:6,padding:8}}><div style={{fontSize:10,fontWeight:600,color:C.danger}}>Pièges</div><div style={{fontSize:10,color:C.muted}}>this oublié → attribut reste null · void sur constructeur → ce n'est plus un constructeur · == sur String → .equals() · Setter sans validation → données corrompues</div></div>
</div>);}

const STEPS=[
  {section:"Théorie",title:"Pourquoi des classes ?",type:"theory",render:(onQ,done)=>(<>
    <P>Imaginez gérer 100 inventions <Strong c={C.danger}>sans classes</Strong> :</P>
    <Code code={`String nom1 = "Téléphone"; int annee1 = 1876;\nString nom2 = "Ampoule";   int annee2 = 1879;\n// 100 inventions = 300 variables ! Impossible à maintenir.`}/>
    <An>C'est comme un labo qui range ses fiches en vrac. Il faut un <Strong>classeur</Strong> avec un modèle de fiche. La <Strong c={C.accent}>classe</Strong> = le modèle. L'<Strong c={C.gold}>objet</Strong> = une fiche remplie.</An>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,margin:"8px 0"}}>
      <div style={{background:C.card,borderRadius:8,padding:10,border:`1px solid ${C.accent}40`}}><div style={{fontWeight:700,color:C.accent,fontSize:13}}>Classe</div><div style={{color:C.muted,fontSize:11}}>Le plan. Écrit 1 fois. Définit les attributs et méthodes.</div></div>
      <div style={{background:C.card,borderRadius:8,padding:10,border:`1px solid ${C.gold}40`}}><div style={{fontWeight:700,color:C.gold,fontSize:13}}>Objet</div><div style={{color:C.muted,fontSize:11}}>Une instance. Créé avec <Ac>new</Ac>. A ses propres valeurs.</div></div>
    </div>
    <Code hl={[0,1,2,5,6]} code={`public class Invention {\n    String nom;\n    int annee;\n}\n// Créer des objets :\nInvention tel = new Invention();\ntel.nom = "Téléphone"; tel.annee = 1876;`}/>
    <Task>1. Créez <Ac>Invention.java</Ac> (sans main, juste la classe)<br/>2. Créez <Ac>TestInvention.java</Ac> (avec main)<br/>3. Créez 2 objets et affichez-les</Task>
    <Quiz q='Que fait "new Invention()" ?' opts={["Déclare une variable","Crée un objet de type Invention","Compile la classe","Supprime un objet"]} correct={1} onAns={onQ} done={done}/>
  </>)},
  {section:"Théorie",title:"Le constructeur + this",type:"theory",render:(onQ,done)=>(<>
    <P>Sans constructeur, on peut créer un objet <Strong c={C.danger}>vide</Strong> (attributs = null). Le <Strong c={C.accent}>constructeur</Strong> force à donner des valeurs :</P>
    <Code hl={[3,4,5,6]} code={`public class Invention {\n    String nom;\n    int annee;\n    public Invention(String nom, int annee) {\n        this.nom = nom;     // this = cet objet\n        this.annee = annee; // nom = le paramètre\n    }\n}`}/>
    <Tip title="this est OBLIGATOIRE ici" color={C.danger}>Sans this : <Ac>nom = nom;</Ac> → le paramètre s'assigne à lui-même, l'attribut reste <Strong c={C.danger}>null</Strong> !<br/>Avec this : <Ac>this.nom = nom;</Ac> → l'attribut de l'objet reçoit la valeur du paramètre.</Tip>
    <Task>1. Ajoutez le constructeur à Invention<br/>2. Essayez <Ac>new Invention()</Ac> sans paramètres → <Strong c={C.danger}>erreur !</Strong><br/>3. Corrigez : <Ac>new Invention("Téléphone", 1876)</Ac><br/>4. <Strong>Expérience</Strong> : enlevez this → affichez nom → <Strong c={C.danger}>null</Strong> ! Remettez this.</Task>
    <Quiz q='Sans this, "nom = nom;" fait quoi ?' opts={["Assigne la valeur à l'attribut","Le paramètre s'assigne à lui-même (attribut = null)","Erreur de compilation","Crée une nouvelle variable"]} correct={1} onAns={onQ} done={done}/>
  </>)},
  {section:"Théorie",title:"private + getters + setters",type:"theory",render:(onQ,done)=>(<>
    <P><Kw>private</Kw> empêche l'accès direct. Les <Strong c={C.accent}>getters</Strong> lisent, les <Strong c={C.accent}>setters</Strong> modifient <Strong>avec validation</Strong>.</P>
    <Code hl={[1,2,4,5,7,8,9,10]} code={`public class Invention {\n    private String nom;    // inaccessible depuis l'extérieur\n    private int annee;\n    // ... constructeur ...\n    public String getNom() { return this.nom; }       // LIRE\n    public int getAnnee() { return this.annee; }\n    \n    public void setNom(String nom) {                  // MODIFIER\n        if (nom != null && !nom.isEmpty()) {\n            this.nom = nom;   // seulement si valide !\n        }\n    }\n    public void setAnnee(int annee) {\n        if (annee > 0 && annee <= 2026) this.annee = annee;\n    }\n}`}/>
    <An>Le getter = la vitre du labo (on regarde sans toucher). Le setter = le gardien (vérifie avant de laisser modifier).</An>
    <Code code={`Invention inv = new Invention("Tel", 1876);\n// inv.nom = "test";   ❌ ERREUR: private\ninv.setNom("Smartphone"); // ✅ OK\ninv.setNom("");            // ✅ Refusé (nom garde "Smartphone")\nSystem.out.println(inv.getNom()); // "Smartphone"`}/>
    <Task>1. Mettez <Kw>private</Kw> devant chaque attribut<br/>2. Essayez <Ac>inv.nom</Ac> → <Strong c={C.danger}>erreur !</Strong><br/>3. Ajoutez getters + setters avec validation<br/>4. Testez setNom("") → le nom ne change PAS</Task>
    <Quiz q='setNom("") avec la validation ci-dessus ?' opts={["Le nom devient vide","Erreur","Rien — le nom garde sa valeur","NullPointerException"]} correct={2} onAns={onQ} done={done}/>
  </>)},
  {section:"Théorie",title:"Méthodes métier",type:"theory",render:(onQ,done)=>(<>
    <P>En plus des getters/setters, on ajoute des <Strong c={C.accent}>méthodes qui font des choses</Strong> :</P>
    <Code hl={[1,2,3,4,6,7]} code={`// void = fait une action, ne retourne rien\npublic void afficher() {\n    System.out.println(nom + " (" + annee + ")");\n}\n// int = calcule et retourne un résultat\npublic int getAge() {\n    return 2026 - annee;\n}`}/>
    <Tip title="void vs return"><Strong>void</Strong> : afficher, modifier, sauvegarder (action)<br/><Strong>int, String, boolean...</Strong> : calculer, vérifier (résultat retourné)</Tip>
    <Task>1. Ajoutez afficher() et getAge() à Invention<br/>2. Testez : <Ac>inv.afficher();</Ac> et <Ac>inv.getAge()</Ac><br/>3. Ajoutez <Ac>toString()</Ac> qui retourne un String → testez avec <Ac>System.out.println(inv)</Ac></Task>
    <Quiz q="Différence void vs int ?" opts={["C'est pareil","void ne retourne rien, int retourne un nombre","void est pour les constructeurs","int est plus rapide"]} correct={1} onAns={onQ} done={done}/>
  </>)},

  // ── JEU ──
  {section:"Défi",title:"Le Constructeur de Classes",type:"game",render:(_,__,onGC)=>(<>
    <P>5 niveaux pour tester vos connaissances OOP : attributs, constructeur, this, getter/setter, bugs !</P>
    <ClassBuilderGame onComplete={onGC}/>
  </>)},

  // ── CODE GUIDÉ ──
  {section:"Code guidé",title:"Construire Invention pas à pas",type:"guided",render:(onQ,done)=>(<>
    <P><Strong>Fichier Invention.java</Strong> — tapez chaque étape, testez après chacune.</P>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:6,marginBottom:3}}>Étape 1 : Attributs</div>
    <Code code={`public class Invention {\n    private String nom;\n    private String inventeur;\n    private int annee;\n}`}/>
    <P>Pas de main ici. C'est juste la structure.</P>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:6,marginBottom:3}}>Étape 2 : Constructeur</div>
    <Code code={`    public Invention(String nom, String inventeur, int annee) {\n        this.nom = nom;\n        this.inventeur = inventeur;\n        this.annee = annee;\n    }`}/>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:6,marginBottom:3}}>Étape 3 : Getters</div>
    <Code code={`    public String getNom() { return nom; }\n    public String getInventeur() { return inventeur; }\n    public int getAnnee() { return annee; }`}/>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:6,marginBottom:3}}>Étape 4 : Setter avec validation</div>
    <Code code={`    public void setNom(String nom) {\n        if (nom != null && !nom.isEmpty()) this.nom = nom;\n    }`}/>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:6,marginBottom:3}}>Étape 5 : Méthodes</div>
    <Code code={`    public void afficher() {\n        System.out.println(nom + " (" + annee + ") par " + inventeur);\n    }\n    public int getAge() { return 2026 - annee; }`}/>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:6,marginBottom:3}}>Étape 6 : Tester (TestInvention.java)</div>
    <Code hl={[2,3,4,5,6,7]} code={`public class TestInvention {\n    public static void main(String[] args) {\n        Invention t = new Invention("Téléphone", "Bell", 1876);\n        t.afficher();\n        System.out.println("Age: " + t.getAge());\n        t.setNom("Smartphone");\n        t.setNom("");  // refusé !\n        System.out.println(t.getNom()); // Smartphone\n    }\n}`}/>
    <Task>Tapez tout, testez après chaque étape. <Strong>Résultat attendu :</Strong><br/>Téléphone (1876) par Bell<br/>Age: 150<br/>Smartphone</Task>
    <Quiz q="Combien de fichiers Java pour ce programme ?" opts={["1","2 (Invention.java + TestInvention.java)","3","Ça dépend"]} correct={1} onAns={onQ} done={done}/>
  </>)},

  // ── EXERCICE ──
  {section:"Exercice",title:"Le Catalogue d'Inventions",type:"exercise",render:(onQ,done)=>(<>
    <div style={{background:C.gold+"15",borderRadius:10,padding:14,border:`1px solid ${C.gold}40`}}>
      <div style={{fontSize:15,fontWeight:700,color:C.gold,marginBottom:4}}>Exercice — 80 Crédits R&D</div>
      <div style={{color:C.text,fontSize:13}}>Créez une classe <Ac>Catalogue</Ac> qui gère une liste d'inventions. <Strong>Faites-le SEUL !</Strong></div>
    </div>
    <div style={{color:C.text,fontSize:12,lineHeight:1.8,marginTop:10}}>
      <Strong>Classe Catalogue :</Strong><br/>
      — Attribut : <Ac>ArrayList{"<Invention>"} inventions</Ac><br/>
      — Constructeur : initialise la liste vide<br/>
      — <Ac>ajouter(Invention inv)</Ac> : ajoute + message<br/>
      — <Ac>afficherTout()</Ac> : affiche toutes les inventions<br/>
      — <Ac>rechercherParCategorie(String cat)</Ac> : retourne un ArrayList filtré<br/>
      — <Ac>trouverPlusAncienne()</Ac> : retourne l'invention la plus vieille<br/>
      — <Strong c={C.gold}>Bonus</Strong> : <Ac>supprimer(String nom)</Ac>
    </div>
    <Tip title="Indices">ArrayList : <Ac>import java.util.ArrayList;</Ac><br/>Comparer String : <Ac>.equals()</Ac> pas ==<br/>Liste vide : <Ac>.isEmpty()</Ac></Tip>
    <Quiz q="Pour stocker des Invention dans Catalogue ?" opts={["int[]","Invention[]","ArrayList<Invention>","HashMap"]} correct={2} onAns={onQ} done={done}/>
  </>)},

  // ── CORRECTION ──
  {section:"Correction",title:"Correction Catalogue",type:"correction",render:(onQ,done)=>(<>
    <div style={{background:C.success+"12",borderRadius:8,padding:10,border:`1px solid ${C.success}40`,marginBottom:8}}><div style={{fontSize:13,fontWeight:700,color:C.success}}>Correction complète</div></div>
    <Code hl={[3,5,6,7,9,10,11,12,14,15,16,17,18,19,21,22,23,24,25,26,27]} code={`import java.util.ArrayList;\npublic class Catalogue {\n    private ArrayList<Invention> inventions;\n    \n    public Catalogue() {\n        this.inventions = new ArrayList<>();\n    }\n    \n    public void ajouter(Invention inv) {\n        inventions.add(inv);\n        System.out.println("Ajouté: " + inv.getNom());\n    }\n    \n    public void afficherTout() {\n        System.out.println("=== " + inventions.size() + " inventions ===");\n        for (Invention inv : inventions) inv.afficher();\n    }\n    \n    public ArrayList<Invention> rechercherParCategorie(String cat) {\n        ArrayList<Invention> res = new ArrayList<>();\n        for (Invention inv : inventions)\n            if (inv.getCategorie().equals(cat)) res.add(inv);\n        return res;\n    }\n    \n    public Invention trouverPlusAncienne() {\n        if (inventions.isEmpty()) return null;\n        Invention old = inventions.get(0);\n        for (Invention inv : inventions)\n            if (inv.getAnnee() < old.getAnnee()) old = inv;\n        return old;\n    }\n}`}/>
    <Tip title="Points clés"><Strong>for-each</Strong> pour parcourir l'ArrayList<br/><Strong>.equals()</Strong> pour comparer les catégories<br/><Strong>.isEmpty()</Strong> avant trouverPlusAncienne (sinon erreur)<br/><Strong>return null</Strong> si aucune invention</Tip>
    <Quiz q="Pourquoi vérifier isEmpty() dans trouverPlusAncienne() ?" opts={["C'est optionnel","Pour éviter une erreur si la liste est vide (get(0) planterait)","Pour la performance","isEmpty() est toujours obligatoire"]} correct={1} onAns={onQ} done={done}/>
  </>)},
];

// ═══ MAIN ═══
export default function M03Unified(){
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
    <div style={{padding:"8px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:C.card,flexWrap:"wrap",gap:4}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:10,letterSpacing:2,color:C.dimmed}}>CODEQUEST</span><span style={{color:C.border}}>|</span><span style={{fontSize:12,fontWeight:600,color:C.accent}}>M03 · POO</span></div><div style={{display:"flex",gap:10,fontSize:11}}><span style={{color:C.muted}}>Quiz <strong style={{color:C.success}}>{score}/{totalQ}</strong></span>{gameScore!==null&&<span style={{color:C.muted}}>Jeu <strong style={{color:C.accent}}>{gameScore}</strong></span>}<span style={{color:C.muted}}>CR <strong style={{color:C.gold}}>{credits}</strong></span></div></div>
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
