'use strict';
window.__JOPAMS_AUTH_VERSION__='59';
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
  async function verify(timeoutMs=6500){
    const t=token();if(!t)return null;
    const ctrl=typeof AbortController!=='undefined'?new AbortController():null;
    const timer=ctrl?setTimeout(()=>ctrl.abort(),timeoutMs):null;
    try{
      const r=await fetch(apiBase()+'/api/auth/me',{headers:authHeaders(),cache:'no-store',signal:ctrl?ctrl.signal:undefined});
      if(!r.ok){if(r.status===401)clear();return null}
      const j=await r.json();if(j&&j.user){save(t,j.user);return j.user}
    }catch(_){
      // Network/timeout: remembered session may continue offline.
      return user();
    }finally{if(timer)clearTimeout(timer)}
    return null;
  }
  async function logout(){
    const t=token();try{if(t)await fetch(apiBase()+'/api/auth/logout',{method:'POST',headers:authHeaders()})}catch(_){}
    clear();location.replace('/auth?loggedout=1');
  }
  function login(provider,returnTo='index.html'){
    try{sessionStorage.setItem(RETURN_KEY,returnTo)}catch(_){}
    const u=new URL(apiBase()+'/api/auth/start');u.searchParams.set('provider',provider);u.searchParams.set('return_to',location.origin+'/auth');location.href=u.toString();
  }
  function isAuthPage(){
    const p=(location.pathname||'/').replace(/\/+$/,'').split('/').pop()||'';
    return p==='auth'||p==='auth.html';
  }
  function isPrivacyPage(){
    const p=(location.pathname||'/').replace(/\/+$/,'').split('/').pop()||'';
    return p==='privacy'||p==='privacy.html';
  }
  function consumeCallback(){
    if(!isAuthPage())return false;
    const hash=new URLSearchParams(location.hash.replace(/^#/,'')),t=hash.get('session'),raw=hash.get('user');
    if(!t)return false;
    let u=null;try{u=raw?JSON.parse(decodeURIComponent(raw)):null}catch(_){}
    if(!save(t,u))return false;
    history.replaceState(null,'',location.pathname+'?login=ok');
    let next='index.html';try{next=sessionStorage.getItem(RETURN_KEY)||next;sessionStorage.removeItem(RETURN_KEY)}catch(_){}
    location.replace(next);return true;
  }
  function gate(){
    const rawPath=(location.pathname||'/').replace(/\/+$/,'');
    const page=rawPath.split('/').pop()||'index.html';
    if(isAuthPage()||isPrivacyPage())return;
    if(!token()){
      try{sessionStorage.setItem(RETURN_KEY,page+location.search+location.hash)}catch(_){}
      location.replace('/auth');
      return;
    }
    verify().then(u=>{if(!u&&!token())location.replace('auth.html?expired=1')});
  }
  window.JopamsAuth={apiBase,token,user,save,clear,authHeaders,verify,logout,login,consumeCallback,gate,isAuthPage};
  gate();
})();