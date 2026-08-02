import { NextRequest, NextResponse } from "next/server";
import { getOwnerKey } from "@/lib/owner";
import { listProgress, upsertProgress } from "@/lib/progress-db";

export async function GET() {
  try {
    const ownerKey = await getOwnerKey();
    const items = await listProgress(ownerKey);
    return NextResponse.json({ ownerKey, items });
  } catch (error) {
    console.error("GET /api/progress", error);
    return NextResponse.json(
      { error: "Unable to load progress" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const ownerKey = await getOwnerKey();

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

    const item = await upsertProgress({
      ownerKey,
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
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error("POST /api/progress", error);
    return NextResponse.json(
      { error: "Unable to save progress" },
      { status: 500 },
    );
  }
}
