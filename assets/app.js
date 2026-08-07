// ===== 조팸스 원정대 AR 게임 v2 - 공통 데이터/로직 =====
const EPISODES = [
  { id: 1,  icon: '🏭', item: '중소기업제품',     kicker: '중소기업제품 편',   quote: '이거 만든 사람이 누구게?' },
  { id: 2,  icon: '🔬', item: '기술개발제품',     kicker: '기술개발제품 편',   quote: '이 반짝이는 스티커의 정체' },
  { id: 3,  icon: '👩\u200d💼', item: '여성기업제품',     kicker: '여성기업 편',       quote: '사장님이 누구실까요 게임' },
  { id: 4,  icon: '💪', item: '장애인기업제품',   kicker: '장애인기업 편',     quote: '조다임, 방패를 내려놓다' },
  { id: 5,  icon: '✨', item: '중증장애인생산품', kicker: '중증장애인생산품 편', quote: '혜안으로도 못 본 정성' },
  { id: 6,  icon: '🤝', item: '사회적기업제품',   kicker: '사회적기업 편',     quote: '이익보다 중요한 게 있다고?' },
  { id: 7,  icon: '🔥', item: '자활기업제품',     kicker: '자활기업 편',       quote: '다시 일어서는 법' },
  { id: 8,  icon: '🧩', item: '협동조합제품',     kicker: '협동조합 편',       quote: '셋이 힘을 합치면' },
  { id: 9,  icon: '🌾', item: '마을기업제품',     kicker: '마을기업 편',       quote: '우리 동네 특산품 자랑' },
  { id: 10, icon: '💡', item: '창업기업제품',     kicker: '창업기업 편',       quote: '이 아이디어 실화냐' },
  { id: 11, icon: '🌱', item: '녹색제품',         kicker: '녹색제품 편',       quote: '지구가 보내는 신호' },
  { id: 12, icon: '🏆', item: '신제품(NEP)인증',  kicker: '신제품 인증 편',    quote: '원정의 마지막 조각' },
];

// 사용자가 제공한 40개 실측 좌표. 아이템 12종을 순환 배정(1~12 반복)했습니다.
const RAW_COORDS = [
  [36.3773307, 127.3705299], [36.3777765, 127.3698604], [36.3775195, 127.3696512],
  [36.3776728, 127.3690397], [36.3780464, 127.3693870], [36.3776755, 127.3696418],
  [36.3778040, 127.3700254], [36.3782651, 127.3700388], [36.3782748, 127.3706316],
  [36.3782737, 127.3690880], [36.3782726, 127.3683075], [36.3778223, 127.3683155],
  [36.3774627, 127.3685676], [36.3770211, 127.3693428], [36.3764607, 127.3698162],
  [36.3767663, 127.3681733], [36.3761724, 127.3692515], [36.3758139, 127.3695077],
  [36.3757642, 127.3690839], [36.3767436, 127.3695023], [36.3768235, 127.3705457],
  [36.3771690, 127.3708595], [36.3776322, 127.3709561], [36.3782207, 127.3709682],
  [36.3779832, 127.3705538], [36.3778223, 127.3701877], [36.3784961, 127.3700522],
  [36.3785058, 127.3690343], [36.3784021, 127.3684335], [36.3786353, 127.3684187],
  [36.3781527, 127.3694902], [36.3780717, 127.3697075], [36.3779443, 127.3696472],
  [36.3779027, 127.3696519], [36.3778903, 127.3695808], [36.3779211, 127.3696070],
  [36.3779638, 127.3695084], [36.3780162, 127.3691128], [36.3771632, 127.3695527],
  [36.3771178, 127.3695473], [36.3771464, 127.3695748],
];

const CHECKPOINTS = RAW_COORDS.map((c, i) => ({
  idx: i, lat: c[0], lng: c[1], episodeId: (i % 12) + 1,
}));

const NOTIFY_RADIUS_M = 45;  // 이 거리 안에 들어오면 "근처 알림" 발생
const COLLECT_RADIUS_M = 20; // 이 거리 + 방향이 맞아야 "발견" 판정
const FOV_HALF_DEG = 38;     // 캐릭터가 화면에 보이는 좌우 시야각(±)
const DWELL_MS = 2200;       // 발견 후 화면 중앙에 유지해야 하는 시간

const STORAGE_KEY = 'jopams_ar_progress_v3';

function getProgress(){
  try{ const r = localStorage.getItem(STORAGE_KEY); const a = r ? JSON.parse(r) : []; return Array.isArray(a)?a:[]; }
  catch(e){ return []; }
}
function saveProgress(arr){ try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); }catch(e){} }
function markCollected(epId){
  const arr = getProgress();
  if(!arr.includes(epId)){ arr.push(epId); saveProgress(arr); }
  return arr;
}
function resetProgress(){ saveProgress([]); }
function nextEpisodeId(){
  const done = getProgress();
  for(const ep of EPISODES){ if(!done.includes(ep.id)) return ep.id; }
  return EPISODES[EPISODES.length-1].id;
}
function getEpisode(id){ return EPISODES.find(e=>e.id===Number(id)) || EPISODES[0]; }

// ---- 지리 계산 ----
function toRad(d){ return d * Math.PI / 180; }
function toDeg(r){ return r * 180 / Math.PI; }

function distMeters(lat1, lng1, lat2, lng2){
  const R = 6371000;
  const dLat = toRad(lat2-lat1), dLng = toRad(lng2-lng1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function bearingTo(lat1, lng1, lat2, lng2){
  const φ1=toRad(lat1), φ2=toRad(lat2), Δλ=toRad(lng2-lng1);
  const y = Math.sin(Δλ)*Math.cos(φ2);
  const x = Math.cos(φ1)*Math.sin(φ2) - Math.sin(φ1)*Math.cos(φ2)*Math.cos(Δλ);
  return (toDeg(Math.atan2(y,x)) + 360) % 360;
}

// -180 ~ 180 범위로 정규화된 각도 차이 (target - current)
function angleDiff(target, current){
  return ((target - current + 540) % 360) - 180;
}

function nearestUncollectedCheckpoint(curLat, curLng){
  const done = getProgress();
  let best = null, bestDist = Infinity;
  CHECKPOINTS.forEach(cp => {
    if(done.includes(cp.episodeId)) return;
    const d = distMeters(curLat, curLng, cp.lat, cp.lng);
    if(d < bestDist){ bestDist = d; best = cp; }
  });
  return best ? { checkpoint: best, distance: bestDist } : null;
}

// ---- 나침반 헤딩 추출 (iOS/Android 호환) ----
function extractHeading(event){
  if(typeof event.webkitCompassHeading === 'number' && !isNaN(event.webkitCompassHeading)){
    return event.webkitCompassHeading; // iOS: 이미 0=북, 시계방향 절대값
  }
  if(event.alpha !== null && event.alpha !== undefined){
    return (360 - event.alpha) % 360; // Android(절대/상대 근사)
  }
  return null;
}

// ---- 진동 피드백 ----
function vibrate(pattern){
  if(navigator.vibrate){ try{ navigator.vibrate(pattern); }catch(e){} }
}

// ---- 짧은 효과음 (외부 파일 없이 WebAudio로 생성) ----
let _audioCtx = null;
function playChime(kind){
  try{
    if(!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = _audioCtx;
    const now = ctx.currentTime;
    const freqs = kind === 'collect' ? [660, 880, 1320] : [520, 720];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0, now + i*0.09);
      gain.gain.linearRampToValueAtTime(0.18, now + i*0.09 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i*0.09 + 0.28);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i*0.09);
      osc.stop(now + i*0.09 + 0.3);
    });
  }catch(e){ /* 오디오 미지원 기기는 조용히 무시 */ }
}

// ---- 토스트 알림 ----
function showToast(msg, opts){
  opts = opts || {};
  let root = document.getElementById('toastRoot');
  if(!root){
    root = document.createElement('div');
    root.id = 'toastRoot';
    root.className = 'toast-root';
    document.body.appendChild(root);
  }
  const el = document.createElement('div');
  el.className = 'toast' + (opts.variant ? ' toast-' + opts.variant : '');
  el.innerHTML = msg;
  root.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 350);
  }, opts.duration || 3200);
}
