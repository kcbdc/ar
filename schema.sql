CREATE TABLE IF NOT EXISTS game_state (
  account_id TEXT PRIMARY KEY,
  progress_json TEXT NOT NULL DEFAULT '[]',
  cooldowns_json TEXT NOT NULL DEFAULT '[]',
  updated_at INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_game_state_updated_at ON game_state(updated_at);
