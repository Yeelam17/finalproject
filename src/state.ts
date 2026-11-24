import { useEffect, useMemo, useState } from "react";
import type {
  CategoryId,
  CorpusEntry,
  Language,
  OrientationId,
  QaDecisions,
  UrlState,
} from "./types";
import { buildHash, parseRoute } from "./lib";

const QA_STORAGE_KEY = "terminology-in-translation-qa-v1";

export const useHashState = (): [
  UrlState,
  (route: UrlState["route"], params: URLSearchParams) => void,
] => {
  const [state, setState] = useState<UrlState>(() =>
    parseRoute(window.location.hash),
  );

  useEffect(() => {
    const handleHash = () => setState(parseRoute(window.location.hash));
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const navigate = (
    route: UrlState["route"],
    params: URLSearchParams,
  ): void => {
    const next = buildHash(route, params);
    if (window.location.hash === next) return;
    window.location.hash = next;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return [state, navigate];
};

export const useQaDecisions = (): [
  QaDecisions,
  (id: string, status: "confirmed" | "correction", note?: string) => void,
  () => void,
] => {
  const [decisions, setDecisions] = useState<QaDecisions>(() => {
    try {
      return JSON.parse(
        window.localStorage.getItem(QA_STORAGE_KEY) ?? "{}",
      ) as QaDecisions;
    } catch {
      return {};
    }
  });

  useEffect(() => {
    window.localStorage.setItem(QA_STORAGE_KEY, JSON.stringify(decisions));
  }, [decisions]);

  const setDecision = (
    id: string,
    status: "confirmed" | "correction",
    note = "",
  ): void => {
    setDecisions((current) => ({
      ...current,
      [id]: { status, note, updatedAt: new Date().toISOString() },
    }));
  };

  const reset = (): void => {
    setDecisions({});
  };

  return [decisions, setDecision, reset];
};

export interface Filters {
  q: string;
  category: CategoryId | "all";
  human: "all" | "yes" | "no";
  equivalence: "all" | "single" | "multiple";
  orientation: OrientationId | "all";
}

export const filtersFromParams = (params: URLSearchParams): Filters => ({
  q: params.get("q") ?? "",
  category: (params.get("category") as CategoryId | null) ?? "all",
  human:
    (params.get("human") as "all" | "yes" | "no" | null) ??
    "all",
  equivalence:
    (params.get("equiv") as "all" | "single" | "multiple" | null) ??
    "all",
  orientation:
    (params.get("orientation") as OrientationId | "all" | null) ??
    "all",
});

export const languageFromParams = (params: URLSearchParams): Language =>
  params.get("lang") === "zh" ? "zh" : "en";

export const filterCorpus = (
  entries: CorpusEntry[],
  filters: Filters,
): CorpusEntry[] => {
  const query = filters.q.trim().toLocaleLowerCase();
  return entries.filter((entry) => {
    if (filters.category !== "all" && entry.category !== filters.category) {
      return false;
    }
    if (filters.human === "yes" && !entry.human_checked) return false;
    if (filters.human === "no" && entry.human_checked) return false;
    if (filters.equivalence === "multiple" && !entry.multi_equivalent) {
      return false;
    }
    if (filters.equivalence === "single" && entry.multi_equivalent) {
      return false;
    }
    if (
      filters.orientation !== "all" &&
      entry.orientation !== filters.orientation
    ) {
      return false;
    }
    if (!query) return true;
    const haystack = [
      entry.source_text,
      entry.target_text,
      entry.target_primary,
      entry.id,
    ]
      .join(" ")
      .toLocaleLowerCase();
    return haystack.includes(query);
  });
};

export const useFilteredCorpus = (
  entries: CorpusEntry[],
  filters: Filters,
): CorpusEntry[] => useMemo(() => filterCorpus(entries, filters), [entries, filters]);
