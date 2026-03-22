import { useState, useEffect } from "react";

const C = {
  bg: "#0a0f1a", card: "#111827", accent: "#32E0C4", gold: "#F59E0B",
  text: "#e2e8f0", muted: "#94a3b8", dimmed: "#64748b", border: "#1e293b",
  success: "#10B981", danger: "#EF4444", primary: "#0D7377",
  code: "#1E293B", codeText: "#32E0C4", keyword: "#c792ea",
};

const KEY = "cq-game-maze";
const r = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = a => a[Math.floor(Math.random() * a.length)];

function genFork() {
  const templates = [
    () => { const a = r(1, 30), b = r(1, 30); const ans = a > b; return { code: `if (${a} > ${b})`, condition: `${a} > ${b}`, leftLabel: "true → Gauche", rightLabel: "false → Droite", correct: ans ? "left" : "right" }; },
    () => { const a = r(1, 50); const ans = a % 2 === 0; return { code: `if (${a} % 2 == 0)`, condition: `${a} % 2 == 0`, leftLabel: "true → Gauche", rightLabel: "false → Droite", correct: ans ? "left" : "right" }; },
    () => { const a = r(1, 20), b = r(1, 20); const ans = a >= 10 && b < 15; return { code: `if (${a} >= 10 && ${b} < 15)`, condition: `${a} >= 10 && ${b} < 15`, leftLabel: "true → Gauche", rightLabel: "false → Droite", correct: ans ? "left" : "right" }; },
    () => { const a = r(1, 30), b = r(1, 30); const ans = a < 10 || b > 20; return { code: `if (${a} < 10 || ${b} > 20)`, condition: `${a} < 10 || ${b} > 20`, leftLabel: "true → Gauche", rightLabel: "false → Droite", correct: ans ? "left" : "right" }; },
    () => { const a = r(1, 40); const ans = !(a > 25); return { code: `if (!(${a} > 25))`, condition: `!(${a} > 25)`, leftLabel: "true → Gauche", rightLabel: "false → Droite", correct: ans ? "left" : "right" }; },
    () => { const s = pick(["café", "thé", "jus", "eau"]); const t = pick(["café", "thé", "jus"]); const ans = s === t; return { code: `if ("${s}".equals("${t}"))`, condition: `"${s}".equals("${t}")`, leftLabel: "true → Gauche", rightLabel: "false → Droite", correct: ans ? "left" : "right" }; },
  ];
  return pick(templates)();
}

function MazeVisual({ playerPos, paths, currentFork, forkResult, totalForks }) {
  const W = 400, H = 320;
  const stages = totalForks + 1;
  const stageW = W / stages;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ borderRadius: 10, border: `1px solid ${C.border}`, background: C.code }}>
      {/* Draw paths */}
      {paths.map((p, i) => {
        const x1 = stageW * i + stageW / 2;
        const x2 = stageW * (i + 1) + stageW / 2;
        const yTop = H * 0.3;
        const yBot = H * 0.7;
        const yMid = H / 2;

        return (
          <g key={i} opacity={i <= playerPos ? 1 : 0.2}>
            {/* Fork paths */}
            <line x1={x1} y1={yMid} x2={(x1 + x2) / 2} y2={yTop} stroke={p.taken === "left" ? C.success : p.taken === "wrong-left" ? C.danger : C.dimmed} strokeWidth={p.taken === "left" ? 3 : 1.5} strokeLinecap="round" />
            <line x1={(x1 + x2) / 2} y1={yTop} x2={x2} y2={yMid} stroke={p.taken === "left" ? C.success : p.taken === "wrong-left" ? C.danger : C.dimmed} strokeWidth={p.taken === "left" ? 3 : 1.5} strokeLinecap="round" />

            <line x1={x1} y1={yMid} x2={(x1 + x2) / 2} y2={yBot} stroke={p.taken === "right" ? C.success : p.taken === "wrong-right" ? C.danger : C.dimmed} strokeWidth={p.taken === "right" ? 3 : 1.5} strokeLinecap="round" />
            <line x1={(x1 + x2) / 2} y1={yBot} x2={x2} y2={yMid} stroke={p.taken === "right" ? C.success : p.taken === "wrong-right" ? C.danger : C.dimmed} strokeWidth={p.taken === "right" ? 3 : 1.5} strokeLinecap="round" />

            {/* Labels */}
            <text x={(x1 + x2) / 2} y={yTop - 8} textAnchor="middle" fill={C.accent} fontSize="9" fontFamily="monospace" fontWeight="600">true</text>
            <text x={(x1 + x2) / 2} y={yBot + 14} textAnchor="middle" fill={C.gold} fontSize="9" fontFamily="monospace" fontWeight="600">false</text>

            {/* Dead end X for wrong paths */}
            {(p.taken === "wrong-left") && <text x={(x1 + x2) / 2} y={yTop + 4} textAnchor="middle" fill={C.danger} fontSize="16" fontWeight="800">✗</text>}
            {(p.taken === "wrong-right") && <text x={(x1 + x2) / 2} y={yBot + 4} textAnchor="middle" fill={C.danger} fontSize="16" fontWeight="800">✗</text>}
          </g>
        );
      })}

      {/* Fork nodes */}
      {Array.from({ length: stages }, (_, i) => {
        const x = stageW * i + stageW / 2;
        const isCurrent = i === playerPos;
        const isPast = i < playerPos;
        const isEnd = i === totalForks;
        return (
          <g key={`node-${i}`}>
            <circle cx={x} cy={H / 2} r={isCurrent ? 14 : 10} fill={isEnd ? C.gold : isCurrent ? C.accent : isPast ? C.success : C.border} opacity={isPast || isCurrent ? 1 : 0.4}>
              {isCurrent && <animate attributeName="r" values="14;16;14" dur="1s" repeatCount="indefinite" />}
            </circle>
            {isCurrent && !isEnd && (
              <text x={x} y={H / 2 + 4} textAnchor="middle" fill={C.bg} fontSize="12" fontWeight="800" fontFamily="'Segoe UI',sans-serif">?</text>
            )}
            {isPast && (
              <text x={x} y={H / 2 + 4} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">✓</text>
            )}
            {isEnd && (
              <text x={x} y={H / 2 + 4} textAnchor="middle" fill={C.bg} fontSize="12" fontWeight="800">★</text>
            )}
          </g>
        );
      })}

      {/* Start / End labels */}
      <text x={stageW / 2} y={H / 2 + 30} textAnchor="middle" fill={C.dimmed} fontSize="9">Début</text>
      <text x={stageW * totalForks + stageW / 2} y={H / 2 + 30} textAnchor="middle" fill={C.gold} fontSize="9" fontWeight="600">Sortie</text>
    </svg>
  );
}

export default function MazeGame() {
  const TOTAL_FORKS = 8;
  const [screen, setScreen] = useState("menu");
  const [forks, setForks] = useState([]);
  const [paths, setPaths] = useState([]);
  const [pos, setPos] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [lastOk, setLastOk] = useState(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [history, setHistory] = useState([]);

  useEffect(() => { (async () => { try { const r = await window.storage.get(KEY); if (r) setHistory(JSON.parse(r.value)); } catch {} })(); }, []);

  const startGame = () => {
    const f = Array.from({ length: TOTAL_FORKS }, () => genFork());
    setForks(f);
    setPaths(Array.from({ length: TOTAL_FORKS }, () => ({ taken: null })));
    setPos(0); setScore(0); setLives(3); setAnswered(false); setLastOk(null);
    setScreen("game");
  };

  const choose = (dir) => {
    if (answered || pos >= TOTAL_FORKS) return;
    setAnswered(true);
    const fork = forks[pos];
    const ok = dir === fork.correct;
    setLastOk(ok);

    const newPaths = [...paths];
    if (ok) {
      newPaths[pos] = { taken: dir };
      setScore(s => s + 15);
    } else {
      newPaths[pos] = { taken: `wrong-${dir}` };
      setLives(l => l - 1);
    }
    setPaths(newPaths);

    setTimeout(() => {
      if (!ok && lives <= 1) {
        // Game over
        const entry = { date: new Date().toLocaleDateString("fr-CH"), score, reached: pos + 1, total: TOTAL_FORKS };
        const newH = [...history, entry].slice(-20);
        setHistory(newH);
        try { window.storage.set(KEY, JSON.stringify(newH)); } catch {}
        setScreen("gameover");
        return;
      }
      if (ok) {
        if (pos + 1 >= TOTAL_FORKS) {
          const finalScore = score + 15 + lives * 10;
          setScore(finalScore);
          const entry = { date: new Date().toLocaleDateString("fr-CH"), score: finalScore, reached: TOTAL_FORKS, total: TOTAL_FORKS };
          const newH = [...history, entry].slice(-20);
          setHistory(newH);
          try { window.storage.set(KEY, JSON.stringify(newH)); } catch {}
          setScreen("win");
          return;
        }
        setPos(p => p + 1);
      }
      // If wrong but still has lives, retry same fork
      if (!ok) {
        newPaths[pos] = { taken: null };
        setPaths(newPaths);
      }
      setAnswered(false);
      setLastOk(null);
    }, 1200);
  };

  const fork = forks[pos];

  // MENU
  if (screen === "menu") return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ animation: "fadeIn .4s", textAlign: "center", maxWidth: 480 }}>
        <div style={{ fontSize: 12, letterSpacing: 3, color: C.dimmed, marginBottom: 8 }}>CODEQUEST · MODULE 01</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.accent, marginBottom: 8 }}>Le Labyrinthe des Conditions</div>
        <div style={{ fontSize: 14, color: C.muted, marginBottom: 24, lineHeight: 1.6 }}>
          Traversez le labyrinthe ! À chaque embranchement, une condition Java apparaît. Si elle est <span style={{ color: C.accent, fontWeight: 700 }}>true</span>, prenez à gauche. Si <span style={{ color: C.gold, fontWeight: 700 }}>false</span>, à droite. 3 vies, 8 embranchements.
        </div>
        <button onClick={startGame} style={{
          padding: "14px 36px", borderRadius: 12, border: "none", background: C.accent,
          color: C.bg, cursor: "pointer", fontFamily: "inherit", fontSize: 16, fontWeight: 700,
        }}>Entrer dans le labyrinthe</button>
        {history.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: 2, color: C.dimmed, marginBottom: 8 }}>HISTORIQUE</div>
            {[...history].reverse().slice(0, 5).map((h, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 12px", borderRadius: 6, background: C.card, border: `1px solid ${C.border}`, fontSize: 11, marginBottom: 3 }}>
                <span style={{ color: C.dimmed }}>{h.date}</span>
                <span style={{ color: C.gold, fontWeight: 700 }}>{h.score} pts</span>
                <span style={{ color: h.reached === h.total ? C.success : C.muted }}>{h.reached}/{h.total}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // WIN / GAMEOVER
  if (screen === "win" || screen === "gameover") return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ animation: "fadeIn .4s", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>{screen === "win" ? "🏆" : "💀"}</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: screen === "win" ? C.gold : C.danger }}>
          {screen === "win" ? "Labyrinthe traversé !" : "Perdu !"}
        </div>
        <div style={{ fontSize: 14, color: C.muted, marginTop: 8 }}>
          {screen === "win" ? `${score} points · ${lives} vie${lives > 1 ? "s" : ""} restante${lives > 1 ? "s" : ""} (+${lives * 10} bonus)` : `Arrivé à l'embranchement ${pos + 1}/${TOTAL_FORKS}`}
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20 }}>
          <button onClick={startGame} style={{ padding: "10px 22px", borderRadius: 10, border: "none", background: C.accent, color: C.bg, cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 700 }}>Rejouer</button>
          <button onClick={() => setScreen("menu")} style={{ padding: "10px 22px", borderRadius: 10, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, cursor: "pointer", fontFamily: "inherit" }}>Menu</button>
        </div>
      </div>
    </div>
  );

  // GAME
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", padding: 16 }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}} @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}60%{transform:translateX(6px)}}`}</style>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12 }}>
          <span style={{ color: C.dimmed }}>Embranchement {pos + 1}/{TOTAL_FORKS}</span>
          <span style={{ color: C.gold, fontWeight: 700 }}>Score: {score}</span>
          <span style={{ color: lives <= 1 ? C.danger : C.muted }}>
            {"❤️".repeat(lives)}{"🖤".repeat(3 - lives)}
          </span>
        </div>

        {/* Maze visual */}
        <MazeVisual playerPos={pos} paths={paths} totalForks={TOTAL_FORKS} />

        {/* Condition */}
        {fork && (
          <div style={{
            background: C.code, borderRadius: 12, padding: "16px", textAlign: "center",
            margin: "12px 0", border: `1px solid ${answered ? (lastOk ? C.success : C.danger) + "50" : C.border}`,
            animation: answered && !lastOk ? "shake .3s" : "fadeIn .3s",
          }}>
            <div style={{ fontSize: 10, color: C.dimmed, letterSpacing: 2, marginBottom: 6 }}>QUELLE DIRECTION ?</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.keyword, fontFamily: "'JetBrains Mono',monospace" }}>
              {fork.code}
            </div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>
              Si <span style={{ color: C.accent }}>true</span> → gauche · Si <span style={{ color: C.gold }}>false</span> → droite
            </div>
            {answered && (
              <div style={{ marginTop: 8, fontSize: 14, fontWeight: 600, color: lastOk ? C.success : C.danger }}>
                {lastOk ? "✓ Bon chemin !" : `✗ Mauvais chemin ! (${fork.condition} = ${fork.correct === "left" ? "true" : "false"})`}
              </div>
            )}
          </div>
        )}

        {/* Direction buttons */}
        {!answered && fork && (
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => choose("left")} style={{
              flex: 1, padding: "16px", borderRadius: 12, border: `2px solid ${C.accent}`,
              background: C.accent + "10", color: C.accent, fontSize: 16, fontWeight: 800,
              cursor: "pointer", fontFamily: "inherit",
            }}>← TRUE<br /><span style={{ fontSize: 11, fontWeight: 400 }}>Gauche</span></button>
            <button onClick={() => choose("right")} style={{
              flex: 1, padding: "16px", borderRadius: 12, border: `2px solid ${C.gold}`,
              background: C.gold + "10", color: C.gold, fontSize: 16, fontWeight: 800,
              cursor: "pointer", fontFamily: "inherit",
            }}>FALSE →<br /><span style={{ fontSize: 11, fontWeight: 400 }}>Droite</span></button>
          </div>
        )}
      </div>
    </div>
  );
}
