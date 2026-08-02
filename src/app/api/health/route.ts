import { NextResponse } from "next/server";
import { getAppUrl, getAspNetApiUrl, useAspNetBackend } from "@/lib/config";

export async function GET() {
  const backend = useAspNetBackend();
  let aspNet: { ok: boolean; status?: number; error?: string } = { ok: false };

  if (backend) {
    try {
      const res = await fetch(`${getAspNetApiUrl()}/api/health`, {
        cache: "no-store",
      });
      aspNet = { ok: res.ok, status: res.status };
    } catch (error) {
      aspNet = {
        ok: false,
        error: error instanceof Error ? error.message : "unreachable",
      };
    }
  }

  return NextResponse.json({
    status: "ok",
    appUrl: getAppUrl(),
    aspNetApiUrl: getAspNetApiUrl(),
    useAspNetBackend: backend,
    aspNet,
  });
}
