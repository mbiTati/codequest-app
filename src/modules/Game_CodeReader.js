import { useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Check, X, Eye, Zap, Trophy } from "lucide-react";

const C={bg:"#0a0f1a",card:"#111827",accent:"#32E0C4",gold:"#F59E0B",text:"#e2e8f0",muted:"#94a3b8",border:"#1e293b",danger:"#EF4444",success:"#10B981",primary:"#0D7377",dimmed:"#64748b"};

const CHALLENGES = [
  // Level 1: Variables & Conditions
  {
    title: "Variables simples",
    difficulty: 1,
    code: "int a = 5;\nint b = 3;\nint c = a + b * 2;\nSystem.out.println(c);",
    question: "Que s'affiche-t-il ?",
    options: ["16", "11", "13", "8"],
    correct: 1,
    trace: ["a = 5", "b = 3", "c = 5 + 3*2 = 5 + 6 = 11 (priorite * avant +)", "Affiche : 11"],
  },
  {
    title: "Condition if/else",
    difficulty: 1,
    code: 'int x = 7;\nString result;\nif (x > 10) {\n    result = "grand";\n} else if (x > 5) {\n    result = "moyen";\n} else {\n    result = "petit";\n}\nSystem.out.println(result);',
    question: "Que s'affiche-t-il ?",
    options: ['"grand"', '"moyen"', '"petit"', "Erreur"],
    correct: 1,
    trace: ["x = 7", "x > 10 ? 7 > 10 = false", "x > 5 ? 7 > 5 = true -> result = \"moyen\"", "Affiche : moyen"],
  },
  {
    title: "Boucle for",
    difficulty: 1,
    code: "int total = 0;\nfor (int i = 1; i <= 4; i++) {\n    total += i;\n}\nSystem.out.println(total);",
    question: "Que s'affiche-t-il ?",
    options: ["4", "10", "15", "6"],
    correct: 1,
    trace: ["i=1: total = 0+1 = 1", "i=2: total = 1+2 = 3", "i=3: total = 3+3 = 6", "i=4: total = 6+4 = 10", "Affiche : 10"],
  },
  // Level 2: Strings & Arrays
  {
    title: "Manipulation String",
    difficulty: 2,
    code: 'String s = "Hello World";\nSystem.out.println(s.length());\nSystem.out.println(s.substring(0, 5));\nSystem.out.println(s.toUpperCase().charAt(6));',
    question: "La 3eme ligne affiche :",
    options: ["W", "w", "O", " "],
    correct: 0,
    trace: ["s = \"Hello World\" (11 caracteres)", "s.length() = 11", "s.substring(0,5) = \"Hello\"", "s.toUpperCase() = \"HELLO WORLD\", charAt(6) = 'W'"],
  },
  {
    title: "Tableau et boucle",
    difficulty: 2,
    code: 'int[] tab = {3, 7, 2, 9, 1};\nint max = tab[0];\nfor (int i = 1; i < tab.length; i++) {\n    if (tab[i] > max) {\n        max = tab[i];\n    }\n}\nSystem.out.println(max);',
    question: "Que s'affiche-t-il ?",
    options: ["3", "7", "9", "1"],
    correct: 2,
    trace: ["max = 3 (tab[0])", "i=1: tab[1]=7 > 3 ? oui -> max=7", "i=2: tab[2]=2 > 7 ? non", "i=3: tab[3]=9 > 7 ? oui -> max=9", "i=4: tab[4]=1 > 9 ? non", "Affiche : 9"],
  },
  {
    title: "Switch + break",
    difficulty: 2,
    code: 'int jour = 3;\nString nom;\nswitch (jour) {\n    case 1: nom = "Lundi"; break;\n    case 2: nom = "Mardi"; break;\n    case 3: nom = "Mercredi";\n    case 4: nom = "Jeudi"; break;\n    default: nom = "Autre";\n}\nSystem.out.println(nom);',
    question: "Que s'affiche-t-il ?",
    options: ['"Mercredi"', '"Jeudi"', '"Autre"', "Erreur"],
    correct: 1,
    trace: ["jour = 3 -> case 3", "nom = \"Mercredi\" (pas de break !)", "Effet cascade -> case 4 : nom = \"Jeudi\" (break)", "Affiche : Jeudi"],
  },
  // Level 3: OOP
  {
    title: "Constructeur et this",
    difficulty: 3,
    code: 'class Compteur {\n    private int valeur;\n    public Compteur(int v) { this.valeur = v; }\n    public void incrementer() { valeur++; }\n    public int getValeur() { return valeur; }\n}\n// Dans main:\nCompteur c = new Compteur(5);\nc.incrementer();\nc.incrementer();\nc.incrementer();\nSystem.out.println(c.getValeur());',
    question: "Que s'affiche-t-il ?",
    options: ["5", "6", "7", "8"],
    correct: 3,
    trace: ["new Compteur(5) -> valeur = 5", "incrementer() -> valeur = 6", "incrementer() -> valeur = 7", "incrementer() -> valeur = 8", "getValeur() = 8"],
  },
  {
    title: "Heritage et Override",
    difficulty: 3,
    code: 'class A {\n    public String parler() { return "A"; }\n}\nclass B extends A {\n    public String parler() { return "B"; }\n}\nclass C extends B {\n    // pas de parler()\n}\n// Dans main:\nA obj = new C();\nSystem.out.println(obj.parler());',
    question: "Que s'affiche-t-il ?",
    options: ['"A"', '"B"', '"C"', "Erreur"],
    correct: 1,
    trace: ["obj est de type A mais l'objet reel est C", "C n'a pas parler() -> remonte a B", "B a parler() -> retourne \"B\"", "Polymorphisme : le type REEL (C->B) decide"],
  },
  {
    title: "ArrayList et for-each",
    difficulty: 3,
    code: 'ArrayList<Integer> liste = new ArrayList<>();\nliste.add(10);\nliste.add(20);\nliste.add(30);\nliste.remove(1);\nint somme = 0;\nfor (int n : liste) {\n    somme += n;\n}\nSystem.out.println(somme);',
    question: "Que s'affiche-t-il ?",
    options: ["60", "30", "40", "50"],
    correct: 2,
    trace: ["liste = [10, 20, 30]", "remove(1) retire l'INDEX 1 (pas la valeur 1!)", "liste = [10, 30]", "somme = 10 + 30 = 40", "Affiche : 40"],
  },
];

export default function GameCodeReader() {
  const [screen, setScreen] = useState("menu");
  const [qIdx, setQIdx] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showTrace, setShowTrace] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  const q = CHALLENGES[qIdx];

  const answer = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    setTotal(t => t + 1);
    if (idx === q.correct) setScore(s => s + 1);
  };

  const next = () => {
    if (qIdx + 1 >= CHALLENGES.length) {
      setScreen("result");
      return;
    }
    setQIdx(i => i + 1);
    setAnswered(false);
    setSelected(null);
    setShowTrace(false);
  };

  const restart = () => {
    setQIdx(0); setScore(0); setTotal(0);
    setAnswered(false); setSelected(null); setShowTrace(false);
    setScreen("playing");
  };

  if (screen === "menu") {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ padding: "6px 16px", background: C.card, borderBottom: "1px solid " + C.border, display: "flex", alignItems: "center", justifyContent: "space-between", position: "fixed", top: 0, left: 0, right: 0, zIndex: 10 }}>
          <button onClick={() => window.history.back()} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 12px", borderRadius: 7, border: "1px solid " + C.border, background: "transparent", color: C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 11 }}><ChevronLeft size={14} /> Retour</button>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.primary }}>Lecture de Code</span>
          <span />
        </div>
        <BookOpen size={40} color={C.primary} style={{ marginBottom: 12 }} />
        <div style={{ fontSize: 24, fontWeight: 700, color: C.primary, marginBottom: 8 }}>Lecture de Code</div>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 24, textAlign: "center", maxWidth: 400 }}>
          Lisez le code Java, tracez l'execution mentalement, et predisez la sortie. 9 defis du simple au complexe.
        </div>
        <button onClick={() => { restart(); setScreen("playing"); }} style={{
          padding: "14px 40px", borderRadius: 10, border: "none",
          background: C.primary, color: "#fff", cursor: "pointer",
          fontFamily: "inherit", fontSize: 16, fontWeight: 700,
        }}>Commencer</button>
      </div>
    );
  }

  if (screen === "result") {
    const pct = Math.round((score / total) * 100);
    return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <Trophy size={48} color={C.gold} style={{ marginBottom: 12 }} />
        <div style={{ fontSize: 22, fontWeight: 700, color: C.gold, marginBottom: 8 }}>Termine !</div>
        <div style={{ fontSize: 36, fontWeight: 800, color: pct >= 70 ? C.success : pct >= 40 ? C.gold : C.danger }}>{score + "/" + total}</div>
        <div style={{ fontSize: 14, color: C.muted, marginBottom: 20 }}>{pct + "% de bonnes reponses"}</div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={restart} style={{ padding: "10px 20px", borderRadius: 8, border: "1px solid " + C.border, background: C.card, color: C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 12 }}>Recommencer</button>
          <button onClick={() => setScreen("menu")} style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: C.primary, color: "#fff", cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600 }}>Menu</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      <div style={{ padding: "6px 16px", background: C.card, borderBottom: "1px solid " + C.border, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => setScreen("menu")} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 12px", borderRadius: 7, border: "1px solid " + C.border, background: "transparent", color: C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 11 }}><ChevronLeft size={14} /> Menu</button>
        <span style={{ fontSize: 12, fontWeight: 700, color: C.primary }}>{"Question " + (qIdx + 1) + "/" + CHALLENGES.length}</span>
        <span style={{ fontSize: 12, color: C.gold, fontWeight: 700 }}>{score + " pts"}</span>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{q.title}</div>
          <span style={{ fontSize: 10, color: C.gold }}>{"Difficulte " + q.difficulty + "/3"}</span>
        </div>

        {/* Code block */}
        <div style={{ background: C.card, borderRadius: 10, border: "1px solid " + C.border, overflow: "hidden", marginBottom: 12 }}>
          {q.code.split("\n").map((line, i) => (
            <div key={i} style={{ display: "flex", padding: "2px 0" }}>
              <span style={{ width: 32, textAlign: "right", paddingRight: 8, color: C.dimmed, fontSize: 11, userSelect: "none" }}>{i + 1}</span>
              <span style={{ color: C.accent, fontSize: 12, fontFamily: "Consolas, monospace", whiteSpace: "pre" }}>{line}</span>
            </div>
          ))}
        </div>

        {/* Question */}
        <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 10 }}>{q.question}</div>

        {/* Options */}
        {q.options.map((opt, i) => {
          let bg = C.card, bc = C.border, col = C.text;
          if (answered && i === q.correct) { bg = C.success + "20"; bc = C.success; col = C.success; }
          else if (answered && selected === i) { bg = C.danger + "20"; bc = C.danger; col = C.danger; }
          return (
            <button key={i} onClick={() => answer(i)} style={{
              display: "block", width: "100%", textAlign: "left", padding: "10px 14px",
              marginBottom: 4, borderRadius: 8, border: "1px solid " + bc,
              background: bg, color: col, cursor: answered ? "default" : "pointer",
              fontFamily: "inherit", fontSize: 13,
            }}>{String.fromCharCode(65 + i) + ". " + opt}</button>
          );
        })}

        {/* Feedback */}
        {answered && (
          <div style={{ marginTop: 10 }}>
            <div style={{
              padding: "8px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600,
              background: selected === q.correct ? C.success + "15" : C.danger + "15",
              color: selected === q.correct ? C.success : C.danger,
              marginBottom: 8,
            }}>
              {selected === q.correct ? "Correct !" : "Incorrect — la reponse est " + String.fromCharCode(65 + q.correct) + ". " + q.options[q.correct]}
            </div>

            {/* Trace button */}
            <button onClick={() => setShowTrace(!showTrace)} style={{
              display: "flex", alignItems: "center", gap: 4,
              padding: "6px 12px", borderRadius: 6, border: "1px solid " + C.primary + "40",
              background: C.primary + "10", color: C.primary, cursor: "pointer",
              fontFamily: "inherit", fontSize: 11, fontWeight: 600, marginBottom: 8,
            }}><Eye size={12} /> {showTrace ? "Masquer le trace" : "Voir le trace d'execution"}</button>

            {showTrace && (
              <div style={{ background: C.card, borderRadius: 8, padding: 10, border: "1px solid " + C.border }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: C.gold, marginBottom: 6 }}>TRACE D'EXECUTION</div>
                {q.trace.map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 6, fontSize: 11, color: C.text, marginBottom: 3 }}>
                    <span style={{ color: C.accent, fontWeight: 700, flexShrink: 0 }}>{"→"}</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            )}

            <button onClick={next} style={{
              width: "100%", padding: "10px", borderRadius: 8, border: "none",
              background: C.accent, color: C.bg, cursor: "pointer",
              fontFamily: "inherit", fontSize: 13, fontWeight: 700, marginTop: 8,
            }}>{qIdx + 1 >= CHALLENGES.length ? "Voir le resultat" : "Question suivante"}</button>
          </div>
        )}
      </div>
    </div>
  );
}
