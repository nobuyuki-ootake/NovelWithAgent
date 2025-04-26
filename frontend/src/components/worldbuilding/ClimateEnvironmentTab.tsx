import React from "react";
import { Box, TextField, Typography, Divider } from "@mui/material";

interface ClimateEnvironmentTabProps {
  climate: string;
  onClimateChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  geography: string;
  onGeographyChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  flora: string;
  onFloraChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  fauna: string;
  onFaunaChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const ClimateEnvironmentTab: React.FC<ClimateEnvironmentTabProps> = ({
  climate,
  onClimateChange,
  geography,
  onGeographyChange,
  flora,
  onFloraChange,
  fauna,
  onFaunaChange,
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        気候と環境
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={3}
        label="気候"
        placeholder="季節、天候パターン、気温など気候の特徴について記述してください"
        value={climate}
        onChange={onClimateChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="地理"
        placeholder="山脈、海洋、砂漠、森林など地理的特徴について記述してください"
        value={geography}
        onChange={onGeographyChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="植物"
        placeholder="特徴的な植物、作物、森林などについて記述してください"
        value={flora}
        onChange={onFloraChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="動物"
        placeholder="固有種、家畜、野生動物などについて記述してください"
        value={fauna}
        onChange={onFaunaChange}
        variant="outlined"
        margin="normal"
      />

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 2, textAlign: "center" }}
      >
        環境設定は物語の舞台を形作り、登場人物の生活様式や文化に大きな影響を与えます。
      </Typography>
    </Box>
  );
};

export default ClimateEnvironmentTab;
