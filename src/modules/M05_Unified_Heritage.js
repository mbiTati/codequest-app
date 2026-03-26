import { useState, useEffect, useCallback } from "react";

const C={bg:"#0a0f1a",card:"#111827",primary:"#0D7377",secondary:"#14A3C7",accent:"#32E0C4",gold:"#F59E0B",text:"#e2e8f0",muted:"#94a3b8",dimmed:"#64748b",border:"#1e293b",success:"#10B981",danger:"#EF4444",code:"#1E293B",codeBorder:"#2d3a4f",codeText:"#32E0C4",comment:"#6b7f99",keyword:"#c792ea",string:"#c3e88d",number:"#f78c6c",type:"#ffcb6b"};
const KEY="cq-m05-unified";
async function ld(){try{const r=await window.storage.get(KEY);return r?JSON.parse(r.value):null;}catch{return null;}}
async function sv(d){try{await window.storage.set(KEY,JSON.stringify(d));}catch{}}
function Code({code,hl=[]}){const lines=code.split("\n");return(<div style={{background:C.code,border:`1px solid ${C.codeBorder}`,borderRadius:10,overflow:"hidden",fontSize:12,fontFamily:"'JetBrains Mono',monospace",margin:"8px 0"}}><div style={{display:"flex",gap:5,padding:"5px 10px",background:"#0d1117",borderBottom:`1px solid ${C.codeBorder}`}}><span style={{width:7,height:7,borderRadius:"50%",background:"#ff5f57"}}/><span style={{width:7,height:7,borderRadius:"50%",background:"#febc2e"}}/><span style={{width:7,height:7,borderRadius:"50%",background:"#28c840"}}/></div><div style={{padding:"8px 0",overflowX:"auto"}}>{lines.map((l,i)=>(<div key={i} style={{display:"flex",padding:"1px 0",background:hl.includes(i)?C.accent+"12":"transparent",borderLeft:hl.includes(i)?`3px solid ${C.accent}`:"3px solid transparent"}}><span style={{width:32,textAlign:"right",paddingRight:8,color:C.dimmed,userSelect:"none",flexShrink:0,fontSize:10}}>{i+1}</span><span style={{color:C.codeText,whiteSpace:"pre"}}>{col(l)}</span></div>))}</div></div>);}
function col(l){return l.replace(/(\/\/.*)/, `\x01C$1\x02`).replace(/\b(public|static|void|class|int|String|double|boolean|if|else|return|new|final|for|while|private|protected|this|null|import|extends|super|abstract|override)\b/g,`\x01K$&\x02`).replace(/("(?:[^"\\]|\\.)*")/g,`\x01S$1\x02`).replace(/\b(\d+\.?\d*)\b/g,`\x01N$1\x02`).replace(/\b(System|Scanner|ArrayList|Collections)\b/g,`\x01T$1\x02`).split(/(\x01\w.*?\x02)/).map((p,i)=>{if(p.startsWith("\x01C"))return <span key={i} style={{color:C.comment,fontStyle:"italic"}}>{p.slice(2,-1)}</span>;if(p.startsWith("\x01K"))return <span key={i} style={{color:C.keyword}}>{p.slice(2,-1)}</span>;if(p.startsWith("\x01S"))return <span key={i} style={{color:C.string}}>{p.slice(2,-1)}</span>;if(p.startsWith("\x01N"))return <span key={i} style={{color:C.number}}>{p.slice(2,-1)}</span>;if(p.startsWith("\x01T"))return <span key={i} style={{color:C.type}}>{p.slice(2,-1)}</span>;return <span key={i}>{p}</span>;});}
function Quiz({q,opts,correct,onAns,done}){const[sel,setSel]=useState(null);return(<div style={{margin:"12px 0"}}><div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:6}}>{q}</div>{opts.map((o,i)=>{let bg=C.card,bc=C.border;if(done&&i===correct){bg=C.success+"20";bc=C.success;}else if(done&&sel===i){bg=C.danger+"20";bc=C.danger;}return(<button key={i} onClick={()=>{if(done)return;setSel(i);onAns(i===correct);}} style={{display:"block",width:"100%",textAlign:"left",padding:"7px 11px",marginBottom:3,borderRadius:7,border:`1px solid ${bc}`,background:bg,color:C.text,cursor:done?"default":"pointer",fontFamily:"inherit",fontSize:12}}>{String.fromCharCode(65+i)}. {o}</button>);})}{done&&<div style={{marginTop:6,padding:"6px 10px",borderRadius:6,fontSize:11,fontWeight:600,background:sel===correct?"#10B98120":"#EF444420",color:sel===correct?"#10B981":"#EF4444"}}>{sel===correct?"Correct !":"Incorrect"}</div>}</div>);}
function Task({children}){return(<div style={{background:C.primary+"15",borderRadius:8,padding:12,border:`1px solid ${C.primary}40`,margin:"10px 0"}}><div style={{fontSize:12,fontWeight:600,color:C.accent,marginBottom:4}}>A faire dans Eclipse</div><div style={{color:C.text,fontSize:12,lineHeight:1.6}}>{children}</div></div>);}
function Tip({title,children,color=C.gold}){return(<div style={{background:color+"15",borderRadius:7,padding:10,border:`1px solid ${color}40`,margin:"8px 0"}}><div style={{fontSize:11,fontWeight:600,color,marginBottom:3}}>{title}</div><div style={{color:C.text,fontSize:11,lineHeight:1.5}}>{children}</div></div>);}
function P({children}){return <p style={{color:C.muted,fontSize:13,lineHeight:1.7,marginBottom:6}}>{children}</p>;}
function Strong({children,c=C.text}){return <strong style={{color:c}}>{children}</strong>;}
function Ac({children}){return <code style={{color:C.accent,fontSize:12}}>{children}</code>;}
function Kw({children}){return <code style={{color:C.keyword,fontSize:12}}>{children}</code>;}
function An({children}){return(<div style={{background:C.secondary+"12",borderRadius:8,padding:12,border:`1px solid ${C.secondary}30`,margin:"8px 0",borderLeft:`4px solid ${C.secondary}`}}><div style={{fontSize:11,fontWeight:600,color:C.secondary,marginBottom:3}}>Analogie</div><div style={{color:C.text,fontSize:12,lineHeight:1.5}}>{children}</div></div>);}

// ═══ UML VISUAL ═══
function UMLDiagram({parent,children:kids,parentAttrs=[],parentMethods=[],childExtras=[]}){
  return(<div style={{background:C.code,borderRadius:10,padding:16,margin:"10px 0",overflow:"auto"}}>
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
      <div style={{border:`2px solid ${C.accent}`,borderRadius:8,padding:"8px 16px",minWidth:180,textAlign:"center"}}>
        <div style={{fontWeight:700,color:C.accent,fontSize:13,borderBottom:`1px solid ${C.border}`,paddingBottom:4,marginBottom:4}}>{parent}</div>
        {parentAttrs.map((a,i)=><div key={i} style={{fontSize:10,color:C.muted,fontFamily:"monospace",textAlign:"left"}}>{a}</div>)}
        {parentMethods.length>0&&<div style={{borderTop:`1px solid ${C.border}`,marginTop:4,paddingTop:4}}>{parentMethods.map((m,i)=><div key={i} style={{fontSize:10,color:C.codeText,fontFamily:"monospace",textAlign:"left"}}>{m}</div>)}</div>}
      </div>
      <div style={{width:2,height:20,background:C.border}}/>
      <div style={{fontSize:10,color:C.dimmed}}>extends</div>
      <div style={{width:2,height:10,background:C.border}}/>
      <div style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center"}}>
        {kids.map((kid,i)=>(
          <div key={i} style={{border:`1px solid ${C.gold}`,borderRadius:8,padding:"8px 12px",minWidth:140,textAlign:"center"}}>
            <div style={{fontWeight:700,color:C.gold,fontSize:12,borderBottom:`1px solid ${C.border}`,paddingBottom:3,marginBottom:3}}>{kid}</div>
            {childExtras[i]&&childExtras[i].map((e,j)=><div key={j} style={{fontSize:10,color:C.muted,fontFamily:"monospace",textAlign:"left"}}>{e}</div>)}
          </div>
        ))}
      </div>
    </div>
  </div>);
}

// ═══ GAME: HERITAGE QUIZ ═══
function HeritageGame({onComplete}){
  const QS=[
    {q:"Quel mot-clé pour hériter ?",opts:[{t:"implements",ok:false},{t:"extends",ok:true},{t:"inherits",ok:false},{t:"super",ok:false}]},
    {q:"Que fait super(nom) dans le constructeur enfant ?",opts:[{t:"Crée un nouvel objet",ok:false},{t:"Appelle le constructeur du parent",ok:true},{t:"Retourne le nom du parent",ok:false}]},
    {q:"Un attribut 'protected' est accessible où ?",opts:[{t:"Partout",ok:false},{t:"Seulement dans la classe",ok:false},{t:"Dans la classe + ses enfants",ok:true},{t:"Nulle part",ok:false}]},
    {q:"Si Chien extends Animal, et Animal a manger(), le Chien peut-il appeler manger() ?",opts:[{t:"Non, il faut la réécrire",ok:false},{t:"Oui, il en hérite automatiquement",ok:true},{t:"Seulement si manger() est static",ok:false}]},
    {q:"Overriding signifie :",opts:[{t:"Créer une nouvelle méthode",ok:false},{t:"Réécrire une méthode du parent avec le même nom",ok:true},{t:"Supprimer une méthode du parent",ok:false}]},
    {q:"Quel est le résultat ?\nAnimal a = new Chien();\na.faireSon();",opts:[{t:"Le son de Animal",ok:false},{t:"Le son de Chien (polymorphisme)",ok:true},{t:"Erreur de compilation",ok:false}]},
  ];
  const[idx,setIdx]=useState(0);const[score,setScore]=useState(0);const[sel,setSel]=useState(null);const[answered,setAnswered]=useState(false);
  const q=QS[idx];
  const answer=(i)=>{if(answered)return;setSel(i);setAnswered(true);if(q.opts[i].ok)setScore(s=>s+20);};
  const next=()=>{if(idx+1>=QS.length){onComplete(score+(sel!==null&&q.opts[sel].ok?20:0));return;}setIdx(n=>n+1);setSel(null);setAnswered(false);};
  return(<div style={{background:C.card,borderRadius:12,padding:14,border:`1px solid ${C.border}`,margin:"10px 0"}}>
    <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:6}}><span style={{color:C.dimmed}}>Question {idx+1}/{QS.length}</span><span style={{color:C.gold,fontWeight:700}}>Score: {score}</span></div>
    <div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:8,whiteSpace:"pre-wrap"}}>{q.q}</div>
    {q.opts.map((o,i)=>{let bg=C.code,bc=C.codeBorder;if(answered&&o.ok){bg=C.success+"20";bc=C.success;}else if(answered&&sel===i&&!o.ok){bg=C.danger+"20";bc=C.danger;}
    return(<button key={i} onClick={()=>answer(i)} style={{display:"block",width:"100%",textAlign:"left",padding:"8px 12px",marginBottom:4,borderRadius:7,border:`1px solid ${bc}`,background:bg,color:C.text,cursor:answered?"default":"pointer",fontFamily:"inherit",fontSize:12}}>{o.t}</button>);})}
    {answered&&<button onClick={next} style={{width:"100%",marginTop:6,padding:"8px",borderRadius:7,border:"none",background:C.accent,color:C.bg,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600}}>{idx+1>=QS.length?"Terminer":"Suivant →"}</button>}
  </div>);
}

function Memo(){return(<div style={{background:C.card,borderRadius:12,padding:20,border:`1px solid ${C.gold}40`}}>
  <div style={{fontSize:16,fontWeight:700,color:C.gold,marginBottom:12}}>Mémo débloqué — Héritage Java</div>
  <div style={{background:C.code,borderRadius:8,padding:10,marginBottom:8}}>
    <pre style={{margin:0,fontSize:10,color:C.codeText,fontFamily:"monospace"}}>{"public class Enfant extends Parent {\n    public Enfant(String nom, int extra) {\n        super(nom);  // appelle constructeur Parent\n        this.extra = extra;\n    }\n    @Override\n    public void methode() {\n        // version enfant\n    }\n}"}</pre>
  </div>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
    <div style={{background:C.danger+"15",borderRadius:6,padding:6}}><div style={{fontSize:10,fontWeight:600,color:C.danger}}>private</div><div style={{fontSize:9,color:C.muted}}>Que la classe</div></div>
    <div style={{background:C.gold+"15",borderRadius:6,padding:6}}><div style={{fontSize:10,fontWeight:600,color:C.gold}}>protected</div><div style={{fontSize:9,color:C.muted}}>Classe + enfants</div></div>
    <div style={{background:C.success+"15",borderRadius:6,padding:6}}><div style={{fontSize:10,fontWeight:600,color:C.success}}>public</div><div style={{fontSize:9,color:C.muted}}>Partout</div></div>
  </div>
  <div style={{marginTop:8,background:C.code,borderRadius:6,padding:8}}>
    <div style={{fontSize:10,color:C.muted}}><Strong c={C.accent}>super()</Strong> = appeler le constructeur parent · <Strong c={C.accent}>@Override</Strong> = réécrire une méthode · <Strong c={C.accent}>Polymorphisme</Strong> = Animal a = new Chien(); a.faireSon() → son du Chien</div>
  </div>
</div>);}

const STEPS=[
  {section:"Théorie",title:"Pourquoi l'héritage ?",type:"theory",render:(onQ,done)=>(<>
    <P>Imaginez : vous avez une classe <Ac>Invention</Ac>. Maintenant vous voulez des <Strong c={C.accent}>types spécialisés</Strong> : InventionMécanique, InventionLogicielle, InventionÉlectronique. Elles ont toutes nom, inventeur, année — mais chacune a des <Strong>attributs en plus</Strong>.</P>
    <An>C'est comme une fiche de base du Labo + des fiches spécialisées. La fiche de base a les champs communs (nom, date). La fiche "Mécanique" ajoute "nombre de pièces". La fiche "Logicielle" ajoute "langage". On ne recopie pas les champs communs — on les <Strong c={C.accent}>hérite</Strong>.</An>
    <P><Kw>extends</Kw> signifie "hérite de". La classe enfant <Strong>récupère automatiquement</Strong> tous les attributs et méthodes du parent.</P>
    <UMLDiagram parent="Invention" children={["InvMecanique","InvLogicielle"]} parentAttrs={["- nom: String","- annee: int"]} parentMethods={["+getNom(): String","+getAnnee(): int","+afficher(): void"]} childExtras={[["- nbPieces: int","+getNbPieces(): int"],["- langage: String","+getLangage(): String"]]}/>
    <Quiz q="Que signifie 'extends' en Java ?" opts={["Agrandir une classe","Hériter d'une classe parent","Copier une classe","Supprimer une classe"]} correct={1} onAns={onQ} done={done}/>
  </>)},
  {section:"Théorie",title:"extends et super()",type:"theory",render:(onQ,done)=>(<>
    <P>La classe parent :</P>
    <Code hl={[0,1,2,3,4,5,6]} code={`public class Invention {\n    private String nom;\n    private int annee;\n    public Invention(String nom, int annee) {\n        this.nom = nom;\n        this.annee = annee;\n    }\n    public String getNom() { return nom; }\n    public int getAnnee() { return annee; }\n    public void afficher() {\n        System.out.println(nom + " (" + annee + ")");\n    }\n}`}/>
    <P>La classe enfant :</P>
    <Code hl={[0,3,4,5]} code={`public class InvMecanique extends Invention {\n    private int nbPieces;\n    \n    public InvMecanique(String nom, int annee, int nbPieces) {\n        super(nom, annee);       // appelle le constructeur parent\n        this.nbPieces = nbPieces; // attribut propre à l'enfant\n    }\n    \n    public int getNbPieces() { return nbPieces; }\n}`}/>
    <Tip title="super() est OBLIGATOIRE" color={C.danger}>Si le parent a un constructeur avec paramètres, l'enfant DOIT appeler <Ac>super(...)</Ac> en première ligne de son constructeur. Sinon → erreur de compilation !</Tip>
    <Code code={`// Utilisation\nInvMecanique m = new InvMecanique("Horloge", 1656, 150);\nm.afficher();       // "Horloge (1656)" → méthode HÉRITÉE !\nm.getNbPieces();    // 150 → méthode propre\nm.getNom();         // "Horloge" → getter HÉRITÉ !`}/>
    <Task>1. Créez <Ac>Invention.java</Ac> (parent)<br/>2. Créez <Ac>InvMecanique.java</Ac> avec <Kw>extends</Kw><br/>3. Dans le main, créez un InvMecanique et appelez <Ac>afficher()</Ac> — ça marche sans l'écrire !<br/>4. <Strong c={C.danger}>Essayez d'enlever super()</Strong> → observez l'erreur</Task>
    <Quiz q="Que se passe-t-il si on oublie super() dans le constructeur enfant ?" opts={["Rien","Erreur de compilation","Le parent est ignoré","Les attributs sont null"]} correct={1} onAns={onQ} done={done}/>
  </>)},
  {section:"Théorie",title:"protected et visibilité",type:"theory",render:(onQ,done)=>(<>
    <P>Rappel des 3 niveaux de visibilité :</P>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,margin:"8px 0"}}>
      <div style={{background:C.danger+"15",borderRadius:7,padding:8,border:`1px solid ${C.danger}30`}}><div style={{fontWeight:700,color:C.danger,fontSize:12}}>private</div><div style={{color:C.muted,fontSize:10}}>Que dans la classe elle-même</div><div style={{color:C.dimmed,fontSize:10,marginTop:4}}>Enfants : NON</div></div>
      <div style={{background:C.gold+"15",borderRadius:7,padding:8,border:`1px solid ${C.gold}30`}}><div style={{fontWeight:700,color:C.gold,fontSize:12}}>protected</div><div style={{color:C.muted,fontSize:10}}>Classe + ses enfants</div><div style={{color:C.dimmed,fontSize:10,marginTop:4}}>Enfants : OUI</div></div>
      <div style={{background:C.success+"15",borderRadius:7,padding:8,border:`1px solid ${C.success}30`}}><div style={{fontWeight:700,color:C.success,fontSize:12}}>public</div><div style={{color:C.muted,fontSize:10}}>Tout le monde</div><div style={{color:C.dimmed,fontSize:10,marginTop:4}}>Enfants : OUI</div></div>
    </div>
    <Code hl={[1,2]} code={`public class Invention {\n    protected String nom;  // accessible par les enfants\n    private int secret;    // PAS accessible par les enfants\n}\n\npublic class InvMecanique extends Invention {\n    public void test() {\n        System.out.println(nom);    // [OK] protected = OK\n        System.out.println(secret); // [ERREUR] private = ERREUR\n    }\n}`}/>
    <Tip title="Quand utiliser protected ?">Quand un enfant a <Strong>besoin d'accéder directement</Strong> à l'attribut (pas juste via getter). Typiquement quand l'enfant doit modifier la valeur dans une méthode redéfinie. En général, <Strong>private + getter</Strong> reste le défaut sûr.</Tip>
    <Task>1. Mettez <Kw>nom</Kw> en <Kw>protected</Kw> dans Invention<br/>2. Dans InvMecanique, accédez directement à <Ac>nom</Ac> → ça marche<br/>3. Remettez en <Kw>private</Kw> → erreur → utilisez <Ac>getNom()</Ac> à la place</Task>
    <Quiz q="Un attribut private du parent est-il accessible dans l'enfant ?" opts={["Oui toujours","Non, il faut utiliser les getters du parent","Oui si on écrit this.attribut","Oui si on écrit super.attribut"]} correct={1} onAns={onQ} done={done}/>
  </>)},
  {section:"Théorie",title:"Override et polymorphisme",type:"theory",render:(onQ,done)=>(<>
    <P><Strong c={C.accent}>Override</Strong> = réécrire une méthode du parent. L'enfant garde le même nom mais change le comportement.</P>
    <Code hl={[2,3,4,9,10,11,12]} code={`public class Invention {\n    // ...\n    public void afficher() {\n        System.out.println(nom + " (" + annee + ")");\n    }\n}\n\npublic class InvMecanique extends Invention {\n    // ...\n    @Override   // annotation recommandée\n    public void afficher() {\n        super.afficher();  // appelle la version parent d'abord\n        System.out.println("Pièces: " + nbPieces);\n    }\n}`}/>
    <P><Strong c={C.gold}>Polymorphisme</Strong> = un objet enfant peut être utilisé comme un parent :</P>
    <Code hl={[0,1,2]} code={`Invention inv = new InvMecanique("Horloge", 1656, 150);\ninv.afficher();  // appelle la version InvMecanique !\n// Java choisit la VRAIE classe de l'objet, pas le type de la variable`}/>
    <An>C'est comme un employé qui a le badge "Inventeur" (type parent) mais qui est en réalité un "Inventeur Mécanique" (type réel). Quand on lui demande de présenter son travail, il présente comme un mécanicien, pas comme un inventeur générique.</An>
    <Task>1. Ajoutez <Ac>@Override afficher()</Ac> dans InvMecanique<br/>2. Appelez <Ac>super.afficher()</Ac> dedans puis ajoutez les pièces<br/>3. Testez : <Ac>Invention i = new InvMecanique(...);</Ac> → <Ac>i.afficher()</Ac><br/>4. Constatez : c'est la version InvMecanique qui s'exécute !</Task>
    <Quiz q="Invention i = new InvMecanique(...); i.afficher(); → quelle version ?" opts={["Celle de Invention","Celle de InvMecanique (polymorphisme)","Erreur","Les deux"]} correct={1} onAns={onQ} done={done}/>
  </>)},

  // ── JEU ──
  {section:"Défi",title:"Quiz Héritage",type:"game",render:(_,__,onGC)=>(<>
    <P>6 questions pour tester votre compréhension de l'héritage, super, protected et polymorphisme.</P>
    <HeritageGame onComplete={onGC}/>
  </>)},

  // ── CODE GUIDÉ ──
  {section:"Code guidé",title:"Hiérarchie Véhicule pas à pas",type:"guided",render:(onQ,done)=>(<>
    <P>Construisons une hiérarchie complète : Véhicule → Voiture + Moto.</P>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:6,marginBottom:3}}>Étape 1 : Classe parent Vehicule</div>
    <Code code={`public class Vehicule {\n    private String marque;\n    protected int vitesse;  // protected : les enfants en ont besoin\n    \n    public Vehicule(String marque) {\n        this.marque = marque;\n        this.vitesse = 0;\n    }\n    public String getMarque() { return marque; }\n    public int getVitesse() { return vitesse; }\n    \n    public void accelerer() {\n        vitesse += 10;\n        System.out.println(marque + " accélère: " + vitesse + " km/h");\n    }\n    public void freiner() {\n        if (vitesse >= 10) vitesse -= 10;\n        System.out.println(marque + " freine: " + vitesse + " km/h");\n    }\n}`}/>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:6,marginBottom:3}}>Étape 2 : Voiture (override accelerer)</div>
    <Code hl={[4,5,6,7,8]} code={`public class Voiture extends Vehicule {\n    private int nbPortes;\n    public Voiture(String marque, int nbPortes) {\n        super(marque);  // appelle Vehicule(marque)\n        this.nbPortes = nbPortes;\n    }\n    @Override\n    public void accelerer() {\n        if (vitesse < 200) {  // vitesse est protected → accessible !\n            vitesse += 15;    // voiture accélère plus vite\n            System.out.println(getMarque() + " (voiture): " + vitesse);\n        } else System.out.println("Vitesse max atteinte !");\n    }\n}`}/>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:6,marginBottom:3}}>Étape 3 : Moto (override différent)</div>
    <Code code={`public class Moto extends Vehicule {\n    private boolean aCoffre;\n    public Moto(String marque, boolean aCoffre) {\n        super(marque);\n        this.aCoffre = aCoffre;\n    }\n    @Override\n    public void accelerer() {\n        if (vitesse < 250) {  // moto va plus vite !\n            vitesse += 20;\n            System.out.println(getMarque() + " (moto): " + vitesse);\n        }\n    }\n}`}/>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:6,marginBottom:3}}>Étape 4 : Test avec polymorphisme</div>
    <Code hl={[1,2,5,6,7]} code={`public class TestVehicules {\n    public static void main(String[] args) {\n        Vehicule[] garage = {\n            new Voiture("Toyota", 4),\n            new Moto("Yamaha", false),\n            new Voiture("BMW", 2)\n        };\n        // Polymorphisme : chaque véhicule accélère à sa façon\n        for (Vehicule v : garage) {\n            v.accelerer();\n            v.accelerer();\n        }\n    }\n}`}/>
    <Task>Tapez les 4 fichiers. Exécutez TestVehicules.<br/><Strong>Observez :</Strong> chaque véhicule accélère différemment malgré le même appel v.accelerer() !</Task>
    <Quiz q="Pourquoi vitesse est protected et pas private dans Vehicule ?" opts={["C'est obligatoire","Pour que Voiture et Moto puissent modifier vitesse directement","protected est plus rapide","Il n'y a pas de raison"]} correct={1} onAns={onQ} done={done}/>
  </>)},

  // ── EXERCICE ──
  {section:"Exercice",title:"Hiérarchie Employés du Labo",type:"exercise",render:(onQ,done)=>(<>
    <div style={{background:C.gold+"15",borderRadius:10,padding:14,border:`1px solid ${C.gold}40`}}>
      <div style={{fontSize:15,fontWeight:700,color:C.gold,marginBottom:4}}>Exercice — 80 Crédits R&D</div>
      <div style={{color:C.text,fontSize:13}}>Créez une hiérarchie : Employe → Ingenieur + Technicien + Stagiaire.</div>
    </div>
    <UMLDiagram parent="Employe" children={["Ingenieur","Technicien","Stagiaire"]} parentAttrs={["# nom: String","# salaire: double"]} parentMethods={["+calculerPrime(): double","+afficher(): void"]} childExtras={[["- specialite: String","@Override calculerPrime()"],["- niveau: int","@Override calculerPrime()"],["- ecole: String","@Override calculerPrime()"]]}/>
    <div style={{color:C.text,fontSize:12,lineHeight:1.8,marginTop:8}}>
      <Strong>Règles métier :</Strong><br/>
      — Ingénieur : prime = 15% du salaire<br/>
      — Technicien : prime = 10% × niveau (1-5)<br/>
      — Stagiaire : prime = 200 CHF fixe<br/>
      — <Ac>afficher()</Ac> : override pour montrer les infos spécifiques<br/>
      — <Strong c={C.gold}>Bonus</Strong> : créer un ArrayList{"<Employe>"} et calculer le total des primes (polymorphisme)
    </div>
    <Quiz q="Si Ingenieur override calculerPrime(), quel type pour la variable ?" opts={["Ingenieur i = new Ingenieur(...)","Employe e = new Ingenieur(...) — les deux marchent grâce au polymorphisme","Seul Employe marche","Seul Ingenieur marche"]} correct={1} onAns={onQ} done={done}/>
  </>)},

  // ── CORRECTION ──
  {section:"Correction",title:"Correction Employés",type:"correction",render:(onQ,done)=>(<>
    <div style={{background:C.success+"12",borderRadius:8,padding:10,border:`1px solid ${C.success}40`,marginBottom:8}}><div style={{fontSize:13,fontWeight:700,color:C.success}}>Correction</div></div>
    <Code code={`public class Employe {\n    protected String nom;\n    protected double salaire;\n    public Employe(String nom, double salaire) {\n        this.nom = nom; this.salaire = salaire;\n    }\n    public double calculerPrime() { return 0; }\n    public void afficher() {\n        System.out.println(nom + " | Salaire: " + salaire\n            + " | Prime: " + calculerPrime());\n    }\n}`}/>
    <Code code={`public class Ingenieur extends Employe {\n    private String specialite;\n    public Ingenieur(String nom, double sal, String spec) {\n        super(nom, sal); this.specialite = spec;\n    }\n    @Override\n    public double calculerPrime() { return salaire * 0.15; }\n    @Override\n    public void afficher() {\n        super.afficher();\n        System.out.println("  Spécialité: " + specialite);\n    }\n}`}/>
    <Code code={`public class Technicien extends Employe {\n    private int niveau;\n    public Technicien(String nom, double sal, int niv) {\n        super(nom, sal); this.niveau = niv;\n    }\n    @Override\n    public double calculerPrime() { return salaire * 0.10 * niveau; }\n}\n\npublic class Stagiaire extends Employe {\n    private String ecole;\n    public Stagiaire(String nom, double sal, String ecole) {\n        super(nom, sal); this.ecole = ecole;\n    }\n    @Override\n    public double calculerPrime() { return 200; }\n}`}/>
    <Code hl={[2,3,4,5,7,8,9]} code={`// Test avec polymorphisme\npublic class TestLabo {\n    public static void main(String[] args) {\n        ArrayList<Employe> equipe = new ArrayList<>();\n        equipe.add(new Ingenieur("Marie", 8000, "IA"));\n        equipe.add(new Technicien("Paul", 5000, 3));\n        equipe.add(new Stagiaire("Léa", 2000, "HEIG"));\n        \n        double totalPrimes = 0;\n        for (Employe e : equipe) {\n            e.afficher();  // polymorphisme !\n            totalPrimes += e.calculerPrime();\n        }\n        System.out.println("Total primes: " + totalPrimes);\n    }\n}`}/>
    <Tip title="Polymorphisme en action">La boucle <Ac>for(Employe e : equipe)</Ac> traite tous les employés de la même façon, mais <Ac>calculerPrime()</Ac> retourne un résultat différent pour chaque type. C'est la puissance de l'héritage + override.</Tip>
    <Quiz q="Dans la boucle, e.calculerPrime() appelle quelle version ?" opts={["Toujours Employe (0)","Celle de la vraie classe de l'objet (Ingenieur/Technicien/Stagiaire)","Aléatoire","La dernière ajoutée"]} correct={1} onAns={onQ} done={done}/>
  </>)},
];

// ═══ MAIN ═══
export default function M05Unified(){
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
    <div style={{padding:"8px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:C.card,flexWrap:"wrap",gap:4}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:10,letterSpacing:2,color:C.dimmed}}>CODEQUEST</span><span style={{color:C.border}}>|</span><span style={{fontSize:12,fontWeight:600,color:C.accent}}>M05 · Héritage</span></div><div style={{display:"flex",gap:10,fontSize:11}}><span style={{color:C.muted}}>Quiz <strong style={{color:C.success}}>{score}/{totalQ}</strong></span>{gameScore!==null&&<span style={{color:C.muted}}>Jeu <strong style={{color:C.accent}}>{gameScore}</strong></span>}<span style={{color:C.muted}}>CR <strong style={{color:C.gold}}>{credits}</strong></span></div></div>
    <div style={{display:"flex",maxWidth:1100,margin:"0 auto",minHeight:"calc(100vh - 42px)"}}>
      <div style={{width:200,borderRight:`1px solid ${C.border}`,padding:"10px 0",flexShrink:0,overflowY:"auto",display:"flex",flexDirection:"column"}}>
        {sections.map(sec=>{const sts=STEPS.map((s,i)=>({...s,idx:i})).filter(s=>s.section===sec);return(<div key={sec}><div style={{padding:"5px 12px",fontSize:9,letterSpacing:1,color:secC[sec]||C.dimmed,fontWeight:700,textTransform:"uppercase"}}>{sec}</div>{sts.map(s=>{const c2=s.idx===step,dn=!!completed[s.idx];return(<button key={s.idx} onClick={()=>{setStep(s.idx);persist(completed,score,totalQ,credits,gameScore,s.idx);}} style={{display:"flex",alignItems:"center",gap:5,width:"100%",padding:"4px 12px 4px 20px",border:"none",background:c2?C.accent+"12":"transparent",borderLeft:c2?`2px solid ${C.accent}`:"2px solid transparent",cursor:"pointer",fontFamily:"inherit",fontSize:11,color:c2?C.accent:dn?C.success:C.muted,textAlign:"left"}}><span style={{fontSize:8}}>{dn?"✓":"○"}</span>{s.title}</button>);})}</div>);})}
        <div style={{padding:10,marginTop:"auto"}}><div style={{height:3,background:C.border,borderRadius:2,overflow:"hidden",marginBottom:6}}><div style={{width:`${(Object.keys(completed).length/STEPS.length)*100}%`,height:"100%",background:`linear-gradient(90deg,${C.primary},${C.accent})`,borderRadius:2,transition:"width .5s"}}/></div>
        <button onClick={()=>allDone&&setShowMemo(!showMemo)} style={{width:"100%",padding:"8px",borderRadius:8,border:`1px solid ${allDone?C.gold:C.border}`,background:allDone?C.gold+"15":"transparent",color:allDone?C.gold:C.dimmed,cursor:allDone?"pointer":"default",fontFamily:"inherit",fontSize:11,fontWeight:600,opacity:allDone?1:0.5}}>{allDone?"25C9 Memo":"25CB Memo"}</button></div>
      </div>
      <div style={{flex:1,padding:"16px 24px",overflowY:"auto",maxHeight:"calc(100vh - 42px)"}}>{showMemo&&allDone?<Memo/>:(<div key={step} style={{animation:"fadeIn .25s"}}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}><span style={{fontSize:9,padding:"2px 8px",borderRadius:10,background:(secC[cur.section]||C.dimmed)+"20",color:secC[cur.section]||C.dimmed,fontWeight:600,letterSpacing:1}}>{cur.section.toUpperCase()}</span></div><h2 style={{fontSize:18,fontWeight:700,marginBottom:12}}>{cur.title}</h2>{cur.type==="game"?cur.render(handleQuiz,isDone,handleGC):cur.render(handleQuiz,isDone)}<div style={{display:"flex",justifyContent:"space-between",marginTop:24,paddingTop:10,borderTop:`1px solid ${C.border}`}}><button onClick={()=>go(-1)} disabled={step===0} style={{padding:"7px 16px",borderRadius:7,border:`1px solid ${C.border}`,background:"transparent",color:step===0?C.border:C.muted,cursor:step===0?"default":"pointer",fontFamily:"inherit",fontSize:12}}>←</button><button onClick={()=>go(1)} disabled={step===STEPS.length-1} style={{padding:"7px 16px",borderRadius:7,border:"none",background:step===STEPS.length-1?C.border:C.accent,color:step===STEPS.length-1?C.muted:C.bg,cursor:step===STEPS.length-1?"default":"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600}}>{step===STEPS.length-1?"Fin":"→"}</button></div></div>)}</div>
    </div>
  </div>);
}
