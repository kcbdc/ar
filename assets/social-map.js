'use strict';
(()=>{
const $=id=>document.getElementById(id),api=()=>window.JopamsAuth?JopamsAuth.apiBase():'';
let socialMode=false,socialOverlays=[],socialItems=[],selectedSocialFile=null,selectedPreviewUrl=null;
let cameraStream=null,cameraFacing='environment',cameraStarting=false,uploading=false;

const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function headers(){return window.JopamsAuth?JopamsAuth.authHeaders():{}}
function nearestCP(lat,lng){let best=null;CHECKPOINTS.forEach((c,i)=>{const d=distMeters(lat,lng,c.lat,c.lng);if(!best||d<best.d)best={i,d,cp:c}});return best}
function clearSocial(){socialOverlays.forEach(x=>x.setMap(null));socialOverlays=[]}
function setGameMarkers(on){markers.forEach(m=>m.setMap(on?map:null))}
function group(items){const m=new Map();items.forEach(x=>{const key=x.checkpoint_id!==null&&x.checkpoint_id!==undefined?'cp:'+x.checkpoint_id:'geo:'+Number(x.latitude).toFixed(4)+','+Number(x.longitude).toFixed(4);if(!m.has(key))m.set(key,[]);m.get(key).push(x)});return [...m.values()]}

function setProgress(pct,text,detail){
 const box=$('socialUploadProgress'),bar=$('socialProgressBar'),num=$('socialProgressPct'),title=$('socialProgressText'),sub=$('socialProgressDetail');
 box.hidden=false;
 const n=Math.max(0,Math.min(100,Math.round(Number(pct)||0)));
 bar.style.width=n+'%';num.textContent=n+'%';title.textContent=text||'처리 중…';sub.textContent=detail||'';
}
function resetProgress(){
 const box=$('socialUploadProgress');box.hidden=true;
 $('socialProgressBar').style.width='0%';$('socialProgressPct').textContent='0%';
}
async function loadSocial(){
 if(!map||!window.kakao)return;
 clearSocial();
 try{
  const r=await fetch(api()+'/api/social/photos',{headers:headers(),cache:'no-store'});
  const j=await r.json();
  if(!r.ok)throw Error(j.error||'load_failed');
  socialItems=j.items||[];
  group(socialItems).forEach(g=>{
   const a=g[0],cp=a.checkpoint_id!==null&&a.checkpoint_id!==undefined&&Number.isInteger(Number(a.checkpoint_id))?CHECKPOINTS[Number(a.checkpoint_id)]:null;
   const lat=cp?cp.lat:Number(a.latitude),lng=cp?cp.lng:Number(a.longitude);
   const el=document.createElement('button');el.type='button';el.className='social-photo-marker';
   el.innerHTML='<img alt="탐험 사진"><b>'+g.length+'</b>';
   el.querySelector('img').src=a.thumbnailUrl||a.imageUrl;
   el.onclick=()=>openGallery(g);
   const ov=new kakao.maps.CustomOverlay({position:new kakao.maps.LatLng(lat,lng),content:el,yAnchor:.5,xAnchor:.5});
   ov.setMap(map);socialOverlays.push(ov);
  });
  if(!socialItems.length&&window.showToast)showToast('아직 등록된 탐험 사진이 없습니다. 첫 기록을 남겨보세요!');
 }catch(e){console.error('[social load]',e);if(window.showToast)showToast('소셜 사진을 불러오지 못했습니다',{variant:'error'})}
}
function switchMode(social){
 socialMode=social;$('mapTabBtn').classList.toggle('active',!social);$('socialTabBtn').classList.toggle('active',social);
 $('socialToolbar').classList.toggle('show',social);$('gameMapPanels').hidden=social;$('socialIntro').hidden=!social;
 setGameMarkers(!social);if(social)loadSocial();else clearSocial();
}
function openGallery(items){
 const cp=items[0]&&items[0].checkpoint_id!==null&&items[0].checkpoint_id!==undefined&&Number.isInteger(Number(items[0].checkpoint_id))?CHECKPOINTS[Number(items[0].checkpoint_id)]:null;
 $('socialGalleryTitle').textContent=cp?'이 탐험 포인트의 기록 '+items.length+'개':'이 위치의 탐험 기록 '+items.length+'개';
 $('socialGallery').innerHTML=items.map(x=>'<article class="social-card"><img src="'+esc(x.imageUrl)+'" alt="탐험 기록 사진" loading="lazy"><div><b>'+esc(x.nickname||'원정대원')+'</b><small>'+esc(x.caption||'탐험 기록')+'</small></div></article>').join('')||'<div class="social-empty">사진이 없습니다.</div>';
 $('socialGalleryModal').classList.add('show');
}
function closeAll(){
 if(uploading)return;
 document.querySelectorAll('.social-modal').forEach(x=>x.classList.remove('show'));closeCamera()
}
function openUpload(){
 const u=JopamsAuth.user&&JopamsAuth.user();
 if(!u||u.provider==='guest'){if(window.showToast)showToast('사진 등록은 카카오·네이버 로그인 후 이용할 수 있어요',{variant:'error'});return}
 if(!cur){if(window.showToast)showToast('GPS 위치 확인 후 사진을 등록할 수 있어요',{variant:'error'});return}
 const n=nearestCP(cur.lat,cur.lng);
 $('socialLocationNote').textContent='📍 현재 위치 · GPS ±'+Math.round(cur.accuracy||0)+'m'+(n?' · 가장 가까운 탐험 포인트 '+Math.round(n.d)+'m':'');
 resetProgress();$('socialUploadModal').classList.add('show');
}
function canvasBlob(canvas,quality){
 return new Promise((resolve,reject)=>{
  const jpeg=()=>canvas.toBlob(b=>b?resolve(b):reject(Error('image_encode_failed')),'image/jpeg',Math.min(.84,quality+.08));
  try{canvas.toBlob(b=>{if(b&&b.size){resolve(b);return}jpeg()},'image/webp',quality)}catch(_){jpeg()}
 });
}
async function decodeImage(file){
 if(window.createImageBitmap){
  try{
   const bmp=await createImageBitmap(file,{imageOrientation:'from-image'});
   return {width:bmp.width,height:bmp.height,draw:(ctx,w,h)=>ctx.drawImage(bmp,0,0,w,h),close:()=>bmp.close&&bmp.close()};
  }catch(_){}
 }
 const url=URL.createObjectURL(file);
 try{
  const img=await new Promise((resolve,reject)=>{const x=new Image();x.onload=()=>resolve(x);x.onerror=()=>reject(Error('image_decode_failed'));x.src=url});
  return {width:img.naturalWidth||img.width,height:img.naturalHeight||img.height,draw:(ctx,w,h)=>ctx.drawImage(img,0,0,w,h),close:()=>{}};
 }finally{setTimeout(()=>URL.revokeObjectURL(url),0)}
}
async function compressImage(file,maxSide,quality){
 const src=await decodeImage(file);
 try{
  const scale=Math.min(1,maxSide/Math.max(src.width,src.height)),w=Math.max(1,Math.round(src.width*scale)),h=Math.max(1,Math.round(src.height*scale));
  const c=document.createElement('canvas');c.width=w;c.height=h;
  const ctx=c.getContext('2d',{alpha:false});ctx.fillStyle='#000';ctx.fillRect(0,0,w,h);src.draw(ctx,w,h);
  return await canvasBlob(c,quality);
 }finally{src.close()}
}
function resetSelectedPhoto(){
 selectedSocialFile=null;
 if(selectedPreviewUrl){URL.revokeObjectURL(selectedPreviewUrl);selectedPreviewUrl=null}
 $('socialPreview').style.backgroundImage='';
 $('socialPreview').innerHTML='<span class="social-upload-picker-icon" aria-hidden="true">📷</span><strong>사진 촬영 또는 선택</strong><small>누르면 카메라가 열립니다 · 왼쪽 아래 앨범에서 기존 사진도 선택 가능</small>';
 resetProgress();
}
function selectSocialPhoto(file){
 if(!file)return;
 if(!String(file.type||'').startsWith('image/')){if(window.showToast)showToast('이미지 파일만 선택할 수 있습니다',{variant:'error'});return}
 selectedSocialFile=file;
 if(selectedPreviewUrl)URL.revokeObjectURL(selectedPreviewUrl);
 selectedPreviewUrl=URL.createObjectURL(file);
 $('socialPreview').innerHTML='';
 $('socialPreview').style.backgroundImage='url("'+selectedPreviewUrl+'")';
 resetProgress();
 if(window.showToast)showToast('사진이 선택되었습니다. 내용을 확인한 뒤 지도에 등록하세요.');
}
function xhrUpload(url,fd,auth,onProgress){
 return new Promise((resolve,reject)=>{
  const xhr=new XMLHttpRequest();
  xhr.open('POST',url,true);
  Object.entries(auth||{}).forEach(([k,v])=>{if(String(k).toLowerCase()!=='content-type')xhr.setRequestHeader(k,v)});
  xhr.upload.onprogress=e=>{
   if(e.lengthComputable&&onProgress)onProgress(e.loaded/e.total);
  };
  xhr.onerror=()=>reject(Error('network_error'));
  xhr.ontimeout=()=>reject(Error('upload_timeout'));
  xhr.timeout=45000;
  xhr.onload=()=>{
   let j={};try{j=JSON.parse(xhr.responseText||'{}')}catch(_){}
   if(xhr.status>=200&&xhr.status<300&&j.ok)resolve(j);
   else reject(Error(j.error||(j.detail?String(j.detail):'HTTP_'+xhr.status)));
  };
  xhr.send(fd);
 });
}
async function submit(e){
 e.preventDefault();
 const file=selectedSocialFile;
 if(uploading)return;
 if(!file||!cur){if(window.showToast)showToast('먼저 사진을 촬영하거나 앨범에서 선택해주세요',{variant:'error'});return}
 const b=$('socialSubmit');uploading=true;b.disabled=true;
 try{
  setProgress(5,'사진 확인 중…','선택한 이미지를 읽고 있습니다.');
  await new Promise(r=>setTimeout(r,20));
  setProgress(18,'사진 최적화 중…','지도용 사진 크기를 줄이고 있습니다.');
  let photo=await compressImage(file,1280,.72);
  setProgress(36,'썸네일 생성 중…','지도에서 빠르게 표시할 미리보기를 만들고 있습니다.');
  let thumb=await compressImage(file,320,.66);
  if(photo.size>900*1024){setProgress(47,'사진 추가 압축 중…','용량을 안전한 범위로 줄이고 있습니다.');photo=await compressImage(file,1024,.58)}
  if(photo.size>900*1024)throw Error('compressed_photo_too_large');
  if(thumb.size>220*1024)thumb=await compressImage(file,240,.55);
  const n=nearestCP(cur.lat,cur.lng),fd=new FormData();
  fd.append('photo',photo,photo.type==='image/jpeg'?'photo.jpg':'photo.webp');
  fd.append('thumbnail',thumb,thumb.type==='image/jpeg'?'thumb.jpg':'thumb.webp');
  fd.append('latitude',String(cur.lat));fd.append('longitude',String(cur.lng));
  fd.append('accuracy',String(cur.accuracy||999));fd.append('caption',$('socialCaption').value||'');
  if(n&&n.d<=30)fd.append('checkpoint_id',String(n.i));
  setProgress(55,'서버로 전송 중…','네트워크 상태에 따라 잠시 걸릴 수 있습니다.');
  await xhrUpload(api()+'/api/social/photos',fd,headers(),ratio=>{
    setProgress(55+Math.round(ratio*35),'서버로 전송 중…',Math.round(ratio*100)+'% 전송');
  });
  setProgress(94,'D1에 저장 확인 중…','사진 등록을 마무리하고 있습니다.');
  await new Promise(r=>setTimeout(r,120));
  setProgress(100,'등록 완료','지도의 소셜 사진을 새로고침합니다.');
  $('socialUploadForm').reset();resetSelectedPhoto();
  document.querySelectorAll('.social-modal').forEach(x=>x.classList.remove('show'));
  if(window.showToast)showToast('탐험 사진이 지도에 등록되었습니다',{variant:'near'});
  await loadSocial();
 }catch(err){
  console.error('[social upload]',err);
  const code=String(err&&err.message||'upload_failed');
  setProgress(0,'등록 실패','오류: '+code);
  let msg='사진 등록에 실패했습니다';
  if(code.includes('too_large'))msg='사진 용량을 줄이지 못했습니다. 다른 사진을 선택해주세요';
  else if(code==='unauthorized')msg='로그인이 만료되었습니다. 다시 로그인해주세요';
  else if(code==='social_login_required')msg='게스트가 아닌 소셜 로그인이 필요합니다';
  else if(code==='db_error')msg='D1 사진 테이블/Worker 배포 상태를 확인해주세요';
  else if(code==='network_error'||code==='upload_timeout')msg='네트워크 연결이 불안정합니다. 다시 시도해주세요';
  if(window.showToast)showToast(msg,{variant:'error'});
 }finally{
  uploading=false;b.disabled=false;b.textContent='지도에 등록';
 }
}

/* ---------- camera ---------- */
function stopCameraStream(){
 if(cameraStream){cameraStream.getTracks().forEach(t=>{try{t.stop()}catch(_){}});cameraStream=null}
 const v=$('socialCameraVideo');if(v){try{v.pause()}catch(_){}v.srcObject=null}
}
function closeCamera(){
 stopCameraStream();
 const m=$('socialCameraModal');if(m){m.classList.remove('show');m.setAttribute('aria-hidden','true')}
}
async function startCamera(){
 if(cameraStarting)return;
 cameraStarting=true;
 const modal=$('socialCameraModal'),video=$('socialCameraVideo');
 modal.classList.add('show');modal.setAttribute('aria-hidden','false');stopCameraStream();
 try{
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)throw Error('media_devices_unavailable');
  cameraStream=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:cameraFacing},width:{ideal:1920},height:{ideal:1080}}});
  video.srcObject=cameraStream;video.setAttribute('playsinline','');await video.play();
 }catch(err){
  console.warn('[camera fallback]',err);closeCamera();
  const f=$('socialCameraFile');f.value='';f.click();
 }finally{cameraStarting=false}
}
async function flipCamera(){cameraFacing=cameraFacing==='environment'?'user':'environment';await startCamera()}
async function captureFrame(){
 const v=$('socialCameraVideo');
 if(!v||!v.videoWidth||!v.videoHeight){if(window.showToast)showToast('카메라 준비 중입니다. 잠시 후 다시 눌러주세요',{variant:'error'});return}
 const maxSide=1920,scale=Math.min(1,maxSide/Math.max(v.videoWidth,v.videoHeight));
 const c=document.createElement('canvas');c.width=Math.max(1,Math.round(v.videoWidth*scale));c.height=Math.max(1,Math.round(v.videoHeight*scale));
 const ctx=c.getContext('2d',{alpha:false});
 if(cameraFacing==='user'){ctx.translate(c.width,0);ctx.scale(-1,1)}
 ctx.drawImage(v,0,0,c.width,c.height);
 try{
  const blob=await canvasBlob(c,.90);
  selectSocialPhoto(blob);closeCamera();
 }catch(e){console.error(e);if(window.showToast)showToast('사진 촬영에 실패했습니다',{variant:'error'})}
}

/* ---------- bindings ---------- */
$('mapTabBtn').onclick=()=>switchMode(false);
$('socialTabBtn').onclick=()=>switchMode(true);
$('socialRefresh').onclick=loadSocial;
$('socialUploadOpen').onclick=openUpload;
$('socialPreview').onclick=startCamera;
$('socialPreview').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();startCamera()}});
$('socialCameraClose').onclick=closeCamera;
$('socialCameraFlip').onclick=flipCamera;
$('socialCameraShutter').onclick=captureFrame;
/* 앨범 버튼은 <label for="socialGalleryFile">이므로 iOS/Android 모두 브라우저 기본 선택기를 직접 연다. */
$('socialGalleryFile').addEventListener('change',()=>{
 const f=$('socialGalleryFile').files&&$('socialGalleryFile').files[0];
 stopCameraStream();$('socialCameraModal').classList.remove('show');
 if(f)selectSocialPhoto(f);
});
$('socialCameraFile').addEventListener('change',()=>{
 const f=$('socialCameraFile').files&&$('socialCameraFile').files[0];
 if(f)selectSocialPhoto(f);
});
$('socialUploadForm').onsubmit=submit;
document.querySelectorAll('[data-social-close]').forEach(b=>b.onclick=closeAll);
document.querySelectorAll('.social-modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)closeAll()}));
document.addEventListener('visibilitychange',()=>{if(document.hidden&&!uploading)stopCameraStream()});
window.addEventListener('pagehide',()=>{if(!uploading)stopCameraStream()});
})();
