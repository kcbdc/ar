조팸스 GO 서버 랭킹 연결 예시
1. Cloudflare D1 데이터베이스 생성
2. schema.sql 실행
3. Worker에 D1 바인딩 이름 DB로 연결
4. worker.js 배포
5. 브라우저 콘솔 또는 설정 UI에서 setServerUrl("https://YOUR-WORKER.workers.dev") 실행
6. 이후 획득 시 /api/score로 최소 기록이 동기화됩니다.

주의: 실서비스에서는 사번/실명 대신 익명 닉네임 또는 내부 인증 식별자 해시를 권장합니다.
