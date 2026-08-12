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
