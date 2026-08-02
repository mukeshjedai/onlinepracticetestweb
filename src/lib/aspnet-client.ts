import { auth } from "@/auth";
import { getAspNetApiKey, getAspNetApiUrl } from "@/lib/config";

type AspNetFetchOptions = {
  method?: string;
  body?: unknown;
  ownerKey?: string | null;
  /** Override X-User-Email (e.g. Stripe webhook without a browser session). */
  userEmail?: string | null;
  searchParams?: Record<string, string | undefined>;
};

export class AspNetApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function aspNetFetch<T>(
  path: string,
  options: AspNetFetchOptions = {},
): Promise<T> {
  const base = getAspNetApiUrl();
  const apiKey = getAspNetApiKey();
  if (!apiKey) {
    throw new AspNetApiError("ASPNET_API_KEY is not configured", 500);
  }

  const session = await auth();
  const url = new URL(path.startsWith("http") ? path : `${base}${path.startsWith("/") ? "" : "/"}${path}`);

  if (options.searchParams) {
    for (const [key, value] of Object.entries(options.searchParams)) {
      if (value) url.searchParams.set(key, value);
    }
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
    "X-Api-Key": apiKey,
  };

  const email = options.userEmail?.trim() || session?.user?.email;
  if (email) {
    headers["X-User-Email"] = email.toLowerCase();
  }

  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url.toString(), {
    method: options.method || "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    let message = `ASP.NET API error (${res.status})`;
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      // ignore
    }
    throw new AspNetApiError(message, res.status);
  }

  return (await res.json()) as T;
}
