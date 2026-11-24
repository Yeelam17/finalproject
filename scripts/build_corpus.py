#!/usr/bin/env python3
"""Build the cleaned NAER corpus, classifications, QA sample, and downloads."""

from __future__ import annotations

import csv
import hashlib
import html
import json
import random
import re
import shutil
import unicodedata
import urllib.parse
import xml.etree.ElementTree as ET
import zipfile
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "農學名詞-食品科學與營養學名詞壓縮檔_0.ods"
OUT = ROOT / "public" / "data"
RAW_OUT = OUT / "source"
COLLECTED = "2026-11-24"
RANDOM_SEED = 2026
QA_SIZE = 50

NS = {
    "office": "urn:oasis:names:tc:opendocument:xmlns:office:1.0",
    "table": "urn:oasis:names:tc:opendocument:xmlns:table:1.0",
    "text": "urn:oasis:names:tc:opendocument:xmlns:text:1.0",
}

CATEGORY_LABELS = {
    "borrowing": {"en": "Borrowing / transliteration", "zh": "借譯／音譯"},
    "calque_literal": {"en": "Calque / literal translation", "zh": "仿譯／直譯"},
    "semantic_equivalent": {"en": "Semantic equivalent / modulation", "zh": "語意對等／轉換"},
    "explicitation": {"en": "Explicitation", "zh": "顯化"},
    "hybrid": {"en": "Hybrid rendering", "zh": "混合譯法"},
}

CATEGORY_ORIENTATION = {
    "borrowing": "source",
    "calque_literal": "source",
    "semantic_equivalent": "target",
    "explicitation": "target",
    "hybrid": "mixed",
}

TAG_RE = re.compile(r"<[^>]+>")
HAN_RE = re.compile(r"[\u3400-\u9fff]")
LATIN_GREEK_RE = re.compile(r"[A-Za-z\u0370-\u03ff]")
PAREN_EXPLANATION_RE = re.compile(r"[（(][^）)]{2,}[）)]|\{[^}]{2,}\}")
ACRONYM_RE = re.compile(r"\b[A-Z]{2,}(?:\s+cell)?\b")
SCIENCE_SUFFIXES = (
    "ase",
    "osis",
    "itis",
    "emia",
    "aemia",
    "uria",
    "phobia",
    "ectomy",
    "genesis",
    "trophy",
    "plasty",
    "ology",
    "icide",
    "genic",
)

# Name-like single terms require lexical judgment rather than capitalization
# alone. These decisions were made during the codebook pilot and remain
# low-confidence records for the human QA pass.
SINGLE_NAME_OVERRIDES: dict[str, tuple[str, str, float, str]] = {
    "Ajinomoto": (
        "semantic_equivalent",
        "brand name represented by an established product equivalent",
        0.82,
        "The target names the product rather than transferring the brand form.",
    ),
    "Angostura": (
        "semantic_equivalent",
        "brand name represented by a descriptive product equivalent",
        0.78,
        "The target describes the product type without retaining the brand form.",
    ),
    "Arcobacter": (
        "semantic_equivalent",
        "genus name rendered through a descriptive Chinese taxonomic label",
        0.78,
        "The target describes the curved-rod bacterium rather than transferring the name.",
    ),
    "Benedictine": (
        "hybrid",
        "name-like stem combined with a Chinese beverage head",
        0.84,
        "The rendering combines a proper-name form with a translated category noun.",
    ),
    "Bordeaux": (
        "borrowing",
        "proper place-name rendered as a Chinese name",
        0.88,
        "The target is a conventional Chinese name form for the place.",
    ),
    "Burgundy": (
        "hybrid",
        "name-like wine-region stem combined with 葡萄酒",
        0.90,
        "The rendering combines a proper-name form with a translated category noun.",
    ),
    "Chartreuse": (
        "hybrid",
        "name-like stem combined with 酒",
        0.84,
        "The rendering combines a proper-name form with a translated category noun.",
    ),
    "Cheddar": (
        "hybrid",
        "name-like cheese term combined with 起司",
        0.88,
        "The rendering combines a place-based name with a translated cheese head.",
    ),
    "Cellophane": (
        "semantic_equivalent",
        "genericized brand rendered through a descriptive Chinese product term",
        0.82,
        "The target names the material rather than retaining the brand form.",
    ),
    "Cognac": (
        "hybrid",
        "place-name stem combined with 白蘭地",
        0.90,
        "The rendering combines a proper-name form with a translated beverage head.",
    ),
    "Collins": (
        "hybrid",
        "name-like stem combined with 雞尾酒",
        0.84,
        "The rendering combines a proper-name form with a translated drink head.",
    ),
    "Edam": (
        "hybrid",
        "place-name stem combined with 起司",
        0.86,
        "The rendering combines a place-based name with a translated cheese head.",
    ),
    "Fluon": (
        "semantic_equivalent",
        "brand rendered through a chemical material description",
        0.78,
        "The target describes the material rather than transferring the brand form.",
    ),
    "Gouda": (
        "hybrid",
        "place-name stem combined with 起司",
        0.86,
        "The rendering combines a place-based name with a translated cheese head.",
    ),
    "Hamantaschen": (
        "explicitation",
        "name expanded into a descriptive pastry designation",
        0.80,
        "The target supplies cultural and food-category information.",
    ),
    "Hovis": (
        "semantic_equivalent",
        "brand rendered through a descriptive bread equivalent",
        0.78,
        "The target describes the bread type rather than transferring the brand form.",
    ),
    "Jodbasedow": (
        "explicitation",
        "eponymous condition expanded into a descriptive medical term",
        0.78,
        "The target spells out the iodine-related condition.",
    ),
    "Lancashire": (
        "hybrid",
        "place-name stem combined with 硬奶酪",
        0.82,
        "The rendering combines a place-based name with a translated cheese head.",
    ),
    "Listeria": (
        "hybrid",
        "name-like stem combined with 菌",
        0.88,
        "The rendering combines a taxonomic name with a Chinese genus label.",
    ),
    "Martini": (
        "borrowing",
        "proper name rendered as a Chinese name form",
        0.82,
        "The target transfers the name without a separately visible category head.",
    ),
    "Passover": (
        "semantic_equivalent",
        "religious holiday represented by its conventional Chinese name",
        0.88,
        "The target is a settled equivalent rather than a transferred source form.",
    ),
    "Spam": (
        "semantic_equivalent",
        "brand represented by the familiar product category",
        0.84,
        "The target describes the canned meat product.",
    ),
    "Spans": (
        "semantic_equivalent",
        "brand-like source represented by a descriptive chemical equivalent",
        0.72,
        "The target supplies a chemical term rather than preserving the source form.",
    ),
    "Spirulina": (
        "semantic_equivalent",
        "organism name represented by a conventional Chinese designation",
        0.82,
        "The target is a settled descriptive equivalent.",
    ),
    "Teflon": (
        "semantic_equivalent",
        "genericized brand rendered through a chemical material description",
        0.86,
        "The target describes the material rather than retaining the brand form.",
    ),
    "Tokay": (
        "hybrid",
        "wine-name stem combined with 酒",
        0.84,
        "The rendering combines a proper-name form with a translated beverage head.",
    ),
    "Tweens": (
        "explicitation",
        "brand-like term expanded into a descriptive chemical classification",
        0.84,
        "The target explains the substance rather than preserving the name.",
    ),
    "Torulopsis": (
        "semantic_equivalent",
        "taxonomic name represented through a descriptive Chinese label",
        0.76,
        "The target describes the yeast group rather than transferring the Latin form.",
    ),
    "Yersiniosis": (
        "hybrid",
        "eponymous stem combined with 腸炎",
        0.82,
        "The rendering combines a name-like stem with a translated disease head.",
    ),
}


def clean_text(value: str) -> str:
    value = html.unescape(TAG_RE.sub("", value or ""))
    value = unicodedata.normalize("NFC", value)
    return re.sub(r"\s+", " ", value).strip()


def read_ods_rows(path: Path) -> list[list[str]]:
    with zipfile.ZipFile(path) as archive:
        content = archive.read("content.xml")
    root = ET.fromstring(content)
    table = root.find(".//table:table", NS)
    if table is None:
        raise ValueError("No spreadsheet table found in ODS")

    rows: list[list[str]] = []
    for row in table.findall("table:table-row", NS):
        row_repeat = int(row.attrib.get(f"{{{NS['table']}}}number-rows-repeated", "1"))
        cells: list[str] = []
        for cell in row.findall("table:table-cell", NS):
            repeat = int(cell.attrib.get(f"{{{NS['table']}}}number-columns-repeated", "1"))
            text = "".join(cell.itertext()).strip()
            if not text:
                text = cell.attrib.get(f"{{{NS['office']}}}value", "")
            cells.extend([text] * repeat)
        while cells and not cells[-1]:
            cells.pop()
        rows.extend([cells] * row_repeat)
    while rows and not any(rows[-1]):
        rows.pop()
    return rows


def primary_target(target: str) -> tuple[str, list[str]]:
    options = [part.strip() for part in re.split(r"[；;]", target) if part.strip()]
    return (options[0] if options else "", options)


def source_url(source_text: str) -> str:
    query = urllib.parse.urlencode(
        {
            "query_term": source_text,
            "query_field": "title",
            "query_op": "",
            "match_type": "phrase",
        }
    )
    return f"https://terms.naer.edu.tw/search/?{query}"


def classify(source_text: str, target: str) -> tuple[str, str, float, str]:
    primary, options = primary_target(target)
    source_plain = clean_text(source_text)
    target_plain = clean_text(primary)
    han_count = len(HAN_RE.findall(target_plain))
    retained = bool(LATIN_GREEK_RE.search(target_plain))
    acronyms = ACRONYM_RE.findall(source_plain)
    source_words = [w for w in re.split(r"[\s\-]+", source_plain) if w]
    is_multiword = len(source_words) > 1
    is_eponym = bool(re.search(r"(?:'s|’s)\b|\b(?:genus|species)\b", source_plain, re.I))

    if source_plain in SINGLE_NAME_OVERRIDES:
        return SINGLE_NAME_OVERRIDES[source_plain]
    if retained and han_count:
        acronym_in_target = any(a.replace(" ", "") in target_plain.replace(" ", "") for a in acronyms)
        if acronym_in_target or re.search(r"[α-ωΑ-Ωβγ]", target_plain):
            return (
                "hybrid",
                "combines a retained Latin/Greek or acronym form with a Chinese head",
                0.93,
                "Retained source-script material and Chinese wording appear in the same rendering.",
            )
        return (
            "hybrid",
            "retained source-script material plus Chinese wording",
            0.88,
            "The principal target preserves source-script material while adding a Chinese explanation.",
        )
    if retained and not han_count:
        return (
            "borrowing",
            "source form retained without a Chinese equivalent",
            0.98,
            "The principal target consists primarily of the source form.",
        )
    if PAREN_EXPLANATION_RE.search(target_plain) or re.search(r"[{｛]", target):
        return (
            "explicitation",
            "explanatory content is added in parentheses or braces",
            0.95,
            "The rendering adds a definition or classifying explanation.",
        )
    if is_eponym or (source_plain[:1].isupper() and re.search(r"[屬科目綱門界]$", target_plain)):
        return (
            "hybrid",
            "proper name or taxonomic label with a translated classification",
            0.82,
            "A name-like source is combined with a translated category label.",
        )
    if source_plain[:1].isupper() and not is_multiword and not source_plain.isupper():
        return (
            "semantic_equivalent",
            "single name-like source represented by a Chinese designation",
            0.70,
            "The source is name-like, but no visible source form is retained in the target.",
        )
    if is_multiword or any(source_plain.lower().endswith(s) for s in SCIENCE_SUFFIXES):
        return (
            "calque_literal",
            "multi-element technical form with a compositional Chinese rendering",
            0.84 if is_multiword else 0.78,
            "The source structure is compositional or uses a technical suffix, supporting a direct rendering.",
        )
    if len(options) > 1:
        return (
            "semantic_equivalent",
            "single term represented by one or more interchangeable Chinese designations",
            0.74,
            "The principal rendering is lexical rather than overtly structural.",
        )
    if han_count >= 8:
        return (
            "explicitation",
            "compact source term expanded into a descriptive Chinese designation",
            0.70,
            "The target is substantially more descriptive than the source form.",
        )
    return (
        "semantic_equivalent",
        "single term represented by a lexical Chinese equivalent",
        0.76,
        "No source form or explicit explanation is retained, so the pairing defaults to lexical equivalence.",
    )


def build_rows() -> tuple[list[dict], list[list[str]]]:
    raw_rows = read_ods_rows(SOURCE)
    if not raw_rows:
        raise ValueError("The source ODS is empty")
    header = raw_rows[0]
    if header[:4] != ["ID", "英文詞彙", "中文詞彙", "更新日期"]:
        raise ValueError(f"Unexpected header: {header}")

    entries: list[dict] = []
    for row in raw_rows[1:]:
        row = row + [""] * (4 - len(row))
        term_id, source_raw, target_raw, update_date = row[:4]
        if not any((term_id, source_raw, target_raw, update_date)):
            continue
        source_text = clean_text(source_raw)
        target_text = clean_text(target_raw)
        primary, alternatives = primary_target(target_text)
        category, evidence, confidence, rationale = classify(source_text, target_text)
        entries.append(
            {
                "id": clean_text(term_id),
                "source_text": source_text,
                "target_text": target_text,
                "target_primary": primary,
                "target_alternatives": alternatives,
                "source": (
                    "NAER 樂詞網, 農學名詞-食品科學與營養學名詞, "
                    f"term ID {clean_text(term_id)}, collected {COLLECTED}"
                ),
                "source_url": source_url(source_text),
                "category": category,
                "orientation": CATEGORY_ORIENTATION[category],
                "category_confidence": confidence,
                "category_evidence": evidence,
                "human_checked": False,
                "multi_equivalent": len(alternatives) > 1,
                "unit": "term",
                "key_term": source_text,
                "year": int(update_date[:4]) if re.match(r"\d{4}", update_date or "") else None,
                "update_date": update_date,
                "notes": "",
            }
        )
    entries.sort(key=lambda item: item["id"])
    seen_normalized: set[str] = set()
    for entry in entries:
        normalized = entry["source_text"].casefold()
        entry["duplicate_normalized_term"] = normalized in seen_normalized
        seen_normalized.add(normalized)
    return entries, raw_rows


def add_qa_sample(entries: list[dict]) -> None:
    ids = [entry["id"] for entry in entries]
    random.Random(RANDOM_SEED).shuffle(ids)
    selected = set(ids[:QA_SIZE])
    for entry in entries:
        entry["qa_sample"] = entry["id"] in selected


def write_json(path: Path, value: object, *, pretty: bool = False) -> None:
    options = {"ensure_ascii": False}
    if pretty:
        options.update({"indent": 2})
    else:
        options.update({"separators": (",", ":")})
    path.write_text(
        json.dumps(value, **options) + "\n",
        encoding="utf-8",
    )


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    RAW_OUT.mkdir(parents=True, exist_ok=True)
    entries, raw_rows = build_rows()
    add_qa_sample(entries)

    ids = [entry["id"] for entry in entries]
    if len(ids) != len(set(ids)):
        raise ValueError("Duplicate NAER term IDs found")
    required = ("id", "source_text", "target_text", "source", "category")
    for entry in entries:
        missing = [field for field in required if not entry.get(field)]
        if missing:
            raise ValueError(f"Missing required fields for {entry['id']}: {missing}")
        if entry["category"] not in CATEGORY_LABELS:
            raise ValueError(f"Unknown category for {entry['id']}: {entry['category']}")
    if sum(entry["qa_sample"] for entry in entries) != QA_SIZE:
        raise ValueError("QA sample does not contain exactly 50 records")

    copy_target = RAW_OUT / "naer_food_science_nutrition.ods"
    shutil.copyfile(SOURCE, copy_target)

    write_json(OUT / "corpus.json", entries)
    write_json(
        OUT / "categories.json",
        [
            {
                "id": category,
                "label_en": labels["en"],
                "label_zh": labels["zh"],
                "orientation": CATEGORY_ORIENTATION[category],
            }
            for category, labels in CATEGORY_LABELS.items()
        ],
        pretty=True,
    )

    csv_fields = [
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
        "qa_sample",
    ]
    with (OUT / "corpus.csv").open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=csv_fields, lineterminator="\n")
        writer.writeheader()
        for entry in entries:
            writer.writerow({field: entry.get(field, "") for field in csv_fields})

    category_counts = Counter(entry["category"] for entry in entries)
    orientation_counts = Counter(entry["orientation"] for entry in entries)
    manifest = {
        "title": "Terminology in Translation: Food Science and Nutrition in English and Chinese",
        "source": "National Academy for Educational Research (NAER), 樂詞網",
        "source_dataset": "農學名詞-食品科學與營養學名詞",
        "source_file": copy_target.name,
        "source_sha256": hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
        "source_url": "https://terms.naer.edu.tw/",
        "license": (
            "NAER Government Website Open Data Declaration: reuse and adaptation permitted "
            "with attribution to NAER; third-party rights and moral rights still apply."
        ),
        "license_url": "https://terms.naer.edu.tw/mysite/about/2/",
        "collected": COLLECTED,
        "generated": COLLECTED,
        "rows": len(entries),
        "raw_rows": len(raw_rows) - 1,
        "missing_cells": 0,
        "multi_equivalent": sum(entry["multi_equivalent"] for entry in entries),
        "duplicate_normalized_terms": sum(
            entry["duplicate_normalized_term"] for entry in entries
        ),
        "qa_size": QA_SIZE,
        "qa_seed": RANDOM_SEED,
        "categories": dict(category_counts),
        "orientations": dict(orientation_counts),
        "classification_method": "Codex-assisted, deterministic rule audit, version 1.0",
        "human_checked": sum(entry["human_checked"] for entry in entries),
    }
    write_json(OUT / "manifest.json", manifest, pretty=True)

    written = ", ".join(
        [
            path.name
            for path in [
                OUT / "corpus.json",
                OUT / "corpus.csv",
                OUT / "manifest.json",
                copy_target,
            ]
        ]
    )
    print(f"Built {len(entries)} entries: {written}")
    print("Categories:", dict(category_counts))


if __name__ == "__main__":
    main()
