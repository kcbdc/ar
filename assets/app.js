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
function vibrate(p){if(navigator.vibrate)try{navigator.vibrate(p)}catch(e){}}
let _audioCtx=null;function playChime(kind){try{if(!_audioCtx)_audioCtx=new(window.AudioContext||window.webkitAudioContext)();const c=_audioCtx,n=c.currentTime,f=kind==='collect'?[660,880,1320]:[520,720];f.forEach((v,i)=>{const o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=v;g.gain.setValueAtTime(0,n+i*.09);g.gain.linearRampToValueAtTime(.14,n+i*.09+.02);g.gain.exponentialRampToValueAtTime(.001,n+i*.09+.27);o.connect(g).connect(c.destination);o.start(n+i*.09);o.stop(n+i*.09+.3)})}catch(e){}}
function showToast(msg,opts={}){let root=document.getElementById('toastRoot');if(!root){root=document.createElement('div');root.id='toastRoot';root.className='toast-root';document.body.appendChild(root)}const el=document.createElement('div');el.className='toast'+(opts.variant?' toast-'+opts.variant:'');el.innerHTML=msg;root.appendChild(el);requestAnimationFrame(()=>el.classList.add('show'));setTimeout(()=>{el.classList.remove('show');setTimeout(()=>el.remove(),300)},opts.duration||3000)}

// ===== 조팸스 GO v2 : 성장/일일미션/로컬 랭킹 =====
const GO_EVENT_KEY='jopams_go_events_v2', GO_PROFILE_KEY='jopams_go_profile_v2';
function getEvents(){try{return JSON.parse(localStorage.getItem(GO_EVENT_KEY)||'[]')}catch(e){return[]}}
function pushEvent(type,data={}){const a=getEvents();a.push({type,at:new Date().toISOString(),...data});try{localStorage.setItem(GO_EVENT_KEY,JSON.stringify(a.slice(-300)))}catch(e){}}
function getProfile(){try{return Object.assign({name:'원정대원',xp:0,streak:1,lastDay:'',dailyBonus:0},JSON.parse(localStorage.getItem(GO_PROFILE_KEY)||'{}'))}catch(e){return{name:'원정대원',xp:0,streak:1,lastDay:'',dailyBonus:0}}}
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
