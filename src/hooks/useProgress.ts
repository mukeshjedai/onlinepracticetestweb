"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import {
  fetchProgressMap,
  type TestProgressRecord,
} from "@/lib/progress-api";

export function useProgress() {
  const { data: session, status } = useSession();
  const [progressMap, setProgressMap] = useState<Record<string, TestProgressRecord>>({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (status === "loading") return;
    if (!session?.user?.email) {
      setProgressMap({});
      setLoading(false);
      return;
    }

    try {
      const map = await fetchProgressMap();
      setProgressMap(map);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email, status]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const onUpdate = () => {
      void refresh();
    };
    window.addEventListener("focus", onUpdate);
    window.addEventListener("acp-progress-updated", onUpdate);
    document.addEventListener("visibilitychange", onUpdate);
    return () => {
      window.removeEventListener("focus", onUpdate);
      window.removeEventListener("acp-progress-updated", onUpdate);
      document.removeEventListener("visibilitychange", onUpdate);
    };
  }, [refresh]);

  return { progressMap, loading, refresh, signedIn: Boolean(session?.user?.email) };
}
