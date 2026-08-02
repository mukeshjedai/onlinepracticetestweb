/**
 * Environment-aware URLs for Vercel frontend + ASP.NET backend.
 *
 * Production defaults:
 * - Frontend: https://onlinepracticetest.vercel.app
 * - Backend:  http://citizenshiptest.runasp.net
 */

function trimSlash(url: string) {
  return url.replace(/\/+$/, "");
}

/** Public site URL (Stripe redirects, Auth.js). */
export function getAppUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return trimSlash(process.env.NEXT_PUBLIC_APP_URL);
  }
  if (process.env.AUTH_URL) {
    return trimSlash(process.env.AUTH_URL);
  }
  if (process.env.VERCEL_URL) {
    return `https://${trimSlash(process.env.VERCEL_URL)}`;
  }
  return "http://localhost:3000";
}

/** ASP.NET API base URL used by Next.js server routes (BFF). */
export function getAspNetApiUrl() {
  if (process.env.ASPNET_API_URL) {
    return trimSlash(process.env.ASPNET_API_URL);
  }
  if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    return "http://citizenshiptest.runasp.net";
  }
  return process.env.ASPNET_API_URL_DEV?.replace(/\/+$/, "") || "http://localhost:5049";
}

/** Shared secret for Next.js → ASP.NET API calls. */
export function getAspNetApiKey() {
  return process.env.ASPNET_API_KEY || process.env.API_AUTH_KEY || "";
}

export function useAspNetBackend() {
  if (process.env.USE_ASPNET_API === "false") return false;
  if (process.env.USE_ASPNET_API === "true") return true;
  // Auto-enable whenever the shared API key is configured (set this on Vercel).
  return Boolean(getAspNetApiKey());
}
