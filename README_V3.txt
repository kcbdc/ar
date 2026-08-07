조팸스 GO UX Rebuild v3

추가 기능
- 순식 SIGNAL TAP / 다임 SHIELD CHARGE / 훈민 QUICK OX 미니게임 3종
- 업적/배지 7종 및 achievements.html
- 본사·화폐본부·제지본부·ID본부·기술연구원 대항전 battle.html
- 일일미션 완료 상태 애니메이션 강화
- 서버 랭킹 연동용 Cloudflare Worker + D1 예제(server/)
- AR 아이템 획득 전 미니게임 성공을 거치는 플레이 루프

실행: index.html
서버 없이 모든 핵심 UX가 로컬에서 시연됩니다. 서버 연결 시 assets/app.js의 setServerUrl()로 Worker 주소를 저장할 수 있습니다.
