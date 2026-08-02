"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchProgressMap,
  type TestProgressRecord,
} from "@/lib/progress-api";

export function useProgress() {
  const [progressMap, setProgressMap] = useState<Record<string, TestProgressRecord>>({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const map = await fetchProgressMap();
      setProgressMap(map);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

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

  return { progressMap, loading, refresh };
}
