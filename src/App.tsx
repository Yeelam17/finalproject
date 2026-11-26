import { useEffect, useMemo, useState } from "react";
import { Layout } from "./components/Layout";
import { QaReview } from "./components/QaReview";
import { ExplorerPage } from "./pages/ExplorerPage";
import { ReportPage } from "./pages/ReportPage";
import { CodebookPage } from "./pages/CodebookPage";
import { AiUsePage } from "./pages/AiUsePage";
import {
  filtersFromParams,
  languageFromParams,
  useFilteredCorpus,
  useHashState,
  useQaDecisions,
} from "./state";
import type { CorpusEntry, Manifest, QaDecisions, UrlState } from "./types";
import { annotateRegionalComparisons, asset } from "./lib";

interface CorpusBundle {
  entries: CorpusEntry[];
  manifest: Manifest;
}

const applyQaDecisions = (
  entries: CorpusEntry[],
  decisions: QaDecisions,
): CorpusEntry[] =>
  // Review data stays local until its JSON export is incorporated into the corpus.
  entries.map((entry) =>
    decisions[entry.id]?.status === "confirmed"
      ? { ...entry, human_checked: true }
      : entry,
  );

export default function App() {
  const [hashState, navigate] = useHashState();
  const [bundle, setBundle] = useState<CorpusBundle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [qaOpen, setQaOpen] = useState(false);
  const [qaDecisions, setQaDecision, resetQa] = useQaDecisions();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [hashState.route]);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetch(asset("data/corpus.json")).then((response) => {
        if (!response.ok) throw new Error(`Corpus: ${response.status}`);
        return response.json() as Promise<CorpusEntry[]>;
      }),
      fetch(asset("data/manifest.json")).then((response) => {
        if (!response.ok) throw new Error(`Manifest: ${response.status}`);
        return response.json() as Promise<Manifest>;
      }),
    ])
      .then(([entries, manifest]) => {
        if (active) setBundle({ entries, manifest });
      })
      .catch((reason: unknown) => {
        if (active) {
          setError(
            reason instanceof Error ? reason.message : "Unable to load corpus",
          );
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const entries = useMemo(
    () =>
      bundle
        ? annotateRegionalComparisons(
            applyQaDecisions(bundle.entries, qaDecisions),
          )
        : [],
    [bundle, qaDecisions],
  );
  const language = languageFromParams(hashState.params);
  const filters = useMemo(
    () => filtersFromParams(hashState.params),
    [hashState.params],
  );
  const filtered = useFilteredCorpus(entries, filters);

  useEffect(() => {
    // Keep assistive technology aligned with the visual language switch.
    document.documentElement.lang = language === "en" ? "en" : "zh-Hant";
  }, [language]);

  const toggleLanguage = () => {
    const next = new URLSearchParams(hashState.params);
    if (language === "en") next.set("lang", "zh");
    else next.delete("lang");
    navigate(hashState.route, next);
  };

  const setFilters = (patch: Partial<typeof filters>) => {
    const next = new URLSearchParams(hashState.params);
    const pairs: Array<[keyof typeof filters, string]> = [
      ["q", "q"],
      ["category", "category"],
      ["human", "human"],
      ["equivalence", "equiv"],
      ["orientation", "orientation"],
      ["region", "region"],
      ["comparison", "compare"],
    ];
    for (const [key, param] of pairs) {
      if (!(key in patch)) continue;
      const value = patch[key];
      if (!value || value === "all") next.delete(param);
      else next.set(param, String(value));
    }
    next.set("page", "1");
    navigate("explorer", next);
  };

  const clearFilters = () => {
    const next = new URLSearchParams();
    next.set("lang", language);
    navigate("explorer", next);
  };

  if (error) {
    return (
      <div className="load-state load-state--error">
        <span className="brand-mark" aria-hidden="true">
          譯
        </span>
        <h1>Corpus unavailable</h1>
        <p>{error}</p>
        <button type="button" className="button button--dark" onClick={() => window.location.reload()}>
          Reload
        </button>
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className="load-state">
        <span className="brand-mark" aria-hidden="true">
          譯
        </span>
        <p>Loading 5,691 bilingual terms…</p>
        <div className="loading-line" />
      </div>
    );
  }

  let page;
  if (hashState.route === "report") {
    page = (
      <ReportPage
        entries={entries}
        manifest={bundle.manifest}
        language={language}
      />
    );
  } else if (hashState.route === "codebook") {
    page = (
      <CodebookPage
        manifest={bundle.manifest}
        entries={entries}
        language={language}
        params={hashState.params}
        navigate={navigate}
      />
    );
  } else if (hashState.route === "ai-use") {
    page = <AiUsePage language={language} />;
  } else {
    page = (
      <ExplorerPage
        entries={entries}
        filtered={filtered}
        manifest={bundle.manifest}
        language={language}
        filters={filters}
        params={hashState.params}
        navigate={navigate}
        setFilters={setFilters}
        clearFilters={clearFilters}
        openQa={() => setQaOpen(true)}
      />
    );
  }

  return (
    <>
      <Layout
        route={hashState.route}
        params={hashState.params}
        language={language}
        navigate={navigate}
        toggleLanguage={toggleLanguage}
      >
        {page}
      </Layout>
      {qaOpen && (
        <QaReview
          entries={entries}
          language={language}
          decisions={qaDecisions}
          setDecision={setQaDecision}
          reset={resetQa}
          close={() => setQaOpen(false)}
        />
      )}
    </>
  );
}
