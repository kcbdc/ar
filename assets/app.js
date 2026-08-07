// ===== 조팸스 원정대 AR 게임 - 공통 데이터 (GPS 기반) =====
const EPISODES = [
  { id: 1,  icon: '🏭', item: '중소기업제품',     kicker: '중소기업제품 편',   quote: '이거 만든 사람이 누구게?' },
  { id: 2,  icon: '🔬', item: '기술개발제품',     kicker: '기술개발제품 편',   quote: '이 반짝이는 스티커의 정체' },
  { id: 3,  icon: '👩‍💼', item: '여성기업제품',     kicker: '여성기업 편',       quote: '사장님이 누구실까요 게임' },
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
// 특정 좌표에 특정 아이템을 지정하고 싶다면 이 배열의 episodeId 값만 바꾸면 됩니다.
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
  idx: i,
  lat: c[0],
  lng: c[1],
  episodeId: (i % 12) + 1,
}));

const RADIUS_M = 18;      // 이 거리(미터) 안에 들어오면 "근접" 처리
const DWELL_MS = 3000;    // 근접 상태를 유지해야 하는 시간

const STORAGE_KEY = 'jopams_ar_progress_v2_gps';

function getProgress(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  }catch(e){ return []; }
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
  return EPISODES[EPISODES.length - 1].id;
}
function getEpisode(id){ return EPISODES.find(e => e.id === Number(id)) || EPISODES[0]; }

// Haversine 거리(미터)
function distMeters(lat1, lng1, lat2, lng2){
  const R = 6371000;
  const toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat/2)**2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng/2)**2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// 현재 위치에서 가장 가까운, 아직 수집하지 않은 체크포인트를 반환
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
