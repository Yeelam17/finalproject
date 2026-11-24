# Terminology in Translation

A bilingual corpus explorer for the National Academy for Educational Research's food science and nutrition terminology. The site explores source-oriented and target-oriented translation strategies across 5,691 NAER term records.

## Features

- Search by English term, Traditional Chinese, or NAER term ID
- Filters for strategy, human-check status, equivalence status, and translation orientation
- Linked Sankey diagram, treemap, scatter plot, and sortable data grid
- Shareable URL state, including the selected source record
- English and Traditional Chinese interfaces, report, and codebook
- Downloadable ODS, clean CSV, JSON, and filtered table exports
- Built-in fixed-seed 50-entry human-review workflow

## Local development

```sh
pnpm install
pnpm data
pnpm dev
```

The generated static site is written to `docs/` when running `pnpm build`. GitHub Pages should publish this site from the `main` branch's `/docs` directory.

The public URL is `https://yeelam17.github.io/finalproject/`.

## Data

The source ODS is preserved under `public/data/source/`. The reproducible build script writes the cleaned JSON, CSV, QA sample, and manifest under `public/data/`.

Run `pnpm check:data` to validate record counts, required fields, category totals, the 50-record QA sample, source checksum, and CSV/JSON reconciliation.

NAER content is reused under its open-data declaration and must retain attribution to the National Academy for Educational Research (NAER) and the 樂詞網 terminology database.
