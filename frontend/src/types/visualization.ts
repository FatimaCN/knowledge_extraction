export type ClusterSourceType = "ontology" | "pdf";

export interface ClusterPoint {
  id: string;
  concept: string;
  clusterId: number;
  sourceType: ClusterSourceType;
  sourceName: string;
  content: string;
  language: "EN" | "FR";
  isNew: boolean;
  distanceToCentroid: number;
  x: number;
  y: number;
  uri?: string;
  page?: number;
}

export interface ClusterView {
  id: number;
  label: string;
  description: string;
  color: string;
  representativeTerms: string[];
}
