import type {
  CategoryId,
  ComparisonStatus,
  CorpusEntry,
  Language,
  OrientationId,
  RegionId,
  UrlState,
} from "./types";
import { Converter } from "opencc-js/t2cn";

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

export const REGION_META: Record<
  RegionId,
  { en: string; zh: string; shortEn: string; shortZh: string; color: string }
> = {
  TW: {
    en: "Taiwan",
    zh: "臺灣",
    shortEn: "TW",
    shortZh: "臺",
    color: "#45645c",
  },
  CN: {
    en: "Mainland China",
    zh: "中國大陸",
    shortEn: "CN",
    shortZh: "陸",
    color: "#aa5d36",
  },
};

export const COMPARISON_META: Record<
  ComparisonStatus,
  { en: string; zh: string; shortEn: string; shortZh: string; color: string }
> = {
  same: {
    en: "Same wording",
    zh: "用詞相同",
    shortEn: "Same",
    shortZh: "相同",
    color: "#3f6f61",
  },
  script_only: {
    en: "Character variant only",
    zh: "僅字形差異",
    shortEn: "Script only",
    shortZh: "字形",
    color: "#809a54",
  },
  partial: {
    en: "Partial overlap",
    zh: "部分重疊",
    shortEn: "Partial",
    shortZh: "部分",
    color: "#b47b37",
  },
  different: {
    en: "Different terminology",
    zh: "用詞不同",
    shortEn: "Different",
    shortZh: "不同",
    color: "#9a3941",
  },
  unpaired: {
    en: "No regional pair",
    zh: "無跨地配對",
    shortEn: "Unpaired",
    shortZh: "未配對",
    color: "#938b80",
  },
};

const twToCn = Converter({ from: "tw", to: "cn" });

const cleanHanText = (value: string): string =>
  value
    .normalize("NFKC")
    .replace(/[（(][^）)]*[）)]/g, "")
    .replace(/[\s，,、；;。·\-—_/]/g, "")
    .trim();

const termVariants = (value: string): string[] => {
  const variants = [value];
  const withoutQualifiers = value.replace(/[（(][^）)]*[）)]/g, "").trim();
  if (withoutQualifiers && withoutQualifiers !== value) {
    variants.push(withoutQualifiers);
  }
  for (const match of value.matchAll(/[（(]([^）)]*)[）)]/g)) {
    variants.push(...match[1].split(/[；;、]/));
  }
  return variants.filter(Boolean);
};

const comparableTerms = (entry: CorpusEntry): string[] =>
  [
    ...entry.target_alternatives,
    ...termVariants(entry.target_text),
  ]
    .map((term) => cleanHanText(twToCn(term)))
    .filter(Boolean);

const rawTerms = (entry: CorpusEntry): string[] =>
  [...entry.target_alternatives, ...termVariants(entry.target_text)]
    .map((term) => cleanHanText(term))
    .filter(Boolean);

const compareTermGroups = (
  taiwanEntries: CorpusEntry[],
  mainlandEntries: CorpusEntry[],
): ComparisonStatus => {
  const rawTaiwan = taiwanEntries.flatMap(rawTerms);
  const rawMainland = mainlandEntries.flatMap(rawTerms);
  if (rawTaiwan.some((term) => rawMainland.includes(term))) return "same";
  const taiwan = taiwanEntries.flatMap(comparableTerms);
  const mainland = mainlandEntries.flatMap(comparableTerms);
  if (taiwan.some((term) => mainland.includes(term))) return "script_only";
  if (
    taiwan.some((left) =>
      mainland.some(
        (right) => left.includes(right) || right.includes(left),
      ),
    )
  ) {
    return "partial";
  }
  return "different";
};

export const annotateRegionalComparisons = (
  entries: CorpusEntry[],
): CorpusEntry[] => {
  const groups = new Map<string, CorpusEntry[]>();
  for (const entry of entries) {
    const key = entry.english_key || entry.source_text.trim().toLowerCase();
    const group = groups.get(key) ?? [];
    group.push(entry);
    groups.set(key, group);
  }

  const statusByKey = new Map<string, ComparisonStatus>();
  const partnersByKey = new Map<string, string[]>();
  for (const [key, group] of groups) {
    const taiwan = group.filter((entry) => entry.region === "TW");
    const mainland = group.filter((entry) => entry.region === "CN");
    if (!taiwan.length || !mainland.length) continue;
    statusByKey.set(key, compareTermGroups(taiwan, mainland));
    partnersByKey.set(key, [
      ...taiwan.map((entry) => `臺灣：${entry.target_text}`),
      ...mainland.map((entry) => `中國大陸：${entry.target_text}`),
    ]);
  }

  return entries.map((entry) => {
    const key = entry.english_key || entry.source_text.trim().toLowerCase();
    return {
      ...entry,
      comparison_status: statusByKey.get(key) ?? "unpaired",
      comparison_partners: partnersByKey.get(key) ?? [],
    };
  });
};

export const comparisonSummary = (
  entries: CorpusEntry[],
): { counts: Record<ComparisonStatus, number>; total: number } => {
  const groups = new Map<string, ComparisonStatus>();
  for (const entry of entries) {
    if (!entry.english_key || !entry.comparison_status) continue;
    if (entry.comparison_status === "unpaired") continue;
    groups.set(entry.english_key, entry.comparison_status);
  }
  const counts: Record<ComparisonStatus, number> = {
    same: 0,
    script_only: 0,
    partial: 0,
    different: 0,
    unpaired: 0,
  };
  for (const status of groups.values()) counts[status] += 1;
  return { counts, total: groups.size };
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
    "region",
    "region_label",
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
    "english_key",
    "comparison_status",
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
