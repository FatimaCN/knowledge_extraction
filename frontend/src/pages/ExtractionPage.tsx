import { useMemo, useState } from "react";
import type {
  ExtractedItem,
  ExtractionOptions,
  LanguageFilter,
} from "../types/extraction";
import type { SourceFile } from "../types/source";

interface ExtractionPageProps {
  sources: SourceFile[];
  initialItems: ExtractedItem[];
  onBack: () => void;
  onExtractionCompleted: (items: ExtractedItem[]) => void;
  onContinue: () => void;
}

const initialOptions: ExtractionOptions = {
  labels: true,
  definitions: true,
  hierarchy: true,
  relations: true,
  provenance: true,
  language: "All languages",
};

function createPreviewItems(sources: SourceFile[]): ExtractedItem[] {
  const ontology = sources.find((source) => source.type === "Ontology");
  const pdf = sources.find((source) => source.type === "PDF");
  const ontologyName = ontology?.name ?? "wdo.ttl";
  const pdfName = pdf?.name ?? "roof-inspection.pdf";

  return [
    {
      id: "item-001",
      concept: "WaterIngress",
      content: "Water penetration through the building envelope.",
      source: ontologyName,
      sourceType: "Ontology",
      language: "EN",
      location: "Class URI",
    },
    {
      id: "item-002",
      concept: "HighHumidity",
      content: "Présence d'une humidité élevée dans un élément de construction.",
      source: ontologyName,
      sourceType: "Ontology",
      language: "FR",
      location: "Class URI",
    },
    {
      id: "item-003",
      concept: "Roof inspection",
      content: "The inspection identified moisture close to the parapet junction.",
      source: pdfName,
      sourceType: "PDF",
      language: "EN",
      location: "Page 4",
    },
  ];
}

export function ExtractionPage({
  sources,
  initialItems,
  onBack,
  onExtractionCompleted,
  onContinue,
}: ExtractionPageProps) {
  const [options, setOptions] = useState(initialOptions);
  const [isExtracting, setIsExtracting] = useState(false);
  const [progress, setProgress] = useState(initialItems.length > 0 ? 100 : 0);
  const [items, setItems] = useState<ExtractedItem[]>(initialItems);

  const sourceCount = sources.length || 2;
  const ontologyCount =
    sources.filter((source) => source.type === "Ontology").length || 1;
  const pdfCount =
    sources.filter((source) => source.type === "PDF").length ||
    (sources.length === 0 ? 1 : 0);

  const filteredItems = useMemo(() => {
    if (options.language === "English") {
      return items.filter((item) => item.language === "EN");
    }
    if (options.language === "French") {
      return items.filter((item) => item.language === "FR");
    }
    return items;
  }, [items, options.language]);

  const toggleOption = (key: keyof Omit<ExtractionOptions, "language">) => {
    setOptions((current) => ({ ...current, [key]: !current[key] }));
  };

  const runExtraction = async () => {
    setIsExtracting(true);
    setItems([]);
    setProgress(18);
    await new Promise((resolve) => window.setTimeout(resolve, 350));
    setProgress(46);
    await new Promise((resolve) => window.setTimeout(resolve, 350));
    setProgress(76);
    await new Promise((resolve) => window.setTimeout(resolve, 350));
    setProgress(100);
    const extracted = createPreviewItems(sources);
    setItems(extracted);
    setIsExtracting(false);
    onExtractionCompleted(extracted);
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <button className="back-link" type="button" onClick={onBack}>
            ← Back to source analysis
          </button>
          <span className="eyebrow">STEP 2 OF 5</span>
          <h1>Information extraction</h1>
          <p>
            Choose the information to retrieve from each source and transform
            it into a common, traceable structure for clustering.
          </p>
        </div>
        <span className="project-badge">Active project · Knowledge POC</span>
      </header>

      <div className="extraction-layout">
        <div>
          <section className="panel">
            <div className="panel-heading">
              <div>
                <h2>Extraction configuration</h2>
                <p>Select the fields included in the normalized output.</p>
              </div>
              <span className="source-count">{sourceCount} sources</span>
            </div>

            <div className="option-grid">
              <label className="option-card">
                <input
                  type="checkbox"
                  checked={options.labels}
                  onChange={() => toggleOption("labels")}
                />
                <span className="custom-check">✓</span>
                <span>
                  <strong>Labels and concepts</strong>
                  <small>Class labels, titles and relevant terms</small>
                </span>
              </label>
              <label className="option-card">
                <input
                  type="checkbox"
                  checked={options.definitions}
                  onChange={() => toggleOption("definitions")}
                />
                <span className="custom-check">✓</span>
                <span>
                  <strong>Definitions and text</strong>
                  <small>Ontology definitions and PDF fragments</small>
                </span>
              </label>
              <label className="option-card">
                <input
                  type="checkbox"
                  checked={options.hierarchy}
                  onChange={() => toggleOption("hierarchy")}
                />
                <span className="custom-check">✓</span>
                <span>
                  <strong>Class hierarchy</strong>
                  <small>Superclasses and subclasses</small>
                </span>
              </label>
              <label className="option-card">
                <input
                  type="checkbox"
                  checked={options.relations}
                  onChange={() => toggleOption("relations")}
                />
                <span className="custom-check">✓</span>
                <span>
                  <strong>Semantic relations</strong>
                  <small>Properties and related concepts</small>
                </span>
              </label>
              <label className="option-card wide">
                <input
                  type="checkbox"
                  checked={options.provenance}
                  onChange={() => toggleOption("provenance")}
                />
                <span className="custom-check">✓</span>
                <span>
                  <strong>Source provenance</strong>
                  <small>Original filename, class URI or PDF page</small>
                </span>
              </label>
            </div>

            <div className="language-row">
              <div>
                <strong>Definition language</strong>
                <small>Filter extracted definitions by declared language.</small>
              </div>
              <select
                value={options.language}
                onChange={(event) =>
                  setOptions((current) => ({
                    ...current,
                    language: event.target.value as LanguageFilter,
                  }))
                }
              >
                <option>All languages</option>
                <option>English</option>
                <option>French</option>
              </select>
            </div>
          </section>

          <section className="panel extraction-action">
            <div>
              <h2>Ready to extract</h2>
              <p>
                The frontend currently simulates the process. This action will
                later call the FastAPI extraction endpoint.
              </p>
            </div>
            <button
              className="primary-button"
              type="button"
              disabled={isExtracting}
              onClick={runExtraction}
            >
              {isExtracting ? "Extracting…" : "Run extraction"}
            </button>

            {(isExtracting || progress === 100) && (
              <div className="progress-area" aria-live="polite">
                <div className="progress-copy">
                  <span>{isExtracting ? "Processing sources" : "Extraction completed"}</span>
                  <strong>{progress}%</strong>
                </div>
                <div className="progress-track">
                  <span style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
          </section>
        </div>

        <aside className="source-summary-card">
          <span className="summary-icon">⇥</span>
          <h2>Input summary</h2>
          <p>Sources approved in the previous stage.</p>
          <dl>
            <div>
              <dt>Total sources</dt>
              <dd>{sourceCount}</dd>
            </div>
            <div>
              <dt>Ontologies</dt>
              <dd>{ontologyCount}</dd>
            </div>
            <div>
              <dt>PDF documents</dt>
              <dd>{pdfCount}</dd>
            </div>
          </dl>
          <button className="text-button" type="button" onClick={onBack}>
            Review source files
          </button>
        </aside>
      </div>

      {items.length > 0 && (
        <section className="panel results-panel">
          <div className="panel-heading">
            <div>
              <span className="result-label">NORMALIZED OUTPUT</span>
              <h2>Extraction results</h2>
              <p>Preview of the common format sent to cluster generation.</p>
            </div>
            <button className="secondary-button" type="button">
              Export JSON
            </button>
          </div>

          <div className="metric-grid extraction-metrics">
            <article className="metric-card">
              <span>Extracted items</span>
              <strong>37</strong>
            </article>
            <article className="metric-card">
              <span>Ontology classes</span>
              <strong>29</strong>
            </article>
            <article className="metric-card">
              <span>PDF fragments</span>
              <strong>8</strong>
            </article>
            <article className="metric-card">
              <span>With provenance</span>
              <strong>100%</strong>
            </article>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Concept</th>
                  <th>Normalized content</th>
                  <th>Source</th>
                  <th>Language</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td><code>{item.id}</code></td>
                    <td><strong className="concept-name">{item.concept}</strong></td>
                    <td className="content-cell">{item.content}</td>
                    <td>
                      <div className="file-name">
                        <span className={`file-icon ${item.sourceType === "PDF" ? "pdf" : "ttl"}`}>
                          {item.sourceType === "PDF" ? "PDF" : "TTL"}
                        </span>
                        <span>{item.source}</span>
                      </div>
                    </td>
                    <td><span className="language-pill">{item.language}</span></td>
                    <td>{item.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="next-step-note extraction-next">
            <span>Next</span>
            <p>The normalized collection is ready for embedding and cluster generation.</p>
            <button type="button" onClick={onContinue}>
              Continue to clustering →
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
