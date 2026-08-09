조팸스 GO v23 - 지도 내 위치 복구 패치

- 지도 '내 위치로' 버튼을 사용자 현재 위치 중심 이동으로 복구
- 체크포인트 전체 bounds로 확대되던 회귀(regression) 제거
- 버튼 클릭 즉시 기존 GPS 위치로 먼저 이동 후 정밀 GPS 값을 받아 중심 재보정
- 내 위치 이동 시 지도 레벨 3으로 확대하고 내 위치 마커 갱신
- gpsSamples/lastGpsAt/watch ID 상태 변수 명시 선언(위치 업데이트 ReferenceError 방지)
- GPS watch/refresh 타이머 중복 생성 및 pagehide 정리 보강
- Service Worker 캐시 v23 갱신
