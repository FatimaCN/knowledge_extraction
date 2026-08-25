export type QuestionSourceFilter = "all" | "ontology" | "pdf";
export type AnswerDetail = "concise" | "detailed";

export interface AnswerEvidence {
  id: string;
  title: string;
  excerpt: string;
  sourceName: string;
  sourceType: Exclude<QuestionSourceFilter, "all">;
  clusterId: number;
  location: string;
  uri?: string;
  relevance: number;
  isNew?: boolean;
}

export interface SystemAnswer {
  id: string;
  question: string;
  answer: string;
  clustersConsulted: number[];
  conceptsUsed: string[];
  confidence: number;
  generatedAt: string;
  evidence: AnswerEvidence[];
}

export interface QuestionHistoryItem {
  id: string;
  question: string;
  timestamp: string;
  clusterLabel: string;
}
