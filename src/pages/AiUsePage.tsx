import type { Language } from "../types";
import { AI_USE } from "../content";

export function AiUsePage({ language }: { language: Language }) {
  const content = AI_USE[language];
  return (
    <article className="page ai-page">
      <header className="content-hero content-hero--narrow">
        <span className="eyebrow">
          {language === "en" ? "Transparency" : "透明說明"}
        </span>
        <h1>{content.title}</h1>
        <p>{content.intro}</p>
      </header>

      <div className="ai-layout">
        <aside className="ai-aside">
          <span className="section-kicker">
            {language === "en" ? "Principles" : "原則"}
          </span>
          <p>
            {language === "en"
              ? "AI may produce a first pass. It may not quietly become the source of authority."
              : "AI 可以產生第一版，但不能悄悄成為權威來源。"}
          </p>
          <div className="ai-badge">
            <strong>GPT-5</strong>
            <span>Codex · 2026</span>
          </div>
          <a
            href="https://github.com/Yeelam17/finalproject"
            target="_blank"
            rel="noreferrer"
          >
            {language === "en" ? "Inspect the repository" : "檢視專案儲存庫"} ↗
          </a>
        </aside>

        <div className="ai-sections">
          {content.sections.map((section, index) => (
            <section key={section.title} className="ai-section">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h2>{section.title}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <section className="ai-disclosure">
        <span className="eyebrow">
          {language === "en" ? "Human gate" : "人工門檻"}
        </span>
        <h2>
          {language === "en"
            ? "A classification is not a verified fact simply because it is consistent."
            : "分類一致，並不代表它已成為經查證的事實。"}
        </h2>
        <p>
          {language === "en"
            ? "The final 50-entry human review, the distinction between provisional and checked records, and this disclosure are part of the project’s evidence—not an appendix added after the fact."
            : "最終 50 筆人工校對、暫定與已校對紀錄的區分，以及本聲明，都是專題證據的一部分，而不是事後附加的附錄。"}
        </p>
      </section>
    </article>
  );
}
