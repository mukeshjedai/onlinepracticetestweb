import type { CategoryId } from "@/data/questions";

export type ProgressStatus = "not_started" | "started" | "in_progress" | "completed";

export type TestProgressRecord = {
  testId: string;
  title: string;
  category: string;
  status: Exclude<ProgressStatus, "not_started">;
  answeredCount: number;
  totalQuestions: number;
  correctCount: number;
  progressPercent: number;
  scorePercent: number;
  startedAt: string;
  updatedAt: string;
  completedAt: string | null;
};

export type TestProgressView = {
  status: ProgressStatus;
  answeredCount: number;
  totalQuestions: number;
  correctCount: number;
  progressPercent: number;
  scorePercent: number;
  attempts: number;
  bestScore: number;
  completed: boolean;
};

export async function fetchProgressMap(): Promise<Record<string, TestProgressRecord>> {
  const res = await fetch("/api/progress", { cache: "no-store" });
  if (!res.ok) return {};
  const data = await res.json();
  const map: Record<string, TestProgressRecord> = {};
  for (const item of data.items ?? []) {
    map[item.testId] = item;
  }
  return map;
}

export async function saveProgressUpdate(payload: {
  testId: string;
  title: string;
  category: CategoryId | "full";
  status: "started" | "in_progress" | "completed";
  answeredCount: number;
  totalQuestions: number;
  correctCount: number;
  progressPercent?: number;
  scorePercent?: number;
}) {
  const res = await fetch("/api/progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error("Failed to save progress");
  }
  const data = await res.json();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("acp-progress-updated"));
  }
  return data.item as TestProgressRecord;
}

export function toProgressView(
  record: TestProgressRecord | undefined,
): TestProgressView {
  if (!record) {
    return {
      status: "not_started",
      answeredCount: 0,
      totalQuestions: 0,
      correctCount: 0,
      progressPercent: 0,
      scorePercent: 0,
      attempts: 0,
      bestScore: 0,
      completed: false,
    };
  }

  return {
    status: record.status,
    answeredCount: record.answeredCount,
    totalQuestions: record.totalQuestions,
    correctCount: record.correctCount,
    progressPercent: record.progressPercent,
    scorePercent: record.scorePercent,
    attempts: record.status === "completed" ? 1 : record.answeredCount > 0 ? 1 : 1,
    bestScore: record.scorePercent,
    completed: record.status === "completed",
  };
}
