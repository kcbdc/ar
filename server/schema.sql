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
