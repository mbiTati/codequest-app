import { useState, useEffect } from "react";

const C = {
  bg: "#0a0f1a", card: "#111827", accent: "#32E0C4", gold: "#F59E0B",
  text: "#e2e8f0", muted: "#94a3b8", dimmed: "#64748b", border: "#1e293b",
  success: "#10B981", danger: "#EF4444", primary: "#0D7377",
  code: "#1E293B", codeText: "#32E0C4", keyword: "#c792ea",
};

const KEY = "cq-game-oop-factory";

const BLUEPRINTS = [
  {
    title: "Niveau 1 : Assembler les attributs",
    desc: "Sélectionnez les bons attributs pour une classe Potion",
    target: "Potion",
    pieces: [
      { id: "a1", text: "private String nom", correct: true, type: "attr" },
      { id: "a2", text: "private int puissance", correct: true, type: "attr" },
      { id: "a3", text: "public String nom", correct: false, type: "attr", why: "Attributs = private !" },
      { id: "a4", text: "private double prix", correct: true, type: "attr" },
      { id: "a5", text: "int puissance", correct: false, type: "attr", why: "Il manque private" },
      { id: "a6", text: "private boolean nom", correct: false, type: "attr", why: "Un nom est un String, pas boolean" },
    ],
    phase: "attr",
  },
  {
    title: "Niveau 2 : Le constructeur",
    desc: "Assemblez le bon constructeur pour Potion(nom, puissance, prix)",
    target: "Potion",
    pieces: [
      { id: "c1", text: "public Potion(String nom, int puissance, double prix)", correct: true, type: "header" },
      { id: "c2", text: "this.nom = nom;", correct: true, type: "body" },
      { id: "c3", text: "this.puissance = puissance;", correct: true, type: "body" },
      { id: "c4", text: "this.prix = prix;", correct: true, type: "body" },
      { id: "c5", text: "nom = nom;", correct: false, type: "body", why: "Sans this, le paramètre s'assigne à lui-même !" },
      { id: "c6", text: "public void Potion(String nom)", correct: false, type: "header", why: "Un constructeur n'a PAS de void !" },
    ],
    phase: "constructor",
  },
  {
    title: "Niveau 3 : Getters & Setters",
    desc: "Quelles méthodes sont correctes ?",
    target: "Potion",
    pieces: [
      { id: "g1", text: "public String getNom() { return nom; }", correct: true, type: "method" },
      { id: "g2", text: "public void setNom(String n) {\n  if(n!=null) this.nom = n;\n}", correct: true, type: "method" },
      { id: "g3", text: "private String getNom() { return nom; }", correct: false, type: "method", why: "Un getter doit être public !" },
      { id: "g4", text: "public void getNom() { return nom; }", correct: false, type: "method", why: "void ne peut pas retourner une valeur !" },
      { id: "g5", text: "public int getPuissance() { return puissance; }", correct: true, type: "method" },
      { id: "g6", text: "public void setPuissance(int p) {\n  if(p >= 0) this.puissance = p;\n}", correct: true, type: "method" },
    ],
    phase: "methods",
  },
  {
    title: "Niveau 4 : Méthode métier",
    desc: "Ajoutez une méthode utiliser() qui réduit la puissance de 10",
    target: "Potion",
    pieces: [
      { id: "m1", text: "public void utiliser() {\n  if(puissance >= 10)\n    puissance -= 10;\n}", correct: true, type: "method" },
      { id: "m2", text: "public void utiliser() {\n  puissance -= 10;\n}", correct: false, type: "method", why: "Pas de validation ! puissance pourrait devenir négative" },
      { id: "m3", text: "public int utiliser() {\n  return puissance - 10;\n}", correct: false, type: "method", why: "Ça retourne un calcul mais ne modifie PAS l'attribut" },
      { id: "m4", text: "public String toString() {\n  return nom + \" (\" + puissance + \")\";\n}", correct: true, type: "method" },
    ],
    phase: "business",
  },
  {
    title: "Niveau 5 : Trouver les bugs !",
    desc: "Ce code a 4 erreurs. Trouvez-les !",
    target: "Potion",
    code: `public class Potion {
    public String nom;
    private int puissance;
    
    public void Potion(String nom, int puissance) {
        nom = nom;
        this.puissance = puissance;
    }
    
    public void getNom() {
        return nom;
    }
}`,
    bugs: [
      { line: 2, desc: "public String nom → devrait être private" },
      { line: 5, desc: "public void Potion → pas de void sur un constructeur" },
      { line: 6, desc: "nom = nom → il faut this.nom = nom" },
      { line: 10, desc: "public void getNom → void ne peut pas retourner, devrait être String" },
    ],
    phase: "debug",
  },
];

function ClassPreview({ pieces, className }) {
  const attrs = pieces.filter(p => p.type === "attr");
  const constParts = pieces.filter(p => p.type === "header" || p.type === "body");
  const methods = pieces.filter(p => p.type === "method" || p.type === "business");

  return (
    <div style={{ background: C.code, borderRadius: 10, padding: 14, border: `1px solid ${C.accent}40`, margin: "10px 0" }}>
      <div style={{ fontFamily: "monospace", fontSize: 12, color: C.codeText }}>
        <div><span style={{ color: C.keyword }}>public class</span> <span style={{ color: C.accent }}>{className}</span> {"{"}</div>
        {attrs.map((a, i) => <div key={i} style={{ paddingLeft: 16, color: C.muted }}>{a.text};</div>)}
        {constParts.length > 0 && <div style={{ paddingLeft: 16, marginTop: 6 }}>{constParts.map((c, i) => <div key={i} style={{ color: c.type === "header" ? C.keyword : C.codeText }}>{c.type === "header" ? c.text + " {" : "    " + c.text}</div>)}{constParts.some(c => c.type === "header") && <div style={{ color: C.codeText }}>{"    }"}</div>}</div>}
        {methods.map((m, i) => <div key={i} style={{ paddingLeft: 16, marginTop: 4, color: C.codeText, whiteSpace: "pre-wrap" }}>{m.text}</div>)}
        <div>{"}"}</div>
      </div>
    </div>
  );
}

export default function OOPFactoryGame() {
  const [screen, setScreen] = useState("menu");
  const [level, setLevel] = useState(0);
  const [selected, setSelected] = useState([]);
  const [foundBugs, setFoundBugs] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([]);

  useEffect(() => { (async () => { try { const r = await window.storage.get(KEY); if (r) setHistory(JSON.parse(r.value)); } catch {} })(); }, []);

  const bp = BLUEPRINTS[level];

  const toggle = (id) => {
    if (answered) return;
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  };

  const clickBugLine = (lineIdx) => {
    if (answered) return;
    const bugIdx = bp.bugs.findIndex(b => b.line === lineIdx + 1);
    if (bugIdx >= 0 && !foundBugs.includes(bugIdx)) setFoundBugs(f => [...f, bugIdx]);
  };

  const check = () => {
    setAnswered(true);
    if (bp.phase === "debug") {
      setScore(s => s + foundBugs.length * 10);
    } else {
      const correctIds = bp.pieces.filter(p => p.correct).map(p => p.id);
      const allCorrect = correctIds.every(id => selected.includes(id)) && selected.every(id => bp.pieces.find(p => p.id === id)?.correct);
      setScore(s => s + (allCorrect ? 30 : selected.filter(id => bp.pieces.find(p => p.id === id)?.correct).length * 8));
    }
  };

  const next = () => {
    if (level + 1 >= BLUEPRINTS.length) {
      const entry = { date: new Date().toLocaleDateString("fr-CH"), score };
      const newH = [...history, entry].slice(-20);
      setHistory(newH);
      try { window.storage.set(KEY, JSON.stringify(newH)); } catch {}
      setScreen("result");
    } else {
      setLevel(l => l + 1); setSelected([]); setFoundBugs([]); setAnswered(false);
    }
  };

  if (screen === "menu") return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ animation: "fadeIn .4s", textAlign: "center", maxWidth: 480 }}>
        <div style={{ fontSize: 12, letterSpacing: 3, color: C.dimmed, marginBottom: 8 }}>CODEQUEST · MODULE 03</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.accent, marginBottom: 8 }}>L'Usine à Objets</div>
        <div style={{ fontSize: 14, color: C.muted, marginBottom: 24, lineHeight: 1.6 }}>
          Assemblez une classe Java pièce par pièce ! Choisissez les bons attributs, constructeur, getters/setters, et trouvez les bugs.
          <br /><strong style={{ color: C.text }}>5 niveaux</strong> pour construire la classe Potion.
        </div>
        <button onClick={() => { setLevel(0); setScore(0); setSelected([]); setFoundBugs([]); setAnswered(false); setScreen("game"); }} style={{
          padding: "14px 36px", borderRadius: 12, border: "none", background: C.accent,
          color: C.bg, cursor: "pointer", fontFamily: "inherit", fontSize: 16, fontWeight: 700,
        }}>Construire</button>
        {history.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: 2, color: C.dimmed, marginBottom: 8 }}>MEILLEURS SCORES</div>
            {[...history].reverse().slice(0, 5).map((h, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 12px", borderRadius: 6, background: C.card, border: `1px solid ${C.border}`, fontSize: 11, marginBottom: 3 }}>
                <span style={{ color: C.dimmed }}>{h.date}</span>
                <span style={{ color: C.gold, fontWeight: 700 }}>{h.score} pts</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (screen === "result") return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ animation: "fadeIn .4s", textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>{score >= 130 ? "S" : score >= 90 ? "A" : "B"}</div>
        <div style={{ fontSize: 24, fontWeight: 800, color: C.gold }}>{score} points</div>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 8 }}>
          {score >= 130 ? "L'usine tourne à plein régime !" : "Continuez à pratiquer !"}
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20 }}>
          <button onClick={() => { setLevel(0); setScore(0); setSelected([]); setFoundBugs([]); setAnswered(false); setScreen("game"); }} style={{ padding: "10px 22px", borderRadius: 10, border: "none", background: C.accent, color: C.bg, cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 700 }}>Rejouer</button>
          <button onClick={() => setScreen("menu")} style={{ padding: "10px 22px", borderRadius: 10, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, cursor: "pointer", fontFamily: "inherit" }}>Menu</button>
        </div>
      </div>
    </div>
  );

  // GAME
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", padding: 16 }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}} @keyframes pop{0%{transform:scale(0.95)}50%{transform:scale(1.03)}100%{transform:scale(1)}}`}</style>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12 }}>
          <span style={{ color: C.dimmed }}>Niveau {level + 1}/{BLUEPRINTS.length}</span>
          <span style={{ color: C.gold, fontWeight: 700 }}>Score: {score}</span>
        </div>
        <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
          {BLUEPRINTS.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < level ? C.success : i === level ? C.accent : C.border }} />
          ))}
        </div>

        <div style={{ fontSize: 16, fontWeight: 700, color: C.accent, marginBottom: 4 }}>{bp.title}</div>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>{bp.desc}</div>

        {/* Debug mode */}
        {bp.phase === "debug" ? (
          <>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>Cliquez sur les lignes qui contiennent un bug ({foundBugs.length}/{bp.bugs.length})</div>
            <div style={{ background: C.code, borderRadius: 10, overflow: "hidden", fontFamily: "monospace", fontSize: 12 }}>
              <div style={{ padding: "10px 0" }}>
                {bp.code.split("\n").map((line, i) => {
                  const bugIdx = bp.bugs.findIndex(b => b.line === i + 1);
                  const isFound = bugIdx >= 0 && foundBugs.includes(bugIdx);
                  return (
                    <div key={i} onClick={() => clickBugLine(i)} style={{
                      display: "flex", padding: "2px 0", cursor: answered ? "default" : "pointer",
                      background: isFound ? C.success + "15" : "transparent",
                      borderLeft: isFound ? `3px solid ${C.success}` : "3px solid transparent",
                    }}>
                      <span style={{ width: 32, textAlign: "right", paddingRight: 8, color: C.dimmed, userSelect: "none", fontSize: 10 }}>{i + 1}</span>
                      <span style={{ color: C.codeText }}>{line}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            {answered && bp.bugs.map((bug, i) => (
              <div key={i} style={{ fontSize: 11, padding: "4px 8px", borderRadius: 4, margin: "3px 0", background: foundBugs.includes(i) ? C.success + "10" : C.danger + "10", color: foundBugs.includes(i) ? C.success : C.danger }}>
                {foundBugs.includes(i) ? "✓" : "✗"} Ligne {bug.line}: {bug.desc}
              </div>
            ))}
          </>
        ) : (
          /* Assembly mode */
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {bp.pieces.map(p => {
                const isSel = selected.includes(p.id);
                let bg = C.card, bc = C.border;
                if (answered && p.correct) { bg = C.success + "15"; bc = C.success; }
                else if (answered && isSel && !p.correct) { bg = C.danger + "15"; bc = C.danger; }
                else if (isSel) { bg = C.accent + "12"; bc = C.accent; }
                return (
                  <button key={p.id} onClick={() => toggle(p.id)} style={{
                    padding: "10px 14px", borderRadius: 8, border: `1px solid ${bc}`,
                    background: bg, color: C.codeText, cursor: answered ? "default" : "pointer",
                    fontFamily: "'JetBrains Mono',monospace", fontSize: 12, textAlign: "left",
                    whiteSpace: "pre-wrap", transition: "all .15s",
                    animation: isSel && !answered ? "pop .2s ease-out" : "none",
                  }}>
                    <span style={{ marginRight: 8, fontSize: 14 }}>{isSel ? "☑" : "☐"}</span>
                    {p.text}
                    {answered && p.why && !p.correct && isSel && (
                      <div style={{ fontSize: 10, color: C.danger, fontFamily: "'Segoe UI',sans-serif", marginTop: 4 }}>{p.why}</div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Preview of what they're building */}
            {selected.length > 0 && !answered && (
              <ClassPreview
                pieces={selected.map(id => bp.pieces.find(p => p.id === id)).filter(Boolean)}
                className={bp.target}
              />
            )}
          </>
        )}

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          {!answered ? (
            <button onClick={check} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", background: C.accent, color: C.bg, cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700 }}>Valider</button>
          ) : (
            <button onClick={next} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", background: C.accent, color: C.bg, cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700 }}>
              {level + 1 >= BLUEPRINTS.length ? "Score final" : "Niveau suivant →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
