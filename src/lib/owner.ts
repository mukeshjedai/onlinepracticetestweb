import { auth } from "@/auth";

/** Returns signed-in user email, or null if not authenticated. */
export async function getSignedInEmail() {
  const session = await auth();
  return session?.user?.email?.toLowerCase() ?? null;
}

/** @deprecated Use getSignedInEmail — progress is signed-in only. */
export async function getOwnerKey() {
  return getSignedInEmail();
}
