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
    try{
      const r=await fetch(apiBase()+'/api/auth/me',{headers:authHeaders(),cache:'no-store'});
      if(!r.ok){if(r.status===401)clear();return null}
      const j=await r.json();if(j&&j.user){save(t,j.user);return j.user}
    }catch(_){return user()}
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
    const page=location.pathname.split('/').pop()||'index.html';
    if(page==='auth.html'||page==='privacy.html')return;
    if(!token()){try{sessionStorage.setItem(RETURN_KEY,page+location.search+location.hash)}catch(_){}location.replace('auth.html');return}
    verify().then(u=>{if(!u&&!token())location.replace('auth.html?expired=1')});
  }
  window.JopamsAuth={apiBase,token,user,save,clear,authHeaders,verify,logout,login,consumeCallback,gate};
  gate();
})();