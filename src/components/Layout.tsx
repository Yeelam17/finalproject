import type { ReactNode } from "react";
import { UI } from "../content";
import type { Language, UrlState } from "../types";

interface LayoutProps {
  route: UrlState["route"];
  params: URLSearchParams;
  language: Language;
  children: ReactNode;
  navigate: (route: UrlState["route"], params: URLSearchParams) => void;
  toggleLanguage: () => void;
}

const ROUTES: Array<[UrlState["route"], keyof typeof UI.en.nav]> = [
  ["explorer", "explorer"],
  ["report", "report"],
  ["codebook", "codebook"],
  ["ai-use", "aiUse"],
];

export function Layout({
  route,
  params,
  language,
  children,
  navigate,
  toggleLanguage,
}: LayoutProps) {
  const copy = UI[language];
  const go = (nextRoute: UrlState["route"]) => {
    const next = new URLSearchParams(params);
    navigate(nextRoute, next);
  };

  return (
    <div className="site-shell">
      <a href="#main-content" className="skip-link">
        {language === "en" ? "Skip to content" : "跳到主要內容"}
      </a>
      <header className="site-header">
        <button
          type="button"
          className="brand"
          onClick={() => {
            const next = new URLSearchParams(params);
            navigate("explorer", next);
          }}
          aria-label={copy.title}
        >
          <span className="brand-mark" aria-hidden="true">
            譯
          </span>
          <span className="brand-text">
            <strong>{copy.title}</strong>
            <span>{copy.eyebrow}</span>
          </span>
        </button>
        <nav aria-label={language === "en" ? "Main navigation" : "主要導覽"}>
          {ROUTES.map(([path, label]) => (
            <button
              key={path}
              type="button"
              className={route === path ? "nav-link is-active" : "nav-link"}
              onClick={() => go(path)}
              aria-current={route === path ? "page" : undefined}
            >
              {copy.nav[label]}
            </button>
          ))}
        </nav>
        <button
          type="button"
          className="language-switch"
          onClick={toggleLanguage}
          lang={language === "en" ? "zh-Hant" : "en"}
        >
          {copy.language}
        </button>
      </header>
      <main id="main-content">{children}</main>
      <footer className="site-footer">
        <div className="footer-brand">
          <span className="brand-mark brand-mark--footer" aria-hidden="true">
            譯
          </span>
          <div>
            <strong>{copy.title}</strong>
            <p>{copy.footerNote}</p>
          </div>
        </div>
        <p className="attribution">{copy.sourceAttribution}</p>
        <nav aria-label={language === "en" ? "Footer navigation" : "頁尾導覽"}>
          <a href="https://terms.naer.edu.tw/" target="_blank" rel="noreferrer">
            NAER 樂詞網
          </a>
          <a
            href="https://terms.naer.edu.tw/mysite/about/2/"
            target="_blank"
            rel="noreferrer"
          >
            {language === "en" ? "Open-data declaration" : "資料開放宣告"}
          </a>
          <a
            href="https://github.com/Yeelam17/finalproject"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://github.com/Sanotsu/china-food-composition-data"
            target="_blank"
            rel="noreferrer"
          >
            {language === "en" ? "China food-name source" : "中國食物名稱來源"}
          </a>
        </nav>
      </footer>
    </div>
  );
}
