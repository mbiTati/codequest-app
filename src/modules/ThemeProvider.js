import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const DARK = {
  bg: "#0a0f1a", card: "#111827", primary: "#0D7377", secondary: "#14A3C7",
  accent: "#32E0C4", gold: "#F59E0B", text: "#e2e8f0", muted: "#94a3b8",
  dimmed: "#64748b", border: "#1e293b", success: "#10B981", danger: "#EF4444",
  code: "#1E293B", codeText: "#32E0C4", codeBorder: "#2d3a4f",
};

const LIGHT = {
  bg: "#f8fafc", card: "#ffffff", primary: "#0D7377", secondary: "#14A3C7",
  accent: "#0D7377", gold: "#d97706", text: "#1e293b", muted: "#475569",
  dimmed: "#94a3b8", border: "#e2e8f0", success: "#059669", danger: "#dc2626",
  code: "#f1f5f9", codeText: "#0D7377", codeBorder: "#cbd5e1",
};

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("cq-theme");
    if (saved === "light") setIsDark(false);
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("cq-theme", next ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggle, C: isDark ? DARK : LIGHT }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeToggle() {
  const { isDark, toggle } = useTheme();
  return (
    <button onClick={toggle} style={{
      padding: "4px 12px", borderRadius: 5,
      border: "1px solid " + (isDark ? "#1e293b" : "#e2e8f0"),
      background: "transparent",
      color: isDark ? "#94a3b8" : "#475569",
      cursor: "pointer", fontFamily: "'Segoe UI',sans-serif", fontSize: 10,
    }}>
      {isDark ? "Mode clair" : "Mode sombre"}
    </button>
  );
}
