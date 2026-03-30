import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { BarChart, Users, AlertTriangle, MessageSquare, RotateCcw, ChevronDown, ChevronUp, Award, Gamepad2, UserPlus, Trash2, Upload, Download, FolderOpen, Zap, ExternalLink, Check, X } from 'lucide-react';

const C={bg:"#0a0f1a",card:"#111827",accent:"#32E0C4",gold:"#F59E0B",text:"#e2e8f0",muted:"#94a3b8",border:"#1e293b",danger:"#EF4444",primary:"#0D7377",success:"#10B981",dimmed:"#64748b",secondary:"#14A3C7"};
const TEACHER_EMAILS=['tati.b@hotmail.fr'];
const LEVELS=[{name:"Noob Master",min:0,color:"#64748b"},{name:"Noob Coder",min:50,color:"#94a3b8"},{name:"Little Coder",min:150,color:"#14A3C7"},{name:"Vibe Coder",min:300,color:"#7C3AED"},{name:"Code Rookie",min:500,color:"#0D7377"},{name:"J Coder",min:750,color:"#F59E0B"},{name:"Code Master",min:1000,color:"#10B981"},{name:"Code Legend",min:1500,color:"#EF4444"},{name:"Lord Coder",min:2000,color:"#32E0C4"}];
function getLevel(cr){let l=LEVELS[0];for(const lv of LEVELS)if(cr>=lv.min)l=lv;return l;}

const BUCKET='cours-documents';

export default function TeacherDashboard(){
  const[students,setStudents]=useState([]);const[progress,setProgress]=useState([]);const[modules,setModules]=useState([]);
  const[gameScores,setGameScores]=useState([]);const[comments,setComments]=useState([]);const[classes,setClasses]=useState([]);
  const[filterCohort,setFilterCohort]=useState('all');const[filterClass,setFilterClass]=useState('all');
  const[loading,setLoading]=useState(true);const[tab,setTab]=useState('progression');
  const[expandedStudent,setExpandedStudent]=useState(null);const[replyText,setReplyText]=useState('');
  // Manage tab
  const[newClassName,setNewClassName]=useState('');const[newClassDesc,setNewClassDesc]=useState('');const[newClassCohort,setNewClassCohort]=useState('2025');
  const[newFirst,setNewFirst]=useState('');const[newLast,setNewLast]=useState('');const[newEmail,setNewEmail]=useState('');
  const[newStudClass,setNewStudClass]=useState('');const[newStudCohort,setNewStudCohort]=useState('2025');
  const[manageMsg,setManageMsg]=useState(null);
  // Documents tab
  const[uploadedFiles,setUploadedFiles]=useState([]);const[uploading,setUploading]=useState(false);

  useEffect(()=>{loadData();},[]);

  async function loadData(){
    setLoading(true);
    const[sR,pR,mR,gR,cR,clR]=await Promise.all([
      supabase.from('cq_students').select('*').order('last_name'),
      supabase.from('cq_student_progress').select('*,cq_modules(code,title,phase,order_index)'),
      supabase.from('cq_modules').select('*').eq('unit_id',1).order('order_index'),
      supabase.from('cq_game_scores').select('*').order('played_at',{ascending:false}).limit(200),
      supabase.from('cq_comments').select('*,cq_students(first_name,last_name),cq_modules(code,title)').order('created_at',{ascending:false}).limit(50),
      supabase.from('cq_classes').select('*').order('name'),
    ]);
    setStudents(sR.data||[]);setProgress(pR.data||[]);setModules(mR.data||[]);
    setGameScores(gR.data||[]);setComments(cR.data||[]);setClasses(clR.data||[]);
    loadFiles();
    setLoading(false);
  }

  async function loadFiles(){
    try{const{data}=await supabase.storage.from(BUCKET).list('unit1',{limit:50,sortBy:{column:'created_at',order:'desc'}});setUploadedFiles(data||[]);}catch(e){setUploadedFiles([]);}
  }

  const allStudents=students.filter(s=>s.role!=='teacher');
  const filtered=allStudents.filter(s=>(filterCohort==='all'||s.cohort===filterCohort)&&(filterClass==='all'||s.class_name===filterClass));
  const classNames=[...new Set(allStudents.map(s=>s.class_name).filter(Boolean))];
  const filteredIds=new Set(filtered.map(s=>s.id));
  const filteredProgress=progress.filter(p=>filteredIds.has(p.student_id));

  const totalStudents=filtered.length;
  const activeStudents=new Set(filteredProgress.map(p=>p.student_id)).size;
  const completedModules=filteredProgress.filter(p=>p.completed_at).length;
  const avgQuiz=filteredProgress.length>0?Math.round(filteredProgress.reduce((a,p)=>a+(p.total_questions>0?(p.quiz_score/p.total_questions)*100:0),0)/filteredProgress.length):0;
  const unreadComments=comments.filter(c=>!c.is_read).length;

  const studentStats=filtered.map(s=>{
    const sp=filteredProgress.filter(p=>p.student_id===s.id);
    const totalQ=sp.reduce((a,p)=>a+p.total_questions,0);const totalS=sp.reduce((a,p)=>a+p.quiz_score,0);
    const accuracy=totalQ>0?Math.round((totalS/totalQ)*100):0;
    const modulesCompleted=sp.filter(p=>p.completed_at).length;
    const totalCredits=sp.reduce((a,p)=>a+p.credits_earned,0);
    const lastActive=sp.length>0?new Date(Math.max(...sp.map(p=>new Date(p.updated_at)))).toLocaleDateString('fr-FR'):'Jamais';
    return{...s,accuracy,modulesCompleted,totalCredits,totalQ,lastActive,progressData:sp,level:getLevel(totalCredits),gameScoresData:gameScores.filter(g=>g.student_id===s.id)};
  }).sort((a,b)=>b.totalCredits-a.totalCredits);

  const atRisk=studentStats.filter(s=>s.accuracy<40||s.modulesCompleted===0);

  const moduleStats=modules.map(m=>{
    const mp=filteredProgress.filter(p=>p.module_id===m.id);
    return{...m,started:mp.length,completed:mp.filter(p=>p.completed_at).length,
      avgScore:mp.length>0?Math.round(mp.reduce((a,p)=>a+(p.total_questions>0?(p.quiz_score/p.total_questions)*100:0),0)/mp.length):0};
  });

  // === ACTIONS ===
  async function resetStudent(sid){if(!window.confirm("Remettre a zero ?"))return;await supabase.from('cq_student_progress').delete().eq('student_id',sid);await supabase.from('cq_game_scores').delete().eq('student_id',sid);loadData();}

  async function replyComment(cid){if(!replyText.trim())return;await supabase.from('cq_comments').update({teacher_reply:replyText.trim(),replied_at:new Date().toISOString(),is_read:true}).eq('id',cid);setReplyText('');loadData();}
  async function markRead(cid){await supabase.from('cq_comments').update({is_read:true}).eq('id',cid);loadData();}

  async function createClass(){
    if(!newClassName.trim()){setManageMsg({t:'error',m:'Nom requis'});return;}
    await supabase.from('cq_classes').insert({name:newClassName.trim(),description:newClassDesc.trim()||null,cohort:newClassCohort});
    setNewClassName('');setNewClassDesc('');setManageMsg({t:'ok',m:'Classe creee !'});loadData();
  }
  async function deleteClass(id){if(!window.confirm("Supprimer cette classe ?"))return;await supabase.from('cq_classes').delete().eq('id',id);loadData();}

  async function addStudent(){
    if(!newFirst.trim()||!newLast.trim()||!newEmail.trim()){setManageMsg({t:'error',m:'Tous les champs sont requis'});return;}
    // Create auth account
    const{data:authData,error:authErr}=await supabase.auth.admin?.createUser?.({email:newEmail.trim().toLowerCase(),password:'Schulz2025!',email_confirm:true});
    // If admin API not available, try signUp
    let authId=authData?.user?.id;
    if(!authId){
      // Fallback: just create the profile, auth will be linked on first login
      authId=null;
    }
    const{error}=await supabase.from('cq_students').insert({
      auth_id:authId,email:newEmail.trim().toLowerCase(),first_name:newFirst.trim(),last_name:newLast.trim().toUpperCase(),
      role:'student',class_name:newStudClass||'BI1',cohort:newStudCohort,class_year:newStudCohort+'-'+(parseInt(newStudCohort)+1),
    });
    if(error){setManageMsg({t:'error',m:error.message});return;}
    setNewFirst('');setNewLast('');setNewEmail('');setManageMsg({t:'ok',m:'Eleve ajoute ! MDP: Schulz2025!'});loadData();
  }
  async function deleteStudent(sid){if(!window.confirm("Supprimer cet eleve ? (irreversible)"))return;await supabase.from('cq_student_progress').delete().eq('student_id',sid);await supabase.from('cq_game_scores').delete().eq('student_id',sid);await supabase.from('cq_comments').delete().eq('student_id',sid);await supabase.from('cq_students').delete().eq('id',sid);loadData();}

  async function handleUpload(e){
    const files=e.target.files;if(!files||!files.length)return;setUploading(true);
    for(const f of files){await supabase.storage.from(BUCKET).upload('unit1/'+Date.now()+'_'+f.name.replace(/\s+/g,'_'),f);}
    setUploading(false);loadFiles();
  }
  async function deleteFile(name){if(!window.confirm("Supprimer ?"))return;await supabase.storage.from(BUCKET).remove(['unit1/'+name]);loadFiles();}
  function fileUrl(name){return supabase.storage.from(BUCKET).getPublicUrl('unit1/'+name).data?.publicUrl||'#';}

  const tabBtn=(t,icon,label,badge)=>(<button key={t} onClick={()=>setTab(t)} style={{display:"flex",alignItems:"center",gap:5,padding:"8px 14px",borderRadius:8,border:"none",background:tab===t?C.primary:"transparent",color:tab===t?C.text:C.muted,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600,position:"relative"}}>{icon}{label}{badge>0&&<span style={{background:C.danger,color:"#fff",fontSize:9,fontWeight:700,padding:"1px 5px",borderRadius:10,marginLeft:2}}>{badge}</span>}</button>);
  const inp={padding:"8px 12px",borderRadius:6,border:"1px solid "+C.border,background:C.bg,color:C.text,fontFamily:"inherit",fontSize:12};

  if(loading)return<div style={{minHeight:"100vh",background:C.bg,color:C.muted,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',sans-serif"}}>Chargement...</div>;

  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',system-ui,sans-serif",padding:20}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div><div style={{fontSize:10,letterSpacing:3,color:C.dimmed}}>ECOLE SCHULZ</div><div style={{fontSize:18,fontWeight:700,color:C.accent}}>Dashboard Enseignant</div></div>
          <div style={{display:"flex",gap:6}}>
            <select value={filterClass} onChange={e=>setFilterClass(e.target.value)} style={{...inp,fontSize:11}}><option value="all">Toutes classes</option>{classNames.map(c=><option key={c} value={c}>{c}</option>)}</select>
            <select value={filterCohort} onChange={e=>setFilterCohort(e.target.value)} style={{...inp,fontSize:11}}><option value="all">Toutes annees</option><option value="2025">2025</option><option value="2026">2026</option></select>
            <button onClick={loadData} style={{padding:"6px 10px",borderRadius:6,border:"1px solid "+C.border,background:C.card,color:C.muted,cursor:"pointer"}}><RotateCcw size={12}/></button>
          </div>
        </div>

        {/* KPIs */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:12}}>
          {[{l:"ELEVES",v:totalStudents,c:C.accent},{l:"PROGRESSION MOY.",v:Math.round((completedModules/(totalStudents*16||1))*100)+"%",c:C.primary},{l:"QUIZ MOYEN",v:avgQuiz?avgQuiz+"%":"-",c:avgQuiz>=60?C.success:C.danger},{l:"QUESTIONS",v:unreadComments,c:unreadComments>0?C.gold:C.muted},{l:"EN DIFFICULTE",v:atRisk.length,c:atRisk.length>0?C.danger:C.success}].map((k,i)=>(
            <div key={i} style={{background:C.card,borderRadius:10,padding:12,border:"1px solid "+C.border,textAlign:"center"}}><div style={{fontSize:24,fontWeight:800,color:k.c}}>{k.v}</div><div style={{fontSize:9,color:C.muted,marginTop:2}}>{k.l}</div></div>
          ))}
        </div>

        {/* Tabs — aligned with U4 */}
        <div style={{display:"flex",gap:4,marginBottom:12,flexWrap:"wrap",borderBottom:"1px solid "+C.border,paddingBottom:8}}>
          {tabBtn("progression",<BarChart size={13}/>,"Progression",0)}
          {tabBtn("questions",<MessageSquare size={13}/>,"Questions",unreadComments)}
          {tabBtn("manage",<UserPlus size={13}/>,"Gerer les eleves",0)}
          {tabBtn("documents",<FolderOpen size={13}/>,"Mes Documents",0)}
          {tabBtn("tools",<Gamepad2 size={13}/>,"Outils & Jeux",0)}
        </div>

        {/* ======================== TAB: PROGRESSION ======================== */}
        {tab==="progression"&&<div>
          {/* Alert */}
          {atRisk.length>0&&<div style={{background:C.danger+"10",borderRadius:8,padding:10,border:"1px solid "+C.danger+"30",marginBottom:10}}>
            <div style={{fontSize:11,fontWeight:700,color:C.danger,marginBottom:4,display:"flex",alignItems:"center",gap:4}}><AlertTriangle size={12}/>{"Eleves en difficulte ("+atRisk.length+")"}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:4}}>{atRisk.map(s=><span key={s.id} style={{padding:"2px 8px",borderRadius:4,background:C.danger+"20",fontSize:9,color:C.danger,fontWeight:600}}>{s.first_name+" "+s.last_name+" ("+s.accuracy+"%)"}</span>)}</div>
          </div>}
          {/* Table */}
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead><tr style={{borderBottom:"2px solid "+C.border}}>
                {["ELEVE","CLASSE","NIVEAU","XP","MODULES","PROGRESSION","QUIZ","ACTIONS"].map(h=><th key={h} style={{padding:"8px 10px",textAlign:"left",color:C.accent,fontWeight:700,fontSize:10}}>{h}</th>)}
              </tr></thead>
              <tbody>{studentStats.map(s=>(
                <tr key={s.id} style={{borderBottom:"1px solid "+C.border+"60"}}>
                  <td style={{padding:"8px 10px",fontWeight:600}}>{s.first_name+" "+s.last_name}</td>
                  <td style={{padding:"8px 10px",color:C.muted}}>{s.class_name+" - "+s.cohort}</td>
                  <td style={{padding:"8px 10px",color:s.level.color,fontSize:10}}>{s.level.name}</td>
                  <td style={{padding:"8px 10px",color:C.gold,fontWeight:700}}>{s.totalCredits}</td>
                  <td style={{padding:"8px 10px"}}>{s.modulesCompleted+"/"+modules.length}</td>
                  <td style={{padding:"8px 10px"}}><div style={{width:80,height:4,background:C.border,borderRadius:2}}><div style={{height:"100%",width:Math.round((s.modulesCompleted/Math.max(modules.length,1))*100)+"%",background:s.modulesCompleted>0?C.success:C.border,borderRadius:2}}/></div><span style={{fontSize:9,color:C.dimmed}}>{Math.round((s.modulesCompleted/Math.max(modules.length,1))*100)+"%"}</span></td>
                  <td style={{padding:"8px 10px"}}>{s.totalQ>0?<span style={{padding:"2px 6px",borderRadius:4,background:(s.accuracy>=60?C.success:s.accuracy>=40?C.gold:C.danger)+"20",color:s.accuracy>=60?C.success:s.accuracy>=40?C.gold:C.danger,fontSize:10,fontWeight:600}}>{s.accuracy+"%"}</span>:"-"}</td>
                  <td style={{padding:"8px 10px"}}><button onClick={()=>resetStudent(s.id)} style={{padding:"3px 10px",borderRadius:4,border:"none",background:C.danger,color:"#fff",cursor:"pointer",fontSize:9,fontWeight:600}}>Reset</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>}

        {/* ======================== TAB: QUESTIONS ======================== */}
        {tab==="questions"&&<div style={{display:"grid",gap:6}}>
          {comments.length===0&&<div style={{textAlign:"center",padding:30,color:C.dimmed}}>Aucun message</div>}
          {comments.map(c=>(
            <div key={c.id} style={{background:C.card,borderRadius:8,padding:12,border:"1px solid "+(c.is_read?C.border:C.gold+"40")}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <div><span style={{fontSize:11,fontWeight:600}}>{c.cq_students?.first_name+" "+c.cq_students?.last_name}</span>{c.cq_modules&&<span style={{marginLeft:6,fontSize:9,color:C.accent,padding:"1px 5px",borderRadius:3,background:C.accent+"10"}}>{c.cq_modules.code}</span>}</div>
                <span style={{fontSize:9,color:C.dimmed}}>{new Date(c.created_at).toLocaleString('fr-FR')}</span>
              </div>
              <div style={{fontSize:11,padding:"6px 8px",background:C.bg,borderRadius:4,marginBottom:6}}>{c.message}</div>
              {c.teacher_reply&&<div style={{fontSize:10,color:C.success,padding:"4px 8px",background:C.success+"10",borderRadius:4,marginBottom:4}}>Reponse : {c.teacher_reply}</div>}
              <div style={{display:"flex",gap:4}}>
                {!c.is_read&&<button onClick={()=>markRead(c.id)} style={{padding:"3px 8px",borderRadius:4,border:"1px solid "+C.border,background:"transparent",color:C.muted,cursor:"pointer",fontSize:9}}>Marquer lu</button>}
                {!c.teacher_reply&&<><input value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder="Repondre..." style={{flex:1,...inp,fontSize:10}}/><button onClick={()=>replyComment(c.id)} style={{padding:"3px 10px",borderRadius:4,border:"none",background:C.success,color:"#fff",cursor:"pointer",fontSize:9}}>Envoyer</button></>}
              </div>
            </div>
          ))}
        </div>}

        {/* ======================== TAB: GERER LES ELEVES ======================== */}
        {tab==="manage"&&<div>
          {/* Gestion des classes */}
          <div style={{background:C.card,borderRadius:10,padding:14,border:"1px solid "+C.border,marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:700,color:C.accent,marginBottom:10}}>Gestion des classes</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
              {classes.map(cl=>(
                <span key={cl.id} style={{padding:"4px 10px",borderRadius:6,background:C.primary+"20",border:"1px solid "+C.primary+"40",fontSize:11,color:C.accent,display:"flex",alignItems:"center",gap:4}}>
                  <strong>{cl.name}</strong>{cl.description&&<span style={{color:C.muted,fontSize:9}}>{cl.description}</span>}<span style={{color:C.dimmed,fontSize:9}}>{"· "+cl.cohort}</span>
                  {cl.name!=='PROF'&&<button onClick={()=>deleteClass(cl.id)} style={{background:"none",border:"none",color:C.danger,cursor:"pointer",padding:0,marginLeft:2}}><X size={10}/></button>}
                </span>
              ))}
            </div>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              <input value={newClassName} onChange={e=>setNewClassName(e.target.value)} placeholder="Nom (ex: BI2)" style={{...inp,width:120}}/>
              <input value={newClassDesc} onChange={e=>setNewClassDesc(e.target.value)} placeholder="Description" style={{...inp,flex:1}}/>
              <select value={newClassCohort} onChange={e=>setNewClassCohort(e.target.value)} style={{...inp}}><option value="2025">2025</option><option value="2026">2026</option><option value="2027">2027</option></select>
              <button onClick={createClass} style={{padding:"8px 16px",borderRadius:6,border:"none",background:C.accent,color:C.bg,cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>Creer la classe</button>
            </div>
          </div>

          {/* Ajouter un eleve */}
          <div style={{background:C.card,borderRadius:10,padding:14,border:"1px solid "+C.border,marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:700,color:C.accent,marginBottom:4}}>Ajouter un eleve</div>
            <div style={{fontSize:10,color:C.muted,marginBottom:10}}>Mot de passe par defaut : <strong>Schulz2025!</strong></div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
              <input value={newFirst} onChange={e=>setNewFirst(e.target.value)} placeholder="Prenom" style={{...inp,width:140}}/>
              <input value={newLast} onChange={e=>setNewLast(e.target.value)} placeholder="Nom" style={{...inp,width:140}}/>
              <input value={newEmail} onChange={e=>setNewEmail(e.target.value)} placeholder="Email" style={{...inp,flex:1}}/>
              <select value={newStudClass} onChange={e=>setNewStudClass(e.target.value)} style={{...inp}}>
                <option value="">— Classe —</option>{classes.filter(c=>c.name!=='PROF').map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
              <select value={newStudCohort} onChange={e=>setNewStudCohort(e.target.value)} style={{...inp}}><option value="2025">2025</option><option value="2026">2026</option></select>
              <button onClick={addStudent} style={{padding:"8px 16px",borderRadius:6,border:"none",background:C.accent,color:C.bg,cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:700}}>Ajouter</button>
            </div>
            {manageMsg&&<div style={{marginTop:6,fontSize:11,color:manageMsg.t==='ok'?C.success:C.danger}}>{manageMsg.m}</div>}
          </div>

          {/* Liste des eleves */}
          <div style={{background:C.card,borderRadius:10,padding:14,border:"1px solid "+C.border}}>
            <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:10}}>{"Tous les eleves ("+allStudents.length+")"}</div>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead><tr style={{borderBottom:"2px solid "+C.border}}>
                {["NOM","EMAIL","CLASSE","COHORTE","AUTH","ACTIONS"].map(h=><th key={h} style={{padding:"6px 8px",textAlign:"left",color:C.accent,fontWeight:700,fontSize:10}}>{h}</th>)}
              </tr></thead>
              <tbody>{allStudents.map(s=>(
                <tr key={s.id} style={{borderBottom:"1px solid "+C.border+"40"}}>
                  <td style={{padding:"6px 8px",fontWeight:600}}>{s.first_name+" "+s.last_name}</td>
                  <td style={{padding:"6px 8px",color:C.muted}}>{s.email}</td>
                  <td style={{padding:"6px 8px"}}>{s.class_name}</td>
                  <td style={{padding:"6px 8px"}}>{s.cohort}</td>
                  <td style={{padding:"6px 8px",color:s.auth_id?C.success:C.danger}}>{s.auth_id?"Lie":"Non"}</td>
                  <td style={{padding:"6px 8px",display:"flex",gap:4}}>
                    <button onClick={()=>resetStudent(s.id)} style={{padding:"2px 8px",borderRadius:3,border:"none",background:C.gold,color:C.bg,cursor:"pointer",fontSize:9,fontWeight:600}}>Reset</button>
                    <button onClick={()=>deleteStudent(s.id)} style={{padding:"2px 8px",borderRadius:3,border:"none",background:C.danger,color:"#fff",cursor:"pointer",fontSize:9,fontWeight:600}}>Suppr</button>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>}

        {/* ======================== TAB: MES DOCUMENTS ======================== */}
        {tab==="documents"&&<div>
          <div style={{background:C.card,borderRadius:10,padding:14,border:"1px solid "+C.border,marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:700,color:C.gold,marginBottom:8,display:"flex",alignItems:"center",gap:6}}><Upload size={14}/>Televerser des documents</div>
            <label style={{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:6,background:C.gold+"15",border:"1px solid "+C.gold+"40",color:C.gold,cursor:"pointer",fontSize:11,fontWeight:600}}>
              <Upload size={12}/>{uploading?"Envoi...":"Choisir des fichiers"}
              <input type="file" multiple onChange={handleUpload} style={{display:"none"}} accept=".pdf,.docx,.doc,.pptx,.ppt,.java,.zip,.txt,.md,.xlsx"/>
            </label>
            <span style={{marginLeft:8,fontSize:9,color:C.dimmed}}>PDF, DOCX, PPTX, Java, ZIP, Excel</span>
          </div>
          {uploadedFiles.length>0&&<div style={{display:"grid",gap:4}}>
            {uploadedFiles.map((f,i)=>{const dn=f.name.replace(/^\d+_/,'');return(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:6,background:C.card,border:"1px solid "+C.border}}>
                <span style={{fontSize:16}}>{dn.endsWith('.pdf')?'📄':dn.endsWith('.docx')||dn.endsWith('.doc')?'📝':dn.endsWith('.pptx')?'📊':dn.endsWith('.java')?'☕':'📎'}</span>
                <span style={{flex:1,fontSize:11,color:C.text}}>{dn}</span>
                <a href={fileUrl(f.name)} download style={{padding:"3px 8px",borderRadius:4,background:C.accent+"10",color:C.accent,fontSize:9,textDecoration:"none"}}><Download size={10}/></a>
                <button onClick={()=>deleteFile(f.name)} style={{padding:"3px 6px",borderRadius:4,border:"none",background:C.danger+"20",color:C.danger,cursor:"pointer"}}><Trash2 size={10}/></button>
              </div>
            );})}
          </div>}
          {uploadedFiles.length===0&&<div style={{textAlign:"center",padding:20,color:C.dimmed}}>Aucun document. Utilisez le bouton ci-dessus pour televerser.</div>}
        </div>}

        {/* ======================== TAB: OUTILS & JEUX ======================== */}
        {tab==="tools"&&<div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:8,marginBottom:14}}>
            <div style={{background:C.card,borderRadius:10,padding:14,border:"1px solid "+C.danger+"30",cursor:"pointer"}} onClick={()=>window.open('/','_self')}>
              <div style={{fontSize:12,fontWeight:700,color:C.danger,display:"flex",alignItems:"center",gap:4}}><Zap size={14}/>Quiz Live Kahoot</div>
              <div style={{fontSize:10,color:C.muted,marginTop:2}}>Cliquez "Quiz Live" dans la barre du haut</div>
            </div>
            <a href="https://onecompiler.com/java" target="_blank" rel="noopener noreferrer" style={{background:C.card,borderRadius:10,padding:14,border:"1px solid "+C.primary+"30",textDecoration:"none"}}>
              <div style={{fontSize:12,fontWeight:700,color:C.primary,display:"flex",alignItems:"center",gap:4}}><ExternalLink size={14}/>OneCompiler Java</div>
              <div style={{fontSize:10,color:C.muted,marginTop:2}}>Editeur Java en ligne</div>
            </a>
          </div>
          {/* Game stats */}
          <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:8}}>Statistiques des jeux</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:6}}>
            {['CodeQuest Studio','Code Racer','Code Runner','Debugging Race','Block Animations','Stack & Queue','Event Catcher','Code Cleaner','Style Police','Quiz Live'].map(name=>{
              const gs=gameScores.filter(g=>g.game_id&&g.game_id.toLowerCase().includes(name.split(' ')[0].toLowerCase()));
              return(<div key={name} style={{background:C.card,borderRadius:8,padding:10,border:"1px solid "+C.border}}>
                <div style={{fontSize:11,fontWeight:700,color:C.gold}}>{name}</div>
                <div style={{fontSize:9,color:C.muted}}>{gs.length+" parties"}</div>
              </div>);
            })}
          </div>
        </div>}
      </div>
    </div>
  );
}

export { TEACHER_EMAILS, LEVELS, getLevel };
