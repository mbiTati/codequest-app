import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthProvider';
import { Award, TrendingUp, Trophy, Star, Zap, Target, Crown } from 'lucide-react';

const C = {
  bg:"#0a0f1a",card:"#111827",accent:"#32E0C4",gold:"#F59E0B",
  text:"#e2e8f0",muted:"#94a3b8",border:"#1e293b",danger:"#EF4444",
  primary:"#0D7377",success:"#10B981",dimmed:"#64748b",
};

const LEVELS = [
  {name:"Noob Master",min:0,color:"#64748b",icon:"NM"},
  {name:"Noob Coder",min:50,color:"#94a3b8",icon:"NC"},
  {name:"Little Coder",min:150,color:"#14A3C7",icon:"LC"},
  {name:"Vibe Coder",min:300,color:"#7C3AED",icon:"VC"},
  {name:"Code Rookie",min:500,color:"#0D7377",icon:"CR"},
  {name:"J Coder",min:750,color:"#F59E0B",icon:"JC"},
  {name:"Code Master",min:1000,color:"#10B981",icon:"CM"},
  {name:"Code Legend",min:1500,color:"#EF4444",icon:"CL"},
  {name:"Lord Coder",min:2000,color:"#32E0C4",icon:"LC"},
];

function getLevel(cr){let l=LEVELS[0];for(const lv of LEVELS)if(cr>=lv.min)l=lv;return l;}
function getNextLevel(cr){for(const l of LEVELS)if(cr<l.min)return l;return null;}
function getLevelIndex(cr){let idx=0;for(let i=0;i<LEVELS.length;i++)if(cr>=LEVELS[i].min)idx=i;return idx;}

const MODULES_LIST=["M00","M15","M01","M02","M03","M04","M05","M14","M06","M07","M08","M09","M10","M11","M12","M13"];

export default function StudentScorePage(){
  const {user, student}=useAuth();
  const [progress,setProgress]=useState([]);
  const [gameScores,setGameScores]=useState([]);
  const [leaderboard,setLeaderboard]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);

  useEffect(()=>{loadData();},[student]);

  async function loadData(){
    try {
      if(student){
        const [pR,gR]=await Promise.all([
          supabase.from('cq_student_progress').select('*,cq_modules(code,title,order_index)').eq('student_id',student.id),
          supabase.from('cq_game_scores').select('*').eq('student_id',student.id).order('played_at',{ascending:false}).limit(20),
        ]);
        setProgress(pR.data||[]);
        setGameScores(gR.data||[]);
      }
      // Leaderboard - try to load, fail gracefully
      try {
        const lR = await supabase.from('cq_students').select('id,first_name,last_name,total_credits,current_level').order('total_credits',{ascending:false}).limit(20);
        setLeaderboard(lR.data||[]);
      } catch(e){ setLeaderboard([]); }
    } catch(e){
      console.log('Score page load error (tables may not exist yet):', e);
      setError('Les tables ne sont pas encore creees dans Supabase.');
    }
    setLoading(false);
  }

  // Compute stats from localStorage as fallback
  const localCredits = (() => {
    let total = 0;
    for(let i=0;i<localStorage.length;i++){
      const key = localStorage.key(i);
      if(key && key.startsWith('cq-m')){
        try { const d=JSON.parse(localStorage.getItem(key)); if(d&&d.cr)total+=d.cr; } catch(e){}
      }
    }
    return total;
  })();

  const localModules = (() => {
    let count = 0;
    for(let i=0;i<localStorage.length;i++){
      const key = localStorage.key(i);
      if(key && key.startsWith('cq-m')){
        try { const d=JSON.parse(localStorage.getItem(key)); if(d&&d.c&&Object.keys(d.c).length>=5)count++; } catch(e){}
      }
    }
    return count;
  })();

  if(loading)return<div style={{minHeight:"100vh",background:C.bg,color:C.muted,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',sans-serif"}}>Chargement...</div>;

  const name = student ? student.first_name+" "+student.last_name : (user?.email || "Etudiant");
  const totalCredits = progress.length > 0 ? progress.reduce((a,p)=>a+(p.credits_earned||0),0) : localCredits;
  const totalQ = progress.reduce((a,p)=>a+(p.total_questions||0),0);
  const totalCorrect = progress.reduce((a,p)=>a+(p.quiz_score||0),0);
  const accuracy = totalQ>0?Math.round((totalCorrect/totalQ)*100):0;
  const modulesCompleted = progress.length > 0 ? progress.filter(p=>p.completed_at).length : localModules;
  const currentLevel = getLevel(totalCredits);
  const nextLevel = getNextLevel(totalCredits);
  const levelIdx = getLevelIndex(totalCredits);
  const xpInLevel = nextLevel?totalCredits-currentLevel.min:totalCredits;
  const xpForLevel = nextLevel?nextLevel.min-currentLevel.min:1;
  const xpPct = nextLevel?Math.min(100,Math.round((xpInLevel/xpForLevel)*100)):100;
  const myRank = student ? leaderboard.findIndex(l=>l.id===student.id)+1 : 0;

  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',system-ui,sans-serif",padding:20}}>
      <style>{`
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
        @keyframes glow{0%,100%{box-shadow:0 0 20px ${currentLevel.color}40}50%{box-shadow:0 0 40px ${currentLevel.color}80}}
        @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-200px 0}100%{background-position:200px 0}}
        .level-badge{animation:glow 2s infinite,pulse 3s infinite}
        .stat-card{animation:slideUp .4s ease-out both}
        .xp-bar-fill{background:linear-gradient(90deg,${currentLevel.color},${currentLevel.color}dd);background-size:200px 100%;animation:shimmer 2s infinite linear}
      `}</style>

      <div style={{maxWidth:700,margin:"0 auto"}}>
        {error&&<div style={{padding:"10px 14px",borderRadius:8,background:C.gold+"15",border:"1px solid "+C.gold+"40",fontSize:11,color:C.gold,marginBottom:16}}>{error} La progression est lue depuis le navigateur en attendant.</div>}

        {/* Profile + Level */}
        <div style={{textAlign:"center",marginBottom:24}}>
          <div className="level-badge" style={{
            width:100,height:100,borderRadius:"50%",margin:"0 auto 12px",
            background:currentLevel.color+"20",border:"3px solid "+currentLevel.color,
            display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
          }}>
            <div style={{fontSize:24,fontWeight:800,color:currentLevel.color}}>{currentLevel.icon}</div>
            <div style={{fontSize:8,color:currentLevel.color,fontWeight:600,marginTop:2}}>{"Niv."+(levelIdx+1)}</div>
          </div>
          <div style={{fontSize:20,fontWeight:700,color:C.text}}>{name}</div>
          <div style={{fontSize:16,fontWeight:700,color:currentLevel.color,marginTop:4}}>{currentLevel.name}</div>

          {/* XP Bar */}
          <div style={{maxWidth:400,margin:"12px auto 0"}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:C.muted,marginBottom:3}}>
              <span>{totalCredits+" CR"}</span>
              <span>{nextLevel?nextLevel.min+" CR pour "+nextLevel.name:"MAX !"}</span>
            </div>
            <div style={{height:8,background:C.border,borderRadius:4,overflow:"hidden"}}>
              <div className="xp-bar-fill" style={{height:"100%",width:xpPct+"%",borderRadius:4,transition:"width 1s ease"}}/>
            </div>
          </div>

          {/* Level dots */}
          <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:12}}>
            {LEVELS.map((l,i)=>(
              <div key={i} title={l.name+" ("+l.min+" CR)"} style={{
                width:i<=levelIdx?28:20,height:i<=levelIdx?28:20,borderRadius:"50%",
                background:i<=levelIdx?l.color:C.border,
                border:i===levelIdx?"2px solid "+l.color:"2px solid transparent",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:7,fontWeight:700,color:i<=levelIdx?"#fff":C.dimmed,
                transition:"all .3s",
              }}>{l.icon}</div>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20}}>
          {[
            {icon:<Target size={18}/>,label:"Quiz",value:accuracy>0?accuracy+"%":"--",color:accuracy>=60?C.success:accuracy>0?C.danger:C.muted},
            {icon:<Award size={18}/>,label:"Modules",value:modulesCompleted+"/16",color:C.accent},
            {icon:<Zap size={18}/>,label:"Credits",value:totalCredits,color:C.gold},
            {icon:<Trophy size={18}/>,label:"Rang",value:myRank>0?"#"+myRank:"--",color:C.primary},
          ].map((s,i)=>(
            <div key={i} className="stat-card" style={{background:C.card,borderRadius:10,padding:12,border:"1px solid "+C.border,textAlign:"center",animationDelay:i*0.1+"s"}}>
              <div style={{color:s.color,marginBottom:4}}>{s.icon}</div>
              <div style={{fontSize:20,fontWeight:800,color:s.color}}>{s.value}</div>
              <div style={{fontSize:9,color:C.muted,marginTop:2}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Module Progress Grid */}
        <div style={{background:C.card,borderRadius:12,padding:14,border:"1px solid "+C.border,marginBottom:16}}>
          <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:10,display:"flex",alignItems:"center",gap:6}}><Star size={14} color={C.gold}/>Progression des modules</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(8,1fr)",gap:4}}>
            {MODULES_LIST.map(code=>{
              const sp=progress.find(p=>p.cq_modules?.code===code);
              let done=sp?.completed_at;
              let started=!!sp;
              // Fallback: check localStorage
              if(!started){
                const key="cq-"+code.toLowerCase()+"-unified";
                try{const d=JSON.parse(localStorage.getItem(key));if(d&&d.c&&Object.keys(d.c).length>0){started=true;if(Object.keys(d.c).length>=5)done=true;}}catch(e){}
              }
              return(<div key={code} title={code} style={{
                height:32,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:9,fontWeight:700,
                background:done?C.success+"20":started?C.gold+"15":C.border+"30",
                color:done?C.success:started?C.gold:C.dimmed,
                border:"1px solid "+(done?C.success:started?C.gold:C.border)+"30",
              }}>{code.replace("M","")}</div>);
            })}
          </div>
        </div>

        {/* Leaderboard */}
        <div style={{background:C.card,borderRadius:12,padding:14,border:"1px solid "+C.border,marginBottom:16}}>
          <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:10,display:"flex",alignItems:"center",gap:6}}><Crown size={14} color={C.gold}/>Classement</div>
          {leaderboard.filter(l=>(l.total_credits||0)>0).length===0?(
            <div style={{textAlign:"center",color:C.dimmed,fontSize:11,padding:12}}>Completez des modules pour apparaitre au classement !</div>
          ):(
            leaderboard.filter(l=>(l.total_credits||0)>0).slice(0,10).map((l,i)=>{
              const isMe=student&&l.id===student.id;
              const lvl=getLevel(l.total_credits||0);
              return(<div key={l.id} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 8px",borderRadius:6,background:isMe?C.accent+"10":"transparent",marginBottom:2}}>
                <div style={{width:24,textAlign:"center",fontSize:12,fontWeight:700,color:i<3?C.gold:C.dimmed}}>{"#"+(i+1)}</div>
                <div style={{width:22,height:22,borderRadius:"50%",background:lvl.color+"20",border:"1px solid "+lvl.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,fontWeight:700,color:lvl.color}}>{lvl.icon}</div>
                <div style={{flex:1,fontSize:12,fontWeight:isMe?700:400,color:isMe?C.accent:C.text}}>{l.first_name+" "+l.last_name}</div>
                <div style={{fontSize:11,fontWeight:600,color:C.gold}}>{(l.total_credits||0)+" CR"}</div>
              </div>);
            })
          )}
        </div>

        {/* Recent Games */}
        {gameScores.length>0&&<div style={{background:C.card,borderRadius:12,padding:14,border:"1px solid "+C.border}}>
          <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:10}}>Dernieres parties</div>
          {gameScores.slice(0,5).map((g,i)=>(
            <div key={g.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",borderBottom:i<4?"1px solid "+C.border+"40":"none"}}>
              <span style={{fontSize:11,color:C.muted}}>{g.game_id.replace('g-','').toUpperCase()}</span>
              <span style={{fontSize:12,fontWeight:600,color:C.gold}}>{g.score+" pts"}</span>
              <span style={{fontSize:9,color:C.dimmed}}>{new Date(g.played_at).toLocaleDateString('fr-FR')}</span>
            </div>
          ))}
        </div>}
      </div>
    </div>
  );
}
