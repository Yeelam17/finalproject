#!/usr/bin/env python3
"""Validate corpus integrity, required fields, counts, and downloadable artifacts."""

from __future__ import annotations

import csv
import hashlib
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "public" / "data"
CATEGORIES = {
    "borrowing",
    "calque_literal",
    "semantic_equivalent",
    "explicitation",
    "hybrid",
}


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def main() -> None:
    entries = json.loads((DATA / "corpus.json").read_text(encoding="utf-8"))
    manifest = json.loads((DATA / "manifest.json").read_text(encoding="utf-8"))

    require(len(entries) >= 500, "Corpus has fewer than 500 entries")
    require(manifest["rows"] == len(entries), "Manifest row count does not match")
    require(len({entry["id"] for entry in entries}) == len(entries), "Duplicate IDs")
    require(
        sum(entry["duplicate_normalized_term"] for entry in entries)
        == manifest["duplicate_normalized_terms"],
        "Normalized duplicate count does not reconcile",
    )

    required = (
        "id",
        "region",
        "source_text",
        "target_text",
        "source",
        "category",
        "english_key",
    )
    for entry in entries:
        for field in required:
            require(bool(entry.get(field)), f"Missing {field} in {entry['id']}")
        require(entry["category"] in CATEGORIES, f"Unknown category in {entry['id']}")
        require(entry["unit"] == "term", f"Unexpected unit in {entry['id']}")
        expected_host = (
            "https://terms.naer.edu.tw/"
            if entry["region"] == "TW"
            else "https://github.com/Sanotsu/china-food-composition-data"
        )
        require(entry["source_url"].startswith(expected_host), "Bad source URL")
        require(
            entry["multi_equivalent"] == (len(entry["target_alternatives"]) > 1),
            f"Equivalence flag mismatch in {entry['id']}",
        )

    counts = Counter(entry["category"] for entry in entries)
    regions = Counter(entry["region"] for entry in entries)
    require(all(counts[category] > 0 for category in CATEGORIES), "Empty category")
    require(dict(counts) == manifest["categories"], "Category totals do not reconcile")
    require(dict(regions) == manifest["regions"], "Region totals do not reconcile")
    require(
        regions["CN"] == manifest["matched_mainland_rows"],
        "Mainland row count does not reconcile",
    )
    require(
        sum(entry["qa_sample"] for entry in entries) == manifest["qa_size"] == 50,
        "QA sample is not exactly 50",
    )
    require(
        sum(entry["human_checked"] for entry in entries) == manifest["human_checked"],
        "Human-checked count does not reconcile",
    )

    source = DATA / "source" / manifest["source_file"]
    require(source.exists(), "Raw ODS is missing")
    require(
        hashlib.sha256(source.read_bytes()).hexdigest() == manifest["source_sha256"],
        "Raw ODS checksum does not match the manifest",
    )

    with (DATA / "corpus.csv").open(encoding="utf-8-sig", newline="") as handle:
        csv_rows = list(csv.DictReader(handle))
    require(len(csv_rows) == len(entries), "CSV row count does not match JSON")
    require(csv_rows[0]["id"] == entries[0]["id"], "CSV/JSON order mismatch")

    print(
        f"Validated {len(entries):,} entries with unique IDs, "
        f"{regions['TW']:,} Taiwan and {regions['CN']:,} matched mainland records, "
        f"{manifest['multi_equivalent']:,} multi-equivalent records, "
        f"{manifest['qa_size']} QA records, and matching CSV/ODS artifacts."
    )
    print("Categories:", dict(counts))


if __name__ == "__main__":
    main()
