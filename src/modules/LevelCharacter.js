// Animated character per level — inspired by U4 DataQuest
// Each level has a unique character with accessories

export default function LevelCharacter({ level = 0, size = 80 }) {
  const CHARS = [
    { body: "#64748b", hat: null, acc: null, label: "Noob Master" },         // 0
    { body: "#94a3b8", hat: "#94a3b8", acc: null, label: "Noob Coder" },     // 1
    { body: "#14A3C7", hat: "#14A3C7", acc: "glasses", label: "Little Coder" }, // 2
    { body: "#7C3AED", hat: "#7C3AED", acc: "headphones", label: "Vibe Coder" }, // 3
    { body: "#0D7377", hat: "#0D7377", acc: "shield", label: "Code Rookie" },   // 4
    { body: "#F59E0B", hat: "#F59E0B", acc: "star", label: "J Coder" },         // 5
    { body: "#10B981", hat: "#10B981", acc: "crown", label: "Code Master" },     // 6
    { body: "#EF4444", hat: "#EF4444", acc: "fire", label: "Code Legend" },      // 7
    { body: "#32E0C4", hat: "#FFD700", acc: "wings", label: "Lord Coder" },      // 8
  ];

  const c = CHARS[Math.min(level, CHARS.length - 1)];
  const s = size / 80; // scale factor

  return (
    <svg width={size} height={size} viewBox="-40 -50 80 80" style={{ overflow: 'visible' }}>
      <style>{`
        @keyframes cq-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
        @keyframes cq-blink{0%,90%,100%{ry:3}95%{ry:0.5}}
        @keyframes cq-wave{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-20deg)}}
        .cq-body{animation:cq-bounce 2s ease-in-out infinite;}
        .cq-eye{animation:cq-blink 3s ease-in-out infinite;}
      `}</style>

      <g className="cq-body">
        {/* Shadow */}
        <ellipse cx="0" cy="24" rx="16" ry="4" fill="rgba(0,0,0,0.2)" />

        {/* Legs */}
        <rect x="-10" y="12" width="7" height="12" rx="3" fill={c.body} opacity="0.8" />
        <rect x="3" y="12" width="7" height="12" rx="3" fill={c.body} opacity="0.8" />
        {/* Shoes */}
        <ellipse cx="-6" cy="24" rx="5" ry="2.5" fill="#1E293B" />
        <ellipse cx="7" cy="24" rx="5" ry="2.5" fill="#1E293B" />

        {/* Body */}
        <rect x="-14" y="-8" width="28" height="22" rx="6" fill={c.body} />
        {/* Shirt detail */}
        <rect x="-4" y="-2" width="8" height="12" rx="2" fill="rgba(255,255,255,0.15)" />

        {/* Arms */}
        <g style={{ transformOrigin: '-14px -2px' }} className={level >= 5 ? "" : ""}>
          <rect x="-22" y="-4" width="8" height="14" rx="3" fill={c.body} opacity="0.9" />
          <circle cx="-18" cy="12" r="3" fill={c.body} />
        </g>
        <rect x="14" y="-4" width="8" height="14" rx="3" fill={c.body} opacity="0.9" />
        <circle cx="18" cy="12" r="3" fill={c.body} />

        {/* Head */}
        <circle cx="0" cy="-20" r="14" fill={c.body} />
        {/* Face (lighter) */}
        <circle cx="0" cy="-19" r="11" fill="rgba(255,255,255,0.1)" />

        {/* Eyes */}
        <ellipse className="cq-eye" cx="-5" cy="-21" rx="2.5" ry="3" fill="white" />
        <ellipse className="cq-eye" cx="5" cy="-21" rx="2.5" ry="3" fill="white" />
        <circle cx="-4" cy="-21" r="1.5" fill="#1E293B" />
        <circle cx="6" cy="-21" r="1.5" fill="#1E293B" />
        {/* Eye shine */}
        <circle cx="-3" cy="-22" r="0.6" fill="white" />
        <circle cx="7" cy="-22" r="0.6" fill="white" />

        {/* Mouth */}
        {level < 3 ? (
          <line x1="-3" y1="-14" x2="3" y2="-14" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
        ) : (
          <path d="M-4,-14 Q0,-10 4,-14" fill="none" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
        )}

        {/* Hat (level 1+) */}
        {c.hat && level >= 1 && level < 6 && (
          <g>
            <rect x="-12" y="-36" width="24" height="4" rx="2" fill={c.hat} />
            <rect x="-8" y="-42" width="16" height="8" rx="3" fill={c.hat} opacity="0.9" />
          </g>
        )}

        {/* Crown (level 6+) */}
        {level >= 6 && (
          <g>
            <polygon points="-10,-34 -6,-42 -2,-36 2,-42 6,-36 10,-42 14,-34" fill="#FFD700" stroke="#F59E0B" strokeWidth="0.5" />
            {level >= 8 && <circle cx="0" cy="-38" r="2" fill="#EF4444" />}
          </g>
        )}

        {/* Glasses (level 2) */}
        {c.acc === "glasses" && (
          <g>
            <circle cx="-5" cy="-21" r="4" fill="none" stroke="white" strokeWidth="1" opacity="0.6" />
            <circle cx="5" cy="-21" r="4" fill="none" stroke="white" strokeWidth="1" opacity="0.6" />
            <line x1="-1" y1="-21" x2="1" y2="-21" stroke="white" strokeWidth="1" opacity="0.6" />
          </g>
        )}

        {/* Headphones (level 3) */}
        {c.acc === "headphones" && (
          <g>
            <path d="M-14,-24 Q-16,-34 0,-36 Q16,-34 14,-24" fill="none" stroke={c.body} strokeWidth="3" />
            <rect x="-17" y="-26" width="5" height="8" rx="2" fill={c.body} stroke="white" strokeWidth="0.5" />
            <rect x="12" y="-26" width="5" height="8" rx="2" fill={c.body} stroke="white" strokeWidth="0.5" />
          </g>
        )}

        {/* Shield (level 4) */}
        {c.acc === "shield" && (
          <g transform="translate(-24, -2)">
            <path d="M0,-6 L-6,0 L-4,8 L0,10 L4,8 L6,0 Z" fill={c.body} stroke="white" strokeWidth="0.8" />
            <text x="0" y="3" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">S</text>
          </g>
        )}

        {/* Star (level 5) */}
        {c.acc === "star" && (
          <g transform="translate(20, -8)">
            <polygon points="0,-6 2,-2 6,-1 3,2 4,6 0,4 -4,6 -3,2 -6,-1 -2,-2" fill="#FFD700">
              <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" />
            </polygon>
          </g>
        )}

        {/* Fire (level 7) */}
        {c.acc === "fire" && (
          <g transform="translate(0, -46)">
            <ellipse cx="0" cy="0" rx="6" ry="8" fill="#EF4444" opacity="0.8">
              <animate attributeName="ry" values="8;10;8" dur="0.5s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="0" cy="2" rx="3" ry="5" fill="#F59E0B" opacity="0.9">
              <animate attributeName="ry" values="5;6;5" dur="0.4s" repeatCount="indefinite" />
            </ellipse>
          </g>
        )}

        {/* Wings (level 8) */}
        {c.acc === "wings" && (
          <g>
            <path d="M-14,-4 Q-30,-14 -28,-2 Q-26,4 -14,2" fill="#32E0C4" opacity="0.4">
              <animate attributeName="d" values="M-14,-4 Q-30,-14 -28,-2 Q-26,4 -14,2;M-14,-4 Q-34,-18 -30,-4 Q-28,2 -14,2;M-14,-4 Q-30,-14 -28,-2 Q-26,4 -14,2" dur="2s" repeatCount="indefinite" />
            </path>
            <path d="M14,-4 Q30,-14 28,-2 Q26,4 14,2" fill="#32E0C4" opacity="0.4">
              <animate attributeName="d" values="M14,-4 Q30,-14 28,-2 Q26,4 14,2;M14,-4 Q34,-18 30,-4 Q28,2 14,2;M14,-4 Q30,-14 28,-2 Q26,4 14,2" dur="2s" repeatCount="indefinite" />
            </path>
          </g>
        )}
      </g>
    </svg>
  );
}
