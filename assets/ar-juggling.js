/* JOFAMS GO · AR Item Juggling · v6 fixed character pose / item-only motion */
(()=>{
  'use strict';

  const CHARACTERS={
    hoonmin:{name:'훈민',copy:'시선은 아이템을 따라가고, 손은 받을 준비를 합니다.',pattern:'PRECISION CASCADE',pose:'assets/pose/hoonmin-juggle-pose.png'},
    daim:{name:'다임',copy:'밝게 웃으며 공공구매 아이템을 올려다봅니다.',pattern:'REVERSE POP',pose:'assets/pose/daim-juggle-pose.png'},
    sunsik:{name:'순식',copy:'빠른 궤도의 아이템을 양손으로 받아냅니다.',pattern:'SPEED SHOWER',pose:'assets/pose/sunsik-juggle-pose.png'}
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
    const list=(typeof EPISODES!=='undefined'?EPISODES:window.EPISODES)||[];
    if(!Array.isArray(list)||!list.length)return [ep,ep,ep];
    const i=Math.max(0,list.findIndex(x=>Number(x.id)===Number(ep.id)));
    return [ep,list[(i+4)%list.length]||ep,list[(i+8)%list.length]||ep];
  }

  function mountFixedPose(charId){
    const shell=document.getElementById('juggleCharacterShell');
    const char=CHARACTERS[charId];
    if(!shell||!char)return;
    shell.className=`juggle-character-shell ${charId} fixed-juggle-pose`;
    shell.innerHTML=`
      <div class="fixed-pose-wrap" aria-hidden="true">
        <span class="ar-platform"><i></i><b></b><em></em></span>
        <img class="fixed-pose-character" src="${char.pose}" alt="" draggable="false">
        <span class="fixed-pose-shadow"></span>
      </div>`;
  }

  function mountOrbitFX(stage){
    let fx=stage.querySelector('.juggle-orbit-fx');
    if(!fx){
      fx=document.createElement('div');
      fx.className='juggle-orbit-fx';
      fx.setAttribute('aria-hidden','true');
      fx.innerHTML=`
        <span class="gold-orbit orbit-a"></span>
        <span class="gold-orbit orbit-b"></span>
        <span class="gold-orbit orbit-c"></span>
        <span class="orbit-spark s1"></span><span class="orbit-spark s2"></span>
        <span class="orbit-spark s3"></span><span class="orbit-spark s4"></span>
        <span class="orbit-spark s5"></span><span class="orbit-spark s6"></span>`;
      stage.appendChild(fx);
    }
    fx.className=`juggle-orbit-fx ${stage.classList.contains('daim')?'daim':stage.classList.contains('sunsik')?'sunsik':'hoonmin'}`;
  }

  function render(ep,charId){
    const overlay=document.getElementById('juggleOverlay');
    const stage=document.getElementById('juggleStage');
    const char=CHARACTERS[charId];
    if(!overlay||!stage||!char)return false;

    stage.className=`juggle-stage ${charId} item-only-juggling`;
    const title=document.getElementById('juggleTitle');
    const sub=document.getElementById('juggleSub');
    const caption=document.getElementById('juggleCaptionText');
    if(title)title.textContent=`${char.name}의 공공구매 저글링`;
    if(sub)sub.textContent=`${ep.item} 발견 · ${char.pattern}`;
    if(caption)caption.textContent=char.copy;

    mountFixedPose(charId);
    mountOrbitFX(stage);

    const eps=companionEpisodes(ep);
    document.querySelectorAll('.juggle-ball').forEach((ball,index)=>{
      const item=eps[index]||ep;
      ball.className=`juggle-ball b${index+1} ${ITEM_MOTION[Number(item.id)]||'spin'}`;
      const icon=ball.querySelector('.juggle-icon');
      if(icon)icon.innerHTML=iconMarkup(item);
      ball.setAttribute('aria-label',item.item||'공공구매 아이템');
      ball.title=item.item||'';
    });

    const p=overlay.querySelector('.juggle-progress>i');
    if(p){p.style.animation='none';void p.offsetWidth;p.style.animation='juggleProgress 5s linear forwards';}
    return true;
  }

  function cleanup(){
    const overlay=document.getElementById('juggleOverlay');
    if(overlay){
      overlay.classList.remove('show','exit');
      overlay.setAttribute('aria-hidden','true');
    }
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
    if(!render(ep,charId)){
      running=false;
      window.startMiniGame(ep,checkpoint,revisit);
      return;
    }

    overlay.classList.remove('exit');
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden','false');

    window.setTimeout(()=>{
      if(!running)return;
      overlay.classList.add('exit');
      try{if(typeof playSfx==='function')playSfx('near');}catch(_){ }
      window.setTimeout(()=>{
        cleanup();
        window.startMiniGame(ep,checkpoint,revisit);
      },460);
    },5000);
  };
})();
