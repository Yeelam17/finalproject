import { useMemo, useState } from "react";
import type {
  CorpusEntry,
  Language,
  QaDecisions,
  QaDecision,
} from "../types";
import { UI } from "../content";
import {
  categoryLabel,
  downloadText,
  formatNumber,
  orientationLabel,
} from "../lib";

interface QaReviewProps {
  entries: CorpusEntry[];
  language: Language;
  decisions: QaDecisions;
  setDecision: (
    id: string,
    status: QaDecision["status"],
    note?: string,
  ) => void;
  reset: () => void;
  close: () => void;
}

export function QaReview({
  entries,
  language,
  decisions,
  setDecision,
  reset,
  close,
}: QaReviewProps) {
  const copy = UI[language];
  const sample = useMemo(() => entries.filter((entry) => entry.qa_sample), [entries]);
  const reviewed = sample.filter((entry) => decisions[entry.id]).length;
  const firstPending = Math.max(
    0,
    sample.findIndex((entry) => !decisions[entry.id]),
  );
  const [index, setIndex] = useState(
    firstPending === -1 ? Math.max(0, sample.length - 1) : firstPending,
  );
  const [note, setNote] = useState("");
  const entry = sample[index];
  const decision = entry ? decisions[entry.id] : undefined;

  const exportReview = () => {
    // The exported JSON is the bridge from browser-local review to published data.
    downloadText(
      "terminology-in-translation-review.json",
      JSON.stringify(
        {
          title: "50-entry human review",
          generatedAt: new Date().toISOString(),
          seed: 2026,
          sampleSize: sample.length,
          reviewed,
          decisions,
        },
        null,
        2,
      ),
      "application/json;charset=utf-8",
    );
  };

  return (
    <div className="qa-backdrop" role="presentation" onMouseDown={close}>
      <section
        className="qa-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="qa-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="qa-header">
          <div>
            <span className="section-kicker">{copy.reviewStatus}</span>
            <h2 id="qa-title">{copy.qaTitle}</h2>
            <p>{copy.qaIntro}</p>
          </div>
          <button
            type="button"
            className="icon-button icon-button--large"
            onClick={close}
            aria-label={copy.close}
          >
            ×
          </button>
        </header>

        <div className="qa-progress-wrap">
          <div className="qa-progress-label">
            <strong>
              {reviewed} / {sample.length}
            </strong>
            <span>{copy.qaProgress}</span>
          </div>
          <progress value={reviewed} max={Math.max(1, sample.length)} />
        </div>

        {!sample.length && <p className="empty-state">{copy.qaEmpty}</p>}

        {entry && (
          <>
            <div className="qa-pair-card">
              <div className="qa-pair-index">
                {index + 1} / {sample.length} · #{entry.id}
              </div>
              <div className="qa-pair">
                <div>
                  <span>{language === "en" ? "English source" : "英文來源"}</span>
                  <strong>{entry.source_text}</strong>
                </div>
                <div>
                  <span>{copy.primaryTarget}</span>
                  <strong>{entry.target_primary}</strong>
                </div>
              </div>
              {entry.target_alternatives.length > 1 && (
                <div className="qa-alternatives">
                  <span>{copy.alternatives}</span>
                  <p>{entry.target_alternatives.join(" · ")}</p>
                </div>
              )}
            </div>

            <div className="qa-assessment">
              <div>
                <span className="section-kicker">{copy.category}</span>
                <strong>{categoryLabel(entry.category, language)}</strong>
              </div>
              <div>
                <span className="section-kicker">{copy.orientation}</span>
                <strong>{orientationLabel(entry.orientation, language)}</strong>
              </div>
              <div>
                <span className="section-kicker">{copy.confidence}</span>
                <strong>{Math.round(entry.category_confidence * 100)}%</strong>
              </div>
            </div>
            <p className="qa-evidence">{entry.category_evidence}</p>
            <a
              className="qa-source-link"
              href={entry.source_url}
              target="_blank"
              rel="noreferrer"
            >
              {copy.openSource} ↗
            </a>

            <label className="qa-note">
              <span>{copy.correctionNote}</span>
              <textarea
                value={decision?.note || note}
                onChange={(event) => setNote(event.target.value)}
                placeholder={
                  language === "en"
                    ? "Optional note, especially for boundary cases"
                    : "可選備註，尤其是邊界案例"
                }
                rows={3}
              />
            </label>

            <div className="qa-actions">
              <button
                type="button"
                className="button button--confirm"
                onClick={() =>
                  setDecision(entry.id, "confirmed", note || decision?.note || "")
                }
              >
                {copy.confirm}
              </button>
              <button
                type="button"
                className="button button--warn"
                onClick={() =>
                  setDecision(entry.id, "correction", note || decision?.note || "")
                }
              >
                {copy.correction}
              </button>
            </div>
          </>
        )}

        <div className="qa-sample-strip" aria-label="QA sample progress">
          {sample.map((item, itemIndex) => {
            const state = decisions[item.id]?.status;
            return (
              <button
                key={item.id}
                type="button"
                className={[
                  "qa-dot",
                  itemIndex === index ? "is-current" : "",
                  state === "confirmed" ? "is-confirmed" : "",
                  state === "correction" ? "is-correction" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => {
                  setIndex(itemIndex);
                  setNote(decisions[item.id]?.note ?? "");
                }}
                title={`${item.source_text} (${item.id})`}
                aria-label={`${item.source_text}, ${
                  state ?? "not reviewed"
                }`}
              >
                {itemIndex + 1}
              </button>
            );
          })}
        </div>

        <div className="qa-nav">
          <button
            type="button"
            className="button button--quiet"
            disabled={index === 0}
            onClick={() => {
              setIndex((current) => Math.max(0, current - 1));
              setNote("");
            }}
          >
            {language === "en" ? "Previous" : "上一筆"}
          </button>
          <button
            type="button"
            className="button button--quiet"
            disabled={index >= sample.length - 1}
            onClick={() => {
              setIndex((current) =>
                Math.min(sample.length - 1, current + 1),
              );
              setNote("");
            }}
          >
            {language === "en" ? "Next" : "下一筆"}
          </button>
        </div>

        {reviewed === sample.length && sample.length > 0 && (
          <p className="qa-complete">{copy.qaComplete}</p>
        )}

        <footer className="qa-footer">
          <span>
            {formatNumber(reviewed)} / {formatNumber(sample.length)}
          </span>
          <button
            type="button"
            className="text-button"
            onClick={exportReview}
            disabled={!reviewed}
          >
            {copy.exportReview}
          </button>
          <button type="button" className="text-button" onClick={reset}>
            {copy.resetReview}
          </button>
        </footer>
      </section>
    </div>
  );
}
