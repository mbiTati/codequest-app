import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthProvider';
import { Settings, Eye, EyeOff, Save, Shield, Users } from 'lucide-react';

const C = {bg:"#0a0f1a",card:"#111827",accent:"#32E0C4",gold:"#F59E0B",text:"#e2e8f0",muted:"#94a3b8",border:"#1e293b",danger:"#EF4444",primary:"#0D7377",success:"#10B981",dimmed:"#64748b"};

export default function SettingsPage(){
  const {user,student}=useAuth();
  const [newPwd,setNewPwd]=useState('');
  const [confirmPwd,setConfirmPwd]=useState('');
  const [showPwd,setShowPwd]=useState(false);
  const [showConfirm,setShowConfirm]=useState(false);
  const [pwdMsg,setPwdMsg]=useState(null);
  const [pwdLoading,setPwdLoading]=useState(false);
  const [scoresPublic,setScoresPublic]=useState(false);
  const [visMsg,setVisMsg]=useState(null);

  useEffect(()=>{
    if(!student)return;
    supabase.from('cq_student_settings').select('scores_public').eq('student_id',student.id).single()
      .then(({data})=>{if(data)setScoresPublic(data.scores_public);}).catch(()=>{});
  },[student]);

  async function changePwd(){
    if(newPwd.length<6){setPwdMsg({t:'e',m:'Minimum 6 caracteres'});return;}
    if(newPwd!==confirmPwd){setPwdMsg({t:'e',m:'Les mots de passe ne correspondent pas'});return;}
    setPwdLoading(true);setPwdMsg(null);
    const{error}=await supabase.auth.updateUser({password:newPwd});
    if(error)setPwdMsg({t:'e',m:error.message});
    else{setPwdMsg({t:'s',m:'Mot de passe change !'});setNewPwd('');setConfirmPwd('');}
    setPwdLoading(false);
  }

  async function saveVis(){
    if(!student)return;
    try{
      await supabase.from('cq_student_settings').upsert({student_id:student.id,scores_public:scoresPublic},{onConflict:'student_id'});
      setVisMsg({t:'s',m:'Sauvegarde !'});setTimeout(()=>setVisMsg(null),3000);
    }catch(e){setVisMsg({t:'e',m:'Erreur'});}
  }

  const inp={width:"100%",padding:"10px 14px",borderRadius:8,border:"1px solid "+C.border,background:C.bg,color:C.text,fontFamily:"inherit",fontSize:13,outline:"none",boxSizing:"border-box"};
  const eyeBtn={position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:C.muted,padding:4};

  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',system-ui,sans-serif",padding:20}}>
      <div style={{maxWidth:500,margin:"0 auto"}}>
        <div style={{fontSize:20,fontWeight:700,color:C.accent,marginBottom:20,display:"flex",alignItems:"center",gap:8}}><Settings size={20}/>Parametres</div>

        {/* Profile */}
        <div style={{background:C.card,borderRadius:12,padding:16,border:"1px solid "+C.border,marginBottom:16}}>
          <div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:10}}>Mon compte</div>
          <div style={{fontSize:12,color:C.muted,marginBottom:4}}><span style={{color:C.dimmed}}>Email : </span>{user?.email}</div>
          {student&&<><div style={{fontSize:12,color:C.muted,marginBottom:4}}><span style={{color:C.dimmed}}>Nom : </span>{student.first_name+" "+student.last_name}</div>
          <div style={{fontSize:12,color:C.muted}}><span style={{color:C.dimmed}}>Cohorte : </span>{student.cohort}</div></>}
        </div>

        {/* Password */}
        <div style={{background:C.card,borderRadius:12,padding:16,border:"1px solid "+C.border,marginBottom:16}}>
          <div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:12,display:"flex",alignItems:"center",gap:6}}><Shield size={14} color={C.gold}/>Changer le mot de passe</div>
          <div style={{marginBottom:10,position:"relative"}}>
            <input type={showPwd?"text":"password"} value={newPwd} onChange={e=>setNewPwd(e.target.value)} placeholder="Nouveau mot de passe" style={inp}/>
            <button onClick={()=>setShowPwd(!showPwd)} style={eyeBtn}>{showPwd?<EyeOff size={16}/>:<Eye size={16}/>}</button>
          </div>
          <div style={{marginBottom:12,position:"relative"}}>
            <input type={showConfirm?"text":"password"} value={confirmPwd} onChange={e=>setConfirmPwd(e.target.value)} placeholder="Confirmer" style={inp}/>
            <button onClick={()=>setShowConfirm(!showConfirm)} style={eyeBtn}>{showConfirm?<EyeOff size={16}/>:<Eye size={16}/>}</button>
          </div>
          {pwdMsg&&<div style={{padding:"8px 12px",borderRadius:8,marginBottom:10,fontSize:11,background:(pwdMsg.t==='e'?C.danger:C.success)+"15",color:pwdMsg.t==='e'?C.danger:C.success}}>{pwdMsg.m}</div>}
          <button onClick={changePwd} disabled={pwdLoading} style={{width:"100%",padding:"10px",borderRadius:8,border:"none",background:pwdLoading?C.border:C.gold,color:C.bg,cursor:pwdLoading?"default":"pointer",fontFamily:"inherit",fontSize:13,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><Save size={14}/>{pwdLoading?"...":"Changer le mot de passe"}</button>
        </div>

        {/* Visibility toggle */}
        <div style={{background:C.card,borderRadius:12,padding:16,border:"1px solid "+C.border}}>
          <div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:12,display:"flex",alignItems:"center",gap:6}}><Users size={14} color={C.accent}/>Visibilite des scores</div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <div>
              <div style={{fontSize:12,color:C.text}}>Apparaitre dans le classement</div>
              <div style={{fontSize:10,color:C.dimmed}}>Les autres eleves verront votre nom et vos credits</div>
            </div>
            <button onClick={()=>{setScoresPublic(!scoresPublic);}} style={{width:48,height:26,borderRadius:13,border:"none",cursor:"pointer",background:scoresPublic?C.success:C.border,position:"relative",transition:"background .2s"}}>
              <div style={{width:20,height:20,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:scoresPublic?25:3,transition:"left .2s"}}/>
            </button>
          </div>
          {visMsg&&<div style={{padding:"6px 10px",borderRadius:6,marginBottom:8,fontSize:11,background:(visMsg.t==='e'?C.danger:C.success)+"15",color:visMsg.t==='e'?C.danger:C.success}}>{visMsg.m}</div>}
          <button onClick={saveVis} style={{width:"100%",padding:"10px",borderRadius:8,border:"none",background:C.accent,color:C.bg,cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:600}}>Sauvegarder</button>
        </div>
      </div>
    </div>
  );
}
