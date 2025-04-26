import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";

interface NewChapterDialogProps {
  open: boolean;
  title: string;
  synopsis: string;
  onClose: () => void;
  onTitleChange: (value: string) => void;
  onSynopsisChange: (value: string) => void;
  onCreateChapter: () => void;
}

const NewChapterDialog: React.FC<NewChapterDialogProps> = ({
  open,
  title,
  synopsis,
  onClose,
  onTitleChange,
  onSynopsisChange,
  onCreateChapter,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>新規章の作成</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <TextField
            autoFocus
            margin="dense"
            label="章のタイトル"
            fullWidth
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="章の概要"
            fullWidth
            multiline
            rows={4}
            value={synopsis}
            onChange={(e) => onSynopsisChange(e.target.value)}
            variant="outlined"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          キャンセル
        </Button>
        <Button
          onClick={onCreateChapter}
          color="primary"
          variant="contained"
          disabled={!title.trim()}
        >
          作成
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewChapterDialog;
