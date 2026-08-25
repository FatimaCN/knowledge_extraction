interface StageSidebarProps {
  activeStage: number;
  completedStages: number[];
  onStageSelect: (stage: number) => void;
}

const stages = [
  { number: 1, title: "Source analysis", subtitle: "Ontologies and PDF files" },
  { number: 2, title: "Information extraction", subtitle: "Normalize source content" },
  { number: 3, title: "Cluster generation", subtitle: "Embeddings and clustering" },
  { number: 4, title: "Cluster visualization", subtitle: "Explore cluster contents" },
  { number: 5, title: "System questions", subtitle: "Ask and review evidence" },
];

export function StageSidebar({
  activeStage,
  completedStages,
  onStageSelect,
}: StageSidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true">
          K
        </div>
        <div>
          <strong>Knowledge POC</strong>
          <span>Ontology extraction</span>
        </div>
      </div>

      <div className="workflow-label">Workflow</div>

      <nav className="stage-list" aria-label="Project workflow">
        {stages.map((stage) => {
          const isActive = stage.number === activeStage;
          const isCompleted = completedStages.includes(stage.number);
          const isImplemented = stage.number <= 5;
          const previousStageComplete =
            stage.number === 1 || completedStages.includes(stage.number - 1);
          const isLocked = !isImplemented || !previousStageComplete;

          return (
            <button
              className={`stage-item ${isActive ? "active" : ""}`}
              disabled={isLocked}
              key={stage.number}
              type="button"
              onClick={() => onStageSelect(stage.number)}
            >
              <span
                className={`stage-number ${isCompleted ? "completed" : ""}`}
              >
                {isCompleted ? "✓" : stage.number}
              </span>
              <span className="stage-copy">
                <strong>{stage.title}</strong>
                <small>{stage.subtitle}</small>
              </span>
              {isLocked && <span className="lock" aria-label="Locked">●</span>}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <span className="status-dot" />
        <div>
          <strong>POC workspace</strong>
          <small>Step {activeStage} of 5</small>
        </div>
      </div>
    </aside>
  );
}
