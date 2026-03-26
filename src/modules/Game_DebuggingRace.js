import { useState, useEffect, useRef } from "react";
import { Bug, Clock, Trophy, ChevronLeft, Zap } from "lucide-react";

const C={bg:"#0a0f1a",card:"#111827",accent:"#32E0C4",gold:"#F59E0B",text:"#e2e8f0",muted:"#94a3b8",border:"#1e293b",danger:"#EF4444",success:"#10B981",primary:"#0D7377",dimmed:"#64748b"};

const CHALLENGES = [
  {
    title: "Le Catalogue buggé",
    difficulty: 1,
    code: [
      "public class Catalogue {",
      "    private ArrayList<String> items;",
      "",
      "    public Catalogue() {",
      "        // items n'est jamais initialisé !",
      "    }",
      "",
      "    public void ajouter(String item) {",
      "        items.add(item);",
      "    }",
      "",
      "    public void afficher() {",
      "        for (int i = 0; i <= items.size(); i++) {",
      "            System.out.println(items.get(i));",
      "        }",
      "    }",
      "",
      "    public boolean contient(String nom) {",
      "        return items == nom;",
      "    }",
      "}"
    ],
    bugs: [
      { line: 4, hint: "ArrayList jamais initialisé", fix: "items = new ArrayList<>();", explanation: "NullPointerException car items est null" },
      { line: 12, hint: "<= au lieu de <", fix: "for (int i = 0; i < items.size(); i++) {", explanation: "IndexOutOfBoundsException (off-by-one)" },
      { line: 18, hint: "== compare les références, pas le contenu", fix: "return items.contains(nom);", explanation: "== sur des String compare les adresses mémoire" },
    ]
  },
  {
    title: "La Calculatrice cassée",
    difficulty: 2,
    code: [
      "public class Calculatrice {",
      "    public static int diviser(int a, int b) {",
      "        return a / b;",
      "    }",
      "",
      "    public static double moyenne(int[] notes) {",
      "        int somme = 0;",
      "        for (int i = 1; i < notes.length; i++) {",
      "            somme += notes[i];",
      "        }",
      "        return somme / notes.length;",
      "    }",
      "",
      "    public static String evaluer(double moyenne) {",
      "        if (moyenne > 16)",
      "            return \"Excellent\";",
      "        else if (moyenne > 12)",
      "            return \"Bien\";",
      "        else if (moyenne > 10)",
      "            return \"Passable\";",
      "        return null;",
      "    }",
      "}"
    ],
    bugs: [
      { line: 2, hint: "Pas de vérification division par zéro", fix: "if (b == 0) throw new ArithmeticException();", explanation: "ArithmeticException si b vaut 0" },
      { line: 7, hint: "Commence à i=1 au lieu de i=0", fix: "for (int i = 0; i < notes.length; i++) {", explanation: "La première note est ignorée" },
      { line: 10, hint: "Division entière (int/int = int)", fix: "return (double) somme / notes.length;", explanation: "15/4 = 3 au lieu de 3.75" },
      { line: 20, hint: "Retourne null pour les notes < 10", fix: "return \"Insuffisant\";", explanation: "NullPointerException si moyenne < 10" },
    ]
  },
  {
    title: "L'Héritage défaillant",
    difficulty: 3,
    code: [
      "public class Animal {",
      "    private String nom;",
      "    public Animal(String nom) { this.nom = nom; }",
      "    public String decrire() { return nom; }",
      "}",
      "",
      "public class Chien extends Animal {",
      "    private String race;",
      "    public Chien(String nom, String race) {",
      "        this.race = race;",
      "    }",
      "",
      "    public String decrire() {",
      "        return nom + \" (\" + race + \")\";",
      "    }",
      "}",
      "",
      "public class Main {",
      "    public static void main(String[] args) {",
      "        Animal a = new Chien(\"Rex\", \"Berger\");",
      "        System.out.println(a.decrire());",
      "        Chien c = (Chien) new Animal(\"Minou\");",
      "    }",
      "}"
    ],
    bugs: [
      { line: 9, hint: "super() manquant dans le constructeur", fix: "super(nom);", explanation: "Le constructeur parent n'est pas appelé" },
      { line: 13, hint: "nom est private dans Animal, pas accessible", fix: "return decrire() + \" (\" + race + \")\";", explanation: "Utiliser getNom() ou super.decrire() au lieu d'accéder directement" },
      { line: 12, hint: "@Override manquant", fix: "@Override", explanation: "Sans @Override, pas de vérification du compilateur" },
      { line: 21, hint: "ClassCastException — un Animal n'est pas un Chien", fix: "// Animal a2 = new Animal(\"Minou\"); // pas de cast", explanation: "On ne peut pas caster un parent en enfant" },
    ]
  },
];

export default function GameDebuggingRace() {
  const [screen, setScreen] = useState("menu");
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [foundBugs, setFoundBugs] = useState([]);
  const [selectedLine, setSelectedLine] = useState(null);
  const [timer, setTimer] = useState(0);
  const [showHint, setShowHint] = useState(null);
  const [totalTime, setTotalTime] = useState(0);
  const [totalFound, setTotalFound] = useState(0);
  const timerRef = useRef(null);

  const challenge = CHALLENGES[challengeIdx];

  useEffect(() => {
    if (screen === "playing") {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [screen]);

  const startChallenge = (idx) => {
    setChallengeIdx(idx);
    setFoundBugs([]);
    setSelectedLine(null);
    setTimer(0);
    setShowHint(null);
    setScreen("playing");
  };

  const clickLine = (lineIdx) => {
    if (screen !== "playing") return;
    setSelectedLine(lineIdx);
    const bugIdx = challenge.bugs.findIndex(b => b.line === lineIdx);
    if (bugIdx >= 0 && !foundBugs.includes(lineIdx)) {
      setFoundBugs(prev => [...prev, lineIdx]);
      setShowHint(challenge.bugs[bugIdx]);
      if (foundBugs.length + 1 >= challenge.bugs.length) {
        clearInterval(timerRef.current);
        setTotalTime(prev => prev + timer);
        setTotalFound(prev => prev + challenge.bugs.length);
        setTimeout(() => setScreen("result"), 1500);
      }
    } else if (bugIdx < 0) {
      setShowHint({ hint: "Pas de bug ici !", explanation: "Continuez à chercher...", fix: "", wrong: true });
      setTimeout(() => { if (showHint?.wrong) setShowHint(null); }, 1500);
    }
  };

  const mm = Math.floor(timer / 60);
  const ss = timer % 60;

  if (screen === "menu") {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ padding: "6px 16px", background: C.card, borderBottom: "1px solid " + C.border, display: "flex", alignItems: "center", justifyContent: "space-between", position: "fixed", top: 0, left: 0, right: 0, zIndex: 10 }}>
          <button onClick={() => window.history.back()} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 12px", borderRadius: 7, border: "1px solid " + C.border, background: "transparent", color: C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 11 }}><ChevronLeft size={14} /> Retour</button>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.danger }}>Debugging Race</span>
          <span />
        </div>
        <Bug size={40} color={C.danger} style={{ marginBottom: 12 }} />
        <div style={{ fontSize: 24, fontWeight: 700, color: C.danger, marginBottom: 8 }}>Debugging Race</div>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 24, textAlign: "center", maxWidth: 400 }}>
          Trouvez les bugs dans le code Java le plus vite possible. Cliquez sur la ligne bugguée !
        </div>
        <div style={{ display: "grid", gap: 10, width: "100%", maxWidth: 400 }}>
          {CHALLENGES.map((ch, i) => (
            <button key={i} onClick={() => startChallenge(i)} style={{
              padding: "14px 18px", borderRadius: 10, border: "1px solid " + C.border,
              background: C.card, cursor: "pointer", fontFamily: "inherit", textAlign: "left",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{ch.title}</span>
                <span style={{ fontSize: 10, color: C.gold }}>{"*".repeat(ch.difficulty)}</span>
              </div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{ch.bugs.length + " bugs a trouver"}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (screen === "result") {
    const timeScore = Math.max(0, 300 - timer * 5);
    const bugScore = foundBugs.length * 100;
    const total = timeScore + bugScore;
    return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <Trophy size={48} color={C.gold} style={{ marginBottom: 12 }} />
        <div style={{ fontSize: 22, fontWeight: 700, color: C.gold, marginBottom: 8 }}>Challenge termine !</div>
        <div style={{ fontSize: 14, color: C.text, marginBottom: 4 }}>{challenge.title}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, margin: "16px 0" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.accent }}>{foundBugs.length + "/" + challenge.bugs.length}</div>
            <div style={{ fontSize: 10, color: C.muted }}>Bugs trouves</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.primary }}>{mm + ":" + ss.toString().padStart(2, "0")}</div>
            <div style={{ fontSize: 10, color: C.muted }}>Temps</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.gold }}>{total}</div>
            <div style={{ fontSize: 10, color: C.muted }}>Score</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => startChallenge(challengeIdx)} style={{ padding: "10px 20px", borderRadius: 8, border: "1px solid " + C.border, background: C.card, color: C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 12 }}>Recommencer</button>
          <button onClick={() => setScreen("menu")} style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: C.accent, color: C.bg, cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600 }}>Autre challenge</button>
        </div>
      </div>
    );
  }

  // Playing screen
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      <div style={{ padding: "6px 16px", background: C.card, borderBottom: "1px solid " + C.border, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => { clearInterval(timerRef.current); setScreen("menu"); }} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 12px", borderRadius: 7, border: "1px solid " + C.border, background: "transparent", color: C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 11 }}><ChevronLeft size={14} /> Retour</button>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.danger }}>{challenge.title}</span>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: C.accent, fontWeight: 700 }}><Bug size={12} /> {foundBugs.length + "/" + challenge.bugs.length}</span>
          <span style={{ fontSize: 12, color: C.gold, fontWeight: 700 }}><Clock size={12} /> {mm + ":" + ss.toString().padStart(2, "0")}</span>
        </div>
      </div>

      <div style={{ display: "flex", maxWidth: 1100, margin: "0 auto" }}>
        {/* Code panel */}
        <div style={{ flex: 1, padding: "12px 0", overflowX: "auto" }}>
          <div style={{ background: C.card, borderRadius: 10, margin: "0 12px", border: "1px solid " + C.border, overflow: "hidden" }}>
            {challenge.code.map((line, i) => {
              const isBug = challenge.bugs.some(b => b.line === i);
              const isFound = foundBugs.includes(i);
              const isSelected = selectedLine === i;
              return (
                <div key={i} onClick={() => clickLine(i)} style={{
                  display: "flex", padding: "2px 0", cursor: "pointer",
                  background: isFound ? C.success + "15" : isSelected ? (isBug ? C.danger + "15" : C.gold + "08") : "transparent",
                  borderLeft: isFound ? "3px solid " + C.success : isSelected ? "3px solid " + (isBug ? C.danger : C.gold) : "3px solid transparent",
                  transition: "all .15s",
                }}>
                  <span style={{ width: 36, textAlign: "right", paddingRight: 8, color: C.dimmed, fontSize: 11, userSelect: "none", flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ color: isFound ? C.success : C.accent, fontSize: 12, fontFamily: "Consolas, monospace", whiteSpace: "pre" }}>
                    {line}
                    {isFound && " ✓"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info panel */}
        <div style={{ width: 280, padding: 12, borderLeft: "1px solid " + C.border }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, marginBottom: 8 }}>INSTRUCTIONS</div>
          <div style={{ fontSize: 11, color: C.text, lineHeight: 1.6, marginBottom: 12 }}>
            Cliquez sur les lignes qui contiennent un bug. Trouvez les {challenge.bugs.length} bugs le plus vite possible !
          </div>

          {showHint && (
            <div style={{
              background: showHint.wrong ? C.gold + "15" : C.success + "15",
              borderRadius: 8, padding: 10, marginBottom: 10,
              border: "1px solid " + (showHint.wrong ? C.gold : C.success) + "30",
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: showHint.wrong ? C.gold : C.success, marginBottom: 4 }}>
                {showHint.wrong ? "Pas de bug ici" : "Bug trouve !"}
              </div>
              <div style={{ fontSize: 10, color: C.text, marginBottom: 4 }}>{showHint.hint}</div>
              {showHint.explanation && !showHint.wrong && (
                <div style={{ fontSize: 10, color: C.muted, marginTop: 4, fontStyle: "italic" }}>{showHint.explanation}</div>
              )}
              {showHint.fix && (
                <div style={{ fontSize: 9, color: C.accent, fontFamily: "monospace", marginTop: 6, padding: "4px 6px", background: C.bg, borderRadius: 4 }}>{showHint.fix}</div>
              )}
            </div>
          )}

          <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, marginBottom: 6 }}>BUGS TROUVES</div>
          {challenge.bugs.map((b, i) => (
            <div key={i} style={{
              fontSize: 10, padding: "4px 8px", borderRadius: 4, marginBottom: 3,
              background: foundBugs.includes(b.line) ? C.success + "15" : C.border + "30",
              color: foundBugs.includes(b.line) ? C.success : C.dimmed,
            }}>
              {foundBugs.includes(b.line) ? ("L" + (b.line + 1) + " : " + b.hint) : ("Bug " + (i + 1) + " : ???")}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
