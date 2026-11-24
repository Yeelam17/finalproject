import type {
  CategoryId,
  CorpusEntry,
  Language,
  OrientationId,
  UrlState,
} from "./types";

export const CATEGORY_ORDER: CategoryId[] = [
  "borrowing",
  "calque_literal",
  "semantic_equivalent",
  "explicitation",
  "hybrid",
];

export const CATEGORY_META: Record<
  CategoryId,
  {
    en: string;
    zh: string;
    shortEn: string;
    shortZh: string;
    color: string;
    soft: string;
    orientation: OrientationId;
  }
> = {
  borrowing: {
    en: "Borrowing / transliteration",
    zh: "借譯／音譯",
    shortEn: "Borrowing",
    shortZh: "借譯",
    color: "#6f5b42",
    soft: "#e9dfcf",
    orientation: "source",
  },
  calque_literal: {
    en: "Calque / literal translation",
    zh: "仿譯／直譯",
    shortEn: "Calque / literal",
    shortZh: "仿譯／直譯",
    color: "#a25538",
    soft: "#f0d9ce",
    orientation: "source",
  },
  semantic_equivalent: {
    en: "Semantic equivalent / modulation",
    zh: "語意對等／轉換",
    shortEn: "Semantic equivalent",
    shortZh: "語意對等",
    color: "#45645c",
    soft: "#dce9e2",
    orientation: "target",
  },
  explicitation: {
    en: "Explicitation",
    zh: "顯化",
    shortEn: "Explicitation",
    shortZh: "顯化",
    color: "#3f6380",
    soft: "#dce8ef",
    orientation: "target",
  },
  hybrid: {
    en: "Hybrid rendering",
    zh: "混合譯法",
    shortEn: "Hybrid",
    shortZh: "混合",
    color: "#8a6a9c",
    soft: "#e9e0ee",
    orientation: "mixed",
  },
};

export const ORIENTATION_META: Record<
  OrientationId,
  { en: string; zh: string; color: string }
> = {
  source: { en: "Source-oriented", zh: "源語導向", color: "#a25538" },
  target: { en: "Target-oriented", zh: "目標語導向", color: "#45645c" },
  mixed: { en: "Mixed", zh: "混合", color: "#8a6a9c" },
};

export const categoryLabel = (
  category: CategoryId,
  language: Language,
): string => CATEGORY_META[category][language === "en" ? "en" : "zh"];

export const categoryShortLabel = (
  category: CategoryId,
  language: Language,
): string =>
  CATEGORY_META[category][language === "en" ? "shortEn" : "shortZh"];

export const orientationLabel = (
  orientation: OrientationId,
  language: Language,
): string => ORIENTATION_META[orientation][language];

export const formatNumber = (value: number): string =>
  new Intl.NumberFormat("en-US").format(value);

export const percentage = (part: number, total: number): string =>
  total ? `${((part / total) * 100).toFixed(1)}%` : "0.0%";

export const hanLength = (value: string): number =>
  (value.match(/[\u3400-\u9fff]/g) ?? []).length;

export const sourceLength = (value: string): number =>
  Array.from(value.trim()).length;

export const slug = (value: string): string =>
  value
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

export const parseRoute = (hash: string): UrlState => {
  const raw = hash.replace(/^#/, "") || "/explorer";
  const [path, search = ""] = raw.split("?");
  const route = path.replace(/^\/|\/$/g, "");
  const knownRoutes = ["explorer", "report", "codebook", "ai-use"] as const;
  return {
    route: (knownRoutes.includes(route as (typeof knownRoutes)[number])
      ? route
      : "explorer") as UrlState["route"],
    params: new URLSearchParams(search),
  };
};

export const buildHash = (
  route: UrlState["route"],
  params: URLSearchParams,
): string => {
  const search = params.toString();
  return `#/${route}${search ? `?${search}` : ""}`;
};

export const makeCsv = (entries: CorpusEntry[]): string => {
  const columns = [
    "id",
    "source_text",
    "target_text",
    "source",
    "category",
    "human_checked",
    "unit",
    "key_term",
    "multi_equivalent",
    "target_primary",
    "orientation",
    "category_confidence",
    "category_evidence",
    "year",
    "update_date",
    "source_url",
  ];
  const escape = (value: unknown): string => {
    const text = String(value ?? "");
    return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  };
  return [
    columns.join(","),
    ...entries.map((entry) =>
      columns.map((column) => escape(entry[column as keyof CorpusEntry])).join(","),
    ),
  ].join("\n");
};

export const downloadText = (
  filename: string,
  text: string,
  type = "text/plain;charset=utf-8",
): void => {
  const blob = new Blob(["\uFEFF", text], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

export const asset = (path: string): string =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
