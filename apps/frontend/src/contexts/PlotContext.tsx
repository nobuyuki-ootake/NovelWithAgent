import React, { createContext, useContext, ReactNode, useState } from "react";
import { usePlot } from "../hooks/usePlot";
import { useAIAssist } from "../hooks/useAIAssist";
import { v4 as uuidv4 } from "uuid";
import { PlotElement, NovelProject } from "@novel-ai-assistant/types";
import { toast } from "sonner";
import { useRecoilValue } from "recoil";
import { currentProjectState } from "../store/atoms";
import { SelectChangeEvent } from "@mui/material";
import { DropResult } from "react-beautiful-dnd";

// Helper function to parse AI response to PlotElement[]
const parseAIResponseToPlotItems = (
  aiResponse: string
): Partial<PlotElement>[] => {
  const plotBlocks = aiResponse.split(/\n-----\n|\n---\n/); // Assuming plot items are separated by --- or -----
  return plotBlocks
    .map((block) => {
      const item: Partial<PlotElement> = {};
      const titleMatch = block.match(/タイトル[：:]\s*(.+?)($|\n)/);
      if (titleMatch && titleMatch[1]) item.title = titleMatch[1].trim();

      const descriptionMatch = block.match(
        /説明[：:]\s*(.+?)($|\n|プロット[：:]|登場人物[：:])/s
      );
      if (descriptionMatch && descriptionMatch[1])
        item.description = descriptionMatch[1].trim();

      // Add other PlotElement fields if AI provides them (e.g., status, order)
      // For now, these will be set défaut in applyAIPlotResponse
      return item;
    })
    .filter((item) => item.title); // Ensure at least a title exists
};

// Contextで提供する値の型定義
interface PlotContextType {
  // usePlotから取得した状態
  plotItems: PlotElement[];
  newItemTitle: string;
  newItemDescription: string;
  editItemTitle: string;
  editItemDescription: string;
  editItemStatus: "検討中" | "決定";
  isDialogOpen: boolean;
  hasUnsavedChanges: boolean;
  snackbarOpen: boolean;
  currentProject: NovelProject | null;

  // アクション
  setNewItemTitle: (title: string) => void;
  setNewItemDescription: (desc: string) => void;
  setEditItemTitle: (title: string) => void;
  setEditItemDescription: (desc: string) => void;
  setEditItemStatus: React.Dispatch<React.SetStateAction<"検討中" | "決定">>;
  setPlotItems: React.Dispatch<React.SetStateAction<PlotElement[]>>;
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddItem: () => void;
  handleDeleteItem: (id: string) => void;
  handleOpenEditDialog: (item: PlotElement) => void;
  handleCloseEditDialog: () => void;
  handleUpdateItem: () => void;
  handleDragEnd: (result: DropResult) => void;
  handleStatusChange: (
    id: string,
    event: SelectChangeEvent<"検討中" | "決定">
  ) => void;
  handleSave: () => void;
  handleCloseSnackbar: () => void;

  // AIアシスト機能
  aiAssistModalOpen: boolean;
  setAiAssistModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleOpenAIAssist: () => Promise<void>;
  handleAIAssist: (message: string) => Promise<unknown>;
  applyAIPlotResponse: (aiResponse: string) => void;
}

// コンテキストの作成
const PlotContext = createContext<PlotContextType | undefined>(undefined);

// プロバイダーコンポーネント
export const PlotProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [aiAssistModalOpen, setAiAssistModalOpen] = useState(false);
  const projectData = useRecoilValue(currentProjectState);

  // usePlotフックからプロット関連のロジックを取得
  const {
    currentProject,
    plotItems,
    newItemTitle,
    setNewItemTitle,
    newItemDescription,
    setNewItemDescription,
    editItemTitle,
    editItemDescription,
    editItemStatus,
    isDialogOpen,
    hasUnsavedChanges,
    snackbarOpen,
    handleAddItem,
    handleDeleteItem,
    handleOpenEditDialog,
    handleCloseEditDialog,
    handleUpdateItem,
    handleDragEnd,
    handleStatusChange,
    handleSave,
    handleCloseSnackbar,
    setEditItemTitle,
    setEditItemDescription,
    setEditItemStatus,
    setPlotItems,
    setHasUnsavedChanges,
  } = usePlot();

  // AIアシスト機能
  const { assistPlot } = useAIAssist({
    onPlotSuccess: (result) => {
      if (result && result.response) {
        applyAIPlotResponse(result.response);
      }
    },
  });

  // AIの応答をプロットフォームに適用する関数
  const applyAIPlotResponse = (aiResponse: string) => {
    try {
      // AIからの応答を解析してプロット配列として取得
      const parsedPlotItems = parseAIResponseToPlotItems(aiResponse);

      // 有効なプロット配列が返ってきた場合
      if (parsedPlotItems.length > 0) {
        // すべてのプロットアイテムをプロット一覧に追加
        const newPlotItems: PlotElement[] = parsedPlotItems.map(
          (item): PlotElement => ({
            id: uuidv4(),
            title: item.title || "無題のプロット", // Ensure title is not undefined
            description: item.description || "",
            order: 0, // 後で順番を再設定
            status: "検討中" as const,
          })
        );

        // 既存のプロットアイテムと新しいプロットアイテムを結合
        setPlotItems((prevItems: PlotElement[]) => {
          const updatedItems = [...prevItems, ...newPlotItems];
          // 順序を再設定
          return updatedItems.map((item, index) => ({
            ...item,
            order: index,
          }));
        });
        setHasUnsavedChanges(true);

        // 成功メッセージを表示
        toast.success(
          `${newPlotItems.length}件のプロットアイテムを追加しました`
        );
      }
    } catch (error) {
      console.error("AIレスポンスの解析エラー:", error);
    }
  };

  // AIアシスタントを開く
  const handleOpenAIAssist = async () => {
    setAiAssistModalOpen(true);
    return Promise.resolve();
  };

  // AIアシストリクエスト実行
  const handleAIAssist = async (message: string) => {
    // あらすじを参照してプロットアイテム生成をリクエスト
    const synopsis = (projectData as NovelProject)?.synopsis || "";
    const existingPlotElements = (projectData as NovelProject)?.plot || [];
    return await assistPlot(message, [
      { type: "synopsis", content: synopsis } as any,
      ...existingPlotElements.map(
        (item) =>
          ({
            type: "plotItem",
            content: item,
          } as any)
      ),
    ]);
  };

  // コンテキストで提供する値
  const value: PlotContextType = {
    // usePlotからの状態と関数
    plotItems,
    newItemTitle,
    newItemDescription,
    editItemTitle,
    editItemDescription,
    editItemStatus,
    isDialogOpen,
    hasUnsavedChanges,
    snackbarOpen,
    currentProject: currentProject as NovelProject | null,
    setNewItemTitle,
    setNewItemDescription,
    setEditItemTitle,
    setEditItemDescription,
    setEditItemStatus,
    setPlotItems,
    setHasUnsavedChanges,
    handleAddItem,
    handleDeleteItem,
    handleOpenEditDialog,
    handleCloseEditDialog,
    handleUpdateItem,
    handleDragEnd,
    handleStatusChange,
    handleSave,
    handleCloseSnackbar,

    // AIアシスト関連
    aiAssistModalOpen,
    setAiAssistModalOpen,
    handleOpenAIAssist,
    handleAIAssist,
    applyAIPlotResponse,
  };

  return <PlotContext.Provider value={value}>{children}</PlotContext.Provider>;
};

// カスタムフック
export const usePlotContext = () => {
  const context = useContext(PlotContext);
  if (context === undefined) {
    throw new Error("usePlotContext must be used within a PlotProvider");
  }
  return context;
};
