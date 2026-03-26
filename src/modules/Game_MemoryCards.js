import { useState, useEffect } from "react";

const C={bg:"#0a0f1a",card:"#111827",accent:"#32E0C4",gold:"#F59E0B",text:"#e2e8f0",muted:"#94a3b8",border:"#1e293b",success:"#10B981",danger:"#EF4444",primary:"#0D7377",secondary:"#14A3C7"};

const PAIRS=[
  {concept:"private",def:"Accessible dans la classe seulement"},
  {concept:"public",def:"Accessible depuis partout"},
  {concept:"extends",def:"Herite d'une classe parent"},
  {concept:"super()",def:"Appelle le constructeur parent"},
  {concept:"@Override",def:"Redefinit une methode heritee"},
  {concept:"this",def:"Reference a l'objet courant"},
  {concept:"new",def:"Cree une instance (objet)"},
  {concept:"ArrayList",def:"Liste a taille dynamique"},
  {concept:"try-catch",def:"Gere les exceptions"},
  {concept:"final",def:"Constante, non modifiable"},
  {concept:"void",def:"Ne retourne rien"},
  {concept:"static",def:"Appartient a la classe, pas a l'objet"},
];

function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

export default function GameMemoryCards(){
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [started, setStarted] = useState(false);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [difficulty, setDifficulty] = useState(null);

  const startGame = (nPairs) => {
    const selected = shuffle(PAIRS).slice(0, nPairs);
    const deck = shuffle([
      ...selected.map((p,i) => ({id:i*2, pairId:i, text:p.concept, type:"concept", color:C.accent})),
      ...selected.map((p,i) => ({id:i*2+1, pairId:i, text:p.def, type:"def", color:C.gold})),
    ]);
    setCards(deck); setFlipped([]); setMatched([]); setMoves(0); setTimer(0);
    setStarted(true); setCombo(0); setBestCombo(0); setDifficulty(nPairs);
  };

  useEffect(() => {
    if (!started || matched.length === cards.length) return;
    const t = setInterval(() => setTimer(v=>v+1), 1000);
    return () => clearInterval(t);
  }, [started, matched.length, cards.length]);

  useEffect(() => {
    if (flipped.length !== 2) return;
    const [a,b] = flipped;
    setMoves(m=>m+1);
    if (a.pairId === b.pairId) {
      setTimeout(() => {
        setMatched(m=>[...m, a.id, b.id]);
        setFlipped([]);
        setCombo(c=>{const nc=c+1;if(nc>bestCombo)setBestCombo(nc);return nc;});
      }, 400);
    } else {
      setTimeout(() => { setFlipped([]); setCombo(0); }, 800);
    }
  }, [flipped, bestCombo]);

  const flip = (card) => {
    if (flipped.length >= 2 || flipped.find(f=>f.id===card.id) || matched.includes(card.id)) return;
    setFlipped(f => [...f, card]);
  };

  const done = matched.length === cards.length && cards.length > 0;
  const stars = moves <= difficulty*1.5 ? 3 : moves <= difficulty*2.5 ? 2 : 1;
  const mm=Math.floor(timer/60),ss=timer%60;

  if (!started) {
    return (
      <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',system-ui,sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
        <div style={{fontSize:11,letterSpacing:2,color:C.muted,marginBottom:6}}>CODEQUEST</div>
        <div style={{fontSize:24,fontWeight:700,color:C.gold,marginBottom:20}}>Memory Java</div>
        <div style={{fontSize:13,color:C.muted,marginBottom:20}}>Associez chaque concept Java a sa definition</div>
        <div style={{display:"flex",gap:12}}>
          {[{n:4,label:"Facile (4 paires)"},{n:6,label:"Normal (6 paires)"},{n:8,label:"Difficile (8 paires)"}].map(d=>(
            <button key={d.n} onClick={()=>startGame(d.n)} style={{
              padding:"14px 24px",borderRadius:10,border:"1px solid "+C.gold+"40",
              background:C.card,color:C.gold,cursor:"pointer",fontFamily:"inherit",
              fontSize:13,fontWeight:600,
            }}>{d.label}</button>
          ))}
        </div>
      </div>
    );
  }

  const gridCols = cards.length <= 8 ? 4 : cards.length <= 12 ? 4 : 4;

  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',system-ui,sans-serif",display:"flex",flexDirection:"column",alignItems:"center",padding:16}}>
      <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:12}}>
        <span style={{fontSize:11,letterSpacing:2,color:C.muted}}>CODEQUEST</span>
        <span style={{color:C.border}}>|</span>
        <span style={{fontSize:14,fontWeight:700,color:C.gold}}>Memory Java</span>
        <span style={{color:C.border}}>|</span>
        <span style={{fontSize:12,color:C.muted}}>Coups: {moves}</span>
        <span style={{fontSize:12,color:C.muted}}>{mm}:{ss.toString().padStart(2,"0")}</span>
        {combo>1&&<span style={{fontSize:11,color:C.accent,fontWeight:700}}>Combo x{combo}</span>}
      </div>

      <div style={{display:"grid",gridTemplateColumns:`repeat(${gridCols}, 1fr)`,gap:8,maxWidth:560}}>
        {cards.map(card => {
          const isFlipped = flipped.find(f=>f.id===card.id);
          const isMatched = matched.includes(card.id);
          const show = isFlipped || isMatched;
          return (
            <div key={card.id} onClick={()=>flip(card)} style={{
              width:130,height:80,borderRadius:10,cursor:show?"default":"pointer",
              background:isMatched?C.success+"20":show?card.color+"15":C.card,
              border:"1px solid "+(isMatched?C.success:show?card.color:C.border),
              display:"flex",alignItems:"center",justifyContent:"center",
              padding:8,transition:"all .2s",
              transform:show?"rotateY(0deg)":"rotateY(0deg)",
            }}>
              {show ? (
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:card.type==="concept"?14:10,fontWeight:card.type==="concept"?700:400,color:isMatched?C.success:card.color,fontFamily:card.type==="concept"?"monospace":"inherit"}}>{card.text}</div>
                </div>
              ) : (
                <div style={{fontSize:20,color:C.border,fontWeight:700}}>?</div>
              )}
            </div>
          );
        })}
      </div>

      {done && (
        <div style={{marginTop:20,textAlign:"center",background:C.card,borderRadius:12,padding:20,border:"1px solid "+C.gold+"40"}}>
          <div style={{fontSize:20,fontWeight:700,color:C.gold,marginBottom:6}}>Bravo !</div>
          <div style={{fontSize:28,marginBottom:6}}>{"* ".repeat(stars).trim()}</div>
          <div style={{fontSize:12,color:C.muted}}>{moves} coups | {mm}:{ss.toString().padStart(2,"0")} | Meilleur combo: x{bestCombo}</div>
          <button onClick={()=>setStarted(false)} style={{marginTop:12,padding:"8px 24px",borderRadius:7,border:"none",background:C.accent,color:C.bg,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700}}>Rejouer</button>
        </div>
      )}
    </div>
  );
}
