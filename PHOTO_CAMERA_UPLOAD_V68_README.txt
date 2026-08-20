조팸스 GO v68 - 카메라/앨범/사진 업로드 근본 수정

1. '사진 촬영 또는 선택'을 누르면 앱 내부 카메라가 기본 실행됩니다.
2. 카메라 왼쪽 하단 '앨범' 버튼으로 로컬 이미지 선택이 가능합니다.
3. Android Chrome/Edge/Samsung Internet 및 iOS Safari/WKWebView용 getUserMedia + playsinline 적용.
4. getUserMedia가 불가능한 환경에서는 capture=environment 네이티브 카메라로 자동 fallback.
5. 앨범 선택 input에는 capture를 사용하지 않아 로컬 사진/이미지 선택이 가능합니다.
6. iOS 이미지 디코딩 대응: createImageBitmap 실패 시 <img> 기반 fallback.
7. 실제 업로드 후 사진이 깨지던 핵심 서버 버그 수정:
   Cloudflare D1은 BLOB 조회 결과를 number[] 배열로 반환하므로,
   이를 Uint8Array로 변환한 뒤 Response body로 전달하도록 수정했습니다.
8. D1 저장 시에도 ArrayBuffer 대신 Uint8Array로 명시적으로 bind합니다.
9. Service Worker/cache 버전 v68.

변경 파일:
- checkpoints.html
- assets/social-map.js
- assets/style.css
- server/worker.js
- sw.js

필수 배포:
Pages: checkpoints.html, assets/social-map.js, assets/style.css, sw.js
Worker: server/worker.js
