import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const outputDir = path.join(root, "outputs/2026-11-26-qa10");
const rows = JSON.parse(
  await fs.readFile(
    path.join(outputDir, "human-review-10-percent.json"),
    "utf8",
  ),
);
const summary = JSON.parse(
  await fs.readFile(path.join(outputDir, "human-review-summary.json"), "utf8"),
);

const workbook = Workbook.create();
const sheet = workbook.worksheets.add("Review 579");
sheet.showGridLines = false;
sheet.tabColor = "#7b2323";

sheet.getRange("A1:Q1").merge();
sheet.getRange("A1").values = [
  ["Terminology in Translation — 10% human review"],
];
sheet.getRange("A1").format = {
  font: { name: "Helvetica Neue", size: 18, bold: true, color: "#201b17" },
  verticalAlignment: "center",
};
sheet.getRange("A1:Q1").format.rowHeight = 30;

sheet.getRange("A2:Q2").merge();
sheet.getRange("A2").values = [
  [
    "Deterministic stratified random sample of the combined Taiwan and Mainland China food terminology corpus.",
  ],
];
sheet.getRange("A2").format = {
  font: { name: "Helvetica Neue", size: 10, color: "#625a50" },
  wrapText: false,
};

const summaryCells = [
  ["A4", "Sample size", "B4", summary.sampleSize],
  ["D4", "Corpus records", "E4", summary.sourceRows],
  ["G4", "Sampling rate", "H4", summary.targetRate],
  ["J4", "Random seed", "K4", summary.seed],
  ["M4", "Automated source checks", "N4", "0 errors"],
];
for (const [labelCell, label, valueCell, value] of summaryCells) {
  sheet.getRange(labelCell).values = [[label]];
  sheet.getRange(valueCell).values = [[value]];
  sheet.getRange(labelCell).format.font = {
    name: "Helvetica Neue",
    size: 9,
    bold: true,
    color: "#7b2323",
  };
  sheet.getRange(valueCell).format.font = {
    name: "Helvetica Neue",
    size: 13,
    bold: true,
    color: "#201b17",
  };
}
sheet.getRange("H4").format.numberFormat = "0.0%";

sheet.getRange("A6:Q6").merge();
sheet.getRange("A6").values = [[
  `Method: ${summary.method} Quotas: Taiwan ${summary.quotas.TW}; Mainland China ${summary.quotas.CN}.`,
]];
sheet.getRange("A6").format = {
  font: { name: "Helvetica Neue", size: 9, color: "#625a50" },
  wrapText: false,
};

sheet.getRange("A7:Q7").merge();
sheet.getRange("A7").values = [[
  "How to review: open the source URL, compare the English and Chinese meaning, choose Human decision, and record corrections. Do not mark Confirm without checking the cited source.",
]];
sheet.getRange("A7").format = {
  font: { name: "Helvetica Neue", size: 9, italic: true, color: "#4f463d" },
  fill: "#f3ead7",
  wrapText: true,
  verticalAlignment: "center",
};
sheet.getRange("A7:Q7").format.rowHeight = 34;

const headers = [
  "No.",
  "Record ID",
  "Region",
  "Source ID",
  "English source",
  "Chinese rendering",
  "Source citation",
  "Strategy",
  "Regional difference",
  "Regional counterparts",
  "Automated pre-check",
  "Human decision",
  "Human checked",
  "Corrected translation",
  "Corrected strategy",
  "Reviewer notes",
  "Source URL",
];
const data = rows.map((row, index) => [
  index + 1,
  row.id,
  row.region,
  row.source_record_id,
  row.source_text,
  row.target_text,
  row.source,
  row.category,
  row.comparison_status,
  row.comparison_partners,
  row.ai_precheck,
  "",
  "",
  "",
  "",
  "",
  row.source_url,
]);
const firstDataRow = 10;
const lastDataRow = firstDataRow + rows.length - 1;
sheet.getRange(`A9:Q9`).values = [headers];
sheet.getRange(`A${firstDataRow}:Q${lastDataRow}`).values = data;

sheet.getRange(`M${firstDataRow}`).formulas = [[
  `=IF($L${firstDataRow}="Confirm","yes","no")`,
]];
sheet.getRange(`M${firstDataRow}:M${lastDataRow}`).fillDown();

sheet.getRange("A9:Q9").format = {
  fill: "#25211d",
  font: {
    name: "Helvetica Neue",
    size: 9,
    bold: true,
    color: "#ffffff",
  },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
};
sheet.getRange(`A9:Q${lastDataRow}`).format.font = {
  name: "Helvetica Neue",
  size: 9,
  color: "#28231f",
};
sheet.getRange(`A${firstDataRow}:Q${lastDataRow}`).format.verticalAlignment =
  "top";
sheet.getRange(`A${firstDataRow}:Q${lastDataRow}`).format.wrapText = true;
sheet.getRange(`A${firstDataRow}:A${lastDataRow}`).format.numberFormat = "0";
sheet.getRange(`A9:Q${lastDataRow}`).format.borders = {
  insideHorizontal: { style: "thin", color: "#e3dbd0" },
  bottom: { style: "thin", color: "#c8bcaa" },
};
sheet.getRange("A9:Q9").format.rowHeight = 38;
sheet.getRange(`A${firstDataRow}:Q${lastDataRow}`).format.rowHeight = 42;

const widths = [
  7, 13, 9, 15, 30, 30, 42, 22, 21, 45, 34, 18, 13, 30, 22, 38, 48,
];
widths.forEach((width, index) => {
  sheet
    .getRangeByIndexes(8, index, lastDataRow - 8, 1)
    .format.columnWidth = width;
});

const decisionRange = sheet.getRange(`L${firstDataRow}:L${lastDataRow}`);
decisionRange.dataValidation = {
  rule: { type: "list", values: ["Confirm", "Needs correction"] },
};
sheet.getRange(`O${firstDataRow}:O${lastDataRow}`).dataValidation = {
  rule: {
    type: "list",
    values: [
      "borrowing",
      "calque_literal",
      "semantic_equivalent",
      "explicitation",
      "hybrid",
    ],
  },
};
decisionRange.conditionalFormats.add("containsText", {
  text: "Needs correction",
  format: {
    fill: "#f9e4e1",
    font: { color: "#8b1f1f", bold: true },
  },
});
decisionRange.conditionalFormats.add("containsText", {
  text: "Confirm",
  format: {
    fill: "#e3efe9",
    font: { color: "#285f4f", bold: true },
  },
});

const table = sheet.tables.add(
  `A9:Q${lastDataRow}`,
  true,
  "HumanReview579",
);
table.style = "TableStyleMedium2";
table.showFilterButton = true;
sheet.freezePanes.freezeRows(9);
sheet.freezePanes.freezeColumns(2);

workbook.recalculate();
const preview = await workbook.render({
  sheetName: "Review 579",
  range: "A1:Q18",
  autoCrop: "all",
  scale: 1.5,
  format: "png",
});
await fs.writeFile(
  path.join(outputDir, "human-review-preview.png"),
  new Uint8Array(await preview.arrayBuffer()),
);

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(path.join(outputDir, "human-review-10-percent.xlsx"));
console.log(
  `Built ${path.join(outputDir, "human-review-10-percent.xlsx")} with ${rows.length} review rows.`,
);
