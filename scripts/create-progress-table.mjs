import pg from "pg";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("Set DATABASE_URL before running this script.");
  process.exit(1);
}

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

const sql = `
CREATE TABLE IF NOT EXISTS test_progress (
  id SERIAL PRIMARY KEY,
  owner_key VARCHAR(255) NOT NULL,
  test_id VARCHAR(120) NOT NULL,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(40) NOT NULL,
  status VARCHAR(32) NOT NULL,
  answered_count INT NOT NULL DEFAULT 0,
  total_questions INT NOT NULL,
  correct_count INT NOT NULL DEFAULT 0,
  progress_percent INT NOT NULL DEFAULT 0,
  score_percent INT NOT NULL DEFAULT 0,
  started_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP NULL,
  CONSTRAINT test_progress_owner_test_key UNIQUE (owner_key, test_id)
);
CREATE INDEX IF NOT EXISTS idx_test_progress_owner ON test_progress(owner_key);
`;

await client.connect();
await client.query(sql);
console.log("test_progress table ready");
await client.end();
