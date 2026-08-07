/* JOPAMS GO v12 SVG icon system + common shell behavior */
(function(){
 const p={
  home:'<path d="M5 12 12 6l7 6v8h-5v-5h-4v5H5z"/>',
  explore:'<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/><path d="M12 2v2M22 12h-2M12 22v-2M2 12h2"/>',
  map:'<circle cx="12" cy="12" r="3"/><path d="M12 3v3M21 12h-3M12 21v-3M3 12h3"/><path d="M7 17 5 19M17 7l2-2"/>',
  collection:'<path d="m12 4 8 8-8 8-8-8z"/><path d="m12 8 4 4-4 4-4-4z"/>',
  ranking:'<path d="M5 20h14M7 18v-5h3v5M11 18V9h3v9M15 18v-8h3v8"/><path d="m12 3 1.2 2.4 2.8.4-2 2 0.5 2.8L12 9.3 9.5 10.6 10 7.8l-2-2 2.8-.4z"/>',
  back:'<path d="M19 12H6M11 7l-5 5 5 5"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/>',
  trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0zM9 16h6M10 13v3M14 13v3M8 18h8"/><path d="M8 6H5v2a3 3 0 0 0 3 3M16 6h3v2a3 3 0 0 1-3 3"/>',
  spark:'<path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z"/>',
  shield:'<path d="M12 3 19 6v5c0 4.5-3 7.5-7 10-4-2.5-7-5.5-7-10V6z"/>',
  quiz:'<path d="M6 5h12v14H6zM9 9h6M9 13h4"/>',
  speed:'<path d="M13 3 6 13h5l-1 8 8-11h-5z"/>',
  sound:'<path d="M5 10h4l4-4v12l-4-4H5zM16 9c1 1 1 5 0 6M18.5 7c2 2 2 8 0 10"/>',
  vibration:'<path d="M8 5h8v14H8zM5 8 3 10v4l2 2M19 8l2 2v4l-2 2"/>',
  motion:'<circle cx="12" cy="12" r="7" stroke-dasharray="3 3"/><path d="M12 8v4l3 2"/>',
  camera:'<path d="M5 8h3l1.5-2h5L16 8h3v10H5z"/><circle cx="12" cy="13" r="3"/>',
  location:'<path d="M12 21s6-5 6-11a6 6 0 1 0-12 0c0 6 6 11 6 11z"/><circle cx="12" cy="10" r="2"/>',
  compass:'<circle cx="12" cy="12" r="8"/><path d="m15 9-2 5-4 2 2-5z"/>',
  battle:'<path d="m6 5 12 14M18 5 6 19M5 4l4 1-3 3zM19 4l-4 1 3 3z"/>',
  profile:'<circle cx="12" cy="8" r="3"/><path d="M6 20c.5-5 3-7 6-7s5.5 2 6 7"/>'
 };
 function icon(name,cls=''){const body=p[name]||p.spark;return `<svg class="ui-svg ${cls}" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`}
 const hrefMap={'index.html':'home','ar.html':'explore','checkpoints.html':'map','collection.html':'collection','ranking.html':'ranking','achievements.html':'spark','battle.html':'battle','profile.html':'settings'};
 function formatNumericText(root=document.body){
   if(!root)return;const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
   nodes.forEach(n=>{const parent=n.parentElement;if(!parent||/^(SCRIPT|STYLE|INPUT|TEXTAREA|OPTION)$/.test(parent.tagName))return;const before=n.nodeValue;const after=before.replace(/(?<![\d.])\d{4,}(?![\d.])/g,m=>Number(m).toLocaleString('ko-KR'));if(after!==before)n.nodeValue=after;});
 }
 function upgrade(){
   document.querySelectorAll('.bottom-nav a').forEach(a=>{const href=(a.getAttribute('href')||'').split('/').pop(),s=a.querySelector('span');if(s)s.innerHTML=icon(hrefMap[href]||'spark')});
   document.querySelectorAll('.back-btn,.ar-exit').forEach(a=>{a.innerHTML=icon('back');a.setAttribute('aria-label','뒤로가기')});
   document.querySelectorAll('[data-ui-icon]').forEach(el=>el.innerHTML=icon(el.dataset.uiIcon));
   const quick={'collection.html':'collection','checkpoints.html':'map','ranking.html':'ranking','achievements.html':'spark','battle.html':'battle','profile.html':'settings'};
   document.querySelectorAll('.quick-card').forEach(a=>{const q=a.querySelector('.qicon'),h=(a.getAttribute('href')||'').split('/').pop();if(q)q.innerHTML=icon(quick[h]||'spark')});
   formatNumericText();
 }
 window.uiIcon=icon;window.upgradeJopamsUI=upgrade;window.formatNumericText=formatNumericText;
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',upgrade);else upgrade();
})();
