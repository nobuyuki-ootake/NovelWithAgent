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
import WorldBuildingPage from "./pages/WorldBuildingPage";
import TimelinePage from "./pages/TimelinePage";
import NewProjectPage from "./pages/NewProjectPage";
import ProjectsPage from "./pages/ProjectsPage";
import { appModeState, currentProjectState } from "./store/atoms";
import { NovelProject } from "./types/index";

function MainContent() {
  const appMode = useRecoilValue(appModeState);
  const [currentProject, setCurrentProject] =
    useRecoilState(currentProjectState);
  const [loading, setLoading] = useState(true);

  console.log("MainContent rendering, appMode:", appMode);
  console.log("CurrentProject:", currentProject);

  // ローカルストレージから現在のプロジェクトを読み込む
  useEffect(() => {
    const loadCurrentProject = () => {
      const currentProjectId = localStorage.getItem("currentProjectId");
      console.log(
        "LocalStorageから読み込み - currentProjectId:",
        currentProjectId
      );

      if (currentProjectId) {
        const projectsStr = localStorage.getItem("novelProjects");
        console.log(
          "LocalStorageから読み込み - novelProjects:",
          projectsStr ? "データあり" : "データなし"
        );

        if (projectsStr) {
          try {
            const projects: NovelProject[] = JSON.parse(projectsStr);
            console.log("パースしたプロジェクト数:", projects.length);

            const project = projects.find((p) => p.id === currentProjectId);
            console.log(
              "見つかったプロジェクト:",
              project ? project.title : "見つかりません"
            );

            if (project) {
              console.log("プロジェクトをRecoilステートに設定します");
              setCurrentProject(project);
            } else {
              console.error(
                "指定されたIDのプロジェクトが見つかりませんでした:",
                currentProjectId
              );
            }
          } catch (error) {
            console.error("プロジェクトデータのパースに失敗しました:", error);
          }
        }
      } else {
        console.log("currentProjectIdがlocalStorageに存在しません");
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
        return <WorldBuildingPage />;
      case "timeline":
        return <TimelinePage />;
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
  console.log("App component rendering");

  // 初期ロード時にLocalStorageの状態をチェック
  useEffect(() => {
    const currentProjectId = localStorage.getItem("currentProjectId");
    const novelProjects = localStorage.getItem("novelProjects");

    console.log("App初期化 - currentProjectId:", currentProjectId);
    console.log(
      "App初期化 - novelProjects:",
      novelProjects ? "データあり" : "データなし"
    );

    if (novelProjects) {
      try {
        const projects = JSON.parse(novelProjects);
        console.log("利用可能なプロジェクト:", projects.length, "件");
        if (projects.length > 0) {
          console.log("最初のプロジェクト:", projects[0].title);
        }
      } catch (error) {
        console.error(
          "アプリ初期化時のプロジェクトデータのパースに失敗:",
          error
        );
      }
    }
  }, []);

  return (
    <RecoilRoot>
      <Router>
        <div style={{ width: "100%", height: "100%", padding: "20px" }}>
          <h1>小説作成エージェント</h1>
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
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/new" element={<NewProjectPage />} />
              <Route path="/" element={<Navigate to="/projects" replace />} />
              <Route path="*" element={<Navigate to="/projects" replace />} />
            </Routes>
          </AppLayout>
        </div>
      </Router>
    </RecoilRoot>
  );
}

export default App;
