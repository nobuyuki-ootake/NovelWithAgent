import React from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import PlotItem from "../components/plot/PlotItem";
import { PlotProvider, usePlotContext } from "../contexts/PlotContext";
import { AIAssistModal } from "../components/modals/AIAssistModal";
import { NovelProject } from "../types";

// PlotPageの実装コンポーネント
const PlotPageContent: React.FC = () => {
  const {
    plotItems,
    editItemTitle,
    editItemDescription,
    editItemStatus,
    isDialogOpen,
    hasUnsavedChanges,
    currentProject,
    setNewItemTitle,
    setNewItemDescription,
    setEditItemTitle,
    setEditItemDescription,
    setEditItemStatus,
    handleAddItem,
    handleDeleteItem,
    handleOpenEditDialog,
    handleCloseEditDialog,
    handleUpdateItem,
    handleDragEnd,
    handleStatusChange,
    handleSave,
    aiAssistModalOpen,
    setAiAssistModalOpen,
    handleOpenAIAssist,
    handleAIAssist,
  } = usePlotContext();

  // ResponseDataの型定義
  type ResponseData = {
    response?: string;
    batchResponse?: boolean;
    [key: string]: unknown;
  };

  // AIAssistモーダルに渡す関数を適切な型に変換
  const handleAIAssistTyped = (message: string): Promise<ResponseData> => {
    return handleAIAssist(message) as Promise<ResponseData>;
  };

  if (!currentProject) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>プロジェクトが選択されていません。</Typography>
      </Container>
    );
  }

  // ステータス別のアイテム数をカウント
  const countByStatus = plotItems.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {(currentProject as NovelProject).title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          プロット
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Stack direction="row" spacing={2}>
            <Typography variant="body2" color="text.secondary">
              検討中: {countByStatus["検討中"] || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              決定済み: {countByStatus["決定"] || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              合計: {plotItems.length}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenAIAssist}
            >
              AIアシスト
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setNewItemTitle("");
                setNewItemDescription("");
                handleOpenEditDialog({
                  id: "",
                  title: "",
                  description: "",
                  order: plotItems.length,
                  status: "検討中",
                });
              }}
            >
              新規追加
            </Button>
            <Button
              variant="contained"
              color="success"
              disabled={!hasUnsavedChanges}
              onClick={handleSave}
            >
              変更を保存
            </Button>
          </Stack>
        </Box>
      </Paper>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="plot-items">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {plotItems.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps}>
                      <PlotItem
                        item={item}
                        onEdit={() => handleOpenEditDialog(item)}
                        onDelete={() => handleDeleteItem(item.id)}
                        onStatusChange={handleStatusChange}
                        dragHandleProps={provided.dragHandleProps}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* 編集ダイアログ */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editItemTitle ? "プロット項目を編集" : "新規プロット項目"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="タイトル"
              fullWidth
              margin="normal"
              value={editItemTitle}
              onChange={(e) => setEditItemTitle(e.target.value)}
            />
            <TextField
              label="説明"
              fullWidth
              margin="normal"
              multiline
              rows={6}
              value={editItemDescription}
              onChange={(e) => setEditItemDescription(e.target.value)}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>ステータス</InputLabel>
              <Select
                value={editItemStatus}
                label="ステータス"
                onChange={(e) =>
                  setEditItemStatus(e.target.value as "検討中" | "決定")
                }
              >
                <MenuItem value="検討中">検討中</MenuItem>
                <MenuItem value="決定">決定</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>キャンセル</Button>
          <Button
            onClick={editItemTitle ? handleUpdateItem : handleAddItem}
            variant="contained"
            color="primary"
          >
            {editItemTitle ? "更新" : "追加"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* AIアシストモーダル */}
      <AIAssistModal
        open={aiAssistModalOpen}
        onClose={() => setAiAssistModalOpen(false)}
        onAssistComplete={() => {
          // モーダルは自動的に閉じる
        }}
        requestAssist={handleAIAssistTyped}
        title="プロット作成アシスタント"
        description="プロットのアイデアが欲しい場合、指示を入力してください。"
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
${(currentProject as NovelProject)?.synopsis || "（あらすじがありません）"}`}
      />
    </Container>
  );
};

// ラッパーコンポーネント
const PlotPage: React.FC = () => {
  return (
    <PlotProvider>
      <PlotPageContent />
    </PlotProvider>
  );
};

export default PlotPage;
