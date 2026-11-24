import type { CSSProperties } from "react";
import type { Filters } from "../state";
import type { CorpusEntry, Language } from "../types";
import {
  CATEGORY_META,
  ORIENTATION_META,
  categoryLabel,
  downloadText,
  formatNumber,
  makeCsv,
  orientationLabel,
} from "../lib";
import { UI } from "../content";

interface FilterBarProps {
  filters: Filters;
  language: Language;
  resultCount: number;
  total: number;
  onSearch: (value: string) => void;
  onFilter: (key: keyof Filters, value: string) => void;
  onClear: () => void;
  onReview: () => void;
}

export function FilterBar({
  filters,
  language,
  resultCount,
  total,
  onSearch,
  onFilter,
  onClear,
  onReview,
}: FilterBarProps) {
  const copy = UI[language];
  const hasFilters =
    filters.q ||
    filters.category !== "all" ||
    filters.human !== "all" ||
    filters.equivalence !== "all" ||
    filters.orientation !== "all";

  return (
    <section className="filter-panel" aria-label={copy.filters}>
      <div className="search-row">
        <label className="search-field">
          <span className="sr-only">{copy.searchLabel}</span>
          <span className="search-icon" aria-hidden="true">
            <SearchIcon />
          </span>
          <input
            type="search"
            value={filters.q}
            onChange={(event) => onSearch(event.target.value)}
            placeholder={copy.searchPlaceholder}
            autoComplete="off"
          />
        </label>
        <button type="button" className="button button--quiet" onClick={onReview}>
          {copy.reviewSample}
        </button>
      </div>
      <div className="filter-row">
        <label>
          <span>{copy.filterCategory}</span>
          <select
            value={filters.category}
            onChange={(event) => onFilter("category", event.target.value)}
          >
            <option value="all">{copy.all}</option>
            {Object.entries(CATEGORY_META).map(([id, meta]) => (
              <option key={id} value={id}>
                {meta[language === "en" ? "en" : "zh"]}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{copy.filterChecked}</span>
          <select
            value={filters.human}
            onChange={(event) => onFilter("human", event.target.value)}
          >
            <option value="all">{copy.all}</option>
            <option value="yes">{copy.yes}</option>
            <option value="no">{copy.no}</option>
          </select>
        </label>
        <label>
          <span>{copy.filterEquivalence}</span>
          <select
            value={filters.equivalence}
            onChange={(event) => onFilter("equivalence", event.target.value)}
          >
            <option value="all">{copy.all}</option>
            <option value="single">{copy.single}</option>
            <option value="multiple">{copy.multiple}</option>
          </select>
        </label>
        <label>
          <span>{copy.filterOrientation}</span>
          <select
            value={filters.orientation}
            onChange={(event) => onFilter("orientation", event.target.value)}
          >
            <option value="all">{copy.all}</option>
            <option value="source">{orientationLabel("source", language)}</option>
            <option value="target">{orientationLabel("target", language)}</option>
            <option value="mixed">{orientationLabel("mixed", language)}</option>
          </select>
        </label>
        <div className="result-count" aria-live="polite">
          <strong>{formatNumber(resultCount)}</strong>
          <span>
            {copy.results} · {formatNumber(total)}
          </span>
        </div>
        {hasFilters && (
          <button type="button" className="text-button" onClick={onClear}>
            {copy.clear}
          </button>
        )}
      </div>
    </section>
  );
}

interface DataTableProps {
  entries: CorpusEntry[];
  language: Language;
  selectedId?: string;
  sort: string;
  direction: "asc" | "desc";
  page: number;
  onSort: (column: string) => void;
  onPage: (page: number) => void;
  onSelect: (entry: CorpusEntry) => void;
}

const TABLE_COLUMNS = [
  ["source_text", "term"],
  ["target_primary", "primaryTarget"],
  ["category", "category"],
  ["orientation", "orientation"],
  ["multi_equivalent", "equivalence"],
  ["human_checked", "checked"],
] as const;

export function DataTable({
  entries,
  language,
  selectedId,
  sort,
  direction,
  page,
  onSort,
  onPage,
  onSelect,
}: DataTableProps) {
  const copy = UI[language];
  const pageSize = 25;
  const pageCount = Math.max(1, Math.ceil(entries.length / pageSize));
  const safePage = Math.min(Math.max(1, page), pageCount);
  const visible = entries.slice((safePage - 1) * pageSize, safePage * pageSize);

  const sortIndicator = (column: string) =>
    sort === column ? (direction === "asc" ? " ↑" : " ↓") : "";

  return (
    <div className="data-panel">
      <div className="data-toolbar">
        <div>
          <span className="section-kicker">
            {language === "en" ? "Linked data grid" : "連動資料表"}
          </span>
          <h3>{language === "en" ? "Corpus records" : "語料紀錄"}</h3>
        </div>
        <button
          type="button"
          className="button button--paper"
          onClick={() =>
            downloadText(
              "terminology-in-translation-filtered.csv",
              makeCsv(entries),
              "text/csv;charset=utf-8",
            )
          }
        >
          {copy.exportFiltered}
        </button>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              {TABLE_COLUMNS.map(([column, label]) => (
                <th key={column} scope="col">
                  <button
                    type="button"
                    className="sort-button"
                    onClick={() => onSort(column)}
                    title={`${copy.sort}: ${copy[label]}`}
                  >
                    {copy[label]}
                    {sortIndicator(column)}
                  </button>
                </th>
              ))}
              <th scope="col">
                <span className="sr-only">{copy.detail}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((entry) => (
              <tr
                key={entry.id}
                className={entry.id === selectedId ? "row--selected" : ""}
              >
                <td>
                  <button
                    type="button"
                    className="term-button"
                    onClick={() => onSelect(entry)}
                  >
                    {entry.source_text}
                  </button>
                  <span className="table-id">#{entry.id}</span>
                </td>
                <td className="target-cell">{entry.target_primary}</td>
                <td>
                  <span
                    className="category-chip"
                    style={{
                      "--chip-color": CATEGORY_META[entry.category].color,
                      "--chip-soft": CATEGORY_META[entry.category].soft,
                    } as CSSProperties}
                  >
                    {categoryLabel(entry.category, language)}
                  </span>
                </td>
                <td className="nowrap">
                  {orientationLabel(entry.orientation, language)}
                </td>
                <td>
                  {entry.multi_equivalent ? (
                    <span className="status status--multiple">
                      {entry.target_alternatives.length}
                    </span>
                  ) : (
                    <span className="status">1</span>
                  )}
                </td>
                <td>
                  {entry.human_checked ? (
                    <span className="check check--yes">
                      {language === "en" ? "Yes" : "是"}
                    </span>
                  ) : (
                    <span className="check">
                      {language === "en" ? "No" : "否"}
                    </span>
                  )}
                </td>
                <td>
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => onSelect(entry)}
                    aria-label={`${copy.detail}: ${entry.source_text}`}
                  >
                    →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!visible.length && <div className="table-empty">{copy.chartEmpty}</div>}
      </div>
      <div className="pagination">
        <span>
          {copy.page} {safePage} / {pageCount}
        </span>
        <div>
          <button
            type="button"
            className="button button--quiet"
            disabled={safePage <= 1}
            onClick={() => onPage(safePage - 1)}
          >
            {copy.previous}
          </button>
          <button
            type="button"
            className="button button--quiet"
            disabled={safePage >= pageCount}
            onClick={() => onPage(safePage + 1)}
          >
            {copy.next}
          </button>
        </div>
      </div>
    </div>
  );
}

export function TermDetail({
  entry,
  language,
  close,
}: {
  entry: CorpusEntry;
  language: Language;
  close: () => void;
}) {
  const copy = UI[language];
  return (
    <aside className="term-detail" aria-live="polite">
      <div className="term-detail__header">
        <div>
          <span className="section-kicker">{copy.selectedTerm}</span>
          <h3>{entry.source_text}</h3>
        </div>
        <button type="button" className="icon-button" onClick={close}>
          ×<span className="sr-only">{copy.close}</span>
        </button>
      </div>
      <div className="term-detail__pair">
        <span>{copy.primaryTarget}</span>
        <strong>{entry.target_primary}</strong>
      </div>
      {entry.target_alternatives.length > 1 && (
        <div className="detail-field">
          <span>{copy.alternatives}</span>
          <p>{entry.target_alternatives.join(" · ")}</p>
        </div>
      )}
      <dl className="detail-grid">
        <div>
          <dt>{copy.category}</dt>
          <dd>{categoryLabel(entry.category, language)}</dd>
        </div>
        <div>
          <dt>{copy.orientation}</dt>
          <dd>{orientationLabel(entry.orientation, language)}</dd>
        </div>
        <div>
          <dt>{copy.confidence}</dt>
          <dd>{Math.round(entry.category_confidence * 100)}%</dd>
        </div>
        <div>
          <dt>{copy.humanCheck}</dt>
          <dd>
            {entry.human_checked
              ? language === "en"
                ? "Yes"
                : "是"
              : copy.notChecked}
          </dd>
        </div>
      </dl>
      <div className="detail-field">
        <span>{language === "en" ? "Classification evidence" : "分類證據"}</span>
        <p>{entry.category_evidence}</p>
      </div>
      <div className="detail-field">
        <span>{language === "en" ? "Source" : "來源"}</span>
        <p>{entry.source}</p>
        {entry.duplicate_normalized_term && (
          <p className="detail-warning">
            {language === "en"
              ? "This record becomes identical to another source term only after whitespace normalization. Both NAER IDs are retained."
              : "此詞條只在空白正規化後與另一筆來源詞相同；兩個樂詞網編號均保留。"}
          </p>
        )}
      </div>
      <div className="term-detail__footer">
        <a
          href={entry.source_url}
          target="_blank"
          rel="noreferrer"
          className="button button--dark"
        >
          {copy.openSource}
        </a>
        {entry.qa_sample && (
          <span className="status status--sample">{copy.qaSample}</span>
        )}
      </div>
    </aside>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.2 4.2" />
    </svg>
  );
}
