import { useState, useEffect, useCallback, useRef } from "react";

const C={bg:"#0a0f1a",card:"#111827",accent:"#32E0C4",gold:"#F59E0B",text:"#e2e8f0",muted:"#94a3b8",border:"#1e293b",success:"#10B981",danger:"#EF4444",primary:"#0D7377"};
const CELL=20, COLS=25, ROWS=20;
const KEY="cq-game-snake-java";

const QUESTIONS=[
  {q:"for (int i=0; i<5; i++) — combien de tours ?",opts:["4","5","6"],correct:1},
  {q:"while (true) — que se passe-t-il ?",opts:["Rien","Boucle infinie","Erreur"],correct:1},
  {q:"do-while execute le corps au moins :",opts:["0 fois","1 fois","2 fois"],correct:1},
  {q:"for (int i=10; i>0; i--) — valeur finale de i ?",opts:["0","1","-1"],correct:0},
  {q:"break dans une boucle :",opts:["Passe au tour suivant","Sort de la boucle","Arrete le programme"],correct:1},
  {q:"continue dans une boucle :",opts:["Sort de la boucle","Passe au tour suivant","Recommence a zero"],correct:1},
  {q:"for (int i=0; i<=10; i+=2) — combien de tours ?",opts:["5","6","10"],correct:1},
  {q:"Quelle boucle teste la condition APRES ?",opts:["for","while","do-while"],correct:2},
  {q:"int[] tab = {1,2,3}; tab.length vaut :",opts:["2","3","4"],correct:1},
  {q:"for-each : for (String s : liste) — s est :",opts:["L'index","L'element courant","La taille"],correct:1},
];

export default function GameSnakeJava() {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([{x:12,y:10},{x:11,y:10},{x:10,y:10}]);
  const [dir, setDir] = useState({x:1,y:0});
  const [food, setFood] = useState({x:5,y:5});
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [question, setQuestion] = useState(null);
  const [qIdx, setQIdx] = useState(0);
  const [speed] = useState(150);
  const dirRef = useRef(dir);
  const snakeRef = useRef(snake);

  const spawnFood = useCallback(() => {
    let f;
    do { f = {x:Math.floor(Math.random()*COLS),y:Math.floor(Math.random()*ROWS)}; }
    while (snakeRef.current.some(s=>s.x===f.x&&s.y===f.y));
    return f;
  }, []);

  useEffect(() => { dirRef.current = dir; }, [dir]);
  useEffect(() => { snakeRef.current = snake; }, [snake]);

  useEffect(() => {
    const handleKey = (e) => {
      if (question) return;
      const d = dirRef.current;
      if (e.key==="ArrowUp"&&d.y!==1) setDir({x:0,y:-1});
      else if (e.key==="ArrowDown"&&d.y!==-1) setDir({x:0,y:1});
      else if (e.key==="ArrowLeft"&&d.x!==1) setDir({x:-1,y:0});
      else if (e.key==="ArrowRight"&&d.x!==-1) setDir({x:1,y:0});
      e.preventDefault();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [question]);

  useEffect(() => {
    if (gameOver || paused || question) return;
    const interval = setInterval(() => {
      setSnake(prev => {
        const d = dirRef.current;
        const head = {x:prev[0].x+d.x, y:prev[0].y+d.y};
        if (head.x<0||head.x>=COLS||head.y<0||head.y>=ROWS||prev.some(s=>s.x===head.x&&s.y===head.y)) {
          setGameOver(true); return prev;
        }
        const newSnake = [head, ...prev];
        if (head.x===food.x&&head.y===food.y) {
          setFood(spawnFood());
          setPaused(true);
          setQuestion(QUESTIONS[qIdx % QUESTIONS.length]);
          setQIdx(i=>i+1);
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, speed);
    return () => clearInterval(interval);
  }, [gameOver, paused, question, food, speed, qIdx, spawnFood]);

  // Draw
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = C.bg; ctx.fillRect(0,0,COLS*CELL,ROWS*CELL);
    // Grid
    ctx.strokeStyle = C.border; ctx.lineWidth=0.3;
    for (let i=0;i<=COLS;i++){ctx.beginPath();ctx.moveTo(i*CELL,0);ctx.lineTo(i*CELL,ROWS*CELL);ctx.stroke();}
    for (let i=0;i<=ROWS;i++){ctx.beginPath();ctx.moveTo(0,i*CELL);ctx.lineTo(COLS*CELL,i*CELL);ctx.stroke();}
    // Snake
    snake.forEach((s,i) => {
      ctx.fillStyle = i===0 ? C.accent : C.primary;
      ctx.fillRect(s.x*CELL+1,s.y*CELL+1,CELL-2,CELL-2);
      if (i===0) { ctx.fillStyle=C.bg; ctx.fillRect(s.x*CELL+5,s.y*CELL+5,4,4); ctx.fillRect(s.x*CELL+11,s.y*CELL+5,4,4); }
    });
    // Food
    ctx.fillStyle = C.gold;
    ctx.beginPath(); ctx.arc(food.x*CELL+CELL/2,food.y*CELL+CELL/2,CELL/2-2,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = C.bg; ctx.font="bold 10px monospace"; ctx.textAlign="center"; ctx.textBaseline="middle";
    ctx.fillText("?",food.x*CELL+CELL/2,food.y*CELL+CELL/2+1);
  }, [snake, food]);

  const [feedback, setFeedback] = useState(null);
  const answerQ = (idx) => {
    const ok = idx === question.correct;
    if (ok) { setScore(s=>s+10); }
    else { setSnake(s => s.length > 2 ? s.slice(0,-1) : s); }
    setFeedback(ok ? "Correct ! +10 pts" : "Incorrect ! Le serpent retrecit");
    setTimeout(() => { setFeedback(null); setQuestion(null); setPaused(false); }, 1200);
  };

  const restart = () => {
    setSnake([{x:12,y:10},{x:11,y:10},{x:10,y:10}]);
    setDir({x:1,y:0}); setFood(spawnFood()); setScore(0);
    setGameOver(false); setPaused(false); setQuestion(null); setQIdx(0);
  };

  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',system-ui,sans-serif",display:"flex",flexDirection:"column",alignItems:"center",padding:16}}>
      <div style={{padding:"6px 16px",background:"#111827",borderBottom:"1px solid #1e293b",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <button onClick={()=>window.history.length>1?window.history.back():window.location.reload()} style={{display:"flex",alignItems:"center",gap:4,padding:"5px 12px",borderRadius:7,border:"1px solid #1e293b",background:"transparent",color:"#94a3b8",cursor:"pointer",fontFamily:"inherit",fontSize:11}}>{"\u2190 Retour"}</button>
        <span style={{fontSize:13,fontWeight:700,color:"#32E0C4"}}>Snake Java</span>
        <span style={{fontSize:11,color:"#F59E0B",fontWeight:700}}>{"Score: "+score+" | Q"+qIdx+"/"+QUESTIONS.length}</span>
      </div>

      <div style={{position:"relative"}}>
        <canvas ref={canvasRef} width={COLS*CELL} height={ROWS*CELL} style={{borderRadius:8,border:"1px solid "+C.border}} tabIndex={0} />

        {question && (
          <div style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",background:"rgba(10,15,26,0.92)",borderRadius:8,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20}}>
            <div style={{fontSize:14,fontWeight:700,color:C.accent,marginBottom:12,textAlign:"center"}}>{question.q}</div>
            {question.opts.map((o,i) => (
              <button key={i} onClick={()=>answerQ(i)} style={{
                display:"block",width:"80%",maxWidth:300,padding:"10px 16px",marginBottom:6,
                borderRadius:8,border:"1px solid "+C.border,background:C.card,
                color:C.text,cursor:"pointer",fontFamily:"inherit",fontSize:13,textAlign:"left",
              }}>{String.fromCharCode(65+i)+". "+o}</button>
            ))}
            {feedback && <div style={{marginTop:10,padding:"8px 16px",borderRadius:8,fontSize:13,fontWeight:700,textAlign:"center",background:feedback.includes("Correct")?"#10B98120":"#EF444420",color:feedback.includes("Correct")?"#10B981":"#EF4444"}}>{feedback}</div>}
          </div>
        )}

        {gameOver && (
          <div style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",background:"rgba(10,15,26,0.92)",borderRadius:8,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <div style={{fontSize:24,fontWeight:700,color:C.danger,marginBottom:8}}>Game Over</div>
            <div style={{fontSize:14,color:C.muted,marginBottom:4}}>Score: {score} | Taille: {snake.length}</div>
            <button onClick={restart} style={{padding:"10px 30px",borderRadius:8,border:"none",background:C.accent,color:C.bg,cursor:"pointer",fontFamily:"inherit",fontSize:14,fontWeight:700,marginTop:10}}>Rejouer</button>
          </div>
        )}
      </div>

      <div style={{marginTop:10,fontSize:11,color:C.muted,textAlign:"center"}}>
        Fleches directionnelles pour bouger. Mangez les tokens "?" pour grandir.
        <br/>Bonne reponse = +10 pts. Mauvaise = le serpent retrecit !
      </div>
    </div>
  );
}
