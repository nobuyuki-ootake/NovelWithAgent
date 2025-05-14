import React, { createContext, useContext, ReactNode } from "react";
import { useWriting } from "../hooks/useWriting";
import { Descendant } from "slate";
import { Chapter, TimelineEvent, NovelProject } from "../types";

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
  serializeToText: (nodes: Descendant[]) => string;
}

// コンテキストの作成
const WritingContext = createContext<WritingContextType | undefined>(undefined);

// プロバイダーコンポーネント
export const WritingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // useWritingフックから執筆関連のロジックを取得
  const {
    editorValue,
    currentChapter,
    currentProject,
    currentTabIndex,
    currentChapterId,
    timelineEvents,
    newChapterDialogOpen,
    newChapterTitle,
    newChapterSynopsis,
    assignEventsDialogOpen,
    selectedEvents,
    eventDetailDialogOpen,
    selectedEvent,
    handleEditorChange,
    handleTabChange,
    handleChapterSelect,
    handleOpenNewChapterDialog,
    handleCloseNewChapterDialog,
    setNewChapterTitle,
    setNewChapterSynopsis,
    handleCreateChapter,
    handleOpenAssignEventsDialog,
    handleCloseAssignEventsDialog,
    handleToggleEvent,
    handleAssignEvents,
    handleOpenEventDetailDialog,
    handleCloseEventDetailDialog,
    handleAddEventToChapter,
    handleAddNewEvent,
    handleSaveContent,
    serializeToText,
  } = useWriting();

  // コンテキストで提供する値
  const value: WritingContextType = {
    // 状態
    editorValue,
    currentChapter,
    currentProject,
    currentTabIndex,
    currentChapterId,
    timelineEvents,
    newChapterDialogOpen,
    newChapterTitle,
    newChapterSynopsis,
    assignEventsDialogOpen,
    selectedEvents,
    eventDetailDialogOpen,
    selectedEvent,

    // アクション
    handleEditorChange,
    handleTabChange,
    handleChapterSelect,
    handleOpenNewChapterDialog,
    handleCloseNewChapterDialog,
    setNewChapterTitle,
    setNewChapterSynopsis,
    handleCreateChapter,
    handleOpenAssignEventsDialog,
    handleCloseAssignEventsDialog,
    handleToggleEvent,
    handleAssignEvents,
    handleOpenEventDetailDialog,
    handleCloseEventDetailDialog,
    handleAddEventToChapter,
    handleAddNewEvent,
    handleSaveContent,
    serializeToText,
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
