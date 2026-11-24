import { useMemo } from "react";
import { SankeyChart, ScatterChart, TreemapChart } from "../components/Charts";
import { DataTable, FilterBar, TermDetail } from "../components/ExplorerControls";
import type { Filters } from "../state";
import type { CorpusEntry, Language, Manifest, UrlState } from "../types";
import { UI } from "../content";
import {
  asset,
  CATEGORY_META,
  formatNumber,
  percentage,
} from "../lib";

interface ExplorerPageProps {
  entries: CorpusEntry[];
  filtered: CorpusEntry[];
  manifest: Manifest;
  language: Language;
  filters: Filters;
  params: URLSearchParams;
  navigate: (route: UrlState["route"], params: URLSearchParams) => void;
  setFilters: (patch: Partial<Filters>) => void;
  clearFilters: () => void;
  openQa: () => void;
}

export function ExplorerPage({
  entries,
  filtered,
  manifest,
  language,
  filters,
  params,
  navigate,
  setFilters,
  clearFilters,
  openQa,
}: ExplorerPageProps) {
  const copy = UI[language];
  const selectedId = params.get("term") ?? undefined;
  const sort = params.get("sort") ?? "source_text";
  const direction = params.get("dir") === "desc" ? "desc" : "asc";
  const page = Number.parseInt(params.get("page") ?? "1", 10) || 1;
  const selected = entries.find((entry) => entry.id === selectedId);
  const checkedCount = entries.filter((entry) => entry.human_checked).length;

  const sorted = useMemo(() => {
    // Sorting happens after the shared filters so the grid and all charts agree.
    const factor = direction === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const left = a[sort as keyof CorpusEntry];
      const right = b[sort as keyof CorpusEntry];
      if (typeof left === "number" && typeof right === "number") {
        return (left - right) * factor;
      }
      if (typeof left === "boolean" && typeof right === "boolean") {
        return (Number(left) - Number(right)) * factor;
      }
      return String(left ?? "").localeCompare(String(right ?? ""), undefined, {
        sensitivity: "base",
        numeric: true,
      }) * factor;
    });
  }, [direction, filtered, sort]);

  const commit = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
    }
    navigate("explorer", next);
  };

  const updateFilter = (key: keyof Filters, value: string) => {
    const paramMap: Record<keyof Filters, string | null> = {
      q: value ? value : null,
      category: value !== "all" ? value : null,
      human: value !== "all" ? value : null,
      equivalence: value !== "all" ? value : null,
      orientation: value !== "all" ? value : null,
    };
    commit({
      [key === "equivalence" ? "equiv" : key]: paramMap[key],
      term: null,
      page: "1",
    });
  };

  const sortBy = (column: string) => {
    commit({
      sort: column,
      dir: sort === column && direction === "asc" ? "desc" : "asc",
      page: "1",
    });
  };

  const selectTerm = (entry: CorpusEntry) => {
    // A selected term is a filter and must remain shareable in the URL.
    commit({ q: entry.source_text, term: entry.id, page: "1" });
  };

  const filterPatch = (patch: {
    category?: string;
    orientation?: string;
    equiv?: string;
  }) => {
    commit({ ...patch, term: null, page: "1" });
  };

  return (
    <div className="page page--explorer">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">{copy.eyebrow}</span>
          <h1>
            {language === "en" ? (
              <>
                Terminology
                <br />
                <em>in translation.</em>
              </>
            ) : (
              <>
                翻譯中的
                <br />
                <em>術語。</em>
              </>
            )}
          </h1>
          <p>{copy.subtitle}</p>
          <div className="hero-links">
            <button
              type="button"
              className="button button--dark"
              onClick={() => {
                const next = new URLSearchParams(params);
                navigate("report", next);
              }}
            >
              {copy.readReport} <span aria-hidden="true">→</span>
            </button>
            <button
              type="button"
              className="text-link"
              onClick={() => {
                const next = new URLSearchParams(params);
                navigate("codebook", next);
              }}
            >
              {copy.openCodebook}
            </button>
          </div>
        </div>
        <aside className="hero-stats" aria-label={language === "en" ? "Corpus summary" : "語料摘要"}>
          <div>
            <strong>{formatNumber(manifest.rows)}</strong>
            <span>{copy.totalRows}</span>
          </div>
          <div>
            <strong>{formatNumber(manifest.multi_equivalent)}</strong>
            <span>{copy.multiRows}</span>
          </div>
          <div>
            <strong>{manifest.categories.semantic_equivalent}</strong>
            <span>
              {language === "en" ? "semantic equivalents" : "語意對等詞"}
            </span>
          </div>
          <div>
            <strong>{checkedCount}</strong>
            <span>{copy.checkedRows}</span>
          </div>
          <div className="hero-data-links">
            <a href={asset("data/corpus.csv")} download>
              CSV <span aria-hidden="true">↓</span>
            </a>
            <a href={asset("data/corpus.json")} download>
              JSON <span aria-hidden="true">↓</span>
            </a>
            <a href={asset("data/source/naer_food_science_nutrition.ods")} download>
              ODS <span aria-hidden="true">↓</span>
            </a>
          </div>
        </aside>
      </section>

      <FilterBar
        filters={filters}
        language={language}
        resultCount={filtered.length}
        total={entries.length}
        onSearch={(value) => updateFilter("q", value)}
        onFilter={updateFilter}
        onClear={clearFilters}
        onReview={openQa}
      />

      {selected && (
        <TermDetail
          entry={selected}
          language={language}
          close={() => commit({ term: null })}
        />
      )}

      <section className="visual-section" aria-labelledby="visual-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              {language === "en" ? "Linked views" : "連動視圖"}
            </span>
            <h2 id="visual-title">
              {language === "en"
                ? "Read the field through four lenses."
                : "從四個角度閱讀這個領域。"}
            </h2>
          </div>
          <p>
            {language === "en"
              ? "Filters and selections travel across every view. Charts show the same records as the grid."
              : "篩選與選取會在所有視圖間同步；圖表與資料表使用同一批紀錄。"}
          </p>
        </div>

        <div className="chart-grid">
          <article className="chart-card chart-card--wide">
            <header>
              <span className="card-index">01</span>
              <div>
                <h3>
                  {language === "en"
                    ? "How strategies flow into equivalence"
                    : "策略如何流向對等狀態"}
                </h3>
                <p>
                  {language === "en"
                    ? "How do official terms move from translation orientation through a strategy into single or multiple Chinese equivalents?"
                    : "官方術語如何從翻譯導向經由策略，流向單一或多重中文對等詞？"}
                </p>
              </div>
            </header>
            <SankeyChart
              entries={filtered}
              language={language}
              applyFilter={filterPatch}
            />
          </article>

          <article className="chart-card">
            <header>
              <span className="card-index">02</span>
              <div>
                <h3>
                  {language === "en"
                    ? "Where the strategies accumulate"
                    : "策略集中在哪裡"}
                </h3>
                <p>
                  {language === "en"
                    ? "Which translation orientation and strategy account for the largest share of the filtered corpus?"
                    : "哪一種翻譯導向與策略占目前篩選語料的最大比例？"}
                </p>
              </div>
            </header>
            <TreemapChart
              entries={filtered}
              language={language}
              applyFilter={filterPatch}
            />
          </article>

          <article className="chart-card">
            <header>
              <span className="card-index">03</span>
              <div>
                <h3>
                  {language === "en"
                    ? "Length against length"
                    : "源語與譯語長度"}
                </h3>
                <p>
                  {language === "en"
                    ? "How does English term length relate to the number of Chinese characters in the principal rendering?"
                    : "英文詞條長度與主要中文譯法的字數之間有何關係？"}
                </p>
              </div>
            </header>
            <ScatterChart
              entries={filtered}
              language={language}
              selectedId={selectedId}
              selectTerm={selectTerm}
              applyFilter={filterPatch}
            />
          </article>
        </div>
      </section>

      <section className="table-section" aria-labelledby="table-title">
        <div className="section-heading section-heading--compact">
          <div>
            <span className="eyebrow">
              {language === "en" ? "Evidence" : "分析證據"}
            </span>
            <h2 id="table-title">
              {language === "en"
                ? "Inspect every record."
                : "檢視每一筆紀錄。"}
            </h2>
          </div>
          <div className="compact-summary">
            {Object.entries(manifest.categories).map(([category, count]) => (
              <span key={category}>
                <i
                  style={{
                    background:
                      CATEGORY_META[category as keyof typeof CATEGORY_META].color,
                  }}
                />
                {percentage(count, manifest.rows)}
              </span>
            ))}
          </div>
        </div>
        <DataTable
          entries={sorted}
          language={language}
          selectedId={selectedId}
          sort={sort}
          direction={direction}
          page={page}
          onSort={sortBy}
          onPage={(nextPage) => commit({ page: String(nextPage) })}
          onSelect={selectTerm}
        />
      </section>

      <section className="data-download">
        <div>
          <span className="eyebrow">{copy.sourceData}</span>
          <h2>
            {language === "en"
              ? "Trace the data back to its origin."
              : "追溯資料的原始來源。"}
          </h2>
          <p>{copy.sourceAttribution}</p>
        </div>
        <div className="download-list">
          <a href={asset("data/corpus.csv")} download>
            <span>CSV</span>
            <strong>{copy.downloadCorpus}</strong>
          </a>
          <a href={asset("data/corpus.json")} download>
            <span>JSON</span>
            <strong>{copy.downloadJson}</strong>
          </a>
          <a
            href={asset("data/source/naer_food_science_nutrition.ods")}
            download
          >
            <span>ODS</span>
            <strong>{copy.downloadSource}</strong>
          </a>
        </div>
      </section>
    </div>
  );
}
