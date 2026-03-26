import { useState } from "react";
import { ChevronLeft, Trophy, CheckCircle, XCircle, Box, GitBranch } from "lucide-react";
const C={bg:"#0a0f1a",card:"#111827",accent:"#32E0C4",gold:"#F59E0B",text:"#e2e8f0",muted:"#94a3b8",border:"#1e293b",success:"#10B981",danger:"#EF4444",primary:"#0D7377",dimmed:"#64748b",code:"#1E293B"};

const CHALLENGES=[
{title:"Classe Produit",desc:"Construisez le diagramme UML de la classe Produit",
 slots:[{id:"name",label:"Nom de classe",zone:"header"},{id:"a1",label:"Attribut 1",zone:"attrs"},{id:"a2",label:"Attribut 2",zone:"attrs"},{id:"a3",label:"Attribut 3",zone:"attrs"},{id:"m1",label:"Methode 1",zone:"methods"},{id:"m2",label:"Methode 2",zone:"methods"}],
 pieces:[
  {id:"p-nom",text:"Produit",correct:"name",zone:"header"},
  {id:"p-a1",text:"- nom : String",correct:"a1",zone:"attrs"},
  {id:"p-a2",text:"- prix : double",correct:"a2",zone:"attrs"},
  {id:"p-a3",text:"- quantite : int",correct:"a3",zone:"attrs"},
  {id:"p-m1",text:"+ getNom() : String",correct:"m1",zone:"methods"},
  {id:"p-m2",text:"+ calculerValeur() : double",correct:"m2",zone:"methods"},
  {id:"d1",text:"+ nom : String",correct:null,zone:null},
  {id:"d2",text:"Inventeur",correct:null,zone:null},
  {id:"d3",text:"- getPrix() : void",correct:null,zone:null},
 ]},
{title:"Heritage Animal",desc:"Placez les elements dans la bonne classe (Animal parent, Chien enfant)",
 slots:[{id:"parent-name",label:"Classe parent",zone:"parent"},{id:"pa1",label:"Attribut parent",zone:"parent"},{id:"pm1",label:"Methode parent",zone:"parent"},{id:"child-name",label:"Classe enfant",zone:"child"},{id:"ca1",label:"Attribut enfant",zone:"child"},{id:"cm1",label:"Methode enfant (override)",zone:"child"}],
 pieces:[
  {id:"p1",text:"Animal",correct:"parent-name",zone:"parent"},
  {id:"p2",text:"# nom : String",correct:"pa1",zone:"parent"},
  {id:"p3",text:"+ faireSon() : void",correct:"pm1",zone:"parent"},
  {id:"p4",text:"Chien",correct:"child-name",zone:"child"},
  {id:"p5",text:"- race : String",correct:"ca1",zone:"child"},
  {id:"p6",text:"+ faireSon() : void",correct:"cm1",zone:"child"},
  {id:"d1",text:"+ nom : public",correct:null,zone:null},
  {id:"d2",text:"Chat",correct:null,zone:null},
 ]},
{title:"Visibilite UML",desc:"Classez les symboles UML par visibilite",
 slots:[{id:"s1",label:"private",zone:"vis"},{id:"s2",label:"public",zone:"vis"},{id:"s3",label:"protected",zone:"vis"},{id:"s4",label:"String en UML",zone:"type"},{id:"s5",label:"Methode void",zone:"type"}],
 pieces:[
  {id:"p1",text:"-",correct:"s1",zone:"vis"},
  {id:"p2",text:"+",correct:"s2",zone:"vis"},
  {id:"p3",text:"#",correct:"s3",zone:"vis"},
  {id:"p4",text:": String",correct:"s4",zone:"type"},
  {id:"p5",text:": void",correct:"s5",zone:"type"},
  {id:"d1",text:"~",correct:null,zone:null},
  {id:"d2",text:"*",correct:null,zone:null},
 ]},
];

export default function GameUMLBuilder(){
const[screen,setScreen]=useState("menu");
const[chIdx,setChIdx]=useState(0);
const[placed,setPlaced]=useState({});
const[dragging,setDragging]=useState(null);
const[score,setScore]=useState(0);
const[checked,setChecked]=useState(false);
const[results,setResults]=useState([]);

function start(){setChIdx(0);setPlaced({});setDragging(null);setScore(0);setChecked(false);setResults([]);setScreen("play");}
const ch=CHALLENGES[chIdx];
const availablePieces=ch?ch.pieces.filter(p=>!Object.values(placed).includes(p.id)):[];

function onDragStart(pieceId){setDragging(pieceId);}
function onDragEnd(){setDragging(null);}
function onDropSlot(slotId){
  if(!dragging)return;
  // Remove piece from any other slot
  const newPlaced={...placed};
  Object.keys(newPlaced).forEach(k=>{if(newPlaced[k]===dragging)delete newPlaced[k];});
  newPlaced[slotId]=dragging;
  setPlaced(newPlaced);
  setDragging(null);
}
function removePiece(slotId){const np={...placed};delete np[slotId];setPlaced(np);}

function checkAnswer(){
  setChecked(true);
  let correct=0;
  ch.slots.forEach(slot=>{
    const placedPieceId=placed[slot.id];
    const piece=ch.pieces.find(p=>p.id===placedPieceId);
    if(piece&&piece.correct===slot.id)correct++;
  });
  const pts=Math.round((correct/ch.slots.length)*100);
  setScore(s=>s+pts);
  setResults(r=>[...r,{title:ch.title,pts,total:ch.slots.length,correct}]);
}

function next(){
  if(chIdx+1>=CHALLENGES.length){setScreen("result");return;}
  setChIdx(i=>i+1);setPlaced({});setDragging(null);setChecked(false);
}

if(screen==="menu")return(<div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
<div style={{padding:"6px 16px",background:C.card,borderBottom:"1px solid "+C.border,display:"flex",alignItems:"center",justifyContent:"space-between",position:"fixed",top:0,left:0,right:0,zIndex:10}}><button onClick={()=>window.history.back()} style={{display:"flex",alignItems:"center",gap:4,padding:"5px 12px",borderRadius:7,border:"1px solid "+C.border,background:"transparent",color:C.muted,cursor:"pointer",fontFamily:"inherit",fontSize:11}}><ChevronLeft size={14}/>Retour</button><span style={{fontSize:13,fontWeight:700,color:"#7C3AED"}}>UML Builder</span><div/></div>
<Box size={48} color={"#7C3AED"} style={{marginBottom:16}}/>
<div style={{fontSize:28,fontWeight:800,color:"#7C3AED",marginBottom:8}}>UML Builder</div>
<div style={{fontSize:13,color:C.muted,maxWidth:400,textAlign:"center",marginBottom:24}}>Construisez des diagrammes de classes UML en glissant les elements au bon endroit !</div>
<button onClick={start} style={{padding:"14px 40px",borderRadius:12,border:"none",background:"#7C3AED",color:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:16,fontWeight:700}}>Commencer ({CHALLENGES.length} defis)</button></div>);

if(screen==="result"){const totalPts=results.reduce((a,r)=>a+r.pts,0);const maxPts=results.length*100;return(<div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
<Trophy size={48} color={C.gold} style={{marginBottom:12}}/>
<div style={{fontSize:24,fontWeight:700,color:C.gold}}>Termine !</div>
<div style={{fontSize:36,fontWeight:800,color:C.accent,margin:"8px 0"}}>{totalPts+"/"+maxPts}</div>
{results.map((r,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",marginBottom:4,borderRadius:6,background:C.card,border:"1px solid "+C.border,width:"100%",maxWidth:400}}>
<span style={{flex:1,fontSize:12,color:C.text}}>{r.title}</span>
<span style={{fontSize:11,color:r.pts>=80?C.success:r.pts>=50?C.gold:C.danger,fontWeight:700}}>{r.correct+"/"+r.total}</span>
</div>)}
<button onClick={()=>setScreen("menu")} style={{marginTop:16,padding:"10px 30px",borderRadius:8,border:"none",background:C.accent,color:C.bg,cursor:"pointer",fontFamily:"inherit",fontSize:14,fontWeight:700}}>Rejouer</button></div>);}

// PLAYING
return(<div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',sans-serif"}}>
<div style={{padding:"6px 16px",background:C.card,borderBottom:"1px solid "+C.border,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
<button onClick={()=>setScreen("menu")} style={{display:"flex",alignItems:"center",gap:4,padding:"5px 12px",borderRadius:7,border:"1px solid "+C.border,background:"transparent",color:C.muted,cursor:"pointer",fontFamily:"inherit",fontSize:11}}><ChevronLeft size={14}/>Menu</button>
<span style={{fontSize:13,fontWeight:700,color:"#7C3AED"}}>{"Defi "+(chIdx+1)+"/"+CHALLENGES.length}</span>
<span style={{fontSize:12,color:C.accent,fontWeight:700}}>{score+" pts"}</span>
</div>
<div style={{maxWidth:700,margin:"16px auto",padding:"0 16px"}}>
<div style={{fontSize:16,fontWeight:700,color:"#7C3AED",marginBottom:4}}>{ch?.title}</div>
<div style={{fontSize:11,color:C.muted,marginBottom:16}}>{ch?.desc}</div>

{/* UML Diagram Slots */}
<div style={{background:C.card,borderRadius:12,padding:16,border:"2px solid #7C3AED40",marginBottom:16}}>
<div style={{fontSize:10,fontWeight:600,color:C.dimmed,marginBottom:8,letterSpacing:1}}>DIAGRAMME UML</div>
<div style={{display:"grid",gap:6}}>
{ch?.slots.map(slot=>{
  const placedPieceId=placed[slot.id];
  const piece=ch.pieces.find(p=>p.id===placedPieceId);
  const isCorrect=checked&&piece&&piece.correct===slot.id;
  const isWrong=checked&&piece&&piece.correct!==slot.id;
  const isEmpty=!piece;
  return(<div key={slot.id}
    onDragOver={e=>{e.preventDefault();e.dataTransfer.dropEffect="move";}}
    onDrop={e=>{e.preventDefault();onDropSlot(slot.id);}}
    style={{
      padding:"8px 12px",borderRadius:6,minHeight:36,
      border:"2px dashed "+(isCorrect?C.success:isWrong?C.danger:dragging?"#7C3AED":C.border),
      background:isCorrect?C.success+"10":isWrong?C.danger+"10":isEmpty?C.bg:C.code,
      display:"flex",alignItems:"center",justifyContent:"space-between",
      transition:"all .15s",
    }}>
    {piece?(
      <div style={{display:"flex",alignItems:"center",gap:6,flex:1}}>
        <span style={{fontFamily:"Consolas,monospace",fontSize:13,color:isCorrect?C.success:isWrong?C.danger:C.accent}}>{piece.text}</span>
        {checked&&(isCorrect?<CheckCircle size={14} color={C.success}/>:<XCircle size={14} color={C.danger}/>)}
        {!checked&&<button onClick={()=>removePiece(slot.id)} style={{marginLeft:"auto",background:"none",border:"none",color:C.dimmed,cursor:"pointer",fontSize:10}}>x</button>}
      </div>
    ):(
      <span style={{fontSize:10,color:C.dimmed,fontStyle:"italic"}}>{slot.label}</span>
    )}
  </div>);
})}
</div>
</div>

{/* Available Pieces */}
{!checked&&<div style={{marginBottom:16}}>
<div style={{fontSize:10,fontWeight:600,color:C.dimmed,marginBottom:6,letterSpacing:1}}>ELEMENTS DISPONIBLES (glissez dans le diagramme)</div>
<div style={{display:"flex",flexWrap:"wrap",gap:6}}>
{availablePieces.map(p=>(
  <div key={p.id} draggable
    onDragStart={()=>onDragStart(p.id)}
    onDragEnd={onDragEnd}
    style={{
      padding:"6px 12px",borderRadius:6,cursor:"grab",
      background:C.code,border:"1px solid "+C.border,
      fontFamily:"Consolas,monospace",fontSize:12,color:C.accent,
      userSelect:"none",
    }}>{p.text}</div>
))}
</div>
</div>}

{/* Actions */}
<div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
{!checked&&<button onClick={checkAnswer} disabled={Object.keys(placed).length<ch?.slots.length} style={{padding:"8px 20px",borderRadius:7,border:"none",background:Object.keys(placed).length>=ch?.slots.length?"#7C3AED":C.border,color:"#fff",cursor:Object.keys(placed).length>=ch?.slots.length?"pointer":"default",fontFamily:"inherit",fontSize:12,fontWeight:600}}>Verifier</button>}
{checked&&<button onClick={next} style={{padding:"8px 20px",borderRadius:7,border:"none",background:C.accent,color:C.bg,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600}}>{chIdx+1>=CHALLENGES.length?"Voir le resultat":"Suivant"}</button>}
</div>
</div></div>);}
