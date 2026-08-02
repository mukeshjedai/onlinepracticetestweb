export type RecentGoogleAccount = {
  email: string;
  name?: string | null;
  image?: string | null;
  lastUsedAt: number;
};

const STORAGE_KEY = "acp_google_accounts_v1";
const MAX_ACCOUNTS = 6;

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getRecentGoogleAccounts(): RecentGoogleAccount[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentGoogleAccount[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((a) => a && typeof a.email === "string" && a.email.includes("@"))
      .sort((a, b) => (b.lastUsedAt || 0) - (a.lastUsedAt || 0))
      .slice(0, MAX_ACCOUNTS);
  } catch {
    return [];
  }
}

export function rememberGoogleAccount(account: {
  email?: string | null;
  name?: string | null;
  image?: string | null;
}) {
  if (!canUseStorage() || !account.email) return;
  const email = account.email.toLowerCase();
  const existing = getRecentGoogleAccounts().filter((a) => a.email !== email);
  const next: RecentGoogleAccount[] = [
    {
      email,
      name: account.name ?? null,
      image: account.image ?? null,
      lastUsedAt: Date.now(),
    },
    ...existing,
  ].slice(0, MAX_ACCOUNTS);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function removeRecentGoogleAccount(email: string) {
  if (!canUseStorage()) return;
  const next = getRecentGoogleAccounts().filter(
    (a) => a.email !== email.toLowerCase(),
  );
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
