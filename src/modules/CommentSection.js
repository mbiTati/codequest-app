import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthProvider';
import { MessageSquare, Send, CheckCircle, Clock } from 'lucide-react';

const C = {
  bg:"#0a0f1a",card:"#111827",accent:"#32E0C4",gold:"#F59E0B",
  text:"#e2e8f0",muted:"#94a3b8",border:"#1e293b",danger:"#EF4444",
  primary:"#0D7377",success:"#10B981",dimmed:"#64748b",
};

const MODULE_LIST = [
  {code:"M00",title:"Fondamentaux"},{code:"M15",title:"Variables & Types"},
  {code:"M01",title:"Conditions"},{code:"M02",title:"Boucles"},
  {code:"M03",title:"POO"},{code:"M04",title:"Data"},
  {code:"M05",title:"Heritage"},{code:"M14",title:"Swing & Events"},
  {code:"M06",title:"Projet Git"},{code:"M07",title:"Securite"},
  {code:"M08",title:"Build & Deploy"},{code:"M09",title:"Debugging"},
  {code:"M10",title:"Standards"},{code:"M11",title:"Escape Room"},
  {code:"M12",title:"Fichiers & Crypto"},{code:"M13",title:"Base de donnees"},
  {code:"general",title:"Question generale"},
];

export default function CommentSection(){
  const {student}=useAuth();
  const [comments,setComments]=useState([]);
  const [message,setMessage]=useState('');
  const [moduleCode,setModuleCode]=useState('general');
  const [sending,setSending]=useState(false);
  const [sent,setSent]=useState(false);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{if(student)loadComments();},[student]);

  async function loadComments(){
    try{
      const {data}=await supabase.from('cq_comments')
        .select('*,cq_modules(code,title)')
        .eq('student_id',student.id)
        .order('created_at',{ascending:false}).limit(20);
      setComments(data||[]);
    }catch(e){setComments([]);}
    setLoading(false);
  }

  async function sendComment(){
    if(!message.trim()||!student)return;
    setSending(true);setSent(false);
    try{
      // Get module id if not general
      let moduleId=null;
      if(moduleCode!=='general'){
        const {data:mod}=await supabase.from('cq_modules').select('id').eq('code',moduleCode).single();
        moduleId=mod?.id;
      }
      await supabase.from('cq_comments').insert({
        student_id:student.id,
        module_id:moduleId,
        message:message.trim(),
      });
      setMessage('');setSent(true);
      setTimeout(()=>setSent(false),3000);
      loadComments();
    }catch(e){console.log('Comment error:',e);}
    setSending(false);
  }

  if(!student)return null;

  return(
    <div style={{background:C.card,borderRadius:12,padding:16,border:"1px solid "+C.border}}>
      <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:12,display:"flex",alignItems:"center",gap:6}}>
        <MessageSquare size={16} color={C.accent}/>Envoyer un commentaire
      </div>

      {/* New comment form */}
      <div style={{marginBottom:16}}>
        <div style={{display:"flex",gap:8,marginBottom:8}}>
          <select value={moduleCode} onChange={e=>setModuleCode(e.target.value)} style={{
            padding:"8px 12px",borderRadius:8,border:"1px solid "+C.border,
            background:C.bg,color:C.text,fontSize:11,fontFamily:"inherit",flex:"0 0 auto",
          }}>
            {MODULE_LIST.map(m=><option key={m.code} value={m.code}>{m.code==="general"?"Question generale":m.code+" - "+m.title}</option>)}
          </select>
        </div>
        <div style={{display:"flex",gap:8}}>
          <textarea value={message} onChange={e=>setMessage(e.target.value)}
            placeholder="Votre question ou commentaire..."
            rows={3} style={{
              flex:1,padding:"10px 12px",borderRadius:8,border:"1px solid "+C.border,
              background:C.bg,color:C.text,fontSize:12,fontFamily:"inherit",resize:"vertical",
              outline:"none",
            }}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
          <span style={{fontSize:10,color:C.dimmed}}>{message.length}/500</span>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {sent&&<span style={{fontSize:11,color:C.success,display:"flex",alignItems:"center",gap:4}}><CheckCircle size={12}/>Envoye !</span>}
            <button onClick={sendComment} disabled={sending||!message.trim()} style={{
              display:"flex",alignItems:"center",gap:4,
              padding:"8px 16px",borderRadius:8,border:"none",
              background:sending||!message.trim()?C.border:C.accent,
              color:sending||!message.trim()?C.dimmed:C.bg,
              cursor:sending||!message.trim()?"default":"pointer",
              fontFamily:"inherit",fontSize:12,fontWeight:600,
            }}><Send size={12}/>{sending?"...":"Envoyer"}</button>
          </div>
        </div>
      </div>

      {/* My comments history */}
      {!loading&&comments.length>0&&(
        <div>
          <div style={{fontSize:11,fontWeight:600,color:C.muted,marginBottom:8}}>Mes commentaires</div>
          {comments.map(c=>(
            <div key={c.id} style={{padding:"10px 12px",borderRadius:8,background:C.bg,border:"1px solid "+C.border,marginBottom:6}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                <span style={{fontSize:10,color:C.accent,fontWeight:600}}>
                  {c.cq_modules?c.cq_modules.code+" - "+c.cq_modules.title:"Question generale"}
                </span>
                <span style={{fontSize:9,color:C.dimmed}}>{new Date(c.created_at).toLocaleDateString('fr-FR')}</span>
              </div>
              <div style={{fontSize:12,color:C.text,lineHeight:1.5}}>{c.message}</div>
              {c.teacher_reply?(
                <div style={{marginTop:6,padding:"6px 10px",borderRadius:6,background:C.success+"10",border:"1px solid "+C.success+"30"}}>
                  <div style={{fontSize:9,fontWeight:600,color:C.success,marginBottom:2}}>Reponse de l'enseignant :</div>
                  <div style={{fontSize:11,color:C.success}}>{c.teacher_reply}</div>
                </div>
              ):(
                <div style={{marginTop:4,fontSize:10,color:C.dimmed,display:"flex",alignItems:"center",gap:4}}>
                  <Clock size={10}/>En attente de reponse
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
