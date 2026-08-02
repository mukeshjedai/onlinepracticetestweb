"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { PracticeTestCard } from "@/components/PracticeTestCard";
import { TierBadge } from "@/components/TierBadge";
import { categories } from "@/data/questions";
import { allTests, freeSectionId, type AccessTier } from "@/data/tests";
import { useProgress } from "@/hooks/useProgress";
import { toProgressView, type TestProgressRecord } from "@/lib/progress-api";

export function DashboardClient({ isPremium }: { isPremium: boolean }) {
  const { data: session, status } = useSession();
  const { progressMap, loading } = useProgress();

  const records = useMemo(
    () => Object.values(progressMap).sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)),
    [progressMap],
  );

  const overall = useMemo(() => {
    const completed = records.filter((r) => r.status === "completed");
    const inFlight = records.filter((r) => r.status !== "completed");
    const best = completed.reduce((max, r) => Math.max(max, r.scorePercent), 0);
    const avg =
      completed.length === 0
        ? 0
        : Math.round(
            completed.reduce((sum, r) => sum + r.scorePercent, 0) / completed.length,
          );
    return {
      started: records.length,
      inProgress: inFlight.length,
      completed: completed.length,
      bestScore: best,
      averageScore: avg,
    };
  }, [records]);

  const sectionBlocks = useMemo(() => {
    const base = categories.map((cat) => {
      const tests = allTests.filter((t) => t.category === cat.id);
      const tier: AccessTier = cat.id === freeSectionId ? "free" : "premium";
      const sectionRecords = tests
        .map((t) => progressMap[t.id])
        .filter(Boolean) as TestProgressRecord[];
      const completed = sectionRecords.filter((r) => r.status === "completed");
      const avgProgress =
        tests.length === 0
          ? 0
          : Math.round(
              tests.reduce((sum, t) => {
                const view = toProgressView(progressMap[t.id]);
                return (
                  sum +
                  (view.status === "completed" ? 100 : view.progressPercent)
                );
              }, 0) / tests.length,
            );
      return {
        ...cat,
        tests,
        tier,
        completedCount: completed.length,
        avgProgress,
        bestScore: completed.reduce((max, r) => Math.max(max, r.scorePercent), 0),
      };
    });

    const fullTests = allTests.filter((t) => t.category === "full").slice(0, 12);
    const fullRecords = fullTests
      .map((t) => progressMap[t.id])
      .filter(Boolean) as TestProgressRecord[];
    const fullCompleted = fullRecords.filter((r) => r.status === "completed");

    return [
      ...base,
      {
        id: "full" as const,
        title: "Full mock exams",
        short: "Full mocks",
        description: "Mixed questions across all four official topic areas.",
        tests: fullTests,
        tier: "premium" as AccessTier,
        completedCount: fullCompleted.length,
        avgProgress:
          fullTests.length === 0
            ? 0
            : Math.round(
                fullTests.reduce((sum, t) => {
                  const view = toProgressView(progressMap[t.id]);
                  return (
                    sum +
                    (view.status === "completed" ? 100 : view.progressPercent)
                  );
                }, 0) / fullTests.length,
              ),
        bestScore: fullCompleted.reduce((max, r) => Math.max(max, r.scorePercent), 0),
      },
    ];
  }, [progressMap]);

  if (status === "loading" || loading) {
    return <p className="text-center text-muted">Loading your dashboard…</p>;
  }

  const displayName =
    session?.user?.name?.split(" ")[0] ||
    (session?.user ? "learner" : "there");

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-harbour">
            Dashboard
          </p>
          <h1 className="mt-2 font-display text-3xl text-ink md:text-5xl">
            Welcome back, {displayName}
          </h1>
          <p className="mt-2 text-muted">
            {session?.user?.email ??
              "Your progress is saved in the database for this browser session."}
          </p>
          {!session?.user && (
            <Link
              href="/login?callbackUrl=/dashboard"
              className="mt-3 inline-flex text-sm font-semibold text-harbour"
            >
              Sign in with Google to keep progress on your account →
            </Link>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {isPremium ? (
            <span className="rounded-full border border-gold/40 bg-gold/15 px-3 py-1 text-sm font-semibold text-[#8a6a0a]">
              Premium active
            </span>
          ) : (
            <Link
              href="/premium"
              className="rounded-full bg-gold px-4 py-2 text-sm font-bold text-navy"
            >
              Upgrade to Premium
            </Link>
          )}
          <Link
            href="/#practice"
            className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-navy"
          >
            All practice tests
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Tests started" value={String(overall.started)} />
        <StatCard label="In progress" value={String(overall.inProgress)} />
        <StatCard label="Completed" value={String(overall.completed)} />
        <StatCard label="Best score" value={`${overall.bestScore}%`} />
      </div>

      <h2 className="mt-12 font-display text-2xl text-ink md:text-3xl">
        Progress by practice test
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Status updates when you open a test, and the percentage updates as you answer
        each question (saved to the database).
      </p>

      <div className="mt-8 space-y-12">
        {sectionBlocks.map((section) => (
          <section key={section.id}>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-line pb-3">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-display text-2xl text-navy">{section.title}</h3>
                  <TierBadge tier={section.tier} size="md" />
                </div>
                <p className="mt-1 text-sm text-muted">{section.description}</p>
              </div>
              <div className="text-right text-sm text-muted">
                <p className="font-semibold text-navy">{section.avgProgress}% section progress</p>
                <p>
                  {section.completedCount}/{section.tests.length} completed
                  {section.bestScore ? ` · best ${section.bestScore}%` : ""}
                </p>
              </div>
            </div>

            <div className="mb-4 h-2 overflow-hidden rounded-full bg-sand">
              <div
                className="h-full rounded-full bg-harbour transition-all"
                style={{ width: `${Math.min(section.avgProgress, 100)}%` }}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {section.tests.map((test) => (
                <PracticeTestCard
                  key={test.id}
                  test={test}
                  locked={test.tier === "premium" && !isPremium}
                  progress={toProgressView(progressMap[test.id])}
                  compact={section.id === "full"}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <h2 className="mt-12 font-display text-2xl text-ink md:text-3xl">Recent activity</h2>
      {records.length === 0 ? (
        <p className="mt-4 rounded-[1.25rem] border border-dashed border-line bg-surface px-5 py-8 text-sm text-muted">
          No activity yet. Open a free{" "}
          <Link href="/#practice" className="font-semibold text-harbour">
            Australia and its people
          </Link>{" "}
          test to start tracking progress.
        </p>
      ) : (
        <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-line bg-surface">
          <ul className="divide-y divide-line">
            {records.slice(0, 10).map((item) => (
              <li
                key={`${item.testId}-${item.updatedAt}`}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-ink">{item.title}</p>
                  <p className="text-xs text-muted">
                    {item.status.replace("_", " ")} · {item.answeredCount}/
                    {item.totalQuestions} answered · updated{" "}
                    {new Date(item.updatedAt).toLocaleString()}
                  </p>
                  <div className="mt-2 h-1.5 max-w-xs overflow-hidden rounded-full bg-sand">
                    <div
                      className={`h-full rounded-full ${
                        item.status === "completed" ? "bg-success" : "bg-harbour"
                      }`}
                      style={{
                        width: `${
                          item.status === "completed"
                            ? item.scorePercent
                            : item.progressPercent
                        }%`,
                      }}
                    />
                  </div>
                </div>
                <span className="rounded-full bg-navy/5 px-3 py-1 text-sm font-bold text-navy">
                  {item.status === "completed"
                    ? `${item.scorePercent}% score`
                    : `${item.progressPercent}% done`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-line bg-surface px-5 py-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className="mt-2 font-display text-3xl text-navy">{value}</p>
    </div>
  );
}
