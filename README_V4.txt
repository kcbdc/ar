조팸스 GO UX Rebuild v4

핵심 고도화
1. 첫 실행 3단계 온보딩 및 개인정보 설명
2. 플레이어 프로필(닉네임/소속/캐릭터)
3. 효과음·진동·동작 줄이기 설정
4. SEASON 01 시즌패스 및 8단계 보상
5. 일일 보급상자(+80 XP, 50 코인)
6. 실제 지도형 탐험 UI: 상대좌표 기반 맵, 내 위치, 미발견/발견 포인트, 근접거리
7. PWA manifest + Service Worker 오프라인 캐시
8. Cloudflare Worker 랭킹 서버 URL 저장 및 연결 진단
9. ranking.html 중복/잘못된 script 구조 정리
10. 기존 v3 미니게임/업적/대항전/서버동기화 유지

실행
- index.html 시작
- 카메라/GPS는 HTTPS 환경 또는 localhost 권장
- 실제 통합랭킹: profile.html에서 Worker URL 설정 후 연결 진단

주의
- manifest 아이콘은 현재 비워두었습니다. Play Store/PWA 배포 시 192x192, 512x512 PNG 아이콘 추가 권장
