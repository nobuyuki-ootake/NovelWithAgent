import React, { createContext, useContext, ReactNode, useState } from "react";
import { useWriting } from "../hooks/useWriting";
import { Descendant } from "slate";
import { AlertColor } from "@mui/material";
import {
  Chapter,
  TimelineEvent,
  NovelProject,
  Character,
  WorldBuildingElement,
} from "@novel-ai-assistant/types";
import { aiAgentApi } from "../api/aiAgent";
import { convertTextToSlateValue } from "../utils/slateUtils";

// AIによる章生成関数のパラメータ型
export interface AIChapterGenerationParams {
  chapterTitle: string;
  relatedEvents: Pick<TimelineEvent, "id" | "title" | "description">[];
  charactersInChapter: Pick<
    Character,
    "id" | "name" | "description" | "role"
  >[];
  selectedLocations: Pick<
    WorldBuildingElement,
    "id" | "name" | "description"
  >[];
  userInstructions?: string;
  targetChapterLength?: "short" | "medium" | "long";
  model?: string;
}

// Contextで提供する値の型定義
interface WritingContextType {
  // 状態
  editorValue: Descendant[];
  currentChapter: Chapter | null;
  currentProject: NovelProject | null;
  currentTabIndex: number;
  currentChapterId: string | null;
  timelineEvents: TimelineEvent[];
  newChapterDialogOpen: boolean;
  newChapterTitle: string;
  newChapterSynopsis: string;
  assignEventsDialogOpen: boolean;
  selectedEvents: string[];
  eventDetailDialogOpen: boolean;
  selectedEvent: TimelineEvent | null;

  // AI関連の状態
  isAiProcessing: boolean;
  aiUserInstructions: string;
  aiTargetLength: "short" | "medium" | "long" | "";

  // 原稿用紙モード関連の状態
  manuscriptPages: string[];
  currentManuscriptPageIndex: number;

  // Snackbar関連の状態
  snackbarOpen: boolean;
  snackbarMessage: string;
  snackbarSeverity: AlertColor;

  // アクション
  handleEditorChange: (value: Descendant[]) => void;
  handleTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  handleChapterSelect: (chapterId: string) => void;
  handleOpenNewChapterDialog: () => void;
  handleCloseNewChapterDialog: () => void;
  setNewChapterTitle: React.Dispatch<React.SetStateAction<string>>;
  setNewChapterSynopsis: React.Dispatch<React.SetStateAction<string>>;
  handleCreateChapter: () => void;
  handleOpenAssignEventsDialog: () => void;
  handleCloseAssignEventsDialog: () => void;
  handleToggleEvent: (eventId: string) => void;
  handleAssignEvents: () => void;
  handleOpenEventDetailDialog: (eventId: string) => void;
  handleCloseEventDetailDialog: () => void;
  handleAddEventToChapter: (eventId: string) => void;
  handleAddNewEvent: (event: TimelineEvent) => void;
  handleSaveContent: () => void;
  handleRemoveEventFromChapter: (eventId: string) => void;

  // AI関連のアクション
  setIsAiProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  setAiUserInstructions: React.Dispatch<React.SetStateAction<string>>;
  setAiTargetLength: React.Dispatch<
    React.SetStateAction<"short" | "medium" | "long" | "">
  >;
  generateChapterByAI: (params: AIChapterGenerationParams) => Promise<void>;

  // 原稿用紙モード関連のアクション
  handleManuscriptPageChange: (pageIndex: number, newHtml: string) => void;
  handleAddManuscriptPage: () => void;
  handleRemoveManuscriptPage: () => void;
  handlePreviousManuscriptPage: () => void;
  handleNextManuscriptPage: () => void;

  // Snackbar関連のアクション
  showSnackbar: (message: string, severity: AlertColor) => void;
  closeSnackbar: () => void;
}

// コンテキストの作成
const WritingContext = createContext<WritingContextType | undefined>(undefined);

// プロバイダーコンポーネント
export const WritingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const writingHookData = useWriting();

  // AI関連のstate
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiUserInstructions, setAiUserInstructions] = useState("");
  const [aiTargetLength, setAiTargetLength] = useState<
    "short" | "medium" | "long" | ""
  >("");

  // Snackbarのstate
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>("info");

  const showSnackbar = (message: string, severity: AlertColor) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  // AIによる章本文生成
  const generateChapterByAI = async (params: AIChapterGenerationParams) => {
    setIsAiProcessing(true);
    try {
      const response = await aiAgentApi.generateChapterContent(
        params.chapterTitle,
        params.relatedEvents,
        params.charactersInChapter,
        params.selectedLocations,
        params.userInstructions,
        params.targetChapterLength || undefined,
        params.model
      );

      if (response.content && typeof response.content === "string") {
        const newEditorValue = convertTextToSlateValue(response.content);
        // AI生成結果を通常の執筆エディタに反映
        if (writingHookData.handleEditorChange) {
          writingHookData.handleEditorChange(newEditorValue);
        }
        showSnackbar("AIによる本文生成が完了しました。", "success");
      } else {
        console.warn(
          "AIからのレスポンス形式が不正か、コンテントがありません。",
          response
        );
        showSnackbar(
          "AIからのレスポンス形式が不正か、内容が空でした。",
          "warning"
        );
      }
    } catch (error) {
      console.error("AIによる章本文生成エラー:", error);
      const message = error instanceof Error ? error.message : String(error);
      showSnackbar(
        `AIによる章本文生成中にエラーが発生しました: ${message}`,
        "error"
      );
    } finally {
      setIsAiProcessing(false);
    }
  };

  // コンテキストで提供する値
  console.log(
    "WritingProvider: creating value. manuscriptPages length:",
    writingHookData.manuscriptPages?.length,
    "currentIndex:",
    writingHookData.currentManuscriptPageIndex,
    "currentChapterId:",
    writingHookData.currentChapterId,
    "currentChapter title:",
    writingHookData.currentChapter?.title,
    "currentChapter manuscriptPages:",
    writingHookData.currentChapter?.manuscriptPages
  );

  const value: WritingContextType = {
    ...writingHookData, // useWriting() からの全ての値（原稿用紙関連も含む）

    // AI関連の状態とアクション (これらはProvider固有)
    isAiProcessing,
    aiUserInstructions,
    aiTargetLength,
    setIsAiProcessing,
    setAiUserInstructions,
    setAiTargetLength,
    generateChapterByAI,

    // Snackbar関連の状態とアクション (これらもProvider固有)
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    showSnackbar,
    closeSnackbar,
  };

  return (
    <WritingContext.Provider value={value}>{children}</WritingContext.Provider>
  );
};

// カスタムフック
export const useWritingContext = () => {
  const context = useContext(WritingContext);
  if (context === undefined) {
    throw new Error("useWritingContext must be used within a WritingProvider");
  }
  return context;
};
