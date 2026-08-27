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
    shell.classList.add('is-kinetic');
    rigStartedAt=performance.now();

    const personality={
      hoonmin:{lean:2.0,bob:1.5,speed:1.06,shoulderPulse:2.0,elbowPulse:4.0},
      daim:{lean:3.8,bob:2.7,speed:1.18,shoulderPulse:4.0,elbowPulse:7.0},
      sunsik:{lean:4.4,bob:2.2,speed:1.56,shoulderPulse:5.5,elbowPulse:9.5}
    }[charId];

    function chooseBall(side, balls, sr){
      const mid=sr.left+sr.width/2;
      const pts=balls.map(b=>{const r=b.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2};});
      let same=pts.filter(p=>side==='left'?p.x<=mid:p.x>=mid);
      if(!same.length)same=pts;
      // hands should follow the lowest nearby item: catch/throw point.
      same.sort((a,b)=>b.y-a.y);
      return same[0]||{x:mid,y:sr.top+sr.height*.48};
    }

    function tick(t){
      if(!running||!shell.isConnected){stopKineticRig();return;}
      const balls=[...stage.querySelectorAll('.juggle-ball')];
      if(!balls.length){rigRaf=requestAnimationFrame(tick);return;}
      const sr=shell.getBoundingClientRect();
      const lt=chooseBall('left',balls,sr), rt=chooseBall('right',balls,sr);
      solveArm(left,lt.x,lt.y,'left',sr,personality,t);
      solveArm(right,rt.x,rt.y,'right',sr,personality,t);

      const br=balls.map(b=>b.getBoundingClientRect());
      const avg=br.reduce((s,r)=>s+r.left+r.width/2,0)/br.length;
      const offset=clamp((avg-(sr.left+sr.width/2))/(sr.width*.5),-1,1);
      const phase=(t-rigStartedAt)/1000;
      shell.style.setProperty('--body-lean',`${(offset*personality.lean).toFixed(2)}deg`);
      shell.style.setProperty('--body-bob',`${(Math.sin(phase*Math.PI*2*1.35)*personality.bob).toFixed(2)}px`);
      shell.style.setProperty('--body-breathe',`${(1+Math.sin(phase*Math.PI*2*.70)*.006).toFixed(4)}`);
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
