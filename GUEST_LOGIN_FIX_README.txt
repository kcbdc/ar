조팸스 GO 게스트 로그인 수정 v63

확인된 기존 D1 users 스키마:
id / provider / provider_user_id / nickname / profile_image / created_at / last_login_at

핵심 수정:
- 게스트용 별도 INSERT를 사용하지 않음
- 현재 카카오/네이버에서 정상 사용하는 upsertSocialUser()를 provider='guest'로 그대로 재사용
- 기존 issueSession()으로 인증 세션 발급
- D1 schema.sql 수정 불필요
- auth.js 캐시 버전 63으로 변경
- 실패 시 화면에 서버 오류코드 표시

배포:
Pages → auth.html, assets/auth.js
Worker → server/worker.js
