"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CategoryId, Question } from "@/data/questions";
import { saveProgressUpdate } from "@/lib/progress-api";

type QuizPlayerProps = {
  title: string;
  testId: string;
  category: CategoryId | "full";
  questions: Question[];
};

type AnswerMap = Record<number, number>;

export function QuizPlayer({ title, testId, category, questions }: QuizPlayerProps) {
  const { data: session, status: authStatus } = useSession();
  const signedIn = Boolean(session?.user?.email);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [finished, setFinished] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const startedRef = useRef(false);

  const current = questions[index];
  const selected = answers[current.id];
  const hasSelection = selected !== undefined;

  const correctCount = useMemo(() => {
    return questions.reduce((acc, q) => {
      if (answers[q.id] === q.answer) return acc + 1;
      return acc;
    }, 0);
  }, [answers, questions]);

  const answeredCount = Object.keys(answers).length;
  const completionPercent = Math.round((answeredCount / questions.length) * 100);
  const scorePercent = Math.round((correctCount / questions.length) * 100);

  async function persist(payload: {
    status: "started" | "in_progress" | "completed";
    answeredCount: number;
    correctCount: number;
    progressPercent?: number;
    scorePercent?: number;
  }) {
    // Never persist progress for anonymous users (all environments)
    if (!signedIn) return;

    try {
      setSaveError(null);
      const result = await saveProgressUpdate({
        testId,
        title,
        category,
        totalQuestions: questions.length,
        ...payload,
      });
      if (result === null) {
        // 401 / not signed in
        return;
      }
    } catch (error) {
      console.error(error);
      setSaveError("Could not save progress to the database.");
    }
  }

  useEffect(() => {
    if (authStatus === "loading") return;
    if (!signedIn) {
      startedRef.current = false;
      return;
    }
    if (startedRef.current) return;
    startedRef.current = true;
    void persist({
      status: "started",
      answeredCount: 0,
      correctCount: 0,
      progressPercent: 0,
      scorePercent: 0,
    });
  }, [testId, signedIn, authStatus]);

  function selectOption(option: number) {
    if (hasSelection) return;
    const nextAnswers = { ...answers, [current.id]: option };
    setAnswers(nextAnswers);

    const nextAnswered = Object.keys(nextAnswers).length;
    const nextCorrect = questions.reduce((acc, q) => {
      if (nextAnswers[q.id] === q.answer) return acc + 1;
      return acc;
    }, 0);

    void persist({
      status: "in_progress",
      answeredCount: nextAnswered,
      correctCount: nextCorrect,
      progressPercent: Math.round((nextAnswered / questions.length) * 100),
      scorePercent: Math.round((nextCorrect / questions.length) * 100),
    });
  }

  function goNext() {
    if (index >= questions.length - 1) {
      const nextCorrect = questions.reduce((acc, q) => {
        if (answers[q.id] === q.answer) return acc + 1;
        return acc;
      }, 0);
      const nextPercent = Math.round((nextCorrect / questions.length) * 100);
      void persist({
        status: "completed",
        answeredCount: questions.length,
        correctCount: nextCorrect,
        progressPercent: 100,
        scorePercent: nextPercent,
      });
      setFinished(true);
      return;
    }

    setIndex((i) => i + 1);
    void persist({
      status: "in_progress",
      answeredCount,
      correctCount,
      progressPercent: Math.round((answeredCount / questions.length) * 100),
      scorePercent,
    });
  }

  function goPrev() {
    if (index > 0) setIndex((i) => i - 1);
  }

  if (finished) {
    const passed = scorePercent >= 75;
    return (
      <div className="mx-auto max-w-2xl rounded-[1.75rem] border border-line bg-surface p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-harbour">
          Results
        </p>
        <h1 className="mt-2 font-display text-3xl text-ink">{title}</h1>
        <p className="mt-6 font-display text-5xl text-navy">
          {correctCount}/{questions.length}
        </p>
        <p className="mt-2 text-muted">
          Score {scorePercent}% —{" "}
          {passed ? "Great work. You're on track." : "Keep practising the weaker topics."}
        </p>
        {signedIn ? (
          <p className="mt-2 text-sm text-success">Progress saved to your dashboard.</p>
        ) : (
          <p className="mt-2 text-sm text-muted">
            <Link href="/login?callbackUrl=/dashboard" className="font-semibold text-harbour">
              Sign in
            </Link>{" "}
            to save progress to your dashboard.
          </p>
        )}
        {saveError && <p className="mt-2 text-sm text-danger">{saveError}</p>}
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-sand">
          <div
            className={`h-full rounded-full ${passed ? "bg-success" : "bg-gold"}`}
            style={{ width: `${scorePercent}%` }}
          />
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              setAnswers({});
              setIndex(0);
              setFinished(false);
              startedRef.current = false;
              if (signedIn) {
                void persist({
                  status: "started",
                  answeredCount: 0,
                  correctCount: 0,
                  progressPercent: 0,
                  scorePercent: 0,
                }).then(() => {
                  startedRef.current = true;
                });
              }
            }}
            className="rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white"
          >
            Retry test
          </button>
          <Link
            href="/dashboard"
            className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-navy"
          >
            View dashboard
          </Link>
          <Link
            href="/#practice"
            className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-navy"
          >
            More practice
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-5 rounded-[1.4rem] border border-line bg-surface p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-navy">Live progress</p>
            <p className="text-xs text-muted">
              {signedIn
                ? "Saved as you answer each question"
                : "Sign in to save progress to your dashboard"}
            </p>
          </div>
          <div className="text-right">
            <span className="inline-flex min-w-16 items-center justify-center rounded-full bg-navy px-3 py-1 text-sm font-bold text-white">
              {answeredCount}/{questions.length}
            </span>
            <p className="mt-1 text-xs text-muted">
              {completionPercent}% complete · score {scorePercent}%
            </p>
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-sand">
          <div
            className="h-full rounded-full bg-harbour transition-all"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
        {!signedIn && authStatus !== "loading" && (
          <p className="mt-2 text-xs text-muted">
            <Link href={`/login?callbackUrl=/practice/${testId}`} className="font-semibold text-harbour">
              Sign in with Google
            </Link>{" "}
            to track this test on your dashboard.
          </p>
        )}
        {saveError && <p className="mt-2 text-xs text-danger">{saveError}</p>}
      </div>

      <div className="rounded-[1.75rem] border border-line bg-surface shadow-sm overflow-hidden">
        <div className="flex items-center justify-between gap-3 bg-navy px-5 py-4 text-white">
          <h1 className="font-display text-lg md:text-xl">
            Question {index + 1} of {questions.length}
          </h1>
          <div className="h-2 w-28 overflow-hidden rounded-full bg-white/20 md:w-40">
            <div
              className="h-full rounded-full bg-gold"
              style={{ width: `${((index + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-5 md:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{title}</p>
          <h2 className="mt-3 text-xl leading-snug text-ink md:text-2xl">{current.question}</h2>

          <div className="mt-6 space-y-3">
            {current.options.map((option, i) => {
              const value = (i + 1) as 1 | 2 | 3 | 4;
              const isSelected = selected === value;
              const isCorrect = current.answer === value;
              let styles =
                "border-line hover:border-harbour hover:bg-sand/60 cursor-pointer";
              if (hasSelection) {
                if (isCorrect) styles = "border-success bg-success/10";
                else if (isSelected) styles = "border-danger bg-danger/10";
                else styles = "border-line opacity-45";
              }

              return (
                <button
                  key={`${current.id}-${option}`}
                  type="button"
                  disabled={hasSelection}
                  onClick={() => selectOption(value)}
                  className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition ${styles}`}
                >
                  <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy/5 text-sm font-semibold text-navy">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm md:text-base">{option}</span>
                </button>
              );
            })}
          </div>

          {hasSelection && (
            <div
              className={`mt-5 rounded-2xl px-4 py-3 text-sm ${
                selected === current.answer
                  ? "bg-success/10 text-success"
                  : "bg-danger/10 text-danger"
              }`}
            >
              {selected === current.answer
                ? "Correct! You selected the right answer."
                : `Incorrect. The correct answer is option ${String.fromCharCode(64 + current.answer)}.`}
            </div>
          )}

          <div className="mt-7 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={goPrev}
              disabled={index === 0}
              className="rounded-full border border-line px-4 py-2 text-sm font-medium text-navy disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={!hasSelection}
              className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
            >
              {index >= questions.length - 1 ? "Finish quiz" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
