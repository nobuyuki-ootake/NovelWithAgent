import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Card,
  CardContent,
  Snackbar,
  Alert,
} from "@mui/material";
import { Add as AddIcon, Save as SaveIcon } from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { usePlot } from "../hooks/usePlot";
import PlotItem from "../components/plot/PlotItem";
import PlotItemEditDialog from "../components/plot/PlotItemEditDialog";
import { AIAssistButton } from "../components/ui/AIAssistButton";
import { AIAssistModal } from "../components/modals/AIAssistModal";
import { useAIAssist } from "../hooks/useAIAssist";
import { useRecoilValue } from "recoil";
import { currentProjectState } from "../store/atoms";
import { v4 as uuidv4 } from "uuid";
import { PlotElement } from "../types";
import { toast } from "sonner";

const PlotPage: React.FC = () => {
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

  const [aiAssistModalOpen, setAiAssistModalOpen] = useState(false);
  const projectData = useRecoilValue(currentProjectState);

  // AIアシスト機能
  const { assistPlot } = useAIAssist({
    onSuccess: (result) => {
      if (result && result.response) {
        applyAIPlotResponse(result.response);
      }
    },
  });

  // AIの応答をプロットフォームに適用する関数
  const applyAIPlotResponse = (aiResponse: string) => {
    try {
      // AIからの応答を解析してプロット配列として取得
      const plotItems = parseAIResponseToPlotItems(aiResponse);

      // 有効なプロット配列が返ってきた場合
      if (plotItems.length > 0) {
        // すべてのプロットアイテムをプロット一覧に追加
        const newPlotItems = plotItems.map((item) => ({
          id: uuidv4(),
          title: item.title,
          description: item.description,
          order: 0, // 後で順番を再設定
          status: "検討中" as const,
        }));

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

  // AIからの応答テキストをプロットアイテム配列に変換する関数
  const parseAIResponseToPlotItems = (
    text: string
  ): { title: string; description: string }[] => {
    const items: { title: string; description: string }[] = [];

    // セクション区切りの可能性のあるパターン
    const sectionDelimiters = [
      /^(\d+\.\s.*?)(?=\d+\.\s|\n\n\d+\.|\n*$)/gms, // 1. タイトル
      /^(第\d+章.*?)(?=第\d+章|\n\n第|\n*$)/gms, // 第1章 タイトル
      /^(シーン\d+.*?)(?=シーン\d+|\n\nシーン|\n*$)/gms, // シーン1
      /^(プロット\d+.*?)(?=プロット\d+|\n\nプロット|\n*$)/gms, // プロット1
    ];

    // 複数のプロット項目に分割を試みる
    let sections: string[] = [];

    // 区切りパターンのいずれかにマッチするか試みる
    for (const delimiter of sectionDelimiters) {
      const matches = Array.from(text.matchAll(delimiter));
      if (matches.length > 1) {
        // 複数のセクションが見つかった
        sections = matches.map((match) => match[1].trim());
        break;
      }
    }

    // 区切りパターンでの分割が成功しなかった場合、空行で分割を試みる
    if (sections.length === 0) {
      // 2つの連続した改行で分割
      sections = text
        .split(/\n\s*\n+/)
        .filter((section) => section.trim().length > 0);
    }

    // セクションごとにタイトルと詳細を抽出
    if (sections.length > 0) {
      for (const section of sections) {
        const lines = section.split("\n");
        let title = "";
        let description = "";

        // タイトルと詳細を抽出
        const titleMatch = section.match(/タイトル[：:]\s*(.+?)($|\n)/);
        const descriptionMatch = section.match(
          /詳細[：:]\s*(.+?)(\n\n|\n[^:]|$)/s
        );

        if (titleMatch && titleMatch[1]) {
          title = titleMatch[1].trim();

          if (descriptionMatch && descriptionMatch[1]) {
            description = descriptionMatch[1].trim();
          } else {
            // 詳細が明示的でない場合、タイトル以外のテキストを詳細とする
            const nonTitleLines = lines.filter(
              (line) =>
                !line.includes("タイトル:") && !line.includes("タイトル：")
            );
            description = nonTitleLines.join("\n").trim();
          }
        } else {
          // タイトル: が明示的でない場合
          // 番号付きの最初の行をタイトルとして扱う
          const numberMatch = lines[0].match(
            /^(\d+\.|第\d+章|シーン\d+|プロット\d+)(.*)/
          );
          if (numberMatch) {
            title = numberMatch[2].trim() || numberMatch[0].trim();
            description = lines.slice(1).join("\n").trim();
          } else {
            // 単純に最初の行をタイトルとして扱う
            title = lines[0].trim();
            description = lines.slice(1).join("\n").trim();
          }
        }

        if (title) {
          items.push({ title, description });
        }
      }
    } else {
      // 分割できない場合は、単一のプロットアイテムとして処理
      const lines = text.split("\n");
      const titleMatch = text.match(/タイトル[：:]\s*(.+?)($|\n)/);

      if (titleMatch && titleMatch[1]) {
        const title = titleMatch[1].trim();
        const descriptionMatch = text.match(
          /詳細[：:]\s*(.+?)(\n\n|\n[^:]|$)/s
        );

        let description = "";
        if (descriptionMatch && descriptionMatch[1]) {
          description = descriptionMatch[1].trim();
        } else {
          const nonTitleLines = lines.filter(
            (line) =>
              !line.includes("タイトル:") && !line.includes("タイトル：")
          );
          description = nonTitleLines.join("\n").trim();
        }

        items.push({ title, description });
      } else if (lines.length > 0) {
        // タイトル/詳細の明示的な区切りがない場合
        const firstLine = lines[0].trim();
        const remainingLines = lines.slice(1).join("\n").trim();

        if (firstLine) {
          items.push({
            title: firstLine,
            description: remainingLines || "",
          });
        }
      }
    }

    return items;
  };

  // AIアシスタントを開く
  const handleOpenAIAssist = async () => {
    setAiAssistModalOpen(true);
    return Promise.resolve();
  };

  // AIアシストリクエスト実行
  const handleAIAssist = async (message: string) => {
    // あらすじを参照してプロットアイテム生成をリクエスト
    const synopsis = projectData?.synopsis || "";
    const existingPlotElements = projectData?.plot || [];
    return await assistPlot(message, [
      { type: "synopsis", content: synopsis },
      ...existingPlotElements.map((item) => ({
        type: "plotItem",
        content: item,
      })),
    ]);
  };

  if (!currentProject) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>プロジェクトが選択されていません。</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {currentProject.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          プロット
        </Typography>
      </Paper>

      {/* 新規プロットアイテム追加フォーム */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">新規プロットアイテム</Typography>
            <AIAssistButton
              onAssist={handleOpenAIAssist}
              text="AIに項目を埋めてもらう"
              variant="outline"
            />
          </Box>
          <TextField
            fullWidth
            label="タイトル"
            variant="outlined"
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="詳細"
            variant="outlined"
            multiline
            rows={2}
            value={newItemDescription}
            onChange={(e) => setNewItemDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddItem}
            disabled={!newItemTitle.trim()}
          >
            追加
          </Button>
        </CardContent>
      </Card>

      {/* プロットアイテムリスト */}
      <Card sx={{ mb: 3, position: "relative" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            プロットアイテム一覧
          </Typography>
          <Box sx={{ mt: 2 }}>
            {plotItems.length === 0 ? (
              <Typography
                color="text.secondary"
                sx={{ textAlign: "center", py: 4 }}
              >
                プロットアイテムがありません。新しいアイテムを追加してください。
              </Typography>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="droppable">
                  {(provided) => (
                    <Box
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      sx={{ width: "100%" }}
                    >
                      {plotItems.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                              <PlotItem
                                item={item}
                                onStatusChange={handleStatusChange}
                                onDelete={handleDeleteItem}
                                onEdit={handleOpenEditDialog}
                                dragHandleProps={provided.dragHandleProps}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </Box>
          {/* 保存ボタン */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={!hasUnsavedChanges}
            >
              プロットを保存
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* 編集ダイアログ */}
      <PlotItemEditDialog
        open={isDialogOpen}
        title={editItemTitle}
        description={editItemDescription}
        status={editItemStatus}
        onClose={handleCloseEditDialog}
        onUpdate={handleUpdateItem}
        onTitleChange={setEditItemTitle}
        onDescriptionChange={setEditItemDescription}
        onStatusChange={setEditItemStatus}
      />

      {/* AIアシストモーダル */}
      <AIAssistModal
        open={aiAssistModalOpen}
        onClose={() => setAiAssistModalOpen(false)}
        title="AIにプロットアイテムを作成してもらう"
        description="あらすじを参照して、物語のプロットアイテム（イベント、転換点など）を作成します。"
        defaultMessage={`あらすじを参照して、物語に必要なプロットアイテムを複数考えてください。
それぞれ以下の形式でプロットアイテムを記述してください：

プロットアイテム1
タイトル: [プロットのタイトル]
詳細: [具体的な説明]

プロットアイテム2
タイトル: [プロットのタイトル]
詳細: [具体的な説明]

※解説や分析は不要です。プロットアイテムのみをシンプルな形式で提示してください。

現在のあらすじ:
${projectData?.synopsis || "（あらすじがありません）"}`}
        onAssistComplete={() => {
          // モーダルは自動的に閉じる
        }}
        requestAssist={handleAIAssist}
      />

      {/* 保存完了通知 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          プロットが保存されました
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PlotPage;
