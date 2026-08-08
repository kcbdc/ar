// 조팸스 GO v17 · Cloudflare Workers + D1 랭킹 API
// D1 binding: DB. 실시간 GPS/카메라/센서 원본값은 받지 않습니다.
// v17: 인증 없는 오픈 API의 최소 방어선을 추가했습니다.
//  - 동일 (name, org) 조합은 최소 3초 간격으로만 갱신 허용 (연타 스팸 방지)
//  - 한 번에 올릴 수 있는 점수 증가폭에 상한(MAX_DELTA)을 두어, 스크립트로 점수를
//    한 번에 최댓값까지 밀어 넣는 것을 어렵게 함 (완벽한 인증 대체재는 아님)
//  - 신규 진입자의 최초 제출값에도 합리적 상한(INITIAL_CAP)을 둠
const MIN_INTERVAL_MS=3000;
const MAX_DELTA=1500;
const INITIAL_CAP=6000;
const json=(data,status=200,headers={})=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json;charset=UTF-8',...headers}});
export default {async fetch(req,env){const u=new URL(req.url);const allow=env.ALLOWED_ORIGIN||'*';const h={'access-control-allow-origin':allow,'access-control-allow-methods':'GET,POST,OPTIONS','access-control-allow-headers':'content-type','cache-control':'no-store'};if(req.method==='OPTIONS')return new Response(null,{status:204,headers:h});if(u.pathname==='/health')return json({ok:true,service:'jopams-go-ranking',version:'v17'},200,h);
if(u.pathname==='/api/score'&&req.method==='POST'){
  let b;try{b=await req.json()}catch{return json({ok:false,error:'invalid_json'},400,h)}
  const name=String(b.name||'원정대원').replace(/[<>]/g,'').trim().slice(0,30)||'원정대원';
  const org=String(b.org||'본사').replace(/[<>]/g,'').trim().slice(0,30)||'본사';
  let score=Math.min(99999999,Math.max(0,Math.floor(Number(b.score)||0)));
  const existing=await env.DB.prepare('SELECT score,updated_at FROM scores WHERE name=? AND org=?').bind(name,org).first();
  if(existing){
    const lastMs=Date.parse(String(existing.updated_at).replace(' ','T')+'Z');
    if(Number.isFinite(lastMs)&&(Date.now()-lastMs)<MIN_INTERVAL_MS){
      return json({ok:false,error:'rate_limited'},429,h);
    }
    const allowedMax=Number(existing.score||0)+MAX_DELTA;
    if(score>allowedMax)score=allowedMax;
  }else{
    if(score>INITIAL_CAP)score=INITIAL_CAP;
  }
  await env.DB.prepare('INSERT INTO scores(name,org,score,updated_at) VALUES(?,?,?,CURRENT_TIMESTAMP) ON CONFLICT(name,org) DO UPDATE SET score=MAX(score,excluded.score),updated_at=CURRENT_TIMESTAMP').bind(name,org,score).run();
  return json({ok:true,score},200,h)
}
if(u.pathname==='/api/leaderboard'&&req.method==='GET'){const {results}=await env.DB.prepare('SELECT name,org,score,updated_at FROM scores ORDER BY score DESC,updated_at ASC LIMIT 100').all();return json({items:results||[]},200,h)}
return json({ok:false,error:'not_found'},404,h)}}