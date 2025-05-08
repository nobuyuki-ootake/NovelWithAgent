import { atom } from "recoil";
import { NovelProject } from "../types/index";

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

// AIエージェント連携機能用のステート

// AIチャットパネルの表示状態
export const aiChatPanelOpenState = atom<boolean>({
  key: "aiChatPanelOpen",
  default: false,
});

// 選択された要素のID一覧を格納するステート
export interface SelectedElement {
  id: string;
  type: "plot" | "character" | "chapter" | "worldbuilding";
  content: {
    title: string;
    description?: string;
    [key: string]: string | number | boolean | string[] | undefined | null; // より具体的な型
  };
}

export const selectedElementsState = atom<SelectedElement[]>({
  key: "selectedElements",
  default: [],
});

// AIチャットの会話履歴
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export const aiChatHistoryState = atom<ChatMessage[]>({
  key: "aiChatHistory",
  default: [],
});

// 現在のメッセージ入力
export const currentMessageState = atom<string>({
  key: "currentMessage",
  default: "",
});

// AIリクエスト処理中の状態
export const aiLoadingState = atom<boolean>({
  key: "aiLoading",
  default: false,
});

// AIチャットパネルのアクティブなタブ
export type AIChatTabType = "chat" | "settings";
export const aiChatTabState = atom<AIChatTabType>({
  key: "aiChatTab",
  default: "chat",
});
