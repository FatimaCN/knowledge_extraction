import { useMemo, useState } from "react";
import type {
  ClusterPoint,
  ClusterSourceType,
  ClusterView,
} from "../types/visualization";

interface ClusterVisualizationPageProps {
  onBack: () => void;
  onContinue: () => void;
}

type SourceFilter = "all" | ClusterSourceType;

const clusters: ClusterView[] = [
  {
    id: 0,
    label: "Components & materials",
    description: "Construction components, layers and material concepts",
    color: "#2f8f80",
    representativeTerms: ["layer", "material", "component"],
  },
  {
    id: 1,
    label: "Elements & multiplicity",
    description: "Building elements and concepts involving multiple objects",
    color: "#537fc0",
    representativeTerms: ["element", "multiple", "assembly"],
  },
  {
    id: 2,
    label: "Connections & groups",
    description: "Connected elements, assemblies and grouped entities",
    color: "#8a68bd",
    representativeTerms: ["connected", "group", "interface"],
  },
  {
    id: 3,
    label: "Geometry & parts",
    description: "Spatial, geometric and part-whole information",
    color: "#dc8b4b",
    representativeTerms: ["geometry", "part", "spatial"],
  },
  {
    id: 4,
    label: "Classification & structure",
    description: "Classification systems and structural descriptions",
    color: "#cb5f79",
    representativeTerms: ["classification", "structure", "type"],
  },
];

const points: ClusterPoint[] = [
  {
    id: "c0-1",
    concept: "WaterproofingLayer",
    clusterId: 0,
    sourceType: "ontology",
    sourceName: "fro.ttl",
    content:
      "A continuous layer that prevents water from penetrating the roof construction.",
    language: "EN",
    isNew: true,
    distanceToCentroid: 0.12,
    x: 19,
    y: 26,
    uri: "https://example.org/fro#WaterproofingLayer",
  },
  {
    id: "c0-2",
    concept: "InsulationLayer",
    clusterId: 0,
    sourceType: "ontology",
    sourceName: "fro.ttl",
    content:
      "A layer used to reduce heat transfer through a building envelope.",
    language: "EN",
    isNew: false,
    distanceToCentroid: 0.18,
    x: 25,
    y: 20,
    uri: "https://example.org/fro#InsulationLayer",
  },
  {
    id: "c0-3",
    concept: "ProtectionLayer",
    clusterId: 0,
    sourceType: "ontology",
    sourceName: "fro.ttl",
    content:
      "A protective component installed above the waterproofing system.",
    language: "EN",
    isNew: false,
    distanceToCentroid: 0.21,
    x: 29,
    y: 29,
    uri: "https://example.org/fro#ProtectionLayer",
  },
  {
    id: "c0-4",
    concept: "VapourBarrierLayer",
    clusterId: 0,
    sourceType: "ontology",
    sourceName: "fro.ttl",
    content:
      "A material layer designed to limit water-vapour diffusion.",
    language: "EN",
    isNew: true,
    distanceToCentroid: 0.24,
    x: 21,
    y: 35,
    uri: "https://example.org/fro#VapourBarrierLayer",
  },
  {
    id: "c0-5",
    concept: "Roof membrane",
    clusterId: 0,
    sourceType: "pdf",
    sourceName: "flat-roof-guide.pdf",
    content:
      "The membrane must remain continuous at every penetration and perimeter.",
    language: "EN",
    isNew: false,
    distanceToCentroid: 0.31,
    x: 32,
    y: 36,
    page: 14,
  },
  {
    id: "c1-1",
    concept: "BuildingElement",
    clusterId: 1,
    sourceType: "ontology",
    sourceName: "bot.ttl",
    content:
      "A constituent of a building with a characteristic technical function.",
    language: "EN",
    isNew: false,
    distanceToCentroid: 0.16,
    x: 66,
    y: 19,
    uri: "https://example.org/bot#BuildingElement",
  },
  {
    id: "c1-2",
    concept: "ChimneyStack",
    clusterId: 1,
    sourceType: "ontology",
    sourceName: "fro.ttl",
    content:
      "The visible part of a chimney that projects above a roof surface.",
    language: "EN",
    isNew: true,
    distanceToCentroid: 0.23,
    x: 72,
    y: 25,
    uri: "https://example.org/fro#ChimneyStack",
  },
  {
    id: "c1-3",
    concept: "Kiosk",
    clusterId: 1,
    sourceType: "ontology",
    sourceName: "fro.ttl",
    content:
      "A small construction element installed above a flat-roof assembly.",
    language: "EN",
    isNew: false,
    distanceToCentroid: 0.27,
    x: 79,
    y: 20,
    uri: "https://example.org/fro#Kiosk",
  },
  {
    id: "c1-4",
    concept: "Multiple roof elements",
    clusterId: 1,
    sourceType: "pdf",
    sourceName: "roof-elements.pdf",
    content:
      "Roof systems may contain repeated units connected through modular joints.",
    language: "EN",
    isNew: false,
    distanceToCentroid: 0.34,
    x: 75,
    y: 34,
    page: 7,
  },
  {
    id: "c2-1",
    concept: "Interface",
    clusterId: 2,
    sourceType: "ontology",
    sourceName: "bpo.ttl",
    content:
      "A shared boundary through which two construction objects are connected.",
    language: "EN",
    isNew: false,
    distanceToCentroid: 0.14,
    x: 49,
    y: 47,
    uri: "https://example.org/bpo#Interface",
  },
  {
    id: "c2-2",
    concept: "ConnectedElement",
    clusterId: 2,
    sourceType: "ontology",
    sourceName: "bpo.ttl",
    content:
      "An element participating in an explicit construction connection.",
    language: "EN",
    isNew: true,
    distanceToCentroid: 0.2,
    x: 55,
    y: 53,
    uri: "https://example.org/bpo#ConnectedElement",
  },
  {
    id: "c2-3",
    concept: "ElementGroup",
    clusterId: 2,
    sourceType: "ontology",
    sourceName: "wdo.ttl",
    content:
      "A collection of elements treated as a coherent functional group.",
    language: "EN",
    isNew: false,
    distanceToCentroid: 0.29,
    x: 45,
    y: 57,
    uri: "https://example.org/wdo#ElementGroup",
  },
  {
    id: "c2-4",
    concept: "Joint continuity",
    clusterId: 2,
    sourceType: "pdf",
    sourceName: "connection-details.pdf",
    content:
      "Joints are grouped by their continuity and the elements they connect.",
    language: "EN",
    isNew: false,
    distanceToCentroid: 0.32,
    x: 58,
    y: 43,
    page: 22,
  },
  {
    id: "c3-1",
    concept: "BuildingZone",
    clusterId: 3,
    sourceType: "ontology",
    sourceName: "bot.ttl",
    content:
      "A part of the physical world or a virtual spatial region.",
    language: "EN",
    isNew: false,
    distanceToCentroid: 0.15,
    x: 22,
    y: 68,
    uri: "https://example.org/bot#Zone",
  },
  {
    id: "c3-2",
    concept: "Upstand",
    clusterId: 3,
    sourceType: "ontology",
    sourceName: "fro.ttl",
    content:
      "A raised part at a roof edge or penetration used for waterproofing.",
    language: "EN",
    isNew: true,
    distanceToCentroid: 0.19,
    x: 28,
    y: 75,
    uri: "https://example.org/fro#Upstand",
  },
  {
    id: "c3-3",
    concept: "Skydome",
    clusterId: 3,
    sourceType: "ontology",
    sourceName: "fro.ttl",
    content:
      "A roof opening component whose geometry projects above the roof plane.",
    language: "EN",
    isNew: false,
    distanceToCentroid: 0.25,
    x: 35,
    y: 69,
    uri: "https://example.org/fro#Skydome",
  },
  {
    id: "c3-4",
    concept: "Parapet edge",
    clusterId: 3,
    sourceType: "pdf",
    sourceName: "flat-roof-guide.pdf",
    content:
      "The parapet defines a vertical perimeter and forms part of the roof geometry.",
    language: "EN",
    isNew: false,
    distanceToCentroid: 0.3,
    x: 18,
    y: 81,
    page: 31,
  },
  {
    id: "c3-5",
    concept: "SpatialRegion",
    clusterId: 3,
    sourceType: "ontology",
    sourceName: "bot.ttl",
    content:
      "A spatial extent used to locate building components and zones.",
    language: "EN",
    isNew: false,
    distanceToCentroid: 0.34,
    x: 38,
    y: 80,
    uri: "https://example.org/bot#SpatialRegion",
  },
  {
    id: "c4-1",
    concept: "ConstructionType",
    clusterId: 4,
    sourceType: "ontology",
    sourceName: "fro.ttl",
    content:
      "A classification describing the composition of a flat-roof construction.",
    language: "EN",
    isNew: false,
    distanceToCentroid: 0.17,
    x: 68,
    y: 68,
    uri: "https://example.org/fro#ConstructionType",
  },
  {
    id: "c4-2",
    concept: "UpstandType",
    clusterId: 4,
    sourceType: "ontology",
    sourceName: "fro.ttl",
    content:
      "A category used to distinguish construction solutions for upstands.",
    language: "EN",
    isNew: true,
    distanceToCentroid: 0.22,
    x: 74,
    y: 75,
    uri: "https://example.org/fro#UpstandType",
  },
  {
    id: "c4-3",
    concept: "ClassificationCode",
    clusterId: 4,
    sourceType: "ontology",
    sourceName: "wdo.ttl",
    content:
      "An identifier assigned to a concept within a classification system.",
    language: "EN",
    isNew: false,
    distanceToCentroid: 0.26,
    x: 82,
    y: 69,
    uri: "https://example.org/wdo#ClassificationCode",
  },
  {
    id: "c4-4",
    concept: "Roof typology",
    clusterId: 4,
    sourceType: "pdf",
    sourceName: "roof-elements.pdf",
    content:
      "Flat roofs are classified by structure, accessibility and protection type.",
    language: "EN",
    isNew: false,
    distanceToCentroid: 0.33,
    x: 78,
    y: 82,
    page: 4,
  },
];

export function ClusterVisualizationPage({
  onBack,
  onContinue,
}: ClusterVisualizationPageProps) {
  const [selectedCluster, setSelectedCluster] = useState<number | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [newOnly, setNewOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedPointId, setSelectedPointId] = useState("c0-1");

  const filteredPoints = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return points.filter((point) => {
      const matchesCluster =
        selectedCluster === "all" || point.clusterId === selectedCluster;
      const matchesSource =
        sourceFilter === "all" || point.sourceType === sourceFilter;
      const matchesNew = !newOnly || point.isNew;
      const matchesQuery =
        !normalizedQuery ||
        point.concept.toLowerCase().includes(normalizedQuery) ||
        point.content.toLowerCase().includes(normalizedQuery) ||
        point.sourceName.toLowerCase().includes(normalizedQuery);
      return matchesCluster && matchesSource && matchesNew && matchesQuery;
    });
  }, [newOnly, query, selectedCluster, sourceFilter]);

  const selectedPoint =
    points.find((point) => point.id === selectedPointId) ?? filteredPoints[0];

  const visibleClusterIds = new Set(
    filteredPoints.map((point) => point.clusterId),
  );

  const exportMap = () => {
    const blob = new Blob([JSON.stringify(filteredPoints, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "cluster-visualization.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const chooseCluster = (clusterId: number | "all") => {
    setSelectedCluster(clusterId);
    const firstMatch =
      clusterId === "all"
        ? points[0]
        : points.find((point) => point.clusterId === clusterId);
    if (firstMatch) {
      setSelectedPointId(firstMatch.id);
    }
  };

  return (
    <div className="page-container visualization-page">
      <header className="page-header visualization-header">
        <div>
          <button className="back-link" type="button" onClick={onBack}>
            ← Back to cluster generation
          </button>
          <span className="eyebrow">STEP 4 OF 5</span>
          <h1>Cluster visualization</h1>
          <p>
            Explore the resulting semantic groups, identify where newly added
            information was assigned, and inspect every item with its original
            provenance.
          </p>
        </div>
        <div className="header-actions">
          <span className="project-badge">Experiment 01 · k = 5</span>
          <button className="secondary-button" type="button" onClick={exportMap}>
            Export map
          </button>
        </div>
      </header>

      <section className="visualization-metrics" aria-label="Visualization summary">
        <article>
          <span className="summary-symbol cluster-symbol">◉</span>
          <div>
            <strong>5</strong>
            <small>Semantic clusters</small>
          </div>
        </article>
        <article>
          <span className="summary-symbol item-symbol">◆</span>
          <div>
            <strong>37</strong>
            <small>Clustered items</small>
          </div>
        </article>
        <article>
          <span className="summary-symbol new-symbol">+</span>
          <div>
            <strong>6</strong>
            <small>Newly added items</small>
          </div>
        </article>
        <article>
          <span className="summary-symbol source-symbol">⌘</span>
          <div>
            <strong>5</strong>
            <small>Source files represented</small>
          </div>
        </article>
      </section>

      <section className="panel visualization-toolbar">
        <div className="cluster-tabs" aria-label="Filter by cluster">
          <button
            className={selectedCluster === "all" ? "selected" : ""}
            type="button"
            onClick={() => chooseCluster("all")}
          >
            All clusters <span>37</span>
          </button>
          {clusters.map((cluster) => (
            <button
              className={selectedCluster === cluster.id ? "selected" : ""}
              key={cluster.id}
              type="button"
              onClick={() => chooseCluster(cluster.id)}
            >
              <i style={{ backgroundColor: cluster.color }} />
              C{cluster.id} <span>{points.filter((point) => point.clusterId === cluster.id).length}</span>
            </button>
          ))}
        </div>

        <div className="filter-controls">
          <label className="search-control">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={query}
              placeholder="Search concepts or sources"
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <label>
            <span className="sr-only">Source type</span>
            <select
              value={sourceFilter}
              onChange={(event) =>
                setSourceFilter(event.target.value as SourceFilter)
              }
            >
              <option value="all">All sources</option>
              <option value="ontology">Ontologies</option>
              <option value="pdf">PDF documents</option>
            </select>
          </label>
          <label className="new-only-control">
            <input
              type="checkbox"
              checked={newOnly}
              onChange={(event) => setNewOnly(event.target.checked)}
            />
            <span>New items only</span>
          </label>
        </div>
      </section>

      <div className="visualization-layout">
        <section className="panel cluster-map-panel">
          <div className="panel-heading map-heading">
            <div>
              <h2>Semantic cluster map</h2>
              <p>
                Two-dimensional projection of the embeddings. Select a point to
                inspect its content.
              </p>
            </div>
            <div className="map-legend">
              <span><i className="legend-dot ontology" /> Ontology</span>
              <span><i className="legend-dot pdf" /> PDF</span>
              <span><i className="legend-dot new" /> Newly added</span>
            </div>
          </div>

          <div className="cluster-map" role="group" aria-label="Semantic cluster projection">
            <span className="axis-label axis-y">Semantic dimension 2</span>
            <span className="axis-label axis-x">Semantic dimension 1</span>
            <div className="map-grid" aria-hidden="true" />

            {clusters.map((cluster) => {
              const clusterPoints = filteredPoints.filter(
                (point) => point.clusterId === cluster.id,
              );
              if (clusterPoints.length === 0) return null;
              const centerX =
                clusterPoints.reduce((total, point) => total + point.x, 0) /
                clusterPoints.length;
              const centerY =
                clusterPoints.reduce((total, point) => total + point.y, 0) /
                clusterPoints.length;
              return (
                <span
                  className="cluster-map-label"
                  key={cluster.id}
                  style={{
                    left: `${centerX}%`,
                    top: `${centerY - 9}%`,
                    color: cluster.color,
                  }}
                >
                  C{cluster.id}
                </span>
              );
            })}

            {filteredPoints.map((point) => {
              const cluster = clusters[point.clusterId];
              return (
                <button
                  className={`map-point ${point.sourceType} ${
                    point.isNew ? "new" : ""
                  } ${selectedPoint?.id === point.id ? "active" : ""}`}
                  key={point.id}
                  type="button"
                  title={`${point.concept} · ${point.sourceName}`}
                  aria-label={`${point.concept}, cluster ${point.clusterId}`}
                  style={{
                    left: `${point.x}%`,
                    top: `${point.y}%`,
                    backgroundColor:
                      point.sourceType === "ontology" ? cluster.color : "#ffffff",
                    borderColor: cluster.color,
                  }}
                  onClick={() => {
                    setSelectedPointId(point.id);
                    setSelectedCluster(point.clusterId);
                  }}
                >
                  {point.isNew && <span>+</span>}
                </button>
              );
            })}

            {filteredPoints.length === 0 && (
              <div className="map-empty">
                <strong>No items match these filters</strong>
                <span>Adjust the cluster, source, or search selection.</span>
              </div>
            )}
          </div>

          <div className="map-footer">
            <span>Showing {filteredPoints.length} representative items</span>
            <span>The position is illustrative until FastAPI returns UMAP coordinates.</span>
          </div>
        </section>

        <aside className="panel item-detail-panel">
          {selectedPoint && visibleClusterIds.has(selectedPoint.clusterId) ? (
            <>
              <div className="detail-heading">
                <span
                  className="cluster-id"
                  style={{ backgroundColor: clusters[selectedPoint.clusterId].color }}
                >
                  C{selectedPoint.clusterId}
                </span>
                <div>
                  <span className="result-label">SELECTED ITEM</span>
                  <h2>{selectedPoint.concept}</h2>
                </div>
              </div>

              <div className="detail-badges">
                <span className={`source-kind ${selectedPoint.sourceType}`}>
                  {selectedPoint.sourceType === "ontology" ? "TTL" : "PDF"}
                </span>
                {selectedPoint.isNew && <span className="new-item-badge">Newly added</span>}
                <span>{selectedPoint.language}</span>
              </div>

              <div className="detail-section">
                <span>Cluster assignment</span>
                <strong>{clusters[selectedPoint.clusterId].label}</strong>
                <p>{clusters[selectedPoint.clusterId].description}</p>
              </div>

              <div className="detail-section">
                <span>Extracted content</span>
                <p className="detail-content">“{selectedPoint.content}”</p>
              </div>

              <dl className="item-metadata">
                <div>
                  <dt>Source</dt>
                  <dd>{selectedPoint.sourceName}</dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>
                    {selectedPoint.page
                      ? `Page ${selectedPoint.page}`
                      : selectedPoint.uri?.split("#").pop()}
                  </dd>
                </div>
                <div>
                  <dt>Centroid distance</dt>
                  <dd>{selectedPoint.distanceToCentroid.toFixed(2)}</dd>
                </div>
              </dl>

              <div className="confidence-block">
                <div>
                  <span>Assignment confidence</span>
                  <strong>
                    {Math.round((1 - selectedPoint.distanceToCentroid) * 100)}%
                  </strong>
                </div>
                <div className="confidence-track">
                  <span
                    style={{
                      width: `${(1 - selectedPoint.distanceToCentroid) * 100}%`,
                      backgroundColor: clusters[selectedPoint.clusterId].color,
                    }}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="detail-empty">
              <span>◎</span>
              <strong>Select a map point</strong>
              <p>Item details and provenance will appear here.</p>
            </div>
          )}
        </aside>
      </div>

      <section className="panel cluster-browser">
        <div className="panel-heading">
          <div>
            <span className="result-label">CLUSTER CONTENT</span>
            <h2>
              {selectedCluster === "all"
                ? "All visible cluster items"
                : `C${selectedCluster} · ${clusters[selectedCluster].label}`}
            </h2>
            <p>Review concepts, original sources, and newly incorporated information.</p>
          </div>
          <span className="visible-count">{filteredPoints.length} visible items</span>
        </div>

        <div className="cluster-content-grid">
          {clusters
            .filter(
              (cluster) =>
                (selectedCluster === "all" || selectedCluster === cluster.id) &&
                filteredPoints.some((point) => point.clusterId === cluster.id),
            )
            .map((cluster) => {
              const items = filteredPoints.filter(
                (point) => point.clusterId === cluster.id,
              );
              return (
                <article className="cluster-content-card" key={cluster.id}>
                  <header style={{ borderTopColor: cluster.color }}>
                    <div>
                      <span style={{ color: cluster.color }}>CLUSTER {cluster.id}</span>
                      <h3>{cluster.label}</h3>
                    </div>
                    <strong>{items.length}</strong>
                  </header>
                  <div className="term-list">
                    {cluster.representativeTerms.map((term) => (
                      <span key={term}>{term}</span>
                    ))}
                  </div>
                  <ul>
                    {items.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPointId(item.id);
                            setSelectedCluster(item.clusterId);
                            window.scrollTo({ top: 360, behavior: "smooth" });
                          }}
                        >
                          <i className={item.sourceType} />
                          <span>
                            <strong>{item.concept}</strong>
                            <small>{item.sourceName}</small>
                          </span>
                          {item.isNew && <em>NEW</em>}
                        </button>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
        </div>

        {filteredPoints.length === 0 && (
          <div className="content-empty">
            No cluster content matches the current filters.
          </div>
        )}

        <div className="next-step-note visualization-next">
          <span>Next</span>
          <p>
            Continue to Step 5 to ask questions using the clustered information
            and its source evidence.
          </p>
          <button type="button" onClick={onContinue}>
            Continue to system questions →
          </button>
        </div>
      </section>
    </div>
  );
}
