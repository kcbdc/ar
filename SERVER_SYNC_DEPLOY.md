# v52 기존 서버 통합 배포

별도 D1/Pages Function을 만들지 않습니다. 기존 `server/wrangler.toml`의 `jofams` D1과 `server/worker.js`를 그대로 확장했습니다.

1. `cd server`
2. 기존 D1에 스키마 반영: `npx wrangler d1 execute jofams --remote --file=./schema.sql`
3. Worker 재배포: `npx wrangler deploy`
4. 정적 사이트 파일도 배포

동기화 API: 기존 Worker의 `/api/game-state`
쿨다운: 72시간 / 공간반경 12m

계정 식별: 프로필 이름이 `원정대원`이 아닌 경우 `소속+프로필명`을 공통 계정 키로 사용합니다. 기본 프로필 상태에서는 사용자 충돌 방지를 위해 기기별 익명 ID를 사용합니다. 운영용 완전 인증이 필요하면 로그인에서 검증된 user id로 교체해야 합니다.
