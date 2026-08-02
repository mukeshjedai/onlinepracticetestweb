import { getPool } from "@/lib/db";

export type DbTestProgress = {
  id: number;
  ownerKey: string;
  testId: string;
  title: string;
  category: string;
  status: "started" | "in_progress" | "completed";
  answeredCount: number;
  totalQuestions: number;
  correctCount: number;
  progressPercent: number;
  scorePercent: number;
  startedAt: string;
  updatedAt: string;
  completedAt: string | null;
};

type Row = {
  id: number;
  owner_key: string;
  test_id: string;
  title: string;
  category: string;
  status: string;
  answered_count: number;
  total_questions: number;
  correct_count: number;
  progress_percent: number;
  score_percent: number;
  started_at: Date;
  updated_at: Date;
  completed_at: Date | null;
};

function mapRow(row: Row): DbTestProgress {
  return {
    id: row.id,
    ownerKey: row.owner_key,
    testId: row.test_id,
    title: row.title,
    category: row.category,
    status: row.status as DbTestProgress["status"],
    answeredCount: row.answered_count,
    totalQuestions: row.total_questions,
    correctCount: row.correct_count,
    progressPercent: row.progress_percent,
    scorePercent: row.score_percent,
    startedAt: row.started_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
    completedAt: row.completed_at ? row.completed_at.toISOString() : null,
  };
}

export async function listProgress(ownerKey: string) {
  const pool = getPool();
  const { rows } = await pool.query<Row>(
    `SELECT * FROM test_progress WHERE owner_key = $1 ORDER BY updated_at DESC`,
    [ownerKey],
  );
  return rows.map(mapRow);
}

export type UpsertProgressInput = {
  ownerKey: string;
  testId: string;
  title: string;
  category: string;
  status: "started" | "in_progress" | "completed";
  answeredCount: number;
  totalQuestions: number;
  correctCount: number;
  progressPercent: number;
  scorePercent: number;
};

export async function upsertProgress(input: UpsertProgressInput) {
  const pool = getPool();
  const completedAt =
    input.status === "completed" ? new Date().toISOString() : null;

  const { rows } = await pool.query<Row>(
    `
    INSERT INTO test_progress (
      owner_key, test_id, title, category, status,
      answered_count, total_questions, correct_count,
      progress_percent, score_percent, started_at, updated_at, completed_at
    ) VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8,
      $9, $10, NOW(), NOW(), $11
    )
    ON CONFLICT (owner_key, test_id)
    DO UPDATE SET
      title = EXCLUDED.title,
      category = EXCLUDED.category,
      status = EXCLUDED.status,
      answered_count = EXCLUDED.answered_count,
      total_questions = EXCLUDED.total_questions,
      correct_count = EXCLUDED.correct_count,
      progress_percent = EXCLUDED.progress_percent,
      score_percent = EXCLUDED.score_percent,
      updated_at = NOW(),
      completed_at = CASE
        WHEN EXCLUDED.status = 'completed' THEN COALESCE(test_progress.completed_at, NOW())
        ELSE NULL
      END
    RETURNING *
    `,
    [
      input.ownerKey,
      input.testId,
      input.title,
      input.category,
      input.status,
      input.answeredCount,
      input.totalQuestions,
      input.correctCount,
      input.progressPercent,
      input.scorePercent,
      completedAt,
    ],
  );

  return mapRow(rows[0]);
}
