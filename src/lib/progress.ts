import type { CategoryId } from "@/data/questions";

export type TestAttempt = {
  testId: string;
  title: string;
  category: CategoryId | "full";
  correct: number;
  total: number;
  score: number;
  completedAt: string;
};

export type SectionProgress = {
  attempts: number;
  bestScore: number;
  lastScore: number;
  averageScore: number;
  testsCompleted: number;
  lastCompletedAt: string | null;
};

export type UserProgress = {
  email: string;
  attempts: TestAttempt[];
  updatedAt: string;
};

const STORAGE_KEY = "aussiecitizenshipprep_progress_v1";
export const GUEST_PROGRESS_KEY = "__guest__";

const emptySection = (): SectionProgress => ({
  attempts: 0,
  bestScore: 0,
  lastScore: 0,
  averageScore: 0,
  testsCompleted: 0,
  lastCompletedAt: null,
});

function readAll(): Record<string, UserProgress> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, UserProgress>;
  } catch {
    return {};
  }
}

function writeAll(data: Record<string, UserProgress>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function emitUpdate(email: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("acp-progress-updated", { detail: { email } }),
    );
  }
}

function attemptKey(a: TestAttempt) {
  return `${a.testId}|${a.completedAt}|${a.score}|${a.correct}`;
}

function mergeAttempts(primary: TestAttempt[], secondary: TestAttempt[]) {
  const map = new Map<string, TestAttempt>();
  [...secondary, ...primary].forEach((a) => map.set(attemptKey(a), a));
  return Array.from(map.values()).sort(
    (a, b) => +new Date(b.completedAt) - +new Date(a.completedAt),
  );
}

export function getUserProgress(email: string | null | undefined): UserProgress | null {
  if (!email) return null;
  return readAll()[email.toLowerCase()] ?? null;
}

/** Progress for the signed-in user, or guest device progress when signed out. */
export function loadProgress(email?: string | null): UserProgress | null {
  const all = readAll();
  if (email) {
    const key = email.toLowerCase();
    const user = all[key];
    const guest = all[GUEST_PROGRESS_KEY];
    if (user && guest) {
      return {
        email: key,
        attempts: mergeAttempts(user.attempts, guest.attempts).slice(0, 200),
        updatedAt: user.updatedAt > guest.updatedAt ? user.updatedAt : guest.updatedAt,
      };
    }
    return user ?? guest ?? null;
  }
  return all[GUEST_PROGRESS_KEY] ?? null;
}

/** Move guest attempts into the signed-in account (call after login). */
export function migrateGuestProgress(email: string) {
  const key = email.toLowerCase();
  const all = readAll();
  const guest = all[GUEST_PROGRESS_KEY];
  if (!guest || guest.attempts.length === 0) return getUserProgress(key);

  const user = all[key] ?? {
    email: key,
    attempts: [],
    updatedAt: new Date().toISOString(),
  };
  user.attempts = mergeAttempts(user.attempts, guest.attempts).slice(0, 200);
  user.updatedAt = new Date().toISOString();
  all[key] = user;
  delete all[GUEST_PROGRESS_KEY];
  writeAll(all);
  emitUpdate(key);
  return user;
}

export function saveAttempt(
  email: string | null | undefined,
  attempt: Omit<TestAttempt, "completedAt"> & { completedAt?: string },
) {
  const key = (email || GUEST_PROGRESS_KEY).toLowerCase();
  const all = readAll();
  const existing = all[key] ?? {
    email: key,
    attempts: [],
    updatedAt: new Date().toISOString(),
  };

  const record: TestAttempt = {
    ...attempt,
    completedAt: attempt.completedAt ?? new Date().toISOString(),
  };

  existing.attempts = [record, ...existing.attempts].slice(0, 200);
  existing.updatedAt = record.completedAt;
  all[key] = existing;
  writeAll(all);
  emitUpdate(key);
  return existing;
}

export function getSectionProgress(
  progress: UserProgress | null,
  category: CategoryId | "full",
): SectionProgress {
  if (!progress) return emptySection();
  const items = progress.attempts.filter((a) => a.category === category);
  if (items.length === 0) return emptySection();

  const scores = items.map((a) => a.score);
  const uniqueTests = new Set(items.map((a) => a.testId));
  return {
    attempts: items.length,
    bestScore: Math.max(...scores),
    lastScore: items[0].score,
    averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    testsCompleted: uniqueTests.size,
    lastCompletedAt: items[0].completedAt,
  };
}

export function getOverallProgress(progress: UserProgress | null) {
  if (!progress || progress.attempts.length === 0) {
    return { attempts: 0, bestScore: 0, averageScore: 0 };
  }
  const scores = progress.attempts.map((a) => a.score);
  return {
    attempts: progress.attempts.length,
    bestScore: Math.max(...scores),
    averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
  };
}

export type TestProgress = {
  attempts: number;
  bestScore: number;
  lastScore: number;
  completed: boolean;
};

export function getTestProgress(
  progress: UserProgress | null,
  testId: string,
): TestProgress {
  if (!progress) {
    return { attempts: 0, bestScore: 0, lastScore: 0, completed: false };
  }
  const items = progress.attempts.filter((a) => a.testId === testId);
  if (items.length === 0) {
    return { attempts: 0, bestScore: 0, lastScore: 0, completed: false };
  }
  const scores = items.map((a) => a.score);
  return {
    attempts: items.length,
    bestScore: Math.max(...scores),
    lastScore: items[0].score,
    completed: true,
  };
}
