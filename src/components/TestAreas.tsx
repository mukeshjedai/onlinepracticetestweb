"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { PracticeTestCard } from "@/components/PracticeTestCard";
import { TierBadge } from "@/components/TierBadge";
import { categories } from "@/data/questions";
import { allTests, freeSectionId } from "@/data/tests";
import { useProgress } from "@/hooks/useProgress";
import { toProgressView } from "@/lib/progress-api";

type TestAreasProps = {
  isPremium: boolean;
};

export function TestAreas({ isPremium }: TestAreasProps) {
  const { data: session, status } = useSession();
  const { progressMap } = useProgress();
  const hasPremium =
    status === "authenticated" && Boolean(session?.user) && isPremium;

  const fullTests = useMemo(
    () => allTests.filter((t) => t.category === "full").slice(0, 8),
    [],
  );

  return (
    <section id="practice" className="section-band texture-dots px-5 py-20 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-harbour">
            Practice tests
          </p>
          <h2 className="mt-3 font-display text-3xl text-ink md:text-5xl">
            Build confidence before test day
          </h2>
          <p className="mt-4 text-muted">
            <span className="font-semibold text-ink">Australia and its people</span> is free.
            Other sections are Premium. Sign in to save progress as you practise.
          </p>
        </div>

        <div className="mt-12 space-y-10">
          {categories.map((cat) => {
            const tests = allTests.filter((t) => t.category === cat.id);
            const sectionTier = cat.id === freeSectionId ? "free" : "premium";
            return (
              <div key={cat.id}>
                <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-line pb-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-2xl text-navy">{cat.title}</h3>
                      <TierBadge tier={sectionTier} size="md" />
                    </div>
                    <p className="mt-1 text-sm text-muted">{cat.description}</p>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {tests.map((test) => (
                    <PracticeTestCard
                      key={test.id}
                      test={test}
                      locked={test.tier === "premium" && !hasPremium}
                      progress={toProgressView(progressMap[test.id])}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-14">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-display text-2xl text-navy md:text-3xl">Full practice tests</h3>
            <TierBadge tier="premium" size="md" />
          </div>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Full mock exams mix questions from all four key areas.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {fullTests.map((test) => (
              <PracticeTestCard
                key={test.id}
                test={test}
                locked={!hasPremium}
                progress={toProgressView(progressMap[test.id])}
                compact
              />
            ))}
          </div>
          <div className="mt-6">
            <Link
              href="/premium"
              className="inline-flex rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-harbour"
            >
              Unlock all 50 Premium mock exams
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
