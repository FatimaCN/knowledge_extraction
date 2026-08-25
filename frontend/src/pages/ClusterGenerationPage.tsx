import { useMemo, useState } from "react";
import type {
  ClusterConfiguration,
  ClusterSummary,
  ClusteringPhase,
  EmbeddingModel,
} from "../types/clustering";

interface ClusterGenerationPageProps {
  extractedItemCount: number;
  onBack: () => void;
  onClusteringCompleted: () => void;
  onContinue: () => void;
}

const initialConfiguration: ClusterConfiguration = {
  embeddingModel: "Sentence-Keno2Vec",
  clusterCount: 5,
  maxIterations: 300,
  randomSeed: 42,
  normalizeVectors: true,
};

const demoClusters: ClusterSummary[] = [
  {
    id: 0,
    label: "Components & materials",
    description: "Construction components, layers and material concepts",
    itemCount: 9,
    color: "#2f8f80",
  },
  {
    id: 1,
    label: "Elements & multiplicity",
    description: "Building elements and concepts involving multiple objects",
    itemCount: 7,
    color: "#537fc0",
  },
  {
    id: 2,
    label: "Connections & groups",
    description: "Connected elements, assemblies and grouped entities",
    itemCount: 6,
    color: "#8a68bd",
  },
  {
    id: 3,
    label: "Geometry & parts",
    description: "Spatial, geometric and part-whole information",
    itemCount: 8,
    color: "#dc8b4b",
  },
  {
    id: 4,
    label: "Classification & structure",
    description: "Classification systems and structural descriptions",
    itemCount: 7,
    color: "#cb5f79",
  },
];

const phaseCopy: Record<ClusteringPhase, string> = {
  idle: "Ready to generate clusters",
  enriching: "Building enriched textual descriptions",
  embedding: "Generating semantic vectors",
  clustering: "Grouping vectors with K-means",
  validation: "Calculating validation metrics",
  done: "Cluster generation completed",
};

export function ClusterGenerationPage({
  extractedItemCount,
  onBack,
  onClusteringCompleted,
  onContinue,
}: ClusterGenerationPageProps) {
  const [configuration, setConfiguration] =
    useState<ClusterConfiguration>(initialConfiguration);
  const [phase, setPhase] = useState<ClusteringPhase>("idle");
  const [progress, setProgress] = useState(0);
  const [clusters, setClusters] = useState<ClusterSummary[]>([]);

  const isProcessing = !["idle", "done"].includes(phase);
  const totalItems = extractedItemCount || 37;
  const largestCluster = useMemo(
    () => Math.max(...demoClusters.map((cluster) => cluster.itemCount)),
    [],
  );

  const wait = (milliseconds: number) =>
    new Promise((resolve) => window.setTimeout(resolve, milliseconds));

  const runClustering = async () => {
    setClusters([]);
    setPhase("enriching");
    setProgress(14);
    await wait(420);

    setPhase("embedding");
    setProgress(38);
    await wait(520);

    setPhase("clustering");
    setProgress(68);
    await wait(480);

    setPhase("validation");
    setProgress(88);
    await wait(420);

    setProgress(100);
    setClusters(demoClusters.slice(0, configuration.clusterCount));
    setPhase("done");
    onClusteringCompleted();
  };

  const updateNumber = (
    key: "clusterCount" | "maxIterations" | "randomSeed",
    value: number,
  ) => {
    setConfiguration((current) => ({ ...current, [key]: value }));
    if (phase === "done") {
      setPhase("idle");
      setProgress(0);
      setClusters([]);
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <button className="back-link" type="button" onClick={onBack}>
            ← Back to information extraction
          </button>
          <span className="eyebrow">STEP 3 OF 5</span>
          <h1>Cluster generation</h1>
          <p>
            Transform the normalized information into semantic vectors, group
            related concepts, and evaluate the quality of the resulting
            clusters.
          </p>
        </div>
        <span className="project-badge">Active project · Knowledge POC</span>
      </header>

      <section className="pipeline-panel" aria-label="Clustering pipeline">
        <div className="pipeline-step complete">
          <span>1</span>
          <div>
            <strong>Normalized items</strong>
            <small>{totalItems} records prepared</small>
          </div>
        </div>
        <i aria-hidden="true">→</i>
        <div className={`pipeline-step ${phase !== "idle" ? "active" : ""}`}>
          <span>2</span>
          <div>
            <strong>Enrichment</strong>
            <small>Category-aware text</small>
          </div>
        </div>
        <i aria-hidden="true">→</i>
        <div
          className={`pipeline-step ${
            ["embedding", "clustering", "validation", "done"].includes(phase)
              ? "active"
              : ""
          }`}
        >
          <span>3</span>
          <div>
            <strong>Embeddings</strong>
            <small>Vector per item</small>
          </div>
        </div>
        <i aria-hidden="true">→</i>
        <div
          className={`pipeline-step ${
            ["clustering", "validation", "done"].includes(phase) ? "active" : ""
          }`}
        >
          <span>4</span>
          <div>
            <strong>K-means</strong>
            <small>Semantic grouping</small>
          </div>
        </div>
        <i aria-hidden="true">→</i>
        <div
          className={`pipeline-step ${
            ["validation", "done"].includes(phase) ? "active" : ""
          }`}
        >
          <span>5</span>
          <div>
            <strong>Validation</strong>
            <small>Quality metrics</small>
          </div>
        </div>
      </section>

      <div className="clustering-layout">
        <div>
          <section className="panel">
            <div className="panel-heading">
              <div>
                <h2>Model configuration</h2>
                <p>Define how the semantic representation will be generated.</p>
              </div>
              <span className="configuration-badge">Experiment 01</span>
            </div>

            <div className="configuration-grid">
              <label className="field-control wide">
                <span>Embedding model</span>
                <select
                  value={configuration.embeddingModel}
                  disabled={isProcessing}
                  onChange={(event) =>
                    setConfiguration((current) => ({
                      ...current,
                      embeddingModel: event.target.value as EmbeddingModel,
                    }))
                  }
                >
                  <option>Sentence-Keno2Vec</option>
                  <option>all-MiniLM-L6-v2</option>
                  <option>paraphrase-multilingual-MiniLM-L12-v2</option>
                </select>
                <small>
                  Sentence-Keno2Vec uses enriched class descriptions and
                  category-aware fine-tuning.
                </small>
              </label>

              <label className="field-control">
                <span>Clustering algorithm</span>
                <select disabled value="K-means">
                  <option>K-means</option>
                </select>
              </label>

              <label className="field-control">
                <span>Number of clusters (k)</span>
                <div className="range-control">
                  <input
                    type="range"
                    min="2"
                    max="8"
                    value={configuration.clusterCount}
                    disabled={isProcessing}
                    onChange={(event) =>
                      updateNumber("clusterCount", Number(event.target.value))
                    }
                  />
                  <output>{configuration.clusterCount}</output>
                </div>
              </label>

              <label className="field-control">
                <span>Maximum iterations</span>
                <input
                  type="number"
                  min="50"
                  max="1000"
                  step="50"
                  value={configuration.maxIterations}
                  disabled={isProcessing}
                  onChange={(event) =>
                    updateNumber("maxIterations", Number(event.target.value))
                  }
                />
              </label>

              <label className="field-control">
                <span>Random seed</span>
                <input
                  type="number"
                  value={configuration.randomSeed}
                  disabled={isProcessing}
                  onChange={(event) =>
                    updateNumber("randomSeed", Number(event.target.value))
                  }
                />
              </label>

              <label className="toggle-control wide">
                <input
                  type="checkbox"
                  checked={configuration.normalizeVectors}
                  disabled={isProcessing}
                  onChange={(event) =>
                    setConfiguration((current) => ({
                      ...current,
                      normalizeVectors: event.target.checked,
                    }))
                  }
                />
                <span className="toggle-track" aria-hidden="true">
                  <span />
                </span>
                <span>
                  <strong>Normalize embedding vectors</strong>
                  <small>
                    Recommended for comparing semantic distance consistently.
                  </small>
                </span>
              </label>
            </div>
          </section>

          <section className="panel generation-action">
            <div>
              <h2>{phaseCopy[phase]}</h2>
              <p>
                {phase === "idle"
                  ? "Review the experiment settings and start the clustering pipeline."
                  : phase === "done"
                    ? `${configuration.clusterCount} clusters are ready for review.`
                    : "The demonstration is processing the normalized collection."}
              </p>
            </div>
            <button
              className="primary-button"
              type="button"
              disabled={isProcessing}
              onClick={runClustering}
            >
              {isProcessing
                ? "Generating…"
                : phase === "done"
                  ? "Run again"
                  : "Generate clusters"}
            </button>

            {(isProcessing || phase === "done") && (
              <div className="progress-area" aria-live="polite">
                <div className="progress-copy">
                  <span>{phaseCopy[phase]}</span>
                  <strong>{progress}%</strong>
                </div>
                <div className="progress-track">
                  <span style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
          </section>
        </div>

        <aside className="source-summary-card cluster-input-card">
          <span className="summary-icon">◎</span>
          <h2>Clustering input</h2>
          <p>Normalized information received from Step 2.</p>
          <dl>
            <div>
              <dt>Normalized items</dt>
              <dd>{totalItems}</dd>
            </div>
            <div>
              <dt>Ontology classes</dt>
              <dd>29</dd>
            </div>
            <div>
              <dt>PDF fragments</dt>
              <dd>8</dd>
            </div>
          </dl>
          <div className="input-ready">
            <span>✓</span>
            Provenance preserved
          </div>
          <button className="text-button" type="button" onClick={onBack}>
            Review extracted items
          </button>
        </aside>
      </div>

      {clusters.length > 0 && (
        <section className="panel cluster-results">
          <div className="panel-heading">
            <div>
              <span className="result-label">EXPERIMENT RESULTS</span>
              <h2>Cluster evaluation</h2>
              <p>
                Validation metrics and distribution of the generated semantic
                groups.
              </p>
            </div>
            <button className="secondary-button" type="button">
              Export results
            </button>
          </div>

          <div className="metric-grid clustering-metrics">
            <article className="metric-card metric-highlight">
              <span>Generated clusters</span>
              <strong>{configuration.clusterCount}</strong>
              <small>k selected by the user</small>
            </article>
            <article className="metric-card">
              <span>Silhouette score</span>
              <strong>0.3070</strong>
              <small>Higher values indicate better separation</small>
            </article>
            <article className="metric-card">
              <span>Davies–Bouldin</span>
              <strong>1.0241</strong>
              <small>Lower values indicate better separation</small>
            </article>
            <article className="metric-card">
              <span>Clustered items</span>
              <strong>{totalItems}</strong>
              <small>100% of normalized records</small>
            </article>
          </div>

          <div className="cluster-distribution">
            <div className="distribution-heading">
              <div>
                <h3>Cluster distribution</h3>
                <p>Preliminary labels derived from representative concepts.</p>
              </div>
              <span>{totalItems} items total</span>
            </div>

            <div className="cluster-list">
              {clusters.map((cluster) => (
                <article className="cluster-row" key={cluster.id}>
                  <span
                    className="cluster-id"
                    style={{ backgroundColor: cluster.color }}
                  >
                    C{cluster.id}
                  </span>
                  <div className="cluster-copy">
                    <strong>{cluster.label}</strong>
                    <small>{cluster.description}</small>
                  </div>
                  <div className="cluster-bar" aria-hidden="true">
                    <span
                      style={{
                        backgroundColor: cluster.color,
                        width: `${(cluster.itemCount / largestCluster) * 100}%`,
                      }}
                    />
                  </div>
                  <strong className="cluster-count">
                    {cluster.itemCount}
                    <small> items</small>
                  </strong>
                </article>
              ))}
            </div>
          </div>

          <div className="next-step-note clustering-next">
            <span>Next</span>
            <p>
              Continue to Step 4 to visualize the clusters and inspect where
              newly added information was assigned.
            </p>
            <button
              type="button"
              onClick={onContinue}
            >
              Continue to visualization →
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
