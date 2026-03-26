import { useState, useEffect, useCallback } from "react";

const C={bg:"#0a0f1a",card:"#111827",primary:"#0D7377",secondary:"#14A3C7",accent:"#32E0C4",gold:"#F59E0B",text:"#e2e8f0",muted:"#94a3b8",dimmed:"#64748b",border:"#1e293b",success:"#10B981",danger:"#EF4444",code:"#1E293B",codeBorder:"#2d3a4f",codeText:"#32E0C4"};
const KEY="cq-m14-unified";
async function ld(){try{const r=await window.storage.get(KEY);return r?JSON.parse(r.value):null;}catch{return null;}}
async function sv(d){try{await window.storage.set(KEY,JSON.stringify(d));}catch{}}

function CodeBox({code,hl=[]}){const lines=code.split("\n");return(<div style={{background:C.code,border:"1px solid "+C.codeBorder,borderRadius:10,overflow:"hidden",fontSize:12,fontFamily:"monospace",margin:"8px 0"}}><div style={{padding:"8px 0",overflowX:"auto"}}>{lines.map((l,i)=>(<div key={i} style={{display:"flex",padding:"1px 0",background:hl.includes(i)?C.accent+"12":"transparent"}}><span style={{width:28,textAlign:"right",paddingRight:6,color:C.dimmed,userSelect:"none",fontSize:10}}>{i+1}</span><span style={{color:C.codeText,whiteSpace:"pre"}}>{l}</span></div>))}</div></div>);}
function Quiz({q,opts,correct,onAns,done}){const[sel,setSel]=useState(null);const[locked,setLocked]=useState(false);const[resetting,setResetting]=useState(false);const answered=(locked||(done&&!resetting));const reset=()=>{setSel(null);setLocked(false);setResetting(true);};return(<div style={{margin:"12px 0"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:6}}>{q}</div>{(locked||(done&&!resetting))&&<button onClick={reset} style={{fontSize:9,padding:"2px 8px",borderRadius:4,border:"1px solid #1e293b",background:"transparent",color:"#94a3b8",cursor:"pointer",fontFamily:"inherit"}}>Recommencer</button>}</div>{opts.map((o,i)=>{let bg=C.card,bc=C.border;if(answered&&i===correct){bg=C.success+"20";bc=C.success;}else if(answered&&sel===i&&i!==correct){bg=C.danger+"20";bc=C.danger;}return(<button key={i} onClick={()=>{if(answered)return;setSel(i);setLocked(true);setResetting(false);onAns(i===correct);}} style={{display:"block",width:"100%",textAlign:"left",padding:"7px 11px",marginBottom:3,borderRadius:7,border:"1px solid "+bc,background:bg,color:C.text,cursor:answered?"default":"pointer",fontFamily:"inherit",fontSize:12}}>{String.fromCharCode(65+i)+". "+o}</button>);})}{answered&&<div style={{marginTop:6,padding:"6px 10px",borderRadius:6,fontSize:11,fontWeight:600,background:sel===correct?"#10B98120":"#EF444420",color:sel===correct?"#10B981":"#EF4444"}}>{sel===correct?"Correct !":"Incorrect — la bonne reponse est "+String.fromCharCode(65+correct)+". "+opts[correct]}</div>}</div>);}

function P({children}){return <p style={{color:C.muted,fontSize:13,lineHeight:1.7,marginBottom:6}}>{children}</p>;}
function Strong({children,c=C.text}){return <strong style={{color:c}}>{children}</strong>;}
function Tip({title,children,color=C.gold}){return(<div style={{background:color+"15",borderRadius:7,padding:10,border:"1px solid "+color+"40",margin:"8px 0"}}><div style={{fontSize:11,fontWeight:600,color,marginBottom:3}}>{title}</div><div style={{color:C.text,fontSize:11,lineHeight:1.5}}>{children}</div></div>);}

const CD = [];
CD[0] = "import javax.swing.*;\n\npublic class MaFenetre extends JFrame {\n    public MaFenetre() {\n        setTitle(\"Ma premiere fenetre\");\n        setSize(400, 300);\n        setDefaultCloseOperation(EXIT_ON_CLOSE);\n        setLocationRelativeTo(null); // centrer\n        setVisible(true);\n    }\n\n    public static void main(String[] args) {\n        new MaFenetre();\n    }\n}";
CD[1] = "import javax.swing.*;\nimport java.awt.*;\n\npublic class PanneauSimple extends JFrame {\n    public PanneauSimple() {\n        setTitle(\"Composants Swing\");\n        setSize(400, 200);\n        setDefaultCloseOperation(EXIT_ON_CLOSE);\n        setLayout(new FlowLayout());\n\n        JLabel label = new JLabel(\"Votre nom :\");\n        JTextField champ = new JTextField(20);\n        JButton bouton = new JButton(\"Valider\");\n\n        add(label);\n        add(champ);\n        add(bouton);\n\n        setVisible(true);\n    }\n}";
CD[2] = "import javax.swing.*;\nimport java.awt.*;\nimport java.awt.event.*;\n\npublic class CompteurGUI extends JFrame {\n    private int compteur = 0;\n    private JLabel lblCompteur;\n\n    public CompteurGUI() {\n        setTitle(\"Compteur\");\n        setSize(300, 150);\n        setDefaultCloseOperation(EXIT_ON_CLOSE);\n        setLayout(new FlowLayout(FlowLayout.CENTER, 20, 30));\n\n        JButton btnMoins = new JButton(\" - \");\n        lblCompteur = new JLabel(\"0\");\n        lblCompteur.setFont(new Font(\"Arial\", Font.BOLD, 32));\n        JButton btnPlus = new JButton(\" + \");\n\n        // EVENT LISTENERS\n        btnPlus.addActionListener(new ActionListener() {\n            public void actionPerformed(ActionEvent e) {\n                compteur++;\n                lblCompteur.setText(String.valueOf(compteur));\n            }\n        });\n\n        btnMoins.addActionListener(new ActionListener() {\n            public void actionPerformed(ActionEvent e) {\n                compteur--;\n                lblCompteur.setText(String.valueOf(compteur));\n            }\n        });\n\n        add(btnMoins);\n        add(lblCompteur);\n        add(btnPlus);\n        setVisible(true);\n    }\n\n    public static void main(String[] args) {\n        new CompteurGUI();\n    }\n}";
CD[3] = "// LAMBDA (Java 8+) = version courte\nbtnPlus.addActionListener(e -> {\n    compteur++;\n    lblCompteur.setText(String.valueOf(compteur));\n});\n\n// Equivalent a :\nbtnPlus.addActionListener(new ActionListener() {\n    public void actionPerformed(ActionEvent e) {\n        compteur++;\n        lblCompteur.setText(String.valueOf(compteur));\n    }\n});";
CD[4] = "// BORDERLAYOUT = 5 zones\nsetLayout(new BorderLayout());\nadd(new JButton(\"Haut\"), BorderLayout.NORTH);\nadd(new JButton(\"Bas\"), BorderLayout.SOUTH);\nadd(new JButton(\"Gauche\"), BorderLayout.WEST);\nadd(new JButton(\"Droite\"), BorderLayout.EAST);\nadd(new JButton(\"Centre\"), BorderLayout.CENTER);\n\n// GRIDLAYOUT = grille reguliere\nsetLayout(new GridLayout(2, 3)); // 2 lignes, 3 colonnes\nadd(new JButton(\"1\")); add(new JButton(\"2\")); add(new JButton(\"3\"));\nadd(new JButton(\"4\")); add(new JButton(\"5\")); add(new JButton(\"6\"));";
CD[5] = "// Mini-calculatrice avec Swing\npublic class CalculatriceGUI extends JFrame {\n    private JTextField champ1, champ2;\n    private JLabel lblResultat;\n    private JComboBox<String> comboOp;\n\n    public CalculatriceGUI() {\n        setTitle(\"Calculatrice\");\n        setSize(350, 150);\n        setDefaultCloseOperation(EXIT_ON_CLOSE);\n        setLayout(new FlowLayout());\n\n        champ1 = new JTextField(5);\n        comboOp = new JComboBox<>(new String[]{\"+\",\"-\",\"*\",\"/\"});\n        champ2 = new JTextField(5);\n        JButton btnCalc = new JButton(\"=\");\n        lblResultat = new JLabel(\"Resultat\");\n\n        btnCalc.addActionListener(e -> calculer());\n\n        add(champ1); add(comboOp); add(champ2);\n        add(btnCalc); add(lblResultat);\n        setVisible(true);\n    }\n\n    private void calculer() {\n        try {\n            double a = Double.parseDouble(champ1.getText());\n            double b = Double.parseDouble(champ2.getText());\n            String op = (String) comboOp.getSelectedItem();\n            double res = 0;\n            switch (op) {\n                case \"+\": res = a + b; break;\n                case \"-\": res = a - b; break;\n                case \"*\": res = a * b; break;\n                case \"/\":\n                    if (b == 0) { lblResultat.setText(\"Erreur : /0\"); return; }\n                    res = a / b; break;\n            }\n            lblResultat.setText(\"= \" + res);\n        } catch (NumberFormatException ex) {\n            lblResultat.setText(\"Nombre invalide !\");\n        }\n    }\n}";
CD[6] = "// Panneau de controle du Labo d'Inventions\npublic class LaboGUI extends JFrame {\n    private ArrayList<String> inventions = new ArrayList<>();\n    private DefaultListModel<String> listModel;\n    private JList<String> jListe;\n    private JTextField champNom;\n\n    public LaboGUI() {\n        setTitle(\"Labo des Inventions\");\n        setSize(500, 400);\n        setDefaultCloseOperation(EXIT_ON_CLOSE);\n        setLayout(new BorderLayout(10, 10));\n\n        // Panel Nord : saisie\n        JPanel panelNord = new JPanel(new FlowLayout());\n        champNom = new JTextField(20);\n        JButton btnAjouter = new JButton(\"Ajouter\");\n        panelNord.add(new JLabel(\"Invention :\"));\n        panelNord.add(champNom);\n        panelNord.add(btnAjouter);\n\n        // Centre : liste\n        listModel = new DefaultListModel<>();\n        jListe = new JList<>(listModel);\n\n        // Sud : supprimer\n        JButton btnSupprimer = new JButton(\"Supprimer\");\n\n        // Listeners\n        btnAjouter.addActionListener(e -> {\n            String nom = champNom.getText().trim();\n            if (!nom.isEmpty()) {\n                inventions.add(nom);\n                listModel.addElement(nom);\n                champNom.setText(\"\");\n            }\n        });\n        btnSupprimer.addActionListener(e -> {\n            int idx = jListe.getSelectedIndex();\n            if (idx >= 0) {\n                inventions.remove(idx);\n                listModel.remove(idx);\n            }\n        });\n\n        add(panelNord, BorderLayout.NORTH);\n        add(new JScrollPane(jListe), BorderLayout.CENTER);\n        add(btnSupprimer, BorderLayout.SOUTH);\n        setVisible(true);\n    }\n}";

// ═══ GAME: GUI BUILDER ═══
function GUIBuilderGame({onComplete}) {
  const COMPONENTS = [
    {name:"JFrame",desc:"La fenetre principale",role:"Conteneur de base",correct:0},
    {name:"JButton",desc:"Bouton cliquable",role:"Declencheur d'evenement",correct:1},
    {name:"JLabel",desc:"Texte non editable",role:"Affichage d'information",correct:2},
    {name:"JTextField",desc:"Champ de saisie texte",role:"Entree utilisateur",correct:3},
    {name:"ActionListener",desc:"Ecouteur d'evenement",role:"Reagir aux clics",correct:4},
    {name:"JComboBox",desc:"Liste deroulante",role:"Selection parmi des choix",correct:5},
    {name:"JPanel",desc:"Sous-conteneur",role:"Organiser les composants",correct:6},
    {name:"JScrollPane",desc:"Zone avec defilement",role:"Afficher des listes longues",correct:7},
  ];
  const [matched, setMatched] = useState(Array(8).fill(false));
  const [selected, setSelected] = useState(null);
  const [targets, setTargets] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setTargets([...COMPONENTS].sort(() => Math.random() - 0.5));
  }, []);

  const tryMatch = (idx) => {
    if (!targets || done) return;
    if (selected === null) { setSelected(idx); return; }
    const comp = COMPONENTS[selected];
    const tgt = targets[idx];
    if (comp && tgt && comp.name === tgt.name) {
      const nm = [...matched]; nm[selected] = true;
      setMatched(nm); setScore(s => s + 15);
      if (nm.filter(Boolean).length >= COMPONENTS.length) { setDone(true); onComplete(score + 15); }
    }
    setSelected(null);
  };

  if (!targets) return null;

  return (<div style={{background:C.card,borderRadius:12,padding:14,border:"1px solid "+C.border,margin:"10px 0"}}>
    <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:8}}>
      <span style={{color:C.dimmed}}>{"Associez composant et role"}</span>
      <span style={{color:C.gold,fontWeight:700}}>{"Score: "+score}</span>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
      <div>
        <div style={{fontSize:10,fontWeight:600,color:C.accent,marginBottom:4}}>COMPOSANTS</div>
        {COMPONENTS.map((c,i) => (
          <button key={i} onClick={() => {setSelected(i);}} style={{
            display:"block",width:"100%",padding:"6px 10px",marginBottom:3,borderRadius:6,
            border:"1px solid "+(matched[i]?C.success+"40":selected===i?C.accent:C.border),
            background:matched[i]?C.success+"10":selected===i?C.accent+"15":C.code,
            color:matched[i]?C.success:C.text,cursor:matched[i]?"default":"pointer",
            fontFamily:"inherit",fontSize:11,textAlign:"left",
          }}>
            <strong>{c.name}</strong>
            <span style={{color:C.dimmed,marginLeft:6}}>{c.desc}</span>
          </button>
        ))}
      </div>
      <div>
        <div style={{fontSize:10,fontWeight:600,color:C.gold,marginBottom:4}}>ROLES</div>
        {targets.map((t,i) => {
          const isMatched = matched[COMPONENTS.findIndex(c=>c.name===t.name)];
          return (
            <button key={i} onClick={() => tryMatch(COMPONENTS.findIndex(c=>c.name===t.name))} style={{
              display:"block",width:"100%",padding:"6px 10px",marginBottom:3,borderRadius:6,
              border:"1px solid "+(isMatched?C.success+"40":C.border),
              background:isMatched?C.success+"10":C.code,
              color:isMatched?C.success:C.text,cursor:isMatched?"default":"pointer",
              fontFamily:"inherit",fontSize:11,textAlign:"left",
            }}>
              {t.role}
            </button>
          );
        })}
      </div>
    </div>
    {done && <div style={{textAlign:"center",marginTop:8,fontSize:14,fontWeight:700,color:C.gold}}>{"Tous les composants associes !"}</div>}
  </div>);
}

function Memo(){return(<div style={{background:C.card,borderRadius:12,padding:20,border:"1px solid "+C.gold+"40"}}>
  <div style={{fontSize:16,fontWeight:700,color:C.gold,marginBottom:12}}>{"Memo \u2014 Swing & Event-driven"}</div>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
    <div style={{background:C.code,borderRadius:8,padding:10}}><div style={{fontSize:11,fontWeight:600,color:C.accent,marginBottom:4}}>Composants essentiels</div><div style={{fontSize:9,color:C.muted,lineHeight:1.6}}>{"JFrame : fenetre principale"}<br/>{"JButton : bouton cliquable"}<br/>{"JLabel : texte non editable"}<br/>{"JTextField : champ de saisie"}<br/>{"JComboBox : liste deroulante"}<br/>{"JPanel : sous-conteneur"}<br/>{"JList : liste d'elements"}<br/>{"JScrollPane : zone defilante"}</div></div>
    <div style={{background:C.code,borderRadius:8,padding:10}}><div style={{fontSize:11,fontWeight:600,color:C.accent,marginBottom:4}}>Layouts</div><div style={{fontSize:9,color:C.muted,lineHeight:1.6}}>{"FlowLayout : gauche a droite"}<br/>{"BorderLayout : 5 zones (N,S,E,W,C)"}<br/>{"GridLayout : grille reguliere"}<br/><br/><span style={{color:C.accent}}>{"btnOk.addActionListener(e -> {\n  // code au clic\n});"}</span></div></div>
  </div>
  <div style={{background:C.danger+"15",borderRadius:6,padding:8,marginTop:8}}><div style={{fontSize:10,fontWeight:600,color:C.danger}}>Pattern event-driven</div><div style={{fontSize:9,color:C.muted}}>{"Le programme ATTEND. L'utilisateur AGIT (clic, frappe). Le Listener REAGIT (actionPerformed). Pas d'ordre sequentiel fixe."}</div></div>
</div>);}

const STEPS=[
  {section:"Theorie",title:"Paradigme event-driven",type:"theory",render:(onQ,done)=>(<>
    <P>En programmation <Strong c={C.accent}>event-driven</Strong>, le programme ne s execute pas de haut en bas. Il <Strong c={C.danger}>ATTEND</Strong> que l utilisateur agisse (clic, frappe clavier), puis il reagit.</P>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,margin:"8px 0"}}>
      <div style={{background:C.primary+"12",borderRadius:8,padding:8,textAlign:"center"}}><div style={{fontWeight:600,color:C.primary,fontSize:12}}>Procedural</div><div style={{fontSize:10,color:C.muted,marginTop:3}}>{"Ligne 1 \u2192 Ligne 2 \u2192 Ligne 3"}<br/>Le programme decide l ordre</div></div>
      <div style={{background:C.secondary+"12",borderRadius:8,padding:8,textAlign:"center"}}><div style={{fontWeight:600,color:C.secondary,fontSize:12}}>OOP</div><div style={{fontSize:10,color:C.muted,marginTop:3}}>Objets qui interagissent<br/>Methodes appelees en sequence</div></div>
      <div style={{background:C.danger+"12",borderRadius:8,padding:8,textAlign:"center"}}><div style={{fontWeight:600,color:C.danger,fontSize:12}}>Event-driven</div><div style={{fontSize:10,color:C.muted,marginTop:3}}>{"Le programme ATTEND"}<br/>{"L utilisateur DECLENCHE"}</div></div>
    </div>
    <P>Exemples quotidiens : ascenseur (bouton = evenement), distributeur automatique, app mobile (chaque bouton = un listener).</P>
    <Tip title="En Java : Swing">Swing est la bibliotheque GUI de Java. JFrame = fenetre, JButton = bouton, ActionListener = reagir aux clics.</Tip>
    <Quiz q="En event-driven, qui decide l ordre d execution ?" opts={["Le compilateur","Le programme","L utilisateur via ses actions","Le systeme d exploitation"]} correct={2} onAns={onQ} done={done}/>
  </>)},

  {section:"Theorie",title:"JFrame et composants Swing",type:"theory",render:(onQ,done)=>(<>
    <P>Tout commence par une <Strong c={C.accent}>JFrame</Strong> (la fenetre), puis on ajoute des composants :</P>
    <CodeBox code={CD[0]} hl={[3,4,5,6,7]}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,margin:"8px 0"}}>
      {[{n:"JButton",d:"Bouton cliquable"},{n:"JLabel",d:"Texte affiche"},{n:"JTextField",d:"Champ de saisie"},{n:"JComboBox",d:"Liste deroulante"},{n:"JPanel",d:"Sous-conteneur"},{n:"JList",d:"Liste d elements"}].map((c,i)=>(
        <div key={i} style={{background:C.code,borderRadius:6,padding:6,display:"flex",gap:8,alignItems:"center"}}><span style={{color:C.accent,fontFamily:"monospace",fontSize:11,fontWeight:700,minWidth:80}}>{c.n}</span><span style={{color:C.muted,fontSize:10}}>{c.d}</span></div>
      ))}
    </div>
    <CodeBox code={CD[1]} hl={[9,10,11,12]}/>
    <Quiz q="Que fait setDefaultCloseOperation(EXIT_ON_CLOSE) ?" opts={["Cache la fenetre","Ferme le programme quand on ferme la fenetre","Empeche la fermeture","Rien"]} correct={1} onAns={onQ} done={done}/>
  </>)},

  {section:"Theorie",title:"ActionListener : reagir aux evenements",type:"theory",render:(onQ,done)=>(<>
    <P>Le coeur de l event-driven : un <Strong c={C.accent}>ActionListener</Strong> est un objet qui reagit quand on clique un bouton.</P>
    <CodeBox code={CD[2]} hl={[19,20,21,22,23,24]}/>
    <P>Version courte avec les <Strong c={C.accent}>lambdas</Strong> (Java 8+) :</P>
    <CodeBox code={CD[3]} hl={[1,2,3,4]}/>
    <Tip title="Le pattern Observer">Le bouton est l Observable. Le listener est l Observer. Quand le bouton est clique, il notifie TOUS ses listeners. C est la base de TOUTE interface graphique.</Tip>
    <Quiz q="Que se passe-t-il quand on clique un bouton SANS ActionListener ?" opts={["Le programme plante","Rien du tout, le clic est ignore","Eclipse affiche une erreur","Le bouton disparait"]} correct={1} onAns={onQ} done={done}/>
  </>)},

  {section:"Theorie",title:"Layouts : organiser les composants",type:"theory",render:(onQ,done)=>(<>
    <P>Le <Strong c={C.accent}>Layout Manager</Strong> decide comment les composants sont disposes dans la fenetre.</P>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,margin:"8px 0"}}>
      <div style={{background:C.primary+"12",borderRadius:8,padding:8}}><div style={{fontWeight:600,color:C.primary,fontSize:11}}>FlowLayout</div><div style={{fontSize:10,color:C.muted,marginTop:3}}>{"Gauche \u2192 droite, retour a la ligne. Par defaut dans JPanel."}</div></div>
      <div style={{background:C.secondary+"12",borderRadius:8,padding:8}}><div style={{fontWeight:600,color:C.secondary,fontSize:11}}>BorderLayout</div><div style={{fontSize:10,color:C.muted,marginTop:3}}>5 zones : NORTH, SOUTH, EAST, WEST, CENTER. Par defaut dans JFrame.</div></div>
      <div style={{background:C.accent+"12",borderRadius:8,padding:8}}><div style={{fontWeight:600,color:C.accent,fontSize:11}}>GridLayout</div><div style={{fontSize:10,color:C.muted,marginTop:3}}>Grille reguliere. Tous les composants ont la meme taille.</div></div>
    </div>
    <CodeBox code={CD[4]}/>
    <Quiz q="Quel layout pour une calculatrice (grille de boutons) ?" opts={["FlowLayout","BorderLayout","GridLayout","Aucun layout"]} correct={2} onAns={onQ} done={done}/>
  </>)},

  {section:"Defi",title:"GUI Component Builder",type:"game",render:(_,__,onGC)=>(<>
    <P>Associez chaque composant Swing a son role. Cliquez un composant puis son role !</P>
    <GUIBuilderGame onComplete={onGC}/>
  </>)},

  {section:"Code guide",title:"Calculatrice Swing pas a pas",type:"guided",render:(onQ,done)=>(<>
    <P>On construit une mini-calculatrice avec interface graphique, etape par etape.</P>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginBottom:3}}>{"Etape 1 : La fenetre"}</div>
    <P>Creer une classe CalculatriceGUI qui extends JFrame. setTitle, setSize, setLayout(new FlowLayout()).</P>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:6,marginBottom:3}}>{"Etape 2 : Les composants"}</div>
    <P>2 JTextField pour les nombres, 1 JComboBox pour l operateur (+,-,*,/), 1 JButton "=", 1 JLabel pour le resultat.</P>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:6,marginBottom:3}}>{"Etape 3 : Le listener"}</div>
    <P>btnCalc.addActionListener(e -{">"} calculer()). La methode calculer() lit les champs, fait le calcul, affiche le resultat.</P>
    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginTop:6,marginBottom:3}}>Code complet</div>
    <CodeBox code={CD[5]} hl={[18,26,27,28,29,30,31,32,33,34,35]}/>
    <Tip title="Securite">try-catch sur le parseInt ! Si l utilisateur tape "abc", NumberFormatException. La calculatrice affiche "Nombre invalide" au lieu de planter.</Tip>
    <Quiz q="Pourquoi try-catch dans calculer() ?" opts={["Plus rapide","L utilisateur peut taper du texte au lieu d un nombre","Obligatoire","Pour les divisions"]} correct={1} onAns={onQ} done={done}/>
  </>)},

  {section:"Exercice",title:"Panneau de controle du Labo",type:"exercise",render:(onQ,done)=>(<>
    <div style={{background:C.gold+"15",borderRadius:10,padding:14,border:"1px solid "+C.gold+"40"}}>
      <div style={{fontSize:15,fontWeight:700,color:C.gold,marginBottom:4}}>{"Exercice \u2014 100 Credits R&D"}</div>
      <div style={{color:C.text,fontSize:13}}>Creez une interface graphique pour gerer les inventions du Labo.</div>
    </div>
    <div style={{color:C.text,fontSize:12,lineHeight:1.8,marginTop:10}}>
      <Strong>Fonctionnalites :</Strong><br/>
      {"1. JTextField + JButton \"Ajouter\" pour entrer une invention"}<br/>
      {"2. JList avec JScrollPane pour afficher toutes les inventions"}<br/>
      {"3. JButton \"Supprimer\" pour retirer l'invention selectionnee"}<br/>
      {"4. JLabel affichant le nombre total d'inventions"}<br/>
      {"5. Utiliser BorderLayout : saisie en NORTH, liste au CENTER, boutons en SOUTH"}<br/><br/>
      <Strong c={C.gold}>Bonus :</Strong><br/>
      {"6. JButton \"Rechercher\" qui filtre la liste"}<br/>
      {"7. JMenuBar avec menus Fichier (Quitter) et Aide (A propos)"}<br/>
      {"8. Connecter a l'ArrayList<Invention> du projet existant"}
    </div>
    <Quiz q="Pour P3 (Discuss paradigms), l event-driven doit :" opts={["Juste etre mentionne","Etre implemente avec un vrai programme Swing fonctionnel","Etre compare uniquement a OOP","Etre ignore"]} correct={1} onAns={onQ} done={done}/>
  </>)},

  {section:"Correction",title:"Correction Swing",type:"correction",render:(onQ,done)=>(<>
    <div style={{background:C.success+"12",borderRadius:8,padding:10,border:"1px solid "+C.success+"40",marginBottom:8}}><div style={{fontSize:13,fontWeight:700,color:C.success}}>Correction : Panneau de controle</div></div>
    <CodeBox code={CD[6]} hl={[24,25,26,27,28,29,30,31,32,33,34,35]}/>
    <Tip title="Architecture" color={C.success}>{"JFrame + BorderLayout. Panel Nord = saisie (FlowLayout). Centre = JList dans JScrollPane. Sud = boutons. Chaque bouton a son ActionListener lambda."}</Tip>
    <div style={{fontSize:12,color:C.text,lineHeight:2,marginTop:10}}>
      <Strong c={C.accent}>{"Checklist Essential Content LO2 \u2014 Events :"}</Strong><br/>
      {"\u2713 Programme event-driven fonctionnel"}<br/>
      {"\u2713 JFrame, JButton, JLabel, JTextField, JList utilises"}<br/>
      {"\u2713 ActionListener sur chaque bouton"}<br/>
      {"\u2713 Layout Manager (BorderLayout + FlowLayout)"}<br/>
      {"\u2713 Comparaison avec les 2 autres paradigmes possible"}<br/><br/>
      <Strong c={C.accent}>{"Pour P3 (Discuss paradigms) :"}</Strong><br/>
      Montrer le MEME programme (gestion d inventions) en :<br/>
      {"1. Procedural (Scanner + boucle menu dans main)"}<br/>
      {"2. OOP (classes Invention + Catalogue)"}<br/>
      {"3. Event-driven (ce Swing GUI)"}<br/>
      {"Comparer : structure, lisibilite, extensibilite"}
    </div>
    <Quiz q="Avec M14, le cours couvre maintenant :" opts={["Seulement OOP","Les 3 paradigmes avec du vrai code pour chacun","Seulement le debugging","Juste Swing"]} correct={1} onAns={onQ} done={done}/>
  </>)},
];

export default function M14Unified(){const[step,setStep]=useState(0);const[completed,setCompleted]=useState({});const[score,setScore]=useState(0);const[totalQ,setTotalQ]=useState(0);const[credits,setCredits]=useState(0);const[gameScore,setGameScore]=useState(null);const[ready,setReady]=useState(false);const[showMemo,setShowMemo]=useState(false);const allDone=Object.keys(completed).length>=STEPS.length;useEffect(()=>{ld().then(d=>{if(d){setCompleted(d.c||{});setScore(d.s||0);setTotalQ(d.t||0);setCredits(d.cr||0);setGameScore(d.gs);if(d.st!==undefined)setStep(d.st);}setReady(true);});},[]);const persist=useCallback((c,s,t,cr,gs,st)=>{sv({c,s,t,cr,gs,st});},[]);const hQ=(ok)=>{const nT=totalQ+1,nS=score+(ok?1:0),nCr=credits+(ok?5:0),nC={...completed,[step]:true};setTotalQ(nT);setScore(nS);setCredits(nCr);setCompleted(nC);persist(nC,nS,nT,nCr,gameScore,step);};const hGC=(gs)=>{setGameScore(gs);const nCr=credits+Math.floor(gs/2);setCredits(nCr);const nC={...completed,[step]:true};setCompleted(nC);persist(nC,score,totalQ,nCr,gs,step);};const go=(dir)=>{const ns=step+dir;if(ns>=0&&ns<STEPS.length){setStep(ns);persist(completed,score,totalQ,credits,gameScore,ns);}};if(!ready)return<div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",color:C.muted}}>Chargement...</div>;const cur=STEPS[step];const sections=[...new Set(STEPS.map(s=>s.section))];const secC={Theorie:C.secondary,Defi:C.gold,"Code guide":C.primary,Exercice:C.accent,Correction:C.success};return(<div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',system-ui,sans-serif"}}><style>{"@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}"}</style><div style={{padding:"8px 16px",borderBottom:"1px solid "+C.border,display:"flex",alignItems:"center",justifyContent:"space-between",background:C.card}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:10,letterSpacing:2,color:C.dimmed}}>CODEQUEST</span><span style={{color:C.border}}>|</span><span style={{fontSize:12,fontWeight:600,color:C.danger}}>{"M14 Swing & Events"}</span></div><div style={{display:"flex",gap:10,fontSize:11}}><span style={{color:C.muted}}>{"CR "+credits}</span></div></div><div style={{display:"flex",maxWidth:1100,margin:"0 auto",minHeight:"calc(100vh - 42px)"}}><div style={{width:200,borderRight:"1px solid "+C.border,padding:"10px 0",flexShrink:0,overflowY:"auto",display:"flex",flexDirection:"column"}}>{sections.map(sec=>{const sts=STEPS.map((s,i)=>({...s,idx:i})).filter(s=>s.section===sec);return(<div key={sec}><div style={{padding:"5px 12px",fontSize:9,letterSpacing:1,color:secC[sec]||C.dimmed,fontWeight:700,textTransform:"uppercase"}}>{sec}</div>{sts.map(s=>{const c2=s.idx===step,dn=!!completed[s.idx];return(<button key={s.idx} onClick={()=>{setStep(s.idx);persist(completed,score,totalQ,credits,gameScore,s.idx);}} style={{display:"flex",alignItems:"center",gap:5,width:"100%",padding:"4px 12px 4px 20px",border:"none",background:c2?C.accent+"12":"transparent",borderLeft:c2?"2px solid "+C.accent:"2px solid transparent",cursor:"pointer",fontFamily:"inherit",fontSize:11,color:c2?C.accent:dn?C.success:C.muted,textAlign:"left"}}><span style={{fontSize:8}}>{dn?"\u2713":"\u25CB"}</span>{s.title}</button>);})}</div>);})}
<div style={{padding:10,marginTop:"auto"}}><button onClick={()=>allDone&&setShowMemo(!showMemo)} style={{width:"100%",padding:"8px",borderRadius:8,border:"1px solid "+(allDone?C.gold:C.border),background:allDone?C.gold+"15":"transparent",color:allDone?C.gold:C.dimmed,cursor:allDone?"pointer":"default",fontFamily:"inherit",fontSize:11,fontWeight:600}}>{allDone?"\uD83D\uDCCB Memo":"\uD83D\uDD12 Memo"}</button></div></div><div style={{flex:1,padding:"16px 24px",overflowY:"auto",maxHeight:"calc(100vh - 42px)"}}>{showMemo&&allDone?<Memo/>:(<div key={step} style={{animation:"fadeIn .25s"}}><h2 style={{fontSize:18,fontWeight:700,marginBottom:12}}>{cur.title}</h2>{cur.type==="game"?cur.render(hQ,!!completed[step],hGC):cur.render(hQ,!!completed[step])}<div style={{display:"flex",justifyContent:"space-between",marginTop:24,paddingTop:10,borderTop:"1px solid "+C.border}}><button onClick={()=>go(-1)} disabled={step===0} style={{padding:"7px 16px",borderRadius:7,border:"1px solid "+C.border,background:"transparent",color:step===0?C.border:C.muted,cursor:step===0?"default":"pointer",fontFamily:"inherit",fontSize:12}}>{"\u2190"}</button><button onClick={()=>go(1)} disabled={step===STEPS.length-1} style={{padding:"7px 16px",borderRadius:7,border:"none",background:step===STEPS.length-1?C.border:C.accent,color:step===STEPS.length-1?C.muted:C.bg,cursor:step===STEPS.length-1?"default":"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600}}>{"\u2192"}</button></div></div>)}</div></div></div>);}
