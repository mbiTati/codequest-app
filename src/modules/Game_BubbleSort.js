import { useState, useEffect, useRef, useCallback } from "react";

const C = {
  bg: "#0a0f1a", card: "#111827", accent: "#32E0C4", gold: "#F59E0B",
  text: "#e2e8f0", muted: "#94a3b8", dimmed: "#64748b", border: "#1e293b",
  success: "#10B981", danger: "#EF4444", primary: "#0D7377",
  code: "#1E293B", codeText: "#32E0C4",
};

const KEY = "cq-game-bubblesort";

function genArray(size) {
  const arr = [];
  for (let i = 0; i < size; i++) arr.push(Math.floor(Math.random() * 90) + 10);
  return arr;
}

function BubbleSortVisual({ arr, comparing, swapping, sorted, active }) {
  const maxVal = Math.max(...arr, 100);
  const barW = Math.min(48, Math.floor(500 / arr.length) - 4);
  
  return (
    <div style={{
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      gap: 3, height: 220, padding: "10px 0",
    }}>
      {arr.map((val, i) => {
        let bg = `linear-gradient(180deg, ${C.primary}, ${C.accent}40)`;
        let bc = C.border;
        let scale = 1;
        
        if (sorted.includes(i)) { bg = `linear-gradient(180deg, ${C.success}, ${C.success}60)`; bc = C.success; }
        else if (swapping.includes(i)) { bg = `linear-gradient(180deg, ${C.danger}, ${C.danger}60)`; bc = C.danger; scale = 1.05; }
        else if (comparing.includes(i)) { bg = `linear-gradient(180deg, ${C.gold}, ${C.gold}60)`; bc = C.gold; }
        else if (i === active) { bg = `linear-gradient(180deg, ${C.secondary}, ${C.secondary}60)`; bc = C.secondary; }
        
        const h = (val / maxVal) * 180;
        
        return (
          <div key={i} style={{
            width: barW, height: h, background: bg,
            borderRadius: "4px 4px 0 0", border: `1px solid ${bc}`,
            borderBottom: "none", transition: "all .25s ease",
            display: "flex", alignItems: "flex-start", justifyContent: "center",
            paddingTop: 4, transform: `scale(${scale})`,
          }}>
            <span style={{
              fontSize: 11, fontWeight: 700, color: "#fff",
              textShadow: "0 1px 2px rgba(0,0,0,.5)",
            }}>{val}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function BubbleSortGame() {
  const [screen, setScreen] = useState("menu");
  const [difficulty, setDifficulty] = useState("easy");
  const [arr, setArr] = useState([]);
  const [mode, setMode] = useState("manual"); // manual, auto
  const [comparing, setComparing] = useState([]);
  const [swapping, setSwapping] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [active, setActive] = useState(-1);
  const [step, setStep] = useState(0);
  const [swapCount, setSwapCount] = useState(0);
  const [compareCount, setCompareCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [autoRunning, setAutoRunning] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [history, setHistory] = useState([]);
  
  // Bubble sort state
  const iRef = useRef(0);
  const jRef = useRef(0);
  const passRef = useRef(0);

  useEffect(() => { (async () => { try { const r = await window.storage.get(KEY); if (r) setHistory(JSON.parse(r.value)); } catch {} })(); }, []);

  const SIZES = { easy: 8, medium: 12, hard: 18 };

  const startGame = (diff) => {
    setDifficulty(diff);
    const a = genArray(SIZES[diff]);
    setArr(a);
    setComparing([]); setSwapping([]); setSorted([]); setActive(-1);
    setStep(0); setSwapCount(0); setCompareCount(0);
    setIsComplete(false); setAutoRunning(false);
    iRef.current = 0; jRef.current = 0; passRef.current = 0;
    setScreen("game");
  };

  const doStep = useCallback(() => {
    if (isComplete) return;
    
    const n = arr.length;
    let i = iRef.current;
    let j = jRef.current;
    
    if (i >= n - 1 - passRef.current) {
      // Check if sorted
      let allSorted = true;
      for (let k = 0; k < n - 1; k++) {
        if (arr[k] > arr[k + 1]) { allSorted = false; break; }
      }
      if (allSorted || passRef.current >= n - 1) {
        setSorted(arr.map((_, idx) => idx));
        setComparing([]); setSwapping([]); setActive(-1);
        setIsComplete(true);
        const entry = { date: new Date().toLocaleDateString("fr-CH"), diff: difficulty, swaps: swapCount, compares: compareCount, size: n };
        const newH = [...history, entry].slice(-20);
        setHistory(newH);
        try { window.storage.set(KEY, JSON.stringify(newH)); } catch {}
        return;
      }
      passRef.current++;
      iRef.current = 0;
      jRef.current = 0;
      setComparing([0, 1]);
      setActive(0);
      setStep(s => s + 1);
      setCompareCount(c => c + 1);
      return;
    }
    
    // Compare
    setComparing([i, i + 1]);
    setActive(i);
    setCompareCount(c => c + 1);
    
    if (arr[i] > arr[i + 1]) {
      // Swap needed
      setSwapping([i, i + 1]);
      setTimeout(() => {
        const newArr = [...arr];
        [newArr[i], newArr[i + 1]] = [newArr[i + 1], newArr[i]];
        setArr(newArr);
        setSwapCount(s => s + 1);
        setSwapping([]);
        iRef.current = i + 1;
        setStep(s => s + 1);
      }, Math.floor(speed * 0.4));
    } else {
      iRef.current = i + 1;
      setStep(s => s + 1);
    }
  }, [arr, isComplete, speed, difficulty, swapCount, compareCount, history]);

  // Auto mode
  useEffect(() => {
    if (!autoRunning || isComplete) return;
    const timer = setTimeout(doStep, speed);
    return () => clearTimeout(timer);
  }, [autoRunning, step, isComplete, doStep, speed]);

  // MENU
  if (screen === "menu") return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ animation: "fadeIn .4s", textAlign: "center", maxWidth: 480 }}>
        <div style={{ fontSize: 12, letterSpacing: 3, color: C.dimmed, marginBottom: 8 }}>CODEQUEST · ARCADE</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.accent, marginBottom: 4 }}>Bubble Sort</div>
        <div style={{ fontSize: 16, marginBottom: 8 }}>Bubble Sort</div>
        <div style={{ fontSize: 14, color: C.muted, marginBottom: 24, lineHeight: 1.6 }}>
          Visualisez l'algorithme de tri à bulles ! Les barres se comparent deux par deux — si la gauche est plus grande, elles s'échangent. Étape par étape ou en automatique.
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          {[["easy", "Facile (8)"], ["medium", "Moyen (12)"], ["hard", "Difficile (18)"]].map(([d, label]) => (
            <button key={d} onClick={() => startGame(d)} style={{
              padding: "12px 24px", borderRadius: 10, border: `1px solid ${C.border}`,
              background: C.card, color: C.text, cursor: "pointer", fontFamily: "inherit",
              fontSize: 14, fontWeight: 600, minWidth: 120,
            }}>{label}</button>
          ))}
        </div>
        {history.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: 2, color: C.dimmed, marginBottom: 8 }}>HISTORIQUE</div>
            {[...history].reverse().slice(0, 5).map((h, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 12px", borderRadius: 6, background: C.card, border: `1px solid ${C.border}`, fontSize: 11, marginBottom: 3 }}>
                <span style={{ color: C.dimmed }}>{h.date}</span>
                <span>{h.size} éléments</span>
                <span style={{ color: C.gold }}>{h.swaps} échanges</span>
                <span style={{ color: C.muted }}>{h.compares} comparaisons</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // GAME
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", padding: 16 }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <button onClick={() => setScreen("menu")} style={{ padding: "4px 12px", borderRadius: 6, border: `1px solid ${C.border}`, background: "transparent", color: C.dimmed, cursor: "pointer", fontFamily: "inherit", fontSize: 11 }}>← Menu</button>
          <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
            <span style={{ color: C.muted }}>Étape <strong style={{ color: C.accent }}>{step}</strong></span>
            <span style={{ color: C.muted }}>Échanges <strong style={{ color: C.gold }}>{swapCount}</strong></span>
            <span style={{ color: C.muted }}>Comparaisons <strong style={{ color: C.secondary }}>{compareCount}</strong></span>
          </div>
        </div>

        {/* Visualization */}
        <div style={{ background: C.card, borderRadius: 12, padding: 16, border: `1px solid ${C.border}`, marginBottom: 12 }}>
          <BubbleSortVisual
            arr={arr}
            comparing={comparing}
            swapping={swapping}
            sorted={sorted}
            active={active}
          />
          
          {/* Legend */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 8 }}>
            {[
              { color: C.gold, label: "Compare" },
              { color: C.danger, label: "Échange" },
              { color: C.success, label: "Trié" },
            ].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: C.muted }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        {isComplete ? (
          <div style={{ textAlign: "center", animation: "fadeIn .3s" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.success, marginBottom: 8 }}>Trié !</div>
            <div style={{ fontSize: 13, color: C.muted }}>
              {arr.length} éléments triés en {swapCount} échanges et {compareCount} comparaisons
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12 }}>
              <button onClick={() => startGame(difficulty)} style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: C.accent, color: C.bg, cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700 }}>Rejouer</button>
              <button onClick={() => setScreen("menu")} style={{ padding: "8px 20px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>Menu</button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            <button onClick={doStep} disabled={autoRunning} style={{
              padding: "10px 24px", borderRadius: 8, border: "none",
              background: autoRunning ? C.border : C.accent, color: autoRunning ? C.dimmed : C.bg,
              cursor: autoRunning ? "default" : "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700,
            }}>Étape suivante</button>
            <button onClick={() => setAutoRunning(!autoRunning)} style={{
              padding: "10px 24px", borderRadius: 8, border: `1px solid ${C.border}`,
              background: autoRunning ? C.danger + "20" : "transparent",
              color: autoRunning ? C.danger : C.muted,
              cursor: "pointer", fontFamily: "inherit", fontSize: 13,
            }}>{autoRunning ? "⏸ Pause" : "▶ Auto"}</button>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, color: C.dimmed }}>Vitesse</span>
              <input type="range" min="50" max="1000" value={1050 - speed} onChange={e => setSpeed(1050 - parseInt(e.target.value))} style={{ width: 80 }} />
            </div>
          </div>
        )}

        {/* Code explanation */}
        <div style={{ background: C.code, borderRadius: 10, padding: 14, marginTop: 16, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 11, color: C.dimmed, letterSpacing: 1, marginBottom: 6 }}>ALGORITHME</div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: C.codeText, lineHeight: 1.8 }}>
            <div><span style={{ color: C.keyword }}>for</span> (i = 0; i {"<"} n-1; i++) {"{"}</div>
            <div style={{ paddingLeft: 16, color: comparing.length ? C.gold : C.codeText }}>
              <span style={{ color: C.keyword }}>if</span> (arr[{comparing[0] ?? "i"}] {">"} arr[{comparing[1] ?? "i+1"}])
              {comparing.length > 0 && <span style={{ color: C.muted }}> // {arr[comparing[0]]} {">"} {arr[comparing[1]]} ? {arr[comparing[0]] > arr[comparing[1]] ? "OUI → échange" : "NON → suivant"}</span>}
            </div>
            <div style={{ paddingLeft: 24 }}>swap(arr[i], arr[i+1]);</div>
            <div>{"}"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
