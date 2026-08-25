export type EmbeddingModel =
  | "Sentence-Keno2Vec"
  | "all-MiniLM-L6-v2"
  | "paraphrase-multilingual-MiniLM-L12-v2";

export interface ClusterConfiguration {
  embeddingModel: EmbeddingModel;
  clusterCount: number;
  maxIterations: number;
  randomSeed: number;
  normalizeVectors: boolean;
}

export interface ClusterSummary {
  id: number;
  label: string;
  description: string;
  itemCount: number;
  color: string;
}

export type ClusteringPhase =
  | "idle"
  | "enriching"
  | "embedding"
  | "clustering"
  | "validation"
  | "done";
