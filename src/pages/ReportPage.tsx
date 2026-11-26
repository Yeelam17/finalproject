import type {
  ComparisonStatus,
  CorpusEntry,
  Language,
  Manifest,
} from "../types";
import { REPORT } from "../content";
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  COMPARISON_META,
  categoryLabel,
  comparisonSummary,
  formatNumber,
  hanLength,
  percentage,
  sourceLength,
} from "../lib";

export function ReportPage({
  entries,
  manifest,
  language,
}: {
  entries: CorpusEntry[];
  manifest: Manifest;
  language: Language;
}) {
  const report = REPORT[language];
  const categoryRows = CATEGORY_ORDER.map((category) => ({
    category,
    count: manifest.categories[category],
    share: manifest.categories[category] / manifest.rows,
  }));
  const sourceOriented =
    manifest.categories.borrowing + manifest.categories.calque_literal;
  const targetOriented =
    manifest.categories.semantic_equivalent + manifest.categories.explicitation;
  const averageEnglish =
    entries.reduce((sum, entry) => sum + sourceLength(entry.source_text), 0) /
    entries.length;
  const averageChinese =
    entries.reduce((sum, entry) => sum + hanLength(entry.target_primary), 0) /
    entries.length;
  const comparison = comparisonSummary(entries);

  return (
    <article className="page report-page">
      <header className="report-hero">
        <span className="eyebrow">{report.eyebrow}</span>
        <h1>{report.title}</h1>
        <p>{report.standfirst}</p>
        <div className="report-meta">
          <span>
            {language === "en" ? "Corpus" : "語料"} ·{" "}
            {formatNumber(manifest.rows)}
          </span>
          <span>
            {language === "en" ? "Taiwan" : "臺灣"} · {manifest.collected}
          </span>
          <span>
            {language === "en" ? "Mainland" : "中國大陸"} ·{" "}
            {manifest.mainland_collected}
          </span>
          <span>
            {language === "en" ? "Sources" : "來源"} · NAER + China Food
            Composition Table
          </span>
        </div>
      </header>

      <div className="report-layout">
        <aside className="report-rail">
          <span className="section-kicker">
            {language === "en" ? "Contents" : "目錄"}
          </span>
          {report.sections.map((section, index) => (
            <button
              key={section.title}
              type="button"
              onClick={() =>
                document
                  .getElementById(`report-${index + 1}`)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {section.title}
            </button>
          ))}
          <div className="report-rail-note">
            <strong>{percentage(targetOriented, manifest.rows)}</strong>
            <span>
              {language === "en"
                ? "target-oriented strategies"
                : "目標語導向策略"}
            </span>
          </div>
        </aside>

        <div className="report-body">
          {report.sections.map((section, index) => (
            <section
              key={section.title}
              id={`report-${index + 1}`}
              className="prose-section"
            >
              <div className="prose-heading">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h2>{section.title}</h2>
              </div>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}

              {index === 5 && (
                <>
                  <figure className="report-figure">
                    <div className="report-figure__header">
                      <span className="section-kicker">
                        Figure 1 · {language === "en" ? "Corpus profile" : "語料概況"}
                      </span>
                      <h3>
                        {language === "en"
                          ? `Translation strategies across ${formatNumber(manifest.rows)} records`
                          : `全部 ${formatNumber(manifest.rows)} 筆詞條的翻譯策略`}
                      </h3>
                    </div>
                    <div className="distribution-visual">
                      {categoryRows.map(({ category, count, share }) => (
                        <div key={category} className="distribution-row">
                          <span>{categoryLabel(category, language)}</span>
                          <div className="distribution-track">
                            <i
                              style={{
                                width: `${Math.max(share * 100, 0.8)}%`,
                                background: CATEGORY_META[category].color,
                              }}
                            />
                          </div>
                          <strong>{formatNumber(count)}</strong>
                          <small>{percentage(count, manifest.rows)}</small>
                        </div>
                      ))}
                    </div>
                    <figcaption>
                      {language === "en"
                        ? "Semantic equivalents form the largest group, while source-shaped calques remain a substantial minority. AI-assisted classifications remain provisional until human review."
                        : "語意對等詞占比最高，但源語形塑的仿譯仍占相當比例。AI 分類在人工校閱前仍屬暫定結果。"}
                    </figcaption>
                  </figure>

                  <figure className="report-figure">
                    <div className="report-figure__header">
                      <span className="section-kicker">
                        Figure 2 ·{" "}
                        {language === "en"
                          ? "Regional difference"
                          : "跨地差異"}
                      </span>
                      <h3>
                        {language === "en"
                          ? "How matched food names differ across regions"
                          : "配對食物名稱在兩地之間的差異"}
                      </h3>
                    </div>
                    <div className="distribution-visual">
                      {(
                        [
                          "same",
                          "script_only",
                          "partial",
                          "different",
                        ] as ComparisonStatus[]
                      ).map((status) => (
                        <div key={status} className="distribution-row">
                          <span>
                            {COMPARISON_META[status][
                              language === "en" ? "en" : "zh"
                            ]}
                          </span>
                          <div className="distribution-track">
                            <i
                              style={{
                                width: `${
                                  comparison.total
                                    ? (comparison.counts[status] /
                                        comparison.total) *
                                      100
                                    : 0
                                }%`,
                                background: COMPARISON_META[status].color,
                              }}
                            />
                          </div>
                          <strong>{comparison.counts[status]}</strong>
                          <small>
                            {percentage(comparison.counts[status], comparison.total)}
                          </small>
                        </div>
                      ))}
                    </div>
                    <figcaption>
                      {language === "en"
                        ? `Across ${comparison.total} matched English concepts, ${comparison.counts.same} use identical wording, ${comparison.counts.script_only} differ only through Chinese script, ${comparison.counts.partial} share a partial term, and ${comparison.counts.different} use substantively different terminology.`
                        : `在 ${comparison.total} 個可配對英文概念中，${comparison.counts.same} 個用詞完全相同，${comparison.counts.script_only} 個只有中文字形差異，${comparison.counts.partial} 個有部分詞語重疊，${comparison.counts.different} 個使用實質不同的術語。`}
                    </figcaption>
                  </figure>

                  <div className="report-metrics">
                    <div>
                      <strong>{formatNumber(sourceOriented)}</strong>
                      <span>
                        {language === "en"
                          ? "source-oriented terms"
                          : "源語導向詞條"}
                      </span>
                    </div>
                    <div>
                      <strong>{formatNumber(manifest.multi_equivalent)}</strong>
                      <span>
                        {language === "en"
                          ? "terms with multiple equivalents"
                          : "多重對等詞條"}
                      </span>
                    </div>
                    <div>
                      <strong>{averageEnglish.toFixed(1)} → {averageChinese.toFixed(1)}</strong>
                      <span>
                        {language === "en"
                          ? "average English → Chinese length"
                          : "英文 → 中文平均長度"}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </section>
          ))}

          <section className="references" aria-labelledby="references-title">
            <div className="prose-heading">
              <span>09</span>
              <h2 id="references-title">
                {language === "en" ? "References" : "參考文獻"}
              </h2>
            </div>
            <ol>
              <li>
                Blum-Kulka, Shoshana. 1986. “Shifts of Cohesion and Coherence in
                Translation.” In <em>Interlingual and Intercultural Communication</em>,
                edited by Juliane House and Shoshana Blum-Kulka, 17–35. Tübingen:
                Narr.
              </li>
              <li>
                Cabré, M. Teresa. 1999. <em>Terminology: Theory, Methods, and
                Applications</em>. Amsterdam: John Benjamins.
              </li>
              <li>
                Sanotsu. “china-food-composition-data.” Accessed November 26,
                2026. https://github.com/Sanotsu/china-food-composition-data.
              </li>
              <li>
                National Academy for Educational Research. “樂詞網.” Accessed
                November 24, 2026. https://terms.naer.edu.tw/.
              </li>
              <li>
                Toury, Gideon. 2012. <em>Descriptive Translation Studies and
                Beyond</em>. Revised edition. Amsterdam: John Benjamins.
              </li>
              <li>
                Venuti, Lawrence. 1995. <em>The Translator’s Invisibility: A
                History of Translation</em>. London: Routledge.
              </li>
              <li>
                Vinay, Jean-Paul, and Jean Darbelnet. 1995. <em>Comparative
                Stylistics of French and English: A Methodology for Translation</em>.
                Translated by Juan C. Sager and M.-J. Hamel. Amsterdam: John
                Benjamins.
              </li>
            </ol>
          </section>
        </div>
      </div>
    </article>
  );
}
