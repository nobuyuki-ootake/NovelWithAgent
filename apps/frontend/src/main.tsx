import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { NovelProject } from "@novel-ai-assistant/types";
import { v4 as uuidv4 } from "uuid";

// Recoil用の回避策を追加（修正版）
if (!("__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED" in React)) {
  Object.defineProperty(
    React,
    "__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED",
    {
      configurable: true,
      value: {
        ReactCurrentOwner: { current: null },
        ReactCurrentDispatcher: { current: { readContext: () => {} } },
      },
    }
  );
}

// 開発用のダミーデータを作成
const dummyProject: NovelProject = {
  id: uuidv4(),
  title: "テストプロジェクト",
  createdAt: new Date(),
  updatedAt: new Date(),
  synopsis:
    "主人公の山田太郎は、平凡な日常の中で突如として不思議な能力に目覚める。彼は自分の考えたことが現実になる力を持っていた。しかし、その力は使えば使うほど、彼の寿命を縮めていく。それを知った太郎は、自分の命と引き換えに、大切な人たちの幸せを願うことを決意する。",
  plot: [
    {
      id: uuidv4(),
      title: "プロット1",
      description: "説明1",
      order: 1,
      status: "決定",
    },
    {
      id: uuidv4(),
      title: "プロット2",
      description: "説明2",
      order: 2,
      status: "決定",
    },
    {
      id: uuidv4(),
      title: "プロット3",
      description: "説明3",
      order: 3,
      status: "決定",
    },
  ],
  characters: [
    {
      id: uuidv4(),
      name: "山田太郎",
      role: "protagonist",
      description:
        "28歳、普通のサラリーマン。誠実で優しい性格だが、自己肯定感が低い。",
      background:
        "両親は既に他界しており、一人暮らし。幼い頃から不思議な夢をよく見ていた。",
      motivation: "自分の命より大切な人たちの幸せを願う。",
      traits: [
        { id: uuidv4(), name: "誠実", value: "" },
        { id: uuidv4(), name: "優しい", value: "" },
        { id: uuidv4(), name: "自己犠牲的", value: "" },
        { id: uuidv4(), name: "内向的", value: "" },
      ],
      relationships: [],
      imageUrl: undefined,
    },
  ],
  worldBuilding: {
    id: uuidv4(),
    setting:
      "現代日本とよく似ているが、「願い」の力を持つ人間がごく稀に存在する世界",
    rules: [
      {
        id: "rule1",
        name: "思考実現能力",
        description: "思ったことが現実になる能力がある",
        features: "物語の中核となる超能力",
        impact: "物語の中核となる超能力",
        exceptions: "物語の中核となる超能力",
        origin: "物語の中核となる超能力",
        type: "物語の中核となる超能力",
        originalType: "rule",
        importance: "物語の中核となる超能力",
        relations: "物語の中核となる超能力",
      },
      {
        id: "rule2",
        name: "寿命の代償",
        description: "その能力を使うほど、使用者の寿命は縮まる",
        features: "能力の使用に関する制約と代償",
        impact: "物語の中核となる超能力",
        exceptions: "物語の中核となる超能力",
        origin: "物語の中核となる超能力",
        type: "物語の中核となる超能力",
        originalType: "rule",
        importance: "物語の中核となる超能力",
        relations: "物語の中核となる超能力",
      },
      {
        id: "rule3",
        name: "不可逆性",
        description: "一度実現したことは元に戻せない",
        features: "物語における緊張感と取り返しのつかない決断の重要性",
        impact: "物語の中核となる超能力",
        exceptions: "物語の中核となる超能力",
        origin: "物語の中核となる超能力",
        type: "物語の中核となる超能力",
        originalType: "rule",
        importance: "物語の中核となる超能力",
        relations: "物語の中核となる超能力",
      },
    ],
    places: [],
    cultures: [],
    historyLegend: [],
    worldmaps: [],
    settings: [],
    geographyEnvironment: [],
    magicTechnology: [],
    stateDefinition: [],
    freeFields: [],
  },
  timeline: [],
  chapters: [
    {
      id: uuidv4(),
      title: "序章：能力の発見",
      synopsis:
        "平凡な日常を送っていた主人公が、自分の思ったことが現実になる能力に気づく。",
      content:
        "山田太郎は、いつもと変わらない月曜日の朝を迎えていた。満員電車に揺られながら、「今日は早く帰りたいな」と考えていた。\n\nそして不思議なことに、その日は予定されていた会議がすべてキャンセルとなり、上司から「今日は早く帰っていいよ」と言われた。偶然だと思った太郎だったが、次に「雨が降らないといいな」と思った瞬間、曇っていた空が晴れ渡った。",
      order: 1,
      scenes: [],
    },
  ],
  feedback: [],
};

// ローカルストレージにプロジェクトリストを保存する関数
const saveProjectsToLocalStorage = (projects: NovelProject[]) => {
  localStorage.setItem("novelProjects", JSON.stringify(projects));
};

// ローカルストレージからプロジェクトリストを読み込む関数
const loadProjectsFromLocalStorage = (): NovelProject[] => {
  const data = localStorage.getItem("novelProjects");
  return data ? JSON.parse(data) : [];
};

// デバッグログを追加
console.log("main.tsx実行中...");
console.log("ルート要素:", document.getElementById("root"));

// プロジェクトリストをチェックし、なければダミーデータを追加
const projects = loadProjectsFromLocalStorage();
if (projects.length === 0) {
  console.log("ダミープロジェクトを追加します");
  projects.push(dummyProject);
  saveProjectsToLocalStorage(projects);

  // LocalStorageManagerに対応する形式で保存
  console.log("LocalStorageManager形式でも保存します");
  const projectForManager = {
    id: dummyProject.id,
    name: dummyProject.title,
    description: dummyProject.synopsis,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    characters: dummyProject.characters,
    worldBuilding: dummyProject.worldBuilding,
    timeline: dummyProject.timeline,
    chapters: dummyProject.chapters,
    metadata: {
      version: "1.0",
      status: "active",
    },
  };

  // LocalStorageManagerのプロジェクトリストに追加
  const projectList = localStorage.getItem("novel_project_list") || "[]";
  const parsedList = JSON.parse(projectList);
  parsedList.push({
    id: dummyProject.id,
    name: dummyProject.title,
    updatedAt: new Date().toISOString(),
  });
  localStorage.setItem("novel_project_list", JSON.stringify(parsedList));

  // プロジェクトデータも保存
  localStorage.setItem(
    `novel_project_${dummyProject.id}`,
    JSON.stringify(projectForManager)
  );
}

try {
  console.log("Reactレンダリング開始");
  const root = document.getElementById("root");
  if (!root) {
    console.error("ルート要素が見つかりません！");
  } else {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("レンダリング完了");
  }
} catch (error) {
  console.error("レンダリングエラー:", error);
}
