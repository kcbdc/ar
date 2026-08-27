/* JOFAMS GO · AR Item Juggling cinematic */
(()=>{
  'use strict';
  const CHARACTERS={
    hoonmin:{name:'훈민',img:'assets/img/juggle-hoonmin.png',copy:'정확한 궤도로 품목을 연결합니다',pattern:'PRECISION CASCADE'},
    daim:{name:'다임',img:'assets/img/juggle-daim.png',copy:'리듬을 바꿔가며 경쾌하게 이어갑니다',pattern:'REVERSE POP'},
    sunsik:{name:'순식',img:'assets/img/juggle-sunsik.png',copy:'빠른 회전으로 신호를 놓치지 않습니다',pattern:'SPEED SHOWER'}
  };
  const ITEM_MOTION={1:'heavy',2:'float',3:'spin',4:'heavy',5:'float',6:'heavy',7:'spin',8:'float',9:'spin',10:'leaf',11:'medal',12:'spin'};
  let running=false,lastCharacter='';

  function chooseCharacter(){
    const ids=Object.keys(CHARACTERS).filter(id=>id!==lastCharacter);
    const id=ids[Math.floor(Math.random()*ids.length)]||'daim';
    lastCharacter=id;
    return id;
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
    document.getElementById('juggleCharacter').src=char.img;
    document.getElementById('juggleCharacter').alt=`조팸스 ${char.name} 캐릭터`;
    const shell=document.getElementById('juggleCharacterShell');
    shell.className=`juggle-character-shell ${charId}`;
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
    running=false;
  }

  window.startJugglingSequence=function(ep,checkpoint,revisit){
    if(running)return;
    const overlay=document.getElementById('juggleOverlay');
    if(!overlay||!ep||typeof window.startMiniGame!=='function'){
      if(typeof window.startMiniGame==='function')window.startMiniGame(ep,checkpoint,revisit);
      return;
    }
    running=true;
    /* Lock immediately so the AR render loop cannot start the same discovery twice. */
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
    }catch(_){}
    const charId=chooseCharacter();
    if(!render(ep,charId)){running=false;window.startMiniGame(ep,checkpoint,revisit);return;}
    overlay.classList.remove('exit');
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden','false');
    /* 5.0s performance + 0.45s cross-fade into the existing minigame. */
    window.setTimeout(()=>{
      if(!running)return;
      overlay.classList.add('exit');
      try{if(typeof playSfx==='function')playSfx('near');}catch(_){}
      window.setTimeout(()=>{
        cleanup();
        window.startMiniGame(ep,checkpoint,revisit);
      },460);
    },5000);
  };
})();
