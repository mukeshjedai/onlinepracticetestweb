"use client";

import Link from "next/link";
import { TierBadge } from "@/components/TierBadge";
import type { PracticeTest } from "@/data/tests";
import type { TestProgressView } from "@/lib/progress-api";

type PracticeTestCardProps = {
  test: PracticeTest;
  locked: boolean;
  progress: TestProgressView;
  compact?: boolean;
};

export function PracticeTestCard({
  test,
  locked,
  progress,
  compact = false,
}: PracticeTestCardProps) {
  const barPercent =
    progress.status === "completed"
      ? progress.scorePercent
      : progress.progressPercent;

  let statusLabel = "Not started";
  if (progress.status === "started") statusLabel = "Started";
  if (progress.status === "in_progress") {
    statusLabel = `In progress · ${progress.answeredCount}/${progress.totalQuestions || test.questionCount}`;
  }
  if (progress.status === "completed") {
    statusLabel =
      progress.scorePercent >= 75
        ? `Completed · ${progress.scorePercent}%`
        : `Needs practice · ${progress.scorePercent}%`;
  }

  const actionLabel = locked
    ? "Unlock →"
    : progress.status === "completed"
      ? "Retake →"
      : progress.status === "not_started"
        ? compact
          ? "Start mock →"
          : "Start →"
        : "Continue →";

  const rightValue =
    progress.status === "completed"
      ? `${progress.scorePercent}% score`
      : progress.status === "not_started"
        ? "0%"
        : `${barPercent}% done`;

  return (
    <Link
      href={locked ? "/premium" : `/practice/${test.id}`}
      className="group flex flex-col rounded-2xl border border-line bg-surface px-4 py-4 transition hover:-translate-y-0.5 hover:border-harbour/40 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 pr-2">
          <div className="mb-2">
            <TierBadge tier={test.tier} />
          </div>
          <p className="font-medium text-ink group-hover:text-harbour">{test.title}</p>
          <p className="mt-1 text-xs text-muted">{test.questionCount} exam questions</p>
        </div>
        <span className="shrink-0 text-sm font-medium text-harbour">{actionLabel}</span>
      </div>

      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between gap-2 text-xs">
          <span className="text-muted">{statusLabel}</span>
          <span
            className={`shrink-0 font-semibold ${
              progress.status === "completed"
                ? progress.scorePercent >= 75
                  ? "text-success"
                  : "text-[#8a6a0a]"
                : progress.status === "not_started"
                  ? "text-muted"
                  : "text-harbour"
            }`}
          >
            {rightValue}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-sand">
          <div
            className={`h-full rounded-full transition-all ${
              progress.status === "not_started"
                ? "bg-line"
                : progress.status === "completed"
                  ? progress.scorePercent >= 75
                    ? "bg-success"
                    : "bg-gold"
                  : "bg-harbour"
            }`}
            style={{ width: `${Math.min(barPercent, 100)}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
