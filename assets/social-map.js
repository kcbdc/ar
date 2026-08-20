'use strict';
(()=>{
const $=id=>document.getElementById(id),api=()=>window.JopamsAuth?JopamsAuth.apiBase():'';let socialMode=false,socialOverlays=[],socialItems=[],selectedSocialFile=null,selectedPreviewUrl=null;
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function headers(){return window.JopamsAuth?JopamsAuth.authHeaders():{}}
function nearestCP(lat,lng){let best=null;CHECKPOINTS.forEach((c,i)=>{const d=distMeters(lat,lng,c.lat,c.lng);if(!best||d<best.d)best={i,d,cp:c}});return best}
function clearSocial(){socialOverlays.forEach(x=>x.setMap(null));socialOverlays=[]}
function setGameMarkers(on){markers.forEach(m=>m.setMap(on?map:null))}
function group(items){const m=new Map();items.forEach(x=>{const key=x.checkpoint_id!==null&&x.checkpoint_id!==undefined?'cp:'+x.checkpoint_id:'geo:'+x.latitude.toFixed(4)+','+x.longitude.toFixed(4);if(!m.has(key))m.set(key,[]);m.get(key).push(x)});return [...m.values()]}
async function loadSocial(){if(!map||!window.kakao)return;clearSocial();try{const r=await fetch(api()+'/api/social/photos',{headers:headers(),cache:'no-store'});const j=await r.json();if(!r.ok)throw Error(j.error||'load_failed');socialItems=j.items||[];group(socialItems).forEach(g=>{const a=g[0],cp=a.checkpoint_id!==null&&a.checkpoint_id!==undefined&&Number.isInteger(Number(a.checkpoint_id))?CHECKPOINTS[Number(a.checkpoint_id)]:null,lat=cp?cp.lat:Number(a.latitude),lng=cp?cp.lng:Number(a.longitude);const el=document.createElement('button');el.type='button';el.className='social-photo-marker';el.innerHTML='<img alt="탐험 사진"><b>'+g.length+'</b>';el.querySelector('img').src=a.thumbnailUrl||a.imageUrl;el.onclick=()=>openGallery(g);const ov=new kakao.maps.CustomOverlay({position:new kakao.maps.LatLng(lat,lng),content:el,yAnchor:.5,xAnchor:.5});ov.setMap(map);socialOverlays.push(ov)});if(!socialItems.length&&window.showToast)showToast('아직 등록된 탐험 사진이 없습니다. 첫 기록을 남겨보세요!')}catch(e){console.error(e);if(window.showToast)showToast('소셜 사진을 불러오지 못했습니다',{variant:'error'})}}
function switchMode(social){socialMode=social;$('mapTabBtn').classList.toggle('active',!social);$('socialTabBtn').classList.toggle('active',social);$('socialToolbar').classList.toggle('show',social);$('gameMapPanels').hidden=social;$('socialIntro').hidden=!social;setGameMarkers(!social);if(social)loadSocial();else clearSocial()}
function openGallery(items){const cp=items[0]&&items[0].checkpoint_id!==null&&items[0].checkpoint_id!==undefined&&Number.isInteger(Number(items[0].checkpoint_id))?CHECKPOINTS[Number(items[0].checkpoint_id)]:null;$('socialGalleryTitle').textContent=cp?'이 탐험 포인트의 기록 '+items.length+'개':'이 위치의 탐험 기록 '+items.length+'개';$('socialGallery').innerHTML=items.map(x=>'<article class="social-card"><img src="'+esc(x.imageUrl)+'" alt="탐험 기록 사진" loading="lazy"><div><b>'+esc(x.nickname||'원정대원')+'</b><small>'+esc(x.caption||'탐험 기록')+'</small></div></article>').join('')||'<div class="social-empty">사진이 없습니다.</div>';$('socialGalleryModal').classList.add('show')}
function closeAll(){document.querySelectorAll('.social-modal').forEach(x=>x.classList.remove('show'))}
function openUpload(){const u=JopamsAuth.user&&JopamsAuth.user();if(!u||u.provider==='guest'){if(window.showToast)showToast('사진 등록은 카카오·네이버 로그인 후 이용할 수 있어요',{variant:'error'});return}if(!cur){if(window.showToast)showToast('GPS 위치 확인 후 사진을 등록할 수 있어요',{variant:'error'});return}const n=nearestCP(cur.lat,cur.lng);$('socialLocationNote').textContent='📍 현재 위치 · GPS ±'+Math.round(cur.accuracy||0)+'m'+(n?' · 가장 가까운 탐험 포인트 '+Math.round(n.d)+'m':'');$('socialUploadModal').classList.add('show')}
function canvasBlob(canvas,quality){return new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('image_encode_failed')),'image/webp',quality))}
async function compressImage(file,maxSide,quality){const bmp=await createImageBitmap(file),scale=Math.min(1,maxSide/Math.max(bmp.width,bmp.height)),w=Math.max(1,Math.round(bmp.width*scale)),h=Math.max(1,Math.round(bmp.height*scale)),c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d',{alpha:false});ctx.drawImage(bmp,0,0,w,h);if(bmp.close)bmp.close();return canvasBlob(c,quality)}
async function submit(e){e.preventDefault();const file=selectedSocialFile;if(!file||!cur){if(window.showToast)showToast('촬영하거나 앨범에서 사진을 선택해주세요',{variant:'error'});return;}const b=$('socialSubmit');b.disabled=true;b.textContent='사진 최적화 중…';try{const n=nearestCP(cur.lat,cur.lng);let photo=await compressImage(file,1280,.72),thumb=await compressImage(file,320,.66);if(photo.size>900*1024)photo=await compressImage(file,1024,.60);if(photo.size>900*1024)throw Error('compressed_photo_too_large');const fd=new FormData();fd.append('photo',photo,'photo.webp');fd.append('thumbnail',thumb,'thumb.webp');fd.append('latitude',cur.lat);fd.append('longitude',cur.lng);fd.append('accuracy',cur.accuracy||999);fd.append('caption',$('socialCaption').value||'');if(n&&n.d<=30)fd.append('checkpoint_id',n.i);b.textContent='등록 중…';const r=await fetch(api()+'/api/social/photos',{method:'POST',headers:headers(),body:fd});const j=await r.json().catch(()=>({}));if(!r.ok)throw Error(j.error||'upload_failed');closeAll();$('socialUploadForm').reset();selectedSocialFile=null;if(selectedPreviewUrl){URL.revokeObjectURL(selectedPreviewUrl);selectedPreviewUrl=null}$('socialPreview').style.backgroundImage='';$('socialPreview').innerHTML='<span class="social-upload-picker-icon" aria-hidden="true">📷</span><strong>사진 촬영 또는 선택</strong><small>카메라로 촬영하거나 갤러리·파일에서 이미지를 선택하세요</small>';if(window.showToast)showToast('탐험 사진이 지도에 등록되었습니다',{variant:'near'});await loadSocial()}catch(err){console.error(err);if(window.showToast)showToast(err.message==='compressed_photo_too_large'||err.message==='photo_too_large_after_compression'?'사진을 더 작게 촬영하거나 다른 사진을 선택해주세요':'사진 등록에 실패했습니다',{variant:'error'})}finally{b.disabled=false;b.textContent='지도에 등록'}}
function selectSocialPhoto(file){
 if(!file)return;
 selectedSocialFile=file;
 if(selectedPreviewUrl)URL.revokeObjectURL(selectedPreviewUrl);
 selectedPreviewUrl=URL.createObjectURL(file);
 $('socialPreview').innerHTML='';
 $('socialPreview').style.backgroundImage='url("'+selectedPreviewUrl+'")';
}
$('mapTabBtn').onclick=()=>switchMode(false);
$('socialTabBtn').onclick=()=>switchMode(true);
$('socialRefresh').onclick=loadSocial;
$('socialUploadOpen').onclick=openUpload;
const socialFile=$('socialFile');
// label[for=socialFile]가 네이티브 파일 선택기를 직접 여므로 programmatic click 의존성 제거.
// capture 속성을 넣지 않아 Android에서 카메라/갤러리/파일 선택지를 모두 제공할 수 있게 한다.
socialFile.addEventListener('click',()=>{socialFile.value='';});
socialFile.addEventListener('change',()=>selectSocialPhoto(socialFile.files&&socialFile.files[0]));
$('socialPreview').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();socialFile.click();}});
$('socialUploadForm').onsubmit=submit;document.querySelectorAll('[data-social-close]').forEach(b=>b.onclick=closeAll);document.querySelectorAll('.social-modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)closeAll()}));
})();
