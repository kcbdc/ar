'use strict';
(()=>{
const $=id=>document.getElementById(id),api=()=>window.JopamsAuth?JopamsAuth.apiBase():'';
let socialMode=false,socialOverlays=[],socialItems=[],selectedSocialFile=null,selectedPreviewUrl=null;
let cameraStream=null,cameraFacing='environment',cameraStarting=false;
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function headers(){return window.JopamsAuth?JopamsAuth.authHeaders():{}}
function nearestCP(lat,lng){let best=null;CHECKPOINTS.forEach((c,i)=>{const d=distMeters(lat,lng,c.lat,c.lng);if(!best||d<best.d)best={i,d,cp:c}});return best}
function clearSocial(){socialOverlays.forEach(x=>x.setMap(null));socialOverlays=[]}
function setGameMarkers(on){markers.forEach(m=>m.setMap(on?map:null))}
function group(items){const m=new Map();items.forEach(x=>{const key=x.checkpoint_id!==null&&x.checkpoint_id!==undefined?'cp:'+x.checkpoint_id:'geo:'+Number(x.latitude).toFixed(4)+','+Number(x.longitude).toFixed(4);if(!m.has(key))m.set(key,[]);m.get(key).push(x)});return [...m.values()]}
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
function closeAll(){document.querySelectorAll('.social-modal').forEach(x=>x.classList.remove('show'));closeCamera()}
function openUpload(){
 const u=JopamsAuth.user&&JopamsAuth.user();
 if(!u||u.provider==='guest'){if(window.showToast)showToast('사진 등록은 카카오·네이버 로그인 후 이용할 수 있어요',{variant:'error'});return}
 if(!cur){if(window.showToast)showToast('GPS 위치 확인 후 사진을 등록할 수 있어요',{variant:'error'});return}
 const n=nearestCP(cur.lat,cur.lng);
 $('socialLocationNote').textContent='📍 현재 위치 · GPS ±'+Math.round(cur.accuracy||0)+'m'+(n?' · 가장 가까운 탐험 포인트 '+Math.round(n.d)+'m':'');
 $('socialUploadModal').classList.add('show');
}
function canvasBlob(canvas,quality){
 return new Promise((resolve,reject)=>{
  const done=b=>b?resolve(b):reject(Error('image_encode_failed'));
  try{canvas.toBlob(b=>{if(b&&b.size){resolve(b);return}canvas.toBlob(done,'image/jpeg',Math.min(.84,quality+.08))},'image/webp',quality)}
  catch(_){canvas.toBlob(done,'image/jpeg',Math.min(.84,quality+.08))}
 });
}
async function decodeImage(file){
 if(window.createImageBitmap){
  try{
   const bmp=await createImageBitmap(file);
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
 $('socialPreview').innerHTML='<span class="social-upload-picker-icon" aria-hidden="true">📷</span><strong>사진 촬영 또는 선택</strong><small>누르면 카메라가 열립니다 · 카메라 왼쪽 아래에서 앨범 선택 가능</small>';
}
function selectSocialPhoto(file){
 if(!file)return;
 if(!String(file.type||'').startsWith('image/')){if(window.showToast)showToast('이미지 파일만 선택할 수 있습니다',{variant:'error'});return}
 selectedSocialFile=file;
 if(selectedPreviewUrl)URL.revokeObjectURL(selectedPreviewUrl);
 selectedPreviewUrl=URL.createObjectURL(file);
 $('socialPreview').innerHTML='';
 $('socialPreview').style.backgroundImage='url("'+selectedPreviewUrl+'")';
}
async function submit(e){
 e.preventDefault();
 const file=selectedSocialFile;
 if(!file||!cur){if(window.showToast)showToast('먼저 사진을 촬영하거나 앨범에서 선택해주세요',{variant:'error'});return}
 const b=$('socialSubmit');b.disabled=true;b.textContent='사진 최적화 중…';
 try{
  const n=nearestCP(cur.lat,cur.lng);
  let photo=await compressImage(file,1280,.72),thumb=await compressImage(file,320,.66);
  if(photo.size>900*1024)photo=await compressImage(file,1024,.58);
  if(photo.size>900*1024)throw Error('compressed_photo_too_large');
  if(thumb.size>220*1024)thumb=await compressImage(file,240,.55);
  const fd=new FormData();
  fd.append('photo',photo,photo.type==='image/jpeg'?'photo.jpg':'photo.webp');
  fd.append('thumbnail',thumb,thumb.type==='image/jpeg'?'thumb.jpg':'thumb.webp');
  fd.append('latitude',String(cur.lat));fd.append('longitude',String(cur.lng));
  fd.append('accuracy',String(cur.accuracy||999));fd.append('caption',$('socialCaption').value||'');
  if(n&&n.d<=30)fd.append('checkpoint_id',String(n.i));
  b.textContent='등록 중…';
  const r=await fetch(api()+'/api/social/photos',{method:'POST',headers:headers(),body:fd,cache:'no-store'});
  const j=await r.json().catch(()=>({}));
  if(!r.ok||!j.ok)throw Error(j.error||(j.detail?String(j.detail):'upload_failed'));
  closeAll();$('socialUploadForm').reset();resetSelectedPhoto();
  if(window.showToast)showToast('탐험 사진이 지도에 등록되었습니다',{variant:'near'});
  await loadSocial();
 }catch(err){
  console.error('[social upload]',err);
  const code=String(err&&err.message||'upload_failed');
  let msg='사진 등록에 실패했습니다';
  if(code.includes('too_large'))msg='사진 용량을 줄이지 못했습니다. 다른 사진을 선택해주세요';
  else if(code==='unauthorized')msg='로그인이 만료되었습니다. 다시 로그인해주세요';
  else if(code==='db_error')msg='사진 저장소(D1) 설정을 확인해주세요';
  if(window.showToast)showToast(msg,{variant:'error'});
 }finally{b.disabled=false;b.textContent='지도에 등록'}
}

/* ---------- in-app camera: Android Chrome/Edge/Samsung + iOS Safari/WKWebView ---------- */
function stopCameraStream(){
 if(cameraStream){cameraStream.getTracks().forEach(t=>{try{t.stop()}catch(_){}});cameraStream=null}
 const v=$('socialCameraVideo');if(v){v.pause();v.srcObject=null}
}
function closeCamera(){
 stopCameraStream();
 const m=$('socialCameraModal');if(m){m.classList.remove('show');m.setAttribute('aria-hidden','true')}
}
async function startCamera(){
 if(cameraStarting)return;
 cameraStarting=true;
 const modal=$('socialCameraModal'),video=$('socialCameraVideo');
 modal.classList.add('show');modal.setAttribute('aria-hidden','false');
 stopCameraStream();
 try{
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)throw Error('media_devices_unavailable');
  const constraints={audio:false,video:{facingMode:{ideal:cameraFacing},width:{ideal:1920},height:{ideal:1080}}};
  cameraStream=await navigator.mediaDevices.getUserMedia(constraints);
  video.srcObject=cameraStream;
  await video.play();
 }catch(err){
  console.warn('[camera fallback]',err);
  closeCamera();
  // Native camera fallback. capture=environment opens camera directly.
  $('socialCameraFile').value='';
  $('socialCameraFile').click();
 }finally{cameraStarting=false}
}
async function flipCamera(){
 cameraFacing=cameraFacing==='environment'?'user':'environment';
 await startCamera();
}
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
  const file=new File([blob],'camera-'+Date.now()+(blob.type==='image/jpeg'?'.jpg':'.webp'),{type:blob.type||'image/webp'});
  selectSocialPhoto(file);closeCamera();
 }catch(e){console.error(e);if(window.showToast)showToast('사진 촬영에 실패했습니다',{variant:'error'})}
}
function openGalleryPicker(){
 closeCamera();
 const f=$('socialGalleryFile');f.value='';f.click();
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
$('socialGalleryOpen').onclick=openGalleryPicker;
$('socialGalleryFile').addEventListener('change',()=>selectSocialPhoto($('socialGalleryFile').files&&$('socialGalleryFile').files[0]));
$('socialCameraFile').addEventListener('change',()=>selectSocialPhoto($('socialCameraFile').files&&$('socialCameraFile').files[0]));
$('socialUploadForm').onsubmit=submit;
document.querySelectorAll('[data-social-close]').forEach(b=>b.onclick=closeAll);
document.querySelectorAll('.social-modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)closeAll()}));
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopCameraStream()});
window.addEventListener('pagehide',stopCameraStream);
})();
