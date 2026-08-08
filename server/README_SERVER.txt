조팸스 GO 서버 랭킹 연결 안내 (jofams 프로젝트 전용)

이미 D1 데이터베이스 정보가 wrangler.toml에 채워져 있습니다.
  - database_name = "jofams"
  - database_id   = "7bbd1b2d-27e4-49fe-945d-f84b915dd173"
  - ALLOWED_ORIGIN = "https://jofams.pages.dev" (Pages 배포 도메인)

[배포 순서]
1. 이 server 폴더로 이동해서 Cloudflare에 로그인
     npx wrangler login

2. schema.sql을 D1 데이터베이스에 적용 (테이블 생성)
     npx wrangler d1 execute jofams --file=./schema.sql --remote

   * 로컬 테스트용 DB에도 적용하려면 --remote를 빼고 실행하세요.

3. Worker 배포
     npx wrangler deploy

   배포가 끝나면 다음과 비슷한 주소가 출력됩니다:
     https://jopams-go-ranking.<당신의-워커-서브도메인>.workers.dev
   이 주소를 그대로 복사해두세요 (계정마다 서브도메인이 다릅니다).

4. 게임 앱에 서버 주소 연결
   - jofams.pages.dev 접속 → 프로필 화면 → "랭킹 서버 연결"
   - 3번에서 복사한 workers.dev 주소를 입력 → "URL 저장"
   - "연결 진단" 버튼으로 정상 연결 확인

5. 확인
   - AR 탐험에서 아이템을 하나 획득하면 자동으로 점수가 서버에 전송됩니다.
   - 랭킹 화면에서 "동기화" 버튼을 누르면 서버 데이터를 즉시 반영합니다.

[동작 확인용 명령어]
   curl https://<워커주소>/health
   → {"ok":true,"service":"jopams-go-ranking","version":"v17"} 응답이 오면 정상

[주의]
   - 실서비스에서는 사번/실명 대신 익명 닉네임 또는 내부 인증 식별자 해시를 권장합니다.
   - wrangler.toml의 ALLOWED_ORIGIN을 실제 서비스 도메인과 다르게 두면 CORS 오류로
     브라우저에서 API 호출이 차단됩니다. 커스텀 도메인을 연결하면 이 값도 함께 갱신하세요.
