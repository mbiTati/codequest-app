import { useAuth } from '../lib/AuthProvider';
import { Zap, Star, TrendingUp, Play, FolderOpen } from 'lucide-react';
import LevelCharacter from './LevelCharacter';

const C = {
  bg:"#0a0f1a",card:"#111827",accent:"#32E0C4",gold:"#F59E0B",
  text:"#e2e8f0",muted:"#94a3b8",border:"#1e293b",success:"#10B981",primary:"#0D7377",dimmed:"#64748b",
};

const LEVELS = [
  {name:"Noob Master",min:0,color:"#64748b"},{name:"Noob Coder",min:50,color:"#94a3b8"},
  {name:"Little Coder",min:150,color:"#14A3C7"},{name:"Vibe Coder",min:300,color:"#7C3AED"},
  {name:"Code Rookie",min:500,color:"#0D7377"},{name:"J Coder",min:750,color:"#F59E0B"},
  {name:"Code Master",min:1000,color:"#10B981"},{name:"Code Legend",min:1500,color:"#EF4444"},
  {name:"Lord Coder",min:2000,color:"#32E0C4"},
];

function getLevel(cr){let l=LEVELS[0];for(const lv of LEVELS)if(cr>=lv.min)l=lv;return l;}
function getNextLevel(cr){for(const l of LEVELS)if(cr<l.min)return l;return null;}
function getLevelIndex(cr){let i=0;for(let j=0;j<LEVELS.length;j++)if(cr>=LEVELS[j].min)i=j;return i;}

const MOD_ORDER=["M00","M15","M01","M02","M03","M04","M05","M14","M06","M07","M08","M09","M10","M11","M12","M13"];
const MOD_NAMES={M00:"Fondamentaux",M15:"Variables",M01:"Conditions",M02:"Boucles",M03:"POO",M04:"Data",M05:"Heritage",M14:"Swing",M06:"Git",M07:"Securite",M08:"Build",M09:"Debugging",M10:"Standards",M11:"Escape Room",M12:"Fichiers",M13:"BDD"};

export default function StudentHome({ onOpenModule, onOpenCours }) {
  const { student } = useAuth();
  const isTeacher = student?.role === 'teacher';

  const progress = MOD_ORDER.map(code => {
    try {
      const d = JSON.parse(localStorage.getItem("cq-" + code.toLowerCase() + "-unified"));
      if (!d) return { code, started:false, done:false, cr:0 };
      const steps = Object.keys(d.c||{}).length;
      return { code, started:true, done:steps>=5, cr:d.cr||0 };
    } catch { return { code, started:false, done:false, cr:0 }; }
  });

  const totalCr = progress.reduce((a,m) => a+m.cr, 0);
  const done = progress.filter(m => m.done).length;
  const started = progress.filter(m => m.started).length;
  const level = getLevel(totalCr);
  const next = getNextLevel(totalCr);
  const lvlIdx = getLevelIndex(totalCr);
  const pct = next ? Math.min(100, Math.round(((totalCr-level.min)/(next.min-level.min))*100)) : 100;
  const nextMod = progress.find(m => m.started && !m.done) || progress.find(m => !m.started);

  return (
    <div style={{ padding: "12px 20px 0", maxWidth: 900, margin: "0 auto" }}>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes glow{0%,100%{box-shadow:0 0 12px ${level.color}30}50%{box-shadow:0 0 24px ${level.color}60}}
        @keyframes shimmer{0%{background-position:-200px 0}100%{background-position:200px 0}}
        .hc{animation:fadeIn .3s ease-out both}
        .lr{animation:glow 2s infinite}
        .xf{background:linear-gradient(90deg,${level.color},${level.color}cc);background-size:200px 100%;animation:shimmer 2s infinite linear}
      `}</style>

      {/* Welcome card — compact */}
      <div className="hc" style={{ background:`linear-gradient(135deg,${C.card},${level.color}12)`, borderRadius:14, padding:"14px 18px", border:"1px solid "+level.color+"25", marginBottom:12, display:"flex", alignItems:"center", gap:16 }}>
        <div className="lr" style={{ width:60,height:60,flexShrink:0, display:"flex",alignItems:"center",justifyContent:"center" }}>
          {isTeacher ? (
            <div style={{ width:56,height:56,borderRadius:"50%",background:level.color+"18",border:"2px solid "+level.color,display:"flex",alignItems:"center",justifyContent:"center" }}>
              <div style={{ fontSize:15,fontWeight:800,color:level.color }}>PROF</div>
            </div>
          ) : (
            <LevelCharacter level={lvlIdx} size={56} />
          )}
        </div>
        <div style={{ flex:1,minWidth:0 }}>
          <div style={{ fontSize:15,fontWeight:700,color:C.text }}>{"Bonjour "+(student?.first_name||"Codeur")+" !"}</div>
          <div style={{ fontSize:12,fontWeight:600,color:level.color }}>{isTeacher?"Professeur":level.name}</div>
          {!isTeacher && <div style={{ marginTop:5 }}>
            <div style={{ display:"flex",justifyContent:"space-between",fontSize:9,color:C.muted,marginBottom:2 }}>
              <span>{totalCr+" CR"}</span><span>{next?next.min+" CR":"MAX !"}</span>
            </div>
            <div style={{ height:5,background:C.border,borderRadius:3,overflow:"hidden" }}>
              <div className="xf" style={{ height:"100%",width:pct+"%",borderRadius:3 }}/>
            </div>
          </div>}
        </div>
        <div style={{ textAlign:"center",flexShrink:0 }}>
          <div style={{ fontSize:20,fontWeight:800,color:C.gold }}>{totalCr}</div>
          <div style={{ fontSize:8,color:C.muted }}>Credits</div>
        </div>
      </div>

      {/* Quick row: stats + continue + cours */}
      <div className="hc" style={{ display:"flex",gap:8,marginBottom:12,animationDelay:".1s" }}>
        {[
          {icon:<Star size={14}/>,v:done+"/16",l:"OK",c:C.accent},
          {icon:<TrendingUp size={14}/>,v:started-done,l:"En cours",c:C.gold},
          {icon:<Zap size={14}/>,v:totalCr,l:"CR",c:C.primary},
        ].map((s,i)=>(
          <div key={i} style={{ flex:1,background:C.card,borderRadius:8,padding:"8px 6px",border:"1px solid "+C.border,textAlign:"center" }}>
            <div style={{ color:s.c }}>{s.icon}</div>
            <div style={{ fontSize:16,fontWeight:700,color:s.c }}>{s.v}</div>
            <div style={{ fontSize:8,color:C.muted }}>{s.l}</div>
          </div>
        ))}
        {nextMod ? (
          <button onClick={()=>onOpenModule(nextMod.code.toLowerCase())} style={{ flex:2,background:"linear-gradient(135deg,"+C.accent+"12,"+C.primary+"12)", borderRadius:8,padding:"8px 12px",border:"1px solid "+C.accent+"35",color:C.accent,cursor:"pointer",fontFamily:"inherit",textAlign:"left",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
            <div><div style={{ fontSize:8,color:C.muted }}>{nextMod.started?"Continuer":"Prochain"}</div><div style={{ fontSize:13,fontWeight:700 }}>{nextMod.code+" "+MOD_NAMES[nextMod.code]}</div></div>
            <Play size={16}/>
          </button>
        ) : (
          <div style={{ flex:2,background:C.card,borderRadius:8,padding:8,border:"1px solid "+C.success+"35",textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center" }}>
            <span style={{ fontSize:12,fontWeight:700,color:C.success }}>Tout complete !</span>
          </div>
        )}
        <button onClick={onOpenCours} style={{ width:40,background:C.card,borderRadius:8,border:"1px solid "+C.gold+"35",color:C.gold,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
          <FolderOpen size={16}/>
        </button>
      </div>
    </div>
  );
}
