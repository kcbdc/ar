// 조팸스 GO - 공통 데이터/로직
const EPISODES=[
{id:1,icon:'🏭',item:'중소기업제품',kicker:'중소기업제품 편',quote:'이거 만든 사람이 누구게?'},{id:2,icon:'🔬',item:'기술개발제품',kicker:'기술개발제품 편',quote:'이 반짝이는 스티커의 정체'},{id:3,icon:'👩‍💼',item:'여성기업제품',kicker:'여성기업 편',quote:'사장님이 누구실까요 게임'},{id:4,icon:'💪',item:'장애인기업제품',kicker:'장애인기업 편',quote:'조다임, 방패를 내려놓다'},{id:5,icon:'✨',item:'중증장애인생산품',kicker:'중증장애인생산품 편',quote:'혜안으로도 못 본 정성'},{id:6,icon:'🤝',item:'사회적기업제품',kicker:'사회적기업 편',quote:'이익보다 중요한 게 있다고?'},{id:7,icon:'🔥',item:'자활기업제품',kicker:'자활기업 편',quote:'다시 일어서는 법'},{id:8,icon:'🧩',item:'협동조합제품',kicker:'협동조합 편',quote:'셋이 힘을 합치면'},{id:9,icon:'🌾',item:'마을기업제품',kicker:'마을기업 편',quote:'우리 동네 특산품 자랑'},{id:10,icon:'💡',item:'창업기업제품',kicker:'창업기업 편',quote:'이 아이디어 실화냐'},{id:11,icon:'🌱',item:'녹색제품',kicker:'녹색제품 편',quote:'지구가 보내는 신호'},{id:12,icon:'🏆',item:'신제품(NEP)인증',kicker:'신제품 인증 편',quote:'원정의 마지막 조각'}];
const RAW_COORDS=[[36.3773307,127.3705299],[36.3777765,127.3698604],[36.3775195,127.3696512],[36.3776728,127.3690397],[36.3780464,127.3693870],[36.3776755,127.3696418],[36.3778040,127.3700254],[36.3782651,127.3700388],[36.3782748,127.3706316],[36.3782737,127.3690880],[36.3782726,127.3683075],[36.3778223,127.3683155],[36.3774627,127.3685676],[36.3770211,127.3693428],[36.3764607,127.3698162],[36.3767663,127.3681733],[36.3761724,127.3692515],[36.3758139,127.3695077],[36.3757642,127.3690839],[36.3767436,127.3695023],[36.3768235,127.3705457],[36.377169,127.3708595],[36.3776322,127.3709561],[36.3782207,127.3709682],[36.3779832,127.3705538],[36.3778223,127.3701877],[36.3784961,127.3700522],[36.3785058,127.3690343],[36.3784021,127.3684335],[36.3786353,127.3684187],[36.3781527,127.3694902],[36.3780717,127.3697075],[36.3779443,127.3696472],[36.3779027,127.3696519],[36.3778903,127.3695808],[36.3779211,127.369607],[36.3779638,127.3695084],[36.3780162,127.3691128],[36.3771632,127.3695527],[36.3771178,127.3695473],[36.3771464,127.3695748]];
const CHECKPOINTS=RAW_COORDS.map((c,i)=>({idx:i,lat:c[0],lng:c[1],episodeId:(i%12)+1}));
const NOTIFY_RADIUS_M=45,COLLECT_RADIUS_M=20,FOV_HALF_DEG=38,DWELL_MS=2200,STORAGE_KEY='jopams_ar_progress_v3';
function getProgress(){try{const r=localStorage.getItem(STORAGE_KEY),a=r?JSON.parse(r):[];return Array.isArray(a)?a:[]}catch(e){return[]}}
function saveProgress(a){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(a))}catch(e){}}
function markCollected(id){const a=getProgress();if(!a.includes(id)){a.push(id);saveProgress(a)}return a}
function resetProgress(){saveProgress([])}function nextEpisodeId(){const d=getProgress();for(const e of EPISODES)if(!d.includes(e.id))return e.id;return 12}function getEpisode(id){return EPISODES.find(e=>e.id===Number(id))||EPISODES[0]}
function toRad(d){return d*Math.PI/180}function toDeg(r){return r*180/Math.PI}function distMeters(a,b,c,d){const R=6371000,x=toRad(c-a),y=toRad(d-b),v=Math.sin(x/2)**2+Math.cos(toRad(a))*Math.cos(toRad(c))*Math.sin(y/2)**2;return R*2*Math.atan2(Math.sqrt(v),Math.sqrt(1-v))}function bearingTo(a,b,c,d){const p1=toRad(a),p2=toRad(c),dl=toRad(d-b),y=Math.sin(dl)*Math.cos(p2),x=Math.cos(p1)*Math.sin(p2)-Math.sin(p1)*Math.cos(p2)*Math.cos(dl);return(toDeg(Math.atan2(y,x))+360)%360}function angleDiff(t,c){return((t-c+540)%360)-180}
function nearestUncollectedCheckpoint(lat,lng){const done=getProgress();let best=null,bd=Infinity;CHECKPOINTS.forEach(cp=>{if(done.includes(cp.episodeId))return;const d=distMeters(lat,lng,cp.lat,cp.lng);if(d<bd){bd=d;best=cp}});return best?{checkpoint:best,distance:bd}:null}
function extractHeading(e){if(typeof e.webkitCompassHeading==='number'&&!isNaN(e.webkitCompassHeading))return e.webkitCompassHeading;if(e.alpha!==null&&e.alpha!==undefined)return(360-e.alpha)%360;return null}
function vibrate(p){if(!getV4().haptics)return;if(navigator.vibrate)try{navigator.vibrate(p)}catch(e){}}
let _audioCtx=null;function playChime(kind){if(!getV4().sound)return;try{if(!_audioCtx)_audioCtx=new(window.AudioContext||window.webkitAudioContext)();const c=_audioCtx,n=c.currentTime,f=kind==='collect'?[660,880,1320]:[520,720];f.forEach((v,i)=>{const o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=v;g.gain.setValueAtTime(0,n+i*.09);g.gain.linearRampToValueAtTime(.14,n+i*.09+.02);g.gain.exponentialRampToValueAtTime(.001,n+i*.09+.27);o.connect(g).connect(c.destination);o.start(n+i*.09);o.stop(n+i*.09+.3)})}catch(e){}}
function showToast(msg,opts={}){let root=document.getElementById('toastRoot');if(!root){root=document.createElement('div');root.id='toastRoot';root.className='toast-root';document.body.appendChild(root)}const el=document.createElement('div');el.className='toast'+(opts.variant?' toast-'+opts.variant:'');el.innerHTML=msg;root.appendChild(el);requestAnimationFrame(()=>el.classList.add('show'));setTimeout(()=>{el.classList.remove('show');setTimeout(()=>el.remove(),300)},opts.duration||3000)}

// ===== 조팸스 GO v2 : 성장/일일미션/로컬 랭킹 =====
const GO_EVENT_KEY='jopams_go_events_v2', GO_PROFILE_KEY='jopams_go_profile_v2';
function getEvents(){try{return JSON.parse(localStorage.getItem(GO_EVENT_KEY)||'[]')}catch(e){return[]}}
function pushEvent(type,data={}){const a=getEvents();a.push({type,at:new Date().toISOString(),...data});try{localStorage.setItem(GO_EVENT_KEY,JSON.stringify(a.slice(-300)))}catch(e){}}
function getProfile(){try{return Object.assign({name:'원정대원',xp:0,streak:1,lastDay:'',dailyBonus:0,avatar:'daim'},JSON.parse(localStorage.getItem(GO_PROFILE_KEY)||'{}'))}catch(e){return{name:'원정대원',xp:0,streak:1,lastDay:'',dailyBonus:0,avatar:'daim'}}}
function saveProfile(p){try{localStorage.setItem(GO_PROFILE_KEY,JSON.stringify(p))}catch(e){}}
function todayKey(){const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
function syncDaily(){const p=getProfile(),t=todayKey();if(p.lastDay!==t){p.lastDay=t;p.dailyBonus=0;saveProfile(p)}return p}
function awardXP(amount,reason=''){const p=syncDaily();p.xp=(p.xp||0)+amount;saveProfile(p);pushEvent('xp',{amount,reason});return p}
function totalXP(){const p=syncDaily();return Math.max((getProgress().length*100),(p.xp||0))}
function playerLevel(){return Math.floor(totalXP()/300)+1}
function getDailyMissions(){const done=getProgress(),events=getEvents(),today=todayKey();const todayEvents=events.filter(e=>(e.at||'').slice(0,10)===today);return [
 {icon:'◎',title:'AR 탐험 1회',desc:'체크포인트에서 아이템을 1개 발견',now:todayEvents.filter(e=>e.type==='collect').length,goal:1,reward:80},
 {icon:'◇',title:'컬렉션 확인',desc:'수집한 제도를 한 번 복습',now:todayEvents.filter(e=>e.type==='learn').length,goal:1,reward:40},
 {icon:'✦',title:'원정 진척도',desc:'공공구매 아이템 3종 이상 수집',now:Math.min(done.length,3),goal:3,reward:120}
]}
function dailyCompletion(){const ms=getDailyMissions();return ms.filter(m=>m.now>=m.goal).length}
function localLeaderboard(){const me=Math.max(1200,totalXP()*37+getProgress().length*250);return [
{name:'윤수호',dept:'제지본부',score:4861800},{name:'유호연',dept:'제지본부',score:3847911},{name:'이현',dept:'화폐본부',score:3249200},{name:'김경아',dept:'제지본부',score:2565300},{name:'황지수',dept:'ID본부',score:1997600},{name:'나',dept:'조팸스 GO',score:me,isMe:true}
].sort((a,b)=>b.score-a.score)}
function claimDailyBonus(){const p=syncDaily();if(dailyCompletion()<3||p.dailyBonus)return false;p.dailyBonus=1;p.xp=(p.xp||0)+200;saveProfile(p);pushEvent('daily_bonus',{amount:200});return true}


// ===== 조팸스 GO v3 : 미니게임/업적/대항전/서버동기화 =====
const GO_V3_KEY='jopams_go_v3';
const ACHIEVEMENTS=[
 {id:'first',icon:'🌟',name:'첫 발견',desc:'첫 AR 아이템 발견',test:()=>getProgress().length>=1},
 {id:'collector3',icon:'🧭',name:'신입 원정대원',desc:'아이템 3종 수집',test:()=>getProgress().length>=3},
 {id:'collector6',icon:'💎',name:'공공구매 탐험가',desc:'아이템 6종 수집',test:()=>getProgress().length>=6},
 {id:'all12',icon:'🏆',name:'공공구매 마스터',desc:'12종 전체 수집',test:()=>getProgress().length>=12},
 {id:'learn3',icon:'📚',name:'지식 수집가',desc:'컬렉션 학습 3회',test:()=>getEvents().filter(e=>e.type==='learn').length>=3},
 {id:'mini3',icon:'🎯',name:'AR 플레이어',desc:'미니게임 3회 성공',test:()=>getEvents().filter(e=>e.type==='minigame_success').length>=3},
 {id:'daily',icon:'🔥',name:'오늘도 클리어',desc:'일일미션 올클리어',test:()=>getEvents().some(e=>e.type==='daily_bonus')}
];
function getV3(){try{return Object.assign({org:'본사',badges:[],serverUrl:'',lastBadgeCheck:0},JSON.parse(localStorage.getItem(GO_V3_KEY)||'{}'))}catch(e){return{org:'본사',badges:[],serverUrl:'',lastBadgeCheck:0}}}
function saveV3(v){try{localStorage.setItem(GO_V3_KEY,JSON.stringify(v))}catch(e){}}
function setOrganization(org){const v=getV3();v.org=org;saveV3(v);return v}
function checkAchievements(show=true){const v=getV3();const newly=[];ACHIEVEMENTS.forEach(a=>{if(!v.badges.includes(a.id)&&a.test()){v.badges.push(a.id);newly.push(a)}});v.lastBadgeCheck=Date.now();saveV3(v);if(show&&newly.length&&typeof showToast==='function'){newly.forEach((a,i)=>setTimeout(()=>{playChime('collect');showToast('배지 획득! <b>'+a.icon+' '+a.name+'</b>',{variant:'near',duration:3300})},i*500))}return newly}
function earnedAchievements(){const ids=getV3().badges;return ACHIEVEMENTS.map(a=>({...a,earned:ids.includes(a.id)}))}
function missionScore(){return totalXP()*37+getProgress().length*250+getEvents().filter(e=>e.type==='minigame_success').length*180}
function organizationLeaderboard(){const mine=getV3().org||'본사';const base=[{name:'본사',score:12750},{name:'화폐본부',score:11920},{name:'제지본부',score:10840},{name:'ID본부',score:10130},{name:'기술연구원',score:9460}];const me=base.find(x=>x.name===mine);if(me)me.score+=Math.round(missionScore()/40);return base.sort((a,b)=>b.score-a.score)}
function serverConfig(){return getV3().serverUrl||''}
function setServerUrl(url){const v=getV3();v.serverUrl=(url||'').trim().replace(/\/$/,'');saveV3(v)}
async function syncScoreToServer(){const base=serverConfig();if(!base)return {ok:false,reason:'offline'};const p=getProfile(),v=getV3();try{const r=await fetch(base+'/api/score',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:p.name||'원정대원',org:v.org||'본사',score:missionScore(),xp:totalXP(),collected:getProgress().length})});if(!r.ok)throw new Error('HTTP '+r.status);return {ok:true,data:await r.json()}}catch(e){return {ok:false,reason:String(e)}}}
async function fetchServerLeaderboard(){const base=serverConfig();if(!base)return null;try{const r=await fetch(base+'/api/leaderboard',{cache:'no-store'});if(!r.ok)throw new Error();const j=await r.json();return Array.isArray(j)?j:(j.items||null)}catch(e){return null}}
function miniGameForCheckpoint(cp){return ['speed','shield','quiz'][cp.idx%3]}
function miniGameCharacter(cp){return ['sunsik','daim','hoonmin'][cp.idx%3]}
const QUIZ_BANK=[
 {q:'중소기업제품 구매 실적은 공공구매의 대표 관리 항목이다.',a:true},
 {q:'여성기업제품은 대표자가 여성이라는 사실만으로 언제나 실적 인정된다.',a:false},
 {q:'공공구매 제도에는 장애인기업제품 관련 제도가 포함된다.',a:true},
 {q:'녹색제품 구매는 친환경 소비 촉진과 관련이 있다.',a:true},
 {q:'창업기업제품은 공공구매와 전혀 관계없는 제도다.',a:false}
];


// ===== 조팸스 GO v4 : 출시형 UX / 시즌 / 프로필 / PWA / 설정 =====
const GO_V4_KEY='jopams_go_v4';
const SEASON_TIERS=[
 {tier:1,xp:0,icon:'🎟️',name:'원정대 입장권',reward:'START'},
 {tier:2,xp:300,icon:'🪙',name:'GO 코인 100',reward:'+100 XP'},
 {tier:3,xp:600,icon:'📦',name:'블루 보급상자',reward:'+150 XP'},
 {tier:4,xp:900,icon:'⚡',name:'순식 배지 프레임',reward:'+180 XP'},
 {tier:5,xp:1200,icon:'🛡️',name:'다임 배지 프레임',reward:'+200 XP'},
 {tier:6,xp:1500,icon:'🧠',name:'훈민 배지 프레임',reward:'+220 XP'},
 {tier:7,xp:1800,icon:'💎',name:'프리미엄 보급상자',reward:'+250 XP'},
 {tier:8,xp:2100,icon:'🏆',name:'SEASON 01 마스터',reward:'+300 XP'}
];
function getV4(){try{return Object.assign({onboarded:false,sound:true,haptics:true,reducedMotion:false,seasonClaims:[],coins:0,lastChest:'',installDismissed:false},JSON.parse(localStorage.getItem(GO_V4_KEY)||'{}'))}catch(e){return{onboarded:false,sound:true,haptics:true,reducedMotion:false,seasonClaims:[],coins:0,lastChest:'',installDismissed:false}}}
function saveV4(v){try{localStorage.setItem(GO_V4_KEY,JSON.stringify(v))}catch(e){}}
function setPref(key,value){const v=getV4();v[key]=value;saveV4(v);document.documentElement.classList.toggle('reduced-motion',!!v.reducedMotion);return v}
function updatePlayer({name,org,avatar}={}){const p=getProfile();if(typeof name==='string'&&name.trim())p.name=name.trim().slice(0,14);if(avatar)p.avatar=avatar;saveProfile(p);if(org)setOrganization(org);return p}
function avatarPath(key){return 'assets/img/'+({daim:'daim.png',sunsik:'sunsik.png',hoonmin:'hoonmin.png'}[key]||'daim.png')}
function seasonState(){const xp=totalXP(),v=getV4();return {xp,level:playerLevel(),claims:v.seasonClaims||[],tiers:SEASON_TIERS.map(t=>({...t,unlocked:xp>=t.xp,claimed:(v.seasonClaims||[]).includes(t.tier)}))}}
function claimSeasonTier(tier){const state=seasonState(),t=state.tiers.find(x=>x.tier===Number(tier));if(!t||!t.unlocked||t.claimed)return false;const v=getV4();v.seasonClaims=[...(v.seasonClaims||[]),t.tier];const bonus={2:100,3:150,4:180,5:200,6:220,7:250,8:300}[t.tier]||0;if(t.tier===2)v.coins=(v.coins||0)+100;saveV4(v);if(bonus)awardXP(bonus,'시즌패스 보상');pushEvent('season_claim',{tier:t.tier,bonus});return true}
function availableSeasonRewards(){return seasonState().tiers.filter(t=>t.unlocked&&!t.claimed&&t.tier>1).length}
function chestAvailable(){const v=getV4();return v.lastChest!==todayKey()&&dailyCompletion()>=2}
function claimDailyChest(){if(!chestAvailable())return false;const v=getV4();v.lastChest=todayKey();v.coins=(v.coins||0)+50;saveV4(v);awardXP(80,'일일 보급상자');pushEvent('daily_chest',{xp:80,coins:50});return true}
function markOnboarded(){const v=getV4();v.onboarded=true;saveV4(v)}
function resetOnboarding(){const v=getV4();v.onboarded=false;saveV4(v)}
function privacySummary(){return {camera:'영상 저장 안 함',location:'실시간 좌표 서버 전송 안 함',sensor:'방향값 기기 내 처리',ranking:'닉네임·소속·점수만 선택 전송'}}
async function testServerConnection(url){const base=(url||serverConfig()).trim().replace(/\/$/,'');if(!base)return {ok:false,message:'서버 URL이 비어 있습니다.'};try{const r=await fetch(base+'/api/leaderboard',{cache:'no-store'});if(!r.ok)return {ok:false,message:'HTTP '+r.status};return {ok:true,message:'랭킹 서버와 정상 연결되었습니다.'}}catch(e){return {ok:false,message:'연결할 수 없습니다. URL/CORS/배포 상태를 확인하세요.'}}}
function applyRuntimePrefs(){const v=getV4();document.documentElement.classList.toggle('reduced-motion',!!v.reducedMotion)}
applyRuntimePrefs();


// ===== 조팸스 GO v5 : 상용 체감 품질 / 사운드스케이프 / 설치 UX =====
let _ambientNodes=null;
function ensureAudio(){try{if(!_audioCtx)_audioCtx=new(window.AudioContext||window.webkitAudioContext)();if(_audioCtx.state==='suspended')_audioCtx.resume();return _audioCtx}catch(e){return null}}
function playSfx(kind='tap'){
  if(!getV4().sound)return;
  const c=ensureAudio(); if(!c)return; const n=c.currentTime;
  const packs={tap:[[420,.035,.07]],near:[[520,.06,.12],[760,.045,.16]],spawn:[[250,.035,.08],[520,.055,.18],[1040,.035,.28]],success:[[660,.06,.12],[880,.07,.18],[1320,.055,.30]],chest:[[330,.055,.10],[495,.06,.18],[740,.065,.26],[990,.05,.38]],error:[[180,.04,.12],[140,.035,.2]]};
  (packs[kind]||packs.tap).forEach(([f,gain,dur],i)=>{const o=c.createOscillator(),g=c.createGain();o.type=kind==='error'?'sawtooth':'sine';o.frequency.value=f;g.gain.setValueAtTime(.001,n+i*.055);g.gain.exponentialRampToValueAtTime(gain,n+i*.055+.012);g.gain.exponentialRampToValueAtTime(.001,n+i*.055+dur);o.connect(g).connect(c.destination);o.start(n+i*.055);o.stop(n+i*.055+dur+.03)});
}
function startScannerAmbience(){if(!getV4().sound||_ambientNodes)return;const c=ensureAudio();if(!c)return;try{const o=c.createOscillator(),g=c.createGain(),lfo=c.createOscillator(),lg=c.createGain();o.type='sine';o.frequency.value=92;g.gain.value=.006;lfo.frequency.value=.22;lg.gain.value=.004;lfo.connect(lg).connect(g.gain);o.connect(g).connect(c.destination);o.start();lfo.start();_ambientNodes={o,g,lfo,lg}}catch(e){}}
function stopScannerAmbience(){if(!_ambientNodes)return;try{_ambientNodes.o.stop();_ambientNodes.lfo.stop()}catch(e){} _ambientNodes=null}
function setSoundEnabled(v){setPref('sound',!!v);if(!v)stopScannerAmbience();return getV4()}
function installState(){return {standalone:window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches,ios:/iphone|ipad|ipod/i.test(navigator.userAgent)}}
function registerPWA(){if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}))}

const GO_KAKAO_KEY='jopams_go_kakao_js_key_v1';
function kakaoMapKey(){try{return(localStorage.getItem(GO_KAKAO_KEY)||'').trim()}catch(e){return''}}
function setKakaoMapKey(v){try{const x=(v||'').trim();if(x)localStorage.setItem(GO_KAKAO_KEY,x);else localStorage.removeItem(GO_KAKAO_KEY);return x}catch(e){return''}}
function kakaoMapLink(lat,lng,label='조팸스 GO 체크포인트'){return 'https://map.kakao.com/link/map/'+encodeURIComponent(label)+','+Number(lat).toFixed(6)+','+Number(lng).toFixed(6)}
function avatarMeta(key){const k=['hoonmin','daim','sunsik'].includes(key)?key:'daim';return {key:k,path:avatarPath(k),name:k==='hoonmin'?'훈민':k==='sunsik'?'순식':'다임'}}
function syncAvatarUI(root=document){const p=getProfile(),a=avatarMeta(p.avatar);root.querySelectorAll('[data-player-avatar]').forEach(img=>{if(img.getAttribute('src')!==a.path)img.setAttribute('src',a.path);img.setAttribute('alt',a.name)});root.querySelectorAll('[data-crew-avatar]').forEach(el=>el.classList.toggle('active',el.dataset.crewAvatar===a.key));root.querySelectorAll('[data-player-character-name]').forEach(el=>el.textContent=a.name);return a}
window.addEventListener('pageshow',()=>syncAvatarUI());window.addEventListener('storage',e=>{if(e.key===GO_PROFILE_KEY)syncAvatarUI()});
