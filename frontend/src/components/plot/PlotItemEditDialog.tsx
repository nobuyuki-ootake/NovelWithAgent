import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

interface PlotItemEditDialogProps {
  open: boolean;
  title: string;
  description: string;
  status: "決定" | "検討中";
  onClose: () => void;
  onUpdate: () => void;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onStatusChange: (value: "決定" | "検討中") => void;
}

const PlotItemEditDialog: React.FC<PlotItemEditDialogProps> = ({
  open,
  title,
  description,
  status,
  onClose,
  onUpdate,
  onTitleChange,
  onDescriptionChange,
  onStatusChange,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>プロットアイテムを編集</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="タイトル"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          sx={{ mb: 2, mt: 1 }}
        />
        <TextField
          margin="dense"
          label="詳細"
          fullWidth
          variant="outlined"
          multiline
          rows={3}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel id="edit-status-label">ステータス</InputLabel>
          <Select
            labelId="edit-status-label"
            value={status}
            label="ステータス"
            onChange={(e) =>
              onStatusChange(e.target.value as "決定" | "検討中")
            }
          >
            <MenuItem value="決定">決定</MenuItem>
            <MenuItem value="検討中">検討中</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button
          onClick={onUpdate}
          variant="contained"
          color="primary"
          disabled={!title.trim()}
        >
          更新
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlotItemEditDialog;
