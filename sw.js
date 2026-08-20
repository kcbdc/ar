// 조팸스 GO 서비스워커 v31
// v19 변경 이유:
//   기존에는 install 시 caches.addAll(ASSETS)로 전체 목록을 한 번에 캐싱했는데,
//   배포 도중 파일 하나만 일시적으로 404가 나도 addAll() 전체가 실패해 설치(install)
//   자체가 실패했다. 이 경우 브라우저는 "새 서비스워커 설치 실패"로 판단해 기존(구버전)
//   서비스워커와 캐시를 계속 사용하게 되고, 그 뒤로 아무리 재배포해도 사용자는 영구히
//   오래된 캐시에 갇히는 문제가 있었다(시크릿 모드에서는 서비스워커가 없어 정상 동작했던 것과 일치).
//
// 이번 버전은 두 가지로 이 문제를 근본적으로 방지한다:
//   1) 설치 시 파일을 하나씩 개별적으로 캐싱하고, 실패한 파일이 있어도 설치 자체는
//      성공시킨다(Promise.allSettled) — 부분 실패가 전체 실패로 번지지 않도록.
//   2) HTML 문서 요청은 "네트워크 우선(network-first)"으로 전환해, 캐시가 있어도
//      항상 최신 버전을 먼저 시도하고, 오프라인일 때만 캐시로 폴백한다.
//      (이미지·CSS·JS 같은 정적 자산은 기존처럼 캐시 우선을 유지해 로딩 속도를 지킨다.)

const CACHE = 'jopams-go-v67';
const ASSETS = [
  './', './index.html', './ar.html', './checkpoints.html', './collection.html',
  './ranking.html', './achievements.html', './battle.html', './season.html',
  './profile.html', './expedition.html', './master.html', './chat.html', './privacy.html', './manifest.webmanifest',
  './assets/style.css','./assets/design-system-v18.css','./assets/design-system-v19.css','./assets/design-system-v20.css','./assets/design-system-v22.css',
  './assets/design-system-v32.css', './assets/social-map.js', './assets/state.js', './assets/ui.js', './assets/app.js', './assets/liveops.js',
  './assets/img/daim.png', './assets/img/sunsik.png', './assets/img/hoonmin.png',
  './assets/img/icon-192.png', './assets/img/icon-512.png', './assets/img/icon-maskable-512.png', './assets/img/splash.jpg',
  './assets/audio/bgm-home.mp3'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.allSettled(
        ASSETS.map(url =>
          fetch(url, { cache: 'no-store' })
            .then(res => { if (res && res.ok) return cache.put(url, res); })
            .catch(() => {}) // 개별 파일 실패는 무시하고 계속 진행
        )
      )
    )
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    ])
  );
});

function isHTMLRequest(request) {
  if (request.mode === 'navigate') return true;
  const dest = request.destination;
  if (dest === 'document') return true;
  const url = new URL(request.url);
  return url.pathname.endsWith('.html') || url.pathname === '/' || url.pathname.endsWith('/');
}

function isAuthCriticalRequest(request) {
  const url = new URL(request.url);
  return url.pathname === '/auth' ||
         url.pathname === '/auth.html' ||
         url.pathname.endsWith('/assets/auth.js');
}

self.addEventListener('fetch', e => {
  const bypassUrl = new URL(e.request.url);
  if (bypassUrl.origin === self.location.origin &&
      (bypassUrl.pathname === '/auth' ||
       bypassUrl.pathname === '/auth.html' ||
       bypassUrl.pathname.endsWith('/assets/auth.js'))) {
    // v59: authentication is never handled by the service worker.
    return;
  }
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  if (u.pathname.includes('/api/')) return;
  if (u.origin !== self.location.origin) return; // 외부 CDN(카카오맵 등)은 SW가 관여하지 않음

  if (isHTMLRequest(e.request)) {
    // 네트워크 우선: 최신 HTML을 항상 먼저 시도, 실패 시에만 캐시 폴백
    e.respondWith(
      fetch(e.request, { cache: 'no-store' })
        .then(res => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, copy));
          }
          return res;
        })
        .catch(() =>
          caches.match(e.request).then(cached => cached || caches.match('./index.html'))
        )
    );
    return;
  }

  // 정적 자산(이미지·CSS·JS)은 캐시 우선 + 백그라운드 갱신 (stale-while-revalidate)
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fetchPromise = fetch(e.request).then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
