// ===== 조팸스 원정대 AR 게임 - 공통 데이터 =====
// 실제 배치 장소명은 아래 location 값만 바꾸면 됩니다.
const EPISODES = [
  { id: 1,  icon: '🏭', item: '중소기업제품',     kicker: '중소기업제품 편',   quote: '이거 만든 사람이 누구게?',        location: '체크포인트 1 (예: 정문 로비)' },
  { id: 2,  icon: '🔬', item: '기술개발제품',     kicker: '기술개발제품 편',   quote: '이 반짝이는 스티커의 정체',        location: '체크포인트 2 (예: 홍보관)' },
  { id: 3,  icon: '👩‍💼', item: '여성기업제품',     kicker: '여성기업 편',       quote: '사장님이 누구실까요 게임',         location: '체크포인트 3 (예: 대강당)' },
  { id: 4,  icon: '💪', item: '장애인기업제품',   kicker: '장애인기업 편',     quote: '조다임, 방패를 내려놓다',          location: '체크포인트 4 (예: 복지동)' },
  { id: 5,  icon: '✨', item: '중증장애인생산품', kicker: '중증장애인생산품 편', quote: '혜안으로도 못 본 정성',          location: '체크포인트 5 (예: 자료실)' },
  { id: 6,  icon: '🤝', item: '사회적기업제품',   kicker: '사회적기업 편',     quote: '이익보다 중요한 게 있다고?',       location: '체크포인트 6 (예: 구내식당)' },
  { id: 7,  icon: '🔥', item: '자활기업제품',     kicker: '자활기업 편',       quote: '다시 일어서는 법',                location: '체크포인트 7 (예: 체육관)' },
  { id: 8,  icon: '🧩', item: '협동조합제품',     kicker: '협동조합 편',       quote: '셋이 힘을 합치면',                location: '체크포인트 8 (예: 회의동)' },
  { id: 9,  icon: '🌾', item: '마을기업제품',     kicker: '마을기업 편',       quote: '우리 동네 특산품 자랑',           location: '체크포인트 9 (예: 휴게공원)' },
  { id: 10, icon: '💡', item: '창업기업제품',     kicker: '창업기업 편',       quote: '이 아이디어 실화냐',              location: '체크포인트 10 (예: 연구동 로비)' },
  { id: 11, icon: '🌱', item: '녹색제품',         kicker: '녹색제품 편',       quote: '지구가 보내는 신호',              location: '체크포인트 11 (예: 옥상정원)' },
  { id: 12, icon: '🏆', item: '신제품(NEP)인증',  kicker: '신제품 인증 편',    quote: '원정의 마지막 조각',              location: '체크포인트 12 (예: 본관 옥상)' },
];

const STORAGE_KEY = 'jopams_ar_progress_v1';

function getProgress(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  }catch(e){ return []; }
}

function saveProgress(arr){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); }catch(e){}
}

function markCollected(epId){
  const arr = getProgress();
  if(!arr.includes(epId)){
    arr.push(epId);
    saveProgress(arr);
  }
  return arr;
}

function resetProgress(){
  saveProgress([]);
}

function nextEpisodeId(){
  const done = getProgress();
  for(const ep of EPISODES){
    if(!done.includes(ep.id)) return ep.id;
  }
  return EPISODES[EPISODES.length - 1].id; // all done -> replay last
}

function getEpisode(id){
  return EPISODES.find(e => e.id === Number(id)) || EPISODES[0];
}
