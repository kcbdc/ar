조팸스 GO UX Rebuild v5

[핵심 고도화]
1. AR 캐릭터 월드 앵커: 바닥 그림자, 스캔 링, 거리 기반 크기, 등장 애니메이션
2. 상용형 사운드 UX: 근접/등장/성공/실패/보상 음향 + AR 스캐너 앰비언스
3. 시즌 보상 개봉: 전용 보상 리빌 모달 및 햅틱
4. 모바일 반응형 세밀 튜닝 및 PWA 설치 CTA
5. 앱 아이콘 192/512/maskable 및 스플래시·Play Store Feature Graphic 생성
6. 기기 준비상태 진단(카메라·위치·방향센서·PWA)
7. Cloudflare Worker v5: /health, 입력 검증, CORS 설정, D1 예제 wrangler 파일
8. Service Worker v5 캐시 전략 및 manifest 아이콘 연결

[실행]
index.html부터 시작. 카메라/GPS는 HTTPS 또는 localhost 환경 권장.

[스토어 자산]
store_assets/app_icon_512.png
store_assets/feature_graphic_1024x500.png
store_assets/splash_1284x2778.png

[서버]
server/wrangler.toml.example의 D1 ID와 ALLOWED_ORIGIN을 설정 후 Cloudflare Workers에 배포.
