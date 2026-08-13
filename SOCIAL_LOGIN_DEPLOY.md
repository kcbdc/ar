# v55 카카오/네이버 로그인 배포
1. 기존 D1 스키마 반영
```bash
cd server
npx wrangler d1 execute jofams --remote --file=./schema.sql
```
2. Kakao Developers
- Redirect URI: `https://jofams-go.junewoopark16.workers.dev/api/auth/callback`
```bash
npx wrangler secret put KAKAO_REST_API_KEY
npx wrangler secret put KAKAO_CLIENT_SECRET
```
3. Naver Developers
- Callback URL: `https://jofams-go.junewoopark16.workers.dev/api/auth/callback`
```bash
npx wrangler secret put NAVER_CLIENT_ID
npx wrangler secret put NAVER_CLIENT_SECRET
```
4. Worker 배포
```bash
npx wrangler deploy
```
동작: 최초 1회 로그인 → 180일 조팸스 세션 저장 → 이후 앱 재진입 자동 통과. 다른 기기에서 같은 소셜 계정으로 로그인하면 같은 서버 user ID를 사용해 진행률/3일·12m 쿨다운 동기화. 로그아웃은 프로필 맨 하단.
