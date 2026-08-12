조팸스 GO v53
1. UX 거리 구간 통일
- 100m 초과: 일반 신호 안내
- 100m ~ 12m 초과: 내비게이션 화살표 안내
- 12m 이하: AR 정밀탐색(좌우 탐색/발견 단계)
- 3일 / 12m 공간 쿨다운 유지

2. 브라우저 GPS 통일
- Samsung Internet / Edge / Chrome / Safari 모두 동일 GEO_PROFILE 사용
- enableHighAccuracy=true, maximumAge=0, timeout=20초
- primary watchPosition 단일화
- coarse/fallback watch 동시 실행 제거
- one-shot 요청은 mutex(requestOneShot)로 직렬화
- Safari/Samsung의 포그라운드 복귀 throttling 대응
- pageshow/focus/visibilitychange 공통 복구
- 오래된 GPS fix 및 coarse 좌표가 정밀 좌표를 덮어쓰지 않는 기존 보정 유지

3. 충돌 검사
- startGeolocation 1개
- beginTracking 1개
- acceptLocation 1개
- updateUI 1개
- updateNavigationGuide 1개
- requestOneShot 1개
- fallback watch 등록 없음
- JS syntax 검사 통과

브라우저가 같은 물리 GPS를 사용하더라도 OS가 제공하는 accuracy 값/콜백 주기는 완전히 같을 수는 없습니다.
이번 버전은 앱 내부 처리 파이프라인을 동일하게 만들어 브라우저별 구현 차이가 게임 판정에 미치는 영향을 최소화합니다.
