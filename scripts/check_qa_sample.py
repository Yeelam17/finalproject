#!/usr/bin/env python3
"""Reconcile the 10% review sample against both source snapshots."""

from __future__ import annotations

import csv
import json
from collections import Counter
from pathlib import Path

from build_corpus import MAINLAND_SOURCE, SOURCE, clean_text, read_ods_rows

ROOT = Path(__file__).resolve().parents[1]
SAMPLE = ROOT / "outputs" / "2026-11-26-qa10" / "human-review-10-percent.csv"
REPORT = ROOT / "outputs" / "2026-11-26-qa10" / "automated-check.json"
CATEGORIES = {
    "borrowing",
    "calque_literal",
    "semantic_equivalent",
    "explicitation",
    "hybrid",
}


def main() -> None:
    with SAMPLE.open(encoding="utf-8-sig", newline="") as handle:
        sample = list(csv.DictReader(handle))
    with MAINLAND_SOURCE.open(encoding="utf-8", newline="") as handle:
        mainland_rows = {
            clean_text(row["foodCode"]): row for row in csv.DictReader(handle)
        }
    taiwan_rows = {
        clean_text(row[0]): {
            "source": clean_text(row[1]),
            "target": clean_text(row[2]),
        }
        for row in read_ods_rows(SOURCE)[1:]
        if len(row) >= 3 and row[0]
    }

    errors: list[str] = []
    checked = 0
    region_counts = Counter()
    comparison_counts = Counter()
    for row in sample:
        checked += 1
        region = row["region"]
        region_counts[region] += 1
        comparison_counts[row["comparison_status"]] += 1
        if row["category"] not in CATEGORIES:
            errors.append(f"{row['id']}: invalid category")
        if row["human_decision"] or row["human_checked"]:
            errors.append(f"{row['id']}: human fields must start blank")
        if region == "TW":
            source = taiwan_rows.get(row["source_record_id"])
            if not source:
                errors.append(f"{row['id']}: missing NAER source row")
            elif (
                source["source"] != row["source_text"]
                or source["target"] != row["target_text"]
            ):
                errors.append(f"{row['id']}: source pair mismatch")
        elif region == "CN":
            source = mainland_rows.get(row["source_record_id"])
            if not source:
                errors.append(f"{row['id']}: missing Mainland source row")
            elif (
                clean_text(source["englishName"]) != row["source_text"]
                or clean_text(source["foodName"]) != row["target_text"]
            ):
                errors.append(f"{row['id']}: source pair mismatch")
        else:
            errors.append(f"{row['id']}: unknown region {region}")

    if len(sample) != 579:
        errors.append(f"Expected 579 rows, found {len(sample)}")
    if len({row["id"] for row in sample}) != len(sample):
        errors.append("Duplicate IDs in sample")

    report = {
        "sampleRows": len(sample),
        "checkedRows": checked,
        "errors": len(errors),
        "errorDetails": errors[:50],
        "regionCounts": dict(region_counts),
        "comparisonCounts": dict(comparison_counts),
        "scope": (
            "Automated source-integrity check only. It confirms that required "
            "fields are present and each source pair matches its source snapshot; "
            "it does not constitute the required human semantic review."
        ),
    }
    REPORT.write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    if errors:
        raise AssertionError(f"{len(errors)} sample errors; see {REPORT}")
    print(
        f"Checked {checked} sampled rows against source snapshots: "
        f"{region_counts['TW']} Taiwan, {region_counts['CN']} Mainland, 0 errors."
    )


if __name__ == "__main__":
    main()
