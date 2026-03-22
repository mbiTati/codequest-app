import { useState, useEffect, useRef, useCallback } from "react";

const C = {
  bg: "#0a0f1a", card: "#111827", accent: "#32E0C4", gold: "#F59E0B",
  text: "#e2e8f0", muted: "#94a3b8", dimmed: "#64748b", border: "#1e293b",
  success: "#10B981", danger: "#EF4444", primary: "#0D7377", secondary: "#14A3C7",
  code: "#1E293B", codeText: "#32E0C4", keyword: "#c792ea",
};

const GRID = 20;
const CELL = 22;
const W = GRID * CELL;

const KEY = "cq-game-snake-loops";

const LEVELS = [
  { title: "Niveau 1 : for simple", code: "for (int i = 0; i < ???; i++)", param: "i < ???", paramName: "Nombre de tours", min: 3, max: 10, desc: "Le serpent avance d'une case par tour de boucle. Combien de cases ?" },
  { title: "Niveau 2 : incrément x2", code: "for (int i = 0; i < 10; i += ???)", param: "i += ???", paramName: "Pas (incrément)", min: 1, max: 5, desc: "L'incrément change ! Si i += 2, le serpent avance de 2 cases par tour mais fait moins de tours." },
  { title: "Niveau 3 : condition", code: "for (int i = ???; i < 15; i++)", param: "i = ???", paramName: "Valeur de départ", min: 0, max: 12, desc: "Le départ change. Si i commence à 5 et va jusqu'à 15, combien de tours ?" },
  { title: "Niveau 4 : while countdown", code: "int n = ???; while(n > 0) { n--; }", param: "n = ???", paramName: "Valeur initiale", min: 3, max: 15, desc: "Le while compte à rebours. Le serpent avance tant que n > 0." },
  { title: "Niveau 5 : division", code: "int n = ???; while(n > 1) { n /= 2; }", param: "n = ???", paramName: "Valeur initiale", min: 4, max: 128, desc: "Le serpent avance à chaque division par 2. Combien de tours avant que n atteigne 1 ?" },
];

function computeAnswer(levelIdx, value) {
  switch (levelIdx) {
    case 0: return value;
    case 1: return Math.ceil(10 / value);
    case 2: return 15 - value;
    case 3: return value;
    case 4: { let n = value, c = 0; while (n > 1) { n = Math.floor(n / 2); c++; } return c; }
    default: return 0;
  }
}

function SnakeCanvas({ length, gridSize, cellSize, running, onDone }) {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([{ x: 0, y: Math.floor(gridSize / 2) }]);
  const [step, setStep] = useState(0);
  const dirRef = useRef({ x: 1, y: 0 });
  const targetLen = length;

  useEffect(() => {
    if (!running) {
      setSnake([{ x: 0, y: Math.floor(gridSize / 2) }]);
      setStep(0);
      dirRef.current = { x: 1, y: 0 };
      return;
    }
    if (step >= targetLen) { onDone?.(); return; }
    const timer = setTimeout(() => {
      setSnake(prev => {
        const head = prev[0];
        let nx = head.x + dirRef.current.x;
        let ny = head.y + dirRef.current.y;
        if (nx >= gridSize) { nx = head.x; dirRef.current = { x: 0, y: 1 }; ny = head.y + 1; }
        if (ny >= gridSize) { ny = head.y; dirRef.current = { x: -1, y: 0 }; nx = head.x - 1; }
        if (nx < 0) { nx = head.x; dirRef.current = { x: 0, y: -1 }; ny = head.y - 1; }
        if (ny < 0) { ny = head.y; dirRef.current = { x: 1, y: 0 }; nx = head.x + 1; }
        return [{ x: nx, y: ny }, ...prev];
      });
      setStep(s => s + 1);
    }, 120);
    return () => clearTimeout(timer);
  }, [running, step, targetLen, gridSize, onDone]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, W, W);

    // Grid
    ctx.strokeStyle = "#1a2234";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= gridSize; i++) {
      ctx.beginPath(); ctx.moveTo(i * cellSize, 0); ctx.lineTo(i * cellSize, W); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * cellSize); ctx.lineTo(W, i * cellSize); ctx.stroke();
    }

    // Snake
    snake.forEach((seg, i) => {
      const isHead = i === 0;
      const hue = 160 + (i * 3) % 40;
      ctx.fillStyle = isHead ? C.accent : `hsl(${hue}, 70%, ${45 - i * 0.5}%)`;
      ctx.beginPath();
      ctx.roundRect(
        seg.x * cellSize + 1, seg.y * cellSize + 1,
        cellSize - 2, cellSize - 2, 4
      );
      ctx.fill();
      if (isHead) {
        ctx.fillStyle = C.bg;
        const ex = seg.x * cellSize + cellSize * 0.65;
        const ey = seg.y * cellSize + cellSize * 0.35;
        ctx.beginPath(); ctx.arc(ex, ey, 2, 0, Math.PI * 2); ctx.fill();
      }
    });

    // Counter
    ctx.fillStyle = C.accent;
    ctx.font = "bold 13px 'Segoe UI', sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(`${step} / ${targetLen} tours`, W - 8, 16);
  }, [snake, step, targetLen, gridSize, cellSize]);

  return <canvas ref={canvasRef} width={W} height={W} style={{ borderRadius: 10, border: `1px solid ${C.border}`, background: C.code }} />;
}

export default function SnakeLoopGame() {
  const [screen, setScreen] = useState("menu");
  const [level, setLevel] = useState(0);
  const [paramValue, setParamValue] = useState(5);
  const [prediction, setPrediction] = useState("");
  const [phase, setPhase] = useState("predict"); // predict, running, result
  const [score, setScore] = useState(0);
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => { (async () => { try { const r = await window.storage.get(KEY); if (r) setHistory(JSON.parse(r.value)); } catch {} })(); }, []);

  const lv = LEVELS[level];
  const answer = computeAnswer(level, paramValue);

  const startLevel = () => {
    setParamValue(Math.floor((lv.min + lv.max) / 2));
    setPrediction("");
    setPhase("predict");
  };

  useEffect(() => { if (screen === "game") startLevel(); }, [level, screen]);

  const submitPrediction = () => {
    const pred = parseInt(prediction);
    if (isNaN(pred)) return;
    setPhase("running");
  };

  const onSnakeDone = useCallback(() => {
    const pred = parseInt(prediction);
    const correct = pred === answer;
    const diff = Math.abs(pred - answer);
    const pts = correct ? 30 : diff <= 1 ? 15 : diff <= 2 ? 5 : 0;
    setScore(s => s + pts);
    setResults(r => [...r, { level: level + 1, param: paramValue, predicted: pred, actual: answer, correct, pts }]);
    setPhase("result");
  }, [prediction, answer, level, paramValue]);

  const nextLevel = () => {
    if (level + 1 >= LEVELS.length) {
      const finalScore = score;
      const entry = { date: new Date().toLocaleDateString("fr-CH"), score: finalScore, correct: results.filter(r => r.correct).length + (parseInt(prediction) === answer ? 1 : 0) };
      const newH = [...history, entry].slice(-20);
      setHistory(newH);
      try { window.storage.set(KEY, JSON.stringify(newH)); } catch {}
      setScreen("result");
    } else {
      setLevel(l => l + 1);
    }
  };

  // MENU
  if (screen === "menu") return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ animation: "fadeIn .4s", textAlign: "center", maxWidth: 480 }}>
        <div style={{ fontSize: 12, letterSpacing: 3, color: C.dimmed, marginBottom: 8 }}>CODEQUEST · MODULE 02</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.accent, marginBottom: 8 }}>Le Serpent des Boucles</div>
        <div style={{ fontSize: 14, color: C.muted, marginBottom: 24, lineHeight: 1.6 }}>
          Un serpent grandit à chaque tour de boucle. Réglez les paramètres, prédisez la longueur, puis regardez-le avancer !
          <br /><strong style={{ color: C.text }}>5 niveaux</strong> : for simple → incrément → condition → while → division.
        </div>
        <button onClick={() => { setLevel(0); setScore(0); setResults([]); setScreen("game"); }} style={{
          padding: "14px 36px", borderRadius: 12, border: "none", background: C.accent,
          color: C.bg, cursor: "pointer", fontFamily: "inherit", fontSize: 16, fontWeight: 700,
        }}>Jouer</button>
        {history.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: 2, color: C.dimmed, marginBottom: 8 }}>HISTORIQUE</div>
            {[...history].reverse().slice(0, 5).map((h, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 12px", borderRadius: 6, background: C.card, border: `1px solid ${C.border}`, fontSize: 11, marginBottom: 3 }}>
                <span style={{ color: C.dimmed }}>{h.date}</span>
                <span style={{ color: C.gold, fontWeight: 700 }}>{h.score} pts</span>
                <span style={{ color: C.muted }}>{h.correct}/5 exact</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // FINAL RESULT
  if (screen === "result") return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ animation: "fadeIn .4s", textAlign: "center", maxWidth: 520 }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>{score >= 120 ? "🏆" : score >= 80 ? "🎯" : "🐍"}</div>
        <div style={{ fontSize: 24, fontWeight: 800, color: C.gold }}>{score} / 150 points</div>
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 4 }}>
          {results.map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 12px", borderRadius: 6, background: r.correct ? C.success + "15" : C.card, border: `1px solid ${r.correct ? C.success + "40" : C.border}`, fontSize: 12 }}>
              <span style={{ color: C.dimmed }}>Niv.{r.level}</span>
              <span style={{ color: C.muted }}>Prédit: {r.predicted}</span>
              <span style={{ color: C.accent }}>Réel: {r.actual}</span>
              <span style={{ color: r.correct ? C.success : C.gold, fontWeight: 700 }}>+{r.pts}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20 }}>
          <button onClick={() => { setLevel(0); setScore(0); setResults([]); setScreen("game"); }} style={{ padding: "10px 22px", borderRadius: 10, border: "none", background: C.accent, color: C.bg, cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 700 }}>Rejouer</button>
          <button onClick={() => setScreen("menu")} style={{ padding: "10px 22px", borderRadius: 10, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, cursor: "pointer", fontFamily: "inherit" }}>Menu</button>
        </div>
      </div>
    </div>
  );

  // GAME
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", padding: 16 }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <button onClick={() => setScreen("menu")} style={{ padding: "4px 12px", borderRadius: 6, border: `1px solid ${C.border}`, background: "transparent", color: C.dimmed, cursor: "pointer", fontFamily: "inherit", fontSize: 11 }}>← Menu</button>
          <span style={{ color: C.gold, fontWeight: 700, fontSize: 13 }}>Score: {score}</span>
        </div>

        {/* Level progress */}
        <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
          {LEVELS.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < level ? C.success : i === level ? C.accent : C.border }} />
          ))}
        </div>

        {/* Level title */}
        <div style={{ fontSize: 16, fontWeight: 700, color: C.accent, marginBottom: 4 }}>{lv.title}</div>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>{lv.desc}</div>

        {/* Code display */}
        <div style={{ background: C.code, borderRadius: 10, padding: "12px 16px", fontFamily: "'JetBrains Mono',monospace", fontSize: 15, color: C.codeText, marginBottom: 12, border: `1px solid ${C.border}` }}>
          {lv.code.replace("???", String(paramValue))}
        </div>

        <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* Snake canvas */}
          <div>
            <SnakeCanvas
              length={phase === "predict" ? 0 : answer}
              gridSize={GRID}
              cellSize={CELL}
              running={phase === "running"}
              onDone={onSnakeDone}
            />
          </div>

          {/* Controls */}
          <div style={{ flex: 1, minWidth: 200 }}>
            {/* Parameter slider */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>{lv.paramName}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="range" min={lv.min} max={lv.max} value={paramValue}
                  onChange={e => { if (phase === "predict") setParamValue(parseInt(e.target.value)); }}
                  disabled={phase !== "predict"}
                  style={{ flex: 1 }}
                />
                <span style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 700, color: C.accent, minWidth: 36, textAlign: "right" }}>{paramValue}</span>
              </div>
            </div>

            {/* Prediction input */}
            {phase === "predict" && (
              <div style={{ animation: "fadeIn .3s" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>
                  Combien de tours fera la boucle ?
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="number" value={prediction}
                    onChange={e => setPrediction(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && submitPrediction()}
                    placeholder="?"
                    style={{
                      flex: 1, padding: "10px 14px", borderRadius: 8,
                      border: `1px solid ${C.border}`, background: C.code,
                      color: C.accent, fontFamily: "monospace", fontSize: 20,
                      fontWeight: 700, textAlign: "center", outline: "none",
                    }}
                  />
                  <button onClick={submitPrediction} style={{
                    padding: "10px 20px", borderRadius: 8, border: "none",
                    background: C.accent, color: C.bg, cursor: "pointer",
                    fontFamily: "inherit", fontSize: 14, fontWeight: 700,
                  }}>Lancer le serpent !</button>
                </div>
              </div>
            )}

            {/* Running */}
            {phase === "running" && (
              <div style={{ textAlign: "center", padding: 20, animation: "fadeIn .3s" }}>
                <div style={{ fontSize: 16, color: C.accent, fontWeight: 600 }}>Le serpent avance...</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Votre prédiction : {prediction} tours</div>
              </div>
            )}

            {/* Result */}
            {phase === "result" && (
              <div style={{ animation: "fadeIn .3s" }}>
                <div style={{
                  padding: 16, borderRadius: 10, textAlign: "center",
                  background: parseInt(prediction) === answer ? C.success + "15" : C.gold + "15",
                  border: `1px solid ${parseInt(prediction) === answer ? C.success : C.gold}40`,
                }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: parseInt(prediction) === answer ? C.success : C.gold }}>
                    {parseInt(prediction) === answer ? "Exact !" : `Presque ! Réponse : ${answer}`}
                  </div>
                  <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>
                    Vous avez prédit {prediction} — le serpent a fait {answer} tours
                  </div>
                  <div style={{ fontSize: 14, color: C.gold, fontWeight: 700, marginTop: 8 }}>
                    +{results[results.length - 1]?.pts || 0} points
                  </div>
                </div>
                <button onClick={nextLevel} style={{
                  width: "100%", marginTop: 10, padding: "10px", borderRadius: 8,
                  border: "none", background: C.accent, color: C.bg, cursor: "pointer",
                  fontFamily: "inherit", fontSize: 14, fontWeight: 700,
                }}>{level + 1 >= LEVELS.length ? "Voir le score final" : "Niveau suivant →"}</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
