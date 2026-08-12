# 조팸스 GO v51 — 서버/계정 동기화 + 3일/12m 쿨다운

## 적용 내용
- Chrome / Edge / iPhone / Android가 동일 account_id를 사용하면 진행률과 쿨다운을 D1 서버에서 공유합니다.
- 서버가 기존 진행률/쿨다운을 병합하므로 오래된 브라우저 상태가 최신 서버 상태를 지우지 않습니다.
- 쿨다운: 획득 후 3일(72시간)
- 공간 반경: 12m
- localStorage는 오프라인 캐시/fallback으로만 유지합니다.
- 페이지 진입, 포그라운드 복귀, 온라인 복귀 시 서버 상태를 다시 받습니다.

## 최초 배포
1. `npx wrangler d1 create jopams-go`
2. 출력된 database_id를 `wrangler.toml`에 입력
3. `npx wrangler d1 execute jopams-go --remote --file=./schema.sql`
4. Cloudflare Pages 프로젝트의 Settings > Bindings에서 D1 binding 이름을 `DB`로 연결
5. 전체 소스를 Pages에 배포

## 계정 ID
현재 클라이언트는 최초 접속 시 익명 account_id를 생성합니다.
기존 로그인 시스템이 있다면 로그인 성공 직후:
`setJopamsAccountId("서버에서 인증된_사용자_ID"); pullServerGameState();`
를 호출하면 됩니다.

중요: '계정 기반 완전 동기화'는 실제 로그인/인증 시스템이 account_id를 공급해야 기기까지 동일해집니다.
익명 ID만 사용하면 같은 브라우저에서는 유지되지만 새 기기에는 자동 전달되지 않습니다.
