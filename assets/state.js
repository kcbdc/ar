/* JOPAMS GO v17 unified save schema + legacy migration + in-memory cache */
(function(){
  const KEY='jopams_save_v1';
  const LEGACY={progress:'jopams_ar_progress_v3',events:'jopams_go_events_v2',profile:'jopams_go_profile_v2',team:'jopams_go_v3',settings:'jopams_go_v4'};
  const defaults={version:1,progress:[],events:[],profile:{name:'원정대원',xp:0,streak:1,lastDay:'',dailyBonus:0,avatar:'daim'},team:{org:'본사',badges:[],serverUrl:'',lastBadgeCheck:0},settings:{onboarded:false,sound:true,haptics:true,reducedMotion:false,seasonClaims:[],coins:0,lastChest:'',installDismissed:false},meta:{migratedAt:'',updatedAt:''}};
  const clone=v=>JSON.parse(JSON.stringify(v));
  const readJSON=(k,f)=>{try{const x=localStorage.getItem(k);return x?JSON.parse(x):clone(f)}catch(e){return clone(f)}};
  // v17: 저장 데이터를 메모리에 캐싱해 매 호출마다 localStorage 전체를 다시 파싱하지 않도록 함.
  // AR 화면처럼 초당 수십 회 상태를 읽는 화면에서 성능/배터리에 직접적인 영향이 있었음.
  let _cache=null;
  function load(){
    if(_cache) return _cache;
    const s=readJSON(KEY,defaults);
    _cache=Object.assign(clone(defaults),s,{profile:Object.assign({},defaults.profile,s.profile||{}),team:Object.assign({},defaults.team,s.team||{}),settings:Object.assign({},defaults.settings,s.settings||{})});
    return _cache;
  }
  function save(s){try{s.version=1;s.meta=Object.assign({},s.meta||{},{updatedAt:new Date().toISOString()});localStorage.setItem(KEY,JSON.stringify(s));_cache=s;return true}catch(e){return false}}
  // 다른 탭/창에서 데이터가 바뀌면 캐시를 무효화해 다음 read에서 최신값을 다시 읽는다.
  if(typeof window!=='undefined')window.addEventListener('storage',e=>{if(e.key===KEY)_cache=null});
  function migrate(){let s=load();if(!s.meta?.migratedAt){
      const lp=readJSON(LEGACY.progress,[]),le=readJSON(LEGACY.events,[]),lpr=readJSON(LEGACY.profile,{}),lt=readJSON(LEGACY.team,{}),ls=readJSON(LEGACY.settings,{});
      if(Array.isArray(lp)&&lp.length)s.progress=lp;if(Array.isArray(le)&&le.length)s.events=le;
      s.profile=Object.assign({},s.profile,lpr||{});s.team=Object.assign({},s.team,lt||{});s.settings=Object.assign({},s.settings,ls||{});
      s.meta=Object.assign({},s.meta,{migratedAt:new Date().toISOString()});save(s);
    }return s;}
  function get(section,fallback){const s=load();const v=s[section];return v===undefined?clone(fallback):clone(v)}
  function set(section,value){const s=load();s[section]=clone(value);save(s);return value}
  function patch(section,value){const cur=get(section,{}),next=Object.assign({},cur,value||{});set(section,next);return next}
  // v17: 기기 변경/브라우저 초기화 대비 수동 백업. 전체 저장 데이터를 JSON 문자열로
  // 내보내고, 같은 형식의 JSON을 다시 불러와 복원할 수 있다.
  function exportJSON(){return JSON.stringify(load())}
  function importJSON(text){
    try{
      const obj=JSON.parse(text);
      if(!obj||typeof obj!=='object'||Array.isArray(obj))return false;
      _cache=null;
      localStorage.setItem(KEY,JSON.stringify(obj));
      _cache=obj;
      return true;
    }catch(e){return false}
  }
  migrate();
  window.JopamsState={KEY,load,save,get,set,patch,migrate,exportJSON,importJSON};
})();
