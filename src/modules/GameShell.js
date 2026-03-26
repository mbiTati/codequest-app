import { ChevronLeft } from 'lucide-react';

const C = {
  bg: "#0a0f1a", card: "#111827", accent: "#32E0C4", gold: "#F59E0B",
  text: "#e2e8f0", muted: "#94a3b8", dimmed: "#64748b", border: "#1e293b",
  danger: "#EF4444", success: "#10B981",
};

export default function GameShell({ title, color = C.accent, score, current, total, children }) {
  const handleBack = () => {
    if (window.history.length > 1) window.history.back();
    else window.location.reload();
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      <div style={{
        padding: "6px 16px", background: C.card, borderBottom: "1px solid " + C.border,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <button onClick={handleBack} style={{
          display: "flex", alignItems: "center", gap: 4,
          padding: "5px 12px", borderRadius: 7, border: "1px solid " + C.border,
          background: "transparent", color: C.muted, cursor: "pointer",
          fontFamily: "inherit", fontSize: 11,
        }}>
          <ChevronLeft size={14} /> Retour
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color }}>{title}</span>
          {current !== undefined && total !== undefined && (
            <span style={{
              padding: "2px 10px", borderRadius: 10,
              background: color + "15", border: "1px solid " + color + "30",
              fontSize: 10, fontWeight: 600, color,
            }}>
              {current + " / " + total}
            </span>
          )}
          {score !== undefined && (
            <span style={{ fontSize: 11, color: C.gold, fontWeight: 700 }}>
              {"Score: " + score}
            </span>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
