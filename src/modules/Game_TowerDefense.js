import { useState, useEffect, useCallback, useRef } from "react";

const C={bg:"#0a0f1a",card:"#111827",accent:"#32E0C4",gold:"#F59E0B",text:"#e2e8f0",muted:"#94a3b8",border:"#1e293b",success:"#10B981",danger:"#EF4444",primary:"#0D7377",secondary:"#14A3C7"};

const TOWER_TYPES=[
  {id:"trycatch",name:"try-catch",cost:50,damage:2,range:3,color:C.primary,desc:"Attrape les exceptions"},
  {id:"validation",name:"Validation",cost:75,damage:3,range:2,color:C.gold,desc:"Valide les entrees"},
  {id:"nullcheck",name:"Null Check",cost:60,damage:4,range:2,color:C.accent,desc:"Bloque les NullPointer"},
  {id:"encapsulation",name:"Encapsulation",cost:100,damage:5,range:3,color:"#7C3AED",desc:"Protege avec private"},
  {id:"unittest",name:"Unit Test",cost:120,damage:6,range:4,color:C.success,desc:"Teste tout automatiquement"},
];

const BUG_TYPES=[
  {name:"NullPointerException",hp:8,speed:1,reward:20,color:C.danger},
  {name:"IndexOutOfBounds",hp:6,speed:1.5,reward:15,color:"#F97316"},
  {name:"ClassCastException",hp:10,speed:0.8,reward:25,color:"#EC4899"},
  {name:"StackOverflow",hp:15,speed:0.6,reward:35,color:"#8B5CF6"},
  {name:"ConcurrentModification",hp:12,speed:1.2,reward:30,color:C.gold},
  {name:"NumberFormatException",hp:5,speed:2,reward:10,color:C.secondary},
];

const GRID_W=12, GRID_H=8, CELL_S=50;
// Path: left to right with turns
const PATH=[];
for(let x=0;x<3;x++)PATH.push({x,y:3});
for(let y=3;y>=1;y--)PATH.push({x:3,y});
for(let x=3;x<7;x++)PATH.push({x,y:1});
for(let y=1;y<=5;y++)PATH.push({x:7,y});
for(let x=7;x>=4;x--)PATH.push({x,y:5});
for(let y=5;y<=7;y--)PATH.push({x:4,y});
for(let x=4;x<GRID_W;x++)PATH.push({x,y:7});

export default function GameTowerDefense(){
  const [towers,setTowers]=useState([]);
  const [bugs,setBugs]=useState([]);
  const [money,setMoney]=useState(200);
  const [lives,setLives]=useState(10);
  const [wave,setWave]=useState(0);
  const [selectedTower,setSelectedTower]=useState(null);
  const [gameState,setGameState]=useState("menu"); // menu, playing, between, won, lost
  const [waveTimer,setWaveTimer]=useState(0);
  const [totalKills,setTotalKills]=useState(0);
  const tickRef=useRef(null);
  const bugsRef=useRef(bugs);
  const towersRef=useRef(towers);
  const livesRef=useRef(lives);

  useEffect(()=>{bugsRef.current=bugs;},[bugs]);
  useEffect(()=>{towersRef.current=towers;},[towers]);
  useEffect(()=>{livesRef.current=lives;},[lives]);

  const isPath=(x,y)=>PATH.some(p=>p.x===x&&p.y===y);

  const placeTower=(x,y)=>{
    if(!selectedTower||isPath(x,y)||towers.some(t=>t.x===x&&t.y===y))return;
    if(money<selectedTower.cost)return;
    setTowers(t=>[...t,{...selectedTower,x,y,id:Date.now()}]);
    setMoney(m=>m-selectedTower.cost);
    setSelectedTower(null);
  };

  const spawnWave=useCallback(()=>{
    const w=wave+1; setWave(w);
    const count=3+w*2;
    const newBugs=[];
    for(let i=0;i<count;i++){
      const type=BUG_TYPES[Math.floor(Math.random()*Math.min(w+1,BUG_TYPES.length))];
      newBugs.push({
        id:Date.now()+i, ...type, maxHp:type.hp+w*2, currentHp:type.hp+w*2,
        pathIdx:0, progress:0, delay:i*15, alive:true,
      });
    }
    setBugs(b=>[...b,...newBugs]);
    setGameState("playing");
  },[wave]);

  // Game tick
  useEffect(()=>{
    if(gameState!=="playing")return;
    const tick=setInterval(()=>{
      setBugs(prev=>{
        let updated=prev.map(bug=>{
          if(!bug.alive)return bug;
          if(bug.delay>0)return {...bug,delay:bug.delay-1};
          let newProg=bug.progress+bug.speed*0.05;
          let newIdx=bug.pathIdx;
          while(newProg>=1&&newIdx<PATH.length-1){newProg-=1;newIdx++;}
          if(newIdx>=PATH.length-1){
            setLives(l=>{const nl=l-1;if(nl<=0)setGameState("lost");return nl;});
            return {...bug,alive:false};
          }
          return {...bug,pathIdx:newIdx,progress:newProg};
        });

        // Tower attacks
        towersRef.current.forEach(tower=>{
          const target=updated.find(bug=>{
            if(!bug.alive||bug.delay>0)return false;
            const bp=PATH[bug.pathIdx];
            if(!bp)return false;
            const dx=tower.x-bp.x, dy=tower.y-bp.y;
            return Math.sqrt(dx*dx+dy*dy)<=tower.range;
          });
          if(target){
            target.currentHp-=tower.damage;
            if(target.currentHp<=0){
              target.alive=false;
              setMoney(m=>m+target.reward);
              setTotalKills(k=>k+1);
            }
          }
        });

        // Check wave complete
        const aliveCount=updated.filter(b=>b.alive).length;
        const pendingCount=updated.filter(b=>b.delay>0).length;
        if(aliveCount===0&&pendingCount===0){
          if(wave>=8){setGameState("won");}
          else{setGameState("between");setWaveTimer(5);}
        }
        return updated.filter(b=>b.alive||b.delay>0);
      });
    },50);
    return ()=>clearInterval(tick);
  },[gameState,wave]);

  // Between waves timer
  useEffect(()=>{
    if(gameState!=="between")return;
    if(waveTimer<=0){spawnWave();return;}
    const t=setTimeout(()=>setWaveTimer(v=>v-1),1000);
    return ()=>clearTimeout(t);
  },[gameState,waveTimer,spawnWave]);

  const startGame=()=>{setGameState("between");setWaveTimer(3);};

  const renderGrid=()=>{
    const cells=[];
    for(let y=0;y<GRID_H;y++)for(let x=0;x<GRID_W;x++){
      const onPath=isPath(x,y);
      const hasTower=towers.some(t=>t.x===x&&t.y===y);
      const tower=towers.find(t=>t.x===x&&t.y===y);
      cells.push(
        <div key={x+"-"+y} onClick={()=>!onPath&&!hasTower&&placeTower(x,y)} style={{
          position:"absolute",left:x*CELL_S,top:y*CELL_S,width:CELL_S-1,height:CELL_S-1,
          background:onPath?"#1a2332":hasTower?tower.color+"20":selectedTower?"rgba(50,224,196,0.05)":"transparent",
          border:onPath?"1px solid #253345":"1px solid "+C.border+"40",
          borderRadius:3, cursor:onPath||hasTower?"default":"pointer",
          display:"flex",alignItems:"center",justifyContent:"center",
        }}>
          {hasTower&&<div style={{width:CELL_S*0.6,height:CELL_S*0.6,borderRadius:"50%",background:tower.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:C.bg,fontWeight:700}}>{tower.name.slice(0,2).toUpperCase()}</div>}
          {onPath&&x===0&&y===3&&<div style={{fontSize:8,color:C.danger}}>IN</div>}
        </div>
      );
    }
    return cells;
  };

  const renderBugs=()=>{
    return bugs.filter(b=>b.alive&&b.delay<=0).map(bug=>{
      const p=PATH[bug.pathIdx];
      const next=PATH[Math.min(bug.pathIdx+1,PATH.length-1)];
      if(!p)return null;
      const x=p.x+(next.x-p.x)*bug.progress;
      const y=p.y+(next.y-p.y)*bug.progress;
      const hpPct=bug.currentHp/bug.maxHp;
      return(
        <div key={bug.id} style={{position:"absolute",left:x*CELL_S+CELL_S*0.15,top:y*CELL_S+CELL_S*0.15,width:CELL_S*0.7,height:CELL_S*0.7,borderRadius:"50%",background:bug.color,display:"flex",alignItems:"center",justifyContent:"center",transition:"left 0.05s,top 0.05s",zIndex:10}}>
          <div style={{fontSize:7,color:C.bg,fontWeight:700,textAlign:"center",lineHeight:1}}>{bug.name.slice(0,4)}</div>
          <div style={{position:"absolute",top:-4,left:0,width:"100%",height:3,background:C.danger,borderRadius:2}}>
            <div style={{width:(hpPct*100)+"%",height:"100%",background:C.success,borderRadius:2,transition:"width .1s"}}/>
          </div>
        </div>
      );
    });
  };

  if(gameState==="menu"){
    return(
      <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',system-ui,sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
        <div style={{fontSize:11,letterSpacing:2,color:C.muted,marginBottom:6}}>CODEQUEST</div>
        <div style={{fontSize:28,fontWeight:700,color:C.danger,marginBottom:8}}>Tower Defense</div>
        <div style={{fontSize:14,color:C.accent,marginBottom:20}}>Les Objets contre les Bugs</div>
        <div style={{fontSize:12,color:C.muted,maxWidth:400,textAlign:"center",lineHeight:1.6,marginBottom:20}}>
          Placez des tours (try-catch, Validation, Null Check, Encapsulation, Unit Test) pour detruire les bugs Java qui envahissent votre code. 8 vagues de difficulte croissante !
        </div>
        <button onClick={startGame} style={{padding:"14px 40px",borderRadius:10,border:"none",background:C.danger,color:C.bg,cursor:"pointer",fontFamily:"inherit",fontSize:16,fontWeight:700}}>Commencer</button>
      </div>
    );
  }

  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',system-ui,sans-serif",display:"flex",flexDirection:"column",alignItems:"center",padding:12}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8,flexWrap:"wrap"}}>
        <span style={{fontSize:11,letterSpacing:2,color:C.muted}}>CODEQUEST</span>
        <span style={{color:C.border}}>|</span>
        <span style={{fontSize:13,fontWeight:700,color:C.danger}}>Tower Defense</span>
        <span style={{color:C.border}}>|</span>
        <span style={{fontSize:11,color:C.gold}}>Argent: {money}</span>
        <span style={{fontSize:11,color:C.danger}}>Vies: {lives}</span>
        <span style={{fontSize:11,color:C.accent}}>Vague: {wave}/8</span>
        <span style={{fontSize:11,color:C.success}}>Kills: {totalKills}</span>
      </div>

      <div style={{display:"flex",gap:12}}>
        <div style={{position:"relative",width:GRID_W*CELL_S,height:GRID_H*CELL_S,background:C.card,borderRadius:8,border:"1px solid "+C.border,overflow:"hidden"}}>
          {renderGrid()}
          {renderBugs()}
          {gameState==="between"&&<div style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",background:"rgba(10,15,26,0.8)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:20}}>
            <div style={{fontSize:18,fontWeight:700,color:C.accent}}>Vague {wave+1} dans {waveTimer}s</div>
            <div style={{fontSize:12,color:C.muted,marginTop:4}}>Placez vos tours !</div>
          </div>}
          {gameState==="won"&&<div style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",background:"rgba(10,15,26,0.9)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:20}}>
            <div style={{fontSize:24,fontWeight:700,color:C.success}}>Victoire !</div>
            <div style={{fontSize:13,color:C.muted,margin:"8px 0"}}>8 vagues repoussees ! {totalKills} bugs elimines</div>
          </div>}
          {gameState==="lost"&&<div style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",background:"rgba(10,15,26,0.9)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:20}}>
            <div style={{fontSize:24,fontWeight:700,color:C.danger}}>Defaite</div>
            <div style={{fontSize:13,color:C.muted,margin:"8px 0"}}>Les bugs ont envahi votre code !</div>
          </div>}
        </div>

        <div style={{width:160}}>
          <div style={{fontSize:10,fontWeight:600,color:C.muted,marginBottom:6}}>TOURS DISPONIBLES</div>
          {TOWER_TYPES.map(t=>(
            <button key={t.id} onClick={()=>setSelectedTower(selectedTower?.id===t.id?null:t)} style={{
              display:"block",width:"100%",padding:"6px 8px",marginBottom:4,borderRadius:6,
              border:"1px solid "+(selectedTower?.id===t.id?t.color:C.border),
              background:selectedTower?.id===t.id?t.color+"20":C.card,
              cursor:money>=t.cost?"pointer":"not-allowed",
              opacity:money>=t.cost?1:0.4,fontFamily:"inherit",textAlign:"left",
            }}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:10,fontWeight:700,color:t.color}}>{t.name}</span>
                <span style={{fontSize:9,color:C.gold}}>{t.cost}</span>
              </div>
              <div style={{fontSize:8,color:C.muted,marginTop:2}}>{t.desc}</div>
              <div style={{fontSize:8,color:C.muted}}>DMG:{t.damage} | Portee:{t.range}</div>
            </button>
          ))}
          <div style={{marginTop:10,fontSize:8,color:C.muted,lineHeight:1.5}}>
            1. Selectionnez une tour<br/>
            2. Cliquez sur une case vide<br/>
            3. Les tours attaquent automatiquement<br/>
            4. Tuez les bugs avant qu'ils traversent !
          </div>
        </div>
      </div>
    </div>
  );
}
