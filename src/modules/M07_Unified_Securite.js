import { useState, useEffect, useCallback } from "react";

const C={bg:"#0a0f1a",card:"#111827",primary:"#0D7377",secondary:"#14A3C7",accent:"#32E0C4",gold:"#F59E0B",text:"#e2e8f0",muted:"#94a3b8",dimmed:"#64748b",border:"#1e293b",success:"#10B981",danger:"#EF4444",code:"#1E293B",codeBorder:"#2d3a4f",codeText:"#32E0C4",comment:"#6b7f99",keyword:"#c792ea",string:"#c3e88d",number:"#f78c6c",type:"#ffcb6b"};
const KEY="cq-m07-unified";
async function ld(){try{const r=await window.storage.get(KEY);return r?JSON.parse(r.value):null;}catch{return null;}}
async function sv(d){try{await window.storage.set(KEY,JSON.stringify(d));}catch{}}
function Code({code,hl=[]}){const lines=code.split("\n");return(<div style={{background:C.code,border:`1px solid ${C.codeBorder}`,borderRadius:10,overflow:"hidden",fontSize:12,fontFamily:"'JetBrains Mono',monospace",margin:"8px 0"}}><div style={{display:"flex",gap:5,padding:"5px 10px",background:"#0d1117",borderBottom:`1px solid ${C.codeBorder}`}}><span style={{width:7,height:7,borderRadius:"50%",background:"#ff5f57"}}/><span style={{width:7,height:7,borderRadius:"50%",background:"#febc2e"}}/><span style={{width:7,height:7,borderRadius:"50%",background:"#28c840"}}/></div><div style={{padding:"8px 0",overflowX:"auto"}}>{lines.map((l,i)=>(<div key={i} style={{display:"flex",padding:"1px 0",background:hl.includes(i)?C.accent+"12":"transparent",borderLeft:hl.includes(i)?`3px solid ${C.accent}`:"3px solid transparent"}}><span style={{width:32,textAlign:"right",paddingRight:8,color:C.dimmed,userSelect:"none",flexShrink:0,fontSize:10}}>{i+1}</span><span style={{color:C.codeText,whiteSpace:"pre"}}>{col(l)}</span></div>))}</div></div>);}
function col(l){return l.replace(/(\/\/.*)/, `\x01C$1\x02`).replace(/\b(public|static|void|class|int|String|double|boolean|if|else|return|new|final|for|while|private|protected|this|null|import|try|catch|finally|throw|throws|extends)\b/g,`\x01K$&\x02`).replace(/("(?:[^"\\]|\\.)*")/g,`\x01S$1\x02`).replace(/\b(\d+\.?\d*)\b/g,`\x01N$1\x02`).replace(/\b(System|Scanner|ArrayList|Exception|NullPointerException|NumberFormatException|ArrayIndexOutOfBoundsException|IllegalArgumentException)\b/g,`\x01T$1\x02`).split(/(\x01\w.*?\x02)/).map((p,i)=>{if(p.startsWith("\x01C"))return <span key={i} style={{color:C.comment,fontStyle:"italic"}}>{p.slice(2,-1)}</span>;if(p.startsWith("\x01K"))return <span key={i} style={{color:C.keyword}}>{p.slice(2,-1)}</span>;if(p.startsWith("\x01S"))return <span key={i} style={{color:C.string}}>{p.slice(2,-1)}</span>;if(p.startsWith("\x01N"))return <span key={i} style={{color:C.number}}>{p.slice(2,-1)}</span>;if(p.startsWith("\x01T"))return <span key={i} style={{color:C.type}}>{p.slice(2,-1)}</span>;return <span key={i}>{p}</span>;});}
function Quiz({q,opts,correct,onAns,done}){const[sel,setSel]=useState(null);return(<div style={{margin:"12px 0"}}><div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:6}}>{q}</div>{opts.map((o,i)=>{let bg=C.card,bc=C.border;if(done&&i===correct){bg=C.success+"20";bc=C.success;}else if(done&&sel===i){bg=C.danger+"20";bc=C.danger;}return(<button key={i} onClick={()=>{if(done)return;setSel(i);onAns(i===correct);}} style={{display:"block",width:"100%",textAlign:"left",padding:"7px 11px",marginBottom:3,borderRadius:7,border:`1px solid ${bc}`,background:bg,color:C.text,cursor:done?"default":"pointer",fontFamily:"inherit",fontSize:12}}>{String.fromCharCode(65+i)}. {o}</button>);})}</div>);}
function Task({children}){return(<div style={{background:C.primary+"15",borderRadius:8,padding:12,border:`1px solid ${C.primary}40`,margin:"10px 0"}}><div style={{fontSize:12,fontWeight:600,color:C.accent,marginBottom:4}}>A faire dans Eclipse</div><div style={{color:C.text,fontSize:12,lineHeight:1.6}}>{children}</div></div>);}
function Tip({title,children,color=C.gold}){return(<div style={{background:color+"15",borderRadius:7,padding:10,border:`1px solid ${color}40`,margin:"8px 0"}}><div style={{fontSize:11,fontWeight:600,color,marginBottom:3}}>{title}</div><div style={{color:C.text,fontSize:11,lineHeight:1.5}}>{children}</div></div>);}
function P({children}){return <p style={{color:C.muted,fontSize:13,lineHeight:1.7,marginBottom:6}}>{children}</p>;}
function Strong({children,c=C.text}){return <strong style={{color:c}}>{children}</strong>;}
function Ac({children}){return <code style={{color:C.accent,fontSize:12}}>{children}</code>;}
function Kw({children}){return <code style={{color:C.keyword,fontSize:12}}>{children}</code>;}

// ═══ GAME: SECURITY SCANNER ═══
function SecurityGame({onComplete}){
  const VULNS=[
    {code:`String query = "SELECT * FROM users WHERE name='" + input + "'";`,vuln:"SQL Injection",fix:"Utiliser PreparedStatement avec des ? au lieu de concaténer",severity:"critical"},
    {code:`System.out.println("Mot de passe: " + password);`,vuln:"Exposition de données sensibles",fix:"Ne jamais afficher de mots de passe dans les logs",severity:"high"},
    {code:`int age = Integer.parseInt(input);\n// Pas de try-catch`,vuln:"Crash si l'input n'est pas un nombre",fix:"Entourer de try-catch(NumberFormatException)",severity:"medium"},
    {code:`String nom = utilisateur.getNom().toUpperCase();`,vuln:"NullPointerException si utilisateur ou getNom() est null",fix:"Vérifier != null avant d'appeler des méthodes",severity:"high"},
    {code:`int[] tab = new int[10];\nSystem.out.println(tab[15]);`,vuln:"ArrayIndexOutOfBoundsException",fix:"Vérifier que l'index < tab.length",severity:"medium"},
    {code:`Scanner sc = new Scanner(new File("data.txt"));\n// Pas de close() ni try-with-resources`,vuln:"Fuite de ressources (le fichier reste ouvert)",fix:"Utiliser try-with-resources ou finally { sc.close(); }",severity:"medium"},
    {code:`public void setAge(int age) {\n    this.age = age;  // Pas de validation\n}`,vuln:"Données invalides acceptées (age = -5 ou age = 9999)",fix:"Valider : if (age >= 0 && age <= 150)",severity:"low"},
    {code:`String password = "admin123";  // En dur dans le code`,vuln:"Mot de passe en dur dans le code source",fix:"Stocker dans un fichier de config ou variable d'environnement",severity:"critical"},
  ];
  const[idx,setIdx]=useState(0);const[found,setFound]=useState(false);const[score,setScore]=useState(0);const[showFix,setShowFix]=useState(false);
  const v=VULNS[idx];const sevColors={critical:C.danger,high:"#F97316",medium:C.gold,low:C.muted};
  const find=()=>{if(found)return;setFound(true);const pts={critical:25,high:20,medium:15,low:10}[v.severity];setScore(s=>s+pts);};
  const next=()=>{if(idx+1>=VULNS.length){onComplete(score);return;}setIdx(i=>i+1);setFound(false);setShowFix(false);};
  return(<div style={{background:C.card,borderRadius:12,padding:14,border:`1px solid ${C.border}`,margin:"10px 0"}}>
    <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:6}}><span style={{color:C.dimmed}}>Faille {idx+1}/{VULNS.length}</span><span style={{color:C.gold,fontWeight:700}}>Score: {score}</span></div>
    <div style={{background:C.code,borderRadius:8,padding:12,fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:C.codeText,whiteSpace:"pre-wrap",marginBottom:8,border:`1px solid ${found?sevColors[v.severity]+"50":C.codeBorder}`}}>{v.code}</div>
    {!found?(<button onClick={find} style={{width:"100%",padding:"10px",borderRadius:8,border:"none",background:C.danger,color:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:700}}>Signaler la vulnérabilité</button>):(
      <div style={{animation:"fadeIn .3s"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
          <span style={{padding:"3px 10px",borderRadius:6,background:sevColors[v.severity]+"20",color:sevColors[v.severity],fontSize:10,fontWeight:700}}>{v.severity.toUpperCase()}</span>
          <span style={{fontSize:13,fontWeight:600,color:C.text}}>{v.vuln}</span>
        </div>
        <button onClick={()=>setShowFix(!showFix)} style={{padding:"4px 10px",borderRadius:5,border:`1px solid ${C.border}`,background:"transparent",color:C.accent,cursor:"pointer",fontFamily:"inherit",fontSize:11,marginBottom:6}}>{showFix?"Masquer":"Voir"} la correction</button>
        {showFix&&<div style={{background:C.success+"10",borderRadius:6,padding:8,fontSize:11,color:C.success,border:`1px solid ${C.success}30`}}>{v.fix}</div>}
        <button onClick={next} style={{width:"100%",marginTop:6,padding:"8px",borderRadius:7,border:"none",background:C.accent,color:C.bg,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600}}>{idx+1>=VULNS.length?"Terminer":"Suivant →"}</button>
      </div>
    )}
  </div>);
}

function Memo(){return(<div style={{background:C.card,borderRadius:12,padding:20,border:`1px solid ${C.gold}40`}}>
  <div style={{fontSize:16,fontWeight:700,color:C.gold,marginBottom:12}}>Mémo débloqué — Sécurité Java</div>
  <div style={{background:C.code,borderRadius:8,padding:10,marginBottom:8}}>
    <pre style={{margin:0,fontSize:10,color:C.codeText,fontFamily:"monospace"}}>{"try {\n    // code risqué\n    int n = Integer.parseInt(input);\n} catch (NumberFormatException e) {\n    System.out.println(\"Pas un nombre !\");\n} catch (Exception e) {\n    System.out.println(\"Erreur: \" + e.getMessage());\n} finally {\n    // toujours exécuté (fermer ressources)\n}"}</pre>
  </div>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
    <div style={{background:C.danger+"15",borderRadius:6,padding:8}}><div style={{fontSize:10,fontWeight:600,color:C.danger}}>Toujours vérifier</div><div style={{fontSize:9,color:C.muted}}>null avant .method() · index {"<"} length · input valide avant parseInt · ressources fermées</div></div>
    <div style={{background:C.success+"15",borderRadius:6,padding:8}}><div style={{fontSize:10,fontWeight:600,color:C.success}}>Bonnes pratiques</div><div style={{fontSize:9,color:C.muted}}>try-with-resources · Validation dans setters · Messages d'erreur clairs · Pas de secrets en dur</div></div>
  </div>
</div>);}

const STEPS=[
  {section:"Théorie",title:"Pourquoi la sécurité ?",type:"theory",render:(onQ,done)=>(<>
    <P>Un programme qui <Strong c={C.danger}>plante</Strong> quand l'utilisateur entre quelque chose d'inattendu n'est pas un programme fini. La sécurité = <Strong c={C.accent}>anticiper les problèmes</Strong>.</P>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,margin:"8px 0"}}>
      <div style={{background:C.danger+"12",borderRadius:8,padding:10}}><div style={{fontWeight:600,color:C.danger,fontSize:12}}>Code fragile</div><div style={{fontSize:11,color:C.muted,marginTop:4}}>Plante si input vide, null, mauvais type, index hors limites, fichier absent...</div></div>
      <div style={{background:C.success+"12",borderRadius:8,padding:10}}><div style={{fontWeight:600,color:C.success,fontSize:12}}>Code robuste</div><div style={{fontSize:11,color:C.muted,marginTop:4}}>Valide les entrées, gère les erreurs gracieusement, ferme les ressources</div></div>
    </div>
    <Code hl={[1,2]} code={`// Code fragile : plante si l'utilisateur entre "abc"\nint age = Integer.parseInt(sc.nextLine()); // CRASH !\n// NumberFormatException: For input string: "abc"`}/>
    <Quiz q="Que se passe-t-il si parseInt() reçoit du texte ?" opts={["Retourne 0","Retourne null","Lance une NumberFormatException (crash)","Ignore l'erreur"]} correct={2} onAns={onQ} done={done}/>
  </>)},
  {section:"Théorie",title:"try / catch / finally",type:"theory",render:(onQ,done)=>(<>
    <P><Kw>try</Kw> = "essaie ce code". <Kw>catch</Kw> = "si ça plante, fais ça à la place". <Kw>finally</Kw> = "dans tous les cas, fais ça".</P>
    <Code hl={[0,1,2,3,4,5,6,7]} code={`try {\n    System.out.print("Entrez un nombre : ");\n    int n = Integer.parseInt(sc.nextLine());\n    System.out.println("Double : " + (n * 2));\n} catch (NumberFormatException e) {\n    System.out.println("Ce n'est pas un nombre !");\n} finally {\n    System.out.println("(fin du traitement)");\n}`}/>
    <Tip title="Quand utiliser try-catch ?">Dès qu'une opération <Strong>peut échouer</Strong> : parseInt, accès fichier, accès réseau, division, accès tableau. Si vous ne savez pas si ça va marcher → try-catch.</Tip>
    <P>On peut attraper <Strong>plusieurs types</Strong> d'exceptions :</P>
    <Code code={`try {\n    int[] tab = {1, 2, 3};\n    System.out.println(tab[Integer.parseInt(input)]);\n} catch (NumberFormatException e) {\n    System.out.println("Pas un nombre !");\n} catch (ArrayIndexOutOfBoundsException e) {\n    System.out.println("Index hors limites !");\n} catch (Exception e) {\n    System.out.println("Erreur : " + e.getMessage());\n}`}/>
    <Task>1. Écrivez un programme qui demande un nombre<br/>2. Entourez de try-catch<br/>3. Testez avec "abc", "3.14", et un nombre valide<br/>4. Ajoutez un finally qui affiche "Terminé"</Task>
    <Quiz q="Quand s'exécute le bloc finally ?" opts={["Seulement si erreur","Seulement si pas d'erreur","Toujours, erreur ou pas","Jamais"]} correct={2} onAns={onQ} done={done}/>
  </>)},
  {section:"Théorie",title:"Validation des entrées",type:"theory",render:(onQ,done)=>(<>
    <P><Strong c={C.accent}>Valider = vérifier AVANT d'utiliser.</Strong> Ne faites jamais confiance à l'utilisateur.</P>
    <Code hl={[2,3,4,5,6,7,8,10,11,12]} code={`// Validation d'un âge\nString input = sc.nextLine();\n// 1. Pas vide ?\nif (input == null || input.trim().isEmpty()) {\n    System.out.println("Entrée vide !");\n    return;\n}\n// 2. C'est un nombre ?\ntry {\n    int age = Integer.parseInt(input.trim());\n    // 3. Valeur réaliste ?\n    if (age < 0 || age > 150) {\n        System.out.println("Âge invalide (0-150)");\n    } else {\n        System.out.println("Âge accepté : " + age);\n    }\n} catch (NumberFormatException e) {\n    System.out.println("Ce n'est pas un nombre !");\n}`}/>
    <P><Strong>NullPointerException</Strong> — l'erreur la plus courante :</P>
    <Code hl={[1,5]} code={`String nom = null;\n// nom.toUpperCase(); // CRASH ! NullPointerException\n\n// Solution : toujours vérifier\nif (nom != null) {\n    System.out.println(nom.toUpperCase());\n} else {\n    System.out.println("Nom non défini");\n}`}/>
    <Task>1. Écrivez une méthode <Ac>validerEmail(String email)</Ac><br/>2. Vérifiez : pas null, pas vide, contient "@", contient "."<br/>3. Retourne true si valide, false sinon<br/>4. Testez avec : null, "", "test", "a@b", "user@mail.com"</Task>
    <Quiz q="Que se passe-t-il si on appelle une méthode sur null ?" opts={["Retourne null","Retourne vide","NullPointerException (crash)","Rien"]} correct={2} onAns={onQ} done={done}/>
  </>)},
  {section:"Théorie",title:"Programmation défensive",type:"theory",render:(onQ,done)=>(<>
    <P>La <Strong c={C.accent}>programmation défensive</Strong> = coder comme si tout pouvait mal tourner.</P>
    <Code hl={[1,2,3,4,8,9,10]} code={`public class Invention {\n    public void setNom(String nom) {\n        if (nom == null) throw new IllegalArgumentException("nom null");\n        if (nom.trim().isEmpty()) throw new IllegalArgumentException("nom vide");\n        if (nom.length() > 100) throw new IllegalArgumentException("nom trop long");\n        this.nom = nom.trim();\n    }\n    \n    public void setAnnee(int annee) {\n        if (annee < 0 || annee > 2026)\n            throw new IllegalArgumentException("année invalide: " + annee);\n        this.annee = annee;\n    }\n}`}/>
    <Tip title="throw vs try-catch"><Strong>throw</Strong> = lancer une exception (le problème est détecté ICI)<br/><Strong>try-catch</Strong> = attraper une exception (le problème est géré ICI)<br/>Le setter <Strong>lance</Strong>, le code appelant <Strong>attrape</Strong>.</Tip>
    <Code code={`// Code appelant\ntry {\n    invention.setNom("");  // lance IllegalArgumentException\n} catch (IllegalArgumentException e) {\n    System.out.println("Erreur: " + e.getMessage());\n    // "Erreur: nom vide"\n}`}/>
    <Task>1. Ajoutez des validations avec throw dans vos setters<br/>2. Dans le main, entourez les appels de try-catch<br/>3. Testez avec des valeurs invalides → le programme ne plante plus</Task>
    <Quiz q="Que fait 'throw new IllegalArgumentException(msg)' ?" opts={["Affiche un message","Lance une exception que le code appelant doit gérer","Arrête le programme","Retourne null"]} correct={1} onAns={onQ} done={done}/>
  </>)},

  {section:"Défi",title:"Le Scanner de Sécurité",type:"game",render:(_,__,onGC)=>(<>
    <P>8 extraits de code avec des failles de sécurité. Trouvez-les et découvrez comment les corriger !</P>
    <SecurityGame onComplete={onGC}/>
  </>)},

  {section:"Code guidé",title:"Programme robuste pas à pas",type:"guided",render:(onQ,done)=>(<>
    <P>Transformons un programme fragile en programme robuste.</P>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:6,marginBottom:3}}>Étape 1 : Le programme fragile</div>
    <Code code={`// CE CODE PLANTE facilement !\nScanner sc = new Scanner(System.in);\nSystem.out.print("Nombre d'inventions : ");\nint nb = sc.nextInt();  // CRASH si texte\nString[] noms = new String[nb]; // CRASH si négatif\nfor (int i = 0; i < nb; i++) {\n    noms[i] = sc.next();\n}`}/>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:6,marginBottom:3}}>Étape 2 : Ajouter la validation</div>
    <Code hl={[2,3,4,5,6,7,8,9,10,11,12,13]} code={`Scanner sc = new Scanner(System.in);\nint nb = -1;\nwhile (nb < 1 || nb > 100) {\n    System.out.print("Nombre (1-100) : ");\n    try {\n        nb = Integer.parseInt(sc.nextLine().trim());\n        if (nb < 1 || nb > 100) {\n            System.out.println("Entre 1 et 100 svp");\n        }\n    } catch (NumberFormatException e) {\n        System.out.println("Entrez un nombre !");\n    }\n}`}/>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:6,marginBottom:3}}>Étape 3 : Valider chaque nom</div>
    <Code code={`String[] noms = new String[nb];\nfor (int i = 0; i < nb; i++) {\n    String input = "";\n    while (input.trim().isEmpty()) {\n        System.out.print("Nom " + (i+1) + " : ");\n        input = sc.nextLine();\n        if (input.trim().isEmpty()) {\n            System.out.println("Le nom ne peut pas être vide !");\n        }\n    }\n    noms[i] = input.trim();\n}`}/>
    <Task>Tapez le programme complet. Testez avec :<br/>— "abc" au lieu d'un nombre → message d'erreur, redemande<br/>— -5 → message, redemande<br/>— Nom vide → message, redemande<br/>Le programme ne plante JAMAIS !</Task>
    <Quiz q="Pourquoi parseInt(sc.nextLine()) plutôt que sc.nextInt() ?" opts={["C'est plus rapide","nextLine() permet de gérer l'erreur avec try-catch sans laisser de \\n dans le buffer","C'est la même chose","parseInt est plus précis"]} correct={1} onAns={onQ} done={done}/>
  </>)},

  {section:"Exercice",title:"Sécuriser le Catalogue",type:"exercise",render:(onQ,done)=>(<>
    <div style={{background:C.gold+"15",borderRadius:10,padding:14,border:`1px solid ${C.gold}40`}}>
      <div style={{fontSize:15,fontWeight:700,color:C.gold,marginBottom:4}}>Exercice — 70 Crédits R&D</div>
      <div style={{color:C.text,fontSize:13}}>Reprenez votre Catalogue d'Inventions (M03) et sécurisez-le complètement.</div>
    </div>
    <div style={{color:C.text,fontSize:12,lineHeight:1.8,marginTop:10}}>
      <Strong>À sécuriser :</Strong><br/>
      1. Setters avec <Ac>throw IllegalArgumentException</Ac> si invalide<br/>
      2. Constructeur : valider tous les paramètres<br/>
      3. Menu : try-catch autour de chaque saisie utilisateur<br/>
      4. Recherche : gérer le cas liste vide + null<br/>
      5. Modification/suppression : valider l'index<br/>
      6. <Strong c={C.gold}>Bonus</Strong> : créer une classe <Ac>ValidationUtils</Ac> avec des méthodes statiques réutilisables
    </div>
    <Quiz q="Où mettre la validation : dans le setter ou dans le main ?" opts={["Seulement dans le main","Seulement dans le setter","Dans les deux ! Le setter lance, le main attrape","Ni l'un ni l'autre"]} correct={2} onAns={onQ} done={done}/>
  </>)},

  {section:"Correction",title:"Correction sécurisée",type:"correction",render:(onQ,done)=>(<>
    <div style={{background:C.success+"12",borderRadius:8,padding:10,border:`1px solid ${C.success}40`,marginBottom:8}}><div style={{fontSize:13,fontWeight:700,color:C.success}}>Correction — Extraits clés</div></div>
    <Code code={`// Setter sécurisé\npublic void setNom(String nom) {\n    if (nom == null || nom.trim().isEmpty())\n        throw new IllegalArgumentException("Nom invalide");\n    if (nom.length() > 200)\n        throw new IllegalArgumentException("Nom trop long");\n    this.nom = nom.trim();\n}`}/>
    <Code code={`// Classe utilitaire\npublic class ValidationUtils {\n    public static int lireEntier(Scanner sc, String msg, int min, int max) {\n        while (true) {\n            System.out.print(msg);\n            try {\n                int val = Integer.parseInt(sc.nextLine().trim());\n                if (val >= min && val <= max) return val;\n                System.out.println("Doit être entre " + min + " et " + max);\n            } catch (NumberFormatException e) {\n                System.out.println("Entrez un nombre !");\n            }\n        }\n    }\n    public static String lireString(Scanner sc, String msg) {\n        while (true) {\n            System.out.print(msg);\n            String s = sc.nextLine().trim();\n            if (!s.isEmpty()) return s;\n            System.out.println("Ne peut pas être vide !");\n        }\n    }\n}`}/>
    <Code code={`// Utilisation dans le menu\ncase 1: // Ajouter\n    try {\n        String nom = ValidationUtils.lireString(sc, "Nom : ");\n        int annee = ValidationUtils.lireEntier(sc, "Année : ", 1, 2026);\n        catalogue.ajouter(new Invention(nom, annee));\n    } catch (IllegalArgumentException e) {\n        System.out.println("Erreur: " + e.getMessage());\n    }\n    break;`}/>
    <Tip title="Pattern réutilisable">La classe <Ac>ValidationUtils</Ac> centralise la validation. Chaque méthode boucle jusqu'à obtenir une entrée valide. Plus de code dupliqué !</Tip>
    <Quiz q="Avantage d'une classe ValidationUtils ?" opts={["C'est obligatoire en Java","Centralise la validation → pas de duplication, facile à maintenir","C'est plus rapide","Ça remplace les setters"]} correct={1} onAns={onQ} done={done}/>
  </>)},
];

// ═══ MAIN (same shell as other modules) ═══
export default function M07Unified(){
  const[step,setStep]=useState(0);const[completed,setCompleted]=useState({});const[score,setScore]=useState(0);const[totalQ,setTotalQ]=useState(0);const[credits,setCredits]=useState(0);const[gameScore,setGameScore]=useState(null);const[ready,setReady]=useState(false);const[showMemo,setShowMemo]=useState(false);
  const allDone=Object.keys(completed).length>=STEPS.length;
  useEffect(()=>{ld().then(d=>{if(d){setCompleted(d.c||{});setScore(d.s||0);setTotalQ(d.t||0);setCredits(d.cr||0);setGameScore(d.gs);if(d.st!==undefined)setStep(d.st);}setReady(true);});},[]);
  const persist=useCallback((c,s,t,cr,gs,st)=>{sv({c,s,t,cr,gs,st});},[]);
  const handleQuiz=(ok)=>{const nT=totalQ+1,nS=score+(ok?1:0),nCr=credits+(ok?5:0),nC={...completed,[step]:true};setTotalQ(nT);setScore(nS);setCredits(nCr);setCompleted(nC);persist(nC,nS,nT,nCr,gameScore,step);};
  const handleGC=(gs)=>{setGameScore(gs);const nCr=credits+Math.floor(gs/2);setCredits(nCr);const nC={...completed,[step]:true};setCompleted(nC);persist(nC,score,totalQ,nCr,gs,step);};
  const go=(dir)=>{const ns=step+dir;if(ns>=0&&ns<STEPS.length){setStep(ns);persist(completed,score,totalQ,credits,gameScore,ns);}};
  if(!ready)return<div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",color:C.muted}}>Chargement...</div>;
  const cur=STEPS[step];const sections=[...new Set(STEPS.map(s=>s.section))];
  const secC={Théorie:C.secondary,Défi:C.gold,"Code guidé":C.primary,Exercice:C.accent,Correction:C.success};
  return(<div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',system-ui,sans-serif"}}><style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
    <div style={{padding:"8px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:C.card,flexWrap:"wrap",gap:4}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:10,letterSpacing:2,color:C.dimmed}}>CODEQUEST</span><span style={{color:C.border}}>|</span><span style={{fontSize:12,fontWeight:600,color:C.accent}}>M07 · Sécurité</span></div><div style={{display:"flex",gap:10,fontSize:11}}><span style={{color:C.muted}}>Quiz <strong style={{color:C.success}}>{score}/{totalQ}</strong></span>{gameScore!==null&&<span style={{color:C.muted}}>Jeu <strong style={{color:C.accent}}>{gameScore}</strong></span>}<span style={{color:C.muted}}>CR <strong style={{color:C.gold}}>{credits}</strong></span></div></div>
    <div style={{display:"flex",maxWidth:1100,margin:"0 auto",minHeight:"calc(100vh - 42px)"}}>
      <div style={{width:200,borderRight:`1px solid ${C.border}`,padding:"10px 0",flexShrink:0,overflowY:"auto",display:"flex",flexDirection:"column"}}>
        {sections.map(sec=>{const sts=STEPS.map((s,i)=>({...s,idx:i})).filter(s=>s.section===sec);return(<div key={sec}><div style={{padding:"5px 12px",fontSize:9,letterSpacing:1,color:secC[sec]||C.dimmed,fontWeight:700,textTransform:"uppercase"}}>{sec}</div>{sts.map(s=>{const c2=s.idx===step,dn=!!completed[s.idx];return(<button key={s.idx} onClick={()=>{setStep(s.idx);persist(completed,score,totalQ,credits,gameScore,s.idx);}} style={{display:"flex",alignItems:"center",gap:5,width:"100%",padding:"4px 12px 4px 20px",border:"none",background:c2?C.accent+"12":"transparent",borderLeft:c2?`2px solid ${C.accent}`:"2px solid transparent",cursor:"pointer",fontFamily:"inherit",fontSize:11,color:c2?C.accent:dn?C.success:C.muted,textAlign:"left"}}><span style={{fontSize:8}}>{dn?"✓":"○"}</span>{s.title}</button>);})}</div>);})}
        <div style={{padding:10,marginTop:"auto"}}><div style={{height:3,background:C.border,borderRadius:2,overflow:"hidden",marginBottom:6}}><div style={{width:`${(Object.keys(completed).length/STEPS.length)*100}%`,height:"100%",background:`linear-gradient(90deg,${C.primary},${C.accent})`,borderRadius:2,transition:"width .5s"}}/></div>
        <button onClick={()=>allDone&&setShowMemo(!showMemo)} style={{width:"100%",padding:"8px",borderRadius:8,border:`1px solid ${allDone?C.gold:C.border}`,background:allDone?C.gold+"15":"transparent",color:allDone?C.gold:C.dimmed,cursor:allDone?"pointer":"default",fontFamily:"inherit",fontSize:11,fontWeight:600,opacity:allDone?1:0.5}}>{allDone?"📋 Mémo":"🔒 Mémo"}</button></div>
      </div>
      <div style={{flex:1,padding:"16px 24px",overflowY:"auto",maxHeight:"calc(100vh - 42px)"}}>{showMemo&&allDone?<Memo/>:(<div key={step} style={{animation:"fadeIn .25s"}}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}><span style={{fontSize:9,padding:"2px 8px",borderRadius:10,background:(secC[cur.section]||C.dimmed)+"20",color:secC[cur.section]||C.dimmed,fontWeight:600,letterSpacing:1}}>{cur.section.toUpperCase()}</span></div><h2 style={{fontSize:18,fontWeight:700,marginBottom:12}}>{cur.title}</h2>{cur.type==="game"?cur.render(handleQuiz,!!completed[step],handleGC):cur.render(handleQuiz,!!completed[step])}<div style={{display:"flex",justifyContent:"space-between",marginTop:24,paddingTop:10,borderTop:`1px solid ${C.border}`}}><button onClick={()=>go(-1)} disabled={step===0} style={{padding:"7px 16px",borderRadius:7,border:`1px solid ${C.border}`,background:"transparent",color:step===0?C.border:C.muted,cursor:step===0?"default":"pointer",fontFamily:"inherit",fontSize:12}}>←</button><button onClick={()=>go(1)} disabled={step===STEPS.length-1} style={{padding:"7px 16px",borderRadius:7,border:"none",background:step===STEPS.length-1?C.border:C.accent,color:step===STEPS.length-1?C.muted:C.bg,cursor:step===STEPS.length-1?"default":"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600}}>{step===STEPS.length-1?"Fin":"→"}</button></div></div>)}</div>
    </div>
  </div>);
}
