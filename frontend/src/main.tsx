import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { NovelProject } from "./types/index.ts";
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
  title: "サンプルプロジェクト",
  createdAt: new Date(),
  updatedAt: new Date(),
  synopsis:
    "主人公の山田太郎は、平凡な日常の中で突如として不思議な能力に目覚める。彼は自分の考えたことが現実になる力を持っていた。しかし、その力は使えば使うほど、彼の寿命を縮めていく。それを知った太郎は、自分の命と引き換えに、大切な人たちの幸せを願うことを決意する。",
  plot: [
    {
      id: uuidv4(),
      title: "序章：能力の発見",
      description:
        "主人公が自分の特殊能力に気づき、戸惑いながらもその力を試していく。",
      order: 1,
    },
    {
      id: uuidv4(),
      title: "第一章：力の代償",
      description: "能力を使うほど寿命が縮まることを知り、葛藤する主人公。",
      order: 2,
    },
    {
      id: uuidv4(),
      title: "第二章：決断",
      description:
        "自分の命よりも大切なものを守るため、力を使うことを決意する。",
      order: 3,
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
      traits: ["誠実", "優しい", "自己犠牲的", "内向的"],
      relationships: [],
      imageUrl: undefined,
    },
  ],
  worldBuilding: {
    id: uuidv4(),
    setting: "現代の日本、東京",
    rules: [
      "思ったことが現実になる能力がある",
      "その能力を使うほど、使用者の寿命は縮まる",
      "一度実現したことは元に戻せない",
    ],
    places: [],
    cultures: [],
    history: "",
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

// ローカルストレージにデータを保存する関数
const saveProjectToLocalStorage = (project: NovelProject) => {
  localStorage.setItem("novelProject", JSON.stringify(project));
};

// ローカルストレージからデータを読み込む関数
const loadProjectFromLocalStorage = (): NovelProject | null => {
  const data = localStorage.getItem("novelProject");
  return data ? JSON.parse(data) : null;
};

// 初期データがなければダミーデータを保存
if (!loadProjectFromLocalStorage()) {
  saveProjectToLocalStorage(dummyProject);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
