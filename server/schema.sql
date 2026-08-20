CREATE TABLE IF NOT EXISTS scores (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 name TEXT NOT NULL,
 org TEXT NOT NULL,
 score INTEGER NOT NULL DEFAULT 0,
 updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
 UNIQUE(name, org)
);
CREATE INDEX IF NOT EXISTS idx_scores_score ON scores(score DESC);


CREATE TABLE IF NOT EXISTS reward_claims (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 player_id TEXT NOT NULL,
 claim_key TEXT NOT NULL,
 reward_type TEXT NOT NULL,
 created_at TEXT DEFAULT CURRENT_TIMESTAMP,
 UNIQUE(player_id, claim_key)
);
CREATE INDEX IF NOT EXISTS idx_reward_claims_player ON reward_claims(player_id, created_at DESC);


-- v35: 계정별 AR 진행률 / 3일·12m 체크포인트 쿨다운 동기화
CREATE TABLE IF NOT EXISTS game_state (
 account_id TEXT PRIMARY KEY,
 progress_json TEXT NOT NULL DEFAULT '[]',
 cp_cooldowns_json TEXT NOT NULL DEFAULT '{}',
 spatial_cooldowns_json TEXT NOT NULL DEFAULT '[]',
 updated_at INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_game_state_updated_at ON game_state(updated_at);

-- v55 Kakao/Naver social account auth
CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY,provider TEXT NOT NULL,provider_user_id TEXT NOT NULL,nickname TEXT,profile_image TEXT,created_at INTEGER NOT NULL,last_login_at INTEGER NOT NULL,UNIQUE(provider,provider_user_id));
CREATE INDEX IF NOT EXISTS idx_users_provider_uid ON users(provider,provider_user_id);
CREATE TABLE IF NOT EXISTS auth_states (state TEXT PRIMARY KEY,provider TEXT NOT NULL,return_to TEXT NOT NULL,created_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS idx_auth_states_created ON auth_states(created_at);
CREATE TABLE IF NOT EXISTS auth_sessions (token_hash TEXT PRIMARY KEY,user_id TEXT NOT NULL,created_at INTEGER NOT NULL,expires_at INTEGER NOT NULL,last_seen_at INTEGER NOT NULL,FOREIGN KEY(user_id) REFERENCES users(id));
CREATE INDEX IF NOT EXISTS idx_auth_sessions_user ON auth_sessions(user_id,expires_at);

-- v62: auth_states is retained only for backward compatibility; OAuth state now uses signed stateless HMAC.

-- v64: 위치 기반 소셜 탐험 사진
CREATE TABLE IF NOT EXISTS social_photos (
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL,
 checkpoint_id INTEGER,
 latitude REAL NOT NULL,
 longitude REAL NOT NULL,
 accuracy REAL,
 caption TEXT NOT NULL DEFAULT '',
 object_key TEXT NOT NULL UNIQUE,
 mime_type TEXT NOT NULL,
 created_at INTEGER NOT NULL,
 FOREIGN KEY(user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_social_photos_created ON social_photos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_social_photos_checkpoint ON social_photos(checkpoint_id,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_social_photos_geo ON social_photos(latitude,longitude);


-- v66: R2 없이 D1에 압축 이미지 저장 (기존 social_photos는 보존)
CREATE TABLE IF NOT EXISTS social_photos_v66 (
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL,
 checkpoint_id INTEGER,
 latitude REAL NOT NULL,
 longitude REAL NOT NULL,
 accuracy REAL,
 caption TEXT NOT NULL DEFAULT '',
 image_blob BLOB NOT NULL,
 thumb_blob BLOB NOT NULL,
 mime_type TEXT NOT NULL DEFAULT 'image/webp',
 created_at INTEGER NOT NULL,
 FOREIGN KEY(user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_social_photos_v66_created ON social_photos_v66(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_social_photos_v66_checkpoint ON social_photos_v66(checkpoint_id,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_social_photos_v66_user_checkpoint ON social_photos_v66(user_id,checkpoint_id);
