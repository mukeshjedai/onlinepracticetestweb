import { cookies } from "next/headers";
import { auth } from "@/auth";
import { getPool } from "@/lib/db";

export const GUEST_COOKIE = "acp_guest_id";

function randomId() {
  return `guest_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

async function migrateGuestToEmail(guestId: string, email: string) {
  const pool = getPool();
  // Copy guest rows that don't already exist for the email user
  await pool.query(
    `
    INSERT INTO test_progress (
      owner_key, test_id, title, category, status,
      answered_count, total_questions, correct_count,
      progress_percent, score_percent, started_at, updated_at, completed_at
    )
    SELECT
      $2, test_id, title, category, status,
      answered_count, total_questions, correct_count,
      progress_percent, score_percent, started_at, updated_at, completed_at
    FROM test_progress
    WHERE owner_key = $1
    ON CONFLICT (owner_key, test_id) DO NOTHING
    `,
    [guestId, email],
  );
}

export async function getOwnerKey() {
  const session = await auth();
  const jar = await cookies();
  const guestId = jar.get(GUEST_COOKIE)?.value;

  if (session?.user?.email) {
    const email = session.user.email.toLowerCase();
    if (guestId) {
      try {
        await migrateGuestToEmail(guestId, email);
      } catch (error) {
        console.error("Guest progress migrate failed", error);
      }
    }
    return email;
  }

  if (guestId) return guestId;

  const newGuestId = randomId();
  jar.set(GUEST_COOKIE, newGuestId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return newGuestId;
}
