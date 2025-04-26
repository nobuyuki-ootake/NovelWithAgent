import React from "react";
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
  } = usePlot();

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
