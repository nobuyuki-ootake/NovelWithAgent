import { useEffect, useState } from "react";
import { RecoilRoot, useRecoilState, useRecoilValue } from "recoil";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import SynopsisPage from "./pages/SynopsisPage";
import WritingPage from "./pages/WritingPage";
import HomePage from "./pages/HomePage";
import PlotPage from "./pages/PlotPage";
import CharactersPage from "./pages/CharactersPage";
import { appModeState, currentProjectState } from "./store/atoms";
import { NovelProject } from "./types";

function MainContent() {
  const appMode = useRecoilValue(appModeState);
  const [currentProject, setCurrentProject] =
    useRecoilState(currentProjectState);
  const [loading, setLoading] = useState(true);

  // ローカルストレージから現在のプロジェクトを読み込む
  useEffect(() => {
    const loadCurrentProject = () => {
      const currentProjectId = localStorage.getItem("currentProjectId");
      if (currentProjectId) {
        const projectsStr = localStorage.getItem("novelProjects");
        if (projectsStr) {
          const projects: NovelProject[] = JSON.parse(projectsStr);
          const project = projects.find((p) => p.id === currentProjectId);
          if (project) {
            setCurrentProject(project);
          }
        }
      }
      setLoading(false);
    };

    loadCurrentProject();
  }, [setCurrentProject]);

  // ローディング中は何も表示しない
  if (loading) {
    return null;
  }

  // プロジェクトが選択されていない場合はホーム画面を表示
  if (!currentProject) {
    return <HomePage />;
  }

  // アプリモードに応じて表示するコンポーネントを切り替え
  const renderContent = () => {
    switch (appMode) {
      case "synopsis":
        return <SynopsisPage />;
      case "plot":
        return <PlotPage />;
      case "characters":
        return <CharactersPage />;
      case "worldbuilding":
        return <div>世界観構築ページ（未実装）</div>;
      case "timeline":
        return <div>タイムラインページ（未実装）</div>;
      case "writing":
        return <WritingPage />;
      case "feedback":
        return <div>フィードバックページ（未実装）</div>;
      default:
        return <Navigate to="/synopsis" />;
    }
  };

  return renderContent();
}

function App() {
  return (
    <RecoilRoot>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/home" element={<MainContent />} />
            <Route path="/synopsis" element={<MainContent />} />
            <Route path="/plot" element={<MainContent />} />
            <Route path="/characters" element={<MainContent />} />
            <Route path="/worldbuilding" element={<MainContent />} />
            <Route path="/timeline" element={<MainContent />} />
            <Route path="/writing" element={<MainContent />} />
            <Route path="/feedback" element={<MainContent />} />
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </AppLayout>
      </Router>
    </RecoilRoot>
  );
}

export default App;
