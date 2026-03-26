import { useState } from "react";
import { ChevronLeft, Trophy, Check, X, RotateCcw } from "lucide-react";

const C={bg:"#0a0f1a",card:"#111827",accent:"#32E0C4",gold:"#F59E0B",text:"#e2e8f0",muted:"#94a3b8",border:"#1e293b",danger:"#EF4444",success:"#10B981",primary:"#0D7377",dimmed:"#64748b",secondary:"#14A3C7"};

const CHALLENGES = [
  {
    title: "Classe Produit",
    instruction: "Construisez le diagramme UML de la classe Produit avec ses attributs et methodes.",
    zones: [
      { id: "class", label: "Nom de la classe", accept: ["Produit"], y: 0 },
      { id: "attr1", label: "Attribut 1", accept: ["- nom : String"], y: 1 },
      { id: "attr2", label: "Attribut 2", accept: ["- prix : double"], y: 2 },
      { id: "attr3", label: "Attribut 3", accept: ["- quantite : int"], y: 3 },
      { id: "meth1", label: "Methode 1", accept: ["+ getNom() : String"], y: 4 },
      { id: "meth2", label: "Methode 2", accept: ["+ calculerValeur() : double"], y: 5 },
    ],
    blocks: [
      "Produit", "- nom : String", "- prix : double", "- quantite : int",
      "+ getNom() : String", "+ calculerValeur() : double",
      "Magasin", "+ setNom(n) : void", "- total : float",
    ],
  },
  {
    title: "Heritage Animal",
    instruction: "Construisez le diagramme avec la classe parent Animal et la classe enfant Chien.",
    zones: [
      { id: "parent", label: "Classe parent", accept: ["Animal"], y: 0 },
      { id: "pattr1", label: "Attribut parent", accept: ["# nom : String"], y: 1 },
      { id: "pmeth1", label: "Methode parent", accept: ["+ faireSon() : void"], y: 2 },
      { id: "relation", label: "Relation", accept: ["extends"], y: 3 },
      { id: "child", label: "Classe enfant", accept: ["Chien"], y: 4 },
      { id: "cattr1", label: "Attribut enfant", accept: ["- race : String"], y: 5 },
      { id: "cmeth1", label: "Methode enfant", accept: ["+ faireSon() : void  @Override"], y: 6 },
    ],
    blocks: [
      "Animal", "Chien", "# nom : String", "- race : String",
      "+ faireSon() : void", "+ faireSon() : void  @Override", "extends",
      "implements", "Chat", "- age : int", "+ manger() : void",
    ],
  },
  {
    title: "Composition Bibliotheque",
    instruction: "La Bibliotheque CONTIENT des Livre. Placez les elements correctement.",
    zones: [
      { id: "c1", label: "Classe 1", accept: ["Livre"], y: 0 },
      { id: "c1a1", label: "Attribut", accept: ["- titre : String"], y: 1 },
      { id: "c1a2", label: "Attribut", accept: ["- disponible : boolean"], y: 2 },
      { id: "rel", label: "Relation", accept: ["contient (composition)"], y: 3 },
      { id: "c2", label: "Classe 2", accept: ["Bibliotheque"], y: 4 },
      { id: "c2a1", label: "Attribut", accept: ["- livres : ArrayList<Livre>"], y: 5 },
      { id: "c2m1", label: "Methode", accept: ["+ emprunter(titre) : boolean"], y: 6 },
    ],
    blocks: [
      "Livre", "Bibliotheque", "- titre : String", "- disponible : boolean",
      "- livres : ArrayList<Livre>", "+ emprunter(titre) : boolean",
      "contient (composition)",
      "- auteur : int", "extends", "Catalogue", "+ supprimer() : void",
    ],
  },
];

export default function GameUMLDragDrop() {
  const [screen, setScreen] = useState("menu");
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [placed, setPlaced] = useState({});
  const [dragging, setDragging] = useState(null);
  const [score, setScore] = useState(0);
  const [checked, setChecked] = useState(false);

  const ch = CHALLENGES[challengeIdx];

  const startChallenge = (idx) => {
    setChallengeIdx(idx);
    setPlaced({});
    setDragging(null);
    setChecked(false);
    setScreen("playing");
  };

  const onDragStart = (block) => {
    setDragging(block);
  };

  const onDrop = (zoneId) => {
    if (!dragging) return;
    // Remove from previous zone
    const newPlaced = { ...placed };
    Object.keys(newPlaced).forEach(k => { if (newPlaced[k] === dragging) delete newPlaced[k]; });
    newPlaced[zoneId] = dragging;
    setPlaced(newPlaced);
    setDragging(null);
  };

  const removeFromZone = (zoneId) => {
    const newPlaced = { ...placed };
    delete newPlaced[zoneId];
    setPlaced(newPlaced);
  };

  const checkAnswer = () => {
    let correct = 0;
    ch.zones.forEach(z => {
      if (z.accept.includes(placed[z.id])) correct++;
    });
    setScore(correct);
    setChecked(true);
  };

  const usedBlocks = new Set(Object.values(placed));

  if (screen === "menu") {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ padding: "6px 16px", background: C.card, borderBottom: "1px solid " + C.border, display: "flex", alignItems: "center", justifyContent: "space-between", position: "fixed", top: 0, left: 0, right: 0, zIndex: 10 }}>
          <button onClick={() => window.history.back()} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 12px", borderRadius: 7, border: "1px solid " + C.border, background: "transparent", color: C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 11 }}><ChevronLeft size={14} /> Retour</button>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.secondary }}>UML Drag & Drop</span>
          <span />
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, color: C.secondary, marginBottom: 8 }}>UML Drag & Drop</div>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 24, textAlign: "center", maxWidth: 400 }}>
          Glissez les elements pour construire le diagramme UML correct.
        </div>
        <div style={{ display: "grid", gap: 10, width: "100%", maxWidth: 400 }}>
          {CHALLENGES.map((c, i) => (
            <button key={i} onClick={() => startChallenge(i)} style={{
              padding: "14px 18px", borderRadius: 10, border: "1px solid " + C.border,
              background: C.card, cursor: "pointer", fontFamily: "inherit", textAlign: "left",
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{c.title}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{c.zones.length + " elements a placer"}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      <div style={{ padding: "6px 16px", background: C.card, borderBottom: "1px solid " + C.border, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => setScreen("menu")} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 12px", borderRadius: 7, border: "1px solid " + C.border, background: "transparent", color: C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 11 }}><ChevronLeft size={14} /> Menu</button>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.secondary }}>{ch.title}</span>
        {checked && <span style={{ fontSize: 12, color: score === ch.zones.length ? C.success : C.gold, fontWeight: 700 }}>{score + "/" + ch.zones.length}</span>}
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: 16 }}>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>{ch.instruction}</div>

        {/* UML Diagram zones */}
        <div style={{ background: C.card, borderRadius: 12, padding: 16, border: "1px solid " + C.border, marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: C.dimmed, marginBottom: 8, letterSpacing: 1 }}>DIAGRAMME UML</div>
          {ch.zones.map(zone => {
            const placedBlock = placed[zone.id];
            const isCorrect = checked && zone.accept.includes(placedBlock);
            const isWrong = checked && placedBlock && !zone.accept.includes(placedBlock);
            return (
              <div key={zone.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(zone.id)}
                style={{
                  minHeight: 40, padding: "6px 12px", marginBottom: 4, borderRadius: 8,
                  border: "2px dashed " + (isCorrect ? C.success : isWrong ? C.danger : placedBlock ? C.accent : C.border),
                  background: isCorrect ? C.success + "10" : isWrong ? C.danger + "10" : placedBlock ? C.accent + "05" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  transition: "all .2s",
                }}>
                {placedBlock ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                    <span style={{
                      fontFamily: zone.id === "class" || zone.id === "parent" || zone.id === "child" || zone.id === "c1" || zone.id === "c2" ? "inherit" : "Consolas, monospace",
                      fontSize: zone.id === "class" || zone.id === "parent" || zone.id === "child" || zone.id === "c1" || zone.id === "c2" ? 14 : 12,
                      fontWeight: zone.id === "class" || zone.id === "parent" || zone.id === "child" || zone.id === "c1" || zone.id === "c2" ? 700 : 400,
                      color: isCorrect ? C.success : isWrong ? C.danger : C.text,
                    }}>{placedBlock}</span>
                    {checked && isCorrect && <Check size={14} color={C.success} />}
                    {checked && isWrong && <X size={14} color={C.danger} />}
                    {!checked && <button onClick={() => removeFromZone(zone.id)} style={{ background: "none", border: "none", color: C.dimmed, cursor: "pointer", padding: 2 }}><X size={12} /></button>}
                  </div>
                ) : (
                  <span style={{ fontSize: 11, color: C.dimmed, fontStyle: "italic" }}>{zone.label}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Available blocks */}
        <div style={{ background: C.card, borderRadius: 12, padding: 16, border: "1px solid " + C.border, marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: C.dimmed, marginBottom: 8, letterSpacing: 1 }}>ELEMENTS DISPONIBLES</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {ch.blocks.map((block, i) => {
              const used = usedBlocks.has(block);
              return (
                <div key={i}
                  draggable={!used && !checked}
                  onDragStart={() => onDragStart(block)}
                  onClick={() => {
                    if (used || checked) return;
                    // Find first empty zone
                    const emptyZone = ch.zones.find(z => !placed[z.id]);
                    if (emptyZone) {
                      setPlaced(p => ({ ...p, [emptyZone.id]: block }));
                    }
                  }}
                  style={{
                    padding: "6px 12px", borderRadius: 6,
                    background: used ? C.border + "50" : C.primary + "15",
                    border: "1px solid " + (used ? C.border : C.primary) + "40",
                    color: used ? C.dimmed : C.text,
                    fontSize: 11, fontFamily: "Consolas, monospace",
                    cursor: used || checked ? "default" : "grab",
                    opacity: used ? 0.4 : 1,
                    userSelect: "none",
                  }}>
                  {block}
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: 9, color: C.dimmed, marginTop: 8 }}>
            Glissez un element vers le diagramme, ou cliquez pour le placer automatiquement.
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10 }}>
          {!checked && (
            <button onClick={checkAnswer} disabled={Object.keys(placed).length < ch.zones.length} style={{
              flex: 1, padding: "12px", borderRadius: 8, border: "none",
              background: Object.keys(placed).length >= ch.zones.length ? C.accent : C.border,
              color: Object.keys(placed).length >= ch.zones.length ? C.bg : C.dimmed,
              cursor: Object.keys(placed).length >= ch.zones.length ? "pointer" : "default",
              fontFamily: "inherit", fontSize: 13, fontWeight: 700,
            }}>Verifier</button>
          )}
          {checked && (
            <>
              <button onClick={() => startChallenge(challengeIdx)} style={{
                flex: 1, padding: "12px", borderRadius: 8, border: "1px solid " + C.border,
                background: C.card, color: C.muted, cursor: "pointer",
                fontFamily: "inherit", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
              }}><RotateCcw size={12} /> Recommencer</button>
              {challengeIdx < CHALLENGES.length - 1 && (
                <button onClick={() => startChallenge(challengeIdx + 1)} style={{
                  flex: 1, padding: "12px", borderRadius: 8, border: "none",
                  background: C.accent, color: C.bg, cursor: "pointer",
                  fontFamily: "inherit", fontSize: 12, fontWeight: 600,
                }}>Challenge suivant</button>
              )}
            </>
          )}
        </div>

        {checked && score === ch.zones.length && (
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Trophy size={32} color={C.gold} />
            <div style={{ fontSize: 16, fontWeight: 700, color: C.gold, marginTop: 4 }}>Parfait !</div>
          </div>
        )}
      </div>
    </div>
  );
}
