조팸스 GO 게스트 로그인 패치

수정 파일
- auth.html
- assets/auth.js
- server/worker.js

동작
- 카카오/네이버 로그인 아래 '게스트로 체험하기' 버튼 추가
- POST /api/auth/guest 호출
- 서버에서 guest:<random> 사용자 생성
- 기존 auth_sessions 방식으로 세션 발급
- 앱 종료 후에도 해당 기기에서 로그인 상태 유지
- 기존 game_state / 3일·12m 쿨다운은 일반 계정과 동일하게 동작

주의
- 게스트 계정은 다른 기기에서 복원/동기화할 수 없습니다.
- 소셜 계정 전환/연결 기능은 별도 구현이 필요합니다.
- Worker 재배포가 필요합니다.
