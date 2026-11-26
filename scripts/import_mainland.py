#!/usr/bin/env python3
"""Select mainland food-name rows that have an exact English match in NAER."""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
import unicodedata
from pathlib import Path

from build_corpus import ROOT, SOURCE, clean_text, read_ods_rows

UPSTREAM_REPO = "https://github.com/Sanotsu/china-food-composition-data"
UPSTREAM_COMMIT = "d15675c27582748307023b7ee7aca2a63fc52756"
UPSTREAM_CSV = (
    "json_data_v3_20260825_qwen38max_kimi_k3_fixed_en/"
    "food_composition_full.csv"
)
OUT = ROOT / "data" / "source" / "china_food_composition_matched.csv"
MANIFEST = ROOT / "data" / "source" / "china_food_composition_manifest.json"


def normalize_english(value: str) -> str:
    value = unicodedata.normalize("NFKC", value or "").lower()
    value = value.replace("‐", "-").replace("‑", "-")
    value = re.sub(r"\s+", " ", value).strip()
    return re.sub(r"\s*[（(][^）)]*[）)]\s*$", "", value).strip()


def taiwan_terms() -> list[dict]:
    rows = read_ods_rows(SOURCE)
    return [
        {
            "id": clean_text(row[0]),
            "source_text": clean_text(row[1]),
            "target_text": clean_text(row[2]),
            "english_key": normalize_english(clean_text(row[1])),
        }
        for row in rows[1:]
        if len(row) >= 3 and row[0] and row[1] and row[2]
    ]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True, type=Path)
    args = parser.parse_args()

    with args.source.open(encoding="utf-8-sig", newline="") as handle:
        mainland_rows = list(csv.DictReader(handle))
    by_english: dict[str, list[dict]] = {}
    for row in taiwan_terms():
        by_english.setdefault(row["english_key"], []).append(row)

    matched: list[dict] = []
    for row in mainland_rows:
        english = clean_text(row.get("englishName", ""))
        key = normalize_english(english)
        if not english or key not in by_english:
            continue
        matched.append(
            {
                "category": clean_text(row.get("category", "")),
                "foodCode": clean_text(row.get("foodCode", "")),
                "foodName": clean_text(row.get("foodName", "")),
                "englishName": english,
                "english_key": key,
                "matched_taiwan_ids": ";".join(
                    item["id"] for item in by_english[key]
                ),
            }
        )

    OUT.parent.mkdir(parents=True, exist_ok=True)
    fields = [
        "category",
        "foodCode",
        "foodName",
        "englishName",
        "english_key",
        "matched_taiwan_ids",
    ]
    with OUT.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, lineterminator="\n")
        writer.writeheader()
        writer.writerows(matched)

    MANIFEST.write_text(
        json.dumps(
            {
                "repository": UPSTREAM_REPO,
                "commit": UPSTREAM_COMMIT,
                "source_path": UPSTREAM_CSV,
                "source_url": f"{UPSTREAM_REPO}/blob/{UPSTREAM_COMMIT}/{UPSTREAM_CSV}",
                "retrieved": "2026-11-26",
                "source_sha256": hashlib.sha256(args.source.read_bytes()).hexdigest(),
                "source_rows": len(mainland_rows),
                "matched_rows": len(matched),
                "matched_unique_english_terms": len(
                    {row["english_key"] for row in matched}
                ),
                "license_note": (
                    "The repository declares no open license. The project owner "
                    "confirmed permission to publish the matched bilingual name "
                    "records used here; the full nutritional table is not copied."
                ),
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    print(
        f"Wrote {len(matched)} matched mainland rows "
        f"({len({row['english_key'] for row in matched})} unique English terms)."
    )


if __name__ == "__main__":
    main()
