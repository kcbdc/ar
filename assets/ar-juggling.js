/* JOFAMS GO · AR Item Juggling · v4 true sprite-rig */
(()=>{
  'use strict';

  const CHARACTERS={
    hoonmin:{name:'훈민',copy:'정확한 궤도로 품목을 연결합니다',pattern:'PRECISION CASCADE'},
    daim:{name:'다임',copy:'리듬을 바꿔가며 경쾌하게 이어갑니다',pattern:'REVERSE POP'},
    sunsik:{name:'순식',copy:'빠른 회전으로 신호를 놓치지 않습니다',pattern:'SPEED SHOWER'}
  };
  const ITEM_MOTION={1:'heavy',2:'float',3:'spin',4:'heavy',5:'float',6:'heavy',7:'spin',8:'float',9:'spin',10:'leaf',11:'medal',12:'spin'};
  const RIG_ROOT='assets/rig/';
  let running=false,lastCharacter='',rigRaf=0,rigStartedAt=0;

  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  const rad=d=>d*Math.PI/180;
  const deg=r=>r*180/Math.PI;

  function rigMarkup(charId){
    const p=(part)=>`${RIG_ROOT}${charId}-${part}.png`;
    return `
      <div class="sprite-rig ${charId}" data-rig="${charId}">
        <img class="rig-body" src="${p('body')}" alt="" draggable="false">
        <div class="rig-arm rig-arm-left">
          <img class="rig-upper" src="${p('left_upper')}" alt="" draggable="false">
          <div class="rig-fore-joint">
            <img class="rig-fore" src="${p('left_fore')}" alt="" draggable="false">
            <img class="rig-hand" src="${p('left_hand')}" alt="" draggable="false">
            <b class="rig-catch-glow"></b>
          </div>
        </div>
        <div class="rig-arm rig-arm-right">
          <img class="rig-upper" src="${p('right_upper')}" alt="" draggable="false">
          <div class="rig-fore-joint">
            <img class="rig-fore" src="${p('right_fore')}" alt="" draggable="false">
            <img class="rig-hand" src="${p('right_hand')}" alt="" draggable="false">
            <b class="rig-catch-glow"></b>
          </div>
        </div>
      </div>`;
  }

  function mountRig(charId){
    const shell=document.getElementById('juggleCharacterShell');
    if(!shell)return null;
    shell.innerHTML=rigMarkup(charId);
    shell.className=`juggle-character-shell ${charId} true-sprite-rig`;
    return shell.querySelector('.sprite-rig');
  }

  function stopKineticRig(){
    if(rigRaf){cancelAnimationFrame(rigRaf);rigRaf=0;}
    const shell=document.getElementById('juggleCharacterShell');
    if(shell){
      shell.classList.remove('is-kinetic');
      shell.style.removeProperty('--body-lean');
      shell.style.removeProperty('--body-bob');
      shell.style.removeProperty('--body-breathe');
    }
  }

  function solveArm(root, targetX, targetY, side, shellRect, personality, t){
    if(!root)return;
    const sx=shellRect.width*(side==='left'?0.27:0.73);
    const sy=shellRect.height*0.56;
    let tx=targetX-shellRect.left, ty=targetY-shellRect.top;
    // Keep the hand in a believable juggling workspace.
    tx=clamp(tx,shellRect.width*.12,shellRect.width*.88);
    ty=clamp(ty,shellRect.height*.36,shellRect.height*.76);
    const dx=tx-sx, dy=ty-sy;
    const L1=shellRect.height*.145, L2=shellRect.height*.135;
    const d=clamp(Math.hypot(dx,dy),Math.abs(L1-L2)+1,L1+L2-1);
    const a=Math.acos(clamp((L1*L1+d*d-L2*L2)/(2*L1*d),-1,1));
    const base=Math.atan2(dy,dx);
    const elbowBend=Math.acos(clamp((L1*L1+L2*L2-d*d)/(2*L1*L2),-1,1));
    const mirror=side==='left'?1:-1;
    let shoulder=deg(base-mirror*a)+90;
    let elbow=mirror*(180-deg(elbowBend));

    // Character personality influences the throw without breaking IK tracking.
    const phase=(t-rigStartedAt)/1000;
    shoulder += Math.sin(phase*personality.speed*Math.PI*2+(side==='right'?Math.PI:0))*personality.shoulderPulse;
    elbow += Math.sin(phase*personality.speed*Math.PI*2+1.2+(side==='right'?Math.PI:0))*personality.elbowPulse;
    shoulder=clamp(shoulder,-58,58);
    elbow=clamp(elbow,-72,74);

    root.style.setProperty('--shoulder',`${shoulder.toFixed(2)}deg`);
    root.style.setProperty('--elbow',`${elbow.toFixed(2)}deg`);
    root.style.setProperty('--wrist',`${clamp(-elbow*.28,-18,18).toFixed(2)}deg`);
    const near=d < (L1+L2)*.74 && ty>shellRect.height*.43;
    root.classList.toggle('near-catch',near);
  }

  function startKineticRig(charId){
    stopKineticRig();
    const shell=document.getElementById('juggleCharacterShell');
    const stage=document.getElementById('juggleStage');
    if(!shell||!stage)return;
    const rig=shell.querySelector('.sprite-rig');
    const left=rig?.querySelector('.rig-arm-left');
    const right=rig?.querySelector('.rig-arm-right');
    if(!rig||!left||!right)return;
    shell.classList.add('is-kinetic','is-natural-motion');
    rigStartedAt=performance.now();

    const personality={
      hoonmin:{lean:1.6,bob:1.35,speed:1.00,shoulderPulse:1.1,elbowPulse:2.4,travel:5.5,step:1.75,follow:.16},
      daim:{lean:2.2,bob:1.65,speed:1.10,shoulderPulse:1.8,elbowPulse:3.2,travel:7.5,step:1.62,follow:.14},
      sunsik:{lean:2.8,bob:1.5,speed:1.34,shoulderPulse:2.3,elbowPulse:4.2,travel:9.0,step:2.15,follow:.18}
    }[charId];

    const state={
      lastT:rigStartedAt,
      bodyX:0,bodyY:0,bodyLean:0,bodyScale:1,
      left:{shoulder:0,elbow:0,wrist:0,target:null,ball:null},
      right:{shoulder:0,elbow:0,wrist:0,target:null,ball:null},
      ballPrev:new WeakMap()
    };

    const smooth=(a,b,k,dt)=>a+(b-a)*(1-Math.pow(1-k,Math.max(1,dt/16.67)));
    const angleSmooth=(a,b,k,dt)=>smooth(a,b,k,dt);

    function ballPoints(balls){
      return balls.map((b,i)=>{
        const r=b.getBoundingClientRect();
        const p={el:b,index:i,x:r.left+r.width/2,y:r.top+r.height/2,vx:0,vy:0};
        const old=state.ballPrev.get(b);
        if(old){const d=Math.max(8,performance.now()-old.t);p.vx=(p.x-old.x)*1000/d;p.vy=(p.y-old.y)*1000/d;}
        state.ballPrev.set(b,{x:p.x,y:p.y,t:performance.now()});
        return p;
      });
    }

    function chooseBall(side,pts,sr,handState){
      const mid=sr.left+sr.width/2;
      const handX=sr.left+sr.width*(side==='left'?.28:.72);
      const handY=sr.top+sr.height*.61;
      let candidates=pts.filter(p=>side==='left'?p.x<=mid+sr.width*.08:p.x>=mid-sr.width*.08);
      if(!candidates.length)candidates=pts;
      candidates.forEach(p=>{
        const sidePenalty=Math.abs(p.x-handX)*.34;
        const catchBand=Math.abs(p.y-(sr.top+sr.height*.57))*.72;
        const downward=p.vy>0?-Math.min(34,p.vy*.035):8;
        const continuity=handState.ball===p.el?-42:0;
        p._score=sidePenalty+catchBand+downward+continuity;
      });
      candidates.sort((a,b)=>a._score-b._score);
      const best=candidates[0];
      if(best)handState.ball=best.el;
      return best||{x:handX,y:handY,vx:0,vy:0};
    }

    function solveArmNatural(root, target, side, sr, handState, t,dt){
      const sx=sr.width*(side==='left'?.28:.72);
      const sy=sr.height*.55;
      let tx=target.x-sr.left, ty=target.y-sr.top;
      // Anticipate descending objects so hands meet rather than chase.
      tx += clamp(target.vx*.035,-12,12);
      ty += clamp(target.vy*.018,-8,12);
      tx=clamp(tx,sr.width*.14,sr.width*.86);
      ty=clamp(ty,sr.height*.39,sr.height*.73);
      if(!handState.target)handState.target={x:tx,y:ty};
      handState.target.x=smooth(handState.target.x,tx,personality.follow,dt);
      handState.target.y=smooth(handState.target.y,ty,personality.follow,dt);
      tx=handState.target.x;ty=handState.target.y;

      const dx=tx-sx,dy=ty-sy;
      const L1=sr.height*.145,L2=sr.height*.135;
      const d=clamp(Math.hypot(dx,dy),Math.abs(L1-L2)+1,L1+L2-1);
      const a=Math.acos(clamp((L1*L1+d*d-L2*L2)/(2*L1*d),-1,1));
      const base=Math.atan2(dy,dx);
      const elbowBend=Math.acos(clamp((L1*L1+L2*L2-d*d)/(2*L1*L2),-1,1));
      const mirror=side==='left'?1:-1;
      const phase=(t-rigStartedAt)/1000;
      let shoulder=deg(base-mirror*a)+90;
      let elbow=mirror*(180-deg(elbowBend));
      // tiny muscle rhythm; intentionally subtle to prevent marionette motion.
      shoulder+=Math.sin(phase*personality.speed*Math.PI*2+(side==='right'?Math.PI:0))*personality.shoulderPulse;
      elbow+=Math.sin(phase*personality.speed*Math.PI*2+1.05+(side==='right'?Math.PI:0))*personality.elbowPulse;
      shoulder=clamp(shoulder,-52,52);elbow=clamp(elbow,-68,70);
      const wrist=clamp(-elbow*.22+(target.vx*.018),-15,15);

      handState.shoulder=angleSmooth(handState.shoulder,shoulder,.20,dt);
      handState.elbow=angleSmooth(handState.elbow,elbow,.18,dt);
      handState.wrist=angleSmooth(handState.wrist,wrist,.16,dt);
      root.style.setProperty('--shoulder',`${handState.shoulder.toFixed(2)}deg`);
      root.style.setProperty('--elbow',`${handState.elbow.toFixed(2)}deg`);
      root.style.setProperty('--wrist',`${handState.wrist.toFixed(2)}deg`);
      const near=d<(L1+L2)*.76&&ty>sr.height*.48&&target.vy>-80;
      root.classList.toggle('near-catch',near);
      return {x:tx,y:ty,near};
    }

    function tick(t){
      if(!running||!shell.isConnected){stopKineticRig();return;}
      const dt=clamp(t-state.lastT,8,40);state.lastT=t;
      const balls=[...stage.querySelectorAll('.juggle-ball')];
      if(!balls.length){rigRaf=requestAnimationFrame(tick);return;}
      const sr=shell.getBoundingClientRect();
      const pts=ballPoints(balls);
      const lt=chooseBall('left',pts,sr,state.left),rt=chooseBall('right',pts,sr,state.right);
      const lhand=solveArmNatural(left,lt,'left',sr,state.left,t,dt);
      const rhand=solveArmNatural(right,rt,'right',sr,state.right,t,dt);

      const phase=(t-rigStartedAt)/1000;
      const handBias=((lhand.x+rhand.x)/2-sr.width*.5)/(sr.width*.5);
      const ballBias=(pts.reduce((s,p)=>s+p.x,0)/pts.length-(sr.left+sr.width*.5))/(sr.width*.5);
      const targetLean=clamp((handBias*.58+ballBias*.42)*personality.lean,-personality.lean,personality.lean);
      const targetX=clamp(ballBias*personality.travel,-personality.travel,personality.travel);
      const stepWave=Math.sin(phase*Math.PI*2*personality.step);
      const stepLift=(1-Math.abs(stepWave))*personality.bob;
      const targetY=-stepLift;
      const targetScale=1+Math.sin(phase*Math.PI*2*.58)*.0035+(Math.abs(stepWave)>.78?-.002:0);

      state.bodyLean=smooth(state.bodyLean,targetLean,.10,dt);
      state.bodyX=smooth(state.bodyX,targetX,.075,dt);
      state.bodyY=smooth(state.bodyY,targetY,.14,dt);
      state.bodyScale=smooth(state.bodyScale,targetScale,.08,dt);
      shell.style.setProperty('--body-lean',`${state.bodyLean.toFixed(2)}deg`);
      shell.style.setProperty('--body-x',`${state.bodyX.toFixed(2)}px`);
      shell.style.setProperty('--body-bob',`${state.bodyY.toFixed(2)}px`);
      shell.style.setProperty('--body-breathe',state.bodyScale.toFixed(4));
      shell.style.setProperty('--step-phase',`${((stepWave+1)/2).toFixed(3)}`);
      rigRaf=requestAnimationFrame(tick);
    }
    rigRaf=requestAnimationFrame(tick);
  }
  function chooseCharacter(){
    const ids=Object.keys(CHARACTERS).filter(id=>id!==lastCharacter);
    const id=ids[Math.floor(Math.random()*ids.length)]||'daim';
    lastCharacter=id; return id;
  }
  function iconMarkup(ep){
    try{return typeof publicPurchaseIcon==='function'?publicPurchaseIcon(ep.id,true):`<span class="emoji-fallback">${ep.icon||'◈'}</span>`}
    catch(_){return `<span class="emoji-fallback">${ep.icon||'◈'}</span>`}
  }
  function companionEpisodes(ep){
    if(!Array.isArray(window.EPISODES)&&typeof EPISODES==='undefined')return [ep,ep,ep];
    const list=(typeof EPISODES!=='undefined'?EPISODES:window.EPISODES)||[];
    const i=Math.max(0,list.findIndex(x=>Number(x.id)===Number(ep.id)));
    return [ep,list[(i+4)%list.length]||ep,list[(i+8)%list.length]||ep];
  }
  function render(ep,charId){
    const overlay=document.getElementById('juggleOverlay');
    const stage=document.getElementById('juggleStage');
    const char=CHARACTERS[charId];
    if(!overlay||!stage||!char)return false;
    stage.className=`juggle-stage ${charId}`;
    document.getElementById('juggleTitle').textContent=`${char.name}의 공공구매 저글링`;
    document.getElementById('juggleSub').textContent=`${ep.item} 발견 · ${char.pattern}`;
    mountRig(charId);
    document.getElementById('juggleCaptionText').textContent=char.copy;
    const eps=companionEpisodes(ep);
    document.querySelectorAll('.juggle-ball').forEach((ball,index)=>{
      const item=eps[index]||ep;
      ball.className=`juggle-ball b${index+1} ${ITEM_MOTION[Number(item.id)]||'spin'}`;
      ball.querySelector('.juggle-icon').innerHTML=iconMarkup(item);
      ball.setAttribute('aria-label',item.item||'공공구매 아이템');
      ball.title=item.item||'';
    });
    const p=overlay.querySelector('.juggle-progress>i');
    if(p){p.style.animation='none';void p.offsetWidth;p.style.animation='juggleProgress 5s linear forwards';}
    return true;
  }
  function cleanup(){
    const overlay=document.getElementById('juggleOverlay');
    if(!overlay)return;
    overlay.classList.remove('show','exit');
    overlay.setAttribute('aria-hidden','true');
    stopKineticRig(); running=false;
  }

  window.startJugglingSequence=function(ep,checkpoint,revisit){
    if(running)return;
    const overlay=document.getElementById('juggleOverlay');
    if(!overlay||!ep||typeof window.startMiniGame!=='function'){
      if(typeof window.startMiniGame==='function')window.startMiniGame(ep,checkpoint,revisit);
      return;
    }
    running=true;
    if(typeof collectingLock!=='undefined')collectingLock=true;
    try{
      if(typeof dwellStart!=='undefined')dwellStart=null;
      document.getElementById('dwellRing')?.classList.remove('show');
      document.getElementById('targetWrap')?.classList.remove('visible');
      document.getElementById('statusBanner')?.classList.remove('show');
      if(typeof setToolMode==='function')setToolMode('analyze','아이템 시그니처 분석');
      if(typeof fireToolPulse==='function')fireToolPulse(true);
      if(typeof vibrate==='function')vibrate([22,28,44]);
      if(typeof playSfx==='function')playSfx('spawn');
    }catch(_){ }
    const charId=chooseCharacter();
    if(!render(ep,charId)){running=false;window.startMiniGame(ep,checkpoint,revisit);return;}
    overlay.classList.remove('exit'); overlay.classList.add('show'); overlay.setAttribute('aria-hidden','false');
    requestAnimationFrame(()=>startKineticRig(charId));
    window.setTimeout(()=>{
      if(!running)return;
      overlay.classList.add('exit');
      try{if(typeof playSfx==='function')playSfx('near');}catch(_){ }
      window.setTimeout(()=>{cleanup();window.startMiniGame(ep,checkpoint,revisit);},460);
    },5000);
  };
})();
