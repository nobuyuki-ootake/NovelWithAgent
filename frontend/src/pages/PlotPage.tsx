import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Card,
  CardContent,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  SelectChangeEvent,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import { useRecoilState } from "recoil";
import { currentProjectState } from "../store/atoms";
import { PlotElement } from "../types";

const PlotPage: React.FC = () => {
  const [currentProject, setCurrentProject] =
    useRecoilState(currentProjectState);
  const [plotItems, setPlotItems] = useState<PlotElement[]>([]);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [editItemTitle, setEditItemTitle] = useState("");
  const [editItemDescription, setEditItemDescription] = useState("");
  const [editItemStatus, setEditItemStatus] = useState<"決定" | "検討中">(
    "検討中"
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // プロジェクトからプロットアイテムを読み込み
  useEffect(() => {
    if (currentProject?.plot) {
      // orderでソートしてから設定
      setPlotItems([...currentProject.plot].sort((a, b) => a.order - b.order));
    }
  }, [currentProject]);

  // プロットアイテムを追加
  const handleAddItem = () => {
    if (!newItemTitle.trim()) return;

    const newItem: PlotElement = {
      id: uuidv4(),
      title: newItemTitle.trim(),
      description: newItemDescription.trim(),
      order: plotItems.length,
      status: "検討中",
    };

    setPlotItems([...plotItems, newItem]);
    setNewItemTitle("");
    setNewItemDescription("");
    setHasUnsavedChanges(true);
  };

  // プロットアイテムを削除
  const handleDeleteItem = (id: string) => {
    const updatedItems = plotItems.filter((item) => item.id !== id);

    // 順序を再設定
    const reorderedItems = updatedItems.map((item, index) => ({
      ...item,
      order: index,
    }));

    setPlotItems(reorderedItems);
    setHasUnsavedChanges(true);
  };

  // 編集ダイアログを開く
  const handleOpenEditDialog = (item: PlotElement) => {
    setEditItemId(item.id);
    setEditItemTitle(item.title);
    setEditItemDescription(item.description);
    setEditItemStatus(item.status);
    setIsDialogOpen(true);
  };

  // 編集ダイアログを閉じる
  const handleCloseEditDialog = () => {
    setIsDialogOpen(false);
    setEditItemId(null);
  };

  // プロットアイテムを更新
  const handleUpdateItem = () => {
    if (!editItemId || !editItemTitle.trim()) return;

    const updatedItems = plotItems.map((item) => {
      if (item.id === editItemId) {
        return {
          ...item,
          title: editItemTitle.trim(),
          description: editItemDescription.trim(),
          status: editItemStatus,
        };
      }
      return item;
    });

    setPlotItems(updatedItems);
    setIsDialogOpen(false);
    setEditItemId(null);
    setHasUnsavedChanges(true);
  };

  // ドラッグアンドドロップによる順序変更
  const handleDragEnd = (result: DropResult) => {
    // ドロップ先がない場合は何もしない
    if (!result.destination) return;

    // 順序が変わっていなければ何もしない
    if (result.destination.index === result.source.index) return;

    // 項目の新しい順序を作成
    const items = Array.from(plotItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // 順序番号を再設定
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setPlotItems(updatedItems);
    setHasUnsavedChanges(true);
  };

  // ステータス変更
  const handleStatusChange = (
    id: string,
    event: SelectChangeEvent<"決定" | "検討中">
  ) => {
    const status = event.target.value as "決定" | "検討中";
    const updatedItems = plotItems.map((item) => {
      if (item.id === id) {
        return { ...item, status };
      }
      return item;
    });

    setPlotItems(updatedItems);
    setHasUnsavedChanges(true);
  };

  // プロジェクトに保存
  const handleSave = () => {
    if (currentProject) {
      setCurrentProject({
        ...currentProject,
        plot: plotItems,
        updatedAt: new Date(),
      });
      setHasUnsavedChanges(false);
      setSnackbarOpen(true);
    }
  };

  // スナックバーを閉じる
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
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
          <Typography variant="h6" gutterBottom>
            新規プロットアイテム
          </Typography>
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
                            <Paper
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              elevation={1}
                              sx={{
                                p: 2,
                                mb: 2,
                                display: "flex",
                                alignItems: "flex-start",
                                borderLeft: `6px solid ${
                                  item.status === "決定"
                                    ? "primary.main"
                                    : "grey.400"
                                }`,
                              }}
                            >
                              <Box
                                {...provided.dragHandleProps}
                                sx={{ mr: 1, color: "grey.500" }}
                              >
                                <DragIcon />
                              </Box>
                              <Box sx={{ flexGrow: 1 }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mb: 1,
                                  }}
                                >
                                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                    {item.title}
                                  </Typography>
                                  <FormControl
                                    size="small"
                                    sx={{ minWidth: 100, mr: 1 }}
                                  >
                                    <InputLabel id={`status-label-${item.id}`}>
                                      ステータス
                                    </InputLabel>
                                    <Select
                                      labelId={`status-label-${item.id}`}
                                      value={item.status}
                                      label="ステータス"
                                      onChange={(e) =>
                                        handleStatusChange(
                                          item.id,
                                          e as SelectChangeEvent<
                                            "決定" | "検討中"
                                          >
                                        )
                                      }
                                    >
                                      <MenuItem value="決定">決定</MenuItem>
                                      <MenuItem value="検討中">検討中</MenuItem>
                                    </Select>
                                  </FormControl>
                                  <IconButton
                                    onClick={() => handleDeleteItem(item.id)}
                                    color="error"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {item.description || "詳細なし"}
                                </Typography>
                                <Button
                                  size="small"
                                  onClick={() => handleOpenEditDialog(item)}
                                  sx={{ mt: 1 }}
                                >
                                  編集
                                </Button>
                              </Box>
                            </Paper>
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
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>プロットアイテムを編集</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="タイトル"
            fullWidth
            variant="outlined"
            value={editItemTitle}
            onChange={(e) => setEditItemTitle(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            label="詳細"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={editItemDescription}
            onChange={(e) => setEditItemDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="edit-status-label">ステータス</InputLabel>
            <Select
              labelId="edit-status-label"
              value={editItemStatus}
              label="ステータス"
              onChange={(e) =>
                setEditItemStatus(e.target.value as "決定" | "検討中")
              }
            >
              <MenuItem value="決定">決定</MenuItem>
              <MenuItem value="検討中">検討中</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>キャンセル</Button>
          <Button
            onClick={handleUpdateItem}
            variant="contained"
            color="primary"
            disabled={!editItemTitle.trim()}
          >
            更新
          </Button>
        </DialogActions>
      </Dialog>

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
