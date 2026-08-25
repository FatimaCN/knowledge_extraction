import { useMemo, useState } from "react";

interface QuestionsPageProps {
  onBack: () => void;
}

type CapabilityKey =
  | "query"
  | "postprocessing"
  | "interpretation"
  | "inference";

interface QuestionCapability {
  query: boolean;
  postprocessing: boolean;
  interpretation: boolean;
  inference: boolean;
}

interface CatalogueQuestion {
  id: string;
  text: string;
  capabilities: QuestionCapability;
}

interface QuestionSection {
  id: string;
  title: string;
  shortTitle: string;
  accent: string;
  questions: CatalogueQuestion[];
}

const capabilityLabels: Record<CapabilityKey, string> = {
  query: "Query",
  postprocessing: "Postprocessing",
  interpretation: "IA interpretation",
  inference: "IA inference",
};

const q = (
  id: string,
  text: string,
  query: boolean,
  postprocessing: boolean,
  interpretation: boolean,
  inference: boolean,
): CatalogueQuestion => ({
  id,
  text,
  capabilities: { query, postprocessing, interpretation, inference },
});

const questionSections: QuestionSection[] = [
  {
    id: "construction-process",
    title: "Construction process",
    shortTitle: "Construction process",
    accent: "#2f8f80",
    questions: [
      q("cp-01", "Which execution phases are most frequently subject to delays?", true, false, true, false),
      q("cp-02", "Which work packages are systematically subcontracted and tend to generate complications?", true, false, true, false),
      q("cp-03", "Are there recurring deviations between the initial schedule and the actual schedule for the structural work phases?", true, true, true, false),
      q("cp-04", "On what date did the finishing phase start on site X, and which company executed it?", true, false, true, false),
      q("cp-05", "Does site X have reservations at handover? Which ones?", true, false, true, false),
      q("cp-06", "Which company executed the waterproofing package on site X, and is it involved in other incidents elsewhere?", true, true, true, false),
    ],
  },
  {
    id: "incident-typology",
    title: "Typology and Frequency of Incidents",
    shortTitle: "Incident typology",
    accent: "#537fc0",
    questions: [
      q("tf-01", "What types of incidents are most frequent in the database?", true, true, true, false),
      q("tf-02", "Can a typology of incidents be established by work package or by building type?", false, false, false, false),
      q("tf-03", "Do recurring defects appear on specific elements (roof, foundations, networks, etc.)?", false, false, true, false),
      q("tf-04", "What incidents are recorded on site X, and on which dates did they occur?", true, false, true, false),
      q("tf-05", "Is incident X that occurred on building Y a reappearance of a defect previously reported in a site report?", true, true, true, true),
      q("tf-06", "Is incident X that occurred on building Y located in a part of the building exposed to external hazards (rain, frost, settlement)?", true, false, true, false),
    ],
  },
  {
    id: "incident-causes",
    title: "Causes of Incidents",
    shortTitle: "Incident causes",
    accent: "#8a68bd",
    questions: [
      q("ci-01", "What proportion of incidents is related to poor execution, design defects, or material defects?", true, true, true, false),
      q("ci-02", "Are certain companies or work packages systematically associated with specific pathologies?", true, true, true, false),
      q("ci-03", "Are incidents related to deviations from the CCTP specifications?", false, false, false, false),
      q("ci-04", "Is the incident on site X due to non-compliance with a clause of the CCTP? Which one?", false, false, false, false),
      q("ci-05", "Was the waterproofing package on site Y mentioned in site reports before the incident occurred?", true, true, false, true),
      q("ci-06", "Did the absence of quality control (e.g., waterproofing tests) contribute to the occurrence of the incident?", true, true, true, false),
    ],
  },
  {
    id: "incident-monitoring",
    title: "Incident Treatment and Monitoring",
    shortTitle: "Treatment & monitoring",
    accent: "#dc8b4b",
    questions: [
      q("tm-01", "What is the average delay between the declaration of an incident and the intervention?", true, true, true, false),
      q("tm-02", "Which companies most frequently perform post-incident repairs?", true, true, true, false),
      q("tm-03", "Have there been claims under the ten-year warranty?", false, false, false, false),
      q("tm-04", "What are the dates of the expert appointment and expert report for incident X on site Y?", true, false, true, false),
      q("tm-05", "Does the expert report mention shared responsibility?", true, false, false, false),
      q("tm-06", "What technical solutions were adopted to correct the defect, and are they compliant with the original CCTP?", false, false, false, false),
    ],
  },
  {
    id: "advanced-analyses",
    title: "Advanced Analyses",
    shortTitle: "Advanced analyses",
    accent: "#cb5f79",
    questions: [
      q("aa-01", "Is there a correlation between schedule delays and the occurrence of incidents?", true, true, true, false),
      q("aa-02", "On which construction sites did the same type of incident repeat despite having different stakeholders?", true, true, true, false),
      q("aa-03", "Which CCTP clauses are most frequently indirectly implicated in incidents?", false, false, false, false),
      q("aa-04", "Rank the companies by frequency of involvement in incidents.", true, true, true, false),
      q("aa-05", "Identify buildings where an incident resulted directly from a non-compliance reported during construction.", true, true, true, false),
    ],
  },
  {
    id: "multiple-incidents",
    title: "Multiple Incidents on the Same Building",
    shortTitle: "Multiple incidents",
    accent: "#2d7899",
    questions: [
      q("mi-01", "How many distinct incidents have affected building X, and what are their types and locations?", true, true, true, false),
      q("mi-02", "Are incidents concentrated in a specific area of the building?", true, true, true, false),
      q("mi-03", "Is there a causal chain between incidents (e.g., infiltration followed by corrosion)?", true, true, true, false),
      q("mi-04", "Can a common root cause be identified among the different defects (company, design, initial defect)?", true, true, true, false),
      q("mi-05", "Was an incident poorly treated, leading to a new defect?", true, true, true, false),
      q("mi-06", "Are the companies involved in the repairs the same as those initially responsible?", true, true, true, false),
      q("mi-07", "Does the expert report for the second incident mention improper treatment of the first?", true, true, false, true),
      q("mi-08", "Was a global quality control carried out after the incidents, and what were the results?", false, false, false, false),
      q("mi-09", "Did the insurer modify its coverage (conditions or premium) for this building due to repeated incidents?", true, true, true, false),
    ],
  },
];

const allQuestionIds = questionSections.flatMap((section) =>
  section.questions.map((question) => question.id),
);

export function QuestionsPage({ onBack }: QuestionsPageProps) {
  const [search, setSearch] = useState("");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [capabilityFilter, setCapabilityFilter] =
    useState<CapabilityKey | "all">("all");
  const [expandedSections, setExpandedSections] = useState<string[]>(
    questionSections.map((section) => section.id),
  );
  const [selectedQuestionId, setSelectedQuestionId] = useState(allQuestionIds[0]);
  const [runState, setRunState] = useState<"idle" | "running" | "ready">("idle");

  const filteredSections = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return questionSections
      .filter((section) => sectionFilter === "all" || section.id === sectionFilter)
      .map((section) => ({
        ...section,
        questions: section.questions.filter((question) => {
          const matchesText =
            !normalizedSearch ||
            question.text.toLowerCase().includes(normalizedSearch);
          const matchesCapability =
            capabilityFilter === "all" ||
            question.capabilities[capabilityFilter];
          return matchesText && matchesCapability;
        }),
      }))
      .filter((section) => section.questions.length > 0);
  }, [capabilityFilter, search, sectionFilter]);

  const selectedEntry = useMemo(() => {
    for (const section of questionSections) {
      const question = section.questions.find(
        (item) => item.id === selectedQuestionId,
      );
      if (question) return { question, section };
    }
    return null;
  }, [selectedQuestionId]);

  const totals = useMemo(() => {
    const questions = questionSections.flatMap((section) => section.questions);
    return {
      questions: questions.length,
      query: questions.filter((item) => item.capabilities.query).length,
      postprocessing: questions.filter(
        (item) => item.capabilities.postprocessing,
      ).length,
      interpretation: questions.filter(
        (item) => item.capabilities.interpretation,
      ).length,
      inference: questions.filter((item) => item.capabilities.inference).length,
    };
  }, []);

  const visibleQuestionCount = filteredSections.reduce(
    (total, section) => total + section.questions.length,
    0,
  );

  const selectQuestion = (id: string) => {
    setSelectedQuestionId(id);
    setRunState("idle");
  };

  const toggleSection = (id: string) => {
    setExpandedSections((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const runQuestion = () => {
    if (!selectedEntry || runState === "running") return;
    setRunState("running");
    window.setTimeout(() => setRunState("ready"), 1100);
  };

  return (
    <div className="page-container question-library-page">
      <header className="page-header question-library-header">
        <div>
          <button className="back-link" type="button" onClick={onBack}>
            ← Back to cluster visualization
          </button>
          <span className="eyebrow">STEP 5 OF 5</span>
          <h1>System question catalogue</h1>
          <p>
            Explore the questions defined for the construction incident
            knowledge base and verify which processing capabilities support
            each one.
          </p>
        </div>
        <span className="project-badge">
          6 sections · {totals.questions} questions
        </span>
      </header>

      <section
        className="question-summary-grid"
        aria-label="Question catalogue summary"
      >
        <article>
          <span>Total questions</span>
          <strong>{totals.questions}</strong>
          <small>Across six analysis sections</small>
        </article>
        <article>
          <span>Query supported</span>
          <strong>{totals.query}</strong>
          <small>
            {Math.round((totals.query / totals.questions) * 100)}% of the catalogue
          </small>
        </article>
        <article>
          <span>Postprocessing</span>
          <strong>{totals.postprocessing}</strong>
          <small>Questions requiring processing</small>
        </article>
        <article>
          <span>IA interpretation</span>
          <strong>{totals.interpretation}</strong>
          <small>Questions supported by IA</small>
        </article>
        <article>
          <span>IA inference</span>
          <strong>{totals.inference}</strong>
          <small>Advanced inference questions</small>
        </article>
      </section>

      <section className="panel catalogue-toolbar">
        <label className="catalogue-search">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={search}
            placeholder="Search within the 38 questions…"
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <label className="catalogue-filter">
          <span>Section</span>
          <select
            value={sectionFilter}
            onChange={(event) => setSectionFilter(event.target.value)}
          >
            <option value="all">All sections</option>
            {questionSections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.shortTitle}
              </option>
            ))}
          </select>
        </label>

        <label className="catalogue-filter">
          <span>Available capability</span>
          <select
            value={capabilityFilter}
            onChange={(event) =>
              setCapabilityFilter(event.target.value as CapabilityKey | "all")
            }
          >
            <option value="all">All capabilities</option>
            {(Object.keys(capabilityLabels) as CapabilityKey[]).map((key) => (
              <option key={key} value={key}>
                {capabilityLabels[key]}
              </option>
            ))}
          </select>
        </label>

        <div className="catalogue-result-count">
          <strong>{visibleQuestionCount}</strong>
          <span>visible questions</span>
        </div>
      </section>

      <div className="question-catalogue-layout">
        <main className="question-sections">
          {filteredSections.length === 0 && (
            <div className="catalogue-empty">
              <span>⌕</span>
              <h2>No matching questions</h2>
              <p>Change the search term or remove one of the filters.</p>
            </div>
          )}

          {filteredSections.map((section) => {
            const isExpanded = expandedSections.includes(section.id);
            return (
              <section
                className="question-section-card"
                key={section.id}
                style={
                  { "--section-accent": section.accent } as React.CSSProperties
                }
              >
                <button
                  className="question-section-heading"
                  type="button"
                  aria-expanded={isExpanded}
                  onClick={() => toggleSection(section.id)}
                >
                  <span className="section-index">
                    {String(
                      questionSections.findIndex(
                        (item) => item.id === section.id,
                      ) + 1,
                    ).padStart(2, "0")}
                  </span>
                  <div>
                    <h2>{section.title}</h2>
                    <p>{section.questions.length} questions in the current view</p>
                  </div>
                  <i aria-hidden="true">{isExpanded ? "−" : "+"}</i>
                </button>

                {isExpanded && (
                  <div className="question-table-wrap">
                    <div className="question-table-header" aria-hidden="true">
                      <span>Question</span>
                      {(Object.keys(capabilityLabels) as CapabilityKey[]).map(
                        (key) => (
                          <span key={key}>{capabilityLabels[key]}</span>
                        ),
                      )}
                    </div>

                    <div className="question-table-body">
                      {section.questions.map((question, index) => {
                        const isSelected = selectedQuestionId === question.id;
                        return (
                          <button
                            className={`catalogue-question-row${
                              isSelected ? " selected" : ""
                            }`}
                            type="button"
                            key={question.id}
                            onClick={() => selectQuestion(question.id)}
                          >
                            <span className="question-text-cell">
                              <i>{String(index + 1).padStart(2, "0")}</i>
                              <strong>{question.text}</strong>
                              <em>
                                {isSelected ? "Selected" : "Select question"}
                              </em>
                            </span>
                            {(Object.keys(capabilityLabels) as CapabilityKey[]).map(
                              (key) => (
                                <span
                                  className={`capability-cell ${
                                    question.capabilities[key]
                                      ? "available"
                                      : "unavailable"
                                  }`}
                                  key={key}
                                  title={capabilityLabels[key]}
                                >
                                  <i aria-hidden="true">
                                    {question.capabilities[key] ? "✓" : "—"}
                                  </i>
                                </span>
                              ),
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </main>

        <aside className="selected-question-panel">
          <div className="selected-question-heading">
            <span>SELECTED QUESTION</span>
            <i
              style={{
                backgroundColor: selectedEntry?.section.accent ?? "#2f8f80",
              }}
            />
          </div>

          {selectedEntry && (
            <>
              <span className="selected-section-name">
                {selectedEntry.section.title}
              </span>
              <h2>{selectedEntry.question.text}</h2>

              <div className="selected-capabilities">
                {(Object.keys(capabilityLabels) as CapabilityKey[]).map((key) => (
                  <div key={key}>
                    <span>{capabilityLabels[key]}</span>
                    <strong
                      className={
                        selectedEntry.question.capabilities[key]
                          ? "available"
                          : "unavailable"
                      }
                    >
                      {selectedEntry.question.capabilities[key] ? "✓" : "—"}
                    </strong>
                  </div>
                ))}
              </div>

              <button
                className="primary-button run-catalogue-question"
                type="button"
                disabled={runState === "running"}
                onClick={runQuestion}
              >
                {runState === "running" ? (
                  <>
                    <span className="answer-spinner" />
                    Preparing question…
                  </>
                ) : (
                  <>
                    Ask selected question <span aria-hidden="true">→</span>
                  </>
                )}
              </button>

              {runState === "ready" && (
                <div className="catalogue-run-notice" aria-live="polite">
                  <span>✓</span>
                  <div>
                    <strong>Question ready for execution</strong>
                    <p>
                      The POC has identified the required processing
                      capabilities. Connect this action to FastAPI to retrieve
                      the real answer.
                    </p>
                  </div>
                </div>
              )}

              <p className="catalogue-poc-note">
                Capability values reproduce the current experimental assessment.
              </p>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
