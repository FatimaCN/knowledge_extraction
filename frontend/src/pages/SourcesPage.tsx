import { useMemo, useState } from "react";
import { FileUploader } from "../components/FileUploader";
import type { AnalysisSummary, SourceFile } from "../types/source";

interface SourcesPageProps {
  initialSources: SourceFile[];
  onAnalysisCompleted: (sources: SourceFile[]) => void;
  onContinue: () => void;
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), 3);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

export function SourcesPage({
  initialSources,
  onAnalysisCompleted,
  onContinue,
}: SourcesPageProps) {
  const [sources, setSources] = useState<SourceFile[]>(initialSources);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisCompleted, setAnalysisCompleted] = useState(
    initialSources.length > 0,
  );

  const summary = useMemo<AnalysisSummary>(() => ({
    totalSources: sources.length,
    ontologies: sources.filter((source) => source.type === "Ontology").length,
    pdfDocuments: sources.filter((source) => source.type === "PDF").length,
    validSources: sources.filter((source) => source.status !== "Error").length,
  }), [sources]);

  const addFiles = (files: File[]) => {
    setAnalysisCompleted(false);
    setSources((current) => {
      const existing = new Set(current.map((source) => `${source.name}-${source.size}`));
      const newSources = files
        .filter((file) => !existing.has(`${file.name}-${file.size}`))
        .map<SourceFile>((file) => ({
          id: crypto.randomUUID(),
          file,
          name: file.name,
          type: file.name.toLowerCase().endsWith(".ttl") ? "Ontology" : "PDF",
          size: file.size,
          status: "Ready",
        }));
      return [...current, ...newSources];
    });
  };

  const removeSource = (id: string) => {
    setAnalysisCompleted(false);
    setSources((current) => current.filter((source) => source.id !== id));
  };

  const analyzeSources = async () => {
    if (sources.length === 0) return;
    setIsAnalyzing(true);
    setAnalysisCompleted(false);
    setSources((current) =>
      current.map((source) => ({ ...source, status: "Analyzing" })),
    );

    await new Promise((resolve) => window.setTimeout(resolve, 900));

    const analyzed = sources.map<SourceFile>((source) => ({
      ...source,
      status: "Analyzed",
    }));
    setSources(analyzed);
    setIsAnalyzing(false);
    setAnalysisCompleted(true);
    onAnalysisCompleted(analyzed);
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <span className="eyebrow">STEP 1 OF 5</span>
          <h1>Source analysis</h1>
          <p>
            Upload ontology and PDF sources, verify their formats, and prepare
            them for information extraction.
          </p>
        </div>
        <span className="project-badge">Active project · Knowledge POC</span>
      </header>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Add source files</h2>
            <p>Select one or more ontologies or PDF documents.</p>
          </div>
        </div>
        <FileUploader onFilesSelected={addFiles} />
      </section>

      {sources.length > 0 && (
        <section className="panel sources-panel">
          <div className="panel-heading">
            <div>
              <h2>Selected sources</h2>
              <p>{sources.length} file{sources.length === 1 ? "" : "s"} ready for analysis</p>
            </div>
            <button
              className="primary-button"
              type="button"
              disabled={isAnalyzing}
              onClick={analyzeSources}
            >
              {isAnalyzing ? "Analyzing…" : "Analyze sources"}
            </button>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Type</th>
                  <th>Size</th>
                  <th>Status</th>
                  <th><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {sources.map((source) => (
                  <tr key={source.id}>
                    <td>
                      <div className="file-name">
                        <span className={`file-icon ${source.type === "PDF" ? "pdf" : "ttl"}`}>
                          {source.type === "PDF" ? "PDF" : "TTL"}
                        </span>
                        <span>{source.name}</span>
                      </div>
                    </td>
                    <td>{source.type}</td>
                    <td>{formatBytes(source.size)}</td>
                    <td>
                      <span className={`status-pill ${source.status.toLowerCase()}`}>
                        {source.status === "Analyzing" && <span className="spinner" />}
                        {source.status}
                      </span>
                    </td>
                    <td className="action-cell">
                      <button
                        className="icon-button"
                        type="button"
                        aria-label={`Remove ${source.name}`}
                        disabled={isAnalyzing}
                        onClick={() => removeSource(source.id)}
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {analysisCompleted && (
        <section className="analysis-result" aria-live="polite">
          <div className="success-heading">
            <span className="success-check">✓</span>
            <div>
              <h2>Source analysis completed</h2>
              <p>All selected files are ready for information extraction.</p>
            </div>
          </div>

          <div className="metric-grid">
            <article className="metric-card">
              <span>Total sources</span>
              <strong>{summary.totalSources}</strong>
            </article>
            <article className="metric-card">
              <span>Ontologies</span>
              <strong>{summary.ontologies}</strong>
            </article>
            <article className="metric-card">
              <span>PDF documents</span>
              <strong>{summary.pdfDocuments}</strong>
            </article>
            <article className="metric-card">
              <span>Valid sources</span>
              <strong>{summary.validSources}</strong>
            </article>
          </div>

          <div className="next-step-note">
            <span>Next</span>
            <p>Continue to Step 2 to extract and normalize the source information.</p>
            <button type="button" onClick={onContinue}>
              Continue to extraction →
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
