# Terminology in Translation

A bilingual corpus explorer comparing Taiwan's NAER food-science terminology with matched Mainland Chinese food names. The site combines 5,691 Taiwan records with 101 exact-English-name matches from the China Food Composition Table dataset, covering 91 shared concepts.

## Features

- Search by English term, Traditional Chinese, or NAER term ID
- Filters for strategy, human-check status, equivalence status, and translation orientation
- Region and regional-difference filters, including Traditional-to-Simplified normalization
- Linked Sankey diagram, treemap, scatter plot, and sortable data grid
- Shareable URL state, including the selected source record
- English and Traditional Chinese interfaces, report, and codebook
- Downloadable ODS, clean CSV, JSON, and filtered table exports
- Built-in fixed-seed 50-entry human-review workflow
- Current human review: 37 confirmed, 10 corrected and resolved, 3 awaiting correction detail

## Local development

```sh
pnpm install
pnpm data
pnpm dev
```

The generated static site is written to `docs/` when running `pnpm build`. The GitHub Actions workflow in `.github/workflows/pages.yml` builds and deploys the static artifact to GitHub Pages on each push to `main`.

The public URL is `https://yeelam17.github.io/finalproject/`.

## Data

The Taiwan ODS and matched Mainland name snapshot are preserved under `public/data/source/`. The reproducible build scripts write the cleaned JSON, CSV, QA sample, and manifest under `public/data/`.

Run `pnpm check:data` to validate record counts, required fields, category totals, the 50-record QA sample, source checksum, and CSV/JSON reconciliation.

The exported review decisions are stored under `data/review/`. A correction flag without a concrete correction remains `human_checked: no`, so the three unresolved records are not presented as verified.

NAER content is reused under its open-data declaration and must retain attribution to the National Academy for Educational Research (NAER) and the 樂詞網 terminology database.

The Mainland comparison uses only matched bilingual food-name records from `Sanotsu/china-food-composition-data`; the full nutritional table is not republished. The repository implements no open licence, and the project owner confirmed permission for these matched records.
