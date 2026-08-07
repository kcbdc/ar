/* JOPAMS GO v12 unified save schema + legacy migration */
(function(){
  const KEY='jopams_save_v1';
  const LEGACY={progress:'jopams_ar_progress_v3',events:'jopams_go_events_v2',profile:'jopams_go_profile_v2',team:'jopams_go_v3',settings:'jopams_go_v4'};
  const defaults={version:1,progress:[],events:[],profile:{name:'원정대원',xp:0,streak:1,lastDay:'',dailyBonus:0,avatar:'daim'},team:{org:'본사',badges:[],serverUrl:'',lastBadgeCheck:0},settings:{onboarded:false,sound:true,haptics:true,reducedMotion:false,seasonClaims:[],coins:0,lastChest:'',installDismissed:false},meta:{migratedAt:'',updatedAt:''}};
  const clone=v=>JSON.parse(JSON.stringify(v));
  const readJSON=(k,f)=>{try{const x=localStorage.getItem(k);return x?JSON.parse(x):clone(f)}catch(e){return clone(f)}};
  function load(){const s=readJSON(KEY,defaults);return Object.assign(clone(defaults),s,{profile:Object.assign({},defaults.profile,s.profile||{}),team:Object.assign({},defaults.team,s.team||{}),settings:Object.assign({},defaults.settings,s.settings||{})});}
  function save(s){try{s.version=1;s.meta=Object.assign({},s.meta||{},{updatedAt:new Date().toISOString()});localStorage.setItem(KEY,JSON.stringify(s));return true}catch(e){return false}}
  function migrate(){let s=load();if(!s.meta?.migratedAt){
      const lp=readJSON(LEGACY.progress,[]),le=readJSON(LEGACY.events,[]),lpr=readJSON(LEGACY.profile,{}),lt=readJSON(LEGACY.team,{}),ls=readJSON(LEGACY.settings,{});
      if(Array.isArray(lp)&&lp.length)s.progress=lp;if(Array.isArray(le)&&le.length)s.events=le;
      s.profile=Object.assign({},s.profile,lpr||{});s.team=Object.assign({},s.team,lt||{});s.settings=Object.assign({},s.settings,ls||{});
      s.meta=Object.assign({},s.meta,{migratedAt:new Date().toISOString()});save(s);
    }return s;}
  function get(section,fallback){const s=load();const v=s[section];return v===undefined?clone(fallback):clone(v)}
  function set(section,value){const s=load();s[section]=clone(value);save(s);return value}
  function patch(section,value){const cur=get(section,{}),next=Object.assign({},cur,value||{});set(section,next);return next}
  migrate();
  window.JopamsState={KEY,load,save,get,set,patch,migrate};
})();
