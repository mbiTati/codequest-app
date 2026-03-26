import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { BarChart, Users, AlertTriangle, MessageSquare, RotateCcw, Eye, ChevronDown, ChevronUp, Award, Gamepad2 } from 'lucide-react';

const C = {
  bg:"#0a0f1a",card:"#111827",accent:"#32E0C4",gold:"#F59E0B",
  text:"#e2e8f0",muted:"#94a3b8",border:"#1e293b",danger:"#EF4444",
  primary:"#0D7377",success:"#10B981",dimmed:"#64748b",secondary:"#14A3C7",
};
const TEACHER_EMAILS = ['tati.b@hotmail.fr'];
// Also check role from student profile

const LEVELS = [
  {name:"Noob Master",min:0,color:"#64748b"},
  {name:"Noob Coder",min:50,color:"#94a3b8"},
  {name:"Little Coder",min:150,color:"#14A3C7"},
  {name:"Vibe Coder",min:300,color:"#7C3AED"},
  {name:"Code Rookie",min:500,color:"#0D7377"},
  {name:"J Coder",min:750,color:"#F59E0B"},
  {name:"Code Master",min:1000,color:"#10B981"},
  {name:"Code Legend",min:1500,color:"#EF4444"},
  {name:"Lord Coder",min:2000,color:"#32E0C4"},
];

function getLevel(credits){
  let lvl = LEVELS[0];
  for(const l of LEVELS) if(credits >= l.min) lvl = l;
  return lvl;
}

function getNextLevel(credits){
  for(const l of LEVELS) if(credits < l.min) return l;
  return null;
}

export default function TeacherDashboard(){
  const [students,setStudents]=useState([]);
  const [progress,setProgress]=useState([]);
  const [modules,setModules]=useState([]);
  const [gameScores,setGameScores]=useState([]);
  const [comments,setComments]=useState([]);
  const [filterCohort,setFilterCohort]=useState('all');
  const [loading,setLoading]=useState(true);
  const [tab,setTab]=useState('overview');
  const [expandedStudent,setExpandedStudent]=useState(null);
  const [replyText,setReplyText]=useState('');

  useEffect(()=>{loadData();},[]);

  async function loadData(){
    setLoading(true);
    const [sR,pR,mR,gR,cR]=await Promise.all([
      supabase.from('cq_students').select('*').order('last_name'),
      supabase.from('cq_student_progress').select('*, cq_modules(code,title,phase,order_index)'),
      supabase.from('cq_modules').select('*').eq('unit_id',1).order('order_index'),
      supabase.from('cq_game_scores').select('*').order('played_at',{ascending:false}).limit(200),
      supabase.from('cq_comments').select('*, cq_students(first_name,last_name), cq_modules(code,title)').order('created_at',{ascending:false}).limit(50),
    ]);
    setStudents(sR.data||[]);setProgress(pR.data||[]);setModules(mR.data||[]);
    setGameScores(gR.data||[]);setComments(cR.data||[]);setLoading(false);
  }

  const filtered=filterCohort==='all'?students.filter(s=>s.role!=='teacher'):students.filter(s=>s.cohort===filterCohort&&s.role!=='teacher');
  const filteredIds=new Set(filtered.map(s=>s.id));
  const filteredProgress=progress.filter(p=>filteredIds.has(p.student_id));

  const totalStudents=filtered.length;
  const activeStudents=new Set(filteredProgress.map(p=>p.student_id)).size;
  const completedModules=filteredProgress.filter(p=>p.completed_at).length;
  const avgQuiz=filteredProgress.length>0?Math.round(filteredProgress.reduce((a,p)=>a+(p.total_questions>0?(p.quiz_score/p.total_questions)*100:0),0)/filteredProgress.length):0;
  const unreadComments=comments.filter(c=>!c.is_read).length;

  const studentStats=filtered.map(s=>{
    const sp=filteredProgress.filter(p=>p.student_id===s.id);
    const totalQ=sp.reduce((a,p)=>a+p.total_questions,0);
    const totalS=sp.reduce((a,p)=>a+p.quiz_score,0);
    const accuracy=totalQ>0?Math.round((totalS/totalQ)*100):0;
    const modulesCompleted=sp.filter(p=>p.completed_at).length;
    const totalCredits=sp.reduce((a,p)=>a+p.credits_earned,0);
    const lastActive=sp.length>0?new Date(Math.max(...sp.map(p=>new Date(p.updated_at)))).toLocaleDateString('fr-FR'):'Jamais';
    const level=getLevel(totalCredits);
    const gs=gameScores.filter(g=>g.student_id===s.id);
    return{...s,accuracy,modulesCompleted,totalCredits,totalQ,lastActive,progressData:sp,level,gameScoresData:gs};
  }).sort((a,b)=>b.totalCredits-a.totalCredits);

  const atRisk=studentStats.filter(s=>s.accuracy<40||s.modulesCompleted===0);

  const moduleStats=modules.map(m=>{
    const mp=filteredProgress.filter(p=>p.module_id===m.id);
    return{...m,started:mp.length,completed:mp.filter(p=>p.completed_at).length,
      avgScore:mp.length>0?Math.round(mp.reduce((a,p)=>a+(p.total_questions>0?(p.quiz_score/p.total_questions)*100:0),0)/mp.length):0,
      avgCredits:mp.length>0?Math.round(mp.reduce((a,p)=>a+p.credits_earned,0)/mp.length):0};
  });

  async function resetStudent(studentId){
    if(!window.confirm("Remettre a zero la progression de cet eleve ?"))return;
    await supabase.from('cq_student_progress').delete().eq('student_id',studentId);
    await supabase.from('cq_game_scores').delete().eq('student_id',studentId);
    loadData();
  }

  async function replyComment(commentId){
    if(!replyText.trim())return;
    await supabase.from('cq_comments').update({teacher_reply:replyText.trim(),replied_at:new Date().toISOString(),is_read:true}).eq('id',commentId);
    setReplyText('');loadData();
  }

  async function markRead(commentId){
    await supabase.from('cq_comments').update({is_read:true}).eq('id',commentId);
    loadData();
  }

  const tabBtn=(t,icon,label,badge)=>(<button key={t} onClick={()=>setTab(t)} style={{display:"flex",alignItems:"center",gap:5,padding:"8px 14px",borderRadius:8,border:"none",background:tab===t?C.primary:"transparent",color:tab===t?C.text:C.muted,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600,position:"relative"}}>{icon}{label}{badge>0&&<span style={{background:C.danger,color:"#fff",fontSize:9,fontWeight:700,padding:"1px 5px",borderRadius:10,marginLeft:2}}>{badge}</span>}</button>);

  if(loading)return<div style={{minHeight:"100vh",background:C.bg,color:C.muted,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',sans-serif"}}>Chargement...</div>;

  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',system-ui,sans-serif",padding:20}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div>
            <div style={{fontSize:10,letterSpacing:3,color:C.dimmed}}>ECOLE SCHULZ</div>
            <div style={{fontSize:20,fontWeight:700,color:C.accent}}>Dashboard Enseignant</div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <select value={filterCohort} onChange={e=>setFilterCohort(e.target.value)} style={{padding:"6px 12px",borderRadius:6,border:"1px solid "+C.border,background:C.card,color:C.text,fontSize:11}}>
              <option value="all">Toutes cohortes</option>
              <option value="2025">2025-2026</option>
              <option value="2026">2026-2027</option>
            </select>
            <button onClick={loadData} style={{padding:"6px 14px",borderRadius:6,border:"1px solid "+C.border,background:C.card,color:C.muted,cursor:"pointer",fontSize:11}}><RotateCcw size={12}/></button>
          </div>
        </div>

        {/* KPIs */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:16}}>
          {[
            {label:"Inscrits",value:totalStudents,icon:<Users size={16}/>,color:C.accent},
            {label:"Actifs",value:activeStudents,icon:<Award size={16}/>,color:C.primary},
            {label:"Modules OK",value:completedModules,icon:<BarChart size={16}/>,color:C.gold},
            {label:"Quiz moyen",value:avgQuiz+"%",icon:<Eye size={16}/>,color:avgQuiz>=60?C.success:C.danger},
            {label:"Messages",value:unreadComments+" non lus",icon:<MessageSquare size={16}/>,color:unreadComments>0?C.danger:C.muted},
          ].map((k,i)=>(
            <div key={i} style={{background:C.card,borderRadius:10,padding:14,border:"1px solid "+C.border}}>
              <div style={{display:"flex",alignItems:"center",gap:6,color:k.color,marginBottom:6}}>{k.icon}<span style={{fontSize:10,color:C.muted}}>{k.label}</span></div>
              <div style={{fontSize:22,fontWeight:800,color:k.color}}>{k.value}</div>
            </div>
          ))}
        </div>

        {/* Alerte eleves en difficulte */}
        {atRisk.length>0&&<div style={{background:C.danger+"10",borderRadius:10,padding:12,border:"1px solid "+C.danger+"30",marginBottom:16}}>
          <div style={{fontSize:12,fontWeight:700,color:C.danger,marginBottom:6,display:"flex",alignItems:"center",gap:4}}><AlertTriangle size={14}/>{"Eleves en difficulte ("+atRisk.length+")"}</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{atRisk.map(s=><span key={s.id} style={{padding:"3px 10px",borderRadius:6,background:C.danger+"20",fontSize:10,color:C.danger,fontWeight:600}}>{s.first_name+" "+s.last_name+" ("+s.accuracy+"%)"}</span>)}</div>
        </div>}

        {/* Tabs */}
        <div style={{display:"flex",gap:4,marginBottom:14,flexWrap:"wrap"}}>
          {tabBtn("overview",<BarChart size={14}/>,"Modules",0)}
          {tabBtn("students",<Users size={14}/>,"Eleves",0)}
          {tabBtn("comments",<MessageSquare size={14}/>,"Commentaires",unreadComments)}
          {tabBtn("games",<Gamepad2 size={14}/>,"Jeux",0)}
        </div>

        {/* TAB: Modules */}
        {tab==="overview"&&<div style={{display:"grid",gap:6}}>
          {moduleStats.map(m=>{
            const pct=totalStudents>0?Math.round((m.completed/totalStudents)*100):0;
            return(<div key={m.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:C.card,borderRadius:8,border:"1px solid "+C.border}}>
              <div style={{width:45,fontSize:11,fontWeight:700,color:C.accent}}>{m.code}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:600,color:C.text}}>{m.title}</div>
                <div style={{height:5,background:C.border,borderRadius:3,marginTop:3}}>
                  <div style={{height:"100%",width:pct+"%",background:pct>=60?C.success:pct>=30?C.gold:C.danger,borderRadius:3}}/>
                </div>
              </div>
              <div style={{textAlign:"right",minWidth:90}}>
                <div style={{fontSize:11,color:C.text}}>{m.completed+"/"+totalStudents}</div>
                <div style={{fontSize:9,color:C.muted}}>{"Quiz: "+m.avgScore+"%"}</div>
              </div>
            </div>);
          })}
        </div>}

        {/* TAB: Eleves */}
        {tab==="students"&&<div style={{display:"grid",gap:6}}>
          {studentStats.map(s=>(
            <div key={s.id} style={{background:C.card,borderRadius:10,border:"1px solid "+C.border,overflow:"hidden"}}>
              <div onClick={()=>setExpandedStudent(expandedStudent===s.id?null:s.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",cursor:"pointer"}}>
                {/* Level badge */}
                <div style={{width:36,height:36,borderRadius:"50%",background:s.level.color+"20",border:"2px solid "+s.level.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:s.level.color}}>{s.level.name.split(" ").map(w=>w[0]).join("")}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600,color:C.text}}>{s.first_name+" "+s.last_name}</div>
                  <div style={{fontSize:10,color:s.level.color,fontWeight:600}}>{s.level.name}</div>
                </div>
                <div style={{display:"flex",gap:12,alignItems:"center",fontSize:11}}>
                  <div style={{textAlign:"center"}}><div style={{color:C.accent,fontWeight:700}}>{s.modulesCompleted}</div><div style={{color:C.dimmed,fontSize:9}}>modules</div></div>
                  <div style={{textAlign:"center"}}><span style={{padding:"2px 8px",borderRadius:10,background:(s.accuracy>=60?C.success:s.accuracy>=40?C.gold:C.danger)+"20",color:s.accuracy>=60?C.success:s.accuracy>=40?C.gold:C.danger,fontWeight:600}}>{s.accuracy+"%"}</span><div style={{color:C.dimmed,fontSize:9}}>quiz</div></div>
                  <div style={{textAlign:"center"}}><div style={{color:C.gold,fontWeight:700}}>{s.totalCredits}</div><div style={{color:C.dimmed,fontSize:9}}>credits</div></div>
                  <div style={{fontSize:9,color:C.dimmed}}>{s.lastActive}</div>
                  {expandedStudent===s.id?<ChevronUp size={14} color={C.muted}/>:<ChevronDown size={14} color={C.muted}/>}
                </div>
              </div>

              {/* Expanded detail */}
              {expandedStudent===s.id&&<div style={{padding:"0 14px 14px",borderTop:"1px solid "+C.border}}>
                {/* Module progress grid */}
                <div style={{display:"flex",flexWrap:"wrap",gap:4,margin:"10px 0"}}>
                  {modules.map(m=>{
                    const sp=s.progressData.find(p=>p.module_id===m.id);
                    const done=sp?.completed_at;
                    const started=!!sp;
                    return(<div key={m.id} title={m.title+(sp?" - Quiz: "+sp.quiz_score+"/"+sp.total_questions:"")} style={{width:40,height:28,borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700,background:done?C.success+"20":started?C.gold+"20":C.border+"40",color:done?C.success:started?C.gold:C.dimmed,border:"1px solid "+(done?C.success:started?C.gold:C.border)+"40"}}>{m.code.replace("M","")}</div>);
                  })}
                </div>

                {/* Game scores */}
                {s.gameScoresData.length>0&&<div style={{fontSize:10,color:C.muted,marginBottom:8}}>
                  {"Jeux : "+s.gameScoresData.length+" parties | Meilleur : "+Math.max(...s.gameScoresData.map(g=>g.score))+" pts"}
                </div>}

                {/* Actions */}
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>resetStudent(s.id)} style={{display:"flex",alignItems:"center",gap:4,padding:"5px 12px",borderRadius:6,border:"1px solid "+C.danger+"40",background:C.danger+"10",color:C.danger,cursor:"pointer",fontFamily:"inherit",fontSize:10,fontWeight:600}}><RotateCcw size={11}/>Reset progression</button>
                </div>
              </div>}
            </div>
          ))}
        </div>}

        {/* TAB: Commentaires */}
        {tab==="comments"&&<div style={{display:"grid",gap:8}}>
          {comments.length===0&&<div style={{textAlign:"center",padding:40,color:C.dimmed}}>Aucun commentaire pour l'instant</div>}
          {comments.map(c=>(
            <div key={c.id} style={{background:C.card,borderRadius:10,padding:14,border:"1px solid "+(c.is_read?C.border:C.gold+"40")}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <div>
                  <span style={{fontSize:12,fontWeight:600,color:C.text}}>{c.cq_students?.first_name+" "+c.cq_students?.last_name}</span>
                  {c.cq_modules&&<span style={{marginLeft:6,fontSize:10,color:C.accent,padding:"1px 6px",borderRadius:4,background:C.accent+"10"}}>{c.cq_modules.code}</span>}
                </div>
                <div style={{fontSize:9,color:C.dimmed}}>{new Date(c.created_at).toLocaleString('fr-FR')}</div>
              </div>
              <div style={{fontSize:12,color:C.text,lineHeight:1.6,marginBottom:8,padding:"8px 10px",background:C.bg,borderRadius:6}}>{c.message}</div>

              {c.teacher_reply&&<div style={{fontSize:11,color:C.success,padding:"6px 10px",background:C.success+"10",borderRadius:6,marginBottom:6}}>
                <span style={{fontWeight:600}}>Votre reponse : </span>{c.teacher_reply}
              </div>}

              <div style={{display:"flex",gap:6}}>
                {!c.is_read&&<button onClick={()=>markRead(c.id)} style={{padding:"4px 10px",borderRadius:5,border:"1px solid "+C.border,background:"transparent",color:C.muted,cursor:"pointer",fontSize:10}}>Marquer lu</button>}
                {!c.teacher_reply&&<div style={{display:"flex",gap:4,flex:1}}>
                  <input value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder="Repondre..." style={{flex:1,padding:"5px 10px",borderRadius:5,border:"1px solid "+C.border,background:C.bg,color:C.text,fontSize:11,fontFamily:"inherit"}}/>
                  <button onClick={()=>replyComment(c.id)} style={{padding:"4px 12px",borderRadius:5,border:"none",background:C.success,color:C.bg,cursor:"pointer",fontSize:10,fontWeight:600}}>Envoyer</button>
                </div>}
              </div>
            </div>
          ))}
        </div>}

        {/* TAB: Jeux */}
        {tab==="games"&&<div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:10}}>
            {['g-snakejava','g-tetris','g-memory','g-tower','g-bottle','g-maze','g-bubble','g-snake','g-factory'].map(gid=>{
              const gs=gameScores.filter(g=>g.game_id===gid);
              const avg=gs.length>0?Math.round(gs.reduce((a,g)=>a+g.score,0)/gs.length):0;
              const best=gs.length>0?Math.max(...gs.map(g=>g.score)):0;
              const players=new Set(gs.map(g=>g.student_id)).size;
              return(<div key={gid} style={{background:C.card,borderRadius:10,padding:12,border:"1px solid "+C.border}}>
                <div style={{fontSize:12,fontWeight:700,color:C.gold}}>{gid.replace('g-','').toUpperCase()}</div>
                <div style={{fontSize:10,color:C.muted,marginTop:4}}>{gs.length+" parties | "+players+" joueurs"}</div>
                <div style={{fontSize:10,color:C.text,marginTop:2}}>{"Moy: "+avg+" | Best: "+best}</div>
              </div>);
            })}
          </div>
        </div>}
      </div>
    </div>
  );
}

export { TEACHER_EMAILS, LEVELS, getLevel, getNextLevel };
