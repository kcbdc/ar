/* JOPAMS GO v19 LIVE OPS — unified loop, mastery, rarity, growth, loot, ambient AR */
(function(){
  const SECTION='live';
  const defaults={
    version:3, coins:0, shards:0, openedChests:0, inviteCount:0, masterWins:0,
    lastDailyChest:'', lastWeeklyChest:'', learnedEpisodes:[],
    claimedDaily:[], claimedWeekly:[], claimedDailyMaster:[],
    characters:{hoonmin:{xp:0},daim:{xp:0},sunsik:{xp:0}},
    rareUnlocked:[],
    cosmetics:{frames:['default'],titles:['rookie'],stickers:['spark'],activeFrame:'default',activeTitle:'rookie',activeSticker:'spark'},
    history:[]
  };
  const clone=v=>JSON.parse(JSON.stringify(v));
  function merge(base,cur){const out=Object.assign(clone(base),cur||{});out.characters=Object.assign(clone(base.characters),cur?.characters||{});out.cosmetics=Object.assign(clone(base.cosmetics),cur?.cosmetics||{});return out}
  function load(){try{return merge(defaults,window.JopamsState?JopamsState.get(SECTION,defaults):JSON.parse(localStorage.getItem('jopams_go_live_v14')||'{}'))}catch(e){return clone(defaults)}}
  function save(v){try{if(window.JopamsState)JopamsState.set(SECTION,v);else localStorage.setItem('jopams_go_live_v14',JSON.stringify(v));return v}catch(e){return v}}
  function patch(fn){const v=load();fn(v);v.history=(v.history||[]).slice(-80);return save(v)}
  function weekKey(d=new Date()){const x=new Date(d);const day=(x.getDay()+6)%7;x.setHours(0,0,0,0);x.setDate(x.getDate()-day);return x.toISOString().slice(0,10)}
  function allEvents(){return typeof getEvents==='function'?getEvents():[]}function eventsToday(){const k=typeof todayKey==='function'?todayKey():new Date().toISOString().slice(0,10);return allEvents().filter(e=>(e.at||'').slice(0,10)===k)}function eventsWeek(){const k=weekKey();return allEvents().filter(e=>(e.at||'').slice(0,10)>=k)}function addCoins(n){const amount=Number(n)||0;if(typeof getV4==='function'&&typeof saveV4==='function'){const x=getV4();x.coins=(x.coins||0)+amount;saveV4(x)}patch(v=>v.coins=(v.coins||0)+amount);return amount}
  const DAILY=[
    {id:'d_explore',icon:'explore',title:'현장 신호 1회 포착',desc:'AR 탐험에서 제도를 발견',goal:1,reward:60,metric:()=>eventsToday().filter(e=>e.type==='collect').length},
    {id:'d_learn',icon:'book',title:'10초 지식 1회',desc:'획득 후 지식 보너스 확인',goal:1,reward:40,metric:()=>eventsToday().filter(e=>e.type==='microlearn').length},
    {id:'d_play',icon:'target',title:'미니게임 1회 성공',desc:'캐릭터 스킬로 포획 성공',goal:1,reward:60,metric:()=>eventsToday().filter(e=>e.type==='minigame_success').length}
  ];
  const WEEKLY=[
    {id:'w_explore',icon:'map',title:'이번 주 5회 탐험',desc:'AR 제도 포획 5회',goal:5,reward:250,metric:()=>eventsWeek().filter(e=>e.type==='minigame_success').length},
    {id:'w_learn',icon:'book',title:'제도 복습 4회',desc:'컬렉션에서 핵심 제도 복습',goal:4,reward:180,metric:()=>eventsWeek().filter(e=>e.type==='learn'||e.type==='microlearn').length},
    {id:'w_growth',icon:'growth',title:'캐릭터 성장 300 XP',desc:'원정대 성장 XP 누적',goal:300,reward:220,metric:()=>eventsWeek().filter(e=>e.type==='char_xp').reduce((s,e)=>s+(e.amount||0),0)}
  ];
  function quests(kind='daily'){const v=load(),items=kind==='weekly'?WEEKLY:DAILY,claimed=kind==='weekly'?v.claimedWeekly:v.claimedDaily;return items.map(q=>({...q,now:Math.min(q.goal,q.metric()),complete:q.metric()>=q.goal,claimed:claimed.includes((kind==='weekly'?weekKey():todayKey())+':'+q.id)}))}
  function dailyMasterReady(){const key=typeof todayKey==='function'?todayKey():new Date().toISOString().slice(0,10),v=load();return quests('daily').every(q=>q.complete)&&!(v.claimedDailyMaster||[]).includes(key)}
  function claimDailyMaster(){const key=typeof todayKey==='function'?todayKey():new Date().toISOString().slice(0,10);if(!dailyMasterReady())return false;patch(v=>{v.claimedDailyMaster=v.claimedDailyMaster||[];v.claimedDailyMaster.push(key);v.history.push({type:'daily_master',at:new Date().toISOString()})});if(typeof awardXP==='function')awardXP(200,'일일 올 클리어');if(typeof pushEvent==='function')pushEvent('daily_master',{amount:200});if(typeof syncRewardReceipt==='function')syncRewardReceipt('daily-master:'+key,'daily_master');return {xp:200}}
  function dailyMasterClaimed(){const key=typeof todayKey==='function'?todayKey():new Date().toISOString().slice(0,10);return (load().claimedDailyMaster||[]).includes(key)}
  function claimQuest(kind,id){const key=(kind==='weekly'?weekKey():todayKey())+':'+id;const list=quests(kind),q=list.find(x=>x.id===id);if(!q||!q.complete||q.claimed)return false;patch(v=>{const arr=kind==='weekly'?v.claimedWeekly:v.claimedDaily;arr.push(key);v.history.push({type:'quest',kind,id,at:new Date().toISOString()})}); addCoins(q.reward);if(typeof awardXP==='function')awardXP(Math.round(q.reward/2),kind+' 퀘스트');if(typeof syncRewardReceipt==='function')syncRewardReceipt('quest:'+key,'quest'); return q}
  const LOOT=[
    {id:'coins100',type:'coins',name:'GO 코인 100',icon:'coin',weight:34,value:100},
    {id:'xp150',type:'xp',name:'원정 XP 150',icon:'growth',weight:28,value:150},
    {id:'frame_cyan',type:'frame',name:'시안 원정대 프레임',icon:'frame',weight:14,value:'cyan'},
    {id:'title_scout',type:'title',name:'칭호 · 현장 스카우트',icon:'title',weight:10,value:'scout'},
    {id:'sticker_compass',type:'sticker',name:'나침반 스티커',icon:'sticker',weight:8,value:'compass'},
    {id:'rare_shard',type:'shard',name:'희귀 캐릭터 조각',icon:'rare',weight:6,value:1},
    {id:'frame_gold',type:'frame',name:'시즌 골드 프레임',icon:'frame',weight:4,value:'gold'},
    {id:'title_master',type:'title',name:'칭호 · 공공구매 마스터',icon:'title',weight:2,value:'master'},
    {id:'sticker_trophy',type:'sticker',name:'트로피 스티커',icon:'sticker',weight:3,value:'trophy'}
  ];
  function weightedLoot(){const v=load(),aurora=v.rareUnlocked.includes('aurora_daim')&&typeof getProfile==='function'&&getProfile().avatar==='daim';const pool=LOOT.map(x=>({...x,weight:x.type==='shard'&&aurora?x.weight*2:x.weight}));let r=Math.random()*pool.reduce((s,x)=>s+x.weight,0);return pool.find(x=>(r-=x.weight)<=0)||pool[0]}
  // v17: 확률형 보상 투명성 공개. 기본 가중치를 기준으로 각 아이템의 실제 확률(%)을 계산해 UI에서 보여준다.
  // (오로라 다임 보유 시 조각 확률이 상승하는 보정치는 별도 안내 문구로 처리)
  function lootOdds(){
    const total=LOOT.reduce((s,x)=>s+x.weight,0);
    return LOOT.map(x=>({id:x.id,name:x.name,icon:x.icon,pct:Math.round(x.weight/total*1000)/10}));
  }
  function grantLoot(item){patch(v=>{v.openedChests=(v.openedChests||0)+1;if(item.type==='shard')v.shards+=item.value;if(item.type==='frame'&&!v.cosmetics.frames.includes(item.value))v.cosmetics.frames.push(item.value);if(item.type==='title'&&!v.cosmetics.titles.includes(item.value))v.cosmetics.titles.push(item.value);if(item.type==='sticker'&&!v.cosmetics.stickers.includes(item.value))v.cosmetics.stickers.push(item.value);v.history.push({type:'loot',item:item.id,at:new Date().toISOString()})});if(item.type==='coins')addCoins(item.value);if(item.type==='xp'&&typeof awardXP==='function')awardXP(item.value,'랜덤 보급상자');syncRare();return item}
  function chestReady(kind='daily'){const v=load();if(kind==='weekly')return quests('weekly').filter(x=>x.complete).length>=2&&v.lastWeeklyChest!==weekKey();return quests('daily').filter(x=>x.complete).length>=2&&v.lastDailyChest!==todayKey()}
  function openChest(kind='daily'){if(!chestReady(kind))return false;const item=weightedLoot();patch(v=>{if(kind==='weekly')v.lastWeeklyChest=weekKey();else v.lastDailyChest=todayKey()});grantLoot(item); if(typeof pushEvent==='function')pushEvent('live_chest',{kind,item:item.id});if(typeof syncRewardReceipt==='function')syncRewardReceipt('chest:'+kind+':'+(kind==='weekly'?weekKey():todayKey()),'chest'); return item}
  const RARES=[
    {id:'aurora_daim',base:'daim',name:'오로라 다임',condition:'희귀 조각 3개',test:(v=load())=>v.shards>=3,perk:'보상 상자 희귀 확률 +10%'},
    {id:'sage_hoonmin',base:'hoonmin',name:'세이지 훈민',condition:'지식 보너스 6회',test:(v=load())=>v.learnedEpisodes.length>=6,perk:'학습 보너스 XP +30%'},
    {id:'shadow_sunsik',base:'sunsik',name:'섀도 순식',condition:'미니게임 10회 성공',test:()=>allEvents().filter(e=>e.type==='minigame_success').length>=10,perk:'포획 유지시간 -15%'}
  ];
  function syncRare(){const unlocked=[];patch(v=>{RARES.forEach(r=>{if(r.test(v)&&!v.rareUnlocked.includes(r.id)){v.rareUnlocked.push(r.id);unlocked.push(r)}})});return unlocked}
  function charState(key){const v=load(),xp=v.characters[key]?.xp||0,level=Math.min(20,Math.floor(xp/250)+1),inLevel=xp%250;return {xp,level,next:level>=20?0:250-inLevel,pct:level>=20?100:inLevel/250*100}}
  function skillPerks(key){const s=charState(key),lv=s.level;const common={level:lv};if(key==='hoonmin')return {...common,quizXpPct:20+Math.floor((lv-1)/2)*2,quizHint:lv>=5,learnXpPct:Math.min(50,Math.floor((lv-1)/3)*5)};if(key==='sunsik')return {...common,timingWidthPct:20+Math.floor((lv-1)/2)*2,dwellReductionPct:Math.min(25,Math.floor((lv-1)/3)*3)};return {...common,shieldGrace:1+(lv>=7?1:0),chargeSpeedPct:Math.min(24,Math.floor((lv-1)/3)*4)}}
  function perkSummary(key){const p=skillPerks(key);if(key==='hoonmin')return `퀴즈 XP +${p.quizXpPct}%${p.quizHint?' · 힌트 1회':''}`;if(key==='sunsik')return `타이밍 판정 +${p.timingWidthPct}% · 유지시간 -${p.dwellReductionPct}%`;return `실드 보호 ${p.shieldGrace}회 · 충전속도 +${p.chargeSpeedPct}%`}
  function addCharXP(key,amount,reason=''){patch(v=>{if(!v.characters[key])v.characters[key]={xp:0};v.characters[key].xp+=amount;v.history.push({type:'char_xp',key,amount,reason,at:new Date().toISOString()})}); if(typeof pushEvent==='function')pushEvent('char_xp',{avatar:key,amount,reason}); syncRare(); return charState(key)}
  function onCollect(epId){const key=typeof getProfile==='function'?(getProfile().avatar||'daim'):'daim';addCharXP(key,80,'AR 발견');syncRare()}
  function onMiniSuccess(){const key=typeof getProfile==='function'?(getProfile().avatar||'daim'):'daim';addCharXP(key,35,'미니게임 성공')}
  const FACTS={
    1:'중소기업제품 공공구매는 중소기업의 판로 확대와 성장 기반을 지원합니다.',2:'창업기업제품 구매는 업력 7년 이내 초기 창업기업이 공공시장 실적을 쌓는 기회를 제공합니다.',3:'기술개발제품은 NET·NEP·성능인증 등 기술혁신 성과가 공공시장에 진입하도록 돕는 제도입니다.',4:'장애인기업제품 구매는 장애인이 소유·경영하는 기업의 안정적 판로 확보를 지원합니다.',5:'중증장애인생산품 우선구매는 근로 여건이 취약한 중증장애인의 직업재활과 고용을 지원합니다.',6:'장애인표준사업장 제품 구매는 장애인 친화 시설과 정당한 임금을 갖춘 모범 사업장을 지원합니다.',7:'여성기업제품 제도는 여성기업의 공공시장 참여 기회를 확대합니다.',8:'사회적기업 제품 구매는 이윤보다 사회적 가치와 지역사회 문제 해결에 기여합니다.',9:'사회적협동조합 제품 구매는 영리를 목적으로 하지 않고 지역 주민의 복리 증진에 기여하는 조직을 지원합니다.',10:'녹색제품(친환경) 구매는 에너지·자원 소비를 줄이고 친환경 소비와 생산을 촉진합니다.',11:'보훈기업제품 구매는 국가와 사회를 위해 헌신한 상이유공자 등이 운영하는 기업을 지원합니다.',12:'시범구매제품 제도는 성능은 뛰어나지만 초기 조달 실적이 없어 사장되기 쉬운 국산 혁신제품을 지원합니다.'
  };
  function learningFact(id){return FACTS[id]||'획득한 제도의 핵심 포인트를 컬렉션에서 다시 확인해 보세요.'}
  function claimLearning(id){const v=load();if(v.learnedEpisodes.includes(Number(id)))return false;patch(x=>x.learnedEpisodes.push(Number(id)));let bonus=30;const avatar=(typeof getProfile==='function'?(getProfile().avatar||'daim'):'daim'),perk=skillPerks(avatar);if(avatar==='hoonmin')bonus=Math.round(bonus*(1+(perk.learnXpPct||0)/100));const rare=load().rareUnlocked.includes('sage_hoonmin')&&(avatar==='hoonmin');if(rare)bonus=Math.round(bonus*1.3);if(typeof awardXP==='function')awardXP(bonus,'10초 지식 보너스');if(typeof pushEvent==='function')pushEvent('microlearn',{episodeId:Number(id),amount:bonus});return bonus}
  function cosmetics(){return load().cosmetics}
  function setCosmetic(type,value){patch(v=>{const map={frame:'frames',title:'titles',sticker:'stickers'};const list=v.cosmetics[map[type]]||[];if(list.includes(value))v.cosmetics['active'+type[0].toUpperCase()+type.slice(1)]=value});return cosmetics()}
  const TITLE_NAMES={rookie:'신입 원정대원',scout:'현장 스카우트',master:'공공구매 마스터'};
  const FRAME_NAMES={default:'기본 프레임',cyan:'시안 원정대 프레임',gold:'시즌 골드 프레임'};
  const STICKER_NAMES={spark:'스파크',compass:'나침반',trophy:'트로피'};
  async function inviteFriend(){const url=location.origin+location.pathname.replace(/[^/]*$/,'');const data={title:'조팸스 GO 원정대 초대',text:'현실 공간에서 공공구매 제도를 찾아보는 AR 원정에 함께해요!',url};let ok=false;try{if(navigator.share){await navigator.share(data);ok=true}else{await navigator.clipboard.writeText(url);ok=true}}catch(e){}if(ok){patch(v=>v.inviteCount=(v.inviteCount||0)+1);if(typeof pushEvent==='function')pushEvent('friend_invite',{});}return ok}
  // v31: 날씨는 GPS 수신 좌표를 최우선으로 사용한다. GPS를 아직 받지 못했거나
  // 위치 권한/네트워크가 실패한 경우에만 대전광역시를 안전한 fallback으로 사용한다.
  // Open-Meteo는 API key 없이 위·경도 기반 현재 날씨/주야 정보를 제공한다.
  const WEATHER_BASE={name:'대전',lat:36.3504,lng:127.3845};
  const WEATHER_CACHE_KEY='jopams_weather_gps_v2';
  let activeWeatherPoint=null,lastWeatherRequestAt=0,weatherRequestPromise=null;
  function weatherKind(code){code=Number(code);if(code===0)return 'clear';if([1,2,3,45,48].includes(code))return 'cloud';if((code>=51&&code<=77)||(code>=80&&code<=82)||(code>=85&&code<=86)||(code>=95&&code<=99))return 'rain';return 'cloud'}
  function weatherDistance(a,b){if(!a||!b)return Infinity;const r=6371000,toRad=x=>x*Math.PI/180,dLat=toRad(b.lat-a.lat),dLng=toRad(b.lng-a.lng),x=Math.sin(dLat/2)**2+Math.cos(toRad(a.lat))*Math.cos(toRad(b.lat))*Math.sin(dLng/2)**2;return 2*r*Math.atan2(Math.sqrt(x),Math.sqrt(1-x))}
  function readWeatherCache(){try{return JSON.parse(localStorage.getItem(WEATHER_CACHE_KEY)||'null')}catch(e){return null}}
  function cachedEnvironment(point=null){const x=readWeatherCache();if(!x||!x.at||Date.now()-x.at>=2*60*60*1000||!x.env)return null;if(point&&x.point&&weatherDistance(point,x.point)>15000)return null;return x.env}
  function environment(){const cached=cachedEnvironment(activeWeatherPoint);if(cached)return cached;const h=new Date().getHours(),night=h<6||h>=19;return {period:night?'night':'day',weather:'clear',location:activeWeatherPoint?'현재 위치':WEATHER_BASE.name,temperature:null,source:activeWeatherPoint?'gps-fallback':'daejeon-fallback'}}
  function applyEnvironment(env){document.documentElement.dataset.period=env.period;document.documentElement.dataset.weather=env.weather;const weatherName={rain:'비',cloud:'구름',clear:'맑음'}[env.weather]||'맑음',locationName=env.location||'현재 위치';document.querySelectorAll('[data-env-label]').forEach(el=>el.textContent=`${locationName} · ${env.period==='night'?'야간':'주간'} · ${weatherName}`);if(document.body?.classList.contains('ar-body')){let layer=document.querySelector('.ambient-layer');if(!layer){layer=document.createElement('div');layer.className='ambient-layer';layer.innerHTML='<i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>';document.body.appendChild(layer)}}window.dispatchEvent(new CustomEvent('jopams:environment',{detail:env}))}
  async function fetchEnvironmentForPoint(point,locationName='현재 위치'){const url=`https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(point.lat)}&longitude=${encodeURIComponent(point.lng)}&current=weather_code,is_day,temperature_2m&timezone=auto`;const res=await fetch(url,{cache:'no-store'});if(!res.ok)throw new Error('weather '+res.status);const data=await res.json(),cur=data.current||{};return {period:Number(cur.is_day)===0?'night':'day',weather:weatherKind(cur.weather_code),location:locationName,temperature:Number.isFinite(Number(cur.temperature_2m))?Number(cur.temperature_2m):null,source:locationName==='현재 위치'?'open-meteo-gps':'open-meteo-fallback',lat:point.lat,lng:point.lng}}
  async function refreshEnvironment(force=false){const point=activeWeatherPoint||{lat:WEATHER_BASE.lat,lng:WEATHER_BASE.lng},locationName=activeWeatherPoint?'현재 위치':WEATHER_BASE.name,cached=cachedEnvironment(point);if(cached&&!force){applyEnvironment(cached);return cached}try{const env=await fetchEnvironmentForPoint(point,locationName);localStorage.setItem(WEATHER_CACHE_KEY,JSON.stringify({at:Date.now(),point,env}));applyEnvironment(env);return env}catch(e){const env=cached||environment();applyEnvironment(env);return env}}
  function refreshEnvironmentForLocation(lat,lng,accuracy=999,force=false){lat=Number(lat);lng=Number(lng);accuracy=Number(accuracy)||999;if(!Number.isFinite(lat)||!Number.isFinite(lng))return Promise.resolve(environment());const point={lat,lng};const moved=weatherDistance(activeWeatherPoint,point);activeWeatherPoint=point;const now=Date.now(),freshEnough=now-lastWeatherRequestAt<10*60*1000;if(!force&&moved<1000&&freshEnough)return Promise.resolve(environment());if(weatherRequestPromise)return weatherRequestPromise;lastWeatherRequestAt=now;weatherRequestPromise=(async()=>{const cached=cachedEnvironment(point);if(cached&&!force){applyEnvironment({...cached,location:'현재 위치'});return cached}try{const env=await fetchEnvironmentForPoint(point,'현재 위치');localStorage.setItem(WEATHER_CACHE_KEY,JSON.stringify({at:Date.now(),point,accuracy,env}));applyEnvironment(env);return env}catch(e){const nearCache=cachedEnvironment(point);if(nearCache){const env={...nearCache,location:'현재 위치',source:'gps-cache'};applyEnvironment(env);return env}try{const fallbackPoint={lat:WEATHER_BASE.lat,lng:WEATHER_BASE.lng},env=await fetchEnvironmentForPoint(fallbackPoint,WEATHER_BASE.name);applyEnvironment(env);return env}catch(_){const env=environment();applyEnvironment(env);return env}}})().finally(()=>weatherRequestPromise=null);return weatherRequestPromise}
  function initAmbient(){const env=environment();applyEnvironment(env);refreshEnvironment(false)}
  function cameraShake(power='soft'){if(getV4?.().reducedMotion)return;document.body.classList.remove('camera-shake','camera-shake-strong');void document.body.offsetWidth;document.body.classList.add(power==='strong'?'camera-shake-strong':'camera-shake');setTimeout(()=>document.body.classList.remove('camera-shake','camera-shake-strong'),500)}
  function impactHaptic(kind='capture'){if(typeof vibrate!=='function')return;const p=kind==='rare'?[20,30,60,30,110,35,160]:kind==='capture'?[25,25,55,30,120]:[20];vibrate(p)}

  const RARITY=[
    {key:'normal',name:'NORMAL',min:1},{key:'rare',name:'RARE',min:2},{key:'epic',name:'EPIC',min:4},{key:'legend',name:'LEGEND',min:7}
  ];
  function episodeVisits(id){return allEvents().filter(e=>(e.type==='collect'||e.type==='revisit_collect')&&Number(e.episodeId)===Number(id)).length}
  function episodeRarity(id){const visits=Math.max((typeof getProgress==='function'&&getProgress().includes(Number(id)))?1:0,episodeVisits(id));let tier=RARITY[0];RARITY.forEach(x=>{if(visits>=x.min)tier=x});return {...tier,visits}}
  function collectionMastery(){const done=typeof getProgress==='function'?getProgress().length:0;const learned=load().learnedEpisodes.length;const legends=Array.from({length:12},(_,i)=>episodeRarity(i+1)).filter(x=>x.key==='legend').length;return {done,learned,legends,unlocked:done>=12}}
  function skillMilestones(key){const s=charState(key),p=skillPerks(key);const levels=[1,5,10,15,20];return levels.map(l=>{let text='';if(key==='hoonmin')text=l===5?'퀴즈 힌트 해금':l===10?'오답 1개 제거':l===15?'지식 연속 보너스':l===20?'마스터 지식 +50%':`퀴즈 XP 강화`;else if(key==='daim')text=l===5?'실드 충전 가속':l===10?'실패 보호 2회':l===15?'콤보 보호':l===20?'완전 실드':`실드 안정화`;else text=l===5?'포획 판정 확대':l===10?'유지시간 단축':l===15?'Perfect 범위 확대':l===20?'초고속 포획':`타이밍 강화`;return {level:l,text,unlocked:s.level>=l}})}
  function masterComplete(correct,total){const score=Math.round(correct/Math.max(1,total)*100);patch(v=>{if(score>=80)v.masterWins=(v.masterWins||0)+1;v.history.push({type:'master_result',score,at:new Date().toISOString()})});if(typeof pushEvent==='function')pushEvent('master_result',{score});if(score>=80){addCoins(300);if(typeof awardXP==='function')awardXP(500,'MASTER MODE 완료')}return {score,passed:score>=80}}

  function stats(){const v=load();const coins=typeof getV4==='function'?(getV4().coins||0):(v.coins||0);return {coins,shards:v.shards,chests:v.openedChests,invites:v.inviteCount,rares:v.rareUnlocked.length,learned:v.learnedEpisodes.length,masterWins:v.masterWins||0}}
  syncRare();
  window.JopamsLive={load,save,weekKey,quests,claimQuest,dailyMasterReady,claimDailyMaster,dailyMasterClaimed,chestReady,openChest,lootOdds,RARES,syncRare,charState,skillPerks,perkSummary,skillMilestones,addCharXP,onCollect,onMiniSuccess,learningFact,claimLearning,cosmetics,setCosmetic,TITLE_NAMES,FRAME_NAMES,STICKER_NAMES,inviteFriend,WEATHER_BASE,environment,refreshEnvironment,refreshEnvironmentForLocation,initAmbient,cameraShake,impactHaptic,episodeRarity,collectionMastery,masterComplete,stats};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initAmbient);else initAmbient();
})();
