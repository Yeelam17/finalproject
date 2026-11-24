import { useMemo, useState } from "react";
import { max } from "d3-array";
import { hierarchy, treemap, type HierarchyRectangularNode } from "d3-hierarchy";
import {
  sankey,
  sankeyJustify,
  sankeyLinkHorizontal,
  type SankeyGraph,
  type SankeyLink,
  type SankeyNode,
} from "d3-sankey";
import { scaleLinear } from "d3-scale";
import type { CorpusEntry, Language, OrientationId } from "../types";
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  ORIENTATION_META,
  categoryShortLabel,
  formatNumber,
  hanLength,
  orientationLabel,
  percentage,
  sourceLength,
} from "../lib";

type FilterPatch = {
  category?: string;
  orientation?: string;
  equiv?: string;
};

interface ChartProps {
  entries: CorpusEntry[];
  language: Language;
  applyFilter: (patch: FilterPatch) => void;
}

const chartEmpty = (language: Language): string =>
  language === "en"
    ? "No terms match the current filters."
    : "目前篩選條件沒有符合的詞條。";

const fullOrientationName = (id: OrientationId, language: Language) =>
  orientationLabel(id, language);

interface SankeyDatum {
  id: string;
  label: string;
  kind: "orientation" | "strategy" | "equivalence";
  filter?: FilterPatch;
  color: string;
}

interface SankeyFlow {
  source: string;
  target: string;
  value: number;
}

type LayoutNode = SankeyNode<SankeyDatum, SankeyFlow>;
type LayoutLink = SankeyLink<SankeyDatum, SankeyFlow>;
type SankeyLayout = SankeyGraph<SankeyDatum, SankeyFlow>;

export function SankeyChart({ entries, language, applyFilter }: ChartProps) {
  const [detail, setDetail] = useState<"full" | "compact">("full");
  const width = 900;
  const height = 540;
  const total = entries.length;

  const layout = useMemo(() => {
    const nodes = new Map<string, SankeyDatum>();
    const flows = new Map<string, SankeyFlow>();
    const addNode = (node: SankeyDatum) => nodes.set(node.id, node);
    const addFlow = (source: string, target: string, value = 1) => {
      const key = `${source}|${target}`;
      const existing = flows.get(key);
      if (existing) existing.value += value;
      else flows.set(key, { source, target, value });
    };

    for (const orientation of ["source", "target", "mixed"] as OrientationId[]) {
      addNode({
        id: `o:${orientation}`,
        label: fullOrientationName(orientation, language),
        kind: "orientation",
        filter: { orientation },
        color: ORIENTATION_META[orientation].color,
      });
    }
    for (const category of CATEGORY_ORDER) {
      addNode({
        id: `c:${category}`,
        label: categoryShortLabel(category, language),
        kind: "strategy",
        filter: { category },
        color: CATEGORY_META[category].color,
      });
    }
    for (const equivalence of ["single", "multiple"] as const) {
      addNode({
        id: `e:${equivalence}`,
        label:
          language === "en"
            ? equivalence === "single"
              ? "Single equivalent"
              : "Multiple equivalents"
            : equivalence === "single"
              ? "單一對等詞"
              : "多重對等詞",
        kind: "equivalence",
        filter: { equiv: equivalence },
        color: equivalence === "single" ? "#c8bda9" : "#8c2f2f",
      });
    }

    // Aggregate records before layout so 5,691 terms become a small, readable flow.
    for (const entry of entries) {
      const category = `c:${entry.category}`;
      if (detail === "full") {
        addFlow(`o:${entry.orientation}`, category);
      }
      addFlow(
        category,
        `e:${entry.multi_equivalent ? "multiple" : "single"}`,
      );
    }

    const generator = sankey<SankeyDatum, SankeyFlow>()
      .nodeId((node) => node.id)
      .nodeWidth(18)
      .nodePadding(detail === "full" ? 20 : 28)
      .extent([
        [12, 20],
        [width - 12, height - 24],
      ]);
    if (detail === "full") generator.nodeAlign(sankeyJustify);

    const nodeValues = new Map<string, number>();
    for (const flow of flows.values()) {
      nodeValues.set(flow.source, (nodeValues.get(flow.source) ?? 0) + flow.value);
      nodeValues.set(flow.target, (nodeValues.get(flow.target) ?? 0) + flow.value);
    }
    const activeNodes = [...nodes.values()].filter(
      (node) =>
        (nodeValues.get(node.id) ?? 0) > 0 &&
        (detail === "full" ||
          node.kind === "strategy" ||
          node.kind === "equivalence"),
    );
    const activeIds = new Set(activeNodes.map((node) => node.id));
    const activeFlows = [...flows.values()].filter(
      (flow) => activeIds.has(flow.source) && activeIds.has(flow.target),
    );
    return generator({ nodes: activeNodes, links: activeFlows });
  }, [detail, entries, language]);

  const nodeFill = (node: SankeyNode<SankeyDatum, SankeyFlow>) =>
    node.color ?? "#7c7468";

  if (!total) return <ChartEmpty language={language} />;
  const categoryCounts = new Map<string, number>();
  for (const entry of entries) {
    categoryCounts.set(
      entry.category,
      (categoryCounts.get(entry.category) ?? 0) + 1,
    );
  }

  return (
    <div className="chart-shell">
      <div className="chart-controls">
        <label>
          <span>{language === "en" ? "Flow detail" : "流程層級"}</span>
          <select
            value={detail}
            onChange={(event) =>
              setDetail(event.target.value as "full" | "compact")
            }
          >
            <option value="full">
              {language === "en"
                ? "Orientation → strategy → equivalence"
                : "導向 → 策略 → 對等"}
            </option>
            <option value="compact">
              {language === "en"
                ? "Strategy → equivalence"
                : "策略 → 對等"}
            </option>
          </select>
        </label>
        <span className="chart-count">
          {formatNumber(total)} {language === "en" ? "terms" : "詞條"}
        </span>
      </div>
      <svg
        className="chart-svg chart-svg--sankey"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={
          language === "en"
            ? "Sankey diagram linking translation orientation, strategy, and equivalence"
            : "連結翻譯導向、策略與對等狀態的桑基圖"
        }
      >
        <g>
          {(layout.links as LayoutLink[]).map((link, index) => (
            <path
              key={`${index}-${(link.source as LayoutNode).id}-${(link.target as LayoutNode).id}`}
              d={sankeyLinkHorizontal()(link as never) ?? ""}
              fill="none"
              stroke={(link.target as LayoutNode).color}
              strokeOpacity={0.16}
              strokeWidth={Math.max(1, link.width ?? 0)}
            >
              <title>
                {(link.source as LayoutNode).label} →{" "}
                {(link.target as LayoutNode).label}: {formatNumber(link.value ?? 0)}
              </title>
            </path>
          ))}
        </g>
        <g>
          {(layout.nodes as LayoutNode[]).map((node) => {
            const value = node.value ?? 0;
            const x0 = node.x0 ?? 0;
            const x1 = node.x1 ?? 0;
            const y0 = node.y0 ?? 0;
            const y1 = node.y1 ?? 0;
            const labelOnLeft = x0 < width * 0.55;
            const share = percentage(value, total);
            const nodeHeight = y1 - y0;
            return (
              <g
                key={node.id}
                className="chart-node"
                role="button"
                tabIndex={0}
                aria-label={`${node.label}, ${value} terms, ${share}`}
                onClick={() => node.filter && applyFilter(node.filter)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    node.filter && applyFilter(node.filter);
                  }
                }}
              >
                <rect
                  x={x0}
                  y={y0}
                  width={Math.max(4, x1 - x0)}
                  height={Math.max(4, y1 - y0)}
                  rx={2}
                  fill={nodeFill(node)}
                />
                {nodeHeight >= 24 && (
                  <>
                    <text
                      x={labelOnLeft ? x1 + 8 : x0 - 8}
                      y={(y0 + y1) / 2 - 2}
                      textAnchor={labelOnLeft ? "start" : "end"}
                      className="chart-label"
                    >
                      {node.label}
                    </text>
                    <text
                      x={labelOnLeft ? x1 + 8 : x0 - 8}
                      y={(y0 + y1) / 2 + 14}
                      textAnchor={labelOnLeft ? "start" : "end"}
                      className="chart-label chart-label--muted"
                    >
                      {formatNumber(value)} · {share}
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </g>
      </svg>
      <div className="sankey-legend" aria-label="Translation strategy legend">
        {CATEGORY_ORDER.filter((category) => categoryCounts.has(category)).map(
          (category) => (
            <button
              key={category}
              type="button"
              onClick={() => applyFilter({ category })}
            >
              <i style={{ background: CATEGORY_META[category].color }} />
              <span>{categoryShortLabel(category, language)}</span>
              <strong>{formatNumber(categoryCounts.get(category) ?? 0)}</strong>
            </button>
          ),
        )}
      </div>
    </div>
  );
}

interface TreeDatum {
  name: string;
  filter?: FilterPatch;
  color?: string;
  children?: TreeDatum[];
  value?: number;
}

type TreeLeaf = HierarchyRectangularNode<TreeDatum>;

export function TreemapChart({ entries, language, applyFilter }: ChartProps) {
  const [grouping, setGrouping] = useState<"orientation" | "equivalence">(
    "orientation",
  );
  const width = 760;
  const height = 430;

  const leaves = useMemo(() => {
    const root: TreeDatum = { name: "corpus", children: [] };
    // Both grouping modes preserve the same leaf strategies and filter semantics.
    const topGroups =
      grouping === "orientation"
        ? (["source", "target", "mixed"] as const)
        : (["single", "multiple"] as const);

    for (const group of topGroups) {
      const groupNode: TreeDatum = {
        name:
          grouping === "orientation"
            ? fullOrientationName(group as OrientationId, language)
            : language === "en"
              ? group === "single"
                ? "Single equivalents"
                : "Multiple equivalents"
              : group === "single"
                ? "單一對等詞"
                : "多重對等詞",
        children: [],
        color: grouping === "orientation" ? ORIENTATION_META[group as OrientationId].color : "#8c2f2f",
      };
      for (const category of CATEGORY_ORDER) {
        const categoryEntries = entries.filter(
          (entry) =>
            entry.category === category &&
            (grouping === "orientation"
              ? entry.orientation === group
              : (entry.multi_equivalent ? "multiple" : "single") === group),
        );
        if (!categoryEntries.length) continue;
        groupNode.children?.push({
          name: categoryShortLabel(category, language),
          filter: { category },
          color: CATEGORY_META[category].color,
          value: categoryEntries.length,
        });
      }
      const total = (groupNode.children ?? []).reduce(
        (sum, child) => sum + (child.value ?? 0),
        0,
      );
      if (total) root.children?.push(groupNode);
    }

    const rootNode = treemap<TreeDatum>()
      .size([width, height])
      .paddingInner(3)
      .paddingOuter(2)
      .round(true)(hierarchy(root).sum((node) => node.value ?? 0));

    return rootNode.leaves() as TreeLeaf[];
  }, [entries, grouping, language]);

  if (!entries.length) return <ChartEmpty language={language} />;

  return (
    <div className="chart-shell">
      <div className="chart-controls">
        <label>
          <span>{language === "en" ? "Group tile areas by" : "面積分組方式"}</span>
          <select
            value={grouping}
            onChange={(event) =>
              setGrouping(event.target.value as "orientation" | "equivalence")
            }
          >
            <option value="orientation">
              {language === "en" ? "Translation orientation" : "翻譯導向"}
            </option>
            <option value="equivalence">
              {language === "en" ? "Equivalence status" : "對等狀態"}
            </option>
          </select>
        </label>
        <span className="chart-count">
          {formatNumber(entries.length)} {language === "en" ? "terms" : "詞條"}
        </span>
      </div>
      <svg
        className="chart-svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={
          language === "en"
            ? "Treemap of translation strategies grouped by orientation"
            : "依翻譯導向分組的翻譯策略矩形樹圖"
        }
      >
        {leaves.map((leaf) => {
          const x0 = leaf.x0;
          const x1 = leaf.x1;
          const y0 = leaf.y0;
          const y1 = leaf.y1;
          const area = (x1 - x0) * (y1 - y0);
          const entryCount = leaf.value ?? 0;
          return (
            <g
              key={leaf.data.name}
              role="button"
              tabIndex={0}
              className="chart-node"
              onClick={() => leaf.data.filter && applyFilter(leaf.data.filter)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  leaf.data.filter && applyFilter(leaf.data.filter);
                }
              }}
            >
              <rect
                x={x0}
                y={y0}
                width={Math.max(0, x1 - x0)}
                height={Math.max(0, y1 - y0)}
                fill={leaf.data.color ?? "#76685c"}
                fillOpacity={0.9}
              >
                <title>
                  {leaf.parent?.data.name} → {leaf.data.name}:{" "}
                  {formatNumber(entryCount)}
                </title>
              </rect>
              {area > 4200 && (
                <>
                  <text
                    x={x0 + 9}
                    y={y0 + 19}
                    className="chart-label chart-label--on-fill"
                  >
                    {leaf.data.name}
                  </text>
                  <text
                    x={x0 + 9}
                    y={y0 + 36}
                    className="chart-label chart-label--on-fill chart-label--muted"
                  >
                    {formatNumber(entryCount)}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

interface ScatterChartProps extends ChartProps {
  selectedId?: string;
  selectTerm: (entry: CorpusEntry) => void;
}

export function ScatterChart({
  entries,
  language,
  selectedId,
  selectTerm,
}: ScatterChartProps) {
  const [colorBy, setColorBy] = useState<"category" | "orientation">(
    "category",
  );
  const width = 760;
  const height = 420;
  const margin = { top: 24, right: 22, bottom: 54, left: 62 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  const points = useMemo(
    () =>
      // Length is a descriptive comparison, not a quality score.
      entries.map((entry) => ({
        entry,
        x: sourceLength(entry.source_text),
        y: hanLength(entry.target_primary),
      })),
    [entries],
  );

  const xMax = Math.max(5, max(points, (point) => point.x) ?? 5);
  const yMax = Math.max(5, max(points, (point) => point.y) ?? 5);
  const xScale = scaleLinear().domain([0, xMax]).range([0, plotWidth]);
  const yScale = scaleLinear().domain([0, yMax]).range([plotHeight, 0]);
  const xTicks = xScale.ticks(6);
  const yTicks = yScale.ticks(5);

  if (!entries.length) return <ChartEmpty language={language} />;

  return (
    <div className="chart-shell">
      <div className="chart-controls">
        <label>
          <span>{language === "en" ? "Colour points by" : "資料點著色"}</span>
          <select
            value={colorBy}
            onChange={(event) =>
              setColorBy(event.target.value as "category" | "orientation")
            }
          >
            <option value="category">
              {language === "en" ? "Translation strategy" : "翻譯策略"}
            </option>
            <option value="orientation">
              {language === "en" ? "Translation orientation" : "翻譯導向"}
            </option>
          </select>
        </label>
        <span className="chart-count">
          {formatNumber(points.length)} {language === "en" ? "points" : "資料點"}
        </span>
      </div>
      <svg
        className="chart-svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={
          language === "en"
            ? "Scatter plot comparing English and Chinese term lengths"
            : "比較英文與中文術語長度的散佈圖"
        }
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {yTicks.map((tick) => (
            <g key={`y-${tick}`}>
              <line
                x1={0}
                x2={plotWidth}
                y1={yScale(tick)}
                y2={yScale(tick)}
                className="chart-grid"
              />
              <text
                x={-12}
                y={yScale(tick) + 4}
                textAnchor="end"
                className="chart-tick"
              >
                {tick}
              </text>
            </g>
          ))}
          {xTicks.map((tick) => (
            <g key={`x-${tick}`}>
              <line
                x1={xScale(tick)}
                x2={xScale(tick)}
                y1={0}
                y2={plotHeight}
                className="chart-grid"
              />
              <text
                x={xScale(tick)}
                y={plotHeight + 20}
                textAnchor="middle"
                className="chart-tick"
              >
                {tick}
              </text>
            </g>
          ))}
          <line
            x1={0}
            x2={plotWidth}
            y1={plotHeight}
            y2={plotHeight}
            className="chart-axis"
          />
          <line x1={0} x2={0} y1={0} y2={plotHeight} className="chart-axis" />
          <text
            x={plotWidth / 2}
            y={plotHeight + 40}
            textAnchor="middle"
            className="chart-axis-title"
          >
            {language === "en" ? "English characters" : "英文字元數"}
          </text>
          <text
            transform={`translate(-45,${plotHeight / 2}) rotate(-90)`}
            textAnchor="middle"
            className="chart-axis-title"
          >
            {language === "en" ? "Chinese characters" : "中文字數"}
          </text>
          {points.map(({ entry, x, y }) => {
            const color =
              colorBy === "category"
                ? CATEGORY_META[entry.category].color
                : ORIENTATION_META[entry.orientation].color;
            const selected = entry.id === selectedId;
            return (
              <circle
                key={entry.id}
                cx={xScale(x)}
                cy={yScale(y)}
                r={selected ? 5.5 : 2.6}
                fill={color}
                fillOpacity={selected ? 1 : 0.52}
                stroke={selected ? "#171512" : "none"}
                strokeWidth={selected ? 1.5 : 0}
                className="scatter-point"
                role="button"
                tabIndex={0}
                aria-label={`${entry.source_text} → ${entry.target_primary}`}
                onClick={() => selectTerm(entry)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    selectTerm(entry);
                  }
                }}
              >
                <title>
                  {entry.source_text} → {entry.target_primary} ·{" "}
                  {categoryShortLabel(entry.category, language)}
                </title>
              </circle>
            );
          })}
        </g>
      </svg>
      <div className="chart-legend" aria-label="Chart legend">
        {(colorBy === "category"
          ? CATEGORY_ORDER.map((category) => ({
              label: categoryShortLabel(category, language),
              color: CATEGORY_META[category].color,
            }))
          : (["source", "target", "mixed"] as OrientationId[]).map(
              (orientation) => ({
                label: fullOrientationName(orientation, language),
                color: ORIENTATION_META[orientation].color,
              }),
            )
        ).map((item) => (
          <span key={item.label}>
            <i style={{ background: item.color }} />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function ChartEmpty({ language }: { language: Language }) {
  return <div className="chart-empty">{chartEmpty(language)}</div>;
}
