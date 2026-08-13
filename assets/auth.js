/* 조팸스 GO v55 - Kakao/Naver persistent account authentication */
(()=>{
  const TOKEN_KEY='jopams_auth_token_v1',USER_KEY='jopams_auth_user_v1',RETURN_KEY='jopams_auth_return_v1';
  const API_FALLBACK='https://jofams-go.junewoopark16.workers.dev';
  const apiBase=()=>{try{const v=JSON.parse(localStorage.getItem('jopams_v3')||'{}');return String(v.serverUrl||API_FALLBACK).replace(/\/$/,'')}catch(_){return API_FALLBACK}};
  const token=()=>{try{return localStorage.getItem(TOKEN_KEY)||''}catch(_){return''}};
  const user=()=>{try{return JSON.parse(localStorage.getItem(USER_KEY)||'null')}catch(_){return null}};
  const save=(t,u)=>{try{if(t)localStorage.setItem(TOKEN_KEY,t);if(u)localStorage.setItem(USER_KEY,JSON.stringify(u));return true}catch(_){return false}};
  const clear=()=>{try{localStorage.removeItem(TOKEN_KEY);localStorage.removeItem(USER_KEY)}catch(_){}};
  const authHeaders=(extra={})=>token()?{...extra,Authorization:'Bearer '+token()}:extra;
  async function verify(){
    const t=token();if(!t)return null;
    // v58: 서버 응답이 없거나 매우 느린 경우(네트워크 불안정, 워커 다운 등) verify()가
    // 영원히 pending 상태로 남아 화면 전환/렌더링을 기다리는 코드가 계속 대기하게 되는
    // 문제가 있었다. 8초 안에 응답이 없으면 요청을 중단하고 캐시된 사용자로 폴백한다.
    const ctrl=(typeof AbortController!=='undefined')?new AbortController():null;
    const timer=ctrl?setTimeout(()=>{try{ctrl.abort()}catch(_){}},8000):null;
    try{
      const r=await fetch(apiBase()+'/api/auth/me',{headers:authHeaders(),cache:'no-store',signal:ctrl?ctrl.signal:undefined});
      if(!r.ok){if(r.status===401)clear();return null}
      const j=await r.json();if(j&&j.user){save(t,j.user);return j.user}
    }catch(_){return user()}
    finally{if(timer)clearTimeout(timer)}
    return null;
  }
  async function logout(){
    const t=token();try{if(t)await fetch(apiBase()+'/api/auth/logout',{method:'POST',headers:authHeaders()})}catch(_){}
    clear();location.replace('auth.html?loggedout=1');
  }
  function login(provider,returnTo='index.html'){
    try{sessionStorage.setItem(RETURN_KEY,returnTo)}catch(_){}
    const u=new URL(apiBase()+'/api/auth/start');u.searchParams.set('provider',provider);u.searchParams.set('return_to',location.origin+'/auth.html');location.href=u.toString();
  }
  function consumeCallback(){
    if((location.pathname.split('/').pop()||'')!=='auth.html')return false;
    const hash=new URLSearchParams(location.hash.replace(/^#/,'')),t=hash.get('session'),raw=hash.get('user');
    if(!t)return false;
    let u=null;try{u=raw?JSON.parse(decodeURIComponent(raw)):null}catch(_){}
    if(!save(t,u))return false;
    history.replaceState(null,'',location.pathname+'?login=ok');
    let next='index.html';try{next=sessionStorage.getItem(RETURN_KEY)||next;sessionStorage.removeItem(RETURN_KEY)}catch(_){}
    location.replace(next);return true;
  }
  function gate(){
    // v58: 어떤 이유로든(예상 못한 예외) 이 함수가 던지면 로그인 판단 자체가 안 되고
    // 화면도 아무 처리 없이 멈출 수 있었다. 문제가 생겨도 최소한 로그인 화면으로는
    // 보낼 수 있도록 전체를 try/catch로 감싼다.
    try{
      const page=location.pathname.split('/').pop()||'index.html';
      if(page==='auth.html'||page==='privacy.html')return;
      if(!token()){try{sessionStorage.setItem(RETURN_KEY,page+location.search+location.hash)}catch(_){}location.replace('auth.html');return}
      verify().then(u=>{if(!u&&!token())location.replace('auth.html?expired=1')}).catch(()=>{});
    }catch(_){
      try{location.replace('auth.html?error=1')}catch(__){}
    }
  }
  window.JopamsAuth={apiBase,token,user,save,clear,authHeaders,verify,logout,login,consumeCallback,gate};
  gate();
})();