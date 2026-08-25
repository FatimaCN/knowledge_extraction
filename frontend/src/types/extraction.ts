export type LanguageFilter = "All languages" | "English" | "French";

export interface ExtractionOptions {
  labels: boolean;
  definitions: boolean;
  hierarchy: boolean;
  relations: boolean;
  provenance: boolean;
  language: LanguageFilter;
}

export interface ExtractedItem {
  id: string;
  concept: string;
  content: string;
  source: string;
  sourceType: "Ontology" | "PDF";
  language: string;
  location: string;
}
