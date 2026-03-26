import { useState, useEffect, useCallback, useRef } from "react";

const C={bg:"#0a0f1a",card:"#111827",accent:"#32E0C4",gold:"#F59E0B",text:"#e2e8f0",muted:"#94a3b8",border:"#1e293b",success:"#10B981",danger:"#EF4444",primary:"#0D7377",secondary:"#14A3C7"};
const COLS=10,ROWS=18,CELL=24;

const PIECES=[
  {name:"Classe",shape:[[1,1],[1,1]],color:C.primary,concept:"Une classe est un moule pour creer des objets"},
  {name:"Heritage",shape:[[0,1,0],[1,1,1]],color:"#7C3AED",concept:"extends permet d'heriter des attributs et methodes"},
  {name:"Methode",shape:[[1,1,1,1]],color:C.accent,concept:"Une methode est une fonction appartenant a une classe"},
  {name:"Constructeur",shape:[[1,0],[1,0],[1,1]],color:C.gold,concept:"Le constructeur initialise l'objet (meme nom que la classe)"},
  {name:"Getter",shape:[[0,1],[0,1],[1,1]],color:C.success,concept:"Un getter retourne la valeur d'un attribut private"},
  {name:"Interface",shape:[[1,0],[1,1],[0,1]],color:C.danger,concept:"Une interface definit un contrat (methodes a implementer)"},
  {name:"Polymorphisme",shape:[[0,1],[1,1],[1,0]],color:C.secondary,concept:"Meme methode, comportement different selon le type reel"},
];

const OOP_QS=[
  {q:"Que fait 'new Invention()' ?",opts:["Declare une classe","Cree un OBJET","Supprime un objet"],correct:1},
  {q:"private signifie :",opts:["Accessible partout","Accessible dans la classe seulement","Accessible par les enfants"],correct:1},
  {q:"super() appelle :",opts:["La methode courante","Le constructeur du parent","Le destructeur"],correct:1},
  {q:"@Override sert a :",opts:["Creer une methode","Redefinir une methode heritee","Supprimer une methode"],correct:1},
  {q:"this fait reference a :",opts:["La classe parent","L'objet courant","Le constructeur"],correct:1},
  {q:"Encapsulation = :",opts:["Tout public","Proteger les donnees avec private + getters","Heritage multiple"],correct:1},
  {q:"ArrayList vs Array :",opts:["Meme chose","ArrayList a taille dynamique","Array est plus rapide"],correct:1},
  {q:"protected est visible par :",opts:["Tout le monde","La classe + ses enfants","La classe seulement"],correct:1},
  {q:"toString() est souvent :",opts:["final","@Override (redefinie)","private"],correct:1},
  {q:"Polymorphisme = :",opts:["Heritage multiple","Meme methode, comportement different","Encapsulation"],correct:1},
];

export default function GameTetrisOOP() {
  const [board, setBoard] = useState(Array(ROWS).fill(null).map(()=>Array(COLS).fill(null)));
  const [piece, setPiece] = useState(null);
  const [pos, setPos] = useState({x:0,y:0});
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [question, setQuestion] = useState(null);
  const [qIdx, setQIdx] = useState(0);
  const [showConcept, setShowConcept] = useState(null);
  const boardRef = useRef(board);

  useEffect(()=>{boardRef.current=board;},[board]);

  const newPiece = useCallback(()=>{
    const p = PIECES[Math.floor(Math.random()*PIECES.length)];
    const x = Math.floor((COLS-p.shape[0].length)/2);
    // Check if space is free
    for (let r=0;r<p.shape.length;r++)
      for (let c=0;c<p.shape[r].length;c++)
        if (p.shape[r][c]&&boardRef.current[r]&&boardRef.current[r][x+c]) { setGameOver(true); return; }
    setPiece(p); setPos({x,y:0}); setShowConcept(p);
    setTimeout(()=>setShowConcept(null),2000);
  },[]);

  useEffect(()=>{if(!piece&&!gameOver)newPiece();},[piece,gameOver,newPiece]);

  const collides=(b,p,px,py)=>{
    for(let r=0;r<p.shape.length;r++)
      for(let c=0;c<p.shape[r].length;c++)
        if(p.shape[r][c]){
          const nx=px+c,ny=py+r;
          if(nx<0||nx>=COLS||ny>=ROWS)return true;
          if(ny>=0&&b[ny][nx])return true;
        }
    return false;
  };

  const lock=useCallback(()=>{
    if(!piece)return;
    const nb=board.map(r=>[...r]);
    for(let r=0;r<piece.shape.length;r++)
      for(let c=0;c<piece.shape[r].length;c++)
        if(piece.shape[r][c]&&pos.y+r>=0) nb[pos.y+r][pos.x+c]=piece.color;
    // Clear lines
    let cleared=0;
    const filtered=nb.filter(row=>{if(row.every(Boolean)){cleared++;return false;}return true;});
    while(filtered.length<ROWS)filtered.unshift(Array(COLS).fill(null));
    setBoard(filtered);
    if(cleared>0){setLines(l=>l+cleared);setScore(s=>s+cleared*100*level);setLevel(l=>Math.floor((lines+cleared)/5)+1);}
    setPiece(null);
    // Ask a question every 3 pieces
    if(qIdx%3===2){setQuestion(OOP_QS[Math.floor(Math.random()*OOP_QS.length)]);}
    setQIdx(i=>i+1);
  },[piece,pos,board,level,lines,qIdx]);

  // Gravity
  useEffect(()=>{
    if(!piece||gameOver||question)return;
    const t=setInterval(()=>{
      setPos(p=>{
        if(collides(boardRef.current,piece,p.x,p.y+1)){setTimeout(lock,0);return p;}
        return {...p,y:p.y+1};
      });
    },Math.max(100,600-level*50));
    return ()=>clearInterval(t);
  },[piece,gameOver,question,level,lock]);

  useEffect(()=>{
    const handle=(e)=>{
      if(!piece||gameOver||question)return;
      if(e.key==="ArrowLeft"&&!collides(board,piece,pos.x-1,pos.y))setPos(p=>({...p,x:p.x-1}));
      else if(e.key==="ArrowRight"&&!collides(board,piece,pos.x+1,pos.y))setPos(p=>({...p,x:p.x+1}));
      else if(e.key==="ArrowDown"&&!collides(board,piece,pos.x,pos.y+1))setPos(p=>({...p,y:p.y+1}));
      else if(e.key==="ArrowUp"){
        // Rotate
        const rotated=piece.shape[0].map((_,i)=>piece.shape.map(r=>r[i]).reverse());
        const rp={...piece,shape:rotated};
        if(!collides(board,rp,pos.x,pos.y))setPiece(rp);
      }
      e.preventDefault();
    };
    window.addEventListener("keydown",handle);
    return ()=>window.removeEventListener("keydown",handle);
  },[piece,pos,board,gameOver,question]);

  const [feedback, setFeedback] = useState(null);
  const answerQ=(idx)=>{
    const ok = idx===question.correct;
    if(ok){setScore(s=>s+50);}
    else{
      const nb=board.map(r=>[...r]);
      nb.shift();
      const garbage=Array(COLS).fill(C.danger+"80");
      garbage[Math.floor(Math.random()*COLS)]=null;
      nb.push(garbage);
      setBoard(nb);
    }
    setFeedback(ok ? "Correct ! +50 pts" : "Incorrect ! Ligne de garbage");
    setTimeout(() => { setFeedback(null); setQuestion(null); }, 1200);
  };

  const restart=()=>{
    setBoard(Array(ROWS).fill(null).map(()=>Array(COLS).fill(null)));
    setPiece(null);setScore(0);setLines(0);setLevel(1);setGameOver(false);setQuestion(null);setQIdx(0);
  };

  // Render
  const renderBoard=()=>{
    const cells=[];
    for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){
      let color=board[r][c];
      if(piece&&!color){
        const pr=r-pos.y,pc=c-pos.x;
        if(pr>=0&&pr<piece.shape.length&&pc>=0&&pc<piece.shape[pr].length&&piece.shape[pr][pc])color=piece.color;
      }
      cells.push(<div key={r+"-"+c} style={{
        position:"absolute",left:c*CELL,top:r*CELL,width:CELL-1,height:CELL-1,
        background:color||"transparent",borderRadius:2,
        border:color?"1px solid rgba(255,255,255,0.15)":"none",
      }}/>);
    }
    return cells;
  };

  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',system-ui,sans-serif",display:"flex",flexDirection:"column",alignItems:"center",padding:16}}>
      <div style={{padding:"6px 16px",background:"#111827",borderBottom:"1px solid #1e293b",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <button onClick={()=>window.history.length>1?window.history.back():window.location.reload()} style={{display:"flex",alignItems:"center",gap:4,padding:"5px 12px",borderRadius:7,border:"1px solid #1e293b",background:"transparent",color:"#94a3b8",cursor:"pointer",fontFamily:"inherit",fontSize:11}}>{"\u2190 Retour"}</button>
        <span style={{fontSize:13,fontWeight:700,color:"#7C3AED"}}>Tetris OOP</span>
        <span style={{fontSize:11,color:"#F59E0B",fontWeight:700}}>{"Score: "+score+" | Lignes: "+lines+" | Niv: "+level}</span>
      </div>
      <div style={{display:"flex",gap:16}}>
        <div style={{position:"relative",width:COLS*CELL,height:ROWS*CELL,background:C.card,borderRadius:8,border:"1px solid "+C.border,overflow:"hidden"}}>
          {renderBoard()}
          {showConcept&&<div style={{position:"absolute",top:8,left:8,right:8,padding:"6px 10px",borderRadius:6,background:showConcept.color+"20",border:"1px solid "+showConcept.color+"40",fontSize:10,color:showConcept.color,fontWeight:600,transition:"opacity .5s"}}>{showConcept.name} : {showConcept.concept}</div>}
          {question&&<div style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",background:"rgba(10,15,26,0.93)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:12}}>
            <div style={{fontSize:12,fontWeight:700,color:C.accent,marginBottom:10,textAlign:"center"}}>{question.q}</div>
            {question.opts.map((o,i)=><button key={i} onClick={()=>answerQ(i)} style={{display:"block",width:"90%",padding:"8px",marginBottom:4,borderRadius:6,border:"1px solid "+C.border,background:C.card,color:C.text,cursor:"pointer",fontFamily:"inherit",fontSize:11,textAlign:"left"}}>{String.fromCharCode(65+i)+". "+o}</button>)}
            {feedback&&<div style={{marginTop:8,padding:"6px 12px",borderRadius:6,fontSize:11,fontWeight:700,background:feedback.includes("Correct")?"#10B98120":"#EF444420",color:feedback.includes("Correct")?"#10B981":"#EF4444"}}>{feedback}</div>}
          </div>}
          {gameOver&&<div style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",background:"rgba(10,15,26,0.93)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <div style={{fontSize:20,fontWeight:700,color:C.danger}}>Game Over</div>
            <div style={{fontSize:12,color:C.muted,margin:"6px 0"}}>Score: {score} | Lignes: {lines}</div>
            <button onClick={restart} style={{padding:"8px 24px",borderRadius:7,border:"none",background:C.accent,color:C.bg,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700}}>Rejouer</button>
          </div>}
        </div>
        <div style={{width:140}}>
          <div style={{fontSize:10,fontWeight:600,color:C.muted,marginBottom:6}}>PIECES = CLASSES</div>
          {PIECES.map((p,i)=><div key={i} style={{fontSize:9,color:p.color,marginBottom:3,padding:"2px 6px",borderRadius:4,background:p.color+"10"}}>{p.name}</div>)}
          <div style={{marginTop:12,fontSize:9,color:C.muted,lineHeight:1.5}}>Fleches : bouger<br/>Haut : tourner<br/>Bas : accelerer<br/><br/>Chaque piece = un concept OOP. Quiz toutes les 3 pieces !</div>
        </div>
      </div>
    </div>
  );
}
