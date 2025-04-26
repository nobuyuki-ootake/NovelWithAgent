import React from "react";
import { Box, TextField, Typography } from "@mui/material";

interface SettingTabProps {
  description: string;
  onDescriptionChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  history: string;
  onHistoryChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const SettingTab: React.FC<SettingTabProps> = ({
  description,
  onDescriptionChange,
  history,
  onHistoryChange,
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        世界観の設定
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={5}
        label="世界の説明"
        placeholder="この物語の世界について説明してください"
        value={description}
        onChange={onDescriptionChange}
        variant="outlined"
        margin="normal"
      />

      <TextField
        fullWidth
        multiline
        rows={8}
        label="世界の歴史"
        placeholder="この世界の歴史的背景について記述してください"
        value={history}
        onChange={onHistoryChange}
        variant="outlined"
        margin="normal"
      />

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 2, textAlign: "center" }}
      >
        世界観の特徴や歴史的な背景を詳細に設定することで、
        物語に深みと一貫性を与えることができます。
      </Typography>
    </Box>
  );
};

export default SettingTab;
