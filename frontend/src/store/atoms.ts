import { atom } from "recoil";
import { NovelProject } from "../types";

// 現在選択されているプロジェクトのID
export const currentProjectIdState = atom<string | null>({
  key: "currentProjectId",
  default: null,
});

// 現在のプロジェクト
export const currentProjectState = atom<NovelProject | null>({
  key: "currentProject",
  default: null,
});

// アプリの現在のモード（プロット、キャラクター、章など）
export type AppMode =
  | "synopsis"
  | "plot"
  | "characters"
  | "worldbuilding"
  | "timeline"
  | "writing"
  | "feedback";

export const appModeState = atom<AppMode>({
  key: "appMode",
  default: "synopsis",
});

// 現在選択されている章のID
export const currentChapterIdState = atom<string | null>({
  key: "currentChapterId",
  default: null,
});

// AIアシスタントとの会話履歴
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export const chatHistoryState = atom<Message[]>({
  key: "chatHistory",
  default: [],
});

// サイドバーの開閉状態
export const sidebarOpenState = atom<boolean>({
  key: "sidebarOpen",
  default: true,
});

// チャットパネルの開閉状態
export const chatPanelOpenState = atom<boolean>({
  key: "chatPanelOpen",
  default: true,
});
