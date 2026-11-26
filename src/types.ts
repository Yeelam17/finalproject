export type Language = "en" | "zh";

export type CategoryId =
  | "borrowing"
  | "calque_literal"
  | "semantic_equivalent"
  | "explicitation"
  | "hybrid";

export type OrientationId = "source" | "target" | "mixed";
export type RegionId = "TW" | "CN";
export type ComparisonStatus =
  | "same"
  | "script_only"
  | "partial"
  | "different"
  | "unpaired";

export interface CorpusEntry {
  id: string;
  region: RegionId;
  region_label: string;
  source_record_id: string;
  source_text: string;
  target_text: string;
  target_primary: string;
  target_alternatives: string[];
  source: string;
  source_url: string;
  category: CategoryId;
  orientation: OrientationId;
  category_confidence: number;
  category_evidence: string;
  human_checked: boolean;
  multi_equivalent: boolean;
  unit: "term";
  key_term: string;
  year: number | null;
  update_date: string;
  notes: string;
  qa_sample: boolean;
  duplicate_normalized_term: boolean;
  english_key: string;
  food_category: string;
  matched_taiwan_ids: string[];
  comparison_status?: ComparisonStatus;
  comparison_partners?: string[];
}

export interface CategoryCounts {
  borrowing: number;
  calque_literal: number;
  semantic_equivalent: number;
  explicitation: number;
  hybrid: number;
}

export interface Manifest {
  title: string;
  source: string;
  source_dataset: string;
  source_file: string;
  source_sha256: string;
  source_url: string;
  license: string;
  license_url: string;
  collected: string;
  mainland_collected: string;
  generated: string;
  rows: number;
  regions: Record<RegionId, number>;
  comparison_concepts: number;
  matched_mainland_rows: number;
  matched_unique_english_terms: number;
  mainland_source: string;
  mainland_source_url: string;
  mainland_permission: string;
  mainland_file: string;
  raw_rows: number;
  missing_cells: number;
  multi_equivalent: number;
  duplicate_normalized_terms: number;
  qa_size: number;
  qa_seed: number;
  categories: CategoryCounts;
  orientations: Record<OrientationId, number>;
  classification_method: string;
  human_checked: number;
}

export interface UrlState {
  route: "explorer" | "report" | "codebook" | "ai-use";
  params: URLSearchParams;
}

export interface QaDecision {
  status: "confirmed" | "correction";
  note: string;
  updatedAt: string;
}

export type QaDecisions = Record<string, QaDecision>;
