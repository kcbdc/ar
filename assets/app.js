// 조팸스 GO - 공통 데이터/로직
const EPISODES=[
{id:1,icon:'🏭',item:'중소기업제품',kicker:'중소기업제품 편',quote:'중소기업의 활력을 키우는 조달 판로'},{id:2,icon:'💡',item:'창업기업제품',kicker:'창업기업제품 편',quote:'혁신 기술로 도약하는 초기 창업기업'},{id:3,icon:'🔬',item:'기술개발제품',kicker:'기술개발제품 편',quote:'신기술(NET·NEP)이 시장에 안착하는 길'},{id:4,icon:'💪',item:'장애인기업제품',kicker:'장애인기업제품 편',quote:'장애인이 소유·경영하는 기업의 힘'},{id:5,icon:'✨',item:'중증장애인생산품',kicker:'중증장애인생산품 편',quote:'가장 취약한 일터를 지키는 구매'},{id:6,icon:'🏢',item:'장애인표준사업장',kicker:'장애인표준사업장 편',quote:'정당한 임금, 모범적인 일터'},{id:7,icon:'👩‍💼',item:'여성기업제품',kicker:'여성기업제품 편',quote:'사장님이 누구실까요 게임'},{id:8,icon:'🤝',item:'사회적기업제품',kicker:'사회적기업제품 편',quote:'이익보다 중요한 게 있다고?'},{id:9,icon:'🧩',item:'사회적협동조합',kicker:'사회적협동조합 편',quote:'영리보다 지역 상생을 택한 조직'},{id:10,icon:'🌱',item:'녹색제품(친환경)',kicker:'녹색제품 편',quote:'지구가 보내는 신호'},{id:11,icon:'🎖️',item:'보훈기업제품',kicker:'보훈기업제품 편',quote:'숭고한 헌신에 보답하는 구매'},{id:12,icon:'🧪',item:'시범구매제품',kicker:'시범구매제품 편',quote:'실적이 없어 사장되기 쉬운 국산 혁신'}];
const RAW_COORDS=[[36.3773307,127.3705299],[36.3777765,127.3698604],[36.3775195,127.3696512],[36.3776728,127.3690397],[36.3780464,127.3693870],[36.3776755,127.3696418],[36.3778040,127.3700254],[36.3782651,127.3700388],[36.3782748,127.3706316],[36.3782737,127.3690880],[36.3782726,127.3683075],[36.3778223,127.3683155],[36.3774627,127.3685676],[36.3770211,127.3693428],[36.3764607,127.3698162],[36.3767663,127.3681733],[36.3761724,127.3692515],[36.3758139,127.3695077],[36.3757642,127.3690839],[36.3767436,127.3695023],[36.3768235,127.3705457],[36.377169,127.3708595],[36.3776322,127.3709561],[36.3782207,127.3709682],[36.3779832,127.3705538],[36.3778223,127.3701877],[36.3784961,127.3700522],[36.3785058,127.3690343],[36.3784021,127.3684335],[36.3786353,127.3684187],[36.3781527,127.3694902],[36.3780717,127.3697075],[36.3779443,127.3696472],[36.3779027,127.3696519],[36.3778903,127.3695808],[36.3779211,127.369607],[36.3779638,127.3695084],[36.3780162,127.3691128],[36.3771632,127.3695527],[36.3771178,127.3695473],[36.3771464,127.3695748],[36.41518,127.413683],[36.415303,127.413151],[36.415262,127.414032],[36.415901,127.413589],[36.415203,127.413366],[36.415063,127.41409],[36.415331,127.413711],[36.415415,127.413174],[36.41567,127.413851],[36.415543,127.413223],[36.415585,127.413428],[36.415782,127.41347],[36.415765,127.41383],[36.415445,127.41366],[36.415438,127.413809],[36.415438,127.413432],[36.415623,127.413849],[36.415886,127.413365],[36.415988,127.413301],[36.415926,127.413656],[36.415831,127.413502],[36.415814,127.413336],[36.415739,127.413154],[36.26553,126.961667],[36.265605,126.961662],[36.265474,126.961694],[36.265541,126.9618],[36.265644,126.961738],[36.265651,126.96166],[36.265603,126.961929],[36.265487,126.961878],[36.26542,126.961921],[36.265393,126.961776],[36.265398,126.961693],[36.265387,126.961646],[36.26561,126.961909],[36.265503,126.961803],[36.265491,126.961972],[36.265424,126.96198],[36.26538,126.961972],[36.265725,126.961794],[36.265707,126.961661],[36.265766,126.961572],[36.265747,126.961529],[36.265799,126.961569],[36.265741,126.961572],[36.265559,126.96161],[35.830516,128.767321],[35.830722,128.76694],[35.831005,128.766914],[35.830458,128.766665],[35.830732,128.766254],[35.831006,128.766597],[35.831312,128.766891],[35.830846,128.766826],[35.830571,128.766919],[35.830692,128.767615],[35.830548,128.767396],[35.830509,128.767548],[35.830401,128.76724],[35.830325,128.766997],[35.830251,128.766801],[35.830835,128.76746],[35.830359,128.767961],[35.83051,128.768108],[35.830628,128.768043],[35.830471,128.767765],[35.830085,128.767442],[35.830203,128.766983],[35.831066,128.767786],[35.830561,128.76712],[35.830555,128.766824],[37.547124,126.931878],[37.547115,126.931926],[37.547104,126.931977],[37.547086,126.93202],[37.547134,126.93204],[37.547177,126.932069],[37.547217,126.932086],[37.547241,126.932052],[37.54726,126.932004],[37.547273,126.93196],[37.547253,126.931935],[37.547198,126.931912],[37.547187,126.931966],[37.547149,126.931956],[37.547205,126.932005],[36.481405,127.299337],[36.481396,127.299409],[36.481484,127.299388],[36.481485,127.299325],[36.481413,127.299223],[36.48132,127.299266],[36.481281,127.299348],[35.82992,128.767456],[35.82992,128.767205],[35.830034,128.767844],[35.830232,128.767805],[35.830258,128.767545],[35.830166,128.767374],[35.830094,128.767217],[35.830208,128.767022],[35.829997,128.767153],[35.829869,128.767229],[35.830031,128.767409],[35.829925,128.767508],[35.829856,128.767411],[36.264696,126.963778],[36.264784,126.963783],[36.264856,126.963798],[36.264951,126.96381],[36.265094,126.964059],[36.265293,126.963627],[36.265283,126.964384],[36.26496,126.964614],[36.265332,126.963315],[36.265458,126.96318],[36.265447,126.963687],[36.265463,126.964005],[36.265113,126.96372],[36.265198,126.964187],[36.264856,126.964165],[36.265438,126.964759],[36.265211,126.964731],[36.265134,126.964568],[36.265076,126.964258],[36.264915,126.964622],[35.829741,128.767821],[35.829621,128.767624],[35.829549,128.767467],[35.829578,128.767833],[35.82948,128.767937],[35.829274,128.767706],[35.829398,128.767792],[35.829413,128.767409],[35.829633,128.768106],[35.829471,128.7681],[35.829196,128.768093],[35.828619,128.767379],[35.828425,128.767104],[35.828462,128.767297],[35.828608,128.767217],[35.828602,128.767535],[35.82893,128.76849],[35.829147,128.768415],[35.828785,128.767642],[35.829864,128.768621],[35.829721,128.768779],[35.82951,128.768374],[35.829369,128.767993],[35.829195,128.768376],[35.828943,128.768424],[35.829243,128.767858],[35.829267,128.767501],[35.829543,128.767547],[35.829053,128.767099],[35.830298,128.768581],[35.829603,128.767723],[36.379065,127.368835]
/* 2026-08 추가 출현지점 */,[36.26450,126.96522],[36.26466,126.96381],[36.26368,126.96521],[36.26373,126.96394],[36.26411,126.96394],[36.26440,126.96396],[36.26442,126.96439],[36.26441,126.96486],[36.26408,126.96517],[36.37799,127.37053],[36.37630,127.36861],[36.37678,127.36809],[36.37637,127.36806],[36.37669,127.36913],[36.37717,127.36966],[36.37735,127.36979],[36.37731,127.36921],[36.37738,127.36885],[36.37722,127.36897],[36.37733,127.36941],[36.37753,127.36913],[36.37720,127.36933],[36.37726,127.36950],[36.37761,127.36872],[36.37754,127.36855],[36.37755,127.36814],[36.26407,126.96455],[36.26451,126.96321],[36.26459,126.96248],[36.26462,126.96173],[36.26465,126.96112],[36.26517,126.96227],[36.26545,126.96230],[36.26502,126.96152],[36.26504,126.96314],[36.26501,126.96498],[36.26549,126.96491],[35.83062,128.76747],[35.83088,128.76783],[35.83110,128.76748],[35.83043,128.76706],[35.83023,128.76667],[35.82897,128.76863],[35.82879,128.76774],[35.82838,128.76783],[35.82945,128.76803],[35.82937,128.76712],[35.83020,128.76815],[35.82803,128.76826],[35.82765,128.76923],[35.82794,128.77024],[35.82708,128.76950],[35.82842,128.76882],[35.82903,128.76656],[35.82751,128.76800],[35.82702,128.76863],[35.82861,128.76946],[35.82979,128.76885],[35.82982,128.76617],[35.83101,128.76857],[36.41516,127.41354],[36.41504,127.41397],[36.41517,127.41293],[36.41549,127.41292],[36.41583,127.41293],[36.41609,127.41299],[36.41607,127.41344],[36.41606,127.41379],[36.41605,127.41420],[36.41585,127.41376],[36.41584,127.41418],[36.41557,127.41420],[36.41530,127.41418],[36.41527,127.41374],[36.41527,127.41322],[36.41488,127.41380],[36.37881,127.36830],[36.37828,127.36824],[36.37677,127.37088],[36.37638,127.37046],[36.37578,127.36933],[36.37579,127.36807],[36.37591,127.36653]];
const CHECKPOINTS=RAW_COORDS.map((c,i)=>({idx:i,lat:c[0],lng:c[1],episodeId:(i%12)+1}));
const NOTIFY_RADIUS_M=55,COLLECT_RADIUS_M=22,FOV_HALF_DEG=45,DWELL_MS=2800,STORAGE_KEY='jopams_ar_progress_v3';
function getProgress(){try{const a=window.JopamsState?JopamsState.get('progress',[]):JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');return Array.isArray(a)?a:[]}catch(e){return[]}}
function saveProgress(a){try{if(window.JopamsState)JopamsState.set('progress',a);else localStorage.setItem(STORAGE_KEY,JSON.stringify(a));if(typeof scheduleServerGameStatePush==='function')scheduleServerGameStatePush('progress')}catch(e){}}
function markCollected(id){const a=getProgress();if(!a.includes(id)){a.push(id);saveProgress(a)}return a}
function resetProgress(){saveProgress([])}function nextEpisodeId(){const d=getProgress();for(const e of EPISODES)if(!d.includes(e.id))return e.id;return 12}function getEpisode(id){return EPISODES.find(e=>e.id===Number(id))||EPISODES[0]}
function toRad(d){return d*Math.PI/180}function toDeg(r){return r*180/Math.PI}function distMeters(a,b,c,d){const R=6371000,x=toRad(c-a),y=toRad(d-b),v=Math.sin(x/2)**2+Math.cos(toRad(a))*Math.cos(toRad(c))*Math.sin(y/2)**2;return R*2*Math.atan2(Math.sqrt(v),Math.sqrt(1-v))}function bearingTo(a,b,c,d){const p1=toRad(a),p2=toRad(c),dl=toRad(d-b),y=Math.sin(dl)*Math.cos(p2),x=Math.cos(p1)*Math.sin(p2)-Math.sin(p1)*Math.cos(p2)*Math.cos(dl);return(toDeg(Math.atan2(y,x))+360)%360}function angleDiff(t,c){return((t-c+540)%360)-180}
// v37: 같은 물리적 지점에서 살짝 움직였다가 돌아오는 것만으로 아이템을 반복
// 획득하는 것을 막기 위한 지점별 쿨다운. 한 번 보상을 받은 체크포인트는
// 3일간 다시 발견/재방문 대상에서 제외된다.

/* ===== v52 EXISTING WORKER + D1 ACCOUNT SYNC =====
   기존 server/worker.js + server/wrangler.toml의 jofams D1을 그대로 사용한다.
   동기화 대상: 수집 진행률, 체크포인트 쿨다운, 12m 공간 쿨다운.
   별도 Pages Function / 별도 D1 / 루트 wrangler.toml은 사용하지 않는다.
*/
const JOPAMS_SYNC_VERSION=2;
const JOPAMS_ACCOUNT_KEY='jopams_account_id_v2';
let JOPAMS_SYNC_READY=false,JOPAMS_SYNC_INFLIGHT=null,JOPAMS_SYNC_TIMER=0,JOPAMS_APPLYING_SERVER=false;
function jopamsAccountId(){try{const u=window.JopamsAuth&&JopamsAuth.user&&JopamsAuth.user();if(u&&u.id)return 'user:'+String(u.id)}catch(_){}return ''}
function localGameStateSnapshot(){
  let progress=[],cpCooldowns={},spatialCooldowns=[];
  try{progress=getProgress()}catch(_){}
  try{cpCooldowns=getCPCooldowns()}catch(_){}
  try{spatialCooldowns=getSpatialCooldowns()}catch(_){}
  return {version:JOPAMS_SYNC_VERSION,progress:Array.isArray(progress)?progress:[],cpCooldowns:cpCooldowns&&typeof cpCooldowns==='object'?cpCooldowns:{},spatialCooldowns:Array.isArray(spatialCooldowns)?spatialCooldowns:[],updatedAt:Date.now()};
}
function applyServerGameState(s){
  if(!s||typeof s!=='object'||!window.JopamsState)return;
  JOPAMS_APPLYING_SERVER=true;
  try{
    if(Array.isArray(s.progress))JopamsState.set('progress',s.progress);
    if(s.cpCooldowns&&typeof s.cpCooldowns==='object')JopamsState.set('cpCooldowns',s.cpCooldowns);
    if(Array.isArray(s.spatialCooldowns))JopamsState.set('cpSpatialCooldowns',s.spatialCooldowns);
  }finally{JOPAMS_APPLYING_SERVER=false}
  if(typeof invalidateCooldownCache==='function')invalidateCooldownCache();
  try{window.dispatchEvent(new CustomEvent('jopams:server-state',{detail:s}))}catch(_){}
}
async function pullServerGameState(){
  if(JOPAMS_SYNC_INFLIGHT)return JOPAMS_SYNC_INFLIGHT;
  const base=serverConfig();if(!base)return null;const accountId=jopamsAccountId();
  JOPAMS_SYNC_INFLIGHT=(async()=>{try{
    if(!accountId||!(window.JopamsAuth&&JopamsAuth.token()))return null;const r=await fetch(base+'/api/game-state',{headers:JopamsAuth.authHeaders(),cache:'no-store'});
    if(!r.ok)throw new Error('sync pull '+r.status);const s=await r.json();applyServerGameState(s);JOPAMS_SYNC_READY=true;return s;
  }catch(e){console.warn('[JOPAMS sync] pull fallback',e);return null}finally{JOPAMS_SYNC_INFLIGHT=null}})();return JOPAMS_SYNC_INFLIGHT;
}
async function pushServerGameState(reason='update'){
  if(JOPAMS_APPLYING_SERVER)return null;const base=serverConfig();if(!base)return null;const accountId=jopamsAccountId(),state=localGameStateSnapshot();
  try{if(!accountId||!(window.JopamsAuth&&JopamsAuth.token()))return null;const r=await fetch(base+'/api/game-state',{method:'PUT',headers:JopamsAuth.authHeaders({'content-type':'application/json'}),body:JSON.stringify({...state,reason})});if(!r.ok)throw new Error('sync push '+r.status);const s=await r.json();applyServerGameState(s);JOPAMS_SYNC_READY=true;return s}catch(e){console.warn('[JOPAMS sync] push deferred',e);return null}
}
function scheduleServerGameStatePush(reason='update'){if(JOPAMS_APPLYING_SERVER)return;clearTimeout(JOPAMS_SYNC_TIMER);JOPAMS_SYNC_TIMER=setTimeout(()=>pushServerGameState(reason),220)}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')pullServerGameState()});window.addEventListener('online',()=>pullServerGameState());setTimeout(()=>pullServerGameState(),250);

const CHECKPOINT_COOLDOWN_MS=3*24*60*60*1000;
// 미니게임 실패 시 같은 지점에서 즉시 재도전하지 못하도록 짧은 '신호 붕괴' 잠금.
// 기존 72시간 획득 쿨다운과 같은 cpCooldowns 저장소를 쓰되 타임스탬프를 역산해
// 서버/계정 동기화 형식을 바꾸지 않고 30분만 남도록 처리한다.
const CAPTURE_FAIL_LOCK_MS=30*60*1000;
// 동일 건물/광장에 체크포인트가 여러 개 촘촘히 배치된 경우에도 연속 획득되지 않도록
// '체크포인트 번호'뿐 아니라 실제 획득 좌표 주변 12m를 72시간 잠근다.
const CHECKPOINT_COOLDOWN_RADIUS_M=12;

let _cooldownCache={at:0,cp:{},spatial:[]};
function invalidateCooldownCache(){_cooldownCache={at:0,cp:{},spatial:[]}}
function getCPCooldowns(){try{return window.JopamsState?JopamsState.get('cpCooldowns',{}):{}}catch(e){return{}}}
function getSpatialCooldowns(){try{const a=window.JopamsState?JopamsState.get('cpSpatialCooldowns',[]):[];return Array.isArray(a)?a:[]}catch(e){return[]}}
function cooldownSnapshot(force=false){
  const now=Date.now();
  if(!force&&_cooldownCache.at&&now-_cooldownCache.at<900)return _cooldownCache;
  const cp=getCPCooldowns();
  const raw=getSpatialCooldowns();
  const spatial=raw.filter(x=>x&&Number.isFinite(x.lat)&&Number.isFinite(x.lng)&&now-Number(x.at||0)<CHECKPOINT_COOLDOWN_MS);
  if(spatial.length!==raw.length){
    try{if(window.JopamsState)JopamsState.set('cpSpatialCooldowns',spatial)}catch(e){}
  }
  _cooldownCache={at:now,cp:cp&&typeof cp==='object'?cp:{},spatial};
  return _cooldownCache;
}
function pruneSpatialCooldowns(){return cooldownSnapshot(true).spatial}
function setCPCooldown(idx){
  try{
    const m=getCPCooldowns(),now=Date.now();
    m[idx]=Math.max(Number(m[idx]||0),now);
    if(window.JopamsState)JopamsState.set('cpCooldowns',m);
    const cp=CHECKPOINTS[idx];
    if(cp){
      const a=cooldownSnapshot(true).spatial.slice();
      a.push({idx,lat:cp.lat,lng:cp.lng,at:now});
      if(window.JopamsState)JopamsState.set('cpSpatialCooldowns',a.slice(-120));
    }
    invalidateCooldownCache();
  }catch(e){}
  scheduleServerGameStatePush('setCPCooldown');
}
function setCPTemporaryCooldown(idx,durationMs=CAPTURE_FAIL_LOCK_MS){
  try{
    const now=Date.now(),m=getCPCooldowns();
    // 72시간 TTL 중 durationMs만 남은 것처럼 역산한다.
    const syntheticAt=now-(CHECKPOINT_COOLDOWN_MS-Math.max(60000,Math.min(CHECKPOINT_COOLDOWN_MS,durationMs)));
    m[idx]=Math.max(Number(m[idx]||0),syntheticAt);
    if(window.JopamsState)JopamsState.set('cpCooldowns',m);
    invalidateCooldownCache();
  }catch(e){}
  scheduleServerGameStatePush('captureFailLock');
}
function isCPCoolingDown(idx,snap=null){
  const s=snap||cooldownSnapshot(),now=Date.now(),t=Number(s.cp[idx]||0);
  if(t&&now-t<CHECKPOINT_COOLDOWN_MS)return true;
  const cp=CHECKPOINTS[idx];if(!cp)return false;
  return s.spatial.some(x=>distMeters(cp.lat,cp.lng,x.lat,x.lng)<=CHECKPOINT_COOLDOWN_RADIUS_M);
}
function checkpointCooldownRemaining(idx,snap=null){
  const s=snap||cooldownSnapshot(),now=Date.now(),cp=CHECKPOINTS[idx];
  let latest=Number(s.cp[idx]||0);
  if(cp)for(const x of s.spatial)if(distMeters(cp.lat,cp.lng,x.lat,x.lng)<=CHECKPOINT_COOLDOWN_RADIUS_M)latest=Math.max(latest,Number(x.at||0));
  return Math.max(0,CHECKPOINT_COOLDOWN_MS-(now-latest));
}

function nearestUncollectedCheckpoint(lat,lng){
  const done=new Set(getProgress()),snap=cooldownSnapshot();let best=null,bd=Infinity;
  for(const cp of CHECKPOINTS){
    if(done.has(cp.episodeId)||isCPCoolingDown(cp.idx,snap))continue;
    const d=distMeters(lat,lng,cp.lat,cp.lng);if(d<bd){bd=d;best=cp}
  }
  return best?{checkpoint:best,distance:bd,cooling:false}:null
}
// 실제 물리적으로 가장 가까운 체크포인트. 수집/쿨다운 상태와 무관하게 '거리 검증'에 사용한다.
function nearestPhysicalCheckpoint(lat,lng){
  let best=null,bd=Infinity;
  for(const cp of CHECKPOINTS){const d=distMeters(lat,lng,cp.lat,cp.lng);if(d<bd){bd=d;best=cp}}
  if(!best)return null;
  const snap=cooldownSnapshot();
  return {checkpoint:best,distance:bd,cooling:isCPCoolingDown(best.idx,snap),cooldownRemaining:checkpointCooldownRemaining(best.idx,snap)}
}
// 재방문 보상을 받을 수 있는 가장 가까운 체크포인트.
function nearestAnyCheckpoint(lat,lng){
  const snap=cooldownSnapshot();let best=null,bd=Infinity;
  for(const cp of CHECKPOINTS){
    if(isCPCoolingDown(cp.idx,snap))continue;
    const d=distMeters(lat,lng,cp.lat,cp.lng);if(d<bd){bd=d;best=cp}
  }
  return best?{checkpoint:best,distance:bd,cooling:false}:null
}
// v50: 브라우저별 저장상태 차이 때문에 근처 지점들이 쿨다운이면,
// 10km 이상 떨어진 '획득 가능 지점'이 가장 가까운 타깃처럼 보이는 문제를 방지한다.
// 실제 근처 체크포인트가 500m 이내인데 획득 가능 타깃이 1km 밖이면,
// 근처 체크포인트의 실제 거리를 보여주되 쿨다운 상태로 명확히 안내한다.
function resolveRevisitTarget(lat,lng){
  const physical=nearestPhysicalCheckpoint(lat,lng),eligible=nearestAnyCheckpoint(lat,lng);
  if(!physical)return eligible;
  if(!eligible)return physical;
  if(physical.cooling&&physical.distance<=500&&eligible.distance>1000)return physical;
  return eligible;
}
function formatCooldownRemaining(ms){
  ms=Math.max(0,Number(ms||0));
  const h=Math.ceil(ms/3600000),d=Math.floor(h/24),rh=h%24;
  if(d>0)return d+'일 '+rh+'시간';
  return Math.max(1,h)+'시간';
}
function extractHeading(e){if(typeof e.webkitCompassHeading==='number'&&!isNaN(e.webkitCompassHeading))return e.webkitCompassHeading;if(e.alpha!==null&&e.alpha!==undefined)return(360-e.alpha)%360;return null}
function vibrate(p){if(!getV4().haptics)return;if(navigator.vibrate)try{navigator.vibrate(p)}catch(e){}}
let _audioCtx=null;function playChime(kind){if(!getV4().sound)return;try{if(!_audioCtx)_audioCtx=new(window.AudioContext||window.webkitAudioContext)();const c=_audioCtx,n=c.currentTime,f=kind==='collect'?[660,880,1320]:[520,720];f.forEach((v,i)=>{const o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=v;g.gain.setValueAtTime(0,n+i*.09);g.gain.linearRampToValueAtTime(.14,n+i*.09+.02);g.gain.exponentialRampToValueAtTime(.001,n+i*.09+.27);o.connect(g).connect(c.destination);o.start(n+i*.09);o.stop(n+i*.09+.3)})}catch(e){}}
function showToast(msg,opts={}){let root=document.getElementById('toastRoot');if(!root){root=document.createElement('div');root.id='toastRoot';root.className='toast-root';document.body.appendChild(root)}const el=document.createElement('div');el.className='toast'+(opts.variant?' toast-'+opts.variant:'');el.innerHTML=msg;root.appendChild(el);requestAnimationFrame(()=>el.classList.add('show'));setTimeout(()=>{el.classList.remove('show');setTimeout(()=>el.remove(),300)},opts.duration||3000)}

// ===== 조팸스 GO v2 : 성장/일일미션/로컬 랭킹 =====
const GO_EVENT_KEY='jopams_go_events_v2', GO_PROFILE_KEY='jopams_go_profile_v2';
function getEvents(){try{return window.JopamsState?JopamsState.get('events',[]):JSON.parse(localStorage.getItem(GO_EVENT_KEY)||'[]')}catch(e){return[]}}
function pushEvent(type,data={}){const a=getEvents();a.push({type,at:new Date().toISOString(),...data});try{const next=a.slice(-300);if(window.JopamsState)JopamsState.set('events',next);else localStorage.setItem(GO_EVENT_KEY,JSON.stringify(next))}catch(e){}}
function getProfile(){const d={name:'원정대원',xp:0,streak:1,lastDay:'',dailyBonus:0,avatar:'daim'};try{return Object.assign(d,window.JopamsState?JopamsState.get('profile',d):JSON.parse(localStorage.getItem(GO_PROFILE_KEY)||'{}'))}catch(e){return d}}
function saveProfile(p){try{if(window.JopamsState)JopamsState.set('profile',p);else localStorage.setItem(GO_PROFILE_KEY,JSON.stringify(p))}catch(e){}}
function todayKey(){const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
// (버그수정) streak 필드가 스키마·화면 표시에는 존재했지만 실제로 증가시키는
// 로직이 어디에도 없어 항상 "1일"로 고정 표시되던 문제를 수정.
// 전날 접속했으면 +1, 하루 이상 공백이 생기면 1로 리셋, 오늘 이미 갱신했으면 유지.
function syncDaily(){
  const p=getProfile(),t=todayKey();
  if(p.lastDay!==t){
    if(p.lastDay){
      const prev=new Date(p.lastDay+'T00:00:00'),today=new Date(t+'T00:00:00');
      const diffDays=Math.round((today-prev)/86400000);
      p.streak=diffDays===1?(p.streak||1)+1:1;
    }else{
      p.streak=1;
    }
    p.lastDay=t;p.dailyBonus=0;saveProfile(p);
  }
  return p;
}
function awardXP(amount,reason=''){const p=syncDaily();p.xp=(p.xp||0)+amount;saveProfile(p);pushEvent('xp',{amount,reason});return p}
// v17: XP 단일 소스화. 예전에는 totalXP()가 max(수집개수*100, profile.xp)로 계산되어
// 이벤트 기반 XP가 늘어도 화면상 값이 그대로인 것처럼 보이는 혼란이 있었음.
// 이제 profile.xp만을 유일한 진행 지표로 사용한다.
function totalXP(){const p=syncDaily();return Math.max(0,p.xp||0)}
// 레거시 데이터 보정: 예전 버전에서 수집만 하고 XP 이벤트가 누락된 경우를 위한
// 1회성(그러나 매 로드마다 안전하게 재실행 가능한) 하한 보정. profile.xp를 낮추는 일은 없고
// 오직 "수집 개수 × 100"보다 낮을 때만 그 값으로 올려준다.
function reconcileLegacyXP(){const p=getProfile();const floor=getProgress().length*100;if((p.xp||0)<floor){p.xp=floor;saveProfile(p)}}
function playerLevel(){return Math.floor(totalXP()/300)+1}
function getDailyMissions(){const done=getProgress(),events=getEvents(),today=todayKey();const todayEvents=events.filter(e=>(e.at||'').slice(0,10)===today);return [
 {icon:'explore',title:'AR 탐험 1회',desc:'체크포인트에서 아이템을 1개 발견',now:todayEvents.filter(e=>e.type==='collect').length,goal:1,reward:80},
 {icon:'collection',title:'컬렉션 확인',desc:'수집한 제도를 한 번 복습',now:todayEvents.filter(e=>e.type==='learn').length,goal:1,reward:40},
 {icon:'spark',title:'원정 진척도',desc:'공공구매 아이템 3종 이상 수집',now:Math.min(done.length,3),goal:3,reward:120}
]}
function dailyCompletion(){const ms=getDailyMissions();return ms.filter(m=>m.now>=m.goal).length}
// v17: 실명처럼 보이는 가짜 경쟁자 데이터를 제거했습니다.
// 서버가 연결되어 있지 않으면 "내 기록"만 정직하게 보여주고,
// 화면(ranking.html)에서 빈 상태 안내 문구를 함께 표시합니다.
function localLeaderboard(){
  const me=missionScore();
  return [{name:getProfile().name||'원정대원',dept:'조팸스 GO',score:me,isMe:true}];
}
function claimDailyBonus(){const p=syncDaily();if(dailyCompletion()<3||p.dailyBonus)return false;p.dailyBonus=1;p.xp=(p.xp||0)+200;saveProfile(p);pushEvent('daily_bonus',{amount:200});return true}


// ===== 조팸스 GO v3 : 미니게임/업적/대항전/서버동기화 =====
const GO_V3_KEY='jopams_go_v3';
const ACHIEVEMENTS=[
 {id:'first',icon:'spark',name:'첫 발견',desc:'첫 AR 아이템 발견',test:()=>getProgress().length>=1},
 {id:'collector3',icon:'compass',name:'신입 원정대원',desc:'아이템 3종 수집',test:()=>getProgress().length>=3},
 {id:'collector6',icon:'rare',name:'공공구매 탐험가',desc:'아이템 6종 수집',test:()=>getProgress().length>=6},
 {id:'all12',icon:'trophy',name:'공공구매 마스터',desc:'12종 전체 수집',test:()=>getProgress().length>=12},
 {id:'learn3',icon:'book',name:'지식 수집가',desc:'컬렉션 학습 3회',test:()=>getEvents().filter(e=>e.type==='learn').length>=3},
 {id:'mini3',icon:'target',name:'AR 플레이어',desc:'미니게임 3회 성공',test:()=>getEvents().filter(e=>e.type==='minigame_success').length>=3},
 {id:'daily',icon:'calendar',name:'오늘도 클리어',desc:'일일미션 올클리어',test:()=>getEvents().some(e=>e.type==='daily_bonus')}
];
function getV3(){const d={org:'본사',badges:[],serverUrl:'',lastBadgeCheck:0};try{return Object.assign(d,window.JopamsState?JopamsState.get('team',d):JSON.parse(localStorage.getItem(GO_V3_KEY)||'{}'))}catch(e){return d}}
function saveV3(v){try{if(window.JopamsState)JopamsState.set('team',v);else localStorage.setItem(GO_V3_KEY,JSON.stringify(v))}catch(e){}}
function setOrganization(org){const v=getV3();v.org=org;saveV3(v);return v}
function checkAchievements(show=true){const v=getV3();const newly=[];ACHIEVEMENTS.forEach(a=>{if(!v.badges.includes(a.id)&&a.test()){v.badges.push(a.id);newly.push(a)}});v.lastBadgeCheck=Date.now();saveV3(v);if(show&&newly.length&&typeof showToast==='function'){newly.forEach((a,i)=>setTimeout(()=>{playChime('collect');showToast('배지 획득! <b>'+a.icon+' '+a.name+'</b>',{variant:'near',duration:3300})},i*500))}return newly}
function earnedAchievements(){const ids=getV3().badges;return ACHIEVEMENTS.map(a=>({...a,earned:ids.includes(a.id)}))}
function missionScore(){return totalXP()*37+getProgress().length*250+getEvents().filter(e=>e.type==='minigame_success').length*180}
// v17: 5개 본부에 임의로 부여된 가짜 기준점수를 제거했습니다.
// 서버 미연결 상태에서는 내 소속 본부의 실제 점수만 표시하고, 나머지는
// "데이터 없음"으로 정직하게 남겨둡니다 (화면 쪽에서 null을 안내 문구로 처리).
function organizationLeaderboard(){
  const orgs=['본사','화폐본부','제지본부','ID본부','기술연구원'];
  const mine=getV3().org||'본사';
  return orgs
    .map(name=>({name,score:name===mine?missionScore():null}))
    .sort((a,b)=>(b.score??-1)-(a.score??-1));
}
// 서버가 연결된 경우, 실제 제출된 점수를 본부별로 합산한 랭킹을 반환한다.
// 서버 미연결이거나 데이터가 없으면 null을 반환하며, 이 경우 화면은
// organizationLeaderboard()의 로컬 버전으로 대체 표시한다.
async function organizationLeaderboardServer(){
  const rows=await fetchServerLeaderboard();
  if(!rows||!rows.length)return null;
  const byOrg={};
  rows.forEach(r=>{const org=r.org||'본사';byOrg[org]=(byOrg[org]||0)+Number(r.score||0)});
  const list=Object.entries(byOrg).map(([name,score])=>({name,score}));
  return list.length?list.sort((a,b)=>b.score-a.score):null;
}
// v21: 배포된 랭킹 서버 주소를 기본값으로 내장. 사용자가 프로필에서 별도로
// 저장한 값이 있으면 그 값이 우선 적용된다 (카카오맵 키와 동일한 패턴).
const DEFAULT_SERVER_URL='https://jofams-go.junewoopark16.workers.dev';
const LEGACY_SERVER_URL='https://jofams-go.junewoopark16.workers.dev';
const BAD_V60_SERVER_URL='https://jopams-go-ranking.junewoopark16.workers.dev';
function playerDeviceId(){try{let id=localStorage.getItem('jopams_go_player_id_v18');if(!id){id=(crypto?.randomUUID?.()||('p_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2)));localStorage.setItem('jopams_go_player_id_v18',id)}return id}catch(e){return 'local_player'}}
async function syncRewardReceipt(claimKey,rewardType='reward'){const base=serverConfig();if(!base)return {ok:false,reason:'offline'};try{const r=await fetch(base+'/api/reward/claim',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({playerId:playerDeviceId(),claimKey:String(claimKey).slice(0,80),rewardType:String(rewardType).slice(0,40)})});return await r.json()}catch(e){return {ok:false,reason:'network'}}}
function serverConfig(){
  const u=String(getV3().serverUrl||'').trim().replace(/\/$/,'');
  return (!u||u===LEGACY_SERVER_URL||u===BAD_V60_SERVER_URL)?DEFAULT_SERVER_URL:u;
}
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
 {tier:1,xp:0,icon:'title',name:'원정대 입장권',reward:'START'},
 {tier:2,xp:300,icon:'coin',name:'GO 코인 100',reward:'+100 XP'},
 {tier:3,xp:600,icon:'chest',name:'블루 보급상자',reward:'+150 XP'},
 {tier:4,xp:900,icon:'speed',name:'순식 배지 프레임',reward:'+180 XP'},
 {tier:5,xp:1200,icon:'shield',name:'다임 배지 프레임',reward:'+200 XP'},
 {tier:6,xp:1500,icon:'quiz',name:'훈민 배지 프레임',reward:'+220 XP'},
 {tier:7,xp:1800,icon:'rare',name:'프리미엄 보급상자',reward:'+250 XP'},
 {tier:8,xp:2100,icon:'trophy',name:'SEASON 01 마스터',reward:'+300 XP'}
];
function getV4(){const d={onboarded:false,sound:true,haptics:true,reducedMotion:false,seasonClaims:[],coins:0,lastChest:'',installDismissed:false,miniTutorialSeen:{}};try{return Object.assign(d,window.JopamsState?JopamsState.get('settings',d):JSON.parse(localStorage.getItem(GO_V4_KEY)||'{}'))}catch(e){return d}}
function saveV4(v){try{if(window.JopamsState)JopamsState.set('settings',v);else localStorage.setItem(GO_V4_KEY,JSON.stringify(v))}catch(e){}}
// v17: 미니게임 최초 진입 튜토리얼 여부 저장/조회 헬퍼.
function hasSeenMiniTutorial(kind){return !!(getV4().miniTutorialSeen||{})[kind]}
function markMiniTutorialSeen(kind){const v=getV4();v.miniTutorialSeen=Object.assign({},v.miniTutorialSeen||{},{[kind]:true});saveV4(v)}
function setPref(key,value){const v=getV4();v[key]=value;saveV4(v);document.documentElement.classList.toggle('reduced-motion',!!v.reducedMotion);return v}
function updatePlayer({name,org,avatar}={}){const p=getProfile();if(typeof name==='string'&&name.trim())p.name=name.trim().slice(0,14);if(avatar)p.avatar=avatar;saveProfile(p);if(org)setOrganization(org);return p}
function avatarPath(key){return 'assets/img/'+({daim:'daim.png',sunsik:'sunsik.png',hoonmin:'hoonmin.png'}[key]||'daim.png')}
function seasonState(){const xp=totalXP(),v=getV4();return {xp,level:playerLevel(),claims:v.seasonClaims||[],tiers:SEASON_TIERS.map(t=>({...t,unlocked:xp>=t.xp,claimed:(v.seasonClaims||[]).includes(t.tier)}))}}
function claimSeasonTier(tier){const state=seasonState(),t=state.tiers.find(x=>x.tier===Number(tier));if(!t||!t.unlocked||t.claimed)return false;const v=getV4();v.seasonClaims=[...(v.seasonClaims||[]),t.tier];const bonus={2:100,3:150,4:180,5:200,6:220,7:250,8:300}[t.tier]||0;if(t.tier===2)v.coins=(v.coins||0)+100;saveV4(v);if(bonus)awardXP(bonus,'시즌패스 보상');pushEvent('season_claim',{tier:t.tier,bonus});return true}
function availableSeasonRewards(){return seasonState().tiers.filter(t=>t.unlocked&&!t.claimed&&t.tier>1).length}
function chestAvailable(){const v=getV4();return v.lastChest!==todayKey()&&dailyCompletion()>=2}
function claimDailyChest(){if(!chestAvailable())return false;const v=getV4();v.lastChest=todayKey();v.coins=(v.coins||0)+50;saveV4(v);awardXP(80,'일일 보급상자');pushEvent('daily_chest',{xp:80,coins:50});return true}
function markOnboarded(){const v=getV4();v.onboarded=true;saveV4(v)}
function resetOnboarding(){const v=getV4();v.onboarded=false;v.miniTutorialSeen={};saveV4(v)}
function privacySummary(){return {camera:'영상 저장 안 함',location:'실시간 좌표 서버 전송 안 함',sensor:'방향값 기기 내 처리',ranking:'닉네임·소속·점수만 선택 전송'}}
async function testServerConnection(url){const base=(url||serverConfig()).trim().replace(/\/$/,'');if(!base)return {ok:false,message:'서버 URL이 비어 있습니다.'};try{const r=await fetch(base+'/api/leaderboard',{cache:'no-store'});if(!r.ok)return {ok:false,message:'HTTP '+r.status};return {ok:true,message:'랭킹 서버와 정상 연결되었습니다.'}}catch(e){return {ok:false,message:'연결할 수 없습니다. URL/CORS/배포 상태를 확인하세요.'}}}
function applyRuntimePrefs(){const v=getV4();document.documentElement.classList.toggle('reduced-motion',!!v.reducedMotion)}
applyRuntimePrefs();
reconcileLegacyXP();
// v38: 게임 전체에서 텍스트 선택·길게 눌러 복사하기 메뉴를 막는다.
// input/textarea는 정상 입력이 필요하므로 예외로 둔다.
(function(){
  const isEditable=el=>el&&(el.tagName==='INPUT'||el.tagName==='TEXTAREA'||el.isContentEditable);
  document.addEventListener('contextmenu',e=>{if(!isEditable(e.target))e.preventDefault()});
  document.addEventListener('selectstart',e=>{if(!isEditable(e.target))e.preventDefault()});
})();


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

// v10: UI numeric formatter — every value >= 1,000 uses Korean thousands separators.
function fmtNum(value){const n=Number(value);return Number.isFinite(n)?new Intl.NumberFormat('ko-KR',{maximumFractionDigits:0}).format(n):String(value??'')}
function fmtMetric(value,suffix=''){return fmtNum(value)+(suffix?(' '+suffix):'')}

const GO_KAKAO_KEY='jopams_go_kakao_js_key_v1';
// v18: 카카오 Developers에서 발급받은 JavaScript 키를 기본값으로 내장.
// 사용자가 프로필 화면에서 직접 키를 저장하면 그 값이 우선 적용된다.
const DEFAULT_KAKAO_KEY='d66b9aa8688da889fba6807d142d896c';
function kakaoMapKey(){try{const v=(localStorage.getItem(GO_KAKAO_KEY)||'').trim();return v||DEFAULT_KAKAO_KEY}catch(e){return DEFAULT_KAKAO_KEY}}
function setKakaoMapKey(v){try{const x=(v||'').trim();if(x)localStorage.setItem(GO_KAKAO_KEY,x);else localStorage.removeItem(GO_KAKAO_KEY);return x}catch(e){return''}}
function kakaoMapLink(lat,lng,label='조팸스 GO 체크포인트'){return 'https://map.kakao.com/link/map/'+encodeURIComponent(label)+','+Number(lat).toFixed(6)+','+Number(lng).toFixed(6)}
function avatarMeta(key){const k=['hoonmin','daim','sunsik'].includes(key)?key:'daim';return {key:k,path:avatarPath(k),name:k==='hoonmin'?'훈민':k==='sunsik'?'순식':'다임'}}
function syncAvatarUI(root=document){const p=getProfile(),a=avatarMeta(p.avatar);root.querySelectorAll('[data-player-avatar]').forEach(img=>{if(img.getAttribute('src')!==a.path)img.setAttribute('src',a.path);img.setAttribute('alt',a.name)});root.querySelectorAll('[data-crew-avatar]').forEach(el=>el.classList.toggle('active',el.dataset.crewAvatar===a.key));root.querySelectorAll('[data-player-character-name]').forEach(el=>el.textContent=a.name);return a}
window.addEventListener('pageshow',()=>syncAvatarUI());window.addEventListener('storage',e=>{if(e.key===GO_PROFILE_KEY||e.key===window.JopamsState?.KEY)syncAvatarUI()});


// ===== 조팸스 GO v12 : 캐릭터 스킬 / 발견 메타 / 랭킹 동기부여 =====
const CHARACTER_SKILLS={
 hoonmin:{name:'훈민',short:'퀴즈 XP +20%',desc:'훈민 선택 시 O/X 퀴즈 성공 XP가 20% 증가합니다.'},
 daim:{name:'다임',short:'실드 실패 1회 무효',desc:'다임 선택 시 실드 충전 미션에서 첫 실패를 한 번 보호합니다.'},
 sunsik:{name:'순식',short:'포획 판정 +20%',desc:'순식 선택 시 타이밍 포획 성공 구간이 20% 넓어집니다.'}
};
function selectedSkill(){const key=getProfile().avatar||'daim';return CHARACTER_SKILLS[key]||CHARACTER_SKILLS.daim}
function discoveryDate(episodeId){const ev=getEvents().find(e=>e.type==='collect'&&Number(e.episodeId)===Number(episodeId));if(!ev?.at)return '';try{return new Date(ev.at).toLocaleDateString('ko-KR',{month:'short',day:'numeric'})}catch(e){return''}}
function discoveryPercent(){return Math.round(getProgress().length/EPISODES.length*100)}
// v17: 실제 데이터 없이 점수를 역산해 "몇 위"처럼 보여주던 가짜 추정 공식을 제거했습니다.
// 서버 연동 전에는 정직하게 null을 반환하고, 화면에서는 "-"로 표시합니다.
function motivationRanks(){
  if(!serverConfig())return {overall:null,org:null,week:null};
  return {overall:null,org:null,week:null}; // 서버 기반 순위 산출은 추후 랭킹 API 확장 시 연결
}

// ===== 조팸스 GO v41 : 공공구매 컬렉션 현대형 벡터 아이콘 (신규 12항목) =====
function publicPurchaseIcon(id, unlocked=true){
  const paths={
    1:'<path d="M10 26V13h8v5l7-4v4l7-4v12H10Z"/><path d="M14 26v-5h5v5M25 21h3M25 24h3"/>',
    2:'<path d="M14 18a6 6 0 1 1 12 0c0 3-2 4-3 6h-6c-1-2-3-3-3-6Z"/><path d="M17 28h6M18 31h4M20 7V4M9 18H5M35 18h-4M11 9l-3-3M29 9l3-3"/>',
    3:'<path d="M14 8h12M18 8v7l-6 10a3 3 0 0 0 3 5h10a3 3 0 0 0 3-5l-6-10V8"/><path d="M15 23h13M18 19h5"/>',
    4:'<circle cx="16" cy="12" r="4"/><path d="M16 16v7h8M13 30l5-7h7l4 7M25 18l4 4"/>',
    5:'<path d="M20 8l2.8 6.2 6.7.7-5 4.5 1.5 6.6-6-3.4-6 3.4 1.5-6.6-5-4.5 6.7-.7L20 8Z"/><path d="M12 30h16"/>',
    6:'<path d="M8 29h24M11 29V17l9-8 9 8v12M16 29v-7h8v7"/><path d="M8 16l12-9 12 9"/>',
    7:'<circle cx="20" cy="12" r="5"/><path d="M10 30c1-7 5-11 10-11s9 4 10 11M27 10h5M29.5 7.5v5"/>',
    8:'<path d="M7 18l7-6 6 5 6-5 7 6-13 12L7 18Z"/><path d="M14 22l6 5 6-5"/>',
    9:'<path d="M14 9h7v7h-7zM22 16h7v7h-7zM14 23h7v7h-7zM7 16h7v7H7z"/><path d="M14 19h8M17 16v7"/>',
    10:'<path d="M31 9C19 9 11 15 11 23c0 5 4 8 9 8 9 0 12-10 11-22Z"/><path d="M12 30c4-7 9-11 16-15"/>',
    11:'<circle cx="20" cy="23" r="7"/><path d="M14 7l6 9 6-9"/><path d="M17 23l2 3 4-5"/>',
    12:'<path d="M11 10h18v13H11zM15 23v7h10v-7"/><path d="M15 15h10M20 12v6"/><circle cx="29" cy="28" r="4"/><path d="M29 26v4M27 28h4"/>'
  };
  const body=unlocked?(paths[id]||paths[1]):'<path d="M14 18a6 6 0 0 1 12 0c0 5-6 5-6 9"/><circle cx="20" cy="32" r="1"/>';
  return `<svg class="pp-icon" viewBox="0 0 40 40" aria-hidden="true"><defs><linearGradient id="ppg${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2f80ed"/><stop offset="1" stop-color="#6c5ce7"/></linearGradient></defs><g fill="none" stroke="url(#ppg${id})" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;
}
