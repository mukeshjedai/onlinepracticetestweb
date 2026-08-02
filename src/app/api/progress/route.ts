import { NextRequest, NextResponse } from "next/server";
import { AspNetApiError, aspNetFetch } from "@/lib/aspnet-client";
import { useAspNetBackend } from "@/lib/config";
import { getSignedInEmail } from "@/lib/owner";
import { listProgress, upsertProgress } from "@/lib/progress-db";

export async function GET() {
  try {
    const email = await getSignedInEmail();
    if (!email) {
      return NextResponse.json(
        { ownerKey: null, items: [], requiresAuth: true },
        { status: 200 },
      );
    }

    if (useAspNetBackend()) {
      const data = await aspNetFetch<{ ownerKey: string; items: unknown[] }>(
        "/api/progress",
        { searchParams: { ownerKey: email } },
      );
      return NextResponse.json(data);
    }

    const items = await listProgress(email);
    return NextResponse.json({ ownerKey: email, items });
  } catch (error) {
    console.error("GET /api/progress", error);
    const status = error instanceof AspNetApiError ? error.status : 500;
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load progress" },
      { status },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const email = await getSignedInEmail();
    if (!email) {
      return NextResponse.json(
        { error: "Sign in required to save progress.", requiresAuth: true },
        { status: 401 },
      );
    }

    const body = await req.json();
    const testId = String(body.testId || "");
    const title = String(body.title || "");
    const category = String(body.category || "");
    const status = String(body.status || "started") as
      | "started"
      | "in_progress"
      | "completed";
    const answeredCount = Number(body.answeredCount || 0);
    const totalQuestions = Number(body.totalQuestions || 0);
    const correctCount = Number(body.correctCount || 0);

    if (!testId || !title || !category || !totalQuestions) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const progressPercent = Math.min(
      100,
      Math.round((answeredCount / totalQuestions) * 100),
    );
    const scorePercent = Math.min(
      100,
      Math.round((correctCount / totalQuestions) * 100),
    );

    const payload = {
      ownerKey: email,
      testId,
      title,
      category,
      status,
      answeredCount,
      totalQuestions,
      correctCount,
      progressPercent:
        status === "completed" ? 100 : body.progressPercent ?? progressPercent,
      scorePercent: body.scorePercent ?? scorePercent,
    };

    if (useAspNetBackend()) {
      const data = await aspNetFetch<{ item: unknown }>("/api/progress", {
        method: "POST",
        body: payload,
      });
      return NextResponse.json(data);
    }

    const item = await upsertProgress(payload);
    return NextResponse.json({ item });
  } catch (error) {
    console.error("POST /api/progress", error);
    const status = error instanceof AspNetApiError ? error.status : 500;
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save progress" },
      { status },
    );
  }
}
