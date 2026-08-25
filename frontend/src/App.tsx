import { useState } from "react";
import { StageSidebar } from "./components/StageSidebar";
import { ClusterGenerationPage } from "./pages/ClusterGenerationPage";
import { ExtractionPage } from "./pages/ExtractionPage";
import { SourcesPage } from "./pages/SourcesPage";
import { ClusterVisualizationPage } from "./pages/ClusterVisualizationPage";
import { QuestionsPage } from "./pages/QuestionsPage";
import type { ExtractedItem } from "./types/extraction";
import type { SourceFile } from "./types/source";

export default function App() {
  const [activeStage, setActiveStage] = useState(1);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [analyzedSources, setAnalyzedSources] = useState<SourceFile[]>([]);
  const [extractedItems, setExtractedItems] = useState<ExtractedItem[]>([]);

  const completeSourceAnalysis = (sources: SourceFile[]) => {
    setAnalyzedSources(sources);
    setExtractedItems([]);
    setCompletedStages([1]);
  };

  const completeExtraction = (items: ExtractedItem[]) => {
    setExtractedItems(items);
    setCompletedStages((current) =>
      current.includes(2) ? current : [...current, 2],
    );
  };

  const completeClustering = () => {
    setCompletedStages((current) =>
      current.includes(3) ? current : [...current, 3],
    );
  };

  const completeVisualization = () => {
    setCompletedStages((current) =>
      current.includes(4) ? current : [...current, 4],
    );
  };

  const selectStage = (stage: number) => {
    const previousStageComplete =
      stage === 1 || completedStages.includes(stage - 1);
    if (stage <= 5 && previousStageComplete) {
      setActiveStage(stage);
    }
  };

  const renderStage = () => {
    if (activeStage === 1) {
      return (
        <SourcesPage
          initialSources={analyzedSources}
          onAnalysisCompleted={completeSourceAnalysis}
          onContinue={() => setActiveStage(2)}
        />
      );
    }

    if (activeStage === 2) {
      return (
        <ExtractionPage
          sources={analyzedSources}
          initialItems={extractedItems}
          onBack={() => setActiveStage(1)}
          onExtractionCompleted={completeExtraction}
          onContinue={() => setActiveStage(3)}
        />
      );
    }

    if (activeStage === 3) {
      return (
        <ClusterGenerationPage
          extractedItemCount={extractedItems.length > 0 ? 37 : 0}
          onBack={() => setActiveStage(2)}
          onClusteringCompleted={completeClustering}
          onContinue={() => setActiveStage(4)}
        />
      );
    }

    if (activeStage === 4) {
      return (
        <ClusterVisualizationPage
          onBack={() => setActiveStage(3)}
          onContinue={() => {
            completeVisualization();
            setActiveStage(5);
          }}
        />
      );
    }

    return <QuestionsPage onBack={() => setActiveStage(4)} />;
  };

  return (
    <div className="app-shell">
      <StageSidebar
        activeStage={activeStage}
        completedStages={completedStages}
        onStageSelect={selectStage}
      />

      <main className="main-content">
        {renderStage()}
      </main>
    </div>
  );
}
