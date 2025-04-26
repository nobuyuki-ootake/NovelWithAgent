import React from "react";
import { Box, TextField, Button, Typography, CardContent } from "@mui/material";
import { Save as SaveIcon, Edit as EditIcon } from "@mui/icons-material";

interface SynopsisEditorProps {
  synopsis: string;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SynopsisEditor: React.FC<SynopsisEditorProps> = ({
  synopsis,
  isEditing,
  onEdit,
  onCancel,
  onSave,
  onChange,
}) => {
  return (
    <CardContent>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">物語の概要</Typography>
        {isEditing ? (
          <Box>
            <Button
              variant="outlined"
              size="small"
              sx={{ mr: 1 }}
              onClick={onCancel}
            >
              キャンセル
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<SaveIcon />}
              onClick={onSave}
              disabled={!synopsis.trim()}
            >
              保存
            </Button>
          </Box>
        ) : (
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditIcon />}
            onClick={onEdit}
          >
            編集
          </Button>
        )}
      </Box>

      {isEditing ? (
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            multiline
            minRows={8}
            maxRows={15}
            value={synopsis}
            onChange={onChange}
            placeholder="あなたの物語のあらすじを入力してください。主要な登場人物、設定、物語の大まかな流れを含めるとよいでしょう。"
            variant="outlined"
            autoFocus
          />
        </Box>
      ) : (
        <Box sx={{ mt: 2 }}>
          {synopsis ? (
            <Typography
              variant="body1"
              sx={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}
            >
              {synopsis}
            </Typography>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: "italic" }}
            >
              まだあらすじが入力されていません。「編集」ボタンをクリックして、物語のあらすじを追加してください。
            </Typography>
          )}
        </Box>
      )}
    </CardContent>
  );
};
