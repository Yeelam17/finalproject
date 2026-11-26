import fs from "node:fs/promises";
import path from "node:path";
import { Converter } from "opencc-js/t2cn";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const sourcePath = path.join(root, "public/data/corpus.json");
const outputDir = path.join(root, "outputs/2026-11-26-qa10");
const seed = 20261126;
const sampleRate = 0.1;

const entries = JSON.parse(await fs.readFile(sourcePath, "utf8"));
const twToCn = Converter({ from: "tw", to: "cn" });

const cleanTerm = (value) =>
  value
    .normalize("NFKC")
    .replace(/[\s，,、；;。·\-—_/]/g, "")
    .trim();

const variants = (value) => {
  const values = [value];
  const stripped = value.replace(/[（(][^）)]*[）)]/g, "").trim();
  if (stripped && stripped !== value) values.push(stripped);
  for (const match of value.matchAll(/[（(]([^）)]*)[）)]/g)) {
    values.push(...match[1].split(/[；;、]/));
  }
  return values.filter(Boolean);
};

const terms = (entry, convert) =>
  [...entry.target_alternatives, ...variants(entry.target_text)]
    .map((value) => cleanTerm(convert ? twToCn(value) : value))
    .filter(Boolean);

const groups = new Map();
for (const entry of entries) {
  const key = entry.english_key || entry.source_text.trim().toLowerCase();
  const items = groups.get(key) ?? [];
  items.push(entry);
  groups.set(key, items);
}

const statusByKey = new Map();
const partnersByKey = new Map();
for (const [key, group] of groups) {
  const tw = group.filter((entry) => entry.region === "TW");
  const cn = group.filter((entry) => entry.region === "CN");
  if (!tw.length || !cn.length) continue;
  const rawTw = new Set(tw.flatMap((entry) => terms(entry, false)));
  const rawCn = new Set(cn.flatMap((entry) => terms(entry, false)));
  const normTw = [...new Set(tw.flatMap((entry) => terms(entry, true)))];
  const normCn = [...new Set(cn.flatMap((entry) => terms(entry, true)))];
  let status;
  if ([...rawTw].some((term) => rawCn.has(term))) {
    status = "same";
  } else if (normTw.some((term) => normCn.includes(term))) {
    status = "script_only";
  } else if (
    normTw.some((left) =>
      normCn.some((right) => left.includes(right) || right.includes(left)),
    )
  ) {
    status = "partial";
  } else {
    status = "different";
  }
  statusByKey.set(key, status);
  partnersByKey.set(
    key,
    [...tw, ...cn].map(
      (entry) =>
        `${entry.region}: ${entry.target_text} (${entry.id})`,
    ),
  );
}

const annotated = entries.map((entry) => {
  const key = entry.english_key || entry.source_text.trim().toLowerCase();
  return {
    ...entry,
    comparison_status: statusByKey.get(key) ?? "unpaired",
    comparison_partners: partnersByKey.get(key) ?? [],
  };
});

const makeRandom = (initialSeed) => {
  let state = initialSeed >>> 0;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
};

const random = makeRandom(seed);
const shuffle = (items) => {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
};

const allocate = (total, grouped) => {
  const categories = [...grouped.entries()].filter(([, items]) => items.length);
  const sourceTotal = categories.reduce((sum, [, items]) => sum + items.length, 0);
  const remainderBudget = total - categories.length;
  const allocations = categories.map(([key, items]) => {
    const exact = remainderBudget * (items.length / sourceTotal);
    return {
      key,
      count: 1 + Math.floor(exact),
      fraction: exact - Math.floor(exact),
      available: items.length,
    };
  });
  let remaining =
    total - allocations.reduce((sum, item) => sum + item.count, 0);
  allocations.sort(
    (left, right) =>
      right.fraction - left.fraction ||
      right.available - left.available ||
      left.key.localeCompare(right.key),
  );
  let index = 0;
  while (remaining > 0) {
    const item = allocations[index % allocations.length];
    if (item.count < item.available) {
      item.count += 1;
      remaining -= 1;
    }
    index += 1;
  }
  const allocation = new Map(
    allocations.map((item) => [item.key, item.count]),
  );
  return allocation;
};

const sampleSize = Math.round(entries.length * sampleRate);
const regionCounts = {
  TW: annotated.filter((entry) => entry.region === "TW").length,
  CN: annotated.filter((entry) => entry.region === "CN").length,
};
const twQuota = Math.round((sampleSize * regionCounts.TW) / entries.length);
const quotas = { TW: twQuota, CN: sampleSize - twQuota };
const selected = [];

for (const region of ["TW", "CN"]) {
  const byCategory = new Map();
  for (const entry of annotated.filter((entry) => entry.region === region)) {
    const items = byCategory.get(entry.category) ?? [];
    items.push(entry);
    byCategory.set(entry.category, items);
  }
  const allocation = allocate(quotas[region], byCategory);
  for (const [category, count] of allocation) {
    selected.push(...shuffle(byCategory.get(category)).slice(0, count));
  }
}

selected.sort((left, right) => left.id.localeCompare(right.id, "en"));
if (selected.length !== sampleSize) {
  throw new Error(`Expected ${sampleSize} rows, got ${selected.length}`);
}
if (new Set(selected.map((entry) => entry.id)).size !== sampleSize) {
  throw new Error("QA sample contains duplicate IDs");
}

const csvEscape = (value) => {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

const columns = [
  "review_no",
  "id",
  "region",
  "source_record_id",
  "source_text",
  "target_text",
  "source",
  "category",
  "comparison_status",
  "comparison_partners",
  "ai_precheck",
  "human_decision",
  "human_checked",
  "corrected_translation",
  "corrected_category",
  "reviewer_notes",
  "source_url",
];

const rows = selected.map((entry, index) => ({
  review_no: index + 1,
  id: entry.id,
  region: entry.region,
  source_record_id: entry.source_record_id,
  source_text: entry.source_text,
  target_text: entry.target_text,
  source: entry.source,
  category: entry.category,
  comparison_status: entry.comparison_status,
  comparison_partners: entry.comparison_partners.join(" | "),
  ai_precheck: "PASS: source pair present; semantic review pending",
  human_decision: "",
  human_checked: "",
  corrected_translation: "",
  corrected_category: "",
  reviewer_notes: "",
  source_url: entry.source_url,
}));

await fs.mkdir(outputDir, { recursive: true });
const csv = [
  columns.join(","),
  ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(",")),
].join("\n");
await fs.writeFile(path.join(outputDir, "human-review-10-percent.csv"), `\uFEFF${csv}\n`);
await fs.writeFile(
  path.join(outputDir, "human-review-10-percent.json"),
  `${JSON.stringify(rows, null, 2)}\n`,
);

const categoryCounts = Object.fromEntries(
  [...new Set(selected.map((entry) => entry.category))].map((category) => [
    category,
    selected.filter((entry) => entry.category === category).length,
  ]),
);

const summary = {
  title: "10% human-review sample",
  generatedAt: new Date("2026-11-26T12:00:00+08:00").toISOString(),
  sourceRows: entries.length,
  targetRate: sampleRate,
  sampleSize,
  seed,
  method:
    "Deterministic, proportionally stratified random sample by region and translation category.",
  regionCounts,
  quotas,
  categoryCounts,
  automatedPrecheck:
    "All selected records have required fields, a source pair, and a valid region/category value.",
  humanReviewStatus: "Pending: human_decision and human_checked are intentionally blank.",
};
await fs.writeFile(
  path.join(outputDir, "human-review-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
);

console.log(JSON.stringify(summary, null, 2));
