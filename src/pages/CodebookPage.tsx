import type { CSSProperties } from "react";
import type {
  CategoryId,
  ComparisonStatus,
  CorpusEntry,
  Language,
  Manifest,
  UrlState,
} from "../types";
import { CODEBOOK } from "../content";
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  COMPARISON_META,
  comparisonSummary,
  formatNumber,
  orientationLabel,
} from "../lib";

const EXAMPLE_TERM: Record<CategoryId, string> = {
  borrowing: "Bordeaux",
  calque_literal: "abdominal obesity",
  semantic_equivalent: "AI",
  explicitation: "acesulphame",
  hybrid: "acetyl CoA",
};

export function CodebookPage({
  manifest,
  entries,
  language,
  params,
  navigate,
}: {
  manifest: Manifest;
  entries: CorpusEntry[];
  language: Language;
  params: URLSearchParams;
  navigate: (route: UrlState["route"], params: URLSearchParams) => void;
}) {
  const comparison = comparisonSummary(entries);
  const openTerm = (term: string) => {
    const next = new URLSearchParams();
    next.set("q", term);
    next.set("lang", language);
    navigate("explorer", next);
  };

  return (
    <div className="page codebook-page">
      <header className="content-hero">
        <span className="eyebrow">
          {language === "en" ? "Classification framework" : "分類框架"}
        </span>
        <h1>
          {language === "en" ? (
            <>
              A codebook for
              <br />
              <em>watching translation move.</em>
            </>
          ) : (
            <>
              一套觀察
              <br />
              <em>翻譯如何移動的分類規準。</em>
            </>
          )}
        </h1>
        <p>
          {language === "en"
            ? "Five categories turn 5,691 bilingual records into a comparison of source-shaped and reader-oriented solutions. The rules include examples, counterexamples, and boundary decisions."
            : "五個類別把 5,691 筆雙語紀錄轉化為源語形塑與讀者導向譯法的比較。每條規則都包含例子、反例與邊界判斷。"}
        </p>
        <div className="content-meta">
          <span>
            {language === "en" ? "Codebook version" : "分類規準版本"} · 1.0
          </span>
          <span>
            {language === "en" ? "Pilot test" : "前導測試"} · 30{" "}
            {language === "en" ? "entries" : "筆"}
          </span>
          <span>
            {language === "en" ? "Corpus" : "語料"} ·{" "}
            {formatNumber(manifest.rows)} {language === "en" ? "terms" : "詞條"}
          </span>
        </div>
      </header>

      <section className="codebook-intro">
        <div className="principles">
          <span className="section-kicker">
            {language === "en" ? "Decision principles" : "判斷原則"}
          </span>
          <ol>
            <li>
              {language === "en"
                ? "Code the principal Chinese rendering; preserve all alternatives without creating duplicate entries."
                : "分類主要中文譯法；保留所有對等詞，但不建立重複詞條。"}
            </li>
            <li>
              {language === "en"
                ? "Give priority to visible procedures over an imagined word-for-word alignment."
                : "優先依據可見的程序，而不是想像中的逐字對齊。"}
            </li>
            <li>
              {language === "en"
                ? "Use hybrid only when two procedures appear in the same principal rendering."
                : "只有在同一個主要譯法中出現兩種程序時，才使用混用。"}
            </li>
            <li>
              {language === "en"
                ? "Treat low-confidence and boundary cases as provisional until human review."
                : "低信心與邊界案例在人工檢視前均視為暫定。"}
            </li>
          </ol>
        </div>
        <aside className="codebook-callout">
          <span className="section-kicker">
            {language === "en" ? "Theoretical framing" : "理論框架"}
          </span>
          <p>
            {language === "en"
              ? "The codebook adapts direct and oblique translation procedures while keeping orientation as a separate analytical layer. Borrowing and calque are treated as source-oriented; semantic equivalence and explicitation as target-oriented; hybrid renderings as mixed."
              : "本規準改寫直接與間接翻譯程序，並把翻譯導向保留為獨立的分析層次。借譯與仿譯視為源語導向；語意對等與顯化視為目標語導向；混用譯法視為混合導向。"}
          </p>
        </aside>
      </section>

      <nav className="category-index" aria-label="Codebook categories">
        {CATEGORY_ORDER.map((category, index) => (
          <button
            key={category}
            type="button"
            onClick={() =>
              document
                .getElementById(`category-${category}`)
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <i style={{ background: CATEGORY_META[category].color }} />
            {CATEGORY_META[category][language === "en" ? "en" : "zh"]}
            <strong>{formatNumber(manifest.categories[category])}</strong>
          </button>
        ))}
      </nav>

      <div className="codebook-list">
        {CODEBOOK.map((entry, index) => {
          const meta = CATEGORY_META[entry.id];
          return (
            <section
              key={entry.id}
              id={`category-${entry.id}`}
              className="codebook-entry"
              style={
                {
                  "--category-color": meta.color,
                  "--category-soft": meta.soft,
                } as CSSProperties
              }
            >
              <header className="codebook-entry__header">
                <span className="codebook-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <span className="section-kicker">
                    {orientationLabel(meta.orientation, language)}
                  </span>
                  <h2>{meta[language === "en" ? "en" : "zh"]}</h2>
                  <p>{entry.definition[language]}</p>
                </div>
                <div className="codebook-count">
                  <strong>{formatNumber(manifest.categories[entry.id])}</strong>
                  <span>{language === "en" ? "terms" : "詞條"}</span>
                </div>
              </header>

              <div className="codebook-detail-grid">
                <div className="codebook-rule">
                  <h3>{language === "en" ? "Decision rule" : "判斷規則"}</h3>
                  <p>{entry.rule[language]}</p>
                  <h3>{language === "en" ? "Theory source" : "理論來源"}</h3>
                  <p>{entry.source}</p>
                </div>
                <div className="example-stack">
                  <Example
                    label={language === "en" ? "Positive example" : "正面例子"}
                    text={entry.positive[language]}
                    onClick={() => openTerm(EXAMPLE_TERM[entry.id])}
                  />
                  <Example
                    label={language === "en" ? "Negative example" : "反面例子"}
                    text={entry.negative[language]}
                  />
                  <Example
                    label={language === "en" ? "Boundary case" : "邊界案例"}
                    text={entry.boundary[language]}
                  />
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <section className="comparison-codebook">
        <span className="eyebrow">
          {language === "en" ? "Regional comparison" : "跨地比較"}
        </span>
        <h2>
          {language === "en"
            ? "Separate different terms from different characters."
            : "把用詞差異與字形差異分開。"}
        </h2>
        <p>
          {language === "en"
            ? "Before comparing wording, Taiwan's Traditional Chinese is converted to Simplified Chinese. The four statuses below are not translation-strategy categories; they describe whether the matched regional forms converge."
            : "比較用詞前，先把臺灣繁體中文轉為簡體中文。以下四種狀態並非翻譯策略類別，而是描述兩地配對形式是否趨同。"}
        </p>
        <div className="comparison-codebook-grid">
          {(
            ["same", "script_only", "partial", "different"] as ComparisonStatus[]
          ).map((status) => (
            <article
              key={status}
              style={{ "--comparison-color": COMPARISON_META[status].color } as CSSProperties}
            >
              <span>{COMPARISON_META[status][language === "en" ? "en" : "zh"]}</span>
              <strong>{comparison.counts[status]}</strong>
              <p>
                {status === "same" &&
                  (language === "en"
                    ? "The matched Chinese strings are identical before conversion."
                    : "配對中文在轉換前已完全相同。")}
                {status === "script_only" &&
                  (language === "en"
                    ? "They become identical only after Traditional-to-Simplified conversion."
                    : "只在繁體轉簡體後才完全相同。")}
                {status === "partial" &&
                  (language === "en"
                    ? "One normalized term contains the other, so part of the wording overlaps."
                    : "一個正規化詞包含另一個，因此只有部分用詞重疊。")}
                {status === "different" &&
                  (language === "en"
                    ? "Neither equality nor containment holds, indicating a substantive lexical difference."
                    : "既不完全相同，也沒有包含關係，顯示實質詞彙差異。")}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="codebook-log">
        <span className="eyebrow">
          {language === "en" ? "Revision log" : "修訂紀錄"}
        </span>
        <h2>
          {language === "en"
            ? "What changed after the pilot?"
            : "前導測試後做了哪些調整？"}
        </h2>
        <div className="timeline">
          <div>
            <span>v0.1</span>
            <p>
              {language === "en"
                ? "Started with separate literal and calque labels, then combined them because the distinction was unstable across chemical compounds."
                : "原本分設直譯與仿譯，但化學複合詞中的界線不穩定，因此合併。"}
            </p>
          </div>
          <div>
            <span>v0.2</span>
            <p>
              {language === "en"
                ? "Made the principal equivalent the coding unit after multi-equivalent records began to pull one source ID in several directions."
                : "多重對等詞使同一個來源編號被拉向不同類別，因此改以主要對等詞為編碼單位。"}
            </p>
          </div>
          <div>
            <span>v1.0</span>
            <p>
              {language === "en"
                ? "Restricted hybrid to visibly combined procedures and removed capitalization alone as evidence of borrowing after AI → 人工智慧 exposed a false positive."
                : "把混用限制在明顯結合的程序；AI → 人工智慧暴露假陽性後，不再只以大寫判定借譯。"}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function Example({
  label,
  text,
  onClick,
}: {
  label: string;
  text: string;
  onClick?: () => void;
}) {
  return (
    <article className="example-card">
      <span>{label}</span>
      {onClick ? (
        <button type="button" onClick={onClick}>
          {text}
        </button>
      ) : (
        <p>{text}</p>
      )}
    </article>
  );
}
