export type SourceType = "Ontology" | "PDF";
export type SourceStatus = "Ready" | "Analyzing" | "Analyzed" | "Error";

export interface SourceFile {
  id: string;
  file: File;
  name: string;
  type: SourceType;
  size: number;
  status: SourceStatus;
}

export interface AnalysisSummary {
  totalSources: number;
  ontologies: number;
  pdfDocuments: number;
  validSources: number;
}
