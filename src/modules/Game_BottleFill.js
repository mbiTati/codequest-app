import { useState, useEffect, useCallback } from "react";

const C = {
  bg: "#0a0f1a", card: "#111827", accent: "#32E0C4", gold: "#F59E0B",
  text: "#e2e8f0", muted: "#94a3b8", dimmed: "#64748b", border: "#1e293b",
  success: "#10B981", danger: "#EF4444", primary: "#0D7377",
  code: "#1E293B", codeText: "#32E0C4", keyword: "#c792ea",
};

const KEY = "cq-game-bottle";

const r = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = a => a[Math.floor(Math.random() * a.length)];

function genQ(diff) {
  if (diff < 4) {
    const a = r(1, 20), b = r(1, 20), op = pick([">", "<", ">=", "<=", "==", "!="]);
    const ans = eval(`${a}${op === "==" ? "===" : op === "!=" ? "!==" : op}${b}`);
    return { expr: `${a} ${op} ${b}`, answer: ans, type: "simple" };
  }
  if (diff < 8) {
    const type = pick(["and", "or", "not", "mod"]);
    if (type === "and") { const a = r(1, 30), b = r(1, 30); return { expr: `${a} > 15 && ${b} < 20`, answer: a > 15 && b < 20, type: "logic" }; }
    if (type === "or") { const a = r(1, 30), b = r(1, 30); return { expr: `${a} < 5 || ${b} > 25`, answer: a < 5 || b > 25, type: "logic" }; }
    if (type === "not") { const a = r(1, 30); return { expr: `!(${a} > 15)`, answer: !(a > 15), type: "logic" }; }
    const a = r(1, 50); return { expr: `${a} % 2 == 0`, answer: a % 2 === 0, type: "mod" };
  }
  const a = r(1, 20), b = r(1, 20), c = r(1, 20);
  const patterns = [
    () => ({ expr: `(${a} > ${b} || ${c} < 10) && ${a} != ${c}`, answer: (a > b || c < 10) && a !== c }),
    () => ({ expr: `!(${a} == ${b}) && (${c} >= 10)`, answer: a !== b && c >= 10 }),
    () => ({ expr: `${a} >= 18 && ${b} < 65 || ${c} == 0`, answer: (a >= 18 && b < 65) || c === 0 }),
  ];
  const p = pick(patterns)();
  return { ...p, type: "complex" };
}

function Bottle({ fillPct, color, isWrong, label }) {
  const h = 280;
  const w = 120;
  const neckW = 50;
  const neckH = 40;
  const bodyTop = neckH + 20;
  const liquidH = Math.max(0, (h - bodyTop - 10) * (fillPct / 100));
  const liquidY = h - 10 - liquidH;
  const waveId = `wave-${Math.random().toString(36).slice(2, 8)}`;

  const hue = fillPct < 30 ? 0 : fillPct < 60 ? 40 : fillPct < 90 ? 160 : 140;
  const liquidColor = color || `hsl(${hue}, 75%, 50%)`;
  const liquidColorLight = color ? color + "80" : `hsl(${hue}, 75%, 65%)`;

  return (
    <svg width={w + 20} height={h + 30} viewBox={`0 0 ${w + 20} ${h + 30}`} style={{ transition: "transform .3s", transform: isWrong ? "rotate(-5deg)" : "rotate(0)" }}>
      <defs>
        <clipPath id={`bottle-clip-${waveId}`}>
          <path d={`M ${(w + 20 - neckW) / 2} ${neckH} L ${(w + 20 - neckW) / 2 - 15} ${bodyTop} L 10 ${bodyTop + 20} L 10 ${h + 10} Q 10 ${h + 20} 20 ${h + 20} L ${w} ${h + 20} Q ${w + 10} ${h + 20} ${w + 10} ${h + 10} L ${w + 10} ${bodyTop + 20} L ${(w + 20 + neckW) / 2 + 15} ${bodyTop} L ${(w + 20 + neckW) / 2} ${neckH} Z`} />
        </clipPath>
      </defs>

      {/* Bottle outline */}
      <path
        d={`M ${(w + 20 - neckW) / 2} 5 L ${(w + 20 - neckW) / 2} ${neckH} L ${(w + 20 - neckW) / 2 - 15} ${bodyTop} L 10 ${bodyTop + 20} L 10 ${h + 10} Q 10 ${h + 20} 20 ${h + 20} L ${w} ${h + 20} Q ${w + 10} ${h + 20} ${w + 10} ${h + 10} L ${w + 10} ${bodyTop + 20} L ${(w + 20 + neckW) / 2 + 15} ${bodyTop} L ${(w + 20 + neckW) / 2} ${neckH} L ${(w + 20 + neckW) / 2} 5`}
        fill="none" stroke={C.muted} strokeWidth="2" strokeLinejoin="round" opacity="0.4"
      />

      {/* Liquid */}
      <g clipPath={`url(#bottle-clip-${waveId})`}>
        <rect x="0" y={liquidY} width={w + 20} height={liquidH + 30} fill={liquidColor} opacity="0.7">
          <animate attributeName="y" values={`${liquidY};${liquidY - 3};${liquidY}`} dur="2s" repeatCount="indefinite" />
        </rect>
        <rect x="0" y={liquidY + 5} width={w + 20} height={liquidH + 30} fill={liquidColorLight} opacity="0.3">
          <animate attributeName="y" values={`${liquidY + 5};${liquidY + 2};${liquidY + 5}`} dur="2.5s" repeatCount="indefinite" />
        </rect>
        {/* Bubbles */}
        {fillPct > 10 && [0, 1, 2].map(i => (
          <circle key={i} cx={30 + i * 30} r={2 + i} fill="#fff" opacity="0.3">
            <animate attributeName="cy" values={`${h + 10};${liquidY + 20}`} dur={`${1.5 + i * 0.5}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0" dur={`${1.5 + i * 0.5}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </g>

      {/* Percentage label */}
      <text x={(w + 20) / 2} y={h + 28} textAnchor="middle" fill={C.muted} fontSize="12" fontWeight="600" fontFamily="'Segoe UI',sans-serif">
        {Math.round(fillPct)}%
      </text>

      {/* Bottle cap */}
      <rect x={(w + 20 - neckW + 6) / 2} y="0" width={neckW - 6} height="8" rx="3" fill={C.dimmed} opacity="0.6" />

      {label && (
        <text x={(w + 20) / 2} y={h / 2 + 20} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700" fontFamily="'Segoe UI',sans-serif" opacity="0.9">
          {label}
        </text>
      )}
    </svg>
  );
}

export default function BottleFillGame() {
  const [screen, setScreen] = useState("menu");
  const [question, setQuestion] = useState(null);
  const [qNum, setQNum] = useState(0);
  const [fillPct, setFillPct] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [lastOk, setLastOk] = useState(null);
  const [isWrong, setIsWrong] = useState(false);
  const [streak, setStreak] = useState(0);
  const [maxFill, setMaxFill] = useState(0);
  const [history, setHistory] = useState([]);
  const [timeLeft, setTimeLeft] = useState(10);
  const TOTAL = 15;
  const FILL_PER_CORRECT = 8;
  const DRAIN_PER_WRONG = 12;

  useEffect(() => { (async () => { try { const r = await window.storage.get(KEY); if (r) setHistory(JSON.parse(r.value)); } catch {} })(); }, []);

  useEffect(() => {
    if (screen !== "game" || answered || qNum >= TOTAL) return;
    if (timeLeft <= 0) { handleAnswer(null); return; }
    const t = setTimeout(() => setTimeLeft(tl => tl - 1), 1000);
    return () => clearTimeout(t);
  }, [screen, timeLeft, answered, qNum]);

  const startGame = () => {
    setQNum(0); setFillPct(0); setStreak(0); setMaxFill(0);
    setQuestion(genQ(0)); setAnswered(false); setLastOk(null);
    setTimeLeft(10); setScreen("game");
  };

  const handleAnswer = (val) => {
    if (answered) return;
    setAnswered(true);
    const ok = val === question.answer;
    setLastOk(ok);

    if (ok) {
      const bonus = streak >= 3 ? 4 : streak >= 2 ? 2 : 0;
      const newFill = Math.min(100, fillPct + FILL_PER_CORRECT + bonus);
      setFillPct(newFill);
      setMaxFill(m => Math.max(m, newFill));
      setStreak(s => s + 1);
    } else {
      setFillPct(f => Math.max(0, f - DRAIN_PER_WRONG));
      setStreak(0);
      setIsWrong(true);
      setTimeout(() => setIsWrong(false), 400);
    }

    setTimeout(() => {
      if (qNum + 1 >= TOTAL) {
        const finalFill = ok ? Math.min(100, fillPct + FILL_PER_CORRECT) : Math.max(0, fillPct - DRAIN_PER_WRONG);
        const entry = { date: new Date().toLocaleDateString("fr-CH"), fill: Math.round(finalFill), maxFill: Math.round(Math.max(maxFill, finalFill)) };
        const newH = [...history, entry].slice(-20);
        setHistory(newH);
        try { window.storage.set(KEY, JSON.stringify(newH)); } catch {}
        setScreen("result");
      } else {
        setQNum(n => n + 1);
        setQuestion(genQ(qNum + 1));
        setAnswered(false);
        setLastOk(null);
        setTimeLeft(10);
      }
    }, 1000);
  };

  // MENU
  if (screen === "menu") return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ animation: "fadeIn .4s", textAlign: "center", maxWidth: 480 }}>
        <div style={{ fontSize: 12, letterSpacing: 3, color: C.dimmed, marginBottom: 8 }}>CODEQUEST · MODULE 01</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.accent, marginBottom: 8 }}>La Potion de Vérité</div>
        <div style={{ display: "flex", justifyContent: "center", margin: "16px 0" }}>
          <Bottle fillPct={75} />
        </div>
        <div style={{ fontSize: 14, color: C.muted, marginBottom: 24, lineHeight: 1.6 }}>
          Remplissez la bouteille en évaluant correctement les conditions Java !
          Chaque bonne réponse la remplit. Chaque erreur la vide un peu. Combos pour remplir plus vite !
        </div>
        <button onClick={startGame} style={{
          padding: "14px 36px", borderRadius: 12, border: "none", background: C.accent,
          color: C.bg, cursor: "pointer", fontFamily: "inherit", fontSize: 16, fontWeight: 700,
        }}>Remplir la potion !</button>
        {history.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: 2, color: C.dimmed, marginBottom: 8 }}>HISTORIQUE</div>
            {[...history].reverse().slice(0, 5).map((h, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 12px", borderRadius: 6, background: C.card, border: `1px solid ${C.border}`, fontSize: 11, marginBottom: 3 }}>
                <span style={{ color: C.dimmed }}>{h.date}</span>
                <span style={{ color: C.gold, fontWeight: 700 }}>{h.fill}% final</span>
                <span style={{ color: C.accent }}>Max: {h.maxFill}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // RESULT
  if (screen === "result") {
    const grade = fillPct >= 90 ? "Potion parfaite !" : fillPct >= 70 ? "Bonne potion !" : fillPct >= 40 ? "Potion acceptable" : "Potion ratée...";
    const emoji = fillPct >= 90 ? "A+" : fillPct >= 70 ? "B" : fillPct >= 40 ? "C" : "F";
    return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
        <div style={{ animation: "fadeIn .4s", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <Bottle fillPct={fillPct} label={`${Math.round(fillPct)}%`} />
          </div>
          <div style={{ fontSize: 24, marginBottom: 4 }}>{emoji}</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.gold }}>{grade}</div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 8 }}>Remplissage final : {Math.round(fillPct)}% · Maximum atteint : {Math.round(maxFill)}%</div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20 }}>
            <button onClick={startGame} style={{ padding: "10px 22px", borderRadius: 10, border: "none", background: C.accent, color: C.bg, cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 700 }}>Rejouer</button>
            <button onClick={() => setScreen("menu")} style={{ padding: "10px 22px", borderRadius: 10, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, cursor: "pointer", fontFamily: "inherit" }}>Menu</button>
          </div>
        </div>
      </div>
    );
  }

  // GAME
  const pct = (timeLeft / 10) * 100;
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", padding: 16 }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}} @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}60%{transform:translateX(8px)}}`}</style>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 8 }}>
          <span style={{ color: C.dimmed }}>Question {qNum + 1}/{TOTAL}</span>
          <span style={{ color: streak >= 3 ? C.accent : C.dimmed }}>Combo x{streak} {streak >= 3 ? "🔥" : ""}</span>
        </div>

        {/* Timer */}
        <div style={{ height: 4, background: C.border, borderRadius: 2, marginBottom: 12, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: pct > 30 ? C.accent : pct > 15 ? C.gold : C.danger, borderRadius: 2, transition: "width 1s linear" }} />
        </div>

        <div style={{ display: "flex", gap: 20, alignItems: "center", justifyContent: "center" }}>
          {/* Bottle */}
          <div style={{ flexShrink: 0 }}>
            <Bottle fillPct={fillPct} isWrong={isWrong} />
          </div>

          {/* Question area */}
          <div style={{ flex: 1 }}>
            {/* Expression */}
            <div style={{
              background: C.code, borderRadius: 12, padding: "20px 16px", textAlign: "center",
              marginBottom: 16, border: `1px solid ${answered ? (lastOk ? C.success : C.danger) + "50" : C.border}`,
              animation: answered && !lastOk ? "shake .3s" : "none",
            }}>
              <div style={{ fontSize: 10, color: C.dimmed, letterSpacing: 2, marginBottom: 6 }}>EVALUEZ</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.accent, fontFamily: "'JetBrains Mono',monospace" }}>
                {question?.expr}
              </div>
              {answered && (
                <div style={{ marginTop: 8, fontSize: 14, fontWeight: 600, color: lastOk ? C.success : C.danger, animation: "fadeIn .2s" }}>
                  {lastOk ? `✓ +${FILL_PER_CORRECT + (streak >= 3 ? 4 : streak >= 2 ? 2 : 0)}%` : `✗ -${DRAIN_PER_WRONG}% · Réponse: ${String(question?.answer)}`}
                </div>
              )}
            </div>

            {/* Buttons */}
            {!answered && (
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => handleAnswer(true)} style={{
                  flex: 1, padding: "16px", borderRadius: 12, border: "none",
                  background: `linear-gradient(135deg, ${C.success}, #059669)`,
                  color: "#fff", fontSize: 18, fontWeight: 800, cursor: "pointer", fontFamily: "inherit",
                }}>TRUE</button>
                <button onClick={() => handleAnswer(false)} style={{
                  flex: 1, padding: "16px", borderRadius: 12, border: "none",
                  background: `linear-gradient(135deg, ${C.danger}, #dc2626)`,
                  color: "#fff", fontSize: 18, fontWeight: 800, cursor: "pointer", fontFamily: "inherit",
                }}>FALSE</button>
              </div>
            )}

            {/* Progress dots */}
            <div style={{ display: "flex", gap: 3, justifyContent: "center", marginTop: 12 }}>
              {Array.from({ length: TOTAL }, (_, i) => (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: i < qNum ? C.success : i === qNum ? C.accent : C.border,
                }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
